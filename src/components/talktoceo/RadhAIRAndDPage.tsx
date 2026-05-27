import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  Upload,
  Video,
  FileText,
  CheckCircle,
  Brain,
  Loader2,
  Newspaper,
  Image,
  Send,
  Edit3,
  Save,
  RotateCcw,
  Eye,
  Bot,  
  Wand2,
  Cpu,
  Zap,
  Layers,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = "https://mailautomation-production.up.railway.app/api";
const FILE_BASE_URL = "https://meta.oxyloans.com/radha-ai/files";

const VIDEO_SUBMIT_API = `${API_BASE_URL}/v1/video/submit`;
const ADD_TO_CLONE_API = `${API_BASE_URL}/v1/add-to-clone`;
const IMAGE_API = `${API_BASE_URL}/v1/image`;
const BLOG_FORMAT_API = `${API_BASE_URL}/v1/blog/format`;
const BLOG_PUBLISH_API = `${API_BASE_URL}/v1/blog/publish`;

type EntityType = "VIDEO" | "CONTENT";
type BlogMode = "WITH_IMAGE" | "VIDEO_ONLY";

type BlogPayload = {
  entityId?: string;
  entityType?: EntityType;
  title?: string;
  description?: string;
  socialMediaCaptions?: string;
  addedBy?: string;
  videoUrl?: string;
  videoFileUrl?: string | null;
  imageUrl?: string | null;
  status?: string;
  blogPostId?: string | null;
};

type VideoData = {
  id?: number | string;
  entityId?: string;
  entityType?: EntityType;
  videoId?: string;
  originalFileName?: string;
  visualContent?: string;
  reasoningNotes?: string;
  reasonedContent?: string;
  approvedContent?: string;
  title?: string;
  summary?: string;
  intro?: string;
  body?: string;
  closing?: string;
  status?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoFileUrl?: string | null;
  imageUrl?: string | null;
  blogPostId?: string | null;
  addedToClone?: boolean;
  blogPublished?: boolean;
};

const toast = (icon: "success" | "warning" | "error" | "info", title: string) =>
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

const normalizeText = (value?: string | null) => String(value || "").trim();

const getEntityId = (data: any) =>
  String(data?.entityId || data?.videoId || data?.id || "").trim();

const pickImageUrl = (data: any): string => {
  if (!data) return "";
  if (typeof data === "string") return data;

  return String(
    data?.imageUrl ||
      data?.url ||
      data?.generatedImageUrl ||
      data?.fileUrl ||
      data?.path ||
      data?.imagePath ||
      data?.data?.imageUrl ||
      data?.data?.url ||
      data?.data?.generatedImageUrl ||
      data?.data?.fileUrl ||
      data?.data?.path ||
      "",
  ).trim();
};

