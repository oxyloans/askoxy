import React, { useMemo, useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Upload,
  FileText,
  Newspaper,
  CheckCircle,
  Loader2,
  RotateCcw,
  Send,
  Eye,
  ExternalLink,
  Users,
  Building2,
  Download,
  Sparkles,
  Link as LinkIcon,
  CalendarDays,
  Search,
  X,
  ClipboardList,
  FileSearch,
  Image as ImageIcon,
  Hash,
  Bookmark,
  Globe,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
} from "lucide-react";
import BASE_URL from "../../Config";
import PaperclipAssistant from "./PaperclipAssistant"; // NEW — Ask Article popup

const PAPERCLIP_ANALYZE_API = `${BASE_URL}/ai-automation/paperclip/analyze`;
const PAPERCLIP_ALL_API = `${BASE_URL}/ai-automation/paperclip/all`;
const ADD_TO_CLONE_API = `${BASE_URL}/ai-automation/add-to-clone`;
const IMAGE_API = `${BASE_URL}/ai-automation/image`;
const BLOG_FORMAT_API = `${BASE_URL}/ai-automation/blog/format`;
const BLOG_PUBLISH_API = `${BASE_URL}/ai-automation/blog/publish`;

type EntityType = "PAPERCLIP";

type Person = {
  name?: string | null;
  designation?: string | null;
  company?: string | null;
  linkedin?: string | null;
  linkedinId?: string | null;
  linkedIn?: string | null;
  linkedinUrl?: string | null;
};

type Company = {
  name?: string | null;
  website?: string | null;
  linkedin?: string | null;
  linkedinId?: string | null;
  linkedIn?: string | null;
  linkedinUrl?: string | null;
};

type Report = {
  title?: string | null;
  source?: string | null;
  downloadUrl?: string | null;
};

type PaperclipData = {
  paperclipId?: string | null;
  fileName?: string | null;
  s3FileUrl?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  uploadedAt?: string | null;
  analysis?: {
    summary?: {
      shortSummary?: string | null;
      detailedSummary?: string | null;
      keyPoints?: string[] | null;
      actionItems?: string[] | null;
    } | null;
    people?: Person[] | null;
    companies?: Company[] | null;
    reports?: Report[] | null;
  } | null;
};

type BlogPayload = {
  entityId?: string;
  entityType?: EntityType;
  title?: string;
  description?: string;
  socialMediaCaptions?: string;
  addedBy?: string;
  imageUrl?: string | null;
  videoUrl?: string;
  videoFileUrl?: string | null;
  status?: string;
  blogPostId?: string | null;
};

type Tab = "summary" | "paperclip" | "people" | "companies" | "reports" | "blog";

const toast = (icon: "success" | "error" | "warning" | "info", title: string) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2400,
    background: "#f0fdf4",
    color: "#166534",
    customClass: { container: "!top-[60px]" },
  });

const safeText = (value?: string | null) => String(value || "").trim();

const isValidUrl = (value?: string | null) => {
  const text = safeText(value);
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") return false;
  return /^https?:\/\//i.test(text);
};

