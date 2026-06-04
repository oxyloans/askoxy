import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  Wand2,
  Cpu,
  Zap,
  Layers,
  X,
  ExternalLink,
  Sparkles,
  PlayCircle,
  AlertTriangle,
  Calendar,
  Hash,
  ChevronLeft,
  Search,
  RefreshCw,
  Share2,
  Clock,
  List,
} from "lucide-react";

import BASE_URL from "../../Config";

const VIDEO_SUBMIT_API = `${BASE_URL}/ai-automation/video/submit`;
const VIDEO_ALL_API = `${BASE_URL}/ai-automation/video/all`;
const ADD_TO_CLONE_API = `${BASE_URL}/ai-automation/add-to-clone`;
const IMAGE_API = `${BASE_URL}/ai-automation/image`;
const BLOG_FORMAT_API = `${BASE_URL}/ai-automation/blog/format`;
const BLOG_PUBLISH_API = `${BASE_URL}/ai-automation/blog/publish`;
const FILE_BASE_URL = "https://meta.oxyloans.com/radha-ai/files";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type EntityType = "VIDEO" | "CONTENT";
type BlogMode   = "WITH_IMAGE" | "VIDEO_ONLY";

type BlogFormat = {
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
  generateImage?: boolean;
};

type VideoItem = {
  id: number;
  videoId: string;
  originalFileName?: string;
  storagePath?: string;
  fileSizeBytes?: number;
  audioTranscript?: string;
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
  blogFormat?: string | null;
  addedToClone?: boolean;
  blogPublished?: boolean;
  socialPosted?: boolean;
  createdAt?: string;
};

type ToastItem = { id: number; icon: "success" | "error" | "warning" | "info"; title: string };

type ConfirmState = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: "green" | "red";
  onConfirm: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalizeText = (v?: string | null) => String(v || "").trim();

const getFileUrl = (url?: string | null): string => {
  const v = normalizeText(url);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return v.startsWith("/") ? `${FILE_BASE_URL}${v}` : `${FILE_BASE_URL}/${v}`;
};

const parseBlogFormat = (bf?: string | null): BlogFormat | null => {
  if (!bf) return null;
  try { return typeof bf === "string" ? JSON.parse(bf) : bf; } catch { return null; }
};

const fmtDate = (s?: string): string => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return s; }
};

const fmtBytes = (b?: number): string => {
  if (!b) return "";
  return b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : (b / 1024).toFixed(0) + " KB";
};

const pickImageUrl = (data: any): string => {
  if (!data) return "";
  const d = data?.data ?? data;
  return normalizeText(
    d?.imageUrl || d?.url || d?.generatedImageUrl || d?.fileUrl || d?.path ||
    d?.data?.imageUrl || d?.data?.url || ""
  );
};

const getEntityId = (data: any) =>
  normalizeText(data?.entityId || data?.videoId || data?.id || "");