const getFileUrl = (url?: string | null) => {
  const value = String(url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${FILE_BASE_URL}${value}`;
  return `${FILE_BASE_URL}/${value}`;
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const fillBlogPreview = (
  preview: BlogPayload,
  videoData: VideoData | null,
  entityId: string,
  mode: BlogMode,
): BlogPayload => {
  const title =
    normalizeText(preview.title) ||
    normalizeText(videoData?.title) ||
    "RadhAI Video Blog";

  const description =
    normalizeText(preview.description) ||
    normalizeText(videoData?.summary) ||
    normalizeText(videoData?.reasonedContent) ||
    normalizeText(videoData?.reasoningNotes) ||
    "AI-generated blog preview from the uploaded video.";

  const captions =
    normalizeText(preview.socialMediaCaptions) ||
    `${title}\n\n${description.slice(0, 220)}${description.length > 220 ? "..." : ""}`;

  return {
    ...preview,
    entityId: getEntityId(preview) || entityId,
    entityType: "VIDEO",
    title,
    description,
    socialMediaCaptions: captions,
    addedBy: normalizeText(preview.addedBy) || "Radha",
    imageUrl:
      mode === "WITH_IMAGE"
        ? getFileUrl(preview.imageUrl || videoData?.imageUrl || "")
        : getFileUrl(preview.imageUrl || ""),
    videoUrl: preview.videoUrl || videoData?.videoUrl || "",
    videoFileUrl: preview.videoFileUrl || videoData?.videoFileUrl || null,
  };
};

export default function RadhAIRAndDPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [blogPreview, setBlogPreview] = useState<BlogPayload | null>(null);
  const [publishedBlog, setPublishedBlog] = useState<BlogPayload | null>(null);
  const [selectedBlogMode, setSelectedBlogMode] = useState<BlogMode | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const entityId = useMemo(() => (videoData ? getEntityId(videoData) : ""), [videoData]);

  const titleText = useMemo(
    () => normalizeText(videoData?.title) || "Untitled Video Analysis",
    [videoData?.title],
  );

  const displayContent = useMemo(() => {
    if (!videoData) return "";

    const reasoning =
      normalizeText(videoData.reasonedContent) ||
      normalizeText(videoData.reasoningNotes) ||
      normalizeText(videoData.approvedContent);
    const visual = normalizeText(videoData.visualContent);
    const summary = normalizeText(videoData.summary);

    return [
      reasoning && `AI Video Analysis:\n${reasoning}`,
      visual && `Visual Content:\n${visual}`,
      summary && `Summary:\n${summary}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [videoData]);

  useEffect(() => {
    if (displayContent) setEditedContent(displayContent);
  }, [displayContent]);

  useEffect(() => {
    document.body.style.overflow = isPreviewModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPreviewModalOpen]);

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

  const resetPage = () => {
    setVideoFile(null);
    setVideoData(null);
    setEditedContent("");
    setIsEditingContent(false);
    setBlogPreview(null);
    setPublishedBlog(null);
    setSelectedBlogMode(null);
    setIsPreviewModalOpen(false);
  };

  const handleVideoSubmit = async () => {
    if (!videoFile) return toast("warning", "Please choose a video file");

    try {
      setLoading(true);
      setVideoData(null);
      setBlogPreview(null);
      setPublishedBlog(null);
      setSelectedBlogMode(null);
      setIsPreviewModalOpen(false);
      setEditedContent("");
      setIsEditingContent(false);

      const formData = new FormData();
      formData.append("videoFile", videoFile);

      const data = await fetchJson(VIDEO_SUBMIT_API, {
        method: "POST",
        body: formData,
      });

      setVideoData(data?.data || null);
      toast("success", "Video analysis completed");
    } catch (error: any) {
      console.error("Video submit error:", error);
      toast("error", error?.message || "Video submit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToClone = async () => {
    if (!entityId) return toast("warning", "Entity ID missing from response");

    try {
      setCloneLoading(true);
      await fetchJson(ADD_TO_CLONE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          entityType: "VIDEO",
          editedContent,
          confirmed: true,
        }),
      });

      setVideoData((prev) => (prev ? { ...prev, addedToClone: true } : prev));
      toast("success", "Added to clone");
    } catch (error: any) {
      toast("error", error?.message || "Add to clone failed");
    } finally {
      setCloneLoading(false);
    }
  };

  const handleCreateImage = async () => {
    if (!entityId) return toast("warning", "Entity ID missing from response");

    try {
      setImageLoading(true);
      const data = await fetchJson(
        `${IMAGE_API}/${encodeURIComponent(entityId)}?entityType=VIDEO`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityId, entityType: "VIDEO" }),
        },
      );

      const imageData = data?.data ?? data;
      const nextImageUrl = getFileUrl(pickImageUrl(imageData));

      setVideoData((prev) =>
        prev
          ? {
              ...prev,
              entityId: getEntityId(imageData) || entityId,
              imageUrl: nextImageUrl || prev.imageUrl,
              status: imageData?.status || prev.status,
            }
          : prev,
      );

      setBlogPreview(null);
      setSelectedBlogMode(null);
      setPublishedBlog(null);
      setIsPreviewModalOpen(false);

      toast(
        nextImageUrl ? "success" : "warning",
        nextImageUrl
          ? "Image generated. Now create blog preview."
          : "Image generated, but image URL was not returned",
      );
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast("error", error?.message || "Image generation failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleFormatBlog = async (generateImage: boolean) => {
    if (!entityId) return toast("warning", "Entity ID missing from response");

    if (generateImage && !videoData?.imageUrl) {
      return toast("warning", "Please create image first");
    }

    try {
      setFormatLoading(true);
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          entityType: "VIDEO",
          generateImage,
        }),
      });

      const formattedData = data?.data || {};
      const nextMode: BlogMode = generateImage ? "WITH_IMAGE" : "VIDEO_ONLY";
      const preparedPreview = fillBlogPreview(
        {
          ...formattedData,
          entityId: getEntityId(formattedData) || entityId,
          entityType: "VIDEO",
          imageUrl: generateImage
            ? getFileUrl(pickImageUrl(formattedData) || videoData?.imageUrl || "")
            : getFileUrl(pickImageUrl(formattedData) || ""),
          videoUrl: formattedData?.videoUrl || videoData?.videoUrl || "",
          videoFileUrl: formattedData?.videoFileUrl || videoData?.videoFileUrl || null,
        },
        videoData,
        entityId,
        nextMode,
      );

      setSelectedBlogMode(nextMode);
      setBlogPreview(preparedPreview);
      setPublishedBlog(null);
      setIsPreviewModalOpen(true);
      toast("success", generateImage ? "Image blog preview ready" : "Video blog preview ready");
    } catch (error: any) {
      console.error("Blog format error:", error);
      toast("error", error?.message || "Blog preview failed");
    } finally {
      setFormatLoading(false);
    }
  };

  const handlePublishBlog = async () => {
    if (!blogPreview) return toast("warning", "Generate blog preview first");

    const safePreview = fillBlogPreview(
      blogPreview,
      videoData,
      entityId,
      selectedBlogMode || "VIDEO_ONLY",
    );

    if (!normalizeText(safePreview.title) || !normalizeText(safePreview.description)) {
      return toast("warning", "Blog title and description are required");
    }

    try {
      setPublishLoading(true);

      const payload: BlogPayload = fillBlogPreview(
        {
          ...safePreview,
          entityId: getEntityId(safePreview) || entityId,
          entityType: "VIDEO",
          imageUrl:
            selectedBlogMode === "WITH_IMAGE"
              ? safePreview.imageUrl || videoData?.imageUrl || ""
              : safePreview.imageUrl || "",
          videoUrl: safePreview.videoUrl || videoData?.videoUrl || "",
          videoFileUrl: safePreview.videoFileUrl || videoData?.videoFileUrl || null,
          status: "PUBLISHED",
        },
        videoData,
        entityId,
        selectedBlogMode || "VIDEO_ONLY",
      );

      const data = await fetchJson(BLOG_PUBLISH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const publishedData = data?.data || payload;
      setPublishedBlog(publishedData);
      setBlogPreview(null);
      setIsPreviewModalOpen(false);
      setVideoData((prev) =>
        prev
          ? {
              ...prev,
              blogPublished: true,
              status: publishedData?.status || "PUBLISHED",
              blogPostId: publishedData?.blogPostId || "POSTED SUCCESSFULLY",
              imageUrl: publishedData?.imageUrl || prev.imageUrl,
            }
          : prev,
      );

      toast("success", "Blog posted successfully");
    } catch (error: any) {
      toast("error", error?.message || "Blog publish failed");
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A16] px-3 py-3 text-white sm:px-5 lg:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(94,221,242,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(182,242,105,0.10),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(143,116,255,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:38px_38px]" />

      <main className="relative z-10 mx-auto w-full max-w-[1340px]">
        <HeroHeader onReset={resetPage} hasData={Boolean(videoData || videoFile)} />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
          <div className="space-y-4">
            <Card
              icon={<Video size={21} />}
              title="R&D Video Upload"
              desc="Upload video, review AI reasoning, save to clone, create blog preview, and publish."
            >
              {!loading && !videoData && (
                <UploadControlPanel
                  file={videoFile}
                  loading={loading}
                  onSelect={setVideoFile}
                  onClear={resetPage}
                  onSubmit={handleVideoSubmit}
                />
              )}

              <AnimatePresence>{loading && <AIReasoningLoader />}</AnimatePresence>

              {videoData && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <TopWorkflowActions
                    cloneLoading={cloneLoading}
                    imageLoading={imageLoading}
                    formatLoading={formatLoading}
                    publishLoading={publishLoading}
                    canUseEntity={Boolean(entityId)}
                    canPublish={Boolean(blogPreview) && !publishedBlog}
                    addedToClone={Boolean(videoData.addedToClone)}
                    imageReady={Boolean(videoData.imageUrl || blogPreview?.imageUrl)}
                    blogReady={Boolean(blogPreview)}
                    published={Boolean(publishedBlog)}
                    selectedBlogMode={selectedBlogMode}
                    onAddToClone={handleAddToClone}
                    onCreateImage={handleCreateImage}
                    onFormatBlog={() => handleFormatBlog(true)}
                    onFormatBlogWithVideo={() => handleFormatBlog(false)}
                    onPublishBlog={handlePublishBlog}
                    onOpenPreview={() => setIsPreviewModalOpen(true)}
                  />

                  <TitleOnly title={titleText} status={videoData.status} entityId={entityId} />

                  <ReasoningEditor
                    value={editedContent}
                    isEditing={isEditingContent}
                    onChange={setEditedContent}
                    onToggle={() => setIsEditingContent((v) => !v)}
                  />

                  <CompactSelectedVideo file={videoFile} onNew={resetPage} />
                </motion.div>
              )}
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-3 xl:self-start">
            <Card
              icon={<Eye size={21} />}
              title={publishedBlog ? "Blog Published" : "Quick Preview"}
              desc={publishedBlog ? "Blog posted successfully." : "Generated image and blog preview status."}
            >
              {publishedBlog ? (
                <PublishedState
                  blogPostId={publishedBlog.blogPostId || "POSTED SUCCESSFULLY"}
                  onReset={resetPage}
                />
              ) : !videoData?.imageUrl && !blogPreview ? (
                <EmptyState
                  icon={<Newspaper size={26} />}
                  title="Preview waiting"
                  text="After video reasoning, use CEO actions to create an image or blog preview."
                />
              ) : (
                <div className="space-y-3">
                  {(blogPreview?.imageUrl || videoData?.imageUrl) && (
                    <ImagePreviewBox imageUrl={blogPreview?.imageUrl || videoData?.imageUrl || ""} />
                  )}

                  {blogPreview ? (
                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-4 text-sm font-black text-black shadow-[0_16px_35px_rgba(94,221,242,0.16)]"
                    >
                      <Eye size={16} />
                      Open Blog Preview
                    </button>
                  ) : (
                    <ActionQuestion
                      text="Image is ready. Create a blog preview now."
                      button="Create Blog Preview"
                      loading={formatLoading}
                      onClick={() => handleFormatBlog(true)}
                    />
                  )}
                </div>
              )}
            </Card>

            <StatusGuide
              videoReady={Boolean(videoData)}
              cloneReady={Boolean(videoData?.addedToClone)}
              imageReady={Boolean(videoData?.imageUrl)}
              blogReady={Boolean(blogPreview)}
              published={Boolean(publishedBlog)}
            />
          </aside>
        </section>
      </main>

      <BlogPreviewModal
        open={isPreviewModalOpen}
        preview={blogPreview}
        imageUrl={blogPreview?.imageUrl || videoData?.imageUrl || ""}
        mode={selectedBlogMode}
        publishLoading={publishLoading}
        onClose={() => setIsPreviewModalOpen(false)}
        onPublish={handlePublishBlog}
        onChange={(next) =>
          setBlogPreview(
            fillBlogPreview(next, videoData, entityId, selectedBlogMode || "VIDEO_ONLY"),
          )
        }
      />
    </div>
  );
}

