import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Lock,
  User,
  Upload,Image,
  Mic,
  Square,Newspaper,
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
} from "lucide-react";

const STATIC_USERNAME = "radhAI.clone";
const STATIC_PASSWORD = "ceovoice";

const API_BASE_URL = "https://mailautomation-production.up.railway.app/api";

const COMPANY_UPLOAD_API = `${API_BASE_URL}/v1/upload/company`;
const CONTENT_SUBMIT_API = `${API_BASE_URL}/v1/content/submit`;
const ADD_TO_CLONE_API = `${API_BASE_URL}/v1/add-to-clone`;
const IMAGE_API = `${API_BASE_URL}/v1/image`;
const BLOG_FORMAT_API = `${API_BASE_URL}/v1/blog/format`;
const BLOG_PUBLISH_API = `${API_BASE_URL}/v1/blog/publish`;
const FILE_BASE_URL = "https://meta.oxyloans.com/radha-ai/files";

const PLATFORMS = [
  { key: "OXY_LOANS", label: "OxyLoans" },
  { key: "OXY_BRICKS", label: "OxyBricks" },
  { key: "OXY_GOLD_AI", label: "OxyGold" },
  { key: "ASK_OXY_AI", label: "ASKOXY.AI" },
  { key: "STUDY_ABROAD", label: "Study Abroad" },
  { key: "OXY_GLOBAL", label: "OxyGlobal" },
];

type GeneratedSection = {
  heading?: string;
  body?: string;
};

