import React, {
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Forward,
  LogIn,
  ListFilter,
  MessageCircle,
  Lightbulb,
  Plus,
  Pencil,
  Reply,
  Search,
  Sparkles,
  Send,
  SlidersHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UserCircle,
  Rocket,
  X,
} from "lucide-react";

import communityImage from "../../assets/img/community.png";
import askoxyLogo from "../../assets/img/askoxylogonew.png";
import {
  CommunityCategoryItem,
  CommunityComment,
  CommunityQuery,
  ReactionType,
  CommunitySort,
  CreateQueryPayload,
  addComment,
  createQuery,
  deleteComment,
  deleteQuery,
  getComments,
  getCommunityCategories,
  getErrorMessage,
  getQueries,
  getQueryById,
  reactToComment,
  reactToQuery,
  replyToComment,
  updateComment,
  updateQuery,
} from "./communityApi";
import {
  getCategoryLabel,
  getQueryCategoryLabel,
} from "./communityCategories";

type QueryFormValues = Omit<CreateQueryPayload, "categoryId"> & {
  categoryId: number | "";
};

const emptyQuery: QueryFormValues = {
  categoryId: "",
  question: "",
  description: "",
  otherCategoryName: "",
};

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5b2d90] px-4 text-sm font-bold text-white transition hover:bg-[#47216f] disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#5b2d90] disabled:cursor-not-allowed disabled:opacity-50";

const actionButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#5b2d90] sm:text-sm";

const readStoredId = (raw: string | null): string | undefined => {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string" || typeof parsed === "number") {
      return String(parsed);
    }
    if (parsed && typeof parsed === "object") {
      const value =
        parsed.userId ?? parsed.id ?? parsed.customerId ?? parsed.user_id;
      return value === undefined || value === null ? undefined : String(value);
    }
  } catch {
    return raw.trim() || undefined;
  }

  return undefined;
};

const getCurrentUserId = () =>
  readStoredId(localStorage.getItem("userId")) ||
  readStoredId(localStorage.getItem("USER_ID")) ||
  readStoredId(localStorage.getItem("customerId")) ||
  readStoredId(sessionStorage.getItem("userId"));

const isOwner = (ownerId: unknown, currentUserId?: string) =>
  Boolean(
    currentUserId &&
      ownerId !== undefined &&
      ownerId !== null &&
      String(ownerId) === String(currentUserId),
  );