function HeroHeader({ onReset, hasData }: { onReset: () => void; hasData: boolean }) {
  return (
    <div className="mb-4 overflow-hidden rounded-3xl border border-white/10 bg-[#101827]/75 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-100">
            <Sparkles size={13} /> RadhAI Admin R&D
          </div>
          <h1 className="text-xl font-black leading-tight text-white sm:text-2xl lg:text-3xl">
            Video Upload to Clone & Blog Workflow
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Upload a video, review AI reasoning, add it to clone, create image or blog preview, and publish from one responsive screen.
          </p>
        </div>

        {hasData && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-slate-200 hover:border-cyan-300/40 sm:w-auto"
          >
            <RotateCcw size={16} />
            Start New
          </button>
        )}
      </div>
    </div>
  );
}

function UploadControlPanel({
  file,
  loading,
  onSelect,
  onClear,
  onSubmit,
}: {
  file: File | null;
  loading: boolean;
  onSelect: (file: File | null) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cyan-300/15 bg-[#08111f]/80 p-3 sm:p-4"
    >
      <label className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/25 bg-cyan-300/10 p-5 text-center transition hover:border-cyan-300/60 sm:min-h-[185px]">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black shadow-[0_16px_45px_rgba(94,221,242,0.22)]">
          <Upload size={24} />
        </span>
        <span className="max-w-full truncate text-sm font-black text-cyan-50 sm:text-base">
          {file ? file.name : "Choose or drag video file"}
        </span>
        <span className="mt-1 text-xs font-semibold text-slate-500">
          {file ? formatBytes(file.size) : "Supported: MP4, MOV, WebM and other video formats"}
        </span>
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0] || null)}
        />
      </label>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_140px]">
        <button
          onClick={onSubmit}
          disabled={!file || loading}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-sm font-black text-black shadow-[0_18px_45px_rgba(94,221,242,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
          {loading ? "Processing" : "Submit Video"}
        </button>

        <button
          onClick={onClear}
          type="button"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0B1020] px-4 text-sm font-black text-slate-200 hover:border-cyan-300/40"
        >
          <RotateCcw size={15} />
          Clear
        </button>
      </div>
    </motion.div>
  );
}