const resolveVideoSrc = (video: VideoItem, bf?: BlogFormat | null): string => {
  // Always prefer top-level presigned S3 URLs first
  // blogFormat fields contain raw relative keys like "videos/abc.mp4" — never playable
  const candidates = [
    video.videoUrl,
    video.videoFileUrl,
    video.storagePath,
    bf?.videoUrl,
    bf?.videoFileUrl,
  ];
  for (const c of candidates) {
    if (!c || !String(c).trim()) continue;
    if (/^https?:\/\//i.test(c)) return c;  // only accept full URLs
  }
  return "";
};

// ─── FIX 3: Generate hashtags from video data ─────────────────────────────────
const generateVideoHashtags = (video: VideoItem | null): string => {
  if (!video) return "";
  const words: string[] = [];

  // Extract meaningful words from title, summary, keywords
  const sources = [
    normalizeText(video.title),
    normalizeText(video.summary),
    normalizeText(video.closing),
  ].filter(Boolean);

  for (const src of sources) {
    src.split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 4)
      .forEach(w => {
        const clean = w.replace(/[^a-zA-Z0-9]/g, "");
        if (clean.length > 3) words.push(clean);
      });
    if (words.length >= 6) break;
  }

return Array.from(new Set(words))    .slice(0, 6)
    .map(w => `#${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(" ");
};

const fillBlogPreview = (
  preview: BlogFormat,
  videoData: VideoItem | null,
  entityId: string,
  mode: BlogMode
): BlogFormat => {
  const title =
    normalizeText(preview.title) || normalizeText(videoData?.title) || "RadhAI Video Blog";

  const disclaimerText = `\n\n---\n### ✅ Blog Disclaimer\n*This blog is AI-assisted and based on public data. Contact us: [support@askoxy.ai]*`;

  const rawDescription =
    normalizeText(preview.description) ||
    [normalizeText(videoData?.summary), normalizeText(videoData?.body), normalizeText(videoData?.closing)]
      .filter(Boolean).join("\n\n") ||
    "AI-generated blog preview from the uploaded video.";

  const description = rawDescription.includes("Blog Disclaimer")
    ? rawDescription
    : rawDescription + disclaimerText;

  // FIX 3: Always append hashtags to social captions
  const hashtags = generateVideoHashtags(videoData);
  const baseCaptions =
    normalizeText(preview.socialMediaCaptions) ||
    `${title}\n\n${description.slice(0, 220)}${description.length > 220 ? "..." : ""}`;
  const captions =
    hashtags && !baseCaptions.includes("#")
      ? `${baseCaptions}\n\n${hashtags}`
      : baseCaptions;

  // FIX 4: VIDEO_ONLY mode must NOT use S3 generated image
  const resolvedImageUrl =
    mode === "WITH_IMAGE"
      ? getFileUrl(preview.imageUrl || videoData?.imageUrl || "")
      : ""; // VIDEO_ONLY → no image

  return {
    ...preview,
    entityId: getEntityId(preview) || entityId,
    entityType: "VIDEO",
    title,
    description,
    socialMediaCaptions: captions,
    addedBy: normalizeText(preview.addedBy) || "Radha",
    imageUrl: resolvedImageUrl,
    videoUrl: preview.videoUrl || videoData?.videoUrl || "",
    videoFileUrl: preview.videoFileUrl || videoData?.videoFileUrl || null,
  };
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  const colors: Record<string, string> = {
    success: "border-green-300 bg-green-50 text-green-800",
    error:   "border-red-300 bg-red-50 text-red-800",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-800",
    info:    "border-cyan-300 bg-cyan-50 text-cyan-800",
  };
  const dot: Record<string, string> = {
    success: "bg-lime-400", error: "bg-red-400", warning: "bg-yellow-400", info: "bg-cyan-400",
  };
  return (
    <div className="fixed right-4 top-[60px] z-[99999] space-y-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={`flex min-w-[240px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur-md ${colors[t.icon]}`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot[t.icon]}`} />
            {t.title}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Confirm Modal — z-index above blog preview modal ─────────────────────────
// FIX 1: z-[99999999] ensures it's always on top of everything
function ConfirmModal({
  open, title, description, confirmLabel, confirmColor = "green", onConfirm, onCancel,
}: {
  open: boolean; title: string; description: string; confirmLabel: string;
  confirmColor?: "green" | "red"; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  const isGreen = confirmColor !== "red";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        // z-index is higher than blog preview modal (z-[9999])
        className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="w-full max-w-[420px] rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isGreen ? "bg-lime-50" : "bg-red-500/15"}`}>
              {isGreen ? <CheckCircle size={20} className="text-lime-600" /> : <AlertTriangle size={20} className="text-red-400" />}
            </div>
            <h3 className="text-base font-black text-gray-900">{title}</h3>
          </div>
          <p className="mb-6 text-sm leading-6 text-slate-600">{description}</p>
          <div className="flex gap-3">
            <button onClick={onConfirm}
              className={`flex-1 rounded-2xl py-2.5 text-sm font-black shadow-lg ${isGreen
                ? "bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black"
                : "bg-gradient-to-br from-red-400 to-red-600 text-gray-900"}`}>
              {confirmLabel}
            </button>
            <button onClick={onCancel}
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 py-2.5 text-sm font-bold text-gray-900">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({
  open, title, subtitle, detail, actionLabel, onAction, onClose,
}: {
  open: boolean; title: string; subtitle: string; detail?: string;
  actionLabel: string; onAction: () => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full max-w-[440px] rounded-3xl border-2 border-green-200 bg-white p-7 shadow-xl"
        >
          <div className="mb-5 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] shadow-[0_0_40px_rgba(182,242,105,0.35)]"
            >
              <CheckCircle size={32} className="text-black" />
            </motion.div>
            <h3 className="text-xl font-black text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            {detail && (
              <p className="mt-2 rounded-xl border border-lime-200 bg-lime-50 px-4 py-2 text-xs font-bold text-lime-700">{detail}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={onAction}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-sm font-black text-black">
              <RotateCcw size={15} />{actionLabel}
            </button>
            <button onClick={onClose}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-100 text-sm font-bold text-gray-900">
              OK, Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  const s = (status || "PENDING").toUpperCase();
  const colors: Record<string, string> = {
    PENDING:     "border-yellow-300 bg-yellow-50 text-yellow-800",
    APPROVED:    "border-cyan-400 bg-cyan-50 text-cyan-800",
    PUBLISHED:   "border-green-300 bg-green-50 text-green-800",
    IMAGE_READY: "border-violet-300 bg-violet-50 text-violet-800",
    DRAFT:       "border-slate-300 bg-slate-100 text-slate-700",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${colors[s] || colors.PENDING}`}>
      {s}
    </span>
  );
}

// ─── Content Field ────────────────────────────────────────────────────────────
function ContentField({ label, value, accent = "text-cyan-600" }: { label: string; value?: string; accent?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!value) return null;
  const long = value.length > 400;
  const shown = expanded ? value : value.slice(0, 400) + (long ? "…" : "");
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
      {label && <p className={`mb-2 text-[10px] font-black uppercase tracking-widest ${accent}`}>{label}</p>}
      <p className="whitespace-pre-wrap text-sm leading-7 text-gray-900">{shown}</p>
      {long && (
        <button onClick={() => setExpanded(e => !e)} className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-600">
          {expanded ? "Show less ▲" : "Show more ▼"}
        </button>
      )}
    </div>
  );
}

// ─── Image Preview Box ────────────────────────────────────────────────────────
function ImagePreviewBox({ imageUrl, large = false, onGenerateImage }: { imageUrl: string; large?: boolean; onGenerateImage?: () => void }) {
  const src = getFileUrl(imageUrl);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src) {
    return (
      <div className={`flex ${large ? "min-h-[220px]" : "min-h-[180px]"} flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-white p-4`}>
        <Image size={40} className="mb-3 text-cyan-600" />
        <p className="mb-4 text-xs text-gray-500">No image generated yet</p>
        {onGenerateImage && (
          <button onClick={onGenerateImage}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-black text-white">
            <Sparkles size={14} />Generate AI Image
          </button>
        )}
      </div>
    );
  }
  if (failed) {
    return (
      <div className={`flex ${large ? "min-h-[310px]" : "min-h-[190px]"} flex-col items-center justify-center rounded-2xl border border-dashed border-yellow-300/20 bg-yellow-300/5 p-4 text-center`}>
        <AlertTriangle size={28} className="mb-2 text-yellow-600" />
        <p className="text-xs font-bold text-yellow-700">Image preview could not load.</p>
        <a href={src} target="_blank" rel="noreferrer"
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-yellow-100 px-3 text-xs font-black text-yellow-700">
          <ExternalLink size={14} />Open URL
        </a>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
      <img src={src} alt="Blog preview"
        className={`${large ? "max-h-[430px]" : "max-h-[290px]"} w-full bg-gray-100 object-contain`}
        onError={() => setFailed(true)} />
    </div>
  );
}

// ─── AI Reasoning Loader ──────────────────────────────────────────────────────
const REASONING_STEPS = [
  { icon: Brain,  label: "Reading video context",   color: "text-cyan-600" },
  { icon: Cpu,    label: "Analysing AI reasoning",  color: "text-gray-700" },
  { icon: Layers, label: "Preparing summary",       color: "text-lime-600" },
  { icon: Zap,    label: "Polishing final output",  color: "text-yellow-300" },
];

function AIReasoningLoader() {
  return (
    <motion.div key="reasoning"
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
      className="flex min-h-[310px] flex-col items-center justify-center rounded-3xl border-2 border-blue-200 bg-white shadow-sm p-5 sm:min-h-[390px] sm:p-8">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className="absolute inset-0 rounded-full border border-cyan-200"
            animate={{ scale: [1, 1.18 + i * 0.12, 1], opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 2.2, delay: i * 0.55, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <motion.span className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
          animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
        <motion.span className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#B6F269]"
          animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-lime-400/20">
          <Brain size={22} className="text-cyan-600" />
        </motion.div>
      </div>
      <motion.p animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-1 text-base font-black text-blue-700">
        AI Video Analysis
      </motion.p>
      <p className="mb-8 text-xs text-slate-500">Uploading and analysing your video…</p>
      <div className="w-full max-w-xs space-y-3 sm:max-w-sm">
        {REASONING_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 shadow-sm">
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }} className={color}>
              <Icon size={16} />
            </motion.span>
            <span className="text-xs font-bold text-gray-600">{label}</span>
            <span className="ml-auto flex gap-1">
              {[0, 1, 2].map(dot => (
                <motion.span key={dot}
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                  transition={{ duration: 1, delay: dot * 0.15 + i * 0.12, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]" />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// FIX 2: Blog Formatting Loader (for Blog tab)
function BlogFormattingLoader() {
  const BLOG_STEPS = [
    { icon: FileText, label: "Formatting blog structure",  color: "text-cyan-600" },
    { icon: Hash,     label: "Generating hashtags",        color: "text-lime-600" },
    { icon: Sparkles, label: "Writing social captions",    color: "text-violet-600" },
    { icon: Newspaper,label: "Finalising blog preview",   color: "text-yellow-300" },
  ];
  return (
    <motion.div key="blog-formatting"
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-violet-200 bg-violet-50 shadow-sm p-5 sm:p-8">
      <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
        {[0, 1].map(i => (
          <motion.span key={i} className="absolute inset-0 rounded-full border border-violet-200"
            animate={{ scale: [1, 1.2 + i * 0.1, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <motion.span className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400"
          animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
        <motion.span className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#B6F269]"
          animate={{ rotate: -360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-lime-400/20">
          <Newspaper size={20} className="text-violet-600" />
        </motion.div>
      </div>
      <motion.p animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
        className="mb-1 text-sm font-black text-violet-700">
        AI Formatting Blog
      </motion.p>
      <p className="mb-6 text-xs text-slate-500">Generating blog content · captions · hashtags…</p>
      <div className="w-full max-w-xs space-y-2.5">
        {BLOG_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2.5">
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity }} className={color}>
              <Icon size={15} />
            </motion.span>
            <span className="text-xs font-bold text-gray-600">{label}</span>
            <span className="ml-auto flex gap-1">
              {[0, 1, 2].map(dot => (
                <motion.span key={dot}
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                  transition={{ duration: 1, delay: dot * 0.15 + i * 0.1, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Top Workflow Actions ─────────────────────────────────────────────────────
function TopWorkflowActions({
  cloneLoading, imageLoading, formatLoading, publishLoading, activeAction,
  canUseEntity, canPublish, addedToClone, blogReady, published, selectedBlogMode,
  onAddToClone, onFormatBlog, onFormatBlogWithVideo, onPublishBlog, onOpenPreview,
}: {
  cloneLoading: boolean; imageLoading: boolean; formatLoading: boolean;
  publishLoading: boolean; activeAction: BlogMode | null; canUseEntity: boolean;
  canPublish: boolean; addedToClone: boolean; blogReady: boolean; published: boolean;
  selectedBlogMode: BlogMode | null;
  onAddToClone: () => void; onFormatBlog: () => void; onFormatBlogWithVideo: () => void;
  onPublishBlog: () => void; onOpenPreview: () => void;
}) {
  return (
    <div className="sticky top-2 z-20 w-full rounded-3xl border-2 border-blue-200 bg-blue-50 shadow-md p-2.5 shadow-[0_14px_42px_rgba(0,0,0,0.04)] backdrop-blur-2xl sm:p-3">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex min-w-0 items-center gap-2 text-xs font-black text-blue-700 sm:text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Wand2 size={14} />
          </span>
          CEO Actions
        </p>
        {blogReady && (
          <button onClick={onOpenPreview}
            className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black text-cyan-700">
            Open Preview
          </button>
        )}
      </div>
      <div className="grid w-full grid-cols-2 gap-2 xl:grid-cols-4">
        {[
          {
            title: addedToClone ? "Saved to Clone" : "Save to Clone",
            desc: "Approve final reasoning",
            icon: <CheckCircle size={16} />,
            loading: cloneLoading, disabled: !canUseEntity || addedToClone, active: addedToClone,
            onClick: onAddToClone,
          },
          {
            title: selectedBlogMode === "WITH_IMAGE" ? "Image Blog Ready" : "Blog With Image",
            desc: "Generate blog preview",
            icon: <FileText size={16} />,
            loading: formatLoading && activeAction === "WITH_IMAGE",
            disabled: !canUseEntity || (blogReady && selectedBlogMode === "WITH_IMAGE"),
            active: blogReady && selectedBlogMode === "WITH_IMAGE",
            onClick: onFormatBlog,
          },
          {
            title: selectedBlogMode === "VIDEO_ONLY" ? "Video Blog Ready" : "Blog With Video",
            desc: "Use uploaded video",
            icon: <PlayCircle size={16} />,
            loading: formatLoading && activeAction === "VIDEO_ONLY",
            disabled: !canUseEntity || (blogReady && selectedBlogMode === "VIDEO_ONLY"),
            active: blogReady && selectedBlogMode === "VIDEO_ONLY",
            onClick: onFormatBlogWithVideo,
          },
          {
            title: published ? "Published" : "Publish Blog",
            desc: "Post final blog",
            icon: <Newspaper size={16} />,
            loading: publishLoading, disabled: !canPublish || published, active: published,
            onClick: onPublishBlog,
          },
        ].map(({ title, desc, icon, loading, disabled, active, onClick }) => (
          <motion.button key={title}
            whileHover={!disabled ? { y: -2, scale: 1.01 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            disabled={disabled || loading} onClick={onClick}
            className={`group flex min-h-[72px] w-full min-w-0 items-start justify-start gap-3 rounded-2xl px-2.5 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed sm:px-3
              ${active
                ? "border-2 border-green-300 bg-green-50 text-green-800"
                : "border-2 border-slate-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"}`}>
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${active ? "bg-lime-100 text-lime-700" : "bg-cyan-50 text-cyan-700"}`}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block break-words text-[11px] font-black leading-4 sm:text-xs">
                {loading ? "Processing..." : title}
              </span>
              <span className="mt-1 block break-words text-[10px] font-semibold leading-4 text-gray-500">{desc}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Blog Preview Modal ───────────────────────────────────────────────────────
// FIX 1: Publish button closes modal FIRST, then triggers confirm
function BlogPreviewModal({
  open,
  preview,
  imageUrl,
  videoSrc,
  mode,
  publishLoading,
  imageLoading,
  onClose,
  onPublish,
  onChange,
  onGenerateImage,
}: {
  open: boolean;
  preview: any | null;
  imageUrl: string;
  videoSrc: string;
  mode: BlogMode | null;
  publishLoading: boolean;
  imageLoading: boolean;
  onClose: () => void;
  onPublish: () => void;
  onChange: (d: any) => void;
  onGenerateImage: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPreview, setTempPreview] = useState<any>({});
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (preview) setTempPreview(preview);
  }, [preview]);

  if (!open || !preview) return null;
  console.log("MODE =", mode);
console.log("VIDEO SRC =", videoSrc);
console.log("IMAGE URL =", imageUrl);
console.log("PREVIEW IMAGE =", preview?.imageUrl);

  const handleSave = () => { onChange(tempPreview); setIsEditing(false); };
  const handleCancel = () => { setTempPreview(preview); setIsEditing(false); };
  const update = (key: string, val: string) => setTempPreview((d: any) => ({ ...d, [key]: val }));

  // FIX 1: Close modal first so confirm appears on clean background
  const handlePublishClick = () => {
    onClose();
    setTimeout(() => onPublish(), 50);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/20 px-3 py-3 backdrop-blur-sm sm:px-5">
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          className="relative flex max-h-[88vh] w-full max-w-[920px] flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] overscroll-contain">

          {/* Header */}
          <div className="sticky top-0 z-20 flex flex-col gap-3 border-b-2 border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div>
              <p className="flex items-center gap-2 text-base font-black text-gray-900">
                <Newspaper size={18} className="text-cyan-700" />Review & Publish Blog
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {mode === "WITH_IMAGE" ? "Image blog preview" : "Uploaded video blog preview"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 text-xs font-black text-indigo-700">
                  <Edit3 size={14} />Edit
                </button>
              ) : (
                <>
                  <button onClick={handleSave}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black">
                    <Save size={14} />Save
                  </button>
                  <button onClick={handleCancel}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-xs font-black text-gray-700">
                    <X size={14} />Cancel
                  </button>
                </>
              )}
              {/* FIX 1: Use handlePublishClick instead of onPublish directly */}
              <button onClick={handlePublishClick} disabled={publishLoading}
                className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 text-xs font-black text-white disabled:opacity-50">
                {publishLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                Publish Blog
              </button>
              <button onClick={onClose}
                className="inline-flex h-10 items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-xs font-black text-gray-700 hover:border-red-300/40">
                <X size={15} />Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid flex-1 gap-3 overflow-y-auto overscroll-contain p-2 sm:p-3 lg:grid-cols-[0.75fr_1.25fr]">
            {/* Left: image */}
            <div className="space-y-3">
              {imageLoading ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-cyan-200 bg-white gap-4">
                  <Image size={24} className="animate-pulse text-cyan-600" />
                  <p className="text-sm font-bold text-cyan-600">Generating Image...</p>
                </div>
              ) : (imageUrl || preview.imageUrl) ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <img src={getFileUrl(imageUrl || preview.imageUrl || "")} alt="Generated blog"
                    className="max-h-[330px] w-full object-contain"
                    onError={e => (e.currentTarget.style.display = "none")} />
                  <button onClick={onGenerateImage} disabled={imageLoading}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-3 py-2 text-[11px] font-black text-black shadow-lg disabled:opacity-50">
                    <Sparkles size={13} />Regenerate
                  </button>
                </div>
              ) : (
                /* FIX 4: For VIDEO_ONLY mode, no generate button shown */
              mode === "WITH_IMAGE" ? (
  <ImagePreviewBox
    imageUrl=""
    large
    onGenerateImage={onGenerateImage}
  />
) : (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
   <video
  controls
  preload="metadata"
  playsInline
  src={videoSrc}
  className="max-h-[330px] w-full object-contain"
>
</video>
  </div>
)
              )}

              {(imageUrl || preview.imageUrl) && (
                <button onClick={() => setShowImagePreview(true)}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 text-xs font-black text-cyan-700">
                  <Eye size={14} />Preview Image
                </button>
              )}

              {showImagePreview && (
                <div
                  className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40"
                  onClick={() => setShowImagePreview(false)}
                >
                  <img src={getFileUrl(imageUrl || preview.imageUrl || "")} alt="Preview"
                    className="max-h-[95vh] max-w-[95vw] rounded-2xl" />
                </div>
              )}

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-sm">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">Preview Status</p>
                <div className="grid gap-1.5 text-[11px] text-slate-600">
                  {[
                    ["Title", !!preview?.title],
                    ["Description", !!preview?.description],
                    ["Captions", !!preview?.socialMediaCaptions],
                    ["Image", !!(imageUrl || preview?.imageUrl)],
                  ].map(([l, ok]) => (
                    <p key={l as string}>{l as string}: <span className="font-bold text-gray-900">{ok ? "✓ Ready" : "✗ Missing"}</span></p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: editable */}
            <div className="space-y-4">
              {(["title", "description", "socialMediaCaptions", "addedBy"] as const).map(key => {
                const labels: Record<string, string> = {
                  title: "Blog Title", description: "Description",
                  socialMediaCaptions: "Social Media Captions & Hashtags", addedBy: "Added By",
                };
                const multi = key === "description" || key === "socialMediaCaptions";
                return (
                  <div key={key}>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">{labels[key]}</label>
                    {isEditing ? (
                      multi ? (
                        <textarea value={(tempPreview as any)[key] || ""} onChange={e => update(key, e.target.value)}
                          className={`w-full resize-none overflow-y-auto rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm leading-7 text-gray-900 outline-none focus:border-blue-400 ${key === "description" ? "h-[200px]" : "h-[120px]"}`} />
                      ) : (
                        <input value={(tempPreview as any)[key] || ""} onChange={e => update(key, e.target.value)}
                          className="h-12 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-400" />
                      )
                    ) : (
                      <div className={`overflow-y-auto whitespace-pre-wrap rounded-2xl border-2 border-slate-200 bg-white p-4 text-sm leading-7 text-gray-900 ${multi ? (key === "description" ? "h-[200px]" : "h-[120px]") : "flex min-h-[48px] items-center"}`}>
                        {(tempPreview as any)[key] || <span className="text-slate-700">Not set</span>}
                      </div>
                    )}
                    {/* FIX 3: Show hashtag pills for social captions */}
                    {key === "socialMediaCaptions" && !isEditing && (tempPreview.socialMediaCaptions || "").includes("#") && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {((tempPreview.socialMediaCaptions || "").match(/#[a-zA-Z0-9_]+/g) || []).map((tag: string, i: number) => (
                          <span key={`${tag}-${i}`}
                            className="rounded-full border-2 border-violet-300 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {tempPreview.imageUrl && (
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Image URL</label>
                  {isEditing ? (
                    <input value={getFileUrl(tempPreview.imageUrl)} onChange={e => update("imageUrl", e.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-cyan-400" />
                  ) : (
                    <div className="overflow-x-auto break-all rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900">
                      {getFileUrl(tempPreview.imageUrl)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}




function BlogPreviewCard({
  preview,
  imageUrl,
  mode,
  videoSrc,
  onOpenPreview,
}: any) {

  const [expanded, setExpanded] = useState(false);

  return (
<div className="max-w-[900px] rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900">
          Blog Preview
        </h3>

        <button
          onClick={onOpenPreview}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white"
        >
          Open Full Preview
        </button>
      </div>

      {mode === "WITH_IMAGE" && imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="mb-4 h-52 w-full rounded-2xl object-cover"
        />
      )}

    {mode === "VIDEO_ONLY" && videoSrc && (
  <video
    controls
    className="mb-3 h-[180px] w-full rounded-xl border border-gray-200 object-contain"
  >
    <source src={videoSrc} type="video/mp4" />
  </video>
)}

<h4 className="mb-2 text-lg font-black text-blue-900">
          {preview?.title}
      </h4>
<div
  className={`text-sm text-gray-600 whitespace-pre-wrap ${
    expanded ? "" : "line-clamp-4"
  }`}
>
  {preview?.description}
</div>

{preview?.description?.length > 250 && (
  <button
    onClick={() => setExpanded(!expanded)}
    className="mt-2 text-xs font-bold text-cyan-600"
  >
    {expanded ? "Show Less ▲" : "View More ▼"}
  </button>
)}

    </div>
  );
}
// ─── Published State ──────────────────────────────────────────────────────────
function PublishedState({ blogPostId, onReset }: { blogPostId: string; onReset: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-6 text-center shadow-sm">
      <CheckCircle className="mx-auto mb-3 text-lime-600" size={46} />
      <h3 className="text-lg font-black text-lime-700">Blog Posted Successfully</h3>
      <p className="mt-2 break-words text-sm text-gray-600">{blogPostId}</p>
      <button onClick={onReset}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-5 text-sm font-black text-black">
        <RotateCcw size={16} />Start New Upload
      </button>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = React.memo(function VideoCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  const bf = parseBlogFormat(video.blogFormat);
  const thumbUrl = getFileUrl(video.thumbnailUrl) || getFileUrl(bf?.imageUrl) || getFileUrl(video.imageUrl) || "";
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className="cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-1.5 hover:border-blue-300 hover:shadow-md transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-2xl overflow-hidden border border-gray-200">
          {thumbUrl ? (
            <img src={thumbUrl} alt="" className="h-full w-full object-cover"
              onError={e => { e.currentTarget.style.display = "none"; }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <Video size={20} className="text-slate-700" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-gray-900 leading-snug line-clamp-2">
            {video.title || video.originalFileName || "Untitled"}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-700">
            <Calendar size={11} />{fmtDate(video.createdAt)}
          </p>
          {video.originalFileName && (
            <p className="mt-0.5 text-[10px] text-slate-700 truncate">
              {video.originalFileName}{video.fileSizeBytes ? ` · ${fmtBytes(video.fileSizeBytes)}` : ""}
            </p>
          )}
        </div>
      </div>
      <p className="text-[11px]  leading-4 text-gray-500 line-clamp-2 mb-3">{video.summary || "No summary available."}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <StatusBadge status={video.status} />
        <div className="flex gap-1.5">
          {[
            { label: video.addedToClone ? "Cloned" : "Clone", on: !!video.addedToClone, icon: <Brain size={9} /> },
            { label: video.blogPublished ? "Published" : "Blog", on: !!video.blogPublished, icon: <Newspaper size={9} /> },
            { label: video.socialPosted ? "Posted" : "Social", on: !!video.socialPosted, icon: <Share2 size={9} /> },
          ].map(({ label, on, icon }) => (
            <span key={label} className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold
              ${on ? "border-lime-300 bg-lime-50 text-lime-600" : "border-gray-200 text-slate-700"}`}>
              {icon}{label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// ─── Detail View ──────────────────────────────────────────────────────────────
function VideoDetailView({
  video, onBack, toast,
}: { video: VideoItem; onBack: () => void; toast: (t: "success"|"error"|"warning"|"info", m: string) => void }) {
  const [activeTab, setActiveTab] = useState<"videos"|"generated"|"blog">("videos");
  const [cloneLoading, setCloneLoading]     = useState(false);
  const [imageLoading, setImageLoading]     = useState(false);
  const [formatLoading, setFormatLoading]   = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [activeAction, setActiveAction]     = useState<BlogMode | null>(null);
  const [blogMode, setBlogMode]             = useState<BlogMode | null>(null);
  const [blogPreview, setBlogPreview]       = useState<any | null>(null);
  const [blogModalOpen, setBlogModalOpen]   = useState(false);
  const [publishedBlog, setPublishedBlog]   = useState<any | null>(null);
  const [localVideo, setLocalVideo]         = useState<VideoItem>(video);
  const [confirm, setConfirm]               = useState<ConfirmState>({ open: false, title: "", description: "", confirmLabel: "", onConfirm: () => {} });
  const [cloneSuccess, setCloneSuccess]     = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const entityId = normalizeText(localVideo.videoId || String(localVideo.id));

  const fetchJson = async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, {
      ...opts,
      headers: { ...getAuthHeaders(), ...(opts?.headers || {}) },
    });
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { throw new Error(text || "Invalid response"); }
    if (!res.ok || data?.success === false) throw new Error(data?.message || `API error ${res.status}`);
    return data;
  };

  const handleAddToClone = () => {
    if (!entityId) return toast("warning", "Entity ID missing");
    setConfirm({
      open: true, title: "Add to Clone?",
      description: "This video content will be sent to the RadhAI clone knowledge base.",
      confirmLabel: "Yes, Add to Clone", confirmColor: "green",
      onConfirm: async () => {
        setConfirm(c => ({ ...c, open: false }));
        try {
          setCloneLoading(true);
          await fetchJson(ADD_TO_CLONE_API, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entityId, entityType: "VIDEO", confirmed: true }),
          });
          setLocalVideo(v => ({ ...v, addedToClone: true }));
          setCloneSuccess(true);
        } catch (e: any) { toast("error", e.message || "Clone failed"); }
        finally { setCloneLoading(false); }
      },
    });
  };

  const handleGenerateImage = async () => {
    if (!entityId) return toast("warning", "Entity ID missing");
    try {
      setImageLoading(true);
      const data = await fetchJson(`${IMAGE_API}/${encodeURIComponent(entityId)}?entityType=VIDEO`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "VIDEO" }),
      });
      const imgUrl = getFileUrl(pickImageUrl(data));
      setLocalVideo(v => ({ ...v, imageUrl: imgUrl || v.imageUrl }));
      setBlogPreview((p: any) => p ? { ...p, imageUrl: imgUrl || p.imageUrl } : p);
      toast(imgUrl ? "success" : "warning", imgUrl ? "Image generated!" : "Image generated but URL missing");
    } catch (e: any) { toast("error", e.message || "Image generation failed"); }
    finally { setImageLoading(false); }
  };

  const handleFormatBlog = async (mode: BlogMode) => {
    if (!entityId) return toast("warning", "Entity ID missing");
    setActiveAction(mode);
    // FIX 2: Switch to blog tab and show animation while formatting
    setActiveTab("blog");
    try {
      setFormatLoading(true);
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, entityType: "VIDEO", generateImage: mode === "WITH_IMAGE" }),
      });
      const bf = data?.data || {};
      const prepared = fillBlogPreview(
        {
          ...bf,
          entityId: getEntityId(bf) || entityId,
          entityType: "VIDEO",
          // FIX 4: VIDEO_ONLY clears imageUrl; WITH_IMAGE keeps it
          imageUrl: mode === "WITH_IMAGE" ? (bf.imageUrl || localVideo.imageUrl || "") : "",
          videoUrl: bf.videoUrl || localVideo.videoUrl || "",
          videoFileUrl: bf.videoFileUrl || localVideo.videoFileUrl || null,
        },
        localVideo, entityId, mode
      );
      setBlogMode(mode);
      setBlogPreview(prepared);
      setPublishedBlog(null);
      toast("success", mode === "WITH_IMAGE" ? "Image blog ready!" : "Video blog ready!");
    } catch (e: any) { toast("error", e.message || "Blog format failed"); }
    finally { setFormatLoading(false); setActiveAction(null); }
  };

  // FIX 1: Close modal before showing confirm
  const handlePublish = () => {
    if (!blogPreview) return toast("warning", "Generate blog preview first");
    const safePreview = fillBlogPreview(blogPreview, localVideo, entityId, blogMode || "VIDEO_ONLY");
    setBlogModalOpen(false);
    setTimeout(() => {
      setConfirm({
        open: true, title: "Publish Blog?",
        description: "This will make the blog publicly visible on ASKOXY.AI.",
        confirmLabel: "Yes, Publish", confirmColor: "green",
        onConfirm: async () => {
          setConfirm(c => ({ ...c, open: false }));
          try {
            setPublishLoading(true);
            const payload = {
              ...safePreview,
              entityId: getEntityId(safePreview) || entityId,
              entityType: "VIDEO",
              status: "PUBLISHED",
            };
            const data = await fetchJson(BLOG_PUBLISH_API, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const pub = data?.data || payload;
            setPublishedBlog(pub);
            setBlogPreview(null);
            setBlogModalOpen(false);
            setLocalVideo(v => ({ ...v, blogPublished: true, blogPostId: pub.blogPostId || "POSTED SUCCESSFULLY" }));
            setPublishSuccess(true);
          } catch (e: any) { toast("error", e.message || "Publish failed"); }
          finally { setPublishLoading(false); }
        },
      });
    }, 80);
  };

  const bf = parseBlogFormat(localVideo.blogFormat);
  const blogImgUrl = blogMode === "VIDEO_ONLY"
    ? "" // FIX 4: VIDEO_ONLY never shows S3 image
    : getFileUrl(blogPreview?.imageUrl || bf?.imageUrl || localVideo.imageUrl || localVideo.thumbnailUrl || "");
  const videoSrc = resolveVideoSrc(localVideo, bf);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <ConfirmModal {...confirm} onCancel={() => setConfirm(c => ({ ...c, open: false }))} />
      <SuccessModal open={cloneSuccess} title="Added to Clone!" subtitle="Content sent to RadhAI knowledge base."
        actionLabel="Continue" onAction={() => setCloneSuccess(false)} onClose={() => setCloneSuccess(false)} />
      <SuccessModal open={publishSuccess} title="Published!" subtitle="Blog posted on ASKOXY.AI."
        detail={publishedBlog?.blogPostId && publishedBlog.blogPostId !== "POSTED SUCCESSFULLY" ? `Post ID: ${publishedBlog.blogPostId}` : undefined}
        actionLabel="Back" onAction={() => { setPublishSuccess(false); onBack(); }} onClose={() => setPublishSuccess(false)} />
      <BlogPreviewModal
  open={blogModalOpen}
  preview={blogPreview}
  imageUrl={blogImgUrl}
  videoSrc={videoSrc}
  mode={blogMode}
  publishLoading={publishLoading}
  imageLoading={imageLoading}
  onClose={() => setBlogModalOpen(false)}
  onPublish={handlePublish}
  onChange={setBlogPreview}
  onGenerateImage={handleGenerateImage}
/>

      {/* Header */}
      <div className="mb-4 overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 backdrop-blur-xl sm:p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-300 px-4 py-2 text-sm font-black text-black shadow-[0_0_25px_rgba(251,146,60,0.35)] transition-all hover:scale-105">
            <ChevronLeft size={16} />Back
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-black sm:text-lg">{localVideo.title || localVideo.originalFileName || "Video"}</h2>
            <p className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <Clock size={11} />{fmtDate(localVideo.createdAt)}
              {localVideo.originalFileName && <><span className="text-slate-700">·</span>{localVideo.originalFileName}</>}
              {localVideo.fileSizeBytes && <><span className="text-slate-700">·</span>{fmtBytes(localVideo.fileSizeBytes)}</>}
            </p>
          </div>
          <StatusBadge status={localVideo.status} />
        </div>
      </div>

      {/* Action bar */}
      <TopWorkflowActions
        cloneLoading={cloneLoading} imageLoading={imageLoading}
        formatLoading={formatLoading} publishLoading={publishLoading}
        activeAction={activeAction} canUseEntity={!!entityId}
        canPublish={!!blogPreview && !publishedBlog}
        addedToClone={!!localVideo.addedToClone} blogReady={!!blogPreview}
        published={!!publishedBlog} selectedBlogMode={blogMode}
        onAddToClone={handleAddToClone}
        onFormatBlog={() => handleFormatBlog("WITH_IMAGE")}
        onFormatBlogWithVideo={() => handleFormatBlog("VIDEO_ONLY")}
        onPublishBlog={handlePublish}
        onOpenPreview={() => setBlogModalOpen(true)}
      />

      {/* Tabs */}
      <div className="mt-4 flex border-b border-gray-100">
        {(["videos", "generated", "blog"] as const).map(tab => {
          const icons = { videos: <Video size={14} />, generated: <Brain size={14} />, blog: <Newspaper size={14} /> };
          const labels = { videos: "Video", generated: "Generated Content", blog: "Blog" };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-bold transition sm:px-5 sm:text-sm
                ${activeTab === tab ? "border-cyan-300 text-gray-900" : "border-transparent text-slate-700 hover:text-gray-600"}`}>
              {icons[tab]}{labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4 space-y-4">

        {/* ── VIDEOS TAB ── */}
        {activeTab === "videos" && (
          <div className="space-y-4">
            {videoSrc ? (
              // FIX 5: Card width auto-fits the video; no fixed height — use aspect-video
              <div className="w-full max-w-[680px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h3 className="truncate text-sm font-black text-gray-900">
                    {localVideo.title || localVideo.originalFileName || "Untitled Video"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{fmtDate(localVideo.createdAt)}</p>
                  {localVideo.fileSizeBytes && (
                    <p className="mt-0.5 text-xs text-slate-700">{fmtBytes(localVideo.fileSizeBytes)}</p>
                  )}
                </div>
                {/* FIX 5: aspect-video preserves 16:9 naturally; no arbitrary h-[] */}
                <div className="aspect-video w-full bg-black">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="h-full w-full object-contain"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    <source src={videoSrc} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 gap-2">
                <Video size={36} className="text-slate-700" />
                <p className="text-sm text-slate-700">No video URL available</p>
                {localVideo.storagePath && (
                  <p className="text-xs text-slate-700 px-4 text-center break-all">{localVideo.storagePath}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── GENERATED CONTENT TAB ── */}
        {activeTab === "generated" && (
          <div className="space-y-3">
            <ContentField label="AI Reasoning"   value={localVideo.approvedContent} accent="text-green-700" />
            <ContentField label="Title"           value={localVideo.title}           accent="text-amber-600" />
            <ContentField label="Introduction"    value={localVideo.intro}           accent="text-violet-700" />
            <ContentField label="Summary"         value={localVideo.summary}         accent="text-blue-700" />
            <ContentField label="Main Content"    value={localVideo.body}            accent="text-emerald-700" />
            <ContentField label="Conclusion"      value={localVideo.closing}         accent="text-pink-700" />
            {!localVideo.title && !localVideo.summary && !localVideo.approvedContent && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-700">
                <Brain size={36} className="mb-3 opacity-30" />
                <p className="text-sm font-bold">No generated content yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── BLOG TAB ── FIX 2: Show BlogFormattingLoader when formatLoading */}
        {activeTab === "blog" && (
          <div className="space-y-4">
            {formatLoading ? (
   <BlogFormattingLoader />
) : blogPreview ? (
  <BlogPreviewCard
  preview={blogPreview}
  imageUrl={blogImgUrl}
  mode={blogMode}
  videoSrc={videoSrc}
  onOpenPreview={() => setBlogModalOpen(true)}
/>
            ) : publishedBlog ? (
              <PublishedState blogPostId={publishedBlog.blogPostId || "POSTED SUCCESSFULLY"} onReset={onBack} />
            ) : (
              <>
                {localVideo.blogPublished && localVideo.blogPostId && (
                  <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-lime-600 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-lime-700">Blog Published Successfully</p>
                      <p className="text-xs text-gray-500 mt-0.5">{localVideo.blogPostId}</p>
                    </div>
                  </div>
                )}
               
                {!localVideo.blogPublished && !bf?.description && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-700">
                    <Newspaper size={36} className="mb-3 opacity-30" />
                    <p className="text-sm font-bold">No blog generated yet</p>
                    <p className="mt-1 text-xs">Use "Blog With Image" or "Blog With Video" above</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VideoAIPage() {
  const [mainTab, setMainTab] = useState<"upload" | "allVideos">("upload");

  const [videoFile, setVideoFile]             = useState<File | null>(null);
  const [uploadedData, setUploadedData]       = useState<VideoItem | null>(null);
  const [uploading, setUploading]             = useState(false);
  const [blogPreviewUpload, setBlogPreviewUpload]   = useState<any | null>(null);
  const [publishedBlogUpload, setPublishedBlogUpload] = useState<any | null>(null);
  const [selectedBlogMode, setSelectedBlogMode]       = useState<BlogMode | null>(null);
  const [activeAction, setActiveAction]       = useState<BlogMode | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // FIX 2: track blog formatting in upload tab
  const [blogFormatting, setBlogFormatting]   = useState(false);

  const [cloneLoading, setCloneLoading]   = useState(false);
  const [imageLoading, setImageLoading]   = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const [confirmModal, setConfirmModal]             = useState<ConfirmState | null>(null);
  const [cloneSuccessModal, setCloneSuccessModal]   = useState(false);
  const [publishSuccessModal, setPublishSuccessModal] = useState(false);

  const [allVideos, setAllVideos]     = useState<VideoItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQ, setSearchQ]         = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCounter = useRef(0);

  const showToast = useCallback((icon: "success"|"error"|"warning"|"info", title: string) => {
    const id = ++toastCounter.current;
    setToasts(t => [...t, { id, icon, title }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  const fetchAllVideos = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch(VIDEO_ALL_API, { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success === false) throw new Error(json.message);
      const sorted = [...(json.data || [])].sort((a: VideoItem, b: VideoItem) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setAllVideos(sorted);
    } catch (e: any) { showToast("error", e.message || "Failed to load videos"); }
    finally { setListLoading(false); }
  }, [showToast]);

  useEffect(() => { if (mainTab === "allVideos") fetchAllVideos(); }, [mainTab, fetchAllVideos]);

  const uploadEntityId = useMemo(() =>
    normalizeText(uploadedData?.videoId || String(uploadedData?.id || "")),
  [uploadedData]);

  const fetchJson = async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, {
      ...opts,
      headers: { ...getAuthHeaders(), ...(opts?.headers || {}) },
    });
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { throw new Error(text || "Invalid response"); }
    if (!res.ok || data?.success === false) throw new Error(data?.message || `API error ${res.status}`);
    return data;
  };

  const resetUpload = () => {
    setVideoFile(null); setUploadedData(null);
    setBlogPreviewUpload(null); setPublishedBlogUpload(null);
    setSelectedBlogMode(null); setIsPreviewModalOpen(false);
    setActiveAction(null); setBlogFormatting(false);
  };

  const handleVideoSubmit = async () => {
    if (!videoFile) return showToast("warning", "Please choose a video file");
    try {
      setUploading(true);
      setUploadedData(null); setBlogPreviewUpload(null); setPublishedBlogUpload(null);
      setSelectedBlogMode(null); setIsPreviewModalOpen(false);
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      const data = await fetchJson(VIDEO_SUBMIT_API, { method: "POST", body: formData, headers: getAuthHeaders() });
      setUploadedData(data?.data || null);
      showToast("success", "Video analysis completed");
    } catch (e: any) { showToast("error", e.message || "Video submit failed"); }
    finally { setUploading(false); }
  };

  const handleAddToCloneUpload = () => {
    if (!uploadEntityId) return showToast("warning", "Entity ID missing");
    setConfirmModal({
      open: true, title: "Add to Clone?",
      description: "The video analysis content will be sent to the RadhAI clone knowledge base.",
      confirmLabel: "Yes, Add to Clone", confirmColor: "green",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          setCloneLoading(true);
          await fetchJson(ADD_TO_CLONE_API, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entityId: uploadEntityId, entityType: "VIDEO", confirmed: true }),
          });
          setUploadedData(v => v ? { ...v, addedToClone: true } : v);
          setCloneSuccessModal(true);
        } catch (e: any) { showToast("error", e.message || "Clone failed"); }
        finally { setCloneLoading(false); }
      },
    });
  };

  const handleCreateImageUpload = async () => {
    if (!uploadEntityId) return showToast("warning", "Entity ID missing");
    try {
      setImageLoading(true);
      const data = await fetchJson(`${IMAGE_API}/${encodeURIComponent(uploadEntityId)}?entityType=VIDEO`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: uploadEntityId, entityType: "VIDEO" }),
      });
      const imgUrl = getFileUrl(pickImageUrl(data));
      setUploadedData(v => v ? { ...v, imageUrl: imgUrl || v.imageUrl } : v);
      setBlogPreviewUpload((p: any) => p ? { ...p, imageUrl: imgUrl || p.imageUrl } : p);
      showToast(imgUrl ? "success" : "warning", imgUrl ? "Image generated!" : "Image generated but URL missing");
    } catch (e: any) { showToast("error", e.message || "Image generation failed"); }
    finally { setImageLoading(false); }
  };

  const handleFormatBlogUpload = async (mode: BlogMode) => {
    if (!uploadEntityId) return showToast("warning", "Entity ID missing");
    setActiveAction(mode);
    // FIX 2: Show blog formatting animation immediately
    setBlogFormatting(true);
    try {
      setFormatLoading(true);
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: uploadEntityId, entityType: "VIDEO", generateImage: mode === "WITH_IMAGE" }),
      });
      const bf = data?.data || {};
      const prepared = fillBlogPreview(
        {
          ...bf,
          entityId: getEntityId(bf) || uploadEntityId,
          entityType: "VIDEO",
          // FIX 4: VIDEO_ONLY clears imageUrl
          imageUrl: mode === "WITH_IMAGE" ? (bf.imageUrl || uploadedData?.imageUrl || "") : "",
          videoUrl: bf.videoUrl || uploadedData?.videoUrl || "",
          videoFileUrl: bf.videoFileUrl || uploadedData?.videoFileUrl || null,
        },
        uploadedData, uploadEntityId, mode
      );
      setSelectedBlogMode(mode);
      setBlogPreviewUpload(prepared);
      setPublishedBlogUpload(null);
      setIsPreviewModalOpen(true);
      showToast("success", mode === "WITH_IMAGE" ? "Image blog ready!" : "Video blog ready!");
    } catch (e: any) { showToast("error", e.message || "Blog format failed"); }
    finally { setFormatLoading(false); setActiveAction(null); setBlogFormatting(false); }
  };

  // FIX 1: Close preview modal first, then show confirm
  const handlePublishBlogUpload = () => {
    if (!blogPreviewUpload) return showToast("warning", "Generate blog preview first");
    const safePreview = fillBlogPreview(blogPreviewUpload, uploadedData, uploadEntityId, selectedBlogMode || "VIDEO_ONLY");
    setIsPreviewModalOpen(false);
    setTimeout(() => {
      setConfirmModal({
        open: true, title: "Publish Blog?",
        description: "This will make the blog publicly visible on ASKOXY.AI.",
        confirmLabel: "Yes, Publish", confirmColor: "green",
        onConfirm: async () => {
          setConfirmModal(null);
          try {
            setPublishLoading(true);
            const payload = {
              ...safePreview,
              entityId: getEntityId(safePreview) || uploadEntityId,
              entityType: "VIDEO",
              status: "PUBLISHED",
            };
            const data = await fetchJson(BLOG_PUBLISH_API, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const pub = data?.data || payload;
            setPublishedBlogUpload(pub);
            setBlogPreviewUpload(null);
            setIsPreviewModalOpen(false);
            setUploadedData(v => v ? { ...v, blogPublished: true, blogPostId: pub.blogPostId || "POSTED SUCCESSFULLY" } : v);
            setPublishSuccessModal(true);
          } catch (e: any) { showToast("error", e.message || "Publish failed"); }
          finally { setPublishLoading(false); }
        },
      });
    }, 80);
  };

  const filteredVideos = useMemo(() => {
    if (!searchQ.trim()) return allVideos;
    const q = searchQ.toLowerCase();
    return allVideos.filter(v =>
      (v.title || "").toLowerCase().includes(q) ||
      (v.summary || "").toLowerCase().includes(q) ||
      (v.originalFileName || "").toLowerCase().includes(q) ||
      (v.audioTranscript || "").toLowerCase().includes(q)
    );
  }, [allVideos, searchQ]);

  // FIX 4: VIDEO_ONLY mode → no image URL passed to preview
  const uploadImgUrl = selectedBlogMode === "VIDEO_ONLY"
    ? ""
    : getFileUrl(blogPreviewUpload?.imageUrl || uploadedData?.imageUrl || "");
const uploadBf = parseBlogFormat(uploadedData?.blogFormat);

const uploadVideoSrc = uploadedData
  ? resolveVideoSrc(uploadedData, uploadBf)
  : "";
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white px-3 py-3 text-gray-900 sm:px-5 lg:px-7">
      <ToastContainer toasts={toasts} />

      {confirmModal && (
        <ConfirmModal open={confirmModal.open} title={confirmModal.title}
          description={confirmModal.description} confirmLabel={confirmModal.confirmLabel}
          confirmColor={confirmModal.confirmColor} onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)} />
      )}

      <SuccessModal open={cloneSuccessModal} title="Added to Clone!" subtitle="Content sent to RadhAI knowledge base."
        actionLabel="Continue" onAction={() => setCloneSuccessModal(false)} onClose={() => setCloneSuccessModal(false)} />
      <SuccessModal open={publishSuccessModal} title="Published!" subtitle="Blog posted on ASKOXY.AI."
        detail={publishedBlogUpload?.blogPostId && publishedBlogUpload.blogPostId !== "POSTED SUCCESSFULLY" ? `Post ID: ${publishedBlogUpload.blogPostId}` : undefined}
        actionLabel="Start New" onAction={() => { setPublishSuccessModal(false); resetUpload(); }} onClose={() => setPublishSuccessModal(false)} />

     <BlogPreviewModal
  open={isPreviewModalOpen}
  preview={blogPreviewUpload}
  imageUrl={uploadImgUrl}
  videoSrc={uploadVideoSrc}
  mode={selectedBlogMode}
  publishLoading={publishLoading}
  imageLoading={imageLoading}
  onClose={() => setIsPreviewModalOpen(false)}
  onPublish={handlePublishBlogUpload}
  onChange={setBlogPreviewUpload}
  onGenerateImage={handleCreateImageUpload}
/>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(94,221,242,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(182,242,105,0.10),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(143,116,255,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:38px_38px]" />

      <main className="relative z-10 mx-auto w-full max-w-[1340px]">

        {/* Hero Header */}
        <div className="mb-4 overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-lg backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700">
                <Sparkles size={13} />RadhAI Admin R&D
              </div>
              <h1 className="text-xl font-black leading-tight text-gray-900 sm:text-2xl lg:text-3xl">
                Video Upload to Clone & Blog Workflow
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Upload a video, review AI reasoning, add to clone, create image or blog preview, and publish from one screen.
              </p>
            </div>
            {mainTab === "upload" && (uploadedData || videoFile) && (
              <button onClick={resetUpload}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-black text-gray-700 hover:border-cyan-200 sm:w-auto">
                <RotateCcw size={16} />Start New
              </button>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mb-4 flex gap-1 rounded-2xl border-2 border-slate-200 bg-white p-1 shadow-sm w-fit">
          {[
            { key: "upload",    icon: <Upload size={15} />, label: "Upload Video" },
            { key: "allVideos", icon: <List size={15} />,   label: "All Videos" },
          ].map(({ key, icon, label }) => (
            <button key={key} onClick={() => { setMainTab(key as any); setSelectedVideo(null); }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition
                ${mainTab === key
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900"}`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ═══ UPLOAD TAB ═══ */}
        {mainTab === "upload" && (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
            <div className="space-y-4">
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-3 shadow-md backdrop-blur-xl sm:p-4">
                <div className="mb-4 flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black">
                    <Video size={21} />
                  </div>
                  <div>
                    <h2 className="text-base font-black leading-tight">R&D Video Upload</h2>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Upload video, review AI reasoning, save to clone, create blog, and publish.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {!uploading && !uploadedData && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-3 sm:p-4">
                      <label className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-100 sm:min-h-[185px]">
                        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black shadow-[0_16px_45px_rgba(94,221,242,0.22)]">
                          <Upload size={24} />
                        </span>
                        <span className="max-w-full truncate text-sm font-black text-blue-900 sm:text-base">
                          {videoFile ? videoFile.name : "Choose or drag video file"}
                        </span>
                        <span className="mt-1 text-xs font-semibold text-slate-700">
                          {videoFile ? fmtBytes(videoFile.size) : "Supported: MP4, MOV, WebM · Max 200MB"}
                        </span>
                        <input type="file" accept="video/*" className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            if (file && file.size > 200 * 1024 * 1024) {
                              showToast("error", "Video must be under 200 MB");
                              e.target.value = "";
                              return;
                            }
                            setVideoFile(file);
                          }} />
                      </label>
                      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_140px]">
                        <button onClick={handleVideoSubmit} disabled={!videoFile || uploading}
                          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-sm font-black text-black shadow-[0_18px_45px_rgba(94,221,242,0.18)] disabled:cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed">
                          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
                          {uploading ? "Processing" : "Submit Video"}
                        </button>
                        <button onClick={() => setVideoFile(null)} type="button"
                          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 hover:border-cyan-200">
                          <RotateCcw size={15} />Clear
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>{uploading && <AIReasoningLoader />}</AnimatePresence>

                  {uploadedData && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <TopWorkflowActions
                        cloneLoading={cloneLoading} imageLoading={imageLoading}
                        formatLoading={formatLoading} publishLoading={publishLoading}
                        activeAction={activeAction} canUseEntity={!!uploadEntityId}
                        canPublish={!!blogPreviewUpload && !publishedBlogUpload}
                        addedToClone={!!uploadedData.addedToClone} blogReady={!!blogPreviewUpload}
                        published={!!publishedBlogUpload} selectedBlogMode={selectedBlogMode}
                        onAddToClone={handleAddToCloneUpload}
                        onFormatBlog={() => handleFormatBlogUpload("WITH_IMAGE")}
                        onFormatBlogWithVideo={() => handleFormatBlogUpload("VIDEO_ONLY")}
                        onPublishBlog={handlePublishBlogUpload}
                        onOpenPreview={() => setIsPreviewModalOpen(true)}
                      />

                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <StatusBadge status={uploadedData.status} />
                        </div>
                        {uploadedData.originalFileName && (
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">Original File Name</p>
                            <p className="text-sm font-bold text-cyan-700">{uploadedData.originalFileName}</p>
                          </div>
                        )}
                      </motion.div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <h3 className="mb-4 text-lg font-black text-blue-800">AI Video Analysis</h3>
                        <div className="space-y-3">
                          <ContentField label="AI Reasoning"  value={uploadedData.approvedContent} accent="text-lime-600" />
                          <ContentField label="Title"         value={uploadedData.title}           accent="text-yellow-300" />
                          <ContentField label="Introduction"  value={uploadedData.intro}           accent="text-violet-600" />
                          <ContentField label="Summary"       value={uploadedData.summary}         accent="text-cyan-600" />
                          <ContentField label="Main Content"  value={uploadedData.body}            accent="text-emerald-300" />
                          <ContentField label="Conclusion"    value={uploadedData.closing}         accent="text-pink-300" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 xl:sticky xl:top-3 xl:self-start">
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-3 shadow-md backdrop-blur-xl sm:p-4">
                <div className="mb-4 flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black">
                    <Eye size={21} />
                  </div>
                  <div>
                    <h2 className="text-base font-black leading-tight">
                      {publishedBlogUpload ? "Blog Published" : "Quick Preview"}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {publishedBlogUpload ? "Blog posted successfully." : "Generated image and blog preview status."}
                    </p>
                  </div>
                </div>

                {publishedBlogUpload ? (
                  <PublishedState blogPostId={publishedBlogUpload.blogPostId || "POSTED SUCCESSFULLY"} onReset={resetUpload} />
                ) : blogFormatting || formatLoading || imageLoading ? (
                  /* FIX 2: Show BlogFormattingLoader in sidebar too */
                  <BlogFormattingLoader />
                ) : blogPreviewUpload ? (
                  <div className="space-y-3">
                    {/* FIX 4: Only show image in sidebar if WITH_IMAGE mode */}
                    {selectedBlogMode === "WITH_IMAGE" && (blogPreviewUpload?.imageUrl || uploadedData?.imageUrl) && (
                      <ImagePreviewBox imageUrl={blogPreviewUpload?.imageUrl || uploadedData?.imageUrl || ""} />
                    )}
                    {selectedBlogMode === "WITH_IMAGE" && !blogPreviewUpload?.imageUrl && !uploadedData?.imageUrl && (
                      <button onClick={handleCreateImageUpload} disabled={imageLoading}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 text-sm font-black text-gray-900">
                        <Image size={16} />{imageLoading ? "Generating Image..." : "Generate Image"}
                      </button>
                    )}
                    {selectedBlogMode === "VIDEO_ONLY" && (
                      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-white gap-3">
                        <PlayCircle size={28} className="text-cyan-400" />
                        <div>
                          <p className="text-xs font-bold text-cyan-700">Video Blog Ready</p>
                          <p className="text-[10px] text-slate-700">Published with video, no image</p>
                        </div>
                      </div>
                    )}
                    <button onClick={() => setIsPreviewModalOpen(true)}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-black text-white">
                      <Eye size={16} />Open Blog Preview
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <div>
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-blue-200 bg-blue-50 text-blue-700">
                        <Newspaper size={26} />
                      </div>
                      <h3 className="text-sm font-black text-gray-700">Preview waiting</h3>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500">Choose Blog With Image or Blog With Video to generate a preview.</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </section>
        )}

        {/* ═══ ALL VIDEOS TAB ═══ */}
        {mainTab === "allVideos" && (
          <div>
            {selectedVideo ? (
              <VideoDetailView video={selectedVideo} onBack={() => setSelectedVideo(null)} toast={showToast} />
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                    <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                      placeholder="Search by title, summary, filename, transcript..."
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white py-2.5 pl-9 pr-4 text-base font-semibold text-gray-900 placeholder-slate-400 outline-none focus:border-cyan-200" />
                  </div>
                  <span className="shrink-0 text-xs text-gray-500 font-semibold">
                    {listLoading ? "Loading…" : `${filteredVideos.length} video${filteredVideos.length !== 1 ? "s" : ""}`}
                  </span>
                  <button onClick={fetchAllVideos} disabled={listLoading}
                    className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50">
                    {listLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>

                {listLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-cyan-400" />
                  </div>
                ) : filteredVideos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-700">
                    <Video size={48} className="mb-3 opacity-20" />
                    <p className="text-sm font-bold">No videos found</p>
                    {searchQ && <p className="text-xs mt-1">Try a different search term</p>}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredVideos.map(v => (
                      <VideoCard key={v.id} video={v} onClick={() => setSelectedVideo(v)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}