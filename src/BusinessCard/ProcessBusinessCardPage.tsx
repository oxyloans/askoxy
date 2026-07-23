import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  UserEventDetailsResponse,
  fetchUserEventDetailsByUserId,
  formatEventTypeLabel,
  getLoggedInUserId,
  isBusinessEventType,
  processBusinessCardUpload,
} from "./ceoBusinessCardApi";

type Notice = { type: "success" | "warning" | "error"; text: string } | null;

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

interface FilePickerProps {
  id: string;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  onFile: (file: File | null) => void;
  imageOnly?: boolean;
  required?: boolean;
  error?: string;
}

const FilePicker: React.FC<FilePickerProps> = ({
  id,
  label,
  description,
  accept,
  file,
  onFile,
  imageOnly,
  required = true,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const Icon = imageOnly ? FileImage : FileText;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label} {required ? <span className="text-red-500">*</span> : <span className="font-normal text-slate-400">(optional)</span>}
        </label>
        <span className="text-[10px] text-slate-400">Maximum 10 MB</span>
      </div>
      <input ref={inputRef} id={id} type="file" accept={accept} className="sr-only" onChange={(event) => onFile(event.target.files?.[0] || null)} />
      <div
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); onFile(event.dataTransfer.files?.[0] || null); }}
        className={`rounded-xl border-2 border-dashed p-5 text-center transition sm:p-7 ${error ? "border-red-300 bg-red-50/40" : dragging ? "border-cyan-500 bg-cyan-50" : "border-slate-300 bg-slate-50/60 hover:border-cyan-400 hover:bg-cyan-50/40"}`}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><Icon className="h-5 w-5" /></div>
        <p className="mt-2 break-all text-sm font-semibold text-slate-700">{file?.name || description}</p>
        <p className="mt-1 text-xs text-slate-400">{imageOnly ? "JPG, PNG, or WEBP" : "PNG, JPG, WEBP, or PDF"}</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10">
          {file ? "Choose another" : "Browse files"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const ProcessBusinessCardPage: React.FC = () => {
  const loggedInUserId = getLoggedInUserId();
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [activeEvents, setActiveEvents] = useState<UserEventDetailsResponse[]>([]);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [errors, setErrors] = useState<{ card?: string; photo?: string; mobile?: string }>({});

  const hasMultipleActive = activeEvents.length > 1;
  const selectedEvent = activeEvents.length === 1 ? activeEvents[0] : null;
  const eventType = selectedEvent?.eventType || "";
  const isBusinessEvent = isBusinessEventType(eventType);

  const activeEventNames = useMemo(() => activeEvents.map((item) =>
    `${item.eventName || "Event"} (${formatEventTypeLabel(item.eventType || undefined)})`
  ), [activeEvents]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadEvents = useCallback(async () => {
    if (!loggedInUserId) {
      setActiveEvents([]);
      setNotice({ type: "warning", text: "Please sign in again to load events." });
      return;
    }
    setLoadingEvents(true);
    try {
      const data = await fetchUserEventDetailsByUserId(loggedInUserId);
      setActiveEvents(Array.isArray(data) ? data.filter((item) => item.id && item.active === true) : []);
    } catch (error) {
      console.error(error);
      setActiveEvents([]);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setLoadingEvents(false);
    }
  }, [loggedInUserId]);

  useEffect(() => { loadEvents(); }, [loadEvents]);
  useEffect(() => {
    setErrors({});
    if (isBusinessEvent) setMobileNumber("");
    else setCardFile(null);
  }, [isBusinessEvent]);

  const validateFile = (file: File | null, imageOnly: boolean, required = true): string | undefined => {
    if (!file) return required ? "This file is required." : undefined;
    const validType = imageOnly ? file.type.startsWith("image/") : file.type.startsWith("image/") || file.type === "application/pdf";
    if (!validType) return imageOnly ? "Select a valid JPG, PNG, or WEBP image." : "Select a valid image or PDF file.";
    if (file.size > 10 * 1024 * 1024) return "File size must be 10 MB or smaller.";
    return undefined;
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      setNotice({ type: "warning", text: "Please sign in again to process a card." });
      return;
    }
    if (hasMultipleActive) {
      setNotice({ type: "warning", text: "Keep only one active event before processing." });
      return;
    }
    if (!selectedEvent || !eventType) {
      setNotice({ type: "warning", text: "Activate one event before processing." });
      return;
    }

    const nextErrors: typeof errors = { photo: validateFile(photoFile, true, false) };
    if (isBusinessEvent) nextErrors.card = validateFile(cardFile, false);
    else {
      const normalizedPhone = mobileNumber.replace(/[\s()-]/g, "");
      if (!mobileNumber.trim()) nextErrors.mobile = "Mobile number is required.";
      else if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) nextErrors.mobile = "Enter a valid mobile number with 7 to 15 digits.";
    }
    const presentErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, value]) => Boolean(value)));
    setErrors(presentErrors);
    if (Object.keys(presentErrors).length) {
      setNotice({ type: "warning", text: "Please correct the highlighted fields." });
      return;
    }

    setUploading(true);
    try {
      const result = await processBusinessCardUpload({
        userId: loggedInUserId,
        file: isBusinessEvent ? cardFile || undefined : undefined,
        photo: photoFile || undefined,
        mobileNumber: !isBusinessEvent ? mobileNumber.trim() : undefined,
      });
      setNotice({ type: "success", text: result });
      setCardFile(null);
      setPhotoFile(null);
      setMobileNumber("");
      setErrors({});
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
        <header className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Process Card</h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">Upload a business card for your currently active event. A profile photo is optional.</p>
          </div>
          <button type="button" onClick={loadEvents} disabled={!loggedInUserId || loadingEvents} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            <RefreshCw className={`h-4 w-4 ${loadingEvents ? "animate-spin" : ""}`} />Refresh events
          </button>
        </header>

        {notice && (
          <div className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-800"}`} role="status">
            {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
            <span className="flex-1">{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
          </div>
        )}

        <form onSubmit={handleUpload} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-slate-800">Card processing details</h2>
          </div>
          <div className="p-4 sm:p-5">
            {loadingEvents ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-sm text-slate-500"><Loader2 className="mb-3 h-6 w-6 animate-spin text-cyan-600" />Loading active events...</div>
            ) : activeEvents.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">No active event was found. Open <Link to="/business-card/event-list" className="font-semibold text-cyan-700 underline underline-offset-2">Event List</Link> and activate one event.</div>
            ) : hasMultipleActive ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2 text-sm text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p>Only one event can be active while processing cards. Set the remaining events to inactive.</p></div>
                <ul className="mt-3 space-y-2 border-t border-amber-200 pt-3">{activeEventNames.map((name) => <li key={name} className="flex gap-2 text-sm text-slate-700"><span className="text-amber-500">•</span>{name}</li>)}</ul>
                <Link to="/business-card/event-list" className="mt-4 inline-flex text-sm font-semibold text-cyan-700 underline underline-offset-2">Manage active events</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Active event</span><input value={`${selectedEvent?.eventName || "Event"} (${formatEventTypeLabel(selectedEvent?.eventType || undefined)})`} readOnly className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 outline-none" /></label>
                  <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event type</span><input value={formatEventTypeLabel(eventType)} readOnly className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700 outline-none" /></label>
                  {!isBusinessEvent && <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Mobile number <span className="text-red-500">*</span></span><input value={mobileNumber} onChange={(event) => { setMobileNumber(event.target.value); setErrors((current) => ({ ...current, mobile: undefined })); }} placeholder="e.g. +91 86865 45986" inputMode="tel" aria-invalid={Boolean(errors.mobile)} className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm outline-none transition focus:ring-4 ${errors.mobile ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-cyan-600 focus:ring-cyan-500/10"}`} />{errors.mobile && <p className="mt-1.5 text-xs text-red-600">{errors.mobile}</p>}</label>}
                </div>

                <div className={`mt-5 grid grid-cols-1 gap-5 ${isBusinessEvent ? "lg:grid-cols-2" : "sm:max-w-xl"}`}>
                  {isBusinessEvent && <FilePicker id="card-file" label="Business card file" description="Drop the card file here" accept="image/*,.pdf" file={cardFile} onFile={(file) => { setCardFile(file); setErrors((current) => ({ ...current, card: undefined })); }} error={errors.card} />}
                  <FilePicker id="photo-file" label="Profile photo" description="Drop the profile photo here" accept="image/*" imageOnly required={false} file={photoFile} onFile={(file) => { setPhotoFile(file); setErrors((current) => ({ ...current, photo: undefined })); }} error={errors.photo} />
                </div>

                <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                  <button type="submit" disabled={!loggedInUserId || uploading} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-[180px]">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Processing..." : "Process card"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </BusinessCardLayout>
  );
};

export default ProcessBusinessCardPage;