function CompactSelectedVideo({ file, onNew }: { file: File | null; onNew: () => void }) {
  if (!file) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#08111f]/80 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100">
          <Video size={15} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-slate-100">{file.name}</p>
          <p className="text-[11px] font-semibold text-slate-500">
            {formatBytes(file.size) || "Video selected for this reasoning session"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNew}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0B1020] px-3 text-xs font-black text-slate-200 hover:border-cyan-300/40"
      >
        <RotateCcw size={14} />
        New Video
      </button>
    </div>
  );
}

function TopWorkflowActions({
  cloneLoading,
  imageLoading,
  formatLoading,
  publishLoading,
  canUseEntity,
  canPublish,
  addedToClone,
  imageReady,
  blogReady,
  published,
  selectedBlogMode,
  onAddToClone,
  onCreateImage,
  onFormatBlog,
  onFormatBlogWithVideo,
  onPublishBlog,
  onOpenPreview,
}: {
  cloneLoading: boolean;
  imageLoading: boolean;
  formatLoading: boolean;
  publishLoading: boolean;
  canUseEntity: boolean;
  canPublish: boolean;
  addedToClone: boolean;
  imageReady: boolean;
  blogReady: boolean;
  published: boolean;
  selectedBlogMode: BlogMode | null;
  onAddToClone: () => void;
  onCreateImage: () => void;
  onFormatBlog: () => void;
  onFormatBlogWithVideo: () => void;
  onPublishBlog: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <div className="sticky top-2 z-20 w-full rounded-3xl border border-cyan-300/15 bg-[#08111f]/95 p-2.5 shadow-[0_14px_42px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-3">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex min-w-0 items-center gap-2 text-xs font-black text-lime-100 sm:text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-300/10 text-lime-200">
            <Wand2 size={14} />
          </span>
          CEO Actions
        </p>
        {blogReady && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black text-cyan-100"
          >
            Open Preview
          </button>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <TopActionButton
          title={addedToClone ? "Saved to Clone" : "Save to Clone"}
          desc="Approve final reasoning"
          icon={<CheckCircle size={16} />}
          loading={cloneLoading}
          disabled={!canUseEntity || addedToClone}
          active={addedToClone}
          onClick={onAddToClone}
        />

        <TopActionButton
          title={imageReady ? "Image Ready" : "Create Image"}
          desc="Generate blog image"
          icon={<Image size={16} />}
          loading={imageLoading}
          disabled={!canUseEntity || imageReady}
          active={imageReady}
          onClick={onCreateImage}
        />

        <TopActionButton
          title={selectedBlogMode === "WITH_IMAGE" ? "Image Blog Ready" : "Blog With Image"}
          desc="Preview with image"
          icon={<FileText size={16} />}
          loading={formatLoading}
          disabled={!canUseEntity || !imageReady || (blogReady && selectedBlogMode === "WITH_IMAGE")}
          active={blogReady && selectedBlogMode === "WITH_IMAGE"}
          onClick={onFormatBlog}
        />

        <TopActionButton
          title={selectedBlogMode === "VIDEO_ONLY" ? "Video Blog Ready" : "Blog With Video"}
          desc="Use uploaded video"
          icon={<PlayCircle size={16} />}
          loading={formatLoading}
          disabled={!canUseEntity || (blogReady && selectedBlogMode === "VIDEO_ONLY")}
          active={blogReady && selectedBlogMode === "VIDEO_ONLY"}
          onClick={onFormatBlogWithVideo}
        />

        <TopActionButton
          title={published ? "Published" : "Publish Blog"}
          desc="Post final blog"
          icon={<Newspaper size={16} />}
          loading={publishLoading}
          disabled={!canPublish || published}
          active={published}
          onClick={onPublishBlog}
        />
      </div>
    </div>
  );
}

function TopActionButton({
  title,
  desc,
  icon,
  loading,
  disabled,
  active,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      onClick={onClick}
      className={`group flex min-h-[72px] w-full min-w-0 items-start justify-start gap-3 rounded-2xl px-2.5 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-45 sm:px-3 ${
        active
          ? "border border-lime-300/30 bg-lime-300/12 text-lime-100"
          : "border border-white/10 bg-[#111827]/95 text-slate-200 hover:border-cyan-300/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          active ? "bg-lime-300/15 text-lime-100" : "bg-cyan-300/10 text-cyan-100"
        }`}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-[11px] font-black leading-4 sm:text-xs">
          {loading ? "Processing..." : title}
        </span>
        <span className="mt-1 block break-words text-[10px] font-semibold leading-4 text-slate-400">
          {desc}
        </span>
      </span>
    </motion.button>
  );
}

function TitleOnly({ title, status, entityId }: { title: string; status?: string; entityId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#0B1020]/75 p-3"
    >
      <div className="mb-2 flex flex-wrap gap-2">
        {status && (
          <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-lime-100">
            {status}
          </span>
        )}
        {entityId && (
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-black text-cyan-100">
            ID: {entityId}
          </span>
        )}
      </div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Title</p>
      <h3 className="break-words text-base font-black leading-7 text-white sm:text-lg">{title}</h3>
    </motion.div>
  );
}

function ReasoningEditor({
  value,
  isEditing,
  onChange,
  onToggle,
}: {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1020]/75 p-3">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-cyan-100">
            <Bot size={16} /> AI Video Analysis
          </p>
          <p className="mt-1 text-xs text-slate-500">Review and edit before saving to clone.</p>
        </div>

        <motion.button
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onToggle}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 text-xs font-black text-cyan-100"
        >
          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          {isEditing ? "Save View" : "Edit"}
        </motion.button>
      </div>

      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[280px] w-full resize-y rounded-2xl border border-cyan-300/20 bg-[#070A16] p-3 text-sm leading-7 text-white outline-none focus:border-cyan-300/60"
        />
      ) : (
        <div className="max-h-[440px] overflow-y-auto rounded-2xl border border-white/10 bg-[#070A16]/70 p-3">
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {value || "No AI reasoning or summary available."}
          </p>
        </div>
      )}
    </div>
  );
}