const initials = (name?: string) =>
  (name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

const isVerified = (badge?: string | null) =>
  badge === "ADMIN_VERIFIED" || badge === "EMPLOYEE_VERIFIED";

const badgeLabel = (badge?: string | null, profileName?: string) => {
  if (badge === "ADMIN_VERIFIED") return "Admin";
  if (badge === "EMPLOYEE_VERIFIED") return "Employee";
  return profileName?.trim() || "Community User";
};

const timeAgo = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSavedProfileName = (): string => {
  const possibleValues = [
    localStorage.getItem("profileData"),
    localStorage.getItem("userData"),
    localStorage.getItem("customerData"),
  ];

  for (const raw of possibleValues) {
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string" && parsed.trim()) return parsed.trim();

      if (parsed && typeof parsed === "object") {
        const fullName = [
          parsed.userFirstName || parsed.firstName,
          parsed.userLastName || parsed.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (fullName) return fullName;
        if (typeof parsed.name === "string" && parsed.name.trim()) {
          return parsed.name.trim();
        }
      }
    } catch {
      // Ignore invalid stored profile values.
    }
  }

  return "Community User";
};

const readCommunityToken = (): string | null => {
  const keys = [
    "token",
    "accessToken",
    "access_token",
    "authToken",
    "jwtToken",
    "userToken",
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string" && parsed.trim()) return parsed.trim();
      if (parsed && typeof parsed === "object") {
        const token =
          parsed.accessToken ||
          parsed.access_token ||
          parsed.token ||
          parsed.authToken ||
          parsed.jwtToken ||
          parsed.userToken;
        if (typeof token === "string" && token.trim()) return token.trim();
      }
    } catch {
      return raw.trim();
    }
  }

  return null;
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUserId = getCurrentUserId();
  const accessToken = readCommunityToken();
  const isRegistered = Boolean(currentUserId && accessToken);
  const savedProfileName = getSavedProfileName();

  const [queries, setQueries] = useState<CommunityQuery[]>([]);
  const [communityCategories, setCommunityCategories] = useState<CommunityCategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<CommunityQuery | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<CommunitySort>("LATEST");
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [editingQuery, setEditingQuery] = useState<CommunityQuery | null>(null);
  const [queryForm, setQueryForm] = useState<QueryFormValues>(emptyQuery);
  const [savingQuery, setSavingQuery] = useState(false);
  const [formError, setFormError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showMyQueriesOnly, setShowMyQueriesOnly] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2200);
  }, []);

  const loadCommunityCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError("");

    try {
      const result = await getCommunityCategories();
      setCommunityCategories(result);
      setQueryForm((current) => ({
        ...current,
        categoryId: current.categoryId || result[0]?.id || "",
      }));
    } catch (err) {
      setCategoriesError(getErrorMessage(err));
      setCommunityCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunityCategories();
  }, [loadCommunityCategories]);

  const redirectToRegistration = useCallback(() => {
    const returnUrl = `${window.location.pathname}${window.location.search}`;
    sessionStorage.setItem("redirectAfterLogin", returnUrl);
    navigate("/whatsapplogin");
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    if (isRegistered) {
      navigate("/main/dashboard/home");
      return;
    }

    sessionStorage.setItem("redirectAfterLogin", "/main/dashboard/home");
    navigate("/whatsapplogin");
  }, [isRegistered, navigate]);

  const requireRegistration = useCallback(() => {
    if (isRegistered) return true;
    redirectToRegistration();
    return false;
  }, [isRegistered, redirectToRegistration]);

  const handleUnauthorized = useCallback(
    (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        redirectToRegistration();
        return true;
      }
      return false;
    },
    [redirectToRegistration],
  );

  const loadQueries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getQueries({
        categoryId,
        keyword,
        pageNumber,
        pageSize: 9,
        sortBy,
      });

      setQueries(result.queries);
      setTotalPages(Math.max(result.totalPages, 1));
      setTotalElements(result.totalElements);
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [categoryId, handleUnauthorized, keyword, pageNumber, sortBy]);

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  const openDetail = useCallback(
    async (query: CommunityQuery) => {
      setSelectedQuery(query);
      setDetailLoading(true);
      setError("");
      setSearchParams({ query: String(query.id) });
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const [detail, nestedComments] = await Promise.all([
          getQueryById(query.id),
          getComments(query.id),
        ]);

        setSelectedQuery(detail);
        setComments(nestedComments.filter(Boolean) as CommunityComment[]);
      } catch (err) {
        if (!handleUnauthorized(err)) setError(getErrorMessage(err));
      } finally {
        setDetailLoading(false);
      }
    },
    [handleUnauthorized, setSearchParams],
  );

  useEffect(() => {
    const queryId = Number(searchParams.get("query"));
    if (!queryId || selectedQuery?.id === queryId) return;

    let active = true;

    const loadSharedQuery = async () => {
      setDetailLoading(true);
      setError("");

      try {
        const [detail, nestedComments] = await Promise.all([
          getQueryById(queryId),
          getComments(queryId),
        ]);

        if (!active) return;
        setSelectedQuery(detail);
        setComments(nestedComments.filter(Boolean) as CommunityComment[]);
      } catch (err) {
        if (!active) return;
        if (!handleUnauthorized(err)) setError(getErrorMessage(err));
      } finally {
        if (active) setDetailLoading(false);
      }
    };

    loadSharedQuery();
    return () => {
      active = false;
    };
  }, [handleUnauthorized, searchParams, selectedQuery?.id]);

  const closeDetail = () => {
    setSelectedQuery(null);
    setComments([]);
    setError("");
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshDetail = async () => {
    if (selectedQuery) await openDetail(selectedQuery);
  };

  const openCreateModal = () => {
    if (!requireRegistration()) return;
    setFormError("");
    setEditingQuery(null);
    setQueryForm({
      ...emptyQuery,
      categoryId: communityCategories[0]?.id || "",
    });
    setQueryModalOpen(true);
  };

  const openEditModal = (query: CommunityQuery) => {
    if (!requireRegistration()) return;
    setFormError("");
    setEditingQuery(query);
    const matchedCategory = communityCategories.find(
      (item) =>
        item.id === query.categoryId ||
        item.categoryName === query.categoryName ||
        item.categoryName === query.category,
    );

    setQueryForm({
      categoryId: query.categoryId || matchedCategory?.id || "",
      question: query.question,
      description: query.description,
      otherCategoryName:
        query.otherCategoryName || query.customCategory || "",
    });
    setQueryModalOpen(true);
  };



  const saveQuery = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireRegistration()) return;

    setFormError("");

    const question = queryForm.question.trim();
    const description = queryForm.description.trim();
    const otherCategoryName = queryForm.otherCategoryName?.trim();

    if (!queryForm.categoryId) {
      setFormError("Please select a topic.");
      return;
    }

    if (!question || !description) {
      setFormError("Please enter both the question and description.");
      return;
    }

    if (question.length < 10) {
      setFormError("Question must contain at least 10 characters.");
      return;
    }

    if (description.length < 25) {
      setFormError("Description must contain at least 25 characters so members can understand your query.");
      return;
    }

    if (/^(.)\1{7,}$/.test(question.replace(/\s/g, ""))) {
      setFormError("Please enter a meaningful question.");
      return;
    }

    const selectedFormCategory = communityCategories.find(
      (item) => item.id === queryForm.categoryId,
    );
    const isOtherCategory = selectedFormCategory?.categoryName === "OTHER";

    if (isOtherCategory && !otherCategoryName) {
      setFormError("Please enter your category name.");
      return;
    }

    if (isOtherCategory && (otherCategoryName?.length || 0) < 3) {
      setFormError("Category name must contain at least 3 characters.");
      return;
    }

    setSavingQuery(true);

    try {
      const payload: CreateQueryPayload = {
        categoryId: Number(queryForm.categoryId),
        question,
        description,
        otherCategoryName: isOtherCategory ? otherCategoryName : undefined,
      };
      const savedQuery = editingQuery
        ? await updateQuery(editingQuery.id, {
            ...payload,
            version: editingQuery.version,
          })
        : await createQuery(payload);
      showToast(
        editingQuery
          ? "Question updated successfully"
          : "Question posted successfully",
      );

      setQueryModalOpen(false);
      setEditingQuery(null);
      setQueryForm(emptyQuery);
      if (editingQuery) setSelectedQuery(savedQuery);
      await loadQueries();
    } catch (err) {
      if (!handleUnauthorized(err)) setFormError(getErrorMessage(err));
    } finally {
      setSavingQuery(false);
    }
  };

  const removeQuery = async (query: CommunityQuery) => {
    if (!requireRegistration()) return;
    if (!window.confirm("Delete this question? It will be removed from the community.")) return;

    try {
      await deleteQuery(query.id);
      closeDetail();
      showToast("Question deleted successfully");
      await loadQueries();
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    }
  };

  const queryReaction = async (query: CommunityQuery, type: ReactionType) => {
    if (!requireRegistration()) return;

    try {
      const reactions = await reactToQuery(query.id, type);
      setQueries((current) =>
        current.map((item) =>
          item.id === query.id ? { ...item, reactions } : item,
        ),
      );
      setSelectedQuery((current) =>
        current?.id === query.id ? { ...current, reactions } : current,
      );
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    }
  };

  const postComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedQuery || !requireRegistration()) return;

    const commentText = newComment.trim();
    if (commentText.length < 3) {
      showToast("Answer must contain at least 3 characters");
      return;
    }

    setPostingComment(true);

    try {
      await addComment(selectedQuery.id, commentText);
      setNewComment("");
      await refreshDetail();
      showToast("Answer posted");
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    } finally {
      setPostingComment(false);
    }
  };

  const getQueryShareUrl = (queryId: number) =>
    `${window.location.origin}/oxycommunity?query=${queryId}`;

  const copyQueryContent = async (
    event: MouseEvent<HTMLButtonElement>,
    query: CommunityQuery,
  ) => {
    event.stopPropagation();

    const content = `${query.question}\n\n${query.description}`;
    try {
      await navigator.clipboard.writeText(content);
      showToast("Question content copied");
    } catch {
      showToast("Unable to copy the content");
    }
  };

  const shareQuery = async (
    event: MouseEvent<HTMLButtonElement>,
    query: CommunityQuery,
  ) => {
    event.stopPropagation();
    const url = getQueryShareUrl(query.id);

    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Query link copied");
      }
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        showToast("Unable to share this query");
      }
    }
  };

  const forwardQuery = (
    event: MouseEvent<HTMLButtonElement>,
    query: CommunityQuery,
  ) => {
    event.stopPropagation();
    const url = getQueryShareUrl(query.id);
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const selectedCategoryName = useMemo(
    () =>
      communityCategories.find((item) => item.id === categoryId)?.categoryName ||
      "",
    [categoryId, communityCategories],
  );

  const listTitle = useMemo(() => {
    if (keyword) return `Results for “${keyword}”`;
    if (selectedCategoryName) {
      return `${getCategoryLabel(selectedCategoryName)} Questions`;
    }
    return "Latest Community Questions";
  }, [keyword, selectedCategoryName]);

  const myQueries = useMemo(
    () =>
      currentUserId
        ? queries.filter((query) => isOwner(query.user?.id, currentUserId))
        : [],
    [currentUserId, queries],
  );

  const visibleQueries = showMyQueriesOnly ? myQueries : queries;

  const relatedQueries = useMemo(() => {
    if (!selectedQuery) return [];
    return queries
      .filter(
        (item) =>
          item.id !== selectedQuery.id &&
          (item.categoryId === selectedQuery.categoryId ||
            item.categoryName === selectedQuery.categoryName),
      )
      .slice(0, 8);
  }, [queries, selectedQuery]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-[calc(100%-24px)] max-w-7xl items-center justify-between gap-3 sm:h-16 sm:w-[calc(100%-40px)]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex min-w-0 items-center rounded-lg outline-none ring-offset-2 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5b2d90]"
            aria-label="Open ASKOXY home"
          >
            <img
              src={askoxyLogo}
              alt="ASKOXY.AI"
              className="h-8 w-auto max-w-[150px] object-contain sm:h-10 sm:max-w-[190px]"
            />
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={goToDashboard}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-white text-[#5b2d90] transition hover:border-[#5b2d90] hover:bg-purple-50 sm:h-11 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-bold"
              aria-label="Go to dashboard"
              title="Go to dashboard"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            {!isRegistered && (
              <button
                type="button"
                onClick={redirectToRegistration}
                className="hidden min-h-10 items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 text-sm font-bold text-[#5b2d90] transition hover:bg-purple-100 sm:inline-flex"
              >
                <LogIn size={17} />
                Login
              </button>
            )}
            {isRegistered && (
              <div className="hidden min-h-10 max-w-[210px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:flex">
                <UserCircle size={18} className="shrink-0 text-[#5b2d90]" />
                <span className="truncate text-sm font-bold text-slate-700">
                  {savedProfileName}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#5b2d90] px-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(91,45,144,0.22)] transition hover:-translate-y-0.5 hover:bg-[#47216f] sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">Ask a Question</span>
              <span className="sm:hidden">Ask</span>
            </button>
          </div>
        </div>
      </header>
      {toastMessage && (
        <div className="fixed left-1/2 top-5 z-[90] -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xl">
          {toastMessage}
        </div>
      )}

      {!selectedQuery && (
        <>
          <section className="relative overflow-hidden border-b border-slate-200 bg-white">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-purple-100/80 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

            <div className="relative mx-auto grid w-[calc(100%-24px)] max-w-7xl items-center gap-6 py-8 sm:w-[calc(100%-40px)] sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
              <div className="animate-[fadeIn_.55s_ease-out]">
                {/* <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#5b2d90] sm:text-xs">
                  <Rocket size={15} />
                  We are launching something meaningful
                </span> */}

                <h1 className="mt-4 max-w-3xl text-[32px] font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[45px] lg:text-[54px]">
                  OXY community.
                  <span className="block bg-gradient-to-r from-[#5b2d90] to-[#9b66c8] bg-clip-text text-transparent">Knowledge for everyone.</span>
                </h1>

                <p className="mt-4 max-w-2xl text-[14px] leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Learn more about ASKOXY services, ask practical questions, share real experiences and receive useful guidance from users, employees and verified members.
                </p>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <button onClick={openCreateModal} className={`${primaryButton} px-6 shadow-[0_10px_24px_rgba(91,45,144,0.24)] hover:-translate-y-0.5`}>
                    <Lightbulb size={18} />
                    Ask Your First Question
                  </button>
                  {!isRegistered && (
                    <button onClick={redirectToRegistration} className={`${secondaryButton} px-6 hover:-translate-y-0.5`}>
                      <LogIn size={18} />
                      Join with WhatsApp
                    </button>
                  )}
                </div>

              </div>

              <div className="relative mx-auto w-full max-w-xl animate-[float_4s_ease-in-out_infinite]">
                <div className="absolute inset-x-12 bottom-7 h-20 rounded-full bg-purple-100 blur-3xl" />
                <div className="absolute right-5 top-6 rounded-2xl border border-purple-100 bg-white/90 p-3 shadow-lg backdrop-blur sm:right-10">
                  <Sparkles size={20} className="text-[#f4b942]" />
                </div>
                <img
                  src={communityImage}
                  alt="ASKOXY members learning and sharing knowledge"
                  className="relative mx-auto block max-h-[275px] w-full object-contain sm:max-h-[330px]"
                />
              </div>
            </div>
          </section>
        </>
      )}

      <div className="mx-auto w-[calc(100%-24px)] max-w-7xl py-4 sm:w-[calc(100%-40px)] sm:py-6">
        {selectedQuery ? (
          <section>
            <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={closeDetail}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-purple-100 bg-white px-3 text-sm font-bold text-[#5b2d90] transition hover:border-purple-200 hover:bg-purple-50"
              >
                <ArrowLeft size={18} />
                Back to Questions
              </button>

              <button
                type="button"
                onClick={goToDashboard}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#5b2d90] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#47216f]"
              >
                <UserCircle size={17} />
                Go to Dashboard
              </button>
            </div>

            {detailLoading ? (
              <LoadingCards count={2} singleColumn />
            ) : (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
                <div className="min-w-0">
                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)] sm:rounded-3xl">
                    <div className="h-1.5 bg-gradient-to-r from-[#5b2d90] via-[#8b5bb6] to-[#f4b942]" />
                    <div className="p-5 sm:p-8 lg:p-10">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <Author user={selectedQuery.user} />
                        <span className="inline-flex w-fit rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-[#5b2d90]">
                          {getQueryCategoryLabel(selectedQuery)}
                        </span>
                      </div>

                      <h1 className="mt-7 max-w-5xl break-words text-[27px] font-black leading-[1.22] tracking-[-0.025em] text-slate-950 sm:text-4xl lg:text-[42px]">
                        {selectedQuery.question}
                      </h1>

                      <p className="mt-5 max-w-5xl whitespace-pre-line break-words text-[15px] leading-7 text-slate-600 sm:text-[17px] sm:leading-8">
                        {selectedQuery.description}
                      </p>

                      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-100 py-4 text-xs font-medium text-slate-500 sm:text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye size={16} />
                          {selectedQuery.totalViews || 0} views
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MessageCircle size={16} />
                          {selectedQuery.totalComments || comments.length} answers
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={16} />
                          {timeAgo(selectedQuery.createdAt)}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() => queryReaction(selectedQuery, "LIKE")}
                          aria-pressed={Boolean(selectedQuery.reactions?.likedByCurrentUser)}
                          className={`${actionButton} ${
                            selectedQuery.reactions?.likedByCurrentUser
                              ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                              : "hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          <ThumbsUp
                            size={16}
                            fill={selectedQuery.reactions?.likedByCurrentUser ? "currentColor" : "none"}
                          />
                          Like {selectedQuery.reactions?.totalLikes || 0}
                        </button>

                        <button
                          type="button"
                          onClick={() => queryReaction(selectedQuery, "DISLIKE")}
                          aria-pressed={Boolean(selectedQuery.reactions?.dislikedByCurrentUser)}
                          className={`${actionButton} ${
                            selectedQuery.reactions?.dislikedByCurrentUser
                              ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm"
                              : "hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                          }`}
                        >
                          <ThumbsDown
                            size={16}
                            fill={selectedQuery.reactions?.dislikedByCurrentUser ? "currentColor" : "none"}
                          />
                          Dislike {selectedQuery.reactions?.totalDislikes || 0}
                        </button>

                        <button
                          onClick={() =>
                            document
                              .getElementById("answer-box")
                              ?.scrollIntoView({ behavior: "smooth", block: "center" })
                          }
                          className={actionButton}
                        >
                          <MessageCircle size={16} />
                          Answer
                        </button>

                        <button
                          onClick={(event) => shareQuery(event, selectedQuery)}
                          className={actionButton}
                        >
                          <Share2 size={16} />
                          Share
                        </button>

                        <button
                          onClick={(event) => forwardQuery(event, selectedQuery)}
                          className={actionButton}
                        >
                          <Forward size={16} />
                          WhatsApp
                        </button>

                        <button
                          onClick={(event) => copyQueryContent(event, selectedQuery)}
                          className={`${actionButton} col-span-2 sm:col-span-1`}
                        >
                          <Copy size={16} />
                          Copy
                        </button>

                        {isOwner(selectedQuery.user?.id, currentUserId) && (
                          <div className="col-span-2 flex gap-2 sm:ml-auto">
                            <button
                              type="button"
                              onClick={() => openEditModal(selectedQuery)}
                              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 text-xs font-bold text-[#5b2d90] transition hover:bg-purple-100 sm:text-sm"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => removeQuery(selectedQuery)}
                              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100 sm:text-sm"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>

                  <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black tracking-[-0.01em] text-slate-950 sm:text-xl">
                          Community Answers
                        </h2>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                          Add a useful response to this question.
                        </p>
                      </div>
                      <span className="grid h-8 min-w-8 place-items-center rounded-full bg-purple-50 px-2 text-xs font-black text-[#5b2d90]">
                        {comments.length}
                      </span>
                    </div>

                    <form
                      id="answer-box"
                      onSubmit={postComment}
                      className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 transition focus-within:border-purple-300 focus-within:bg-white sm:p-3"
                    >
                      <textarea
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                        rows={3}
                        minLength={3}
                        maxLength={2000}
                        required
                        placeholder="Write your answer..."
                        className="w-full resize-y bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
                        <small className="text-[11px] text-slate-400">
                          {newComment.length}/2000
                        </small>
                        <button
                          type="submit"
                          disabled={postingComment || !newComment.trim()}
                          className={`${primaryButton} min-h-9 px-3 text-xs`}
                        >
                          <Send size={14} />
                          {postingComment ? "Posting..." : "Post Answer"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-3 space-y-2">
                      {comments.length ? (
                        comments.map((comment) => (
                          <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            depth={0}
                            requireRegistration={requireRegistration}
                            refreshDetail={refreshDetail}
                            setComments={setComments}
                            handleUnauthorized={handleUnauthorized}
                            setError={setError}
                            showToast={showToast}
                          />
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 py-7 text-center">
                          <MessageCircle className="mx-auto text-[#5b2d90]" size={28} />
                          <h3 className="mt-2 text-sm font-bold text-slate-800">No answers yet</h3>
                          <p className="mt-0.5 text-xs text-slate-500">Be the first person to help.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {relatedQueries.length > 0 && (
                  <aside className="lg:sticky lg:top-20 lg:h-fit">
                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-[#5b2d90]">
                            Related Questions
                          </span>
                          <h2 className="mt-1 text-base font-black leading-6 text-slate-950">
                            More in {getQueryCategoryLabel(selectedQuery)}
                          </h2>
                        </div>
                        <MessageCircle size={18} className="mt-1 shrink-0 text-[#5b2d90]" />
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        {relatedQueries.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => openDetail(item)}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-purple-200 hover:bg-purple-50/60"
                          >
                            <strong className="line-clamp-2 block text-sm leading-5 text-slate-900">
                              {item.question}
                            </strong>
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                              <MessageCircle size={12} />
                              {item.totalComments || 0} answers
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </aside>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setPageNumber(0);
                  setKeyword(searchText.trim());
                }}
                className="grid gap-2 lg:grid-cols-[minmax(280px,1fr)_230px_190px_48px]"
              >
                <div className="flex min-h-11 min-w-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-purple-300 focus-within:bg-white">
                  <Search size={18} className="shrink-0 text-[#5b2d90]" />
                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search questions, topics or keywords"
                    className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  {searchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchText("");
                        setKeyword("");
                        setPageNumber(0);
                      }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <label className="relative flex min-h-11 items-center rounded-xl border border-slate-200 bg-white">
                  <ListFilter
                    size={17}
                    className="pointer-events-none absolute left-3 text-[#5b2d90]"
                  />
                  <select
                    value={categoryId}
                    disabled={categoriesLoading}
                    onChange={(event) => {
                      setCategoryId(
                        event.target.value ? Number(event.target.value) : "",
                      );
                      setPageNumber(0);
                    }}
                    aria-label="Filter by category"
                    className="h-full w-full appearance-none rounded-xl bg-transparent py-2 pl-10 pr-9 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">
                      {categoriesLoading ? "Loading Topics..." : "All Topics"}
                    </option>
                    {communityCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {getCategoryLabel(item.categoryName)}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="pointer-events-none absolute right-3 rotate-90 text-slate-400"
                  />
                </label>

                <label className="relative flex min-h-11 items-center rounded-xl border border-slate-200 bg-white">
                  <SlidersHorizontal
                    size={17}
                    className="pointer-events-none absolute left-3 text-[#5b2d90]"
                  />
                  <select
                    value={sortBy}
                    onChange={(event) => {
                      setSortBy(event.target.value as CommunitySort);
                      setPageNumber(0);
                    }}
                    aria-label="Sort community questions"
                    className="h-full w-full appearance-none rounded-xl bg-transparent py-2 pl-10 pr-9 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="LATEST">Latest</option>
                    <option value="OLDEST">Oldest</option>
                    <option value="MOST_VIEWED">Most Viewed</option>
                    <option value="MOST_COMMENTED">Most Answered</option>
                  </select>
                  <ChevronRight
                    size={16}
                    className="pointer-events-none absolute right-3 rotate-90 text-slate-400"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5b2d90] px-4 text-sm font-bold text-white transition hover:bg-[#47216f] lg:px-0"
                  aria-label="Search community"
                  title="Search"
                >
                  <Search size={18} />
                  <span className="lg:hidden">Search</span>
                </button>
              </form>
            </section>

            {isRegistered && (
              <div className="my-4 flex w-full sm:my-5">
                <div className="inline-flex w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMyQueriesOnly(false);
                      setPageNumber(0);
                    }}
                    className={`flex min-h-10 flex-1 items-center justify-center rounded-lg px-4 text-sm font-bold transition sm:flex-none ${
                      !showMyQueriesOnly
                        ? "bg-[#5b2d90] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#5b2d90]"
                    }`}
                  >
                    All Queries
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMyQueriesOnly(true);
                      setPageNumber(0);
                    }}
                    className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition sm:flex-none ${
                      showMyQueriesOnly
                        ? "bg-[#5b2d90] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#5b2d90]"
                    }`}
                  >
                    My Queries
                    <span
                      className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-black ${
                        showMyQueriesOnly
                          ? "bg-white/20 text-white"
                          : "bg-purple-50 text-[#5b2d90]"
                      }`}
                    >
                      {myQueries.length}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="my-4 flex items-end justify-between gap-4 sm:my-5">
              <div>
                <h2 className="text-[23px] font-black tracking-[-0.02em] text-slate-950 sm:text-3xl">
                  {showMyQueriesOnly ? "My Queries" : listTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {showMyQueriesOnly
                    ? `${myQueries.length} ${myQueries.length === 1 ? "query" : "queries"} posted by you`
                    : `${totalElements} questions found`}
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className={`${primaryButton} hidden sm:inline-flex`}
              >
                <Plus size={17} />
                Ask Question
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-center justify-between gap-3">
                  <span>{error}</span>
                  <button onClick={loadQueries} className="font-bold">
                    Retry
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <LoadingCards count={6} />
            ) : visibleQueries.length ? (
              <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
                {visibleQueries.map((query) => (
                  <QueryCard
                    key={query.id}
                    query={query}
                    onOpen={() => openDetail(query)}
                    onLike={() => queryReaction(query, "LIKE")}
                    onDislike={() => queryReaction(query, "DISLIKE")}
                    onShare={(event) => shareQuery(event, query)}
                    onForward={(event) => forwardQuery(event, query)}
                    onCopy={(event) => copyQueryContent(event, query)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-16 text-center">
                <MessageCircle className="mx-auto text-[#5b2d90]" size={40} />
                <h3 className="mt-4 text-xl font-black">
                  {showMyQueriesOnly ? "You have not posted any queries yet" : "No questions found"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {showMyQueriesOnly
                    ? "Ask your first community question to see it here."
                    : "Try another search or ask the first question."}
                </p>
                <button onClick={openCreateModal} className={`${primaryButton} mt-5`}>
                  <Plus size={17} />
                  Ask a Question
                </button>
              </div>
            )}

            {!showMyQueriesOnly && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
                <button
                  disabled={pageNumber === 0}
                  onClick={() => setPageNumber((page) => Math.max(page - 1, 0))}
                  className={secondaryButton}
                >
                  <ChevronLeft size={17} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <span className="text-xs font-medium text-slate-500 sm:text-sm">
                  Page {pageNumber + 1} of {totalPages}
                </span>

                <button
                  disabled={pageNumber + 1 >= totalPages}
                  onClick={() => setPageNumber((page) => page + 1)}
                  className={secondaryButton}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isRegistered && !selectedQuery && (
        <button
          onClick={openCreateModal}
          className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#5b2d90] text-white shadow-xl sm:hidden"
          aria-label="Ask a question"
        >
          <Plus size={22} />
        </button>
      )}

      {queryModalOpen && (
        <QueryModal
          queryForm={queryForm}
          communityCategories={communityCategories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onRetryCategories={loadCommunityCategories}
          setQueryForm={setQueryForm}
          formError={formError}
          savingQuery={savingQuery}
          isEditing={Boolean(editingQuery)}
          onClose={() => {
            setQueryModalOpen(false);
            setEditingQuery(null);
          }}
          onSubmit={saveQuery}
        />
      )}


      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
      `}</style>
    </main>
  );
}

function QueryCard({
  query,
  onOpen,
  onLike,
  onDislike,
  onShare,
  onForward,
  onCopy,
}: {
  query: CommunityQuery;
  onOpen: () => void;
  onLike: () => void;
  onDislike: () => void;
  onShare: (event: MouseEvent<HTMLButtonElement>) => void;
  onForward: (event: MouseEvent<HTMLButtonElement>) => void;
  onCopy: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-[0_14px_30px_rgba(91,45,144,0.10)]">
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-1 flex-col p-4 text-left sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="max-w-[70%] truncate rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-[#5b2d90]">
            {getQueryCategoryLabel(query)}
          </span>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {timeAgo(query.createdAt)}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 break-words text-[18px] font-black leading-6 tracking-[-0.015em] text-slate-950 sm:text-[19px]">
          {query.question}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[66px] break-words text-[14px] leading-[22px] text-slate-500">
          {query.description}
        </p>

        <div className="mt-4">
          <Author user={query.user} compact />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={14} />
            {query.totalViews || 0}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={14} />
            {query.totalComments || 0}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ThumbsUp size={14} />
            {query.reactions?.totalLikes || 0}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ThumbsDown size={14} />
            {query.reactions?.totalDislikes || 0}
          </span>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 bg-slate-50/70 p-2 sm:grid-cols-5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onLike();
          }}
          className={`inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold transition sm:text-xs ${
            query.reactions?.likedByCurrentUser
              ? "bg-blue-100 text-blue-700 shadow-sm"
              : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
          }`}
          aria-pressed={Boolean(query.reactions?.likedByCurrentUser)}
        >
          <ThumbsUp
            size={15}
            fill={query.reactions?.likedByCurrentUser ? "currentColor" : "none"}
          />
          Like
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDislike();
          }}
          aria-pressed={Boolean(query.reactions?.dislikedByCurrentUser)}
          className={`inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold transition sm:text-xs ${
            query.reactions?.dislikedByCurrentUser
              ? "bg-rose-100 text-rose-700 shadow-sm"
              : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
          }`}
        >
          <ThumbsDown
            size={15}
            fill={query.reactions?.dislikedByCurrentUser ? "currentColor" : "none"}
          />
          Dislike
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition hover:bg-white hover:text-[#5b2d90] sm:text-xs"
        >
          <Share2 size={15} />
          Share
        </button>
        <button
          type="button"
          onClick={onForward}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition hover:bg-white hover:text-[#5b2d90] sm:text-xs"
        >
          <Forward size={15} />
          Forward
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="col-span-2 inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition hover:bg-white hover:text-[#5b2d90] sm:col-span-1 sm:text-xs"
        >
          <Copy size={15} />
          Copy
        </button>
      </div>
    </article>
  );
}

function Author({
  user,
  compact = false,
}: {
  user: CommunityQuery["user"];
  compact?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5b2d90] to-[#9363bd] font-black text-white ${
          compact ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"
        }`}
      >
        {initials(user?.name)}
      </div>
      <div className="min-w-0">
        <strong className="flex items-center gap-1 truncate text-[13px] text-slate-900">
          {user?.name || "Community User"}
          {isVerified(user?.badge) && (
            <BadgeCheck size={15} className="shrink-0 text-blue-600" />
          )}
        </strong>
        <span className="mt-0.5 block text-xs text-slate-500">
          {badgeLabel(user?.badge, user?.name)}
        </span>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  depth,
  requireRegistration,
  refreshDetail,
  setComments,
  handleUnauthorized,
  setError,
  showToast,
}: {
  comment: CommunityComment;
  currentUserId?: string;
  depth: number;
  requireRegistration: () => boolean;
  refreshDetail: () => Promise<void>;
  setComments: React.Dispatch<React.SetStateAction<CommunityComment[]>>;
  handleUnauthorized: (err: unknown) => boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  showToast: (message: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);

  const replies = (comment.replies || []).filter(Boolean) as CommunityComment[];

  const replaceInTree = (
    nodes: CommunityComment[],
    id: number,
    updater: (item: CommunityComment) => CommunityComment,
  ): CommunityComment[] =>
    nodes.map((node) =>
      node.id === id
        ? updater(node)
        : {
            ...node,
            replies: replaceInTree(
              (node.replies || []).filter(Boolean) as CommunityComment[],
              id,
              updater,
            ),
          },
    );

  const removeFromTree = (
    nodes: CommunityComment[],
    id: number,
  ): CommunityComment[] =>
    nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        replies: removeFromTree(
          (node.replies || []).filter(Boolean) as CommunityComment[],
          id,
        ),
      }));

  const react = async (type: ReactionType) => {
    if (!requireRegistration()) return;

    try {
      const reactions = await reactToComment(comment.id, type);
      setComments((current) =>
        replaceInTree(current, comment.id, (item) => ({ ...item, reactions })),
      );
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    }
  };

  const submitReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireRegistration()) return;

    const cleanReply = replyText.trim();
    if (cleanReply.length < 2) {
      showToast("Reply must contain at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      await replyToComment(comment.id, cleanReply);
      setReplyText("");
      setReplyOpen(false);
      await refreshDetail();
      showToast("Reply posted");
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this answer and its replies?")) return;

    try {
      await deleteComment(comment.id);
      setComments((current) => removeFromTree(current, comment.id));
      showToast("Answer deleted");
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    }
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireRegistration()) return;

    const cleanComment = editText.trim();
    if (cleanComment.length < 2) {
      showToast("Answer must contain at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateComment(
        comment.id,
        cleanComment,
        comment.version,
      );
      setComments((current) =>
        replaceInTree(current, comment.id, () => updated),
      );
      setEditing(false);
      showToast("Answer updated");
    } catch (err) {
      if (!handleUnauthorized(err)) setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={depth > 0 ? "border-l border-purple-100 pl-2 sm:pl-3" : ""}
      style={{ marginLeft: depth > 0 ? `${Math.min(depth, 3) * 3}px` : 0 }}
    >
      <article className="flex min-w-0 items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5b2d90] to-[#9363bd] text-[9px] font-black text-white sm:h-8 sm:w-8">
          {initials(comment.user?.name)}
        </div>

        <div className="min-w-0 flex-1 rounded-lg bg-slate-50 p-2.5 ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <strong className="flex items-center gap-1 truncate text-sm text-slate-900">
                {comment.user?.name || "Community User"}
                {isVerified(comment.user?.badge) && (
                  <BadgeCheck size={14} className="shrink-0 text-blue-600" />
                )}
              </strong>
              <span className="mt-0.5 block text-[11px] text-slate-400">
                {badgeLabel(comment.user?.badge, comment.user?.name)} · {timeAgo(comment.createdAt)}
              </span>
            </div>

            {isOwner(comment.user?.id, currentUserId) && (
              <div className="flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setEditText(comment.comment);
                    setEditing(true);
                    setReplyOpen(false);
                  }}
                  className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[#5b2d90] transition hover:bg-purple-50"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={remove}
                  className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveEdit} className="mt-2">
              <textarea
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                rows={3}
                minLength={2}
                maxLength={2000}
                required
                autoFocus
                className="w-full resize-y rounded-lg border border-purple-200 bg-white p-2.5 text-sm leading-5 outline-none focus:border-[#5b2d90]"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditText(comment.comment);
                  }}
                  className={`${secondaryButton} min-h-9 px-3 text-xs`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !editText.trim()}
                  className={`${primaryButton} min-h-9 px-3 text-xs`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-1.5 whitespace-pre-line break-words text-[13px] leading-5 text-slate-600 sm:text-sm">
              {comment.comment}
            </p>
          )}

          {!editing && <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => react("LIKE")}
              aria-pressed={Boolean(comment.reactions?.likedByCurrentUser)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition ${
                comment.reactions?.likedByCurrentUser
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <ThumbsUp
                size={14}
                fill={comment.reactions?.likedByCurrentUser ? "currentColor" : "none"}
              />
              Like {comment.reactions?.totalLikes || 0}
            </button>
            <button
              type="button"
              onClick={() => react("DISLIKE")}
              aria-pressed={Boolean(comment.reactions?.dislikedByCurrentUser)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition ${
                comment.reactions?.dislikedByCurrentUser
                  ? "bg-rose-100 text-rose-700"
                  : "text-slate-500 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              <ThumbsDown
                size={14}
                fill={comment.reactions?.dislikedByCurrentUser ? "currentColor" : "none"}
              />
              Dislike {comment.reactions?.totalDislikes || 0}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(comment.comment);
                  showToast("Comment copied");
                } catch {
                  showToast("Unable to copy comment");
                }
              }}
              className="inline-flex min-h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold text-slate-500 transition hover:bg-white"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => {
                  if (!requireRegistration()) return;
                  setReplyOpen((value) => !value);
                }}
              className="inline-flex min-h-7 items-center gap-1 rounded-md px-2 text-[11px] font-bold text-slate-500 transition hover:bg-slate-50"
            >
              <Reply size={14} />
              Reply
            </button>
          </div>}

          {replyOpen && (
            <form onSubmit={submitReply} className="mt-2">
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={2}
                minLength={2}
                maxLength={1500}
                required
                autoFocus
                placeholder={`Reply to ${comment.user?.name || "this answer"}...`}
                className="w-full resize-y rounded-lg border border-slate-200 p-2.5 text-sm leading-5 outline-none focus:border-[#5b2d90]"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyOpen(false)}
                  className={`${secondaryButton} min-h-9 px-3 text-xs`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !replyText.trim()}
                  className={`${primaryButton} min-h-9 px-3 text-xs`}
                >
                  {saving ? "Posting..." : "Reply"}
                </button>
              </div>
            </form>
          )}
        </div>
      </article>

      {replies.length > 0 && (
        <div className="mt-1.5 space-y-1.5">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              depth={depth + 1}
              requireRegistration={requireRegistration}
              refreshDetail={refreshDetail}
              setComments={setComments}
              handleUnauthorized={handleUnauthorized}
              setError={setError}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QueryModal({
  queryForm,
  communityCategories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  setQueryForm,
  formError,
  savingQuery,
  isEditing,
  onClose,
  onSubmit,
}: {
  queryForm: QueryFormValues;
  communityCategories: CommunityCategoryItem[];
  categoriesLoading: boolean;
  categoriesError: string;
  onRetryCategories: () => void;
  setQueryForm: React.Dispatch<React.SetStateAction<QueryFormValues>>;
  formError: string;
  savingQuery: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="max-h-[calc(100vh-24px)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[#5b2d90]">
              ASKOXY.AI Community
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">
              {isEditing ? "Edit your question" : "Ask the community"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={21} />
          </button>
        </div>

        <label className="mt-6 block text-sm font-bold text-slate-800">
          Topic
          <select
            value={queryForm.categoryId}
            onChange={(event) => {
              const nextCategoryId = event.target.value
                ? Number(event.target.value)
                : "";
              const nextCategory = communityCategories.find(
                (item) => item.id === nextCategoryId,
              );

              setQueryForm((current) => ({
                ...current,
                categoryId: nextCategoryId,
                otherCategoryName:
                  nextCategory?.categoryName === "OTHER"
                    ? current.otherCategoryName
                    : "",
              }));
            }}
            disabled={categoriesLoading || communityCategories.length === 0}
            required
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#5b2d90] disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="" disabled>
              {categoriesLoading ? "Loading topics..." : "Select a topic"}
            </option>
            {communityCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {getCategoryLabel(item.categoryName)}
              </option>
            ))}
          </select>
          {categoriesError && (
            <span className="mt-2 flex items-center justify-between gap-3 text-xs font-medium text-red-600">
              <span>Unable to load topics.</span>
              <button
                type="button"
                onClick={onRetryCategories}
                className="font-bold text-[#5b2d90]"
              >
                Retry
              </button>
            </span>
          )}
        </label>

        {communityCategories.find((item) => item.id === queryForm.categoryId)
          ?.categoryName === "OTHER" && (
          <label className="mt-5 block text-sm font-bold text-slate-800">
            Category name
            <input
              value={queryForm.otherCategoryName || ""}
              onChange={(event) =>
                setQueryForm((current) => ({
                  ...current,
                  otherCategoryName: event.target.value,
                }))
              }
              minLength={3}
              maxLength={100}
              required
              placeholder="Enter category name"
              className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#5b2d90]"
            />
          </label>
        )}

        <label className="mt-5 block text-sm font-bold text-slate-800">
          Question
          <input
            value={queryForm.question}
            onChange={(event) =>
              setQueryForm((current) => ({
                ...current,
                question: event.target.value,
              }))
            }
            minLength={10}
            maxLength={250}
            required
            placeholder="What would you like to ask?"
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#5b2d90]"
          />
          <small className="mt-1 block text-right font-normal text-slate-400">
            {queryForm.question.length}/250
          </small>
        </label>

        <label className="mt-5 block text-sm font-bold text-slate-800">
          Description
          <textarea
            value={queryForm.description}
            onChange={(event) =>
              setQueryForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={6}
            minLength={25}
            maxLength={3000}
            required
            placeholder="Add useful details so the community can help you better."
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-[#5b2d90]"
          />
          <small className="mt-1 block text-right font-normal text-slate-400">
            {queryForm.description.length}/3000
          </small>
        </label>

        {formError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Cancel
          </button>
          <button type="submit" disabled={savingQuery} className={primaryButton}>
            {savingQuery
              ? isEditing
                ? "Saving..."
                : "Posting..."
              : isEditing
                ? "Save Changes"
                : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingCards({
  count,
  singleColumn = false,
}: {
  count: number;
  singleColumn?: boolean;
}) {
  return (
    <div
      className={
        singleColumn
          ? "grid gap-4"
          : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="h-6 w-24 rounded-full bg-slate-100" />
          <div className="mt-8 h-5 w-11/12 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-3 h-4 w-8/12 rounded bg-slate-100" />
          <div className="mt-10 h-10 w-40 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
