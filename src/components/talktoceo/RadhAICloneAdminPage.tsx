import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Lock,
  User,
  Upload,
  Mic,
  Square,
  FileText,
  Save,
  X,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  Send,
  Paperclip,
  Sparkles,
  RotateCcw,
  Edit3,
  Bot,
  Hash,
  Megaphone,
  Layers,
  Brain,
  Cpu,
  Zap,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";

const STATIC_USERNAME = "radhAI.clone";
const STATIC_PASSWORD = "ceovoice";

const API_BASE_URL = "https://radhaclone-production.up.railway.app/api";

const COMPANY_UPLOAD_API = `${API_BASE_URL}/v1/upload/company`;
const CONTENT_SUBMIT_API = `${API_BASE_URL}/v1/content/submit`;
const CONTENT_APPROVE_API = `${API_BASE_URL}/v1/content/approve`;

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
    background: "#07111f",
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

  const buttonMotion = {
    whileHover: { y: -2, scale: 1.015 },
    whileTap: { scale: 0.97 },
  };

  const displayText = interimVoiceText
    ? `${rawInstruction}${rawInstruction ? " " : ""}${interimVoiceText}`
    : rawInstruction;

  const hasInputContent =
    rawInstruction.trim().length > 0 || attachments.length > 0;
  const canSubmit = Boolean(submitPlatform) && hasInputContent && !isSubmitting;
  const canUploadCompanyFiles =
    Boolean(companyPlatform) && companyFiles.length > 0 && !isCompanyUploading;
  const canApprove =
    Boolean(contentId && generatedContent.trim()) && !isApproving;

  const parsedGeneratedContent = useMemo<ParsedGeneratedContent | null>(() => {
    if (!generatedContent) return null;

    try {
      const parsed = JSON.parse(generatedContent);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [generatedContent]);

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

      const formData = new FormData();

      if (instruction) {
        formData.append("rawInstruction", instruction);
      }

      formData.append("platform", submitPlatform);

      attachments.forEach((file) => {
        formData.append("attachment", file);
      });

      console.log("Submit API Payload:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const res = await fetch(CONTENT_SUBMIT_API, {
        method: "POST",
        body: formData,
      });

      const data: SubmitResponse = await res.json();

      console.log("Submit API Response:", data);

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

  const handleApproveContent = async (approved: boolean) => {
    if (!contentId || !generatedContent.trim()) {
      toast("warning", "Generate content first");
      return;
    }

    const result = await Swal.fire({
      title: approved ? "Approve content?" : "Reject content?",
      text: approved
        ? "This generated content will be approved."
        : "This generated content will be rejected.",
      icon: approved ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: approved ? "Approve" : "Reject",
      cancelButtonText: "Cancel",
      background: "#07111f",
      color: "#ffffff",
      confirmButtonColor: approved ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      setIsApproving(true);

      const payload = {
        contentId,
        approved,
        feedback: approved ? "Approved" : "Rejected",
      };

      console.log("Approve API Payload:", payload);

      const res = await fetch(CONTENT_APPROVE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      console.log("Approve API Response:", data);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Action failed");
      }

      toast("success", approved ? "Approved successfully" : "Rejected");
      handleClear();
    } catch (error: any) {
      toast("error", error?.message || "Action failed");
    } finally {
      setIsApproving(false);
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
    if (!parsedEdits) return;
    const serialized = JSON.stringify(parsedEdits);
    setGeneratedContent(serialized);
    setEditedContent(serialized);
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
    setSubmitAttempted(false);
    setCompanyFileAttempted(false);
    setSubmitContentAttempted(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,245,255,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(132,255,0,0.13),transparent_38%)]" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-[410px] rounded-[30px] border border-white/15 bg-white/[0.07] p-5 shadow-[0_28px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-200 via-lime-200 to-cyan-400 text-black">
              <Lock size={24} />
            </div>
            <h1 className="text-xl font-black">radhAI Admin</h1>
            <p className="mt-1 text-xs text-slate-400">
              Secure content training and approval panel
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-3 text-cyan-200" size={17} />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.08] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3 text-cyan-200" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.08] pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-3 text-slate-300"
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
              className="h-11 w-full rounded-xl bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 text-sm font-black text-black shadow-[0_12px_32px_rgba(34,211,238,0.22)]"
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(0,245,255,0.22),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(132,255,0,0.14),transparent_34%)]" />

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050816]/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-200 via-lime-200 to-cyan-400 text-black shadow-[0_10px_30px_rgba(34,211,238,0.25)]">
              <Bot size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black sm:text-lg">
                radhAI Clone Admin
              </h1>
              <p className="hidden text-[11px] text-slate-400 sm:block">
                Upload, generate, review and approve AI knowledge content
              </p>
            </div>
          </div>

          <motion.button
            {...buttonMotion}
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 text-xs font-bold"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-[88px] sm:px-6 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-[26px] border border-white/15 bg-white/[0.07] p-4 shadow-[0_25px_70px_rgba(0,0,0,.36)] backdrop-blur-2xl"
        >
          <div className="mb-3 flex items-center gap-2">
            <Upload size={18} className="text-cyan-200" />
            <h2 className="text-sm font-black sm:text-base">Upload Company Knowledge File</h2>
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
            {companyFileAttempted && !companyPlatform && companyFiles.length > 0 && (
              <div className="mb-3">
                <InlineBanner variant="warning" message="Please select a Platform before uploading files." />
              </div>
            )}
          </AnimatePresence>

          <div className="grid gap-3 md:grid-cols-[1fr_130px]">
            <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-cyan-300/30 bg-white/[0.08] px-3 text-xs font-semibold">
              <FileText size={15} className="text-cyan-200" />
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

        <section className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <GlassCard>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Sparkles size={18} className="text-cyan-200" />
              <h2 className="text-sm font-black sm:text-base">
              Radha's Input
              </h2>
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
                  <InlineBanner variant="warning" message="Please select a Platform before submitting content." />
                </div>
              )}
            </AnimatePresence>

            <div className="rounded-[24px] border border-white/15 bg-black/25 p-3">
              <textarea
                value={displayText}
                onChange={(e) => {
                  setInterimVoiceText("");
                  setRawInstruction(e.target.value);
                  if (!submitPlatform) setSubmitContentAttempted(true);
                }}
                placeholder="Type content here or use the mic button. You can also attach files. Either text or file is mandatory."
                className="min-h-[240px] w-full resize-none bg-transparent p-2 text-sm leading-7 text-white outline-none placeholder:text-slate-500 sm:min-h-[350px]"
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 text-xs font-bold">
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
                      : "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                  }`}
                >
                  {isRecording ? <Square size={14} /> : <Mic size={14} />}
                  {isRecording ? "Stop Mic" : "Speak"}
                </motion.button>

                <motion.button
                  {...buttonMotion}
                  type="button"
                  onClick={handleClear}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 text-xs font-bold"
                >
                  <RotateCcw size={14} />
                  Clear
                </motion.button>

                <motion.button
                  {...buttonMotion}
                  type="button"
                  onClick={handleSubmitContent}
                  disabled={!canSubmit}
                  className="ml-auto flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 px-4 text-xs font-black text-black shadow-[0_10px_28px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
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

          <GlassCard>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-lime-200" />
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
                  className="flex min-h-[430px] items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-black/20 p-4 text-center text-sm text-slate-400"
                >
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                      <Sparkles size={22} className="text-cyan-200" />
                    </div>
                    Generated content will appear here after submit.
                    <p className="mt-1 text-xs text-slate-500">
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
                  <div className="rounded-[24px] border border-white/15 bg-black/25 p-4">
                    <div className="mb-3 flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-black text-cyan-200">
                          <Layers size={15} />
                          Polished Generated Content
                        </p>
                        {contentId && (
                          <p className="mt-1 break-all text-[11px] text-slate-400">
                            Content ID: {contentId}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!isEditing ? (
                          <motion.button
                            {...buttonMotion}
                            type="button"
                            onClick={handleStartEdit}
                            className="flex h-8 w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 text-xs font-bold"
                          >
                            <Edit3 size={13} />
                            Edit
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              {...buttonMotion}
                              type="button"
                              onClick={handleSaveEdits}
                              className="flex h-8 w-fit items-center gap-1.5 rounded-full bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 px-3 text-xs font-black text-black"
                            >
                              <Save size={13} />
                              Save
                            </motion.button>
                            <motion.button
                              {...buttonMotion}
                              type="button"
                              onClick={handleCancelEdit}
                              className="flex h-8 w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 text-xs font-bold"
                            >
                              <X size={13} />
                              Cancel
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditing ? (
                      <div className="max-h-[560px] overflow-y-auto pr-1">
                        {parsedGeneratedContent ? (
                          <PolishedGeneratedView
                            data={parsedGeneratedContent}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
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
                        className="min-h-[430px] w-full resize-none bg-transparent text-sm leading-7 text-white outline-none"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <motion.button
                      {...buttonMotion}
                      type="button"
                      onClick={() => handleApproveContent(true)}
                      disabled={!canApprove}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 text-xs font-black text-black shadow-[0_12px_30px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Save size={15} />
                      {isApproving ? "Approving" : "Approve"}
                    </motion.button>

                    <motion.button
                      {...buttonMotion}
                      type="button"
                      onClick={() => handleApproveContent(false)}
                      disabled={!canApprove}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-4 text-xs font-bold text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <X size={15} />
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
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
              onDoubleClick={() => active && onChange("")}
              className={`relative flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors ${
                active
                  ? "bg-gradient-to-r from-cyan-400 to-lime-300 text-black shadow-[0_4px_14px_rgba(34,211,238,0.35)]"
                  : "border border-white/15 bg-white/[0.06] text-slate-300 hover:border-cyan-300/40 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`platform-active-${label}`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-lime-300"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
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
    bar: "bg-cyan-400",
    border: "border-cyan-300/25",
    bg: "bg-cyan-400/8",
    icon_color: "text-cyan-300",
    text: "text-cyan-100",
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
      className={`relative flex items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-sm ${
        v.border
      } ${v.bg} ${v.glow}`}
    >
      {/* left accent bar */}
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`absolute left-0 top-0 h-full w-[3px] origin-top rounded-r-full ${v.bar}`}
      />

      {/* icon with pulse ring */}
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
  { icon: Brain, label: "Parsing your instruction", color: "text-cyan-300" },
  {
    icon: Cpu,
    label: "Retrieving company knowledge",
    color: "text-purple-300",
  },
  {
    icon: Sparkles,
    label: "Structuring content sections",
    color: "text-lime-300",
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
      className="flex min-h-[430px] flex-col items-center justify-center rounded-[24px] border border-cyan-300/20 bg-black/30 p-6 sm:p-10"
    >
      {/* Orbiting rings */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-cyan-300/30"
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

        {/* Spinning arc */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-lime-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-lime-400/20"
        >
          <Brain size={22} className="text-cyan-200" />
        </motion.div>
      </div>

      {/* Title */}
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-1 bg-gradient-to-r from-cyan-200 via-lime-200 to-cyan-300 bg-clip-text text-base font-black text-transparent sm:text-lg"
      >
        AI Reasoning
      </motion.p>
      <p className="mb-8 text-xs text-slate-500">
        Processing your content&hellip;
      </p>

      {/* Step list */}
      <div className="w-full max-w-xs space-y-3 sm:max-w-sm">
        {REASONING_STEPS.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45, duration: 0.4 }}
            className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
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

            <span className="flex-1 text-xs font-semibold text-slate-300">
              {label}
            </span>

            {/* Animated dots */}
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-cyan-400"
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

      {/* Bottom scanning bar */}
      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.06] sm:max-w-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-lime-300 to-cyan-400"
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
    "w-full resize-none rounded-xl border border-white/10 bg-black/25 p-3 text-sm leading-7 text-white outline-none focus:border-cyan-300/40 placeholder:text-slate-500";
  const labelClass =
    "mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400";

  return (
    <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
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
              className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-[10px] font-black text-cyan-100">
                  {index + 1}
                </span>
                <input
                  value={section.heading || ""}
                  onChange={(e) => setSection(index, "heading", e.target.value)}
                  placeholder="Heading"
                  className="flex-1 rounded-lg border border-white/10 bg-black/25 px-3 py-1.5 text-sm font-bold text-cyan-100 outline-none focus:border-cyan-300/40 placeholder:text-slate-500"
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
        <div className="rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-white/[0.04] to-lime-400/10 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">
            Title
          </p>
          <h2 className="bg-gradient-to-r from-cyan-200 via-lime-200 to-cyan-300 bg-clip-text text-xl font-black leading-snug text-transparent sm:text-2xl">
            {data.title}
          </h2>
        </div>
      )}

      {data.intro && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Introduction
          </p>
          <p className="text-sm leading-7 text-slate-200">{data.intro}</p>
        </div>
      )}

      {data.sections && data.sections.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Sections
          </p>

          {data.sections.map((section, index) => (
            <motion.div
              key={`${section.heading}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-white/10 bg-black/25 p-4 hover:border-cyan-300/30"
            >
              <div className="mb-2 flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-[11px] font-black text-cyan-100">
                  {index + 1}
                </div>

                <div>
                  {section.heading && (
                    <h3 className="text-sm font-black text-cyan-100">
                      {section.heading}
                    </h3>
                  )}

                  {section.body && (
                    <p className="mt-2 text-sm leading-7 text-slate-300">
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
        <div className="rounded-2xl border border-lime-300/15 bg-lime-400/5 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-lime-200/80">
            Closing
          </p>
          <p className="text-sm leading-7 text-slate-200">{data.closing}</p>
        </div>
      )}

      {data.callToAction && (
        <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400/10 to-lime-400/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-100">
            <Megaphone size={16} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Call To Action
            </p>
          </div>
          <p className="text-sm font-semibold leading-7 text-cyan-50">
            {data.callToAction}
          </p>
        </div>
      )}

      {hashtags.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Hash size={14} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Hashtags
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-bold text-cyan-100"
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

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/15 bg-white/[0.07] p-4 shadow-[0_25px_70px_rgba(0,0,0,.36)] backdrop-blur-2xl"
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
      className="h-11 rounded-xl bg-gradient-to-br from-cyan-200 via-lime-200 to-cyan-400 px-4 text-xs font-black text-black shadow-[0_10px_28px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
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
    <div className="flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-[11px] text-slate-200">
      <span className="shrink-0 text-cyan-200">{icon}</span>
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