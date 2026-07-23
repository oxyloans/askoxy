import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  ImagePlus,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  CEO_EVENT_TYPE_OPTIONS,
  EventImageUploadResponse,
  UserEventDetailsSaveRequest,
  getLoggedInUserId,
  saveUserEventDetails,
  uploadEventImages,
} from "./ceoBusinessCardApi";

type Tab = "create" | "upload";
type Notice = { type: "success" | "warning" | "error"; text: string } | null;
type CreateErrors = Partial<Record<"eventType" | "eventName" | "emailSubjectName" | "content", string>>;

const emptyCreateForm = (): UserEventDetailsSaveRequest => ({
  content: "",
  emailSubjectName: "",
  eventName: "",
  eventType: "",
});

const extractApiMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as unknown;
    if (typeof data === "string" && data.trim()) return data.trim();
    if (data && typeof data === "object") {
      const body = data as Record<string, unknown>;
      for (const key of ["message", "errorMessage", "error", "details", "responseMessage"]) {
        const value = body[key];
        if (typeof value === "string" && value.trim()) return value.trim();
        if (Array.isArray(value) && value.length) return value.map(String).join(", ");
      }
      if (body.errors && typeof body.errors === "object") {
        const messages = Object.values(body.errors as Record<string, unknown>)
          .flatMap((value) => Array.isArray(value) ? value : [value])
          .filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
        if (messages.length) return messages.join(", ");
      }
    }
    return error.response?.statusText || error.message;
  }
  return error instanceof Error ? error.message : String(error);
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10";

