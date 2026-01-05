import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../BharathAIStore/context/SearchContext";
import BASE_URL from "../Config";
import axios from "axios";
import Logo from "../assets/img/WhatsApp Image 2025-12-15 at 12.29.33 PM.jpeg";
import { message } from "antd";

interface StoreAgent {
  agentId: string;
  agentName: string;
  agentCreatorName?: string | null;
  agentStatus?: string | null;
  hideAgent?: boolean;
  profileImageUrl?: string | null;
  assistantId?: string | null;
}

type CampaignImage = {
  imageId?: string | null;
  imageUrl?: string | null;
  status?: boolean;
};

type CampaignBlog = {
  campaignId: string;
  campaignType?: string | null;
  campaignDescription?: string | null;
  campaignTypeAddBy?: string | null;
  campainInputType?: string | null;
  socialMediaCaption?: string | null;
  createdAt?: number | null;
  createdPersonId?: string | null;
  isCompanyBlog?: boolean;
  companyName?: string | null;
  imageUrls?: CampaignImage[];
};

interface StoreDetail {
  id: string | null;
  storeName: string;
  description: string | null;
  storeCreatedBy: string;
  storeId: string;
  status: string | null;
  storeImageUrl?: string | null;
  agentDetailsOnAdUser?: StoreAgent[];
  isCompanyStore?: boolean;
  companyName?: string | null;
}

type CompanyJob = {
  id: string;
  companyLogo?: string | null;
  jobTitle?: string | null;
  jobDesignation?: string | null;
  companyName?: string | null;
  industry?: string | null;
  jobLocations?: string | null;
  jobType?: string | null;
  experience?: string | null;
  description?: string | null;
};

type TabKey = "AGENTS" | "JOBS" | "BLOGS";

const getInitials = (name?: string | null) => {
  const t = (name || "").trim();
  if (!t) return "AI";
  const parts = t.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "AI";
};