type ParsedGeneratedContent = {
  title?: string;
  intro?: string;
  sections?: GeneratedSection[];
  closing?: string;
  hashtags?: string;
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

const toast = (
  icon: "success" | "error" | "warning" | "info",
  title: string,
) => {
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

export default function RadhAICloneAdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("radhAIAdminLogin") === "true",
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [companyPlatform, setCompanyPlatform] = useState("");
  const [submitPlatform, setSubmitPlatform] = useState("");

  const [rawInstruction, setRawInstruction] = useState("");
  const [interimVoiceText, setInterimVoiceText] = useState("");

  const [attachments, setAttachments] = useState<File[]>([]);
  const [companyFiles, setCompanyFiles] = useState<File[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef(false);

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
  const [parsedEdits, setParsedEdits] = useState<ParsedGeneratedContent | null>(
    null,
  );

  const [addedToClone, setAddedToClone] = useState(false);
  const [showBlogFlow, setShowBlogFlow] = useState(false);
  const [blogPreview, setBlogPreview] = useState<BlogPayload | null>(null);
  const [publishedBlog, setPublishedBlog] = useState<BlogPayload | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

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

  const displayText = interimVoiceText
    ? `${rawInstruction}${rawInstruction ? " " : ""}${interimVoiceText}`
    : rawInstruction;

  const hasInputContent =
    rawInstruction.trim().length > 0 || attachments.length > 0;
  const canSubmit = Boolean(submitPlatform) && hasInputContent && !isSubmitting;
  const canUploadCompanyFiles =
    Boolean(companyPlatform) && companyFiles.length > 0 && !isCompanyUploading;
  const canAddToClone =
    Boolean(contentId && generatedContent.trim()) && !isApproving;
  const hasFormattedBlogPreview = Boolean(
    blogPreview?.title?.trim() ||
      blogPreview?.description?.trim() ||
      blogPreview?.socialMediaCaptions?.trim(),
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
    const source: ParsedGeneratedContent | null =
      parsedEdits || parsedGeneratedContent || null;

    const fallbackTitle =
      source?.title ||
      (generatedContent && !parsedGeneratedContent ? generatedContent.slice(0, 90) : "") ||
      "radhAI Generated Blog";

    const sectionText = source?.sections
      ?.map((section) =>
        [section.heading, section.body].filter(Boolean).join("\n"),
      )
      .filter(Boolean)
      .join("\n\n");

    const fallbackDescription =
      source?.intro ||
      sectionText ||
      source?.closing ||
      editedContent ||
      generatedContext ||
      generatedContent ||
      "Blog content generated from radhAI admin input.";

    const fallbackCaptions =
      [source?.callToAction, source?.hashtags].filter(Boolean).join("\n\n") ||
      source?.hashtags ||
      "";

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

  const mergeBlogPreview = (
    apiData: Partial<BlogPayload>,
    existing?: BlogPayload | null,
  ): BlogPayload => {
    const merged = buildBlogFallback({
      ...(existing || {}),
      ...(apiData || {}),
    });

    return {
      ...merged,
      entityId: getEntityId(apiData) || getEntityId(existing) || contentId,
      entityType: "CONTENT",
      imageUrl: apiData.imageUrl || existing?.imageUrl || merged.imageUrl || "",
      title: apiData.title || existing?.title || merged.title,
      description: apiData.description || existing?.description || merged.description,
      socialMediaCaptions:
        apiData.socialMediaCaptions ||
        existing?.socialMediaCaptions ||
        merged.socialMediaCaptions,
      addedBy: apiData.addedBy || existing?.addedBy || merged.addedBy || "Radha",
    };
  };

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

  const getSpeechRecognition = () =>
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      toast("error", "Please allow microphone permission");
      return false;
    }
  };

  const stopRecording = (showToast = true) => {
    try {
      shouldRestartRef.current = false;
      recognitionRef.current?.stop();
    } catch (error) {
      console.error(error);
    }

    recognitionRef.current = null;
    setIsRecording(false);
    setInterimVoiceText("");

    if (showToast) toast("success", "Voice stopped");
  };

  const startRecording = async () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      toast("error", "Voice recognition works best in Google Chrome");
      return;
    }

    const hasPermission = await checkMicPermission();
    if (!hasPermission) return;

    stopRecording(false);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    shouldRestartRef.current = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setInterimVoiceText("");
      toast("info", "Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interimText += transcript;
        }
      }

      if (finalText.trim()) {
        setRawInstruction((prev) =>
          `${prev} ${finalText}`.replace(/\s+/g, " ").trim(),
        );
        setInterimVoiceText("");
      } else {
        setInterimVoiceText(interimText.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);

      if (event.error === "not-allowed") {
        toast("error", "Microphone permission blocked");
        shouldRestartRef.current = false;
      } else if (event.error === "no-speech") {
        toast("warning", "No speech detected");
      } else if (event.error === "audio-capture") {
        toast("error", "Microphone not detected");
        shouldRestartRef.current = false;
      } else if (event.error === "network") {
        toast("error", "Voice recognition needs internet");
      }
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
        setInterimVoiceText("");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleLogin = () => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      sessionStorage.setItem("radhAIAdminLogin", "true");
      setIsLoggedIn(true);
      setLoginError("");
      toast("success", "Login successful");
    } else {
      setLoginError("Invalid username or password");
      toast("error", "Invalid username or password");
    }
  };

  const handleLogout = () => {
    stopRecording(false);
    sessionStorage.removeItem("radhAIAdminLogin");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    toast("info", "Logged out");
  };

  const addCompanyFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setCompanyFileAttempted(true);

    const selected = Array.from(files);
    setCompanyFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const unique = selected.filter(
        (f) => !existing.has(`${f.name}-${f.size}`),
      );
      return [...prev, ...unique];
    });
  };

  const addAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    setSubmitContentAttempted(true);

    const selected = Array.from(files);
    setAttachments((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const unique = selected.filter(
        (f) => !existing.has(`${f.name}-${f.size}`),
      );
      return [...prev, ...unique];
    });
  };

  const removeCompanyFile = (index: number) => {
    setCompanyFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompanyFileUpload = async () => {
    if (!companyPlatform) {
      toast("warning", "Please select platform");
      return;
    }

    if (!companyFiles.length) {
      toast("warning", "Choose company files");
      return;
    }

    try {
      setIsCompanyUploading(true);

      for (const file of companyFiles) {
        const params = new URLSearchParams();
        params.append("platformType", companyPlatform);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${COMPANY_UPLOAD_API}?${params.toString()}`, {
          method: "POST",
          body: formData,
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || `Upload failed: ${file.name}`);
        }
      }

      setCompanyFiles([]);
      toast("success", "Company files uploaded successfully");
    } catch (error: any) {
      toast("error", error?.message || "Upload failed");
    } finally {
      setIsCompanyUploading(false);
    }
  };

  const handleSubmitContent = async () => {
    const instruction = rawInstruction.trim();
    setSubmitAttempted(true);

    if (!submitPlatform) {
      toast("warning", "Please select platform");
      return;
    }

    if (!instruction && !attachments.length) {
      toast("warning", "Add text or attach files");
      return;
    }

    try {
      stopRecording(false);
      setIsSubmitting(true);
      setIsEditing(false);
      setContentId("");
      setGeneratedContext("");
      setGeneratedContent("");
      setEditedContent("");
      setAddedToClone(false);
      setShowBlogFlow(false);
      setBlogPreview(null);
      setPublishedBlog(null);

      const formData = new FormData();

      if (instruction) {
        formData.append("rawInstruction", instruction);
      }

      formData.append("platform", submitPlatform);

      attachments.forEach((file) => {
        formData.append("attachment", file);
      });

      const res = await fetch(CONTENT_SUBMIT_API, {
        method: "POST",
        body: formData,
      });

      const data: SubmitResponse = await res.json();

      if (!res.ok || data.success === false) {
        toast("error", data.message || "Something went wrong");
        return;
      }

      const output =
        data.data?.editedContent ||
        data.data?.generatedContent ||
        data.data?.rawContent ||
        "";

      const context =
        data.data?.context || data.data?.generatedContext || output;

      setContentId(data.data?.contentId || "");
      setGeneratedContext(context);
      setGeneratedContent(output);
      setEditedContent(output);

      toast("success", "Content generated successfully");
    } catch (err) {
      console.error("Submit API Error:", err);
      toast("error", "Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToClone = async () => {
    if (!contentId || !generatedContent.trim()) {
      toast("warning", "Generate content first");
      return;
    }

    const result = await Swal.fire({
      title: "Add this content to clone?",
      text: "The edited content will be sent to the clone knowledge flow.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Add to Clone",
      cancelButtonText: "Cancel",
      background: "#070A16",
      color: "#ffffff",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      setIsApproving(true);

      const payload = {
        entityId: contentId,
        entityType: "CONTENT",
        editedContent: currentContentForClone(),
        confirmed: true,
      };

      await fetchJson(ADD_TO_CLONE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setAddedToClone(true);
      setShowBlogFlow(true);
      toast("success", "Added to clone successfully");
    } catch (error: any) {
      toast("error", error?.message || "Add to clone failed");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectContent = async () => {
    const result = await Swal.fire({
      title: "Clear this generated content?",
      text: "This will remove the current output from the screen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear",
      cancelButtonText: "Cancel",
      background: "#070A16",
      color: "#ffffff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) handleClear();
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
          body: JSON.stringify({
            entityId: contentId,
            entityType: "CONTENT",
          }),
        },
      );

      const imageData = data?.data || {};
      const nextImageUrl =
        imageData?.imageUrl || imageData?.url || imageData?.generatedImageUrl || "";

      setBlogPreview((prev) =>
        mergeBlogPreview(
          {
            ...(imageData || {}),
            imageUrl: nextImageUrl || prev?.imageUrl || "",
          },
          prev,
        ),
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
      setFormatLoading(true);

      const data = await fetchJson(BLOG_FORMAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId: contentId,
          entityType: "CONTENT",
          generateImage,
        }),
      });

      const formattedData = data?.data || {};

      setBlogPreview((prev) =>
        mergeBlogPreview(
          {
            ...(formattedData || {}),
            imageUrl: formattedData?.imageUrl || prev?.imageUrl || "",
          },
          prev,
        ),
      );

      setPublishedBlog(null);
      toast("success", "Blog preview ready");
    } catch (error: any) {
      toast("error", error?.message || "Blog preview failed");
    } finally {
      setFormatLoading(false);
    }
  };

  const handlePublishBlog = async () => {
    if (!blogPreview) return toast("warning", "Generate blog preview first");

    try {
      setPublishLoading(true);

      const payload: BlogPayload = {
        ...blogPreview,
        entityId: getEntityId(blogPreview) || contentId,
        entityType: "CONTENT",
        imageUrl: blogPreview.imageUrl || "",
        videoUrl: blogPreview.videoUrl || "",
        videoFileUrl: blogPreview.videoFileUrl || null,
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
      toast("success", "Blog published successfully");
    } catch (error: any) {
      toast("error", error?.message || "Blog publish failed");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleStartEdit = () => {
    setParsedEdits(
      parsedGeneratedContent
        ? JSON.parse(JSON.stringify(parsedGeneratedContent))
        : null,
    );
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

  const handleCancelEdit = () => {
    setParsedEdits(null);
    setIsEditing(false);
  };

  const handleClear = () => {
    stopRecording(false);
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
    setPublishedBlog(null);
    setSubmitAttempted(false);
    setCompanyFileAttempted(false);
    setSubmitContentAttempted(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070A16] px-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(46,229,255,0.14),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(143,116,255,0.16),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(174,244,91,0.10),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:44px_44px]" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-[410px] rounded-[30px] border border-[#3A465B]/70 bg-[#1C2433]/80 p-5 shadow-[0_30px_90px_rgba(0,0,0,.52)] backdrop-blur-2xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black">
              <Lock size={24} />
            </div>
            <h1 className="text-xl font-black">radhAI Admin</h1>
            <p className="mt-1 text-xs text-[#9AA7BC]">
              Secure content training and approval panel
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-3 text-[#7DEBFF]" size={17} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="h-11 w-full rounded-xl border border-[#3A465B]/70 bg-[#212B3B]/80 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#78859A]"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3 text-[#7DEBFF]" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 w-full rounded-xl border border-[#3A465B]/70 bg-[#212B3B]/80 pl-11 pr-11 text-sm text-white outline-none placeholder:text-[#78859A]"
              />

              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-3 text-[#C4CEDD]"
                type="button"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <AnimatePresence>
              {loginError && (
                <InlineBanner variant="error" message={loginError} />
              )}
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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A16] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(46,229,255,0.12),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(143,116,255,0.13),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(174,244,91,0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-5 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-[#3A465B]/70 bg-[#1C2433]/82 p-3 shadow-[0_18px_60px_rgba(0,0,0,.32)] backdrop-blur-2xl sm:p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#7DEBFF]" />
            <h2 className="text-sm font-black">
              Upload Company Knowledge File
            </h2>
          </div>

          <PlatformPicker
            label="Please Select Platform"
            value={companyPlatform}
            onChange={(v) => {
              setCompanyPlatform(v);
              setCompanyFileAttempted(false);
            }}
          />

          <AnimatePresence>
            {companyFileAttempted &&
              !companyPlatform &&
              companyFiles.length > 0 && (
                <div className="mb-3">
                  <InlineBanner
                    variant="warning"
                    message="Please select a Platform before uploading files."
                  />
                </div>
              )}
          </AnimatePresence>

          <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
            <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#5EDDF2]/30 bg-[#212B3B]/80 px-3 text-xs font-semibold">
              <FileText size={15} className="text-[#7DEBFF]" />
              <span className="truncate">
                {companyFiles.length
                  ? `${companyFiles.length} file(s) selected`
                  : "Choose company files"}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  addCompanyFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            <ActionButton
              onClick={handleCompanyFileUpload}
              disabled={!canUploadCompanyFiles}
              label={isCompanyUploading ? "Uploading" : "Upload"}
            />
          </div>

          {companyFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {companyFiles.map((file, index) => (
                <FileChip
                  key={`${file.name}-${file.size}-${index}`}
                  icon={<FileText size={13} />}
                  name={file.name}
                  onRemove={() => removeCompanyFile(index)}
                />
              ))}

              <button
                type="button"
                onClick={() => setCompanyFiles([])}
                className="rounded-full border border-red-300/25 bg-red-500/10 px-3 py-2 text-[11px] font-bold text-red-200"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="space-y-4">
            <GlassCard>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#7DEBFF]" />
                  <h2 className="text-sm font-black sm:text-base">Radha's Input</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInputExpanded((prev) => !prev)}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-[#5EDDF2]/25 bg-[#5EDDF2]/10 px-3 text-[11px] font-black text-[#DDFBFF] hover:border-[#5EDDF2]/50"
                >
                  {isInputExpanded ? "Collapse Input" : "Expand Input"}
                </button>
              </div>

            <PlatformPicker
              label="Please Select Platform"
              value={submitPlatform}
              onChange={(v) => {
                setSubmitPlatform(v);
                setSubmitAttempted(false);
                setSubmitContentAttempted(false);
              }}
            />

            <AnimatePresence>
              {submitContentAttempted && !submitPlatform && hasInputContent && (
                <div className="mb-3">
                  <InlineBanner
                    variant="warning"
                    message="Please select a Platform before submitting content."
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="rounded-[24px] border border-[#3A465B]/70 bg-[#0B1020]/65 p-3">
              <textarea
                value={displayText}
                onChange={(e) => {
                  setInterimVoiceText("");
                  setRawInstruction(e.target.value);
                  if (!submitPlatform) setSubmitContentAttempted(true);
                }}
                placeholder="Type content here or use the mic button. You can also attach files. Either text or file is mandatory."
                className={`w-full resize-none bg-transparent p-2 text-[13px] leading-6 text-white outline-none placeholder:text-[#78859A] ${
                  isInputExpanded
                    ? "min-h-[520px] sm:min-h-[620px] lg:min-h-[720px]"
                    : "min-h-[210px] sm:min-h-[300px] lg:min-h-[330px]"
                }`}
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-[#303A4E]/70 pt-3">
                <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[#3A465B]/70 bg-[#212B3B]/80 px-3 text-xs font-bold">
                  <Paperclip size={14} />
                  Attach Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addAttachments(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                <motion.button
                  {...buttonMotion}
                  type="button"
                  onClick={
                    isRecording ? () => stopRecording(true) : startRecording
                  }
                  className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold ${
                    isRecording
                      ? "bg-red-500 text-white"
                      : "border border-[#5EDDF2]/30 bg-[#5EDDF2]/10 text-[#DDFBFF]"
                  }`}
                >
                  {isRecording ? <Square size={14} /> : <Mic size={14} />}
                  {isRecording ? "Stop Mic" : "Speak"}
                </motion.button>

                <motion.button
                  {...buttonMotion}
                  type="button"
                  onClick={handleClear}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-[#3A465B]/70 bg-[#212B3B]/80 px-3 text-xs font-bold"
                >
                  <RotateCcw size={14} />
                  Clear
                </motion.button>

                <motion.button
                  {...buttonMotion}
                  type="button"
                  onClick={handleSubmitContent}
                  disabled={!canSubmit}
                  className="ml-auto flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black shadow-[0_14px_32px_rgba(94,221,242,0.20)] disabled:cursor-not-allowed disabled:opacity-40 max-sm:ml-0 max-sm:w-full max-sm:justify-center"
                >
                  {isSubmitting ? "Generating" : "Submit"}
                  <Send size={14} />
                </motion.button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {submitAttempted && !submitPlatform && (
                  <InlineBanner
                    key="no-platform"
                    variant="warning"
                    message="Select a platform above before submitting."
                  />
                )}
                {submitAttempted && submitPlatform && !hasInputContent && (
                  <InlineBanner
                    key="no-content"
                    variant="warning"
                    message="Add raw instruction text or attach at least one file."
                  />
                )}
                {isRecording && (
                  <InlineBanner
                    key="recording"
                    variant="info"
                    message="Listening… Voice is converting to text. No audio file will be uploaded."
                  />
                )}
              </AnimatePresence>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <FileChip
                    key={`${file.name}-${file.size}-${index}`}
                    icon={<Paperclip size={13} />}
                    name={file.name}
                    onRemove={() => removeAttachment(index)}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => setAttachments([])}
                  className="rounded-full border border-red-300/25 bg-red-500/10 px-3 py-2 text-[11px] font-bold text-red-200"
                >
                  Clear files
                </button>
              </div>
            )}
            </GlassCard>

            {generatedContent && !isSubmitting && (
              <ContentBlogWorkflow
                showBlogFlow={showBlogFlow}
                addedToClone={addedToClone}
                blogPreview={blogPreview}
                publishedBlog={publishedBlog}
                imageLoading={imageLoading}
                formatLoading={formatLoading}
                publishLoading={publishLoading}
                canPublishBlog={canPublishBlog}
                hasFormattedBlogPreview={hasFormattedBlogPreview}
                onShowBlogFlow={() => setShowBlogFlow(true)}
                onCreateImage={handleCreateImage}
                onFormatBlog={() => handleFormatBlog(false)}
                onPublishBlog={handlePublishBlog}
                onChangePreview={setBlogPreview}
                onReset={handleClear}
              />
            )}
          </div>

          <GlassCard>
            <div ref={generatedOutputRef} className="scroll-mt-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-[#B6F269]" />
                <h2 className="text-sm font-black sm:text-base">
                  Generated Output
                </h2>
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
                    className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-[#3A465B]/70 bg-[#0B1020]/55 p-4 text-center text-[13px] text-[#9AA7BC] sm:min-h-[380px]"
                  >
                    <div>
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#303A4E]/70 bg-[#1B2432]/75">
                        <Sparkles size={22} className="text-[#7DEBFF]" />
                      </div>
                      Generated content will appear here after submit.
                      <p className="mt-1 text-xs text-[#78859A]">
                        Approve button will be enabled only after content is
                        generated.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="rounded-[24px] border border-[#3A465B]/70 bg-[#0B1020]/65 p-3 sm:p-4">
                      <div className="mb-3 border-b border-[#303A4E]/70 pb-3">
                        <div className="grid gap-3">
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 text-sm font-black text-[#7DEBFF]">
                              <Layers size={15} />
                              <span className="truncate">
                                Polished Generated Content
                              </span>
                            </p>

                            <p className="mt-1 text-[11px] text-[#9AA7BC]">
                              Review, edit and add this generated content to clone.
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-nowrap">
                            <motion.button
                              {...buttonMotion}
                              type="button"
                              onClick={handleAddToClone}
                              disabled={!canAddToClone || addedToClone}
                              className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-2 text-[11px] font-black text-black shadow-[0_12px_30px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-xs"
                            >
                              <CheckCircle size={14} />
                              <span className="truncate">
                                {isApproving ? "Adding..." : addedToClone ? "Added" : "Add to Clone"}
                              </span>
                            </motion.button>

                            <motion.button
                              {...buttonMotion}
                              type="button"
                              onClick={handleRejectContent}
                              disabled={!canAddToClone}
                              className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-red-300/30 bg-red-500/10 px-2 text-[11px] font-bold text-red-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-xs"
                            >
                              <X size={14} />
                              <span className="truncate">Clear</span>
                            </motion.button>

                            {!isEditing ? (
                              <motion.button
                                {...buttonMotion}
                                type="button"
                                onClick={handleStartEdit}
                                className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-[#3A465B]/70 bg-[#212B3B]/80 px-2 text-[11px] font-bold sm:px-4 sm:text-xs"
                              >
                                <Edit3 size={13} />
                                <span className="truncate">Edit</span>
                              </motion.button>
                            ) : (
                              <div className="col-span-3 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex">
                                <motion.button
                                  {...buttonMotion}
                                  type="button"
                                  onClick={handleSaveEdits}
                                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-3 text-[11px] font-black text-black sm:text-xs"
                                >
                                  <Save size={13} />
                                  Save
                                </motion.button>

                                <motion.button
                                  {...buttonMotion}
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#3A465B]/70 bg-[#212B3B]/80 px-3 text-[11px] font-bold sm:text-xs"
                                >
                                  <X size={13} />
                                  Cancel
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {!isEditing ? (
                        <div className="max-h-[460px] overflow-y-auto pr-1">
                          {parsedGeneratedContent ? (
                            <PolishedGeneratedView
                              data={parsedGeneratedContent}
                            />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm leading-7 text-[#E5EAF2]">
                              {generatedContent}
                            </div>
                          )}
                        </div>
                      ) : parsedEdits ? (
                        <ParsedEditView
                          data={parsedEdits}
                          onChange={setParsedEdits}
                        />
                      ) : (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-[320px] w-full resize-none bg-transparent text-[13px] leading-6 text-white outline-none"
                        />
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}

function PlatformPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="mb-3">
      {label && (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA7BC]">
          {label}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => {
          const active = value === p.key;

          return (
            <motion.button
              key={p.key}
              type="button"
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(active ? "" : p.key)}
              className={`relative flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                active
                  ? "bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] text-black shadow-[0_8px_22px_rgba(94,221,242,0.26)]"
                  : "border border-[#3A465B]/70 bg-[#1B2432]/75 text-[#C4CEDD] hover:border-[#5EDDF2]/40 hover:text-white"
              }`}
            >
              {p.label}
              {active && <X size={12} className="relative shrink-0" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const BANNER_VARIANTS = {
  warning: {
    icon: AlertTriangle,
    bar: "bg-yellow-400",
    border: "border-yellow-300/25",
    bg: "bg-yellow-400/8",
    icon_color: "text-yellow-300",
    text: "text-yellow-100",
    glow: "shadow-[0_0_18px_rgba(250,204,21,0.12)]",
  },
  error: {
    icon: AlertCircle,
    bar: "bg-red-400",
    border: "border-red-400/25",
    bg: "bg-red-500/8",
    icon_color: "text-red-300",
    text: "text-red-100",
    glow: "shadow-[0_0_18px_rgba(248,113,113,0.12)]",
  },
  info: {
    icon: Info,
    bar: "bg-[#5EDDF2]",
    border: "border-[#5EDDF2]/25",
    bg: "bg-[#5EDDF2]/8",
    icon_color: "text-[#5EDDF2]",
    text: "text-[#DDFBFF]",
    glow: "shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  },
} as const;

function InlineBanner({
  variant,
  message,
}: {
  variant: keyof typeof BANNER_VARIANTS;
  message: string;
}) {
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

const REASONING_STEPS = [
  { icon: Brain, label: "Parsing your instruction", color: "text-[#5EDDF2]" },
  {
    icon: Cpu,
    label: "Retrieving company knowledge",
    color: "text-[#B9A7FF]",
  },
  {
    icon: Sparkles,
    label: "Structuring content sections",
    color: "text-[#B6F269]",
  },
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
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#5EDDF2]/20 bg-[#0B1020]/70 p-5 sm:min-h-[380px] sm:p-8"
    >
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-[#5EDDF2]/30"
            animate={{
              scale: [1, 1.18 + i * 0.12, 1],
              opacity: [0.6, 0.15, 0.6],
            }}
            transition={{
              duration: 2.2,
              delay: i * 0.55,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
          <Brain size={22} className="text-[#7DEBFF]" />
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-1 bg-gradient-to-r from-cyan-200 via-lime-200 to-cyan-300 bg-clip-text text-base font-black text-transparent sm:text-lg"
      >
        AI Reasoning
      </motion.p>

      <p className="mb-8 text-xs text-[#78859A]">
        Processing your content&hellip;
      </p>

      <div className="w-full max-w-xs space-y-3 sm:max-w-sm">
        {REASONING_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border border-[#303A4E]/60 bg-[#1A2230]/70 px-4 py-3"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.6,
                delay: i * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={color}
            >
              <Icon size={15} />
            </motion.span>

            <span className="flex-1 text-xs font-semibold text-[#C4CEDD]">
              {label}
            </span>

            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-[#5EDDF2]"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.45 + d * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#1B2432]/75 sm:max-w-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#5EDDF2] via-[#B6F269] to-[#5EDDF2]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function ParsedEditView({
  data,
  onChange,
}: {
  data: ParsedGeneratedContent;
  onChange: (updated: ParsedGeneratedContent) => void;
}) {
  const set = (key: keyof ParsedGeneratedContent, value: any) =>
    onChange({ ...data, [key]: value });

  const setSection = (
    index: number,
    field: keyof GeneratedSection,
    value: string,
  ) => {
    const updated = (data.sections || []).map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    onChange({ ...data, sections: updated });
  };

  const fieldClass =
    "w-full resize-none rounded-xl border border-[#303A4E]/70 bg-[#0B1020]/65 p-3 text-[13px] leading-6 text-white outline-none focus:border-[#5EDDF2]/40 placeholder:text-[#78859A]";
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#9AA7BC]";

  return (
    <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
      {data.title !== undefined && (
        <div>
          <label className={labelClass}>Title</label>
          <textarea
            rows={2}
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      {data.intro !== undefined && (
        <div>
          <label className={labelClass}>Introduction</label>
          <textarea
            rows={3}
            value={data.intro || ""}
            onChange={(e) => set("intro", e.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      {data.sections && data.sections.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Sections</p>

          {data.sections.map((section, index) => (
            <div
              key={index}
              className="space-y-2 rounded-2xl border border-[#303A4E]/70 bg-[#0B1020]/55 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5EDDF2]/15 text-[10px] font-black text-[#DDFBFF]">
                  {index + 1}
                </span>

                <input
                  value={section.heading || ""}
                  onChange={(e) => setSection(index, "heading", e.target.value)}
                  placeholder="Heading"
                  className="flex-1 rounded-lg border border-[#303A4E]/70 bg-[#0B1020]/65 px-3 py-1.5 text-sm font-bold text-[#DDFBFF] outline-none placeholder:text-[#78859A] focus:border-[#5EDDF2]/40"
                />
              </div>

              <textarea
                rows={3}
                value={section.body || ""}
                onChange={(e) => setSection(index, "body", e.target.value)}
                placeholder="Body"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      )}

      {data.closing !== undefined && (
        <div>
          <label className={labelClass}>Closing</label>
          <textarea
            rows={2}
            value={data.closing || ""}
            onChange={(e) => set("closing", e.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      {data.callToAction !== undefined && (
        <div>
          <label className={labelClass}>Call To Action</label>
          <textarea
            rows={2}
            value={data.callToAction || ""}
            onChange={(e) => set("callToAction", e.target.value)}
            className={fieldClass}
          />
        </div>
      )}

      {data.hashtags !== undefined && (
        <div>
          <label className={labelClass}>Hashtags</label>
          <textarea
            rows={2}
            value={data.hashtags || ""}
            onChange={(e) => set("hashtags", e.target.value)}
            className={fieldClass}
          />
        </div>
      )}
    </div>
  );
}

function PolishedGeneratedView({ data }: { data: ParsedGeneratedContent }) {
  const hashtags = data.hashtags
    ? data.hashtags
        .split(" ")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-5">
      {data.title && (
        <div className="rounded-2xl border border-[#5EDDF2]/15 bg-gradient-to-br from-cyan-400/10 via-white/[0.04] to-lime-400/10 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7DEBFF]/80">
            Title
          </p>
          <h2 className="bg-gradient-to-r from-cyan-200 via-lime-200 to-cyan-300 bg-clip-text text-xl font-black leading-snug text-transparent sm:text-2xl">
            {data.title}
          </h2>
        </div>
      )}

      {data.intro && (
        <div className="rounded-2xl border border-[#303A4E]/70 bg-[#1A2230]/70 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA7BC]">
            Introduction
          </p>
          <p className="text-[13px] leading-6 text-[#E5EAF2]">{data.intro}</p>
        </div>
      )}

      {data.sections && data.sections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9AA7BC]">
            Sections
          </p>

          {data.sections.map((section, index) => (
            <motion.div
              key={`${section.heading}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-[#303A4E]/70 bg-[#0B1020]/65 p-4 hover:border-[#5EDDF2]/30"
            >
              <div className="mb-2 flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5EDDF2]/15 text-[11px] font-black text-[#DDFBFF]">
                  {index + 1}
                </div>

                <div>
                  {section.heading && (
                    <h3 className="text-sm font-black text-[#DDFBFF]">
                      {section.heading}
                    </h3>
                  )}

                  {section.body && (
                    <p className="mt-2 text-[13px] leading-6 text-[#C4CEDD]">
                      {section.body}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {data.closing && (
        <div className="rounded-2xl border border-[#B6F269]/15 bg-[#B6F269]/5 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B6F269]/80">
            Closing
          </p>
          <p className="text-[13px] leading-6 text-[#E5EAF2]">{data.closing}</p>
        </div>
      )}

      {data.callToAction && (
        <div className="rounded-2xl border border-[#5EDDF2]/20 bg-gradient-to-r from-cyan-400/10 to-lime-400/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-[#DDFBFF]">
            <Megaphone size={16} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Call To Action
            </p>
          </div>
          <p className="text-[13px] font-semibold leading-6 text-cyan-50">
            {data.callToAction}
          </p>
        </div>
      )}

      {hashtags.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#9AA7BC]">
            <Hash size={14} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Hashtags
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-[#5EDDF2]/20 bg-[#5EDDF2]/10 px-3 py-1.5 text-[11px] font-bold text-[#DDFBFF]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function ContentBlogWorkflow({
  showBlogFlow,
  addedToClone,
  blogPreview,
  publishedBlog,
  imageLoading,
  formatLoading,
  publishLoading,
  canPublishBlog,
  hasFormattedBlogPreview,
  onShowBlogFlow,
  onCreateImage,
  onFormatBlog,
  onPublishBlog,
  onChangePreview,
  onReset,
}: {
  showBlogFlow: boolean;
  addedToClone: boolean;
  blogPreview: BlogPayload | null;
  publishedBlog: BlogPayload | null;
  imageLoading: boolean;
  formatLoading: boolean;
  publishLoading: boolean;
  canPublishBlog: boolean;
  hasFormattedBlogPreview: boolean;
  onShowBlogFlow: () => void;
  onCreateImage: () => void;
  onFormatBlog: () => void;
  onPublishBlog: () => void;
  onChangePreview: (data: BlogPayload) => void;
  onReset: () => void;
}) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (blogPreview && hasFormattedBlogPreview && !publishedBlog) {
      setIsPreviewModalOpen(true);
    }
  }, [blogPreview, hasFormattedBlogPreview, publishedBlog]);

  if (publishedBlog) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-lime-300/20 bg-lime-300/8 p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-lime-100">
          <CheckCircle size={18} />
          <h3 className="text-sm font-black">Blog Published Successfully</h3>
        </div>
        <p className="text-xs leading-5 text-lime-50/80">
          Blog Post ID: {publishedBlog.blogPostId || "POSTED SUCCESSFULLY"}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black"
        >
          <RotateCcw size={14} />
          Refresh / New Content
        </button>
      </motion.div>
    );
  }

  if (!showBlogFlow) {
    return (
      <ActionQuestion
        text={
          addedToClone
            ? "Content is added to clone. Do you want to create a blog now?"
            : "Do you want to create a blog for this generated content?"
        }
        button="Yes, Open Blog Workflow"
        loading={false}
        onClick={onShowBlogFlow}
      />
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-[#3A465B]/70 bg-gradient-to-br from-[#0B1020]/85 via-[#111A2B]/80 to-[#0B1020]/85 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-4"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-[#DDFBFF]">
              <Newspaper size={16} />
              Blog Posting Workflow
            </p>
            <p className="mt-1 text-xs text-[#9AA7BC]">
              Left-side blog actions for quick CEO review. Preview opens in a clean modal.
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-black ${
              addedToClone
                ? "border-lime-300/25 bg-lime-300/10 text-lime-100"
                : "border-yellow-300/25 bg-yellow-300/10 text-yellow-100"
            }`}
          >
            {addedToClone ? "Clone: Added" : "Clone: Not Added"}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <WorkflowButton
            label={blogPreview?.imageUrl ? "Image Ready" : "Create Image"}
            icon={<Image size={15} />}
            loading={imageLoading}
            disabled={Boolean(blogPreview?.imageUrl)}
            onClick={onCreateImage}
          />
          <WorkflowButton
            label={hasFormattedBlogPreview ? "Refresh Blog Preview" : "Format Blog Preview"}
            icon={<FileText size={15} />}
            loading={formatLoading}
            disabled={false}
            onClick={onFormatBlog}
          />
          <WorkflowButton
            label="Open Preview Modal"
            icon={<Eye size={15} />}
            loading={false}
            disabled={!blogPreview}
            onClick={() => setIsPreviewModalOpen(true)}
          />
          <WorkflowButton
            label="Publish Blog"
            icon={<Send size={15} />}
            loading={publishLoading}
            disabled={!canPublishBlog}
            onClick={onPublishBlog}
          />
        </div>

        {!blogPreview ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#3A465B]/70 bg-[#07111f]/70 p-4 text-center text-xs leading-5 text-[#9AA7BC]">
            Click <span className="font-black text-[#DDFBFF]">Format Blog Preview</span> to prepare the blog. Image creation is optional.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-[#5EDDF2]/20 bg-[#07111f]/70 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[#DDFBFF]">
                  {blogPreview.title || "Blog preview is ready"}
                </p>
                <p className="mt-1 text-xs text-[#9AA7BC]">
                  Review/edit the blog inside modal, then publish from the top button.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black shadow-[0_14px_34px_rgba(94,221,242,0.20)]"
              >
                <Eye size={15} />
                View Blog Preview
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <BlogPreviewModal
        open={isPreviewModalOpen && Boolean(blogPreview)}
        blogPreview={blogPreview}
        canPublishBlog={canPublishBlog}
        publishLoading={publishLoading}
        onClose={() => setIsPreviewModalOpen(false)}
        onPublish={onPublishBlog}
        onChangePreview={onChangePreview}
      />
    </>
  );
}

function BlogPreviewModal({
  open,
  blogPreview,
  canPublishBlog,
  publishLoading,
  onClose,
  onPublish,
  onChangePreview,
}: {
  open: boolean;
  blogPreview: BlogPayload | null;
  canPublishBlog: boolean;
  publishLoading: boolean;
  onClose: () => void;
  onPublish: () => void;
  onChangePreview: (data: BlogPayload) => void;
}) {
  if (!open || !blogPreview) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="flex max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[28px] border border-[#3A465B]/80 bg-[#0B1020] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
        >
          <div className="sticky top-0 z-10 border-b border-[#303A4E]/80 bg-[#111A2B]/95 p-3 backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-[#DDFBFF] sm:text-base">
                  <Newspaper size={17} />
                  Blog Preview
                </p>
                <p className="mt-1 text-xs text-[#9AA7BC]">
                  Check all fields, edit if needed, then publish.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={!canPublishBlog || publishLoading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black shadow-[0_14px_34px_rgba(94,221,242,0.20)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {publishLoading ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                  {publishLoading ? "Publishing..." : "Publish Blog"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#3A465B]/80 bg-[#1A2230] px-4 text-xs font-black text-white"
                >
                  <X size={15} />
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto p-3 sm:p-4">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                {blogPreview.imageUrl ? (
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07111f] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                    <img
                      src={getImageUrl(blogPreview.imageUrl)}
                      alt="Generated blog"
                      className="max-h-[420px] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-[#3A465B]/70 bg-[#07111f]/70 p-5 text-center text-xs text-[#9AA7BC]">
                    Image not generated yet. You can still publish a text-only blog after preview fields are ready.
                  </div>
                )}

                <div className="rounded-3xl border border-[#303A4E]/70 bg-[#111A2B]/80 p-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9AA7BC]">
                    Preview Status
                  </p>
                  <div className="grid gap-2 text-xs text-[#C4CEDD]">
                    <p>Title: <span className="font-bold text-white">{blogPreview.title ? "Ready" : "Missing"}</span></p>
                    <p>Description: <span className="font-bold text-white">{blogPreview.description ? "Ready" : "Missing"}</span></p>
                    <p>Captions: <span className="font-bold text-white">{blogPreview.socialMediaCaptions ? "Ready" : "Missing"}</span></p>
                  </div>
                </div>
              </div>

              <EditableBlogPreview data={blogPreview} onChange={onChangePreview} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WorkflowButton({
  label,
  icon,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#5EDDF2]/20 bg-[#5EDDF2]/10 px-3 text-xs font-black text-[#DDFBFF] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {loading ? <Loader2 className="animate-spin" size={15} /> : icon}
      {loading ? "Processing..." : label}
    </motion.button>
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
    <div className="rounded-[24px] border border-[#5EDDF2]/25 bg-gradient-to-br from-[#5EDDF2]/12 via-[#101827]/80 to-[#B6F269]/10 p-4 shadow-[0_16px_40px_rgba(94,221,242,0.10)]">
      <p className="mb-3 text-sm font-bold text-cyan-50">{text}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={15} /> : <Newspaper size={15} />}
        {button}
      </button>
    </div>
  );
}

function EditableBlogPreview({
  data,
  onChange,
}: {
  data: BlogPayload;
  onChange: (data: BlogPayload) => void;
}) {
  const update = (key: keyof BlogPayload, value: string) =>
    onChange({ ...data, [key]: value });

  const titleValue = data.title?.trim() || "radhAI Generated Blog";
  const descriptionValue =
    data.description?.trim() || "Blog content generated from radhAI admin input.";
  const captionsValue =
    data.socialMediaCaptions?.trim() || "Ready for social media publishing.";

  return (
    <div className="space-y-3">
      <BlogInput label="Blog Title" value={titleValue} onChange={(v) => update("title", v)} />
      <BlogTextarea label="Description" value={descriptionValue} onChange={(v) => update("description", v)} />
      <BlogTextarea label="Social Media Captions" value={captionsValue} onChange={(v) => update("socialMediaCaptions", v)} />
      <BlogInput label="Added By" value={data.addedBy || "Radha"} onChange={(v) => update("addedBy", v)} />
      <BlogInput label="Image URL" value={getImageUrl(data.imageUrl)} onChange={(v) => update("imageUrl", v)} />
    </div>
  );
}

function BlogInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA7BC]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-[#303A4E]/70 bg-[#07111f] px-3 text-xs text-white outline-none focus:border-[#5EDDF2]/50"
      />
    </div>
  );
}

function BlogTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9AA7BC]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-y rounded-xl border border-[#303A4E]/70 bg-[#07111f] p-3 text-xs leading-5 text-white outline-none focus:border-[#5EDDF2]/50"
      />
    </div>
  );
}


function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#3A465B]/70 bg-[#1C2433]/82 p-3 shadow-[0_18px_60px_rgba(0,0,0,.32)] backdrop-blur-2xl sm:p-4"
    >
      {children}
    </motion.div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -2, scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className="h-11 rounded-xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] px-4 text-xs font-black text-black shadow-[0_14px_32px_rgba(94,221,242,0.20)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </motion.button>
  );
}

function FileChip({
  icon,
  name,
  onRemove,
}: {
  icon: React.ReactNode;
  name: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-full border border-[#3A465B]/70 bg-[#0B1020]/65 px-3 py-2 text-[11px] text-[#E5EAF2]">
      <span className="shrink-0 text-[#7DEBFF]">{icon}</span>
      <span className="max-w-[180px] truncate sm:max-w-[260px]">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full bg-red-500/15 p-1 text-red-200 hover:bg-red-500/25"
      >
        <X size={12} />
      </button>
    </div>
  );
}