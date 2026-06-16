import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  Upload,
  Image,
  Mic,
  Square,
  Newspaper,
  FileText,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  Send,
  Paperclip,
  Sparkles,
  RotateCcw,
  Edit3,
  Hash,
  Megaphone,
  Layers,
  Brain,
  Cpu,
  Zap,
  AlertTriangle,
  Info,
  AlertCircle,
  Loader2,
  BadgeCheck,
} from "lucide-react";

import BASE_URL from "../../Config";
import Swal from "sweetalert2";

const COMPANY_UPLOAD_API = `${BASE_URL}/ai-automation/upload/company`;
const CONTENT_SUBMIT_API = `${BASE_URL}/ai-automation/content/submit`;
const ADD_TO_CLONE_API = `${BASE_URL}/ai-automation/add-to-clone`;
const IMAGE_API = `${BASE_URL}/ai-automation/image`;
const BLOG_FORMAT_API = `${BASE_URL}/ai-automation/blog/format`;
const BLOG_PUBLISH_API = `${BASE_URL}/ai-automation/blog/publish`;
const FILE_BASE_URL = "https://meta.oxyloans.com/radha-ai/files";

const disclaimerText = `\n\n### ✅ **Blog Disclaimer**\n*This blog is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]*`;

const PLATFORMS = [
  { key: "OXY_LOANS", label: "OxyLoans" },
  { key: "OXY_BRICKS", label: "OxyBricks" },
  { key: "OXY_GOLD_AI", label: "OxyGold" },
  { key: "ASK_OXY_AI", label: "ASKOXY.AI" },
  { key: "STUDY_ABROAD", label: "Study Abroad" },
  { key: "OXY_GLOBAL", label: "OxyGlobal" },
  { key: "OTHER", label: "Other" },
];

type GeneratedSection = {
  heading?: string;
  body?: string;
};

type ParsedGeneratedContent = {
  title?: string;
  intro?: string;
  summary?: string;
  sections?: GeneratedSection[];
  closing?: string;
  hashtags?: string | string[];
  callToAction?: string;
  isGrouped?: boolean;
};

type SubmitResponse = {
  success: boolean;
  message: string;
  data?: {
    contentId?: string;
    generatedContent?: string;
    editedContent?: string | null;
    context?: string;
    generatedContext?: string;
    rawContent?: string;
  };
};

type EntityType = "CONTENT" | "VIDEO";

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

const getEntityId = (data: any) =>
  String(data?.entityId || data?.contentId || data?.videoId || data?.id || "");

const getImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads/images/")) return `${FILE_BASE_URL}${url}`;
  if (url.startsWith("uploads/images/")) return `${FILE_BASE_URL}/${url}`;
  return url;
};