const getLinkedInUrl = (value?: string | null) => {
  const text = safeText(value);
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") return "";
  if (/^https?:\/\//i.test(text)) return text;
  if (text.includes("linkedin.com")) return `https://${text.replace(/^\/+/, "")}`;
  return `https://www.linkedin.com/in/${text.replace(/^@/, "")}`;
};

const getAnyLinkedIn = (item: Person | Company) =>
  getLinkedInUrl(item.linkedin || item.linkedIn || item.linkedinUrl || item.linkedinId || "");

const formatDate = (date?: string | null) => {
  const value = safeText(date);
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isImageFile = (value?: string | null) =>
  /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(safeText(value));

// ─── Sorting helper: latest uploaded first ─────────────────────────────────
const sortByLatest = (list: PaperclipData[]): PaperclipData[] =>
  [...list].sort((a, b) => {
    const dateA = new Date(a.uploadedAt || 0).getTime();
    const dateB = new Date(b.uploadedAt || 0).getTime();
    return dateB - dateA;
  });

const generateHashtags = (sources: (string | null | undefined)[], limit = 6): string => {
  return sources
    .filter(Boolean)
    .map(
      (s) =>
        "#" +
        safeText(s)
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((w, i) =>
            i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join("")
    )
    .filter((tag) => tag.length > 1)
    .slice(0, limit)
    .join(" ");
};

const buildHashtagsFromPaperclip = (item: PaperclipData): string => {
  const keyPoints = item.analysis?.summary?.keyPoints || [];
  const companies = item.analysis?.companies || [];
  const people = item.analysis?.people || [];
  const sources = [
    ...companies.map((c) => safeText(c.name)),
    ...people.map((p) => safeText(p.company)),
    ...keyPoints.slice(0, 3),
  ].filter(Boolean);
  return generateHashtags(sources, 6);
};

const buildCloneContent = (item: PaperclipData) => {
  const summary = item.analysis?.summary;
  return JSON.stringify(
    {
      fileName: item.fileName,
      fileUrl: item.s3FileUrl,
      uploadedAt: item.uploadedAt,
      shortSummary: summary?.shortSummary,
      detailedSummary: summary?.detailedSummary,
      keyPoints: summary?.keyPoints || [],
      actionItems: summary?.actionItems || [],
      people: item.analysis?.people || [],
      companies: item.analysis?.companies || [],
      reports: item.analysis?.reports || [],
    },
    null,
    2
  );
};

const buildFallbackBlog = (item: PaperclipData, existing?: Partial<BlogPayload>): BlogPayload => {
  const summary = item.analysis?.summary;
  const hashtagText = buildHashtagsFromPaperclip(item);
  const captionsBody = [
    summary?.shortSummary,
    ...((summary?.keyPoints || []).slice(0, 4).map((p) => `• ${p}`)),
  ]
    .filter(Boolean)
    .join("\n");
  const finalCaptions =
    existing?.socialMediaCaptions ||
    (hashtagText ? `${captionsBody}\n\n${hashtagText}`.trim() : captionsBody.trim());
  return {
    entityId: safeText(item.paperclipId),
    entityType: "PAPERCLIP",
    title:
      existing?.title ||
      safeText(summary?.shortSummary) ||
      safeText(item.fileName) ||
      "Paper Clipping AI Analysis",
    description:
      existing?.description ||
      safeText(summary?.detailedSummary) ||
      safeText(summary?.shortSummary) ||
      "AI-generated blog from paper clipping analysis.",
    socialMediaCaptions: finalCaptions,
    addedBy: existing?.addedBy || "Radha",
    imageUrl: existing?.imageUrl || "",
    videoUrl: "",
    videoFileUrl: null,
    blogPostId: existing?.blogPostId || null,
  };
};

/* ─── Paperclip Tab ─── */
function PaperclipTab({
  selected,
  setPreviewImage,
}: {
  selected: PaperclipData;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const allUrls: string[] = selected.imageUrls?.length
    ? selected.imageUrls
    : selected.imageUrl
    ? [selected.imageUrl]
    : [];
  const fileNames = safeText(selected.fileName)
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  if (allUrls.length === 0)
    return <EmptyTab icon={<FileText size={24} />} text="No file URL available for this paperclip." />;

  return (
    <div className="w-full pb-6">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-violet-700">
        Uploaded Files ({allUrls.length})
      </p>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUrls.map((url, i) => {
          const name = fileNames[i] || `File ${i + 1}`;
          const isImg =
            isImageFile(name) ||
            isImageFile(url) ||
            /\.(png|jpg|jpeg|gif|webp|bmp|svg)/i.test(url);

          return (
            <div key={i} className="w-full rounded-2xl border-2 border-violet-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  {isImg ? <ImageIcon size={16} className="text-violet-600" /> : <FileText size={16} className="text-violet-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-800">{name}</p>
                  <p className="text-[10px] text-gray-500">File {i + 1} of {allUrls.length}</p>
                </div>
                <button
                  onClick={() => setPreviewImage(url)}
                  title="Open file preview"
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 text-[11px] font-bold text-violet-700 transition hover:bg-violet-100"
                >
                  <ExternalLink size={11} />
                  Open
                </button>
              </div>
              {isImg && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <img
                    src={url}
                    alt={name}
                    className="h-40 w-full rounded-xl object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="mt-3 flex items-center gap-1 text-[10px] text-gray-500">
        <CalendarDays size={10} />
        {formatDate(selected.uploadedAt)}
      </span>
    </div>
  );
}

/* ─── Paperclip List Card ─── */
const PaperclipListCard = React.memo(function PaperclipListCard({
  item,
  isActive,
  onClick,
  onAsk, // NEW — opens the Ask Article assistant for this specific card
}: {
  item: PaperclipData;
  isActive: boolean;
  onClick: () => void;
  onAsk?: () => void; // NEW
}) {
  const fnames = safeText(item.fileName).split(",").map((f) => f.trim()).filter(Boolean);
  const displayName = fnames.length > 1 ? `${fnames[0]} +${fnames.length - 1}` : fnames[0] || "Untitled";
  const shortSum = safeText(item.analysis?.summary?.shortSummary);
  const peopleCount = item.analysis?.people?.length || 0;
  const companyCount = item.analysis?.companies?.length || 0;
  const reportCount = item.analysis?.reports?.length || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border-2 p-3 text-left transition-all duration-200 ${
        isActive
          ? "border-violet-400 bg-violet-50 shadow-md"
          : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100">
          <FileText size={14} className="text-violet-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-black leading-tight text-gray-900">
            {displayName}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
            <CalendarDays size={9} />
            {formatDate(item.uploadedAt)}
          </p>
        </div>
        {isActive && (
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100">
            <CheckCircle size={11} className="text-violet-600" />
          </span>
        )}
      </div>

      {shortSum && (
        <p className="mt-2 line-clamp-2 border-t border-gray-100 pt-2 text-[11px] leading-[1.5] text-gray-600">
          {shortSum}
        </p>
      )}

      {(peopleCount > 0 || companyCount > 0 || reportCount > 0) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {peopleCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[9px] font-bold text-cyan-700">
              <Users size={8} /> {peopleCount} {peopleCount === 1 ? "person" : "people"}
            </span>
          )}
          {companyCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-lime-200 bg-lime-50 px-2 py-0.5 text-[9px] font-bold text-lime-700">
              <Building2 size={8} /> {companyCount} {companyCount === 1 ? "company" : "companies"}
            </span>
          )}
          {reportCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[9px] font-bold text-sky-700">
              <Bookmark size={8} /> {reportCount} {reportCount === 1 ? "report" : "reports"}
            </span>
          )}
        </div>
      )}

      {/* NEW — quick "Ask" chip. stopPropagation so it doesn't also trigger onClick (open detail view) */}
      {onAsk && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onAsk();
          }}
          className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-[10px] font-bold text-fuchsia-700 transition hover:bg-fuchsia-100"
        >
          🤖 Ask
        </span>
      )}
    </button>
  );
});

/* ─── Pagination Controls ─── */
function PaginationControls({
  currentPage, totalPages, onPageChange,
}: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  const pages = useMemo(() => {
    const arr: (number | "...")[] = [];
    const windowSize = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - windowSize && i <= currentPage + windowSize)) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== "...") {
        arr.push("...");
      }
    }
    return arr;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-9 items-center gap-1 rounded-xl border-2 border-violet-200 bg-white px-3 text-xs font-bold text-gray-700 disabled:opacity-40 hover:border-violet-300 hover:bg-violet-50"
      >
        <ChevronLeft size={14} />Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-xs font-bold text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl border-2 px-3 text-xs font-bold transition
              ${p === currentPage
                ? "border-violet-400 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                : "border-violet-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-9 items-center gap-1 rounded-xl border-2 border-violet-200 bg-white px-3 text-xs font-bold text-gray-700 disabled:opacity-40 hover:border-violet-300 hover:bg-violet-50"
      >
        Next<ChevronRight size={14} />
      </button>
    </div>
  );
}

