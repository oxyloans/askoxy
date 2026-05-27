import React, { useEffect, useMemo, useRef, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const API_BASE_URL = "https://mailautomation-production.up.railway.app/api";

const PAPERCLIP_ANALYZE_API = `${API_BASE_URL}/v1/paperclip/analyze`;
const PAPERCLIP_ALL_API = `${API_BASE_URL}/v1/paperclip/all`;
const ADD_TO_CLONE_API = `${API_BASE_URL}/v1/add-to-clone`;
const IMAGE_API = `${API_BASE_URL}/v1/image`;
const BLOG_FORMAT_API = `${API_BASE_URL}/v1/blog/format`;
const BLOG_PUBLISH_API = `${API_BASE_URL}/v1/blog/publish`;

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

const toast = (icon: "success" | "error" | "warning" | "info", title: string) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2400,
    background: "#07111f",
    color: "#ffffff",
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
    2,
  );
};

const buildFallbackBlog = (item: PaperclipData, existing?: Partial<BlogPayload>): BlogPayload => {
  const summary = item.analysis?.summary;
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
    socialMediaCaptions:
      existing?.socialMediaCaptions ||
      [summary?.shortSummary, ...((summary?.keyPoints || []).slice(0, 4).map((p) => `• ${p}`))]
        .filter(Boolean)
        .join("\n"),
    addedBy: existing?.addedBy || "Radha",
    imageUrl: existing?.imageUrl || "",
    videoUrl: "",
    videoFileUrl: null,
    blogPostId: existing?.blogPostId || null,
  };
};

/* ── TAB type ── */
type Tab = "summary" | "people" | "companies" | "reports" | "blog";