function BlogPreviewModal({
  open,
  preview,
  imageUrl,
  mode,
  publishLoading,
  onClose,
  onPublish,
  onChange,
}: {
  open: boolean;
  preview: BlogPayload | null;
  imageUrl: string;
  mode: BlogMode | null;
  publishLoading: boolean;
  onClose: () => void;
  onPublish: () => void;
  onChange: (data: BlogPayload) => void;
}) {
  if (!open || !preview) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/80 px-3 py-3 backdrop-blur-md sm:px-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          className="relative flex max-h-[94vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020] shadow-[0_35px_120px_rgba(0,0,0,0.7)]"
        >
          <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-white/10 bg-[#0B1020]/95 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div>
              <p className="flex items-center gap-2 text-base font-black text-white">
                <Newspaper size={18} className="text-cyan-200" />
                Review & Publish Blog
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {mode === "WITH_IMAGE" ? "Image blog preview" : "Uploaded video blog preview"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onPublish}
                disabled={publishLoading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-4 text-xs font-black text-black disabled:opacity-50"
              >
                {publishLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                Publish Blog
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-black text-slate-200 hover:border-red-300/40"
              >
                <X size={15} />
                Close
              </button>
            </div>
          </div>

          <div className="grid flex-1 gap-4 overflow-y-auto p-3 sm:p-4 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-3">
              <ImagePreviewBox imageUrl={imageUrl || preview.imageUrl || ""} large />

              {(imageUrl || preview.imageUrl) && (
                <a
                  href={getFileUrl(imageUrl || preview.imageUrl || "")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 text-xs font-black text-cyan-100"
                >
                  <ExternalLink size={14} />
                  Open Image URL
                </a>
              )}

              {mode === "VIDEO_ONLY" && (
                <InfoBox
                  icon={<Video size={17} />}
                  title="Video blog mode"
                  text="This blog will be published using the uploaded video flow. Image is optional for this mode."
                />
              )}
            </div>

            <EditablePreview data={preview} onChange={onChange} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ImagePreviewBox({ imageUrl, large = false }: { imageUrl: string; large?: boolean }) {
  const src = getFileUrl(imageUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src) {
    return (
      <div
        className={`flex ${large ? "min-h-[310px]" : "min-h-[190px]"} items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#07111f]/70 p-4 text-center text-xs text-slate-500`}
      >
        No image URL available
      </div>
    );
  }

  if (failed) {
    return (
      <div
        className={`flex ${large ? "min-h-[310px]" : "min-h-[190px]"} flex-col items-center justify-center rounded-2xl border border-dashed border-yellow-300/20 bg-yellow-300/5 p-4 text-center`}
      >
        <AlertTriangle size={28} className="mb-2 text-yellow-200" />
        <p className="text-xs font-bold text-yellow-100">Image preview could not load.</p>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-yellow-300/15 px-3 text-xs font-black text-yellow-100"
        >
          <ExternalLink size={14} /> Open URL
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
      <img
        src={src}
        alt="Generated blog preview"
        className={`${large ? "max-h-[430px]" : "max-h-[290px]"} w-full bg-black/20 object-contain`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function Card({
  children,
  icon,
  title,
  desc,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#101827]/90 p-3 shadow-xl backdrop-blur-xl sm:p-4">
      <div className="mb-4 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-black leading-tight">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">{desc}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ActionQuestion({
  text,
  button,
  loading,
  onClick,
}: {
  text: string;
  button: string;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-3">
      <p className="mb-3 text-sm font-bold text-cyan-50">{text}</p>
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
        {button}
      </button>
    </div>
  );
}

function EditablePreview({ data, onChange }: { data: BlogPayload; onChange: (data: BlogPayload) => void }) {
  const update = (key: keyof BlogPayload, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-3">
      <InputField label="Blog Title" value={data.title || ""} onChange={(v) => update("title", v)} />
      <TextareaField label="Description" value={data.description || ""} onChange={(v) => update("description", v)} />
      <TextareaField label="Social Media Captions" value={data.socialMediaCaptions || ""} onChange={(v) => update("socialMediaCaptions", v)} />
      <InputField label="Added By" value={data.addedBy || "Radha"} onChange={(v) => update("addedBy", v)} />
      <InputField label="Image URL" value={getFileUrl(data.imageUrl)} onChange={(v) => update("imageUrl", v)} />
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-white/10 bg-[#07111f] px-3 text-sm text-white outline-none focus:border-cyan-300/50"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[118px] w-full resize-y rounded-2xl border border-white/10 bg-[#07111f] p-3 text-sm leading-6 text-white outline-none focus:border-cyan-300/50"
      />
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0B1020]/50 p-6 text-center">
      <div>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-200">
          {icon}
        </div>
        <h3 className="text-sm font-black text-slate-200">{title}</h3>
        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function PublishedState({ blogPostId, onReset }: { blogPostId: string; onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-6 text-center">
      <CheckCircle className="mx-auto mb-3 text-lime-300" size={46} />
      <h3 className="text-lg font-black text-lime-100">Blog Posted Successfully</h3>
      <p className="mt-2 break-words text-sm text-slate-300">{blogPostId}</p>
      <button
        onClick={onReset}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-5 text-sm font-black text-black"
      >
        <RotateCcw size={16} />
        Refresh / Start New
      </button>
    </div>
  );
}

function StatusGuide({
  videoReady,
  cloneReady,
  imageReady,
  blogReady,
  published,
}: {
  videoReady: boolean;
  cloneReady: boolean;
  imageReady: boolean;
  blogReady: boolean;
  published: boolean;
}) {
  const rows = [
    { label: "Video analysis", ready: videoReady },
    { label: "Saved to clone", ready: cloneReady },
    { label: "Image generated", ready: imageReady },
    { label: "Blog preview", ready: blogReady },
    { label: "Blog published", ready: published },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101827]/80 p-4 backdrop-blur-xl">
      <p className="mb-3 flex items-center gap-2 text-sm font-black text-slate-100">
        <ShieldCheck size={16} className="text-lime-200" /> Workflow Status
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#07111f]/65 px-3 py-2">
            <span className="text-xs font-bold text-slate-300">{row.label}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${row.ready ? "bg-lime-300/15 text-lime-100" : "bg-slate-500/15 text-slate-400"}`}>
              {row.ready ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoBox({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-3">
      <p className="flex items-center gap-2 text-xs font-black text-cyan-100">
        {icon} {title}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

const REASONING_STEPS = [
  { icon: Brain, label: "Reading video context", color: "text-[#5EDDF2]" },
  { icon: Cpu, label: "Analyzing AI reasoning", color: "text-[#B9A7FF]" },
  { icon: Layers, label: "Preparing summary", color: "text-[#B6F269]" },
  { icon: Zap, label: "Polishing final output", color: "text-yellow-300" },
];

function AIReasoningLoader() {
  return (
    <motion.div
      key="reasoning"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[310px] flex-col items-center justify-center rounded-3xl border border-[#5EDDF2]/20 bg-[#0B1020]/70 p-5 sm:min-h-[390px] sm:p-8"
    >
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-[#5EDDF2]/30"
            animate={{ scale: [1, 1.18 + i * 0.12, 1], opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 2.2, delay: i * 0.55, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />

        <motion.span
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#B6F269]"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-lime-400/20"
        >
          <Brain size={22} className="text-[#7DEBFF]" />
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-1 bg-gradient-to-r from-cyan-200 via-lime-200 to-cyan-300 bg-clip-text text-base font-black text-transparent"
      >
        AI Video Analysis
      </motion.p>

      <p className="mb-8 text-xs text-[#78859A]">Uploading and analyzing your video content&hellip;</p>

      <div className="w-full max-w-xs space-y-3 sm:max-w-sm">
        {REASONING_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border border-[#303A4E]/60 bg-[#1A2230]/70 px-4 py-3"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }}
              className={color}
            >
              <Icon size={16} />
            </motion.span>
            <span className="text-xs font-bold text-[#C4CEDD]">{label}</span>
            <span className="ml-auto flex gap-1">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                  transition={{ duration: 1, delay: dot * 0.15 + i * 0.12, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]"
                />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}