const getHueFromName = (name?: string | null) => {
  const t = (name || "").trim();
  let hash = 0;
  for (let i = 0; i < t.length; i++) {
    hash = t.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
};

const cleanText = (t?: string | null) =>
  (t || "")
    .replace(/[#*`>-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const AllAIStore: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

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

  const storeIdFromState = (location.state as any)?.storeId || "";
  const storeIdFromQuery = new URLSearchParams(location.search).get("storeId");
  const effectiveStoreId = storeIdFromState || storeIdFromQuery || "";

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // --- Search/filter state ---
  const { debouncedQuery: q } = useSearch();
  const [searchResults, setSearchResults] = useState<StoreAgent[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const agentsSectionRef = useRef<HTMLDivElement | null>(null);
  const visibleAgents = useMemo(() => {
    return (store?.agentDetailsOnAdUser || []).filter((a) => a && !a.hideAgent);
  }, [store]);

  // --- Search/filter effect ---
  useEffect(() => {
    const term = (q || "").trim();
    if (!term) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    // Simple local filter; replace with API call if needed
    const filtered = visibleAgents.filter((agent) =>
      agent.agentName.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
    setSearchLoading(false);
  }, [q, visibleAgents]);

  // --- Auto-scroll to agent list on search, and scroll to top when search is cleared ---
  useEffect(() => {
    const term = (q || "").trim();
    if (term) {
      if (agentsSectionRef.current) {
        agentsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // If search is cleared, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [q, searchLoading]);
  const accessToken = localStorage.getItem("accessToken") || "";

  const customerId =
    localStorage.getItem("customerId") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    "";
  console.log("AccessToken:", accessToken);
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // ✅ Tabs
  const [activeTab, setActiveTab] = useState<TabKey>("AGENTS");

  const isCompanyStore =
    !!store?.isCompanyStore && !!(store?.companyName || "").trim();

  // --- Blog (Campaign) ---
  const [addBlogOpen, setAddBlogOpen] = useState(false);
  const [addBlogSubmitting, setAddBlogSubmitting] = useState(false);

  const [campaignType, setCampaignType] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [socialMediaCaption, setSocialMediaCaption] = useState("");

  const [blogImages, setBlogImages] = useState<string[]>([]);
  const [blogImageUploading, setBlogImageUploading] = useState(false);
  const [blogImageUploadError, setBlogImageUploadError] = useState<
    string | null
  >(null);

  const [blogs, setBlogs] = useState<CampaignBlog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [blogTab, setBlogTab] = useState<"ALL" | "MY">("ALL");
  const blogFileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Company jobs ---
  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // --- Add Job ---
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [addJobSubmitting, setAddJobSubmitting] = useState(false);
  const [companyContactId, setCompanyContactId] = useState<string>("");
  const [contactChecking, setContactChecking] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [locations, setLocations] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Job details modal
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CompanyJob | null>(null);

  // ✅ If store is NOT company-store, keep active tab as AGENTS
  useEffect(() => {
    if (!isCompanyStore && (activeTab === "JOBS" || activeTab === "BLOGS")) {
      setActiveTab("AGENTS");
    }
  }, [isCompanyStore, activeTab]);

  const is83GLAIStore =
    store?.storeId === "107a1eda-0458-4031-9017-3787ecd350bb";

  const isRBIStore = useMemo(() => {
    const slug = (storeSlug || "").toLowerCase();
    const name = (store?.storeName || "").toLowerCase();
    return (
      slug.includes("rbi") ||
      name.includes("rbi") ||
      slug.includes("master-directions") ||
      name.includes("master directions")
    );
  }, [storeSlug, store?.storeName]);

  // ✅ Agent Search (Agents tab)
  const [agentSearch, setAgentSearch] = useState("");

  const filteredAgents = useMemo(() => {
    const q = (agentSearch || "").trim().toLowerCase();
    if (!q) return visibleAgents;

    return visibleAgents.filter((a) => {
      const n = (a?.agentName || "").toLowerCase();
      const c = (a?.agentCreatorName || "").toLowerCase();
      return n.includes(q) || c.includes(q);
    });
  }, [visibleAgents, agentSearch]);

  const ensureCompanyContactId = useCallback(async (): Promise<string> => {
    if (!customerId) return "";

    setContactChecking(true);
    try {
      const url = `${BASE_URL}/marketing-service/campgin/get-company-contact?userId=${encodeURIComponent(
        customerId
      )}`;

      const res = await fetch(url, { headers: getAuthHeaders() });

      // ✅ If 404 → details not submitted yet
      if (res.status === 404) {
        setCompanyContact(null);
        setCompanyContactId("");
        setIsEmployeeAllowed(false);
        setContactNotFound404(true);
        return "";
      }

      if (!res.ok) throw new Error("Failed to check company contact");

      const data: any = await res.json();

      const id = (data?.id || "").toString();
      const isEmp = data?.isEmployee === true;

      setCompanyContact(data);
      setCompanyContactId(id || "");
      setIsEmployeeAllowed(isEmp);
      setContactNotFound404(false);

      return id || "";
    } catch {
      // If API fails unexpectedly, do not break UI
      setIsEmployeeAllowed(false);
      return "";
    } finally {
      setContactChecking(false);
    }
  }, [customerId, accessToken, BASE_URL]);

  useEffect(() => {
    if (!isCompanyStore) return;

    // if not logged in, do nothing (buttons will hide anyway)
    if (!accessToken || !customerId) return;

    ensureCompanyContactId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompanyStore, accessToken, customerId]);

  /** ---------------------------------------------
   * ✅ Company Verification (ONLY when user clicks the button)
   * --------------------------------------------- */
  const [companyVerifyOpen, setCompanyVerifyOpen] = useState(false);
  const [companyOtpOpen, setCompanyOtpOpen] = useState(false);
  // ✅ Company employee access (NEW)
  const [companyContact, setCompanyContact] = useState<any | null>(null);
  const [isEmployeeAllowed, setIsEmployeeAllowed] = useState<boolean>(false);
  const [contactNotFound404, setContactNotFound404] = useState<boolean>(false);

  const [companyEmailId, setCompanyEmailId] = useState("");
  const [personRole, setPersonRole] = useState("");
  const [personRoleOther, setPersonRoleOther] = useState("");

  const [otp, setOtp] = useState("");
  const [salt, setSalt] = useState("");
  const [emailOtpSession, setEmailOtpSession] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

const openWhatsappLoginWithRedirect = useCallback(() => {
  // ✅ Build redirect path that ALWAYS includes storeId in query
  const sp = new URLSearchParams(window.location.search);

  // If storeId not present in URL, inject it (because location.state will be lost after login)
  if (!sp.get("storeId") && effectiveStoreId) {
    sp.set("storeId", effectiveStoreId);
  }

  const redirectPath =
    window.location.pathname + (sp.toString() ? `?${sp.toString()}` : "");

  // ✅ Persist redirect in sessionStorage (NOT localStorage)
  sessionStorage.setItem("postLoginRedirectPath", redirectPath);

  // ✅ After login, auto-open company verification once (also sessionStorage)
  sessionStorage.setItem("openCompanyVerificationAfterLogin", "1");

  // Also pass redirect in query
  navigate(`/whatsapplogin?redirect=${encodeURIComponent(redirectPath)}`);
}, [navigate, effectiveStoreId]);


  const openCompanyVerification = useCallback(async () => {
    if (!isCompanyStore) return;

    if (!accessToken) {
      openWhatsappLoginWithRedirect();
      return;
    }

    if (!customerId) {
      message.warning("User ID not found. Please login again.");
      openWhatsappLoginWithRedirect();
      return;
    }

    // ✅ If already verified, do nothing
    const existingId = await ensureCompanyContactId();
    if (existingId) {
      return;
    }

    setCompanyEmailId("");
    setPersonRole("");
    setPersonRoleOther("");
    setOtp("");
    setSalt("");
    setEmailOtpSession("");

    setCompanyVerifyOpen(true);
  }, [
    isCompanyStore,
    accessToken,
    customerId,
    ensureCompanyContactId,
    openWhatsappLoginWithRedirect,
  ]);

useEffect(() => {
  if (!isCompanyStore) return;
  if (!accessToken) return;

  const flag = sessionStorage.getItem("openCompanyVerificationAfterLogin");
  if (flag !== "1") return;

  sessionStorage.removeItem("openCompanyVerificationAfterLogin");

  (async () => {
    const existingId = await ensureCompanyContactId();
    if (!existingId) setCompanyVerifyOpen(true);
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isCompanyStore, accessToken]);

  const sendOtpForCompanyEmployee = useCallback(async () => {
    if (sendingOtp) return;

    if (!accessToken) {
      openWhatsappLoginWithRedirect();
      return;
    }
    if (!customerId) {
      message.warning("User ID not found. Please login again.");
      return;
    }

    if (!companyEmailId.trim()) {
      message.warning("Please enter your company email ID.");
      return;
    }

    const finalRole =
      personRole === "Other" ? personRoleOther.trim() : personRole.trim();

    if (!finalRole) {
      message.error("Please select your role (or type it if Other).");
      return;
    }

    setSendingOtp(true);
    try {
      const payload: any = {
        userId: customerId,
        isEmployee: true,
        companyEmailId: companyEmailId.trim(),
        personRole: finalRole,
        companyName: (store?.companyName || "").trim() || undefined,
        name: "User",
      };

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/add-company-info`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || "Failed to send OTP");
      }

      if (!json?.salt || !json?.emailOtpSession) {
        throw new Error("OTP session not received. Please try again.");
      }

      setSalt(json.salt);
      setEmailOtpSession(json.emailOtpSession);

      message.success(json?.message || "OTP sent successfully");
      setCompanyVerifyOpen(false);
      setCompanyOtpOpen(true);
    } catch (e: any) {
      message.error(e?.message || "Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  }, [
    sendingOtp,
    accessToken,
    customerId,
    companyEmailId,
    personRole,
    personRoleOther,
    store?.companyName,
    openWhatsappLoginWithRedirect,
  ]);

  const verifyCompanyOtp = useCallback(async () => {
    if (verifyingOtp) return;

    if (!accessToken) {
      openWhatsappLoginWithRedirect();
      return;
    }
    if (!customerId) {
      message.warning("User ID not found. Please login again.");
      return;
    }

    if (!otp.trim()) {
      message.error("Please enter OTP.");
      return;
    }
    if (!salt || !emailOtpSession) {
      message.error("OTP session missing. Please resend OTP.");
      return;
    }

    const finalRole =
      personRole === "Other" ? personRoleOther.trim() : personRole.trim();
    if (!finalRole) {
      message.error("Role missing. Please go back and select role.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const payload: any = {
        userId: customerId,
        isEmployee: true,
        companyEmailId: companyEmailId.trim(),
        personRole: finalRole,
        companyName: (store?.companyName || "").trim() || undefined,
        name: "User",
        otp: otp.trim(),
        salt,
        emailOtpSession,
      };

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/add-company-info`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || "OTP verification failed");
      }

      message.success(json?.message || "Company verification completed");
      setCompanyOtpOpen(false);

      // refresh contact id
      await ensureCompanyContactId();
    } catch (e: any) {
      message.error(e?.message || "OTP verification failed. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  }, [
    verifyingOtp,
    accessToken,
    customerId,
    otp,
    salt,
    emailOtpSession,
    companyEmailId,
    personRole,
    personRoleOther,
    store?.companyName,
    ensureCompanyContactId,
    openWhatsappLoginWithRedirect,
  ]);

  const fetchCompanyJobs = async (companyName: string) => {
    const name = (companyName || "").trim();
    if (!name) {
      setCompanyJobs([]);
      setJobsError(null);
      return;
    }

    setJobsLoading(true);
    setJobsError(null);

    try {
      const url = `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=${encodeURIComponent(
        name
      )}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to load jobs");

      const json = await res.json();
      const jobs: CompanyJob[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];
      setCompanyJobs(jobs);
    } catch (e: any) {
      setCompanyJobs([]);
      setJobsError(e?.message || "Failed to load jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    setBlogsError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`,
        { method: "GET", headers: getAuthHeaders() }
      );

      if (!res.ok) throw new Error("Failed to load blogs");

      const json = await res.json();
      const list: CampaignBlog[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const onlyBlogs = list.filter((x) => {
        const inputType = (x?.campainInputType || "").toUpperCase();
        const isBlog = inputType === "BLOG";

        const isCompanyBlog = x?.isCompanyBlog === true;
        const sameCompany =
          (x?.companyName || "").trim().toLowerCase() ===
          (store?.companyName || "").trim().toLowerCase();

        return isBlog && isCompanyBlog && sameCompany;
      });

      onlyBlogs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setBlogs(onlyBlogs);
    } catch (e: any) {
      setBlogs([]);
      setBlogsError(e?.message || "Failed to load blogs");
    } finally {
      setBlogsLoading(false);
    }
  }, [BASE_URL, accessToken, store?.companyName]);

  useEffect(() => {
    if (isCompanyStore) fetchBlogs();
  }, [fetchBlogs, isCompanyStore]);

  const visibleBlogs = useMemo(() => {
    if (blogTab === "MY") {
      return blogs.filter(
        (b) => (b.createdPersonId || "").toString() === (customerId || "")
      );
    }
    return blogs;
  }, [blogs, blogTab, customerId]);

  const fetchStoreDetails = async (idOrSlug: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAiStoreAllAgents`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) throw new Error("Failed to load store details");

      const json = await res.json();
      const list: StoreDetail[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const key = (idOrSlug || "").trim();

      // ✅ Find by storeId OR storeName/slug match
      const found =
        list.find((s: any) => s?.storeId === key) ||
        list.find(
          (s: any) =>
            (s?.storeName || "").trim().toLowerCase() === key.toLowerCase()
        ) ||
        list.find(
          (s: any) =>
            (s?.storeName || "").trim().toLowerCase() ===
            (storeSlug || "").trim().toLowerCase()
        );

      if (!found) throw new Error("Store not found");

      setStore(found);

      // ✅ If URL missing storeId, inject it (so redirect/refresh never breaks again)
      const sp = new URLSearchParams(window.location.search);
      if (!sp.get("storeId") && found?.storeId) {
        sp.set("storeId", found.storeId);
        navigate(`${window.location.pathname}?${sp.toString()}`, {
          replace: true,
        });
      }

      if (found?.isCompanyStore && (found?.companyName || "").trim()) {
        fetchCompanyJobs(found.companyName as string);
      } else {
        setCompanyJobs([]);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ If storeId is missing (common after login redirect), fallback to storeSlug
    const key = effectiveStoreId || storeSlug || "";
    if (key) fetchStoreDetails(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStoreId, storeSlug]);

  // ---------- Upload Blog Images ----------
  const uploadBlogImage = async (file: File) => {
    if (!file) return;

    const uploadId = "45880e62-acaf-4645-a83e-d1c8498e923e";
    const fileType = "aadhar";

    setBlogImageUploadError(null);
    setBlogImageUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await axios.post(
        `${BASE_URL}/upload-service/upload?id=${uploadId}&fileType=${fileType}`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const documentPath = response?.data?.documentPath;
      if (!documentPath)
        throw new Error("Upload successful but documentPath missing");

      setBlogImages((prev) =>
        Array.from(new Set([...prev, documentPath].filter(Boolean)))
      );
    } catch (error: any) {
      setBlogImageUploadError(
        error?.response?.data?.message || "Image upload failed"
      );
    } finally {
      setBlogImageUploading(false);
    }
  };

  const removeBlogImageAt = (index: number) => {
    setBlogImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Add Blog ----------
  const submitAddBlog = useCallback(async () => {
    if (addBlogSubmitting) return;

    if (!accessToken) {
      message.warning("Please login to add a blog.");
      return;
    }

    if (!campaignType.trim()) {
      message.warning("Please enter Campaign Type.");
      return;
    }

    if (!campaignDescription.trim()) {
      message.warning("Please enter Campaign Description.");
      return;
    }

    setAddBlogSubmitting(true);
    try {
      const companyNameForCampaign =
        store?.isCompanyStore && (store?.companyName || "").trim()
          ? (store?.companyName || "").trim()
          : undefined;

      const payload = {
        askOxyCampaignDto: [
          {
            addServiceType: "BLOG",
            campaignDescription: campaignDescription.trim(),
            campaignId: null,
            campaignStatus: true,
            campaignType: campaignType.trim(),
            campaignTypeAddBy: customerId || "USER",
            campainInputType: "BLOG",
            createdPersonId: customerId || null,
            isCompanyBlog: !!store?.isCompanyStore,
            companyName: store?.isCompanyStore
              ? companyNameForCampaign
              : undefined,
            images: blogImages.map((url) => ({
              imageId: null,
              imageUrl: url,
              status: true,
            })),
            socialMediaCaption: socialMediaCaption.trim(),
          },
        ],
      };

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/addCampaignTypes`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to add blog");

      message.success(json?.message || "Blog added successfully");
      setAddBlogOpen(false);

      setCampaignType("");
      setCampaignDescription("");
      setSocialMediaCaption("");
      setBlogImages([]);

      fetchBlogs();
      setActiveTab("BLOGS");
    } catch (e: any) {
      message.error(e?.message || "Failed to add blog");
    } finally {
      setAddBlogSubmitting(false);
    }
  }, [
    addBlogSubmitting,
    accessToken,
    campaignType,
    campaignDescription,
    socialMediaCaption,
    blogImages,
    store?.isCompanyStore,
    store?.companyName,
    customerId,
    fetchBlogs,
  ]);

  // ---------- Add Job ----------
  const openAddJobModal = useCallback(async () => {
    if (!accessToken) {
      openWhatsappLoginWithRedirect();
      return;
    }

    if (!customerId) {
      message.warning("User ID not found. Please login again.");
      openWhatsappLoginWithRedirect();
      return;
    }

    await ensureCompanyContactId();

    if (!isEmployeeAllowed) {
      message.warning(
        `Only employees of ${
          store?.companyName || "this company"
        } can add jobs. Please verify first.`
      );
      setCompanyVerifyOpen(true);
      return;
    }

    setJobTitle("");
    setIndustry("");
    setExperience("");
    setLocations("");
    setJobDescription("");

    setAddJobOpen(true);
  }, [
    accessToken,
    customerId,
    ensureCompanyContactId,
    isEmployeeAllowed,
    store?.companyName,
    openWhatsappLoginWithRedirect,
  ]);

  const submitAddJob = useCallback(async () => {
    if (addJobSubmitting) return;

    const ccId = companyContactId || (await ensureCompanyContactId());
    if (!ccId) {
      message.warning(
        "Company contact person ID not found. Please complete company verification first."
      );
      return;
    }

    if (!customerId) {
      message.warning("User ID not found. Please login again.");
      return;
    }

    if (!jobTitle.trim()) {
      message.warning("Please enter Job Title.");
      return;
    }

    setAddJobSubmitting(true);
    try {
      const payload: any = {
        companyContactPersonId: ccId,
        description: jobDescription.trim(),
        experience: experience.trim(),
        industry: industry.trim(),
        jobTitle: jobTitle.trim(),
        locations: locations.trim(),
        userId: customerId,
        companyName: (store?.companyName || "").trim() || undefined,
      };

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/add-job-company-person`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to add job");

      message.success(json?.message || "Job added successfully");
      setAddJobOpen(false);

      if (store?.companyName) fetchCompanyJobs(store.companyName);
      setActiveTab("JOBS");
    } catch (e: any) {
      message.error(e?.message || "Failed to add job");
    } finally {
      setAddJobSubmitting(false);
    }
  }, [
    addJobSubmitting,
    companyContactId,
    customerId,
    jobTitle,
    industry,
    experience,
    locations,
    jobDescription,
    store?.companyName,
    ensureCompanyContactId,
  ]);

  const openJobDetails = (job: CompanyJob) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  // ---------- UI helpers ----------
  const tabBtn = (key: TabKey, label: string, enabled = true) => {
    const active = activeTab === key;
    return (
      <button
        type="button"
        onClick={() => enabled && setActiveTab(key)}
        disabled={!enabled}
        className={[
          "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-all",
          active
            ? "bg-violet-700 text-white border-violet-700 shadow-sm"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
          !enabled ? "opacity-50 cursor-not-allowed hover:bg-white" : "",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  const companyRestrictionText = store?.companyName
    ? `Only employees associated with ${store.companyName} can perform this action from this page.`
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading && <div className=" p-8 text-slate-700">Loading store…</div>}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && store && (
          <>
            {/* Back Button */}
            <button
              onClick={() => navigate("/all-ai-stores")}
              className="inline-flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 text-base font-medium text-gray-700 shadow-lg hover:scale-105 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All AI Stores
            </button>

            {isCompanyStore && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
                  <span className="text-lg">🏢</span>
                  <span className="font-semibold">Company Store:</span>
                  <span className="font-bold">{store.companyName}</span>

                  {isEmployeeAllowed ? (
                    <span className="ml-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Employee Verified
                    </span>
                  ) : (
                    <span className="ml-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      Verification Needed
                    </span>
                  )}
                </div>

                {!isEmployeeAllowed && (
                  <button
                    type="button"
                    onClick={() => setCompanyVerifyOpen(true)}
                    className="inline-flex items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-violet-800"
                  >
                    Are you {store.companyName} Employee?
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 w-full">
              {/* ✅ 83GLAI special hero with Logo */}
              {is83GLAIStore ? (
                <section className="relative overflow-hidden">
                  <div className="relative p-5 sm:p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
                      {/* LEFT: Title + Paragraph */}
                      <div className="max-w-4xl">
                        <h1 className="mt-1 text-xl sm:text-xl lg:text-1xl font-extrabold text-gray-900">
                          #83GLAI-Global Lending is Evolving. AI Will Lead the
                          Change.
                        </h1>

                        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                          Lending is being redefined globally — across lending
                          infrastructure, co-lending, open lending, digital
                          lending platforms, and AI-driven lending engines. AI
                          is no longer optional; it is becoming the core of
                          modern lending systems.
                        </p>
                      </div>

                      {/* RIGHT: Logo (FULL image, no crop) */}
                      <div className="flex justify-start lg:justify-end">
                        <div className="h-28 w-72 sm:h-28 sm:w-72 lg:h-32 lg:w-80 overflow-hidden p-2 flex items-center justify-center">
                          {!!store?.storeImageUrl ? (
                            <div className="flex justify-start lg:justify-end">
                              <div className="h-28 w-72 sm:h-28 sm:w-72 lg:h-32 lg:w-80 overflow-hidden p-2 flex items-center justify-center">
                                <img
                                  src={Logo}
                                  alt="ASKOXY.AI"
                                  className="h-full w-full object-contain" // ✅ no crop
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500">
                              Logo missing (storeImageUrl not available)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : isRBIStore ? (
                <section className="relative overflow-hidden px-4 py-6 sm:px-8 sm:py-8 ">
                  {/* Soft gradient glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-60">
                    <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-violet-100 blur-3xl" />
                    <div className="absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-purple-100 blur-3xl" />
                  </div>

                  <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left: Text content */}
                    <div className="max-w-3xl text-left">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
                        RBI Master Directions AI Store
                      </h1>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3">
                        India’s financial ecosystem includes more than{" "}
                        <span className="font-semibold text-violet-800">
                          15,000 regulated institutions
                        </span>
                        , with around{" "}
                        <span className="font-semibold text-violet-800">
                          9,000 NBFCs
                        </span>{" "}
                        and nearly{" "}
                        <span className="font-semibold text-violet-800">
                          6,000 banks and cooperative entities
                        </span>
                        . All of these are governed by the Reserve Bank of India
                        through{" "}
                        <span className="font-semibold text-violet-800">
                          243 Master Directions
                        </span>{" "}
                        covering operations, compliance, payments, customer
                        protection, and credit systems.
                      </p>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3">
                        This AI Store gives you a{" "}
                        <span className="font-semibold text-violet-800">
                          single intelligent window
                        </span>{" "}
                        to explore and understand all these RBI guidelines with
                        ease.
                      </p>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                        If you want information specific to a{" "}
                        <span className="font-semibold">commercial bank</span>,
                        you can explore the{" "}
                        <span className="font-semibold text-violet-800">
                          Commercial Bank Master Directions AI
                        </span>
                        ; if your query is about{" "}
                        <span className="font-semibold">
                          credit information
                        </span>
                        , you can rely on the{" "}
                        <span className="font-semibold text-violet-800">
                          CIC Master Directions AI
                        </span>
                        , and so on.
                      </p>

                      {/* CTA row */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/asst_NlzUyaK4szAq70HguzMMYhXm/89d37f65-83ba-4ca3-a744-732cbc473ead/master-directions-complianceai`,
                              {
                                state: {
                                  fromStore: {
                                    storeId: effectiveStoreId,
                                    storeSlug,
                                    storeName: store?.storeName,
                                  },
                                },
                              }
                            );
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:from-violet-700 hover:to-purple-700 hover:shadow-xl transition-all"
                        >
                          Explore RBI Master Directions AI
                        </button>
                      </div>
                    </div>

                    {/* Right: Premium Highlight Card */}
                    <div className="mt-6 lg:mt-0 lg:w-72 xl:w-80 hidden md:block">
                      <div className="relative rounded-2xl backdrop-blur-xl bg-white/60 border border-violet-200 shadow-xl p-5 overflow-hidden">
                        {/* Glow Effects */}
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                          <div className="absolute -top-8 -right-8 h-24 w-24 bg-violet-300 rounded-full blur-3xl" />
                          <div className="absolute -bottom-10 -left-10 h-28 w-28 bg-purple-300 rounded-full blur-3xl" />
                        </div>

                        <p className="relative text-sm font-bold uppercase tracking-wider text-violet-700 mb-3">
                          At a Glance
                        </p>

                        <ul className="relative space-y-3 text-sm text-gray-800 font-medium">
                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">📘</span>
                            11 Major Regulatory Focus Areas
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">📜</span>
                            243 RBI Master Directions
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">🏦</span>
                            Banks, NBFCs & Co-operatives Covered
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">🤖</span>
                            AI Agents Answer Your Compliance Queries
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <div className="text-left">
                  <h1 className="text-3xl sm:text-3xl font-black text-gray-900 mb-3">
                    {store.storeName}
                  </h1>
                  {store.description && (
                    <p className="text-lg text-gray-600 max-w-4xl leading-relaxed">
                      {store.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ✅ Single Row – No Background, Mobile Friendly */}
            <div className="sticky top-0 z-10 mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar">
                {/* Tabs */}
                {tabBtn("AGENTS", "Explore AI Agents", true)}
                {isCompanyStore && tabBtn("JOBS", "Jobs", true)}
                {isCompanyStore && tabBtn("BLOGS", "Blogs", true)}

                {/* Add buttons (ONLY if employee verified) */}
                {isCompanyStore && isEmployeeAllowed && (
                  <>
                    <button
                      type="button"
                      onClick={() => setAddBlogOpen(true)}
                      className="whitespace-nowrap rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:scale-95"
                    >
                      + Add Blog
                    </button>

                    <button
                      type="button"
                      onClick={openAddJobModal}
                      disabled={contactChecking}
                      className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 disabled:opacity-60"
                    >
                      {contactChecking ? "Checking..." : "+ Add Job"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ✅ TAB PANELS */}
            <div className="mt-6">
              {/* ---------- AGENTS TAB ---------- */}
              {activeTab === "AGENTS" && (
                <section>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                      AI Agents
                    </h2>
                  </div>

                  {/* --- Search-aware agent rendering --- */}
                  <div ref={agentsSectionRef} />
                  {(
                    (q || "").trim()
                      ? (searchResults ?? []).length === 0
                      : visibleAgents.length === 0
                  ) ? (
                    <div className="text-center py-20 text-gray-500">
                      <p className="text-2xl font-medium">
                        {searchLoading
                          ? "Searching…"
                          : (q || "").trim()
                          ? "No agents found"
                          : "No agents available yet"}
                      </p>
                      {searchError && (
                        <p className="mt-2 text-red-500">{searchError}</p>
                      )}
                      {!(q || "").trim() && (
                        <p className="mt-2">Check back soon!</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {((q || "").trim()
                        ? searchResults ?? []
                        : visibleAgents
                      ).map((agent) => {
                        const hasValidImage =
                          agent.profileImageUrl &&
                          agent.profileImageUrl.trim() !== "" &&
                          agent.profileImageUrl !== "null";

                        const hue = getHueFromName(agent.agentName);
                        const bgGradient = `linear-gradient(135deg,
                    hsl(${hue}, 75%, 55%) 0%,
                    hsl(${(hue + 30) % 360}, 75%, 50%) 50%,
                    hsl(${(hue + 60) % 360}, 75%, 45%) 100%)`;

                        return (
                          <div
                            key={agent.agentId}
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              navigate(
                                `/${agent.assistantId}/${agent.agentId}/${agent.agentName}`,
                                {
                                  state: {
                                    storeId: effectiveStoreId,
                                    storeSlug,
                                    storeName: store?.storeName,
                                  },
                                }
                              )
                            }
                            className="group relative cursor-pointer rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100 active:scale-[0.99]"
                          >
                            {/* ✅ TOP IMAGE BOX (Rounded on ALL 4 corners) */}
                            <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                              <div className="relative h-40 w-full sm:h-44">
                                {/* Gradient Base */}
                                <div
                                  className="absolute inset-0 flex items-center justify-center text-white font-black"
                                  style={{ background: bgGradient }}
                                >
                                  <span className="text-6xl opacity-40">
                                    {getInitials(agent.agentName)}
                                  </span>
                                </div>

                                {/* Image on top if valid */}
                                {hasValidImage && (
                                  <img
                                    src={agent.profileImageUrl!}
                                    alt={agent.agentName}
                                    className="relative z-10 h-full w-full object-cover bg-white"
                                    loading="lazy"
                                    onError={(e) => {
                                      (
                                        e.currentTarget as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                )}

                                {/* ✅ Small badge */}
                                <div className="absolute right-3 top-3 z-20 rounded-full bg-black/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                                  {getInitials(agent.agentName)} AGENT
                                </div>
                              </div>
                            </div>

                            {/* ✅ Content */}
                            <div className="flex flex-col px-2 pb-2 pt-4">
                              <h3 className="line-clamp-2 text-[16px] font-extrabold text-slate-900 group-hover:text-violet-700">
                                {agent.agentName}
                              </h3>

                              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                {agent.agentCreatorName
                                  ? `Created by ${agent.agentCreatorName}`
                                  : ""}
                              </p>

                              {/* ✅ Creator row */}
                              <div className="mt-4 flex items-center gap-3">
                                {hasValidImage ? (
                                  <img
                                    src={agent.profileImageUrl!}
                                    alt={agent.agentName}
                                    className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      (
                                        e.currentTarget as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-white font-bold"
                                    style={{ background: bgGradient }}
                                  >
                                    {getInitials(agent.agentName)}
                                  </div>
                                )}

                                <span className="text-sm font-semibold text-slate-700 truncate">
                                  {agent.agentCreatorName || "ASKOXY.AI TEAM"}
                                </span>
                              </div>

                              {/* ✅ CTA */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/${agent.assistantId}/${agent.agentId}/${agent.agentName}`,
                                    {
                                      state: {
                                        fromStore: {
                                          storeId: effectiveStoreId,
                                          storeSlug,
                                          storeName: store?.storeName,
                                        },
                                      },
                                    }
                                  );
                                }}
                                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-95"
                              >
                                View Agent
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* ---------- JOBS TAB ---------- */}
              {isCompanyStore && activeTab === "JOBS" && (
                <section>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Jobs
                  </h2>

                  {!isCompanyStore && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                      Jobs are available only for company stores.
                    </div>
                  )}

                  {isCompanyStore && (
                    <>
                      {jobsLoading && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                          Loading jobs…
                        </div>
                      )}

                      {jobsError && !jobsLoading && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                          {jobsError}
                        </div>
                      )}

                      {!jobsLoading &&
                        !jobsError &&
                        companyJobs.length === 0 && (
                          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                            No jobs found for this company.
                          </div>
                        )}

                      {!jobsLoading && !jobsError && companyJobs.length > 0 && (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {companyJobs.map((job) => {
                            const title =
                              job.jobTitle || job.jobDesignation || "Job";
                            const initials = getInitials(title);
                            const hue = getHueFromName(title);
                            const banner = `linear-gradient(135deg,
                              hsl(${hue}, 75%, 55%) 0%,
                              hsl(${(hue + 30) % 360}, 75%, 50%) 50%,
                              hsl(${(hue + 60) % 360}, 75%, 45%) 100%)`;

                            const showLogo =
                              job.companyLogo &&
                              typeof job.companyLogo === "string" &&
                              job.companyLogo.trim() !== "" &&
                              job.companyLogo.trim().toLowerCase() !== "null";

                            return (
                              <div
                                key={job.id}
                                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100 active:scale-[0.99] min-h-[420px]"
                              >
                                <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                                  <div
                                    className="relative h-44 w-full flex items-center justify-center"
                                    style={{ background: banner }}
                                  >
                                    <span className="text-7xl font-black text-white/35">
                                      {initials}
                                    </span>
                                    <div className="absolute right-3 top-3 rounded-full bg-black/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                                      {initials}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                                  <div className="flex-1">
                                    <h3 className="line-clamp-2 text-[16px] font-extrabold text-slate-900 transition-colors group-hover:text-violet-700">
                                      {title}
                                    </h3>

                                    <div className="mt-4 flex items-center gap-3">
                                      {showLogo ? (
                                        <img
                                          src={job.companyLogo as string}
                                          alt="logo"
                                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                                          onError={(e) =>
                                            ((
                                              e.currentTarget as HTMLImageElement
                                            ).style.display = "none")
                                          }
                                        />
                                      ) : (
                                        <div
                                          className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-white font-bold"
                                          style={{ background: banner }}
                                        >
                                          {getInitials(
                                            job.companyName || store.companyName
                                          )}
                                        </div>
                                      )}

                                      <span className="text-sm font-semibold text-slate-700 truncate">
                                        {job.companyName ||
                                          store.companyName ||
                                          "-"}
                                      </span>
                                    </div>

                                    <div className="mt-3 min-h-[44px] flex flex-wrap gap-2 text-xs">
                                      {job.jobLocations && (
                                        <span className="rounded-full bg-slate-100 px-2 py-1">
                                          📍 {job.jobLocations}
                                        </span>
                                      )}
                                      {job.jobType && (
                                        <span className="rounded-full bg-slate-100 px-2 py-1">
                                          💼 {job.jobType}
                                        </span>
                                      )}
                                      {job.experience && (
                                        <span className="rounded-full bg-slate-100 px-2 py-1">
                                          ⏳ {job.experience}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-auto pt-4">
                                    <button
                                      type="button"
                                      onClick={() => openJobDetails(job)}
                                      className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-95"
                                    >
                                      View Job
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* ---------- BLOGS TAB ---------- */}
              {isCompanyStore && activeTab === "BLOGS" && (
                <section>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                      Blogs
                    </h2>

                    {isCompanyStore && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBlogTab("ALL")}
                          className={`rounded-full px-4 py-2 text-sm font-semibold border ${
                            blogTab === "ALL"
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          All Blogs
                        </button>

                        <button
                          type="button"
                          onClick={() => setBlogTab("MY")}
                          className={`rounded-full px-4 py-2 text-sm font-semibold border ${
                            blogTab === "MY"
                              ? "bg-violet-700 text-white border-violet-700"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          My Blogs
                        </button>
                      </div>
                    )}
                  </div>

                  {!isCompanyStore && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                      Blogs are available only for company stores.
                    </div>
                  )}

                  {isCompanyStore && (
                    <>
                      {blogsLoading && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                          Loading blogs…
                        </div>
                      )}

                      {blogsError && !blogsLoading && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                          {blogsError}
                        </div>
                      )}

                      {!blogsLoading &&
                        !blogsError &&
                        visibleBlogs.length === 0 && (
                          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                            No blogs found.
                          </div>
                        )}

                      {!blogsLoading &&
                        !blogsError &&
                        visibleBlogs.length > 0 && (
                          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleBlogs.map((b) => {
                              const firstImg =
                                b.imageUrls?.find((x) => x?.imageUrl)
                                  ?.imageUrl || "";
                              return (
                                <div
                                  key={b.campaignId}
                                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all"
                                >
                                  <div className="h-36 w-full bg-slate-100 overflow-hidden">
                                    {firstImg ? (
                                      <img
                                        src={firstImg}
                                        alt="blog"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold">
                                        NO IMAGE
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-1 flex-col p-4">
                                    <div className="text-sm font-extrabold text-slate-900 line-clamp-2 group-hover:text-violet-700">
                                      {b.campaignType || "Blog"}
                                    </div>

                                    <div className="mt-2 text-xs text-slate-600 line-clamp-3">
                                      {cleanText(b.campaignDescription) || "—"}
                                    </div>

                                    <div className="mt-3 text-xs font-semibold text-slate-600">
                                      By: {b.campaignTypeAddBy || "—"}
                                    </div>

                                    <div className="mt-auto pt-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (firstImg)
                                            window.open(firstImg, "_blank");
                                        }}
                                        className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-violet-200 active:scale-95"
                                      >
                                        View
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </>
                  )}
                </section>
              )}
            </div>
          </>
        )}

        {/* ✅ Add Job Modal */}
        {addJobOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => !addJobSubmitting && setAddJobOpen(false)}
            />
            <div className="relative w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-lg font-black text-slate-900">Add Job</div>
                <button
                  type="button"
                  onClick={() => setAddJobOpen(false)}
                  disabled={addJobSubmitting}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                >
                  Close
                </button>
              </div>

              {store?.companyName && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <strong>Note:</strong> Only employees associated with{" "}
                  <span className="font-semibold">{store.companyName}</span> can
                  add job postings from this page.
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Java Developer"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Industry
                  </label>
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., IT Services"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Experience
                  </label>
                  <input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 2-5 years"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Locations
                  </label>
                  <input
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    placeholder="e.g., Hyderabad, Bengaluru"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Job description..."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddJobOpen(false)}
                  disabled={addJobSubmitting}
                  className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitAddJob}
                  disabled={addJobSubmitting}
                  className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
                >
                  {addJobSubmitting ? "Saving..." : "Save Job"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Job Details Modal */}
        {jobDetailsOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setJobDetailsOpen(false)}
            />
            <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {selectedJob.jobTitle ||
                      selectedJob.jobDesignation ||
                      "Job"}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">
                    {selectedJob.companyName || store?.companyName || "-"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setJobDetailsOpen(false)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {selectedJob.jobLocations && (
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    📍 {selectedJob.jobLocations}
                  </span>
                )}
                {selectedJob.jobType && (
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    💼 {selectedJob.jobType}
                  </span>
                )}
                {selectedJob.experience && (
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    ⏳ {selectedJob.experience}
                  </span>
                )}
                {selectedJob.industry && (
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    🏢 {selectedJob.industry}
                  </span>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900 mb-2">
                  Description
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap">
                  {cleanText(selectedJob.description) || "No description."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Add Blog Modal */}
        {addBlogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => !addBlogSubmitting && setAddBlogOpen(false)}
            />
            <div className="relative w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-lg font-black text-slate-900">
                  Add Blog
                </div>
                <button
                  type="button"
                  onClick={() => setAddBlogOpen(false)}
                  disabled={addBlogSubmitting}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                >
                  Close
                </button>
              </div>

              {store?.companyName && (
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  <strong>Note:</strong> Only employees of{" "}
                  <span className="font-semibold">{store.companyName}</span> are
                  allowed to publish blogs from this page.
                </div>
              )}

              <div className="grid gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Campaign Type <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    placeholder="e.g., New Year Offer"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Write blog description..."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Social Media Caption
                  </label>
                  <textarea
                    value={socialMediaCaption}
                    onChange={(e) => setSocialMediaCaption(e.target.value)}
                    placeholder="Caption for WhatsApp/Instagram/LinkedIn..."
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Blog Image (optional)
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={blogFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const inputEl = e.target as HTMLInputElement;
                        const files = Array.from(inputEl.files || []);
                        inputEl.value = "";
                        files.forEach((f) => uploadBlogImage(f));
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => blogFileInputRef.current?.click()}
                      disabled={blogImageUploading}
                      className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                      {blogImageUploading ? "Uploading..." : "Upload Image"}
                    </button>
                  </div>

                  {blogImageUploadError && (
                    <div className="mt-2 text-sm text-red-600">
                      {blogImageUploadError}
                    </div>
                  )}

                  {blogImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {blogImages.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                        >
                          <img
                            src={url}
                            alt={`Blog ${idx + 1}`}
                            className="h-20 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeBlogImageAt(idx)}
                            className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-bold text-white hover:bg-black"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddBlogOpen(false)}
                  disabled={addBlogSubmitting}
                  className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitAddBlog}
                  disabled={addBlogSubmitting}
                  className="rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
                >
                  {addBlogSubmitting ? "Saving..." : "Save Blog"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Company Verification Modal */}
      {companyVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCompanyVerifyOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-black text-slate-900">
                  Company Verification
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Verify that you are an employee of{" "}
                  <span className="font-bold text-violet-700">
                    {store?.companyName}
                  </span>
                  .
                </div>
              </div>
              <button
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                onClick={() => setCompanyVerifyOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 text-sm font-bold text-slate-700">
                  Company Email ID
                </div>
                <input
                  value={companyEmailId}
                  onChange={(e) => setCompanyEmailId(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-slate-700">
                  Your Role
                </div>
                <select
                  value={personRole}
                  onChange={(e) => setPersonRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="">Select role</option>
                  {PERSON_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                {personRole === "Other" && (
                  <input
                    value={personRoleOther}
                    onChange={(e) => setPersonRoleOther(e.target.value)}
                    placeholder="Type your role"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={sendOtpForCompanyEmployee}
                disabled={sendingOtp}
                className={[
                  "w-full rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg",
                  sendingOtp
                    ? "bg-slate-400"
                    : "bg-violet-700 hover:bg-violet-800",
                ].join(" ")}
              >
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="text-xs text-slate-500">
                We will send an OTP to your company email for verification.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Company OTP Modal */}
      {companyOtpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCompanyOtpOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-black text-slate-900">
                  Verify OTP
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Enter the OTP sent to{" "}
                  <span className="font-bold text-violet-700">
                    {companyEmailId}
                  </span>
                  .
                </div>
              </div>
              <button
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                onClick={() => setCompanyOtpOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />

              <button
                type="button"
                onClick={verifyCompanyOtp}
                disabled={verifyingOtp}
                className={[
                  "w-full rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg",
                  verifyingOtp
                    ? "bg-slate-400"
                    : "bg-emerald-600 hover:bg-emerald-700",
                ].join(" ")}
              >
                {verifyingOtp ? "Verifying..." : "Verify & Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompanyOtpOpen(false);
                  setCompanyVerifyOpen(true);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Change Email / Role
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AllAIStore;