export default function PaperClippingPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [paperclips, setPaperclips] = useState<PaperclipData[]>([]);
  const [selected, setSelected] = useState<PaperclipData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const [blogPreview, setBlogPreview] = useState<BlogPayload | null>(null);
  const [publishedBlog, setPublishedBlog] = useState<BlogPayload | null>(null);
  const [imageUrl, setImageUrl] = useState("");

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

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "summary", label: "Summary" },
    { id: "people", label: "People", count: people.length },
    { id: "companies", label: "Companies", count: companies.length },
    { id: "reports", label: "Reports", count: reports.length },
    { id: "blog", label: "Blog" },
  ];

  const fetchJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(text || "Invalid server response");
    }
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || `API failed: ${res.status}`);
    }
    return data;
  };

  const loadAllPaperclips = async () => {
    try {
      setListLoading(true);
      const data = await fetchJson(PAPERCLIP_ALL_API);
      const list = Array.isArray(data?.data) ? data.data : [];
      setPaperclips(list);
      if (!selected && list.length > 0) setSelected(list[0]);
      toast("success", "All paper clips loaded");
    } catch (error: any) {
      toast("error", error?.message || "Failed to load paper clips");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadAllPaperclips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAllPaperclipsPanel = async () => {
    setSidebarOpen(true);
    await loadAllPaperclips();
    window.setTimeout(() => searchInputRef.current?.focus(), 150);
  };

  const closeSidebarOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const unique = Array.from(selectedFiles).filter((f) => !existing.has(`${f.name}-${f.size}`));
      return [...prev, ...unique];
    });
  };

  const handleAnalyze = async () => {
    if (!files.length) return toast("warning", "Please choose files");
    try {
      setUploading(true);
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
        setActiveTab("summary");
        setPaperclips((prev) => {
          const existingIds = new Set(prev.map((p) => safeText(p.paperclipId)));
          const fresh = analyzedItems.filter((p) => !existingIds.has(safeText(p.paperclipId)));
          return [...fresh, ...prev];
        });
      }
      setFiles([]);
      toast("success", "Paper clipping analyzed successfully");
    } catch (error: any) {
      toast("error", error?.message || "Analyze failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectPaperclip = (item: PaperclipData) => {
    setSelected(item);
    setActiveTab("summary");
    setBlogPreview(null);
    setPublishedBlog(null);
    setImageUrl("");
    closeSidebarOnMobile();
  };

  const handleAddToClone = async () => {
    if (!selected || !entityId) return toast("warning", "Please select a paper clip");
    try {
      setCloneLoading(true);
      await fetchJson(ADD_TO_CLONE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "PAPERCLIP", editedContent: buildCloneContent(selected), confirmed: true }),
      });
      toast("success", "Added to clone successfully");
    } catch (error: any) {
      toast("error", error?.message || "Add to clone failed");
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
        selected ? { ...buildFallbackBlog(selected, prev || {}), ...(prev || {}), imageUrl: img } : prev,
      );
      toast("success", img ? "Image generated successfully" : "Image created");
    } catch (error: any) {
      toast("error", error?.message || "Image generation failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleFormatBlog = async (generateImage = false) => {
    if (!selected || !entityId) return toast("warning", "Please select a paper clip");
    try {
      setFormatLoading(true);
      setActiveTab("blog");
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "PAPERCLIP", generateImage }),
      });
      const formatted = data?.data || {};
      const fallback = buildFallbackBlog(selected, formatted);
      setBlogPreview({
        ...fallback,
        ...formatted,
        entityId,
        entityType: "PAPERCLIP",
        imageUrl: formatted?.imageUrl || imageUrl || fallback.imageUrl || "",
        videoUrl: "",
        videoFileUrl: null,
      });
      setPublishedBlog(null);
      toast("success", "Blog preview ready");
    } catch (error: any) {
      toast("error", error?.message || "Blog format failed");
    } finally {
      setFormatLoading(false);
    }
  };

  const handlePublishBlog = async () => {
    if (!blogPreview || !selected) return toast("warning", "Please generate blog preview first");
    try {
      setPublishLoading(true);
      const payload: BlogPayload = {
        ...buildFallbackBlog(selected, blogPreview),
        ...blogPreview,
        entityId,
        entityType: "PAPERCLIP",
        imageUrl: blogPreview.imageUrl || imageUrl || "",
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
      toast("success", "Blog published successfully");
    } catch (error: any) {
      toast("error", error?.message || "Blog publish failed");
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#060912] text-white">
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(94,221,242,0.09),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(167,139,250,0.08),transparent_35%)]" />

      {/* ── TOP HEADER BAR ── */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#080C18]/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/15">
            <Newspaper size={14} className="text-violet-300" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white">Paper Clipping AI</h1>
            <p className="hidden text-[10px] text-slate-500 sm:block">Analyze · Review · Publish</p>
          </div>
          {paperclips.length > 0 && (
            <span className="ml-1 rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-0.5 text-[10px] font-black text-violet-200">
              {paperclips.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAllPaperclipsPanel}
            disabled={listLoading}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 text-[11px] font-black text-violet-100 transition hover:bg-violet-300/15 disabled:opacity-50"
          >
            {listLoading ? <Loader2 className="animate-spin" size={12} /> : <FileSearch size={12} />}
            All Paper Clips
          </button>
          <button
            onClick={loadAllPaperclips}
            disabled={listLoading}
            className="hidden h-8 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-[11px] font-bold text-slate-300 transition hover:border-white/[0.12] hover:bg-white/[0.07] disabled:opacity-50 sm:inline-flex"
          >
            {listLoading ? <Loader2 className="animate-spin" size={12} /> : <RotateCcw size={12} />}
            Refresh
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.07] lg:hidden"
          >
            {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close paper clips panel"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-x-0 bottom-0 top-14 z-20 bg-black/55 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ── LEFT PANEL / MOBILE SLIDE-OVER ── */}
        <aside
          className={`fixed bottom-0 top-14 z-30 flex h-[calc(100vh-3.5rem)] w-[88vw] max-w-sm flex-col border-r border-white/[0.07] bg-[#080C18]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:h-full lg:w-72 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:bg-[#080C18]/70 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Upload zone */}
          <div className="shrink-0 border-b border-white/[0.07] p-4">
            <div className="mb-3 flex items-center justify-between lg:hidden">
              <div>
                <p className="text-xs font-black text-white">All Paper Clips</p>
                <p className="text-[10px] text-slate-500">Search and select any clipping</p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400"
              >
                <X size={14} />
              </button>
            </div>
            <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-violet-400/30 bg-violet-400/5 px-4 py-5 text-center transition hover:border-violet-400/60 hover:bg-violet-400/8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/30 to-cyan-400/20">
                <Upload size={20} className="text-violet-200" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-200">Drop files here</p>
                <p className="mt-0.5 text-[10px] text-slate-500">or click to browse</p>
              </div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => { handleFileSelect(e.target.files); e.target.value = ""; }}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {files.map((file, index) => (
                  <div key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <FileText size={12} className="shrink-0 text-violet-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-200">{file.name}</p>
                      <p className="text-[10px] text-slate-600">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                      className="rounded-full p-1 text-slate-600 hover:text-red-300 transition"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAnalyze}
                  disabled={uploading}
                  className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-xs font-black text-white shadow-[0_8px_24px_rgba(139,92,246,0.3)] transition hover:brightness-110 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin" size={13} /> : <Sparkles size={13} />}
                  {uploading ? "Analyzing..." : "Analyze Now"}
                </button>
              </div>
            )}
          </div>

          {/* Clips list */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="shrink-0 p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                <input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clips..."
                  className="h-8 w-full rounded-xl border border-white/[0.07] bg-white/[0.03] pl-7 pr-3 text-[11px] text-slate-300 outline-none placeholder:text-slate-600 focus:border-violet-400/30"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
              {listLoading ? (
                <div className="flex items-center justify-center py-8 text-xs text-slate-500">
                  <Loader2 className="mr-2 animate-spin" size={14} /> Loading...
                </div>
              ) : filteredPaperclips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileSearch size={28} className="mb-2 text-slate-700" />
                  <p className="text-xs text-slate-600">No clips found</p>
                </div>
              ) : (
                filteredPaperclips.map((item) => {
                  const isActive = selected?.paperclipId === item.paperclipId;
                  return (
                    <button
                      key={safeText(item.paperclipId) || safeText(item.fileName)}
                      onClick={() => handleSelectPaperclip(item)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? "border-violet-400/40 bg-violet-400/10 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-violet-400/20" : "bg-white/[0.04]"}`}>
                          <FileText size={12} className={isActive ? "text-violet-300" : "text-slate-500"} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-100">
                            {safeText(item.fileName) || "Untitled"}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-600">
                            <CalendarDays size={9} />
                            {formatDate(item.uploadedAt)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                            {safeText(item.analysis?.summary?.shortSummary) || "No summary"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!selected ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-400/8">
                <FileSearch size={28} className="text-violet-300" />
              </div>
              <h2 className="text-lg font-black text-white">No clip selected</h2>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Upload a file to analyze, or select an existing clip from the sidebar.
              </p>
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-400/15"
                >
                  <PanelLeftOpen size={13} /> Open Sidebar
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">

              {/* ── SELECTED CLIP HEADER ── */}
              <div className="shrink-0 border-b border-white/[0.07] bg-[#080C18]/50 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-violet-200 uppercase">
                        Analyzed
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-600">
                        <CalendarDays size={9} /> {formatDate(selected.uploadedAt)}
                      </span>
                    </div>
                    <h2 className="text-base font-black leading-tight text-white sm:text-lg">
                      {safeText(selected.fileName) || "Paper Clip Analysis"}
                    </h2>
                    {entityId && (
                      <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                        ID: {entityId}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {isValidUrl(selected.s3FileUrl) && (
                      <a
                        href={safeText(selected.s3FileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-[11px] font-bold text-slate-300 transition hover:bg-white/[0.07]"
                      >
                        <ExternalLink size={11} /> View File
                      </a>
                    )}
                    <ActionChip label="Add to Clone" loading={cloneLoading} onClick={handleAddToClone} color="cyan" icon={<CheckCircle size={11} />} />
                    <ActionChip label="Gen Image" loading={imageLoading} onClick={handleCreateImage} color="lime" icon={<ImageIcon size={11} />} />
                    <ActionChip label="Blog Preview" loading={formatLoading} onClick={() => handleFormatBlog(false)} color="violet" icon={<Eye size={11} />} />
                    <ActionChip label="Blog + Image" loading={formatLoading} onClick={() => handleFormatBlog(true)} color="violet" icon={<Newspaper size={11} />} />
                    <ActionChip
                      label="Publish"
                      loading={publishLoading}
                      disabled={!blogPreview}
                      onClick={handlePublishBlog}
                      color="green"
                      icon={<Send size={11} />}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-0.5 overflow-x-auto">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
                        activeTab === tab.id
                          ? "bg-violet-400/15 text-violet-200"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${activeTab === tab.id ? "bg-violet-400/25 text-violet-100" : "bg-white/[0.06] text-slate-500"}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TAB CONTENT ── */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">

                {/* SUMMARY TAB */}
                {activeTab === "summary" && (
                  <div className="space-y-4 max-w-4xl">
                    {/* Short summary highlight */}
                    <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/8 to-transparent p-5">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">Short Summary</p>
                      <p className="text-sm font-semibold leading-7 text-slate-200">
                        {safeText(summary?.shortSummary) || "No short summary available."}
                      </p>
                    </div>

                    {/* Detailed summary */}
                    {summary?.detailedSummary && (
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Detailed Analysis</p>
                        <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                          {safeText(summary.detailedSummary)}
                        </p>
                      </div>
                    )}

                    {/* Key points + action items in 2 columns */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          <Hash size={11} /> Key Points
                        </p>
                        {(summary?.keyPoints || []).length === 0 ? (
                          <p className="text-xs text-slate-600">No key points found.</p>
                        ) : (
                          <div className="space-y-2">
                            {(summary?.keyPoints || []).map((point, i) => (
                              <div key={i} className="flex gap-2.5">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-400/10 text-[9px] font-black text-cyan-300">
                                  {i + 1}
                                </span>
                                <p className="text-xs leading-5 text-slate-300">{point}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          <ClipboardList size={11} /> Action Items
                        </p>
                        {(summary?.actionItems || []).length === 0 ? (
                          <p className="text-xs text-slate-600">No action items found.</p>
                        ) : (
                          <div className="space-y-2">
                            {(summary?.actionItems || []).map((item, i) => (
                              <div key={i} className="flex gap-2.5">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-lime-400/10 text-[9px] font-black text-lime-300">
                                  {i + 1}
                                </span>
                                <p className="text-xs leading-5 text-slate-300">{item}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generated image */}
                    {imageUrl && (
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Generated Image</p>
                        <img src={imageUrl} alt="Generated" className="w-full max-w-md rounded-xl border border-white/10 object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* PEOPLE TAB */}
                {activeTab === "people" && (
                  <div className="max-w-4xl">
                    {people.length === 0 ? (
                      <EmptyTab icon={<Users size={24} />} text="No people identified in this clipping." />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {people.map((person, i) => {
                          const li = getAnyLinkedIn(person);
                          return (
                            <PersonCard
                              key={`${safeText(person.name)}-${i}`}
                              name={safeText(person.name) || "Unknown"}
                              designation={safeText(person.designation)}
                              company={safeText(person.company)}
                              linkedIn={li}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* COMPANIES TAB */}
                {activeTab === "companies" && (
                  <div className="max-w-4xl">
                    {companies.length === 0 ? (
                      <EmptyTab icon={<Building2 size={24} />} text="No companies identified in this clipping." />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company, i) => {
                          const li = getAnyLinkedIn(company);
                          return (
                            <CompanyCard
                              key={`${safeText(company.name)}-${i}`}
                              name={safeText(company.name) || "Unknown"}
                              website={safeText(company.website)}
                              linkedIn={li}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* REPORTS TAB */}
                {activeTab === "reports" && (
                  <div className="max-w-4xl">
                    {reports.length === 0 ? (
                      <EmptyTab icon={<Download size={24} />} text="No reports found in this clipping." />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {reports.map((report, i) => (
                          <div
                            key={`${safeText(report.title)}-${i}`}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-white/[0.10]"
                          >
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04]">
                              <Bookmark size={14} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-bold text-white">
                              {safeText(report.title) || "Untitled Report"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {safeText(report.source) || "Source not available"}
                            </p>
                            {isValidUrl(report.downloadUrl) && (
                              <a
                                href={safeText(report.downloadUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 text-[11px] font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                              >
                                <Download size={11} /> Download
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* BLOG TAB */}
                {activeTab === "blog" && (
                  <div className="max-w-2xl space-y-4">
                    {publishedBlog ? (
                      <div className="rounded-2xl border border-lime-400/25 bg-lime-400/8 p-6">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/15">
                          <CheckCircle size={18} className="text-lime-300" />
                        </div>
                        <p className="text-base font-black text-lime-100">Blog Published!</p>
                        <p className="mt-2 text-sm text-slate-400">
                          {publishedBlog.blogPostId ? `Post ID: ${publishedBlog.blogPostId}` : "Successfully published to platform."}
                        </p>
                      </div>
                    ) : blogPreview ? (
                      <>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</label>
                          <input
                            value={blogPreview.title || ""}
                            onChange={(e) => setBlogPreview((p) => (p ? { ...p, title: e.target.value } : p))}
                            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                            placeholder="Blog title"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                          <textarea
                            value={blogPreview.description || ""}
                            onChange={(e) => setBlogPreview((p) => (p ? { ...p, description: e.target.value } : p))}
                            className="min-h-[180px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                            placeholder="Blog description"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Social Captions</label>
                          <textarea
                            value={blogPreview.socialMediaCaptions || ""}
                            onChange={(e) => setBlogPreview((p) => (p ? { ...p, socialMediaCaptions: e.target.value } : p))}
                            className="min-h-[120px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                            placeholder="Social media captions"
                          />
                        </div>
                        {blogPreview.imageUrl && (
                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Image</label>
                            <img src={blogPreview.imageUrl} alt="Blog" className="w-full max-w-xs rounded-xl border border-white/10" />
                          </div>
                        )}
                        <button
                          onClick={handlePublishBlog}
                          disabled={publishLoading}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-sm font-black text-white shadow-[0_8px_24px_rgba(139,92,246,0.3)] transition hover:brightness-110 disabled:opacity-50"
                        >
                          {publishLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                          {publishLoading ? "Publishing..." : "Publish Blog"}
                        </button>
                      </>
                    ) : (
                      <EmptyTab
                        icon={<Newspaper size={24} />}
                        text="No blog preview yet. Use Blog Preview or Blog + Image buttons above to generate."
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mini components ── */

function ActionChip({
  label,
  icon,
  loading,
  disabled,
  onClick,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  color: "cyan" | "lime" | "violet" | "green";
}) {
  const styles = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15",
    lime: "border-lime-400/25 bg-lime-400/10 text-lime-200 hover:bg-lime-400/15",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-200 hover:bg-violet-400/15",
    green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[color]}`}
    >
      {loading ? <Loader2 className="animate-spin" size={11} /> : icon}
      {loading ? "..." : label}
    </button>
  );
}

function PersonCard({ name, designation, company, linkedIn }: { name: string; designation?: string; company?: string; linkedIn?: string }) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10">
        <Users size={15} className="text-cyan-300" />
      </div>
      <p className="text-sm font-black text-white">{name}</p>
      {designation && <p className="mt-1 text-xs text-slate-400">{designation}</p>}
      {company && <p className="mt-0.5 text-xs text-slate-500">{company}</p>}
      {linkedIn && (
        <a
          href={linkedIn}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-7 items-center gap-1.5 rounded-lg border border-blue-400/20 bg-blue-400/10 px-2.5 text-[10px] font-bold text-blue-200 transition hover:bg-blue-400/15"
        >
          <LinkIcon size={10} /> LinkedIn
        </a>
      )}
    </div>
  );
}

function CompanyCard({ name, website, linkedIn }: { name: string; website?: string; linkedIn?: string }) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-lime-400/20 hover:bg-white/[0.04]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-400/10">
        <Building2 size={15} className="text-lime-300" />
      </div>
      <p className="text-sm font-black text-white">{name}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {isValidUrl(website) && (
          <a
            href={safeText(website)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-2.5 text-[10px] font-bold text-cyan-200 transition hover:bg-cyan-300/15"
          >
            <Globe size={10} /> Website
          </a>
        )}
        {linkedIn && (
          <a
            href={linkedIn}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-blue-400/20 bg-blue-400/10 px-2.5 text-[10px] font-bold text-blue-200 transition hover:bg-blue-400/15"
          >
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
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-600">
        {icon}
      </div>
      <p className="max-w-xs text-sm text-slate-500">{text}</p>
    </div>
  );
}