function useToast() {
  const toastFn = (icon: "success" | "error" | "warning" | "info", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2600,
      timerProgressBar: true,
      background: "#070A16",
      color: "#ffffff",
    });
  };
  const ToastContainer = () => null;
  return { toast: toastFn, ToastContainer };
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      {children}
    </div>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  confirmColor = "green",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: "green" | "red";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  const isGreen = confirmColor !== "red";
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-base font-black text-gray-900">{title}</h3>
        <p className="mb-6 text-sm leading-6 text-slate-600">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-black ${
              isGreen
                ? "bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 py-2.5 text-sm font-bold text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PublishSuccessModal({
  open,
  blogPostId,
  onClose,
  onNewContent,
}: {
  open: boolean;
  blogPostId?: string | null;
  onClose: () => void;
  onNewContent: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <CheckCircle size={50} className="mx-auto mb-4 text-lime-400" />
        <h3 className="text-2xl font-black text-gray-900">Blog Published!</h3>
        {blogPostId && (
          <p className="mt-2 text-sm text-gray-500">Post ID: {blogPostId}</p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onNewContent}
            className="flex-1 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] py-2.5 font-black text-black"
          >
            New Content
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 py-2.5 font-bold text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RadhAICloneAdminPage() {
  const { toast, ToastContainer } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("radhAIAdminLogin") === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError] = useState("");

  const [companyPlatform, setCompanyPlatform] = useState("");
  const [submitPlatform, setSubmitPlatform] = useState("");
  const [customPlatformName, setCustomPlatformName] = useState("");
  const [customCompanyPlatformName, setCustomCompanyPlatformName] = useState("");
  const [rawInstruction, setRawInstruction] = useState("");
  const [interimVoiceText, setInterimVoiceText] = useState("");

  const [attachments, setAttachments] = useState<File[]>([]);
  const [companyFiles, setCompanyFiles] = useState<File[]>([]);
  const [showCompanyUploadSuccess, setShowCompanyUploadSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const generatedOutputRef = useRef<HTMLDivElement | null>(null);

  const [isCompanyUploading, setIsCompanyUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [companyFileAttempted, setCompanyFileAttempted] = useState(false);
  const [submitContentAttempted, setSubmitContentAttempted] = useState(false);

  const [contentId, setContentId] = useState("");
  const [generatedContext, setGeneratedContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [parsedEdits, setParsedEdits] = useState<ParsedGeneratedContent | null>(null);

  const [addedToClone, setAddedToClone] = useState(false);
  const [showCloneSuccess, setShowCloneSuccess] = useState(false);
  const [showBlogFlow, setShowBlogFlow] = useState(false);
  const [blogPreview, setBlogPreview] = useState<BlogPayload | null>(null);
  const [publishedBlog, setPublishedBlog] = useState<BlogPayload | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [blogFormatting, setBlogFormatting] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmColor?: "green" | "red";
    onConfirm: () => void;
  } | null>(null);
  const [publishSuccessModal, setPublishSuccessModal] = useState(false);

  const buttonMotion = {
    whileHover: { y: -2, scale: 1.015 },
    whileTap: { scale: 0.97 },
  };

  useEffect(() => {
    if (!isSubmitting && !generatedContent) return;
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;
    const timer = window.setTimeout(() => {
      generatedOutputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [isSubmitting, generatedContent]);

  const displayText = isTranscribing
    ? ""
    : interimVoiceText
    ? `${rawInstruction}${rawInstruction ? " " : ""}${interimVoiceText}`
    : rawInstruction;

  const hasInputContent = rawInstruction.trim().length > 0 || attachments.length > 0;
  const canSubmit = Boolean(submitPlatform) && hasInputContent && !isSubmitting;
  const canUploadCompanyFiles = Boolean(companyPlatform) && companyFiles.length > 0 && !isCompanyUploading;
  const canAddToClone = Boolean(contentId && generatedContent.trim()) && !isApproving;
  const hasFormattedBlogPreview = Boolean(
    blogPreview?.title?.trim() ||
      blogPreview?.description?.trim() ||
      blogPreview?.socialMediaCaptions?.trim()
  );
  const canPublishBlog = Boolean(blogPreview && hasFormattedBlogPreview && !publishedBlog);

  const parsedGeneratedContent = useMemo<ParsedGeneratedContent | null>(() => {
    if (!generatedContent) return null;
    try {
      const parsed = JSON.parse(generatedContent);
      if (parsed && typeof parsed === "object") return parsed;
      return null;
    } catch {
      return null;
    }
  }, [generatedContent]);

  const currentContentForClone = () => {
    if (isEditing && parsedEdits) return JSON.stringify(parsedEdits);
    return editedContent || generatedContent;
  };

  const buildBlogFallback = (existing?: BlogPayload | null): BlogPayload => {
    const source: ParsedGeneratedContent | null = parsedEdits || parsedGeneratedContent || null;
    const fallbackTitle =
      source?.title ||
      (generatedContent && !parsedGeneratedContent ? generatedContent.slice(0, 90) : "") ||
      "radhAI Generated Blog";
    const sectionText = source?.sections
      ?.map((section) => [section.heading, section.body].filter(Boolean).join("\n"))
      .filter(Boolean)
      .join("\n\n");
    const baseDescription =
      source?.intro ||
      sectionText ||
      source?.closing ||
      editedContent ||
      generatedContext ||
      generatedContent ||
      "Blog content generated from radhAI admin input.";
    const fallbackDescription = baseDescription + disclaimerText;
    const hashtagText =
      typeof source?.hashtags === "string"
        ? source.hashtags
        : Array.isArray(source?.hashtags)
        ? source?.hashtags?.join(" ")
        : "";

    const fallbackCaptions = `
${source?.callToAction || ""}

${hashtagText}
`.trim();

    return {
      ...(existing || {}),
      entityId: getEntityId(existing) || contentId,
      entityType: "CONTENT",
      title: existing?.title || fallbackTitle,
      description: existing?.description || fallbackDescription,
      socialMediaCaptions: existing?.socialMediaCaptions || fallbackCaptions,
      addedBy: existing?.addedBy || "Radha",
      imageUrl: existing?.imageUrl || "",
      videoUrl: existing?.videoUrl || "",
      videoFileUrl: existing?.videoFileUrl || null,
      blogPostId: existing?.blogPostId || null,
    };
  };

  const mergeBlogPreview = (apiData: Partial<BlogPayload>, existing?: BlogPayload | null): BlogPayload => {
    const merged = buildBlogFallback({ ...(existing || {}), ...(apiData || {}) });
    const desc = apiData.description || existing?.description || merged.description || "";
    const finalDesc = desc.includes("Blog Disclaimer") ? desc : desc + disclaimerText;

    return {
      ...merged,
      entityId: getEntityId(apiData) || getEntityId(existing) || contentId,
      entityType: "CONTENT",
      imageUrl: apiData.imageUrl || existing?.imageUrl || merged.imageUrl || "",
      title: apiData.title || existing?.title || merged.title,
      description: finalDesc,
      socialMediaCaptions: `
${apiData.socialMediaCaptions || existing?.socialMediaCaptions || merged.socialMediaCaptions || ""}

${
  typeof parsedGeneratedContent?.hashtags === "string"
    ? parsedGeneratedContent.hashtags
    : Array.isArray(parsedGeneratedContent?.hashtags)
    ? parsedGeneratedContent?.hashtags?.join(" ")
    : ""
}
`.trim(),
      addedBy: apiData.addedBy || existing?.addedBy || merged.addedBy || "Radha",
    };
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
  });

  const fetchJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options?.headers || {}) },
    });
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      recorder.start();
      setIsRecording(true);
      toast("info", "Recording started");
    } catch (err) {
      toast("error", "Microphone permission denied");
    }
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    recorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("voiceFile", audioBlob, "speech.webm");
        setIsTranscribing(true);
        const response = await fetch(CONTENT_SUBMIT_API, {
          method: "POST",
          body: formData,
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        const voiceText =
          data?.data?.rawInstruction ||
          data?.data?.generatedContent ||
          data?.data?.editedContent ||
          "";
        if (voiceText) {
          setRawInstruction((prev) => `${prev} ${voiceText}`.trim());
          if (!submitPlatform) {
            setSubmitAttempted(true);
            toast("warning", "Voice converted successfully. Please select a platform before submitting.");
          }
        }
        toast("success", "Voice converted");
        setIsTranscribing(false);
      } catch (error) {
        console.error(error);
        setIsTranscribing(false);
        toast("error", "Voice conversion failed");
      }
    };
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleLogin = () => {
    toast("error", "Please use the main admin login");
  };

  const _handleLogout = () => {
    stopRecording();
    sessionStorage.removeItem("radhAIAdminLogin");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    toast("info", "Logged out");
  };

  const addCompanyFiles = (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    setCompanyFileAttempted(true);
    const selected = files instanceof FileList ? Array.from(files) : files;
    setCompanyFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [...prev, ...selected.filter((f) => !existing.has(`${f.name}-${f.size}`))];
    });
  };

  const addAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    setSubmitContentAttempted(true);
    const selected = Array.from(files);
    setAttachments((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [...prev, ...selected.filter((f) => !existing.has(`${f.name}-${f.size}`))];
    });
  };

  const removeCompanyFile = (index: number) =>
    setCompanyFiles((prev) => prev.filter((_, i) => i !== index));
  const removeAttachment = (index: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleCompanyFileUpload = async () => {
    if (!companyPlatform) { toast("warning", "Please select platform"); return; }
    if (companyPlatform === "OTHER" && !customCompanyPlatformName.trim()) {
      toast("warning", "Please enter a custom platform name."); return;
    }
    if (!companyFiles.length) { toast("warning", "Choose company files"); return; }
    try {
      setIsCompanyUploading(true);
      for (const file of companyFiles) {
        const params = new URLSearchParams();
        params.append("platformType", companyPlatform);
        if (companyPlatform === "OTHER" && customCompanyPlatformName.trim()) {
          params.append("customPlatformName", customCompanyPlatformName.trim());
        }
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${COMPANY_UPLOAD_API}?${params.toString()}`, {
          method: "POST", body: formData, headers: getAuthHeaders(),
        });
        let data: any = null;
        try { data = await res.json(); } catch { data = null; }
        if (!res.ok || data?.success === false)
          throw new Error(data?.message || `Upload failed: ${file.name}`);
      }
      setCompanyFiles([]);
      setShowCompanyUploadSuccess(true);
    } catch (error: any) {
      toast("error", error?.message || "Upload failed");
    } finally {
      setIsCompanyUploading(false);
    }
  };

  const handleSubmitContent = async () => {
    const instruction = rawInstruction.trim();
    setSubmitAttempted(true);
    if (!submitPlatform) { toast("warning", "Please select platform"); return; }
    if (submitPlatform === "OTHER" && !customPlatformName.trim()) {
      toast("warning", "Please enter a custom platform name."); return;
    }
    if (!instruction && !attachments.length) { toast("warning", "Add text or attach files"); return; }
    try {
      if (isRecording) { toast("warning", "Please stop recording first"); return; }
      setIsSubmitting(true);
      setIsEditing(false);
      setContentId("");
      setGeneratedContext("");
      setGeneratedContent("");
      setEditedContent("");
      setAddedToClone(false);
      setShowCloneSuccess(false);
      setShowBlogFlow(false);
      setBlogPreview(null);
      setPublishedBlog(null);
      const params = new URLSearchParams();
      params.append("rawInstruction", instruction);
      params.append("platform", submitPlatform);
      if (submitPlatform === "OTHER" && customPlatformName.trim()) {
        params.append("customPlatformName", customPlatformName.trim());
      }
      const formData = new FormData();
      attachments.forEach((file) => formData.append("attachment", file));
      const res = await fetch(`${CONTENT_SUBMIT_API}?${params.toString()}`, {
        method: "POST", body: formData, headers: getAuthHeaders(),
      });
      const data: SubmitResponse = await res.json();
      if (!res.ok || data.success === false) {
        toast("error", data.message || "Something went wrong"); return;
      }
      const output = data.data?.editedContent || data.data?.generatedContent || data.data?.rawContent || "";
      const context = data.data?.context || data.data?.generatedContext || output;
      setContentId(data.data?.contentId || "");
      setGeneratedContext(context);
      setGeneratedContent(output);
      setEditedContent(output);
      toast("success", "Content generated successfully");
    } catch (err) {
      toast("error", "Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToClone = async () => {
    if (!contentId || !generatedContent.trim()) { toast("warning", "Generate content first"); return; }
    setConfirmModal({
      open: true,
      title: "Add to Clone?",
      description: "The edited content will be sent to the clone knowledge flow. This action will train the radhAI clone with this content.",
      confirmLabel: "Yes, Add to Clone",
      confirmColor: "green",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          setIsApproving(true);
          const payload = {
            entityId: contentId, entityType: "CONTENT",
            editedContent: currentContentForClone(), confirmed: true,
          };
          await fetchJson(ADD_TO_CLONE_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          setAddedToClone(true);
          setShowBlogFlow(true);
          setShowCloneSuccess(true);
          toast("success", "Added to clone successfully");
        } catch (error: any) {
          toast("error", error?.message || "Add to clone failed");
        } finally {
          setIsApproving(false);
        }
      },
    });
  };

  const handleRejectContent = async () => {
    setConfirmModal({
      open: true,
      title: "Clear Generated Content?",
      description: "This will remove the current output from the screen. You can re-generate by submitting again.",
      confirmLabel: "Clear Content",
      confirmColor: "red",
      onConfirm: () => { setConfirmModal(null); handleClear(); },
    });
  };

  const handleCreateImage = async () => {
    if (!contentId) return toast("warning", "Content ID missing");
    try {
      setImageLoading(true);
      const data = await fetchJson(
        `${IMAGE_API}/${encodeURIComponent(contentId)}?entityType=CONTENT`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityId: contentId, entityType: "CONTENT" }),
        }
      );
      const imageData = data?.data || {};
      const nextImageUrl = imageData?.imageUrl || imageData?.url || imageData?.generatedImageUrl || "";
      setBlogPreview((prev) =>
        mergeBlogPreview({ ...(imageData || {}), imageUrl: nextImageUrl || prev?.imageUrl || "" }, prev)
      );
      setPublishedBlog(null);
      toast("success", "Image generated");
    } catch (error: any) {
      toast("error", error?.message || "Image generation failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleFormatBlog = async (generateImage = false) => {
    if (!contentId) return toast("warning", "Content ID missing");
    try {
      setBlogFormatting(true);
      setFormatLoading(true);
      setShowBlogFlow(true);
      setIsBlogModalOpen(true);
      setBlogPreview(null);
      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: contentId, entityType: "CONTENT", generateImage }),
      });
      const formattedData = data?.data || {};
      setBlogPreview((prev) =>
        mergeBlogPreview({ ...(formattedData || {}), imageUrl: formattedData?.imageUrl || prev?.imageUrl || "" }, prev)
      );
      setPublishedBlog(null);
      toast("success", "Blog preview ready");
    } catch (error: any) {
      toast("error", error?.message || "Blog preview failed");
    } finally {
      setBlogFormatting(false);
      setFormatLoading(false);
    }
  };

  const handlePublishBlog = async () => {
    if (!blogPreview) return toast("warning", "Generate blog preview first");
    setConfirmModal({
      open: true,
      title: "Publish Blog?",
      description: "Do you want to publish this content in ASKOXY.AI Blog?",
      confirmLabel: "Yes, Publish",
      confirmColor: "green",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          setPublishLoading(true);
          const payload = {
            ...blogPreview,
            entityId: getEntityId(blogPreview) || contentId,
            entityType: "CONTENT",
            status: "PUBLISHED",
          };
          const data = await fetchJson(BLOG_PUBLISH_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const publishedData = data?.data || payload;
          setPublishedBlog(publishedData);
          setBlogPreview(null);
          setPublishSuccessModal(true);
        } catch (error: any) {
          toast("error", error?.message || "Blog publish failed");
        } finally {
          setPublishLoading(false);
        }
      },
    });
  };

  const handleStartEdit = () => {
    setParsedEdits(parsedGeneratedContent ? JSON.parse(JSON.stringify(parsedGeneratedContent)) : null);
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    if (parsedEdits) {
      const serialized = JSON.stringify(parsedEdits);
      setGeneratedContent(serialized);
      setEditedContent(serialized);
    } else {
      setGeneratedContent(editedContent);
    }
    setIsEditing(false);
    toast("success", "Changes saved");
  };

  const handleCancelEdit = () => { setParsedEdits(null); setIsEditing(false); };

  const handleClearInput = () => {
    setRawInstruction("");
    setInterimVoiceText("");
    toast("success", "Input cleared");
  };

  const handleClear = () => {
    stopRecording();
    setRawInstruction("");
    setInterimVoiceText("");
    setAttachments([]);
    setGeneratedContent("");
    setEditedContent("");
    setGeneratedContext("");
    setContentId("");
    setIsEditing(false);
    setParsedEdits(null);
    setAddedToClone(false);
    setShowBlogFlow(false);
    setBlogPreview(null);
    setIsBlogModalOpen(false);
    setPublishedBlog(null);
    setSubmitAttempted(false);
    setCompanyFileAttempted(false);
    setSubmitContentAttempted(false);
  };

  const handleRefreshRadhAI = () => {
    handleClear();
    setCompanyFiles([]);
    setCompanyPlatform("");
    setSubmitPlatform("");
    setCustomPlatformName("");
    setCustomCompanyPlatformName("");
    toast("success", "Refreshed successfully");
  };

  // ─── Login Screen ────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 text-gray-900">
        <ToastContainer />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(46,229,255,0.14),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(143,116,255,0.16),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(174,244,91,0.10),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:44px_44px]" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-[410px] rounded-[30px] border border-gray-200 bg-gray-50 p-5 shadow-xl backdrop-blur-2xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black">
              <Lock size={24} />
            </div>
            <h1 className="text-xl font-black">radhAI Admin</h1>
            <p className="mt-1 text-xs text-gray-500">Secure content training and approval panel</p>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-3 text-cyan-600" size={17} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3 text-cyan-600" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-3 text-gray-600"
                type="button"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <AnimatePresence>
              {loginError && <InlineBanner variant="error" message={loginError} />}
            </AnimatePresence>
            <motion.button
              {...buttonMotion}
              onClick={handleLogin}
              className="h-11 w-full rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-sm font-black text-black shadow-[0_16px_40px_rgba(94,221,242,0.22)]"
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Dashboard ──────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 text-gray-900">
      <ToastContainer />

      {confirmModal && (
        <ConfirmModal
          open={confirmModal.open}
          title={confirmModal.title}
          description={confirmModal.description}
          confirmLabel={confirmModal.confirmLabel}
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <PublishSuccessModal
        open={publishSuccessModal}
        blogPostId={publishedBlog?.blogPostId}
        onClose={() => setPublishSuccessModal(false)}
        onNewContent={() => { setPublishSuccessModal(false); handleClear(); }}
      />

      {/* Clone Success Modal */}
      <AnimatePresence>
        {showCloneSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-gray-100/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <CheckCircle size={50} className="mx-auto mb-4 text-lime-400" />
              <h3 className="text-2xl font-black text-gray-900">Success</h3>
              <p className="mt-3 text-gray-500">Content successfully added to Clone Knowledge Base.</p>
              <button
                onClick={() => setShowCloneSuccess(false)}
                className="mt-6 h-11 w-full rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] font-black text-black"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Upload Success Modal */}
      <AnimatePresence>
        {showCompanyUploadSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-gray-100/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-lime-400/20 bg-white p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,0.04)]"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2]">
                <CheckCircle size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Upload Successful</h3>
              <p className="mt-3 text-sm text-gray-500">
                Company knowledge files have been successfully added to the Knowledge Base.
              </p>
              <button
                onClick={() => setShowCompanyUploadSuccess(false)}
                className="mt-6 h-11 w-full rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-sm font-black text-black"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(46,229,255,0.12),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(143,116,255,0.13),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(174,244,91,0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative z-10 w-full px-3 py-4 sm:px-4 lg:px-6">

        {/* ── Inline page description + Refresh ── */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-black bg-gradient-to-r from-lime-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles size={17} className="text-lime-500 shrink-0" />
            Upload company knowledge, type your content &amp; generate AI-polished output for clone training.
          </p>
          <motion.button
            whileHover={{ y: -1, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleRefreshRadhAI}
            className="ml-4 shrink-0 inline-flex h-8 items-center gap-1.5 rounded-full border border-cyan-300 bg-white px-3 text-xs font-black text-cyan-700 shadow-sm transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-400 cursor-pointer"
          >
            <RotateCcw size={13} />
            Refresh
          </motion.button>
        </div>

        {/* ── Main two-column grid ── */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">

          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div className="flex h-full flex-col gap-3">

            {/* ── Company Knowledge Card — COMPACTED ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="group rounded-2xl border-2 border-cyan-200 bg-cyan-50/80 p-2.5 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-cyan-300 hover:bg-cyan-50 sm:p-3"
            >
              {/* Card header */}
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-cyan-100 group-hover:bg-cyan-200 transition-colors duration-200">
                  <Upload size={12} className="text-cyan-700" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.18em] text-cyan-900">
                  Company Knowledge
                </h2>
              </div>

              <div className="space-y-1.5">
                <PlatformPicker
                  label="Please select platform"
                  value={companyPlatform}
                  onChange={(v) => { setCompanyPlatform(v); setCompanyFileAttempted(false); }}
                />

                {companyPlatform === "OTHER" && (
                  <input
                    type="text"
                    value={customCompanyPlatformName}
                    onChange={(e) => setCustomCompanyPlatformName(e.target.value)}
                    placeholder="Custom platform name"
                    className="h-8 w-full rounded-2xl border border-cyan-200 bg-white px-3 text-sm text-gray-900 outline-none transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100"
                  />
                )}

                {/* Drop zone — compact */}
                <label
                  className="group/drop flex cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-cyan-300 bg-white px-3 py-2 text-sm font-semibold text-cyan-900 shadow-sm transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50 hover:shadow-md"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dropped = Array.from(e.dataTransfer.files || []);
                    if (dropped.length) {
                      const oversized = dropped.filter((file) => file.size > 500 * 1024 * 1024);
                      if (oversized.length > 0) { toast("error", "Max 500 MB per file"); return; }
                      addCompanyFiles(dropped);
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-2 text-cyan-800">
                    <Paperclip size={14} />
                    <span className="text-xs font-black">Drop files or browse</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cyan-700">
                    Max 500MB
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const oversized = files.filter((file) => file.size > 500 * 1024 * 1024);
                      if (oversized.length > 0) { toast("error", "Max 500 MB per file"); e.target.value = ""; return; }
                      addCompanyFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {/* Action row */}
                <div className="flex flex-wrap items-center gap-2">
                  <motion.button
                    whileHover={canUploadCompanyFiles ? { y: -1, scale: 1.03, boxShadow: "0 6px 20px rgba(94,221,242,0.30)" } : undefined}
                    whileTap={canUploadCompanyFiles ? { scale: 0.96 } : undefined}
                    onClick={handleCompanyFileUpload}
                    disabled={!canUploadCompanyFiles}
                    className={`flex h-7 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-3 text-xs font-black text-black shadow-sm transition-all duration-200 ${
                      canUploadCompanyFiles ? "cursor-pointer hover:shadow-lg hover:brightness-105" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    {isCompanyUploading && <Loader2 size={11} className="animate-spin" />}
                    {isCompanyUploading ? "Uploading..." : "Upload"}
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setCompanyFiles([])}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 hover:shadow-sm cursor-pointer"
                  >
                    Clear files
                  </motion.button>
                </div>

                <AnimatePresence>
                  {companyFileAttempted && !companyPlatform && companyFiles.length > 0 && (
                    <InlineBanner variant="warning" message="Select Platform before uploading." />
                  )}
                </AnimatePresence>

                {companyFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {companyFiles.map((file, index) => (
                      <FileChip
                        key={`${file.name}-${file.size}-${index}`}
                        icon={<FileText size={11} />}
                        name={file.name}
                        onRemove={() => removeCompanyFile(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Radha's Input Card — COMPACTED ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group flex flex-col rounded-2xl border-2 border-violet-200 bg-violet-50/80 p-2.5 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-violet-300 hover:bg-violet-50 sm:p-3 flex-1"
            >
              {/* Card header */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-violet-100 group-hover:bg-violet-200 transition-colors duration-200">
                    <Sparkles size={12} className="text-violet-700" />
                  </div>
                  <h2 className="text-xs font-black text-violet-900">Radha's Input</h2>
                </div>

                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {addedToClone && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 rounded-full border border-lime-300 bg-lime-50 px-2.5 py-0.5 text-[11px] font-black text-lime-700 shadow-sm"
                      >
                        <BadgeCheck size={12} className="text-lime-600" />
                        Added to Clone
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setIsInputExpanded((prev) => !prev)}
                    className="inline-flex h-7 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 text-[11px] font-black text-cyan-700 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-100 hover:shadow-sm cursor-pointer"
                  >
                    {isInputExpanded ? "Collapse" : "Expand"}
                  </motion.button>
                </div>
              </div>

              {/* Platform picker */}
              <PlatformPicker
                label="Please Select Platform"
                value={submitPlatform}
                onChange={(v) => {
                  setSubmitPlatform(v);
                  setSubmitAttempted(false);
                  setSubmitContentAttempted(false);
                }}
              />

              {submitPlatform === "OTHER" && (
                <div className="mb-1.5">
                  <input
                    type="text"
                    value={customPlatformName}
                    onChange={(e) => setCustomPlatformName(e.target.value)}
                    placeholder="Enter custom platform name"
                    className="h-9 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {submitPlatform === "OTHER" && !customPlatformName.trim() && submitAttempted && (
                <p className="mb-1.5 text-xs text-red-400">Custom platform name is required.</p>
              )}

              <AnimatePresence>
                {submitContentAttempted && !submitPlatform && hasInputContent && (
                  <div className="mb-1.5">
                    <InlineBanner variant="warning" message="Please select a Platform before submitting content." />
                  </div>
                )}
              </AnimatePresence>

              {/* Textarea container */}
           <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
  <div className="relative flex-1 min-h-[110px] sm:min-h-0">
    <textarea
                    value={displayText}
                    onChange={(e) => {
                      setInterimVoiceText("");
                      setRawInstruction(e.target.value);
                      if (!submitPlatform) setSubmitContentAttempted(true);
                    }}
                    placeholder="Type content here or use the mic button..."
                    className={`absolute inset-0 h-full w-full resize-none bg-transparent p-2 text-[13px] leading-6 text-gray-900 outline-none transition-all duration-300 ${
                      isInputExpanded ? "min-h-[300px] sm:min-h-[400px]" : "min-h-[72px] sm:min-h-[90px]"
                    }`}
                  />

                  {isRecording && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-[2px]">
                        {[6, 10, 14, 18, 22, 18, 14, 10, 6, 10, 14, 18, 22, 18, 14, 10, 6, 10, 14, 18, 22, 18, 14, 10].map((height, i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-cyan-400 animate-pulse"
                            style={{ height: `${height}px`, animationDelay: `${i * 0.05}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {isTranscribing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-xl">
                      <div className="relative mb-3 flex h-12 w-12 items-center justify-center">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="absolute inset-0 rounded-full border border-cyan-300"
                            style={{ animation: `ping 2s ${i * 0.4}s infinite` }}
                          />
                        ))}
                        <Brain size={20} className="animate-pulse text-cyan-400" />
                      </div>
                      <p className="text-sm font-bold text-cyan-600">AI Processing</p>
                      <p className="mt-0.5 text-xs text-gray-500">Converting voice to text...</p>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Toolbar — 4 buttons on ONE row (mobile-friendly compact spacing) ── */}
                <div className="mt-auto flex flex-nowrap items-center gap-1 border-t border-gray-100 pt-1.5 sm:gap-1.5">

                  {/* Attach */}
                  <label className="flex h-7 cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 text-xs font-bold transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-sm sm:gap-1.5 sm:px-2.5">
                    <Paperclip size={12} />
                    <div className="flex flex-col leading-tight">
                      <span>Attach</span>
                      <span className="text-[9px] text-cyan-600">Max 100MB</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const oversized = files.filter((file) => file.size > 100 * 1024 * 1024);
                        if (oversized.length > 0) { toast("error", "Maximum attachment size is 100 MB"); e.target.value = ""; return; }
                        addAttachments(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {/* Voice */}
                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex h-7 items-center gap-1 rounded-full px-2 text-xs font-bold transition-all duration-200 cursor-pointer sm:gap-1.5 sm:px-2.5 ${
                      isRecording
                        ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                        : isTranscribing
                        ? "bg-yellow-400 text-black"
                        : "border border-cyan-300 bg-cyan-50 text-cyan-800 hover:border-cyan-400 hover:bg-cyan-100 hover:shadow-sm"
                    }`}
                  >
                    {isRecording ? (
                      <><Square size={12} /><span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-200" />Stop</>
                    ) : isTranscribing ? (
                      <><Loader2 size={12} className="animate-spin" />Processing...</>
                    ) : (
                      <><Mic size={12} />Voice</>
                    )}
                  </motion.button>

                  {/* Clear */}
                  <motion.button
                    whileHover={{ y: -1, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={handleClearInput}
                    className="flex h-7 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 text-xs font-bold transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer sm:gap-1.5 sm:px-2.5"
                  >
                    <RotateCcw size={12} />
                    Clear
                  </motion.button>

                  {/* Submit — unchanged, ml-auto pushes it right */}
                  <motion.button
                    whileHover={canSubmit ? { y: -1, scale: 1.03, boxShadow: "0 8px 24px rgba(94,221,242,0.35)" } : undefined}
                    whileTap={canSubmit ? { scale: 0.96 } : undefined}
                    type="button"
                    onClick={handleSubmitContent}
                    disabled={!canSubmit}
                    className={`ml-auto flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-3 text-xs font-black text-black shadow-sm transition-all duration-200 ${
                      canSubmit ? "cursor-pointer hover:shadow-lg hover:brightness-105" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    {isSubmitting ? "Generating..." : "Submit"}
                    <Send size={12} />
                  </motion.button>
                </div>
              </div>

              {/* Validation */}
              <div className="mt-1.5 space-y-1.5">
                <AnimatePresence>
                  {submitAttempted && submitPlatform && !hasInputContent && (
                    <InlineBanner key="no-content" variant="warning" message="Add raw instruction text or attach at least one file." />
                  )}
                </AnimatePresence>
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {attachments.map((file, index) => (
                    <FileChip
                      key={`${file.name}-${file.size}-${index}`}
                      icon={<Paperclip size={13} />}
                      name={file.name}
                      onRemove={() => removeAttachment(index)}
                    />
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setAttachments([])}
                    className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600 transition-all duration-200 hover:bg-red-100 hover:shadow-sm cursor-pointer"
                  >
                    Clear files
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* ── Blog Workflow ── */}
            {generatedContent && !isSubmitting && (
              <ContentBlogWorkflow
                showBlogFlow={showBlogFlow}
                addedToClone={addedToClone}
                blogPreview={blogPreview}
                blogFormatting={blogFormatting}
                publishedBlog={publishedBlog}
                imageLoading={imageLoading}
                formatLoading={formatLoading}
                publishLoading={publishLoading}
                canPublishBlog={canPublishBlog}
                hasFormattedBlogPreview={hasFormattedBlogPreview}
                isBlogModalOpen={isBlogModalOpen}
                onSetBlogModalOpen={setIsBlogModalOpen}
                onShowBlogFlow={() => setShowBlogFlow(true)}
                onCreateImage={handleCreateImage}
                onFormatBlog={() => handleFormatBlog(false)}
                onPublishBlog={handlePublishBlog}
                onChangePreview={setBlogPreview}
                onReset={handleClear}
              />
            )}
          </div>

          {/* ══════════════ RIGHT COLUMN — Generated Output ══════════════ */}
          <GlassCard>
            <div ref={generatedOutputRef} className="scroll-mt-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-[#B6F269]" />
                <h2 className="text-sm font-black sm:text-base">Generated Output</h2>
              </div>

              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <AIReasoningLoader />
                ) : !generatedContent ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center lg:min-h-[500px]"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                      <Sparkles size={24} className="text-cyan-500" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-500">
                      Generated content will appear here after submit.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Approve button will be enabled only after content is generated.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                      {/* Action row */}
                      <div className="mb-3 border-b border-gray-200 pb-3">
                        <div className="grid gap-3">
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 text-sm font-black text-cyan-600">
                              <Layers size={15} />
                              <span className="truncate">Polished Generated Content</span>
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-500">
                              Review, edit and add this generated content to clone.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <motion.button
                              whileHover={!canAddToClone || addedToClone ? undefined : { y: -1, scale: 1.03, boxShadow: "0 6px 20px rgba(34,197,94,0.25)" }}
                              whileTap={!canAddToClone || addedToClone ? undefined : { scale: 0.96 }}
                              type="button"
                              onClick={handleAddToClone}
                              disabled={!canAddToClone || addedToClone}
                              className={`flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-3 text-xs font-black text-white shadow-sm transition-all duration-200 ${
                                !canAddToClone || addedToClone ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"
                              }`}
                            >
                              <CheckCircle size={14} />
                              {isApproving ? "Adding..." : addedToClone ? "Added ✓" : "Add to Clone"}
                            </motion.button>

                            <motion.button
                              whileHover={!canAddToClone ? undefined : { y: -1, scale: 1.03 }}
                              whileTap={!canAddToClone ? undefined : { scale: 0.96 }}
                              type="button"
                              onClick={handleRejectContent}
                              disabled={!canAddToClone}
                              className={`flex h-9 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 transition-all duration-200 ${
                                !canAddToClone ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-red-100 hover:border-red-300 hover:shadow-sm"
                              }`}
                            >
                              <X size={14} />
                              Clear
                            </motion.button>

                            {!isEditing ? (
                              <motion.button
                                whileHover={{ y: -1, scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                type="button"
                                onClick={handleStartEdit}
                                className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-sm cursor-pointer"
                              >
                                <Edit3 size={13} />
                                Edit
                              </motion.button>
                            ) : (
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ y: -1, scale: 1.03 }}
                                  whileTap={{ scale: 0.96 }}
                                  type="button"
                                  onClick={handleSaveEdits}
                                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-3 text-xs font-black text-black cursor-pointer"
                                >
                                  <Save size={13} />
                                  Save
                                </motion.button>
                                <motion.button
                                  whileHover={{ y: -1, scale: 1.03 }}
                                  whileTap={{ scale: 0.96 }}
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold cursor-pointer hover:bg-gray-50"
                                >
                                  <X size={13} />
                                  Cancel
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content display */}
                      {!isEditing ? (
                        <div className="max-h-[520px] overflow-y-auto pr-1 lg:max-h-none">
                          {parsedGeneratedContent ? (
                            <PolishedGeneratedView data={parsedGeneratedContent} />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                              {generatedContent}
                            </div>
                          )}
                        </div>
                      ) : parsedEdits ? (
                        <ParsedEditView data={parsedEdits} onChange={setParsedEdits} />
                      ) : (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-[320px] w-full resize-none bg-white text-[13px] leading-6 text-gray-900 outline-none"
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

// ─── Platform Picker ───────────────────────────────────────────────────────
function PlatformPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string; }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = PLATFORMS.find((p) => p.key === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative mb-1.5 w-full" ref={ref}>
      {label && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600">{label}</p>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border-2 border-cyan-300 bg-white px-3 py-2 text-sm font-semibold transition hover:border-cyan-400 focus:outline-none"
      >
        <span className={`truncate ${!selected ? "text-gray-400" : "text-gray-900"}`}>
          {selected ? selected.label : "Select platform"}
        </span>
        <svg
          className={`ml-2 h-4 w-4 shrink-0 text-cyan-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-[200] mt-1 max-h-52 overflow-y-auto rounded-xl border-2 border-cyan-200 bg-white shadow-xl [scrollbar-width:thin]">
          <button
            key=""
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className={`flex w-full items-center px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-cyan-50 ${value === "" ? "bg-cyan-50 text-cyan-700" : "text-gray-400"}`}
          >
            Select platform
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => { onChange(p.key); setOpen(false); }}
              className={`flex w-full items-center px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-cyan-50 ${value === p.key ? "bg-cyan-50 text-cyan-700" : "text-gray-900"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline Banner ─────────────────────────────────────────────────────────
const BANNER_VARIANTS = {
  warning: { icon: AlertTriangle, bar: "bg-yellow-400", border: "border-yellow-200", bg: "bg-yellow-50", icon_color: "text-yellow-600", text: "text-yellow-700", glow: "shadow-[0_0_18px_rgba(250,204,21,0.12)]" },
  error: { icon: AlertCircle, bar: "bg-red-400", border: "border-red-200", bg: "bg-red-50", icon_color: "text-red-500", text: "text-red-700", glow: "shadow-[0_0_18px_rgba(248,113,113,0.12)]" },
  info: { icon: Info, bar: "bg-[#5EDDF2]", border: "border-cyan-200", bg: "bg-cyan-50", icon_color: "text-cyan-600", text: "text-cyan-700", glow: "shadow-[0_0_18px_rgba(34,211,238,0.12)]" },
} as const;

function InlineBanner({ variant, message }: { variant: keyof typeof BANNER_VARIANTS; message: string; }) {
  const v = BANNER_VARIANTS[variant];
  const Icon = v.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`relative flex items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-sm ${v.border} ${v.bg} ${v.glow}`}
    >
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`absolute left-0 top-0 h-full w-[3px] origin-top rounded-r-full ${v.bar}`}
      />
      <span className="relative mt-[1px] shrink-0">
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full ${v.bar} opacity-30`}
        />
        <Icon size={15} className={v.icon_color} />
      </span>
      <p className={`text-xs font-semibold leading-5 ${v.text}`}>{message}</p>
    </motion.div>
  );
}

// ─── AI Reasoning Loader ───────────────────────────────────────────────────
const REASONING_STEPS = [
  { icon: Brain, label: "Parsing your instruction", color: "text-cyan-600" },
  { icon: Cpu, label: "Retrieving company knowledge", color: "text-gray-700" },
  { icon: Sparkles, label: "Structuring content sections", color: "text-lime-600" },
  { icon: Zap, label: "Polishing final output", color: "text-yellow-600" },
];

function AIReasoningLoader() {
  return (
    <motion.div
      key="reasoning"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm sm:min-h-[380px] sm:p-8"
    >
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-200"
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
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-lime-400/20"
        >
          <Brain size={22} className="text-cyan-600" />
        </motion.div>
      </div>
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-1 text-base font-black text-blue-700 sm:text-lg"
      >
        AI Reasoning
      </motion.p>
      <p className="mb-8 text-xs text-slate-500">Processing your content&hellip;</p>
      <div className="w-full max-w-xs space-y-3 sm:max-w-sm">
        {REASONING_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, delay: i * 0.45, repeat: Infinity, ease: "easeInOut" }}
              className={color}
            >
              <Icon size={15} />
            </motion.span>
            <span className="flex-1 text-xs font-semibold text-gray-600">{label}</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, delay: i * 0.45 + d * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-100 sm:max-w-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#5EDDF2] via-[#B6F269] to-[#5EDDF2]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Parsed Edit View ──────────────────────────────────────────────────────
function ParsedEditView({ data, onChange }: { data: ParsedGeneratedContent; onChange: (updated: ParsedGeneratedContent) => void; }) {
  const set = (key: keyof ParsedGeneratedContent, value: any) => onChange({ ...data, [key]: value });
  const setSection = (index: number, field: keyof GeneratedSection, value: string) => {
    const updated = (data.sections || []).map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange({ ...data, sections: updated });
  };
  const fieldClass = "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-[13px] leading-6 text-gray-900 outline-none focus:border-cyan-400 placeholder:text-gray-400";
  const labelClass = "mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500";
  return (
    <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
      {data.title !== undefined && (
        <div>
          <label className={labelClass}>Title</label>
          <textarea rows={2} value={data.title || ""} onChange={(e) => set("title", e.target.value)} className={fieldClass} />
        </div>
      )}
      {data.intro !== undefined && (
        <div>
          <label className={labelClass}>Introduction</label>
          <textarea rows={3} value={data.intro || ""} onChange={(e) => set("intro", e.target.value)} className={fieldClass} />
        </div>
      )}
      {data.summary !== undefined && (
        <div>
          <label className={labelClass}>Summary</label>
          <textarea rows={2} value={data.summary || ""} onChange={(e) => set("summary", e.target.value)} className={fieldClass} />
        </div>
      )}
      {data.sections && data.sections.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Sections</p>
          {data.sections.map((section, index) => (
            <div key={index} className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-[10px] font-black text-cyan-700">{index + 1}</span>
                <input
                  value={section.heading || ""}
                  onChange={(e) => setSection(index, "heading", e.target.value)}
                  placeholder="Heading"
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-bold text-cyan-700 outline-none placeholder:text-gray-400 focus:border-cyan-400"
                />
              </div>
              <textarea rows={3} value={section.body || ""} onChange={(e) => setSection(index, "body", e.target.value)} placeholder="Body" className={fieldClass} />
            </div>
          ))}
        </div>
      )}
      {data.closing !== undefined && (
        <div>
          <label className={labelClass}>Closing</label>
          <textarea rows={2} value={data.closing || ""} onChange={(e) => set("closing", e.target.value)} className={fieldClass} />
        </div>
      )}
      {data.callToAction !== undefined && (
        <div>
          <label className={labelClass}>Call To Action</label>
          <textarea rows={2} value={data.callToAction || ""} onChange={(e) => set("callToAction", e.target.value)} className={fieldClass} />
        </div>
      )}
      {data.hashtags !== undefined && (
        <div>
          <label className={labelClass}>Hashtags</label>
          <textarea rows={2} value={data.hashtags || ""} onChange={(e) => set("hashtags", e.target.value)} className={fieldClass} />
        </div>
      )}
    </div>
  );
}

// ─── Polished Generated View ───────────────────────────────────────────────
function PolishedGeneratedView({ data }: { data: ParsedGeneratedContent }) {
  const hashtags =
    typeof data.hashtags === "string"
      ? data.hashtags.split(" ").map((tag) => tag.trim()).filter(Boolean)
      : Array.isArray(data.hashtags) ? data.hashtags : [];

  const sectionAccents = ["border-cyan-200 bg-cyan-50", "border-lime-200 bg-lime-50", "border-violet-200 bg-violet-50", "border-yellow-200 bg-yellow-50"];
  const headingAccents = ["text-cyan-600", "text-lime-600", "text-gray-700", "text-yellow-600"];

  return (
    <div className="space-y-4">
      {data.title && (
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Title</p>
          </div>
          <h2 className="text-xl font-black leading-snug text-blue-800 sm:text-2xl">{data.title}</h2>
        </div>
      )}
      {data.intro && (
        <div className="rounded-3xl border-2 border-cyan-200 bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">Introduction</p>
          </div>
          <p className="text-[14px] leading-7 text-slate-800">{data.intro}</p>
        </div>
      )}
      {data.summary && (
        <div className="rounded-3xl border-2 border-violet-200 bg-violet-50 p-4 shadow-sm">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-700">Summary</p>
          </div>
          <p className="text-[14px] leading-7 text-slate-800">{data.summary}</p>
        </div>
      )}
      {(data as any).body && (
        <div className="rounded-3xl border-2 border-cyan-200 bg-white p-4 shadow-sm">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Main Content</p>
          </div>
          <div className="whitespace-pre-wrap text-[14px] leading-7 text-slate-800">{(data as any).body}</div>
        </div>
      )}
      {data.sections && data.sections.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#5EDDF2]/20 to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Content Sections</p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#5EDDF2]/20 to-transparent" />
          </div>
          {data.sections.map((section, index) => (
            <motion.div
              key={`${section.heading}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`rounded-2xl border p-4 transition-shadow hover:shadow-[0_0_20px_rgba(94,221,242,0.08)] ${sectionAccents[index % sectionAccents.length]}`}
            >
              <div className="mb-2 flex items-start gap-3">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[10px] font-black ${headingAccents[index % headingAccents.length]}`}>
                  {index + 1}
                </div>
                <div className="min-w-0">
                  {section.heading && <h3 className={`text-sm font-black ${headingAccents[index % headingAccents.length]}`}>{section.heading}</h3>}
                  {section.body && <p className="mt-2 text-[13px] leading-6 text-gray-600">{section.body}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {data.closing && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-lime-200 bg-lime-50 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B6F269]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-600">Conclusion</p>
          </div>
          <p className="text-[13px] leading-6 text-gray-700">{data.closing}</p>
        </div>
      )}
      {data.callToAction && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
              <Megaphone size={11} className="text-cyan-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">Call To Action</p>
            </div>
          </div>
          <p className="text-[13px] font-semibold leading-6 text-gray-800">{data.callToAction}</p>
        </div>
      )}
      {hashtags.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Hash size={14} className="text-gray-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Hashtags</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="rounded-full border-2 border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blog Workflow ─────────────────────────────────────────────────────────
function ContentBlogWorkflow({
  showBlogFlow, addedToClone, blogPreview, blogFormatting, publishedBlog,
  imageLoading, formatLoading, publishLoading, canPublishBlog, hasFormattedBlogPreview,
  isBlogModalOpen, onShowBlogFlow, onCreateImage, onFormatBlog, onPublishBlog,
  onChangePreview, onSetBlogModalOpen, onReset,
}: {
  showBlogFlow: boolean; addedToClone: boolean; blogPreview: BlogPayload | null;
  blogFormatting: boolean; publishedBlog: BlogPayload | null; imageLoading: boolean;
  formatLoading: boolean; publishLoading: boolean; canPublishBlog: boolean;
  hasFormattedBlogPreview: boolean; isBlogModalOpen: boolean;
  onSetBlogModalOpen: (v: boolean) => void; onShowBlogFlow: () => void;
  onCreateImage: () => void; onFormatBlog: () => void; onPublishBlog: () => void;
  onChangePreview: (data: BlogPayload) => void; onReset: () => void;
}) {
  useEffect(() => {
    if (blogPreview && hasFormattedBlogPreview && !publishedBlog) onSetBlogModalOpen(true);
  }, [blogPreview, hasFormattedBlogPreview, publishedBlog]);

  if (publishedBlog) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-lime-200 bg-lime-50 p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-lime-700">
          <CheckCircle size={18} />
          <h3 className="text-sm font-black">Blog Published Successfully</h3>
        </div>
        <p className="text-xs leading-5 text-gray-800/80">Blog Post ID: {publishedBlog.blogPostId || "POSTED SUCCESSFULLY"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <motion.button
            whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.96 }}
            type="button" onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black cursor-pointer"
          >
            <RotateCcw size={14} />
            New Content
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!showBlogFlow) {
    return (
      <>
        <ActionQuestion
          text={addedToClone ? "Content is added to clone. Do you want to create a blog now?" : "Do you want to create a blog for this generated content?"}
          button="Yes, Open Blog Workflow"
          loading={false}
          onClick={onShowBlogFlow}
        />
        <BlogPreviewModal
          open={isBlogModalOpen || blogFormatting}
          blogFormatting={blogFormatting}
          blogPreview={blogPreview}
          canPublishBlog={canPublishBlog}
          publishLoading={publishLoading}
          imageLoading={imageLoading}
          onCreateImage={onCreateImage}
          onClose={() => onSetBlogModalOpen(false)}
          onPublish={onPublishBlog}
          onChangePreview={onChangePreview}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-4"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-cyan-700">
              <Newspaper size={16} />
              Blog Posting Workflow
            </p>
            <p className="mt-1 text-xs text-gray-500">Format preview, optionally add image, then publish.</p>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-black ${addedToClone ? "border-lime-300 bg-lime-50 text-lime-700" : "border-yellow-300 bg-yellow-50 text-yellow-700"}`}>
            {addedToClone ? "Clone: Added" : "Clone: Not Added"}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <WorkflowButton label={hasFormattedBlogPreview ? "Refresh Blog Preview" : "Format Blog Preview"} icon={<FileText size={15} />} loading={formatLoading} disabled={false} onClick={onFormatBlog} />
          <WorkflowButton label="Open Preview Modal" icon={<Eye size={15} />} loading={false} disabled={!blogPreview} onClick={() => onSetBlogModalOpen(true)} />
          <WorkflowButton label="Publish Blog" icon={<Send size={15} />} loading={publishLoading} disabled={!canPublishBlog} onClick={onPublishBlog} />
        </div>

        {!blogPreview ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center text-xs text-gray-500">
            Click Format Blog Preview to prepare the blog.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-cyan-200 bg-white p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-cyan-700">{blogPreview.title || "Blog preview is ready"}</p>
                <p className="mt-1 text-xs text-gray-500">Review/edit the blog inside modal, then publish.</p>
              </div>
              <motion.button
                whileHover={{ y: -1, scale: 1.03, boxShadow: "0 8px 24px rgba(94,221,242,0.30)" }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => onSetBlogModalOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black cursor-pointer"
              >
                <Eye size={15} />
                View Blog Preview
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      <BlogPreviewModal
        open={isBlogModalOpen || blogFormatting}
        blogFormatting={blogFormatting}
        blogPreview={blogPreview}
        canPublishBlog={canPublishBlog}
        publishLoading={publishLoading}
        imageLoading={imageLoading}
        onCreateImage={onCreateImage}
        onClose={() => onSetBlogModalOpen(false)}
        onPublish={onPublishBlog}
        onChangePreview={onChangePreview}
      />
    </>
  );
}

// ─── Blog Preview Modal ────────────────────────────────────────────────────
function BlogPreviewModal({
  open, blogFormatting, blogPreview, canPublishBlog, publishLoading,
  imageLoading, onCreateImage, onClose, onPublish, onChangePreview,
}: {
  open: boolean; blogFormatting: boolean; blogPreview: BlogPayload | null;
  canPublishBlog: boolean; publishLoading: boolean; imageLoading: boolean;
  onCreateImage: () => void; onClose: () => void; onPublish: () => void;
  onChangePreview: (data: BlogPayload) => void;
}) {
  const [isEditingBlog] = useState(false);
  const [tempPreview, setTempPreview] = useState<BlogPayload>({} as BlogPayload);

  useEffect(() => { if (blogPreview) setTempPreview(blogPreview); }, [blogPreview]);

  if (!open && !blogFormatting) return null;

  if (blogFormatting) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 px-2 py-3 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="flex h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
          >
            <div className="sticky top-0 z-10 border-b-2 border-slate-200 bg-white p-2.5 sm:p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-black text-cyan-700 sm:text-sm"><Newspaper size={15} />Blog Preview</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">AI is formatting your blog content...</p>
                </div>
                <button type="button" onClick={onClose} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-3 text-[11px] font-black text-gray-900 cursor-pointer hover:bg-gray-200">
                  <X size={13} />Close
                </button>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="text-sm font-semibold text-gray-500">Formatting blog content...</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 px-2 py-3 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="flex h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
        >
          <div className="sticky top-0 z-10 border-b-2 border-slate-200 bg-white p-2.5 sm:p-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[13px] font-black text-cyan-700 sm:text-sm"><Newspaper size={15} />Blog Preview</p>
              <div className="flex gap-2">
                <button type="button" onClick={onPublish} disabled={!canPublishBlog || publishLoading}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-3 text-[11px] font-black text-black ${!canPublishBlog || publishLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"}`}
                >
                  {publishLoading ? <Loader2 className="animate-spin" size={13} /> : <Send size={13} />}
                  {publishLoading ? "Publishing..." : "Publish Blog"}
                </button>
                <button type="button" onClick={onClose} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-3 text-[11px] font-black text-gray-900 cursor-pointer hover:bg-gray-200">
                  <X size={13} />Close
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50 p-2 sm:p-3">
            <div className="grid gap-3 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-2.5">
                {imageLoading ? (
                  <div className="flex min-h-[120px] sm:min-h-[180px] flex-col items-center justify-center rounded-2xl border border-cyan-200 bg-white">
                    <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="absolute inset-0 rounded-full border border-cyan-300" style={{ animation: `ping 2s ${i * 0.4}s infinite` }} />
                      ))}
                      <Image size={28} className="animate-pulse text-cyan-600" />
                    </div>
                    <p className="text-sm font-bold text-cyan-600">AI Generating Image...</p>
                    <p className="mt-1 text-xs text-gray-500">Creating blog artwork</p>
                    <div className="mt-4 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                ) : blogPreview?.imageUrl ? (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <img src={getImageUrl(blogPreview?.imageUrl || "")} alt="Generated blog" className="w-full max-w-full object-contain rounded-2xl max-h-[220px] sm:max-h-none" />
                    <button type="button" onClick={onCreateImage} className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-3 py-2 text-[11px] font-black text-black cursor-pointer hover:shadow-md transition-all duration-200">
                      <Sparkles size={14} />Regenerate
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-[100px] sm:min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white">
                    <Image size={40} className="text-cyan-600" />
                    <p className="text-[12px] text-gray-500">No image generated yet</p>
                    <motion.button
                      whileHover={{ y: -1, scale: 1.03, boxShadow: "0 6px 20px rgba(94,221,242,0.25)" }}
                      whileTap={{ scale: 0.96 }}
                      type="button" onClick={onCreateImage} disabled={imageLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-4 py-2 text-[11px] font-black text-black cursor-pointer transition-all duration-200"
                    >
                      <Sparkles size={14} />Generate Image
                    </motion.button>
                  </div>
                )}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Preview Status</p>
                  <div className="grid gap-1.5 text-[11px] text-gray-600">
                    <p>Title: <span className="font-bold text-gray-900">{blogPreview?.title ? "Ready" : "Missing"}</span></p>
                    <p>Description: <span className="font-bold text-gray-900">{blogPreview?.description ? "Ready" : "Missing"}</span></p>
                    <p>Captions: <span className="font-bold text-gray-900">{blogPreview?.socialMediaCaptions ? "Ready" : "Missing"}</span></p>
                    <p>Image: <span className="font-bold text-gray-900">{blogPreview?.imageUrl ? "Ready" : "Optional"}</span></p>
                  </div>
                </div>
              </div>

              <EditableBlogPreview data={tempPreview} onChange={setTempPreview} isEditing={isEditingBlog} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Workflow Button ───────────────────────────────────────────────────────
function WorkflowButton({ label, icon, loading, disabled, onClick }: { label: string; icon: React.ReactNode; loading?: boolean; disabled?: boolean; onClick: () => void; }) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -2, scale: 1.02, boxShadow: "0 8px 24px rgba(59,130,246,0.18)" } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      type="button" onClick={onClick} disabled={disabled || loading}
      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-blue-300 bg-blue-50 px-3 text-xs font-black text-blue-800 shadow-sm transition-all duration-200 ${disabled || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-100 hover:border-blue-400"}`}
    >
      {loading ? <Loader2 className="animate-spin" size={15} /> : icon}
      {loading ? "Processing..." : label}
    </motion.button>
  );
}

// ─── Action Question ───────────────────────────────────────────────────────
function ActionQuestion({ text, button, loading, onClick }: { text: string; button: string; loading?: boolean; onClick: () => void; }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 shadow-sm">
      <p className="mb-3 text-sm font-bold text-gray-900">{text}</p>
      <motion.button
        whileHover={!loading ? { y: -1, scale: 1.03, boxShadow: "0 8px 24px rgba(94,221,242,0.30)" } : undefined}
        whileTap={!loading ? { scale: 0.96 } : undefined}
        type="button" onClick={onClick} disabled={loading}
        className={`inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black transition-all duration-200 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:shadow-md"}`}
      >
        {loading ? <Loader2 className="animate-spin" size={15} /> : <Newspaper size={15} />}
        {button}
      </motion.button>
    </div>
  );
}

// ─── Editable Blog Preview ─────────────────────────────────────────────────
function EditableBlogPreview({ data, onChange, isEditing }: { data: BlogPayload; onChange: (data: BlogPayload) => void; isEditing: boolean; }) {
  const update = (key: keyof BlogPayload, value: string) => onChange({ ...data, [key]: value });

  const titleValue = data.title?.trim() || "radhAI Generated Blog";
  const descriptionValue = data.description?.trim() || "Blog content generated from radhAI admin input.";
  const extractedTags = data.description?.match(/#[a-zA-Z0-9_]+/g)?.join(" ") || "";
  const captionsValue = `${data.socialMediaCaptions?.trim() || ""}\n${extractedTags}`.trim();

  const inputBase = "w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100";
  const displayBase = "rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Blog Title</label>
        {isEditing ? (
          <input value={titleValue} onChange={(e) => update("title", e.target.value)} className={`${inputBase} h-12`} />
        ) : (
          <div className={`${displayBase} flex min-h-[48px] items-center py-2`}>{titleValue}</div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Description</label>
        {isEditing ? (
          <textarea value={descriptionValue} onChange={(e) => update("description", e.target.value)} className={`${inputBase} h-[72px] sm:h-[160px] resize-none overflow-y-auto p-3 leading-6`} />
        ) : (
          <div className={`${displayBase} h-[72px] sm:h-[160px] overflow-y-auto whitespace-pre-wrap p-3 leading-6`}>{descriptionValue}</div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Social Media Captions</label>
        {isEditing ? (
          <textarea value={captionsValue} onChange={(e) => update("socialMediaCaptions", e.target.value)} className={`${inputBase} h-[56px] sm:h-[110px] resize-none overflow-y-auto p-3 leading-6`} />
        ) : (
          <div className={`${displayBase} h-[56px] sm:h-[110px] overflow-y-auto whitespace-pre-wrap p-3 leading-6`}>{captionsValue}</div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Added By</label>
        {isEditing ? (
          <input value={data.addedBy || "Radha"} onChange={(e) => update("addedBy", e.target.value)} className={`${inputBase} h-12`} />
        ) : (
          <div className={`${displayBase} flex min-h-[48px] items-center py-2`}>{data.addedBy || "Radha"}</div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Image URL</label>
        {isEditing ? (
          <input value={getImageUrl(data.imageUrl)} onChange={(e) => update("imageUrl", e.target.value)} className={`${inputBase} h-12`} />
        ) : (
          <div className={`${displayBase} overflow-x-auto py-3 text-[12px]`}>{getImageUrl(data.imageUrl) || "—"}</div>
        )}
      </div>
    </div>
  );
}

// ─── File Chip ─────────────────────────────────────────────────────────────
function FileChip({ icon, name, onRemove }: { icon: React.ReactNode; name: string; onRemove: () => void; }) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-700">
      <span className="shrink-0 text-cyan-600">{icon}</span>
      <span className="max-w-[160px] truncate sm:max-w-[220px]">{name}</span>
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        type="button" onClick={onRemove}
        className="rounded-full bg-red-50 p-1 text-red-500 transition-colors duration-150 hover:bg-red-100 cursor-pointer"
      >
        <X size={11} />
      </motion.button>
    </div>
  );
}