const EventImagesUploadPage: React.FC = () => {
  const loggedInUserId = getLoggedInUserId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("create");
  const [notice, setNotice] = useState<Notice>(null);
  const [createForm, setCreateForm] = useState<UserEventDetailsSaveRequest>(emptyCreateForm());
  const [createErrors, setCreateErrors] = useState<CreateErrors>({});
  const [creating, setCreating] = useState(false);
  const [uploadEventType, setUploadEventType] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState<EventImageUploadResponse | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const updateCreateField = (key: keyof UserEventDetailsSaveRequest, value: string) => {
    setCreateForm((current) => ({ ...current, [key]: value }));
    setCreateErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validateCreate = (): CreateErrors => {
    const errors: CreateErrors = {};
    const eventName = createForm.eventName?.trim() || "";
    if (!createForm.eventType?.trim()) errors.eventType = "Event type is required.";
    if (!eventName) errors.eventName = "Event name is required.";
    else if (eventName.length < 3) errors.eventName = "Event name must contain at least 3 characters.";
    else if (eventName.length > 120) errors.eventName = "Event name cannot exceed 120 characters.";
    if ((createForm.emailSubjectName?.trim().length || 0) > 150) errors.emailSubjectName = "Email subject cannot exceed 150 characters.";
    if ((createForm.content?.trim().length || 0) > 2000) errors.content = "Content cannot exceed 2,000 characters.";
    return errors;
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      setNotice({ type: "warning", text: "Please sign in again to create an event." });
      return;
    }
    const errors = validateCreate();
    setCreateErrors(errors);
    if (Object.keys(errors).length) {
      setNotice({ type: "warning", text: "Please correct the highlighted fields." });
      return;
    }
    setCreating(true);
    try {
      await saveUserEventDetails(createForm);
      setCreateForm(emptyCreateForm());
      setCreateErrors({});
      setNotice({ type: "success", text: "Event created successfully." });
      setTab("upload");
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setCreating(false);
    }
  };

  const chooseImage = (file: File | null) => {
    setImageError("");
    setLastUpload(null);
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageError("Select a valid JPG, PNG, or WEBP image.");
      setImageFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image size must be 10 MB or smaller.");
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      setNotice({ type: "warning", text: "Please sign in again to upload an image." });
      return;
    }
    if (!imageFile) {
      setImageError("An image is required.");
      setNotice({ type: "warning", text: "Please select an image to upload." });
      return;
    }
    setUploading(true);
    try {
      const response = await uploadEventImages({
        file: imageFile,
        userId: loggedInUserId,
        eventType: uploadEventType || undefined,
      });
      setLastUpload({
        ...response,
        fileName: response.fileName || imageFile.name,
        eventType: response.eventType || uploadEventType || null,
        uploadedAt: response.uploadedAt || new Date().toISOString(),
      });
      setNotice({ type: "success", text: response.message || "Image uploaded successfully." });
      setImageFile(null);
      setImageError("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <BusinessCardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 border-b border-slate-200 pb-4 sm:mb-5">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Event Details</h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">Create an event, then upload and organize its images from one workspace.</p>
        </header>

        {notice && (
          <div className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-800"}`} role="status">
            {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
            <span className="flex-1">{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:mb-5 sm:w-fit sm:min-w-[340px]" role="tablist" aria-label="Event actions">
          <button type="button" role="tab" aria-selected={tab === "create"} onClick={() => setTab("create")} className={`flex h-10 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition sm:text-sm ${tab === "create" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><CalendarPlus className="h-4 w-4" />Create Event</button>
          <button type="button" role="tab" aria-selected={tab === "upload"} onClick={() => setTab("upload")} className={`flex h-10 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition sm:text-sm ${tab === "upload" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><ImagePlus className="h-4 w-4" />Image Upload</button>
        </div>

        {tab === "create" ? (
          <form onSubmit={handleCreate} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5"><h2 className="text-sm font-semibold text-slate-800">Create a new event</h2><p className="mt-1 text-xs text-slate-500">Add the event details below. An image is not required at this step.</p></div>
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event type <span className="text-red-500">*</span></span><select value={createForm.eventType || ""} onChange={(event) => updateCreateField("eventType", event.target.value)} aria-invalid={Boolean(createErrors.eventType)} className={`${inputClass} ${createErrors.eventType ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}><option value="">Select event type</option>{CEO_EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{createErrors.eventType && <p className="mt-1.5 text-xs text-red-600">{createErrors.eventType}</p>}</label>
                <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event name <span className="text-red-500">*</span></span><input value={createForm.eventName || ""} onChange={(event) => updateCreateField("eventName", event.target.value)} placeholder="Event name" aria-invalid={Boolean(createErrors.eventName)} className={`${inputClass} ${createErrors.eventName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} />{createErrors.eventName && <p className="mt-1.5 text-xs text-red-600">{createErrors.eventName}</p>}</label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Email subject</span><input value={createForm.emailSubjectName || ""} onChange={(event) => updateCreateField("emailSubjectName", event.target.value)} placeholder="Email subject" aria-invalid={Boolean(createErrors.emailSubjectName)} className={`${inputClass} ${createErrors.emailSubjectName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} />{createErrors.emailSubjectName && <p className="mt-1.5 text-xs text-red-600">{createErrors.emailSubjectName}</p>}</label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Content</span><textarea value={createForm.content || ""} onChange={(event) => updateCreateField("content", event.target.value)} placeholder="Add event content or notes" rows={4} aria-invalid={Boolean(createErrors.content)} className={`w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 ${createErrors.content ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} /><div className="mt-1 flex justify-between gap-3"><span className="text-xs text-red-600">{createErrors.content}</span><span className="text-[10px] text-slate-400">{createForm.content?.length || 0}/2000</span></div></label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { setCreateForm(emptyCreateForm()); setCreateErrors({}); }} disabled={creating} className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50">Clear</button>
                <button type="submit" disabled={creating || !loggedInUserId} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}{creating ? "Creating..." : "Create event"}</button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpload} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5"><h2 className="text-sm font-semibold text-slate-800">Upload event image</h2><p className="mt-1 text-xs text-slate-500">Select an event type if applicable, then upload one image.</p></div>
            <div className="p-4 sm:p-5">
              <label className="block sm:max-w-md"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event type <span className="font-normal text-slate-400">(optional)</span></span><select value={uploadEventType} onChange={(event) => setUploadEventType(event.target.value)} className={inputClass}><option value="">Select event type</option>{CEO_EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <div className="mt-5"><div className="mb-1.5 flex items-center justify-between"><label htmlFor="event-image" className="text-xs font-semibold text-slate-700">Image <span className="text-red-500">*</span></label><span className="text-[10px] text-slate-400">Maximum 10 MB</span></div><input ref={inputRef} id="event-image" type="file" accept="image/*" className="sr-only" onChange={(event) => chooseImage(event.target.files?.[0] || null)} /><div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseImage(event.dataTransfer.files?.[0] || null); }} className={`rounded-xl border-2 border-dashed p-6 text-center transition sm:p-9 ${imageError ? "border-red-300 bg-red-50/40" : dragging ? "border-cyan-500 bg-cyan-50" : "border-slate-300 bg-slate-50/60 hover:border-cyan-400 hover:bg-cyan-50/40"}`}><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><UploadCloud className="h-6 w-6" /></div><p className="mt-3 break-all text-sm font-semibold text-slate-700">{imageFile?.name || "Drag and drop your image here"}</p><p className="mt-1 text-xs text-slate-400">JPG, PNG, or WEBP</p><button type="button" onClick={() => inputRef.current?.click()} className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">{imageFile ? "Choose another" : "Browse files"}</button></div>{imageError && <p className="mt-1.5 text-xs text-red-600">{imageError}</p>}</div>
              {lastUpload && <div className="mt-5 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50"><div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">{lastUpload.imageUrl ? <a href={lastUpload.imageUrl} target="_blank" rel="noreferrer" className="flex h-40 items-center justify-center bg-white"><img src={lastUpload.imageUrl} alt="Uploaded event" className="max-h-40 w-full object-contain" /></a> : <div className="flex h-28 items-center justify-center bg-white text-slate-300"><ImagePlus className="h-8 w-8" /></div>}<div className="flex flex-col justify-center p-4"><p className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" />Uploaded successfully</p>{lastUpload.fileName && <p className="mt-2 break-all text-xs text-emerald-700">{lastUpload.fileName}</p>}</div></div></div>}
              <div className="mt-5 flex justify-end border-t border-slate-100 pt-4"><button type="submit" disabled={uploading || !loggedInUserId} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-[180px]">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Uploading..." : "Upload image"}</button></div>
            </div>
          </form>
        )}
      </div>
    </BusinessCardLayout>
  );
};

export default EventImagesUploadPage;