export default function PaperClippingPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [paperclips, setPaperclips] = useState<PaperclipData[]>([]);
  const [selected, setSelected] = useState<PaperclipData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [analyzingPaperclip, setAnalyzingPaperclip] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [formatImageLoading, setFormatImageLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const [blogPreview, setBlogPreview] = useState<BlogPayload | null>(null);
  const [publishedBlog, setPublishedBlog] = useState<BlogPayload | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogGenerating, setBlogGenerating] = useState(false);
  const [isImageBlog, setIsImageBlog] = useState(false);
  const [activeView, setActiveView] = useState<"upload" | "allclips">("upload");

  // ─── NEW — Ask Article assistant state ─────────────────────────────────────
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantTarget, setAssistantTarget] = useState<PaperclipData | null>(null);

  // ─── Pagination state for the All Paper Clips grid ─────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const PAPERCLIPS_PER_PAGE = 8;

  useEffect(() => {
    const saved = sessionStorage.getItem("paperclipState");
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      setSelected(state.selected || null);
      setBlogPreview(state.blogPreview || null);
      setPublishedBlog(state.publishedBlog || null);
      setImageUrl(state.imageUrl || "");
      setActiveTab(state.activeTab || "summary");
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "paperclipState",
      JSON.stringify({ selected, blogPreview, publishedBlog, imageUrl, activeTab })
    );
  }, [selected, blogPreview, publishedBlog, imageUrl, activeTab]);

  const entityId = safeText(selected?.paperclipId);
  const summary = selected?.analysis?.summary;
  const people = selected?.analysis?.people || [];
  const companies = selected?.analysis?.companies || [];
  const reports = selected?.analysis?.reports || [];

  const filteredPaperclips = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return paperclips;
    return paperclips.filter((item) => {
      const searchable = [
        item.fileName,
        item.paperclipId,
        item.analysis?.summary?.shortSummary,
        item.analysis?.summary?.detailedSummary,
        ...(item.analysis?.people || []).map((p) => `${p.name} ${p.company} ${p.designation}`),
        ...(item.analysis?.companies || []).map((c) => `${c.name} ${c.website}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [paperclips, searchTerm]);

  // ─── Derived pagination values ─────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredPaperclips.length / PAPERCLIPS_PER_PAGE));

  const paginatedPaperclips = useMemo(() => {
    const start = (currentPage - 1) * PAPERCLIPS_PER_PAGE;
    return filteredPaperclips.slice(start, start + PAPERCLIPS_PER_PAGE);
  }, [filteredPaperclips, currentPage]);

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Keep currentPage in range if the list shrinks (e.g. after refresh/search)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "paperclip", label: "Paperclip" },
    { id: "summary", label: "Summary" },
    { id: "people", label: "People", count: people.length },
    { id: "companies", label: "Companies", count: companies.length },
    { id: "reports", label: "Reports", count: reports.length },
    { id: "blog", label: "Blog" },
  ];

  const tabColors: Record<Tab, { active: string; inactive: string }> = {
    paperclip: {
      active: "border-2 border-cyan-400 bg-cyan-100 text-cyan-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700",
    },
    summary: {
      active: "border-2 border-violet-400 bg-violet-100 text-violet-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700",
    },
    people: {
      active: "border-2 border-emerald-400 bg-emerald-100 text-emerald-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
    },
    companies: {
      active: "border-2 border-amber-400 bg-amber-100 text-amber-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700",
    },
    reports: {
      active: "border-2 border-sky-400 bg-sky-100 text-sky-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700",
    },
    blog: {
      active: "border-2 border-rose-400 bg-rose-100 text-rose-800",
      inactive: "border border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700",
    },
  };

  const fetchJson = async (url: string, options?: RequestInit) => {
    const token = sessionStorage.getItem("accessToken") || "";
    const res = await fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...(options?.headers || {}) },
    });
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(text || "Invalid server response");
    }
    if (!res.ok || data?.success === false)
      throw new Error(data?.message || `API failed: ${res.status}`);
    return data;
  };

  const loadAllPaperclips = async () => {
    try {
      setListLoading(true);
      const data = await fetchJson(PAPERCLIP_ALL_API);
      const list = Array.isArray(data?.data) ? data.data : [];
      // ── Sort latest uploaded first ──
      setPaperclips(sortByLatest(list));
      setCurrentPage(1);
      toast("success", "All paper clips loaded");
      setTimeout(() => searchInputRef.current?.focus(), 150);
    } catch (error: any) {
      toast("error", error?.message || "Failed to load paper clips");
    } finally {
      setListLoading(false);
    }
  };

 const handleRefreshPage = async () => {
    try {
      setRefreshLoading(true);
      sessionStorage.removeItem("paperclipState");
      setFiles([]);
      setSelected(null);
      setPaperclips([]);
      setBlogPreview(null);
      setPublishedBlog(null);
      setImageUrl("");
      setSearchTerm("");
      setActiveTab("summary");
      setActiveView("upload");
      setCurrentPage(1);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast("success", "Refreshed successfully");
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => {
      const merged = [...prev];
      newFiles.forEach((file) => {
        const exists = merged.some(
          (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
        );
        if (!exists) merged.push(file);
      });
      return merged;
    });
  };

  const handleAnalyze = async () => {
    if (!files.length) return toast("warning", "Please choose files");
    const oversized = files.filter((f) => f.size > 200 * 1024 * 1024);
    if (oversized.length > 0) return toast("error", "Each file must be under 200 MB");
    const uploadedFileNames = files.map((f) => f.name.toLowerCase());
    try {
      setUploading(true);
      setAnalyzingPaperclip(true);
      setBlogPreview(null);
      setPublishedBlog(null);
      setImageUrl("");
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const data = await fetchJson(PAPERCLIP_ANALYZE_API, { method: "POST", body: formData });
      const responseData = data?.data;
      const analyzedItems = Array.isArray(responseData) ? responseData : [responseData].filter(Boolean);
      const firstItem = analyzedItems[0];
      if (firstItem) {
        setSelected(firstItem);
        setActiveTab("paperclip");
        setPaperclips((prev) => {
          const existingIds = new Set(prev.map((p) => safeText(p.paperclipId)));
          const fresh = analyzedItems.filter((p) => !existingIds.has(safeText(p.paperclipId)));
          // ── Sort latest uploaded first after merging newly analyzed items ──
          return sortByLatest([...fresh, ...prev]);
        });
      }
      setFiles([]);
      toast("success", "Paper clipping analyzed successfully");
    } catch (error: any) {
      const isFetchError =
        error?.message?.toLowerCase().includes("failed to fetch") ||
        error?.message?.toLowerCase().includes("networkerror") ||
        error?.message?.toLowerCase().includes("network error");

      if (isFetchError) {
        // Analysis likely completed on backend — fetch all clips and auto-navigate
        try {
          const allData = await fetchJson(PAPERCLIP_ALL_API);
          const list: PaperclipData[] = Array.isArray(allData?.data) ? allData.data : [];
          // ── Sort latest uploaded first ──
          const sortedList = sortByLatest(list);
          if (sortedList.length > 0) {
            setPaperclips(sortedList);
            // Try to match by uploaded filename
            const match = sortedList.find((item) =>
              uploadedFileNames.some((fname) =>
                safeText(item.fileName).toLowerCase().includes(fname) ||
                fname.includes(safeText(item.fileName).toLowerCase())
              )
            ) || sortedList[0]; // fallback to most recent
            setFiles([]);
            setSelected(match);
            setActiveTab("summary");
            setBlogPreview(null);
            setPublishedBlog(null);
            setImageUrl("");
            return; // skip error toast — we navigated successfully
          }
        } catch (_) {
          // silently ignore secondary fetch error
        }
      }

      toast("error", error?.message || "Analyze failed");
    } finally {
      setUploading(false);
      setAnalyzingPaperclip(false);
    }
  };

  const handleSelectPaperclip = (item: PaperclipData) => {
    setSelected(item);
    setActiveTab("summary");
    setBlogPreview(null);
    setPublishedBlog(null);
    setImageUrl("");
  };

  const handleAddToClone = async () => {
    if (!selected || !entityId) return toast("warning", "Please select a paper clip");
    const result = await Swal.fire({
      title: "Add to Clone K.B.",
      text: "Do you want to add this content to Clone Knowledge Base?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#64748b",
      background: "#080C18",
      color: "#166534",
    });
    if (!result.isConfirmed) return;
    try {
      setCloneLoading(true);
      await fetchJson(ADD_TO_CLONE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          entityType: "PAPERCLIP",
          editedContent: buildCloneContent(selected),
          confirmed: true,
        }),
      });
      await Swal.fire({
        title: "Success",
        text: "Content successfully added to Clone K.B.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#22c55e",
        background: "#080C18",
        color: "#166534",
      });
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.message || "Add to clone failed",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setCloneLoading(false);
    }
  };

  const handleCreateImage = async () => {
    if (!entityId) return toast("warning", "Paperclip ID missing");
    try {
      setImageLoading(true);
      const data = await fetchJson(`${IMAGE_API}/${encodeURIComponent(entityId)}?entityType=PAPERCLIP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "PAPERCLIP" }),
      });
      const img = data?.data?.imageUrl || data?.data?.url || data?.data?.generatedImageUrl || data?.imageUrl || "";
      setImageUrl(img);
      setBlogPreview((prev) =>
        selected ? { ...buildFallbackBlog(selected, prev || {}), ...(prev || {}), imageUrl: img } : prev
      );
      toast("success", img ? "Image generated successfully" : "Image created");
    } catch (error: any) {
      toast("error", error?.message || "Image generation failed");
    } finally {
      setImageLoading(false);
    }
  };

  const disclaimerText = `\n\n### ✅ **Blog Disclaimer**\n*This blog is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]*`;

  const handleFormatBlog = async (generateImage = false) => {
    if (!selected || !entityId) return toast("warning", "Please select a paper clip");
    try {
      if (generateImage) setFormatImageLoading(true);
      else setFormatLoading(true);
      setActiveTab("blog");
      setBlogGenerating(true);
      setBlogPreview(null);
      setIsImageBlog(generateImage);
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "PAPERCLIP", generateImage }),
      });
      const formatted = data?.data || {};
      const fallback = buildFallbackBlog(selected, formatted);
      const desc = formatted?.description || fallback.description || "";
      const finalDesc = desc.includes("Blog Disclaimer") ? desc : desc + disclaimerText;
      const hashtagText = buildHashtagsFromPaperclip(selected);
      const baseCaption = formatted?.socialMediaCaptions || fallback.socialMediaCaptions || "";
      const finalCaptions =
        hashtagText && !baseCaption.includes(hashtagText)
          ? `${baseCaption}\n\n${hashtagText}`.trim()
          : baseCaption;
      setBlogPreview({
        ...fallback,
        ...formatted,
        entityId,
        entityType: "PAPERCLIP",
        imageUrl: formatted?.imageUrl || imageUrl || fallback.imageUrl || "",
        videoUrl: "",
        videoFileUrl: null,
        socialMediaCaptions: finalCaptions,
        description: finalDesc,
      });
      setPublishedBlog(null);
      toast("success", "Blog preview ready");
    } catch (error: any) {
      toast("error", error?.message || "Blog format failed");
    } finally {
      setFormatLoading(false);
      setFormatImageLoading(false);
      setBlogGenerating(false);
    }
  };

  const handlePublishBlog = async () => {
    if (!blogPreview || !selected) return toast("warning", "Please generate blog preview first");
    const result = await Swal.fire({
      title: "Publish Blog",
      text: "Do you want to publish this blog in ASKOXY.AI Blog?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
      background: "#080C18",
      color: "#166534",
    });
    if (!result.isConfirmed) return;
    try {
      setPublishLoading(true);
      const { imageUrls: _drop, ...cleanPreview } = blogPreview as any;
      const payload: BlogPayload = {
        ...buildFallbackBlog(selected, cleanPreview),
        ...cleanPreview,
        entityId,
        entityType: "PAPERCLIP",
        imageUrl: cleanPreview.imageUrl || imageUrl || "",
        videoUrl: "",
        videoFileUrl: null,
        status: "PUBLISHED",
      };
      const data = await fetchJson(BLOG_PUBLISH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setPublishedBlog(data?.data || payload);
      setBlogPreview(null);
      await Swal.fire({
        title: "Success",
        text: "Blog published successfully in ASKOXY.AI BLOG.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#22c55e",
        background: "#080C18",
        color: "#166534",
      });
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: error?.message || "Blog publish failed",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-gray-50 text-gray-900" style={{ height: "calc(100vh - 56px)" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(94,221,242,0.09),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(167,139,250,0.08),transparent_35%)]" />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">

        {/* ── Inline title + refresh bar ── */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-2 sm:px-6">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <p className="text-xl font-black bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Paper Clipping AI
              </p>
              {paperclips.length > 0 && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-black text-violet-700">
                  {paperclips.length}
                </span>
              )}
            </div>
           <p className="text-sm text-slate-700 font-medium">
              Analyze newspaper clippings to uncover trends, opportunities, market intelligence, and strategic insights.
            </p>
          </div>
         <div className="flex items-center gap-2.5">
            {selected && (
              <button
                onClick={() => { setSelected(null); setBlogPreview(null); setPublishedBlog(null); setImageUrl(""); }}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-violet-300 bg-violet-50 px-3 text-[11px] font-bold text-violet-700 transition hover:bg-violet-100"
              >
                <ArrowLeft size={12} /> Back
              </button>
            )}

            {/* ── NEW — "Ask Article" moved up here, unique size/color so it stands out from Back/Refresh ── */}
            {selected && (
              <button
                onClick={() => { setAssistantTarget(selected); setShowAssistant(true); }}
                title="Ask this article a question"
                className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-fuchsia-600 via-orange-700 to-indigo-600 px-4 text-[13px] font-black text-white shadow-[0_4px_14px_rgba(192,38,211,0.45)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(192,38,211,0.6)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 skew-x-[-20deg] transition-transform duration-500 group-hover:translate-x-full" />
                <MessageCircleQuestion size={16} className="relative" />
                <span className="relative">Ask Article</span>
              </button>
            )}

            <button
              onClick={handleRefreshPage}
              disabled={refreshLoading}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-cyan-300 bg-white px-3 text-[11px] font-bold text-cyan-700 transition hover:bg-cyan-50 disabled:opacity-50"
            >
              {refreshLoading ? <Loader2 className="animate-spin" size={12} /> : <RotateCcw size={12} />}
              Refresh
            </button>
          </div>
        </div>

        {/* ════ LIST VIEW (no clip selected) ════ */}
        {!selected ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {analyzingPaperclip ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                  <div className="h-20 w-20 rounded-full border-4 border-violet-500/20 border-t-violet-400 animate-spin" />
                  <Sparkles size={28} className="absolute inset-0 m-auto text-violet-600 animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-gray-900">AI Analyzing Paperclip</h2>
                <p className="mt-3 text-sm text-gray-600">Reading uploaded files...</p>
                <p className="mt-2 text-xs text-violet-600 animate-pulse">
                  Extracting content • Identifying people • Generating insights
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
{/* ── Tab buttons ── */}
                <div className="mb-4 flex items-center gap-2">
                  <button
                    onClick={() => setActiveView("upload")}
                    className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-black transition shadow-md ${
                      activeView === "upload"
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-700"
                    }`}
                  >
                    <Upload size={15} /> Upload Paper Clips
                  </button>
                  <button
                    onClick={() => { setActiveView("allclips"); loadAllPaperclips(); }}
                    disabled={listLoading}
                    className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:opacity-50 ${
                      activeView === "allclips"
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-700"
                    }`}
                  >
                    {listLoading ? <Loader2 className="animate-spin" size={15} /> : <ClipboardList size={15} />}
                    {listLoading ? "Loading..." : "All Paper Clips"}
                  </button>
                </div>

                {/* ── Upload card (shown when Upload tab active) ── */}
                {activeView === "upload" && (
                  <div className="mb-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-400">
                        <Upload size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">Paper Clip Upload</p>
                        <p className="text-[10px] text-gray-500">Upload files, review AI analysis, save to clone, create blog, and publish.</p>
                      </div>
                    </div>
                    <div
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-violet-400", "bg-violet-50"); }}
                      onDragLeave={(e) => { e.currentTarget.classList.remove("border-violet-400", "bg-violet-50"); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("border-violet-400", "bg-violet-50");
                        handleFileSelect(e.dataTransfer.files);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className="mb-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-4 py-7 transition hover:border-violet-400 hover:bg-violet-50"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-400 shadow-md">
                        <Upload size={20} className="text-white" />
                      </div>
                      <p className="text-sm font-black text-violet-700">Choose or drag files here</p>
                      <p className="text-[11px] text-gray-500">Supported: PDF, DOCX, Images · Max 200MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleFileSelect(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={uploading || !files.length}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-sm font-black text-white shadow-md transition hover:brightness-110 disabled:opacity-40"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      {uploading ? "Analyzing..." : "Analyze Paper Clips"}
                    </button>
                  </div>
                )}

                {/* ── Selected files list (shown when files picked) ── */}
                {files.length > 0 && (
                  <div className="mb-4 rounded-2xl border-2 border-violet-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">
                        Selected Files ({files.length})
                      </h4>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold text-violet-700">
                        Ready For Analysis
                      </span>
                    </div>
                    <div className="max-h-40 space-y-2 overflow-y-auto scroll-pb-2">
                      {files.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                            <FileText size={14} className="text-violet-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-black text-gray-900">{file.name}</p>
                            <p className="text-[11px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                            title="Remove file"
                            className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <X size={14} /> Clear
                      </button>
                      <button
                        onClick={handleAnalyze}
                        disabled={uploading}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-black text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
                      >
                        {uploading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                        {uploading ? "Analyzing..." : "Analyze Paper Clips"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Search bar ── */}
                {paperclips.length > 0 && activeView === "allclips" && (
                  <div className="mb-4 flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        ref={searchInputRef}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search paper clips, people, companies..."
                        aria-label="Search paper clips"
                        className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          title="Clear search"
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    <span className="shrink-0 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-black text-violet-700">
                      {filteredPaperclips.length} Clip{filteredPaperclips.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* ── Cards grid ── */}
                {paperclips.length === 0 && activeView === "allclips" ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-200 bg-violet-50">
                      <FileSearch size={28} className="text-violet-600" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">No clips yet</h2>
                    <p className="mt-2 max-w-xs text-sm text-gray-500">
                      Upload a file to analyze, or click "Load All Paper Clips" to fetch existing ones.
                    </p>
                  </div>
                ) : filteredPaperclips.length === 0 && activeView === "allclips" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileSearch size={28} className="mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No clips match your search</p>
                  </div>
                ) : activeView === "allclips" && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {paginatedPaperclips.map((item) => (
                        <PaperclipListCard
                          key={safeText(item.paperclipId) || safeText(item.fileName)}
                          item={item}
                          isActive={false}
                          onClick={() => handleSelectPaperclip(item)}
                          onAsk={() => { setAssistantTarget(item); setShowAssistant(true); }}
                        />
                      ))}
                    </div>
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        ) : (

          /* ════ DETAIL VIEW (clip selected) ════ */
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Clip header */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full border border-violet-200 bg-violet-100 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-violet-700 uppercase">
                      Analyzed
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <CalendarDays size={9} /> {formatDate(selected.uploadedAt)}
                    </span>
                  </div>
                  <h2 className="text-sm font-black leading-tight text-gray-900 sm:text-base lg:text-lg">
                    {(() => {
                      const fnames = safeText(selected.fileName).split(",").map((f) => f.trim()).filter(Boolean);
                      if (fnames.length > 1) return `${fnames[0]} + ${fnames.length - 1} more`;
                      return fnames[0] || "Paper Clip Analysis";
                    })()}
                  </h2>
                </div>

                {/* NEW — "Ask Article" removed from here; now lives in the top bar next to Back/Refresh */}
                <div className="flex gap-2 overflow-x-auto shrink-0 pb-0.5 sm:flex-wrap sm:overflow-visible">
                  <ActionChip label="Add to Clone" loading={cloneLoading} onClick={handleAddToClone} color="cyan" icon={<CheckCircle size={11} />} />
                  <ActionChip label="Blog with Paperclip" loading={formatLoading} onClick={() => handleFormatBlog(false)} color="violet" icon={<Eye size={11} />} />
                  <ActionChip label="Blog with Image" loading={formatImageLoading} onClick={() => handleFormatBlog(true)} color="lime" icon={<Newspaper size={11} />} />
                  <ActionChip label="Publish" loading={publishLoading} disabled={!blogPreview} onClick={handlePublishBlog} color="green" icon={<Send size={11} />} />
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-black transition-all duration-200 sm:px-4 sm:text-[13px] ${
                        isActive ? tabColors[tab.id].active : tabColors[tab.id].inactive
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${isActive ? "bg-white/50 text-gray-800" : "bg-gray-100 text-gray-600"}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-gray-50 p-4 pt-5 sm:p-5 sm:pt-6">

              {activeTab === "paperclip" && (
                <PaperclipTab selected={selected} setPreviewImage={setPreviewImage} />
              )}

              {activeTab === "summary" && (
                <div className="space-y-4 max-w-4xl">
                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 sm:p-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-violet-700">Short Summary</p>
                    <p className="text-sm font-semibold leading-7 text-gray-900 sm:text-base sm:leading-8">
                      {safeText(summary?.shortSummary) || "No short summary available."}
                    </p>
                  </div>
                  {summary?.detailedSummary && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-amber-600">Detailed Analysis</p>
                      <p className="whitespace-pre-line text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                        {safeText(summary.detailedSummary)}
                      </p>
                    </div>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                        <Hash size={11} /> Key Points
                      </p>
                      {(summary?.keyPoints || []).length === 0 ? (
                        <p className="text-xs text-gray-500">No key points found.</p>
                      ) : (
                        <div className="space-y-2">
                          {(summary?.keyPoints || []).map((point, i) => (
                            <div key={i} className="flex gap-2.5">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-[9px] font-black text-cyan-700">{i + 1}</span>
                              <p className="text-sm leading-6 text-gray-700">{point}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-amber-700">
                        <ClipboardList size={11} /> Action Items
                      </p>
                      {(summary?.actionItems || []).length === 0 ? (
                        <p className="text-xs text-gray-500">No action items found.</p>
                      ) : (
                        <div className="space-y-2">
                          {(summary?.actionItems || []).map((item, i) => (
                            <div key={i} className="flex gap-2.5">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-lime-50 text-[9px] font-black text-lime-700">{i + 1}</span>
                              <p className="text-sm leading-6 text-gray-700">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-600">Generated Image</p>
                      <img src={imageUrl} alt="Generated" className="w-full max-w-md rounded-xl border border-gray-200 object-cover" />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "people" && (
                <div className="max-w-4xl">
                  {people.length === 0 ? (
                    <EmptyTab icon={<Users size={24} />} text="No people identified in this clipping." />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {people.map((person, i) => (
                        <PersonCard
                          key={`${safeText(person.name)}-${i}`}
                          name={safeText(person.name) || "Unknown"}
                          designation={safeText(person.designation)}
                          company={safeText(person.company)}
                          linkedIn={getAnyLinkedIn(person)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "companies" && (
                <div className="max-w-4xl">
                  {companies.length === 0 ? (
                    <EmptyTab icon={<Building2 size={24} />} text="No companies identified in this clipping." />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {companies.map((company, i) => (
                        <CompanyCard
                          key={`${safeText(company.name)}-${i}`}
                          name={safeText(company.name) || "Unknown"}
                          website={safeText(company.website)}
                          linkedIn={getAnyLinkedIn(company)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reports" && (
                <div className="max-w-4xl">
                  {reports.length === 0 ? (
                    <EmptyTab icon={<Download size={24} />} text="No reports found in this clipping." />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {reports.map((report, i) => (
                        <div
                          key={`${safeText(report.title)}-${i}`}
                          className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-sm"
                        >
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-sky-50">
                            <Bookmark size={14} className="text-sky-600" />
                          </div>
                          <p className="text-sm font-bold text-gray-900">{safeText(report.title) || "Untitled Report"}</p>
                          <p className="mt-1 text-xs text-gray-500">{safeText(report.source) || "Source not available"}</p>
                          {isValidUrl(report.downloadUrl) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={safeText(report.downloadUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 text-[11px] font-bold text-sky-700 transition hover:bg-sky-100"
                              >
                                <ExternalLink size={11} /> View
                              </a>
                              <a
                                href={safeText(report.downloadUrl)}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-[11px] font-bold text-cyan-700 transition hover:bg-cyan-100"
                              >
                                <Download size={11} /> Download
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "blog" && (
                <div className="max-w-2xl space-y-4">
                  {blogGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="relative mb-6">
                        <div className="h-20 w-20 rounded-full border-4 border-violet-500/20 border-t-violet-400 animate-spin" />
                        <Sparkles size={28} className="absolute inset-0 m-auto text-violet-600 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">AI Formatting Blog</h3>
                      <p className="mt-3 text-sm text-gray-600">Analyzing paper clipping...</p>
                      <p className="mt-2 text-xs text-violet-600 animate-pulse">
                        Generating blog content • captions • hashtags
                      </p>
                    </div>
                  ) : publishedBlog ? (
                    <div className="rounded-2xl border border-lime-200 bg-lime-50 p-6">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100">
                        <CheckCircle size={18} className="text-lime-600" />
                      </div>
                      <p className="text-base font-black text-lime-700">Blog Published!</p>
                      <p className="mt-2 text-sm text-gray-700">
                        {publishedBlog.blogPostId ? `Post ID: ${publishedBlog.blogPostId}` : "Successfully published to platform."}
                      </p>
                    </div>
                  ) : blogPreview ? (
                    <>
                      <div className="flex justify-end mb-3">
                        <button
                          onClick={() => setIsEditingBlog(!isEditingBlog)}
                          className="px-4 py-2 rounded-xl border border-violet-300 bg-violet-50 text-violet-800 text-xs font-bold transition hover:bg-violet-100"
                        >
                          {isEditingBlog ? "Save Changes" : "Edit Blog"}
                        </button>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-600">Title</label>
                        <input
                          disabled={!isEditingBlog}
                          value={blogPreview.title || ""}
                          onChange={(e) => setBlogPreview((p) => (p ? { ...p, title: e.target.value } : p))}
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:border-violet-400 disabled:bg-gray-50 disabled:text-gray-700"
                          placeholder="Blog title"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-emerald-700">Description</label>
                        <textarea
                          disabled={!isEditingBlog}
                          value={blogPreview.description || ""}
                          onChange={(e) => setBlogPreview((p) => (p ? { ...p, description: e.target.value } : p))}
                          className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-700 outline-none focus:border-violet-400 disabled:bg-gray-50"
                          placeholder="Blog description"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-violet-700">Social Captions &amp; Hashtags</label>
                        <textarea
                          disabled={!isEditingBlog}
                          value={blogPreview.socialMediaCaptions || ""}
                          onChange={(e) => setBlogPreview((p) => (p ? { ...p, socialMediaCaptions: e.target.value } : p))}
                          className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-700 outline-none focus:border-violet-400 disabled:bg-gray-50"
                          placeholder="Social media captions and hashtags"
                        />
                      </div>
                      {(blogPreview.imageUrl || (selected?.imageUrls?.length ?? 0) > 0) && (
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-amber-600">Image</label>
                          {(selected?.imageUrls ?? []).length > 1 ? (
                            <div className="grid grid-cols-2 gap-2 max-w-sm">
                              <img src={(selected?.imageUrls ?? [])[0]} alt="" className="h-40 w-full rounded-xl object-cover border border-gray-200" />
                              <div className="relative">
                                <img src={(selected?.imageUrls ?? [])[1]} alt="" className="h-40 w-full rounded-xl object-cover border border-gray-200" />
                                {(selected?.imageUrls ?? []).length > 2 && (
                                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-900/60 text-2xl font-black text-white">
                                    +{(selected?.imageUrls ?? []).length - 2}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="relative inline-block max-w-full">
                              <img src={blogPreview.imageUrl || ""} alt="Blog" className="w-full max-w-xs rounded-xl border border-gray-200" />
                              {isImageBlog && (
                                <button
                                  onClick={handleCreateImage}
                                  disabled={imageLoading}
                                  className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-lime-400 px-3 py-1.5 text-xs font-black text-black shadow-lg hover:brightness-110 disabled:opacity-60"
                                >
                                  {imageLoading ? <Loader2 className="animate-spin" size={13} /> : <Sparkles size={13} />}
                                  Regenerate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handlePublishBlog}
                        disabled={publishLoading}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-sm font-black text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
                      >
                        {publishLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                        {publishLoading ? "Publishing..." : "Publish Blog"}
                      </button>
                    </>
                  ) : (
                    <EmptyTab icon={<Newspaper size={24} />} text='No blog preview yet. Use "Blog with Paperclip" or "Blog with Image" buttons above to generate.' />
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ── NEW — Ask Article assistant popup ── */}
   {showAssistant && assistantTarget && (
  <PaperclipAssistant
    paperclipId={safeText(assistantTarget.paperclipId)}
    articleTitle={safeText(assistantTarget.fileName)}
    articleContext={{
      fileName: assistantTarget.fileName,
      shortSummary: assistantTarget.analysis?.summary?.shortSummary,
      detailedSummary: assistantTarget.analysis?.summary?.detailedSummary,
      keyPoints: assistantTarget.analysis?.summary?.keyPoints,
      actionItems: assistantTarget.analysis?.summary?.actionItems,
      people: assistantTarget.analysis?.people,
      companies: assistantTarget.analysis?.companies,
      reports: assistantTarget.analysis?.reports,
      imageUrls: assistantTarget.imageUrls?.length
        ? assistantTarget.imageUrls
        : assistantTarget.imageUrl
        ? [assistantTarget.imageUrl]
        : [],
    }}
    onClose={() => setShowAssistant(false)}
  />
)}

      {/* ── Full-screen image preview ── */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <button
            onClick={() => setPreviewImage("")}
            title="Close preview"
            className="absolute right-5 top-16 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-xl font-bold transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

/* ── Mini components ── */

function ActionChip({ label, icon, loading, disabled, onClick, color }: {
  label: string; icon: React.ReactNode; loading?: boolean; disabled?: boolean; onClick: () => void;
  color: "cyan" | "lime" | "violet" | "green";
}) {
  const styles = {
    cyan: "border-cyan-200 bg-gradient-to-r from-cyan-500 to-sky-400 text-white shadow-sm",
    violet: "border-violet-200 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm",
    lime: "border-amber-200 bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-sm",
    green: "border-emerald-200 bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-sm",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[11px] font-bold transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${styles[color]}`}
    >
      {loading ? <Loader2 className="animate-spin" size={11} /> : icon}
      {loading ? "..." : label}
    </button>
  );
}

function PersonCard({ name, designation, company, linkedIn }: { name: string; designation?: string; company?: string; linkedIn?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50">
        <Users size={15} className="text-cyan-600" />
      </div>
      <p className="text-base font-black text-gray-900 leading-tight">{name}</p>
      {designation && <p className="mt-1 text-xs font-semibold text-cyan-700">{designation}</p>}
      {company && <p className="mt-1 text-xs text-gray-600">{company}</p>}
      {linkedIn && (
        <a href={linkedIn} target="_blank" rel="noreferrer"
          className="mt-3 inline-flex h-7 items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600 px-2.5 text-[10px] font-bold text-white transition hover:bg-blue-700">
          <LinkIcon size={10} /> LinkedIn
        </a>
      )}
    </div>
  );
}

function CompanyCard({ name, website, linkedIn }: { name: string; website?: string; linkedIn?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-lime-300 hover:shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-50">
        <Building2 size={15} className="text-lime-600" />
      </div>
      <p className="text-base font-black text-gray-900 leading-tight">{name}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {isValidUrl(website) && (
          <a href={safeText(website)} target="_blank" rel="noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 text-[10px] font-bold text-cyan-700 transition hover:bg-cyan-100">
            <Globe size={10} /> Website
          </a>
        )}
        {linkedIn && (
          <a href={linkedIn} target="_blank" rel="noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600 px-2.5 text-[10px] font-bold text-white transition hover:bg-blue-700">
            <LinkIcon size={10} /> LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyTab({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400">
        {icon}
      </div>
      <p className="max-w-xs text-sm text-gray-500">{text}</p>
    </div>
  );
}