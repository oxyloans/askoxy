import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Upload } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AlertTriangle,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  UserEventDetailsResponse,
  fetchUserEventDetailsByUserId,
  formatEventTypeLabel,
  getLoggedInUserId,
  processBusinessCardUpload,
} from "./ceoBusinessCardApi";
import {
  extractApiErrorMessage,
  showToastError,
  showToastSuccess,
  showToastWarning,
} from "./businessCardAuthUtils";

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
  const Icon = imageOnly ? FileImage : FileText;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label} {required ? <span className="text-red-500">*</span> : <span className="font-normal text-slate-400">(optional)</span>}
        </label>
        <span className="text-[10px] text-slate-400">Maximum 10 MB</span>
      </div>
      <div className={`rounded-xl border p-5 text-center transition sm:p-7 ${error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50/60"}`}>
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><Icon className="h-5 w-5" /></div>
        <p className="mt-2 break-all text-sm font-semibold text-slate-700">{file?.name || description}</p>
        <p className="mt-1 text-xs text-slate-400">{imageOnly ? "JPG, PNG, or WEBP" : "PNG, JPG, WEBP, or PDF"}</p>
        <Upload
          accept={accept}
          maxCount={1}
          fileList={file ? [{ uid: id, name: file.name, status: "done" }] : []}
          beforeUpload={(nextFile) => { onFile(nextFile); return false; }}
          onRemove={() => { onFile(null); return true; }}
          className="mt-3 [&_.ant-upload-list]:text-left"
        >
          <Button type="default">Select file</Button>
        </Upload>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const ProcessBusinessCardPage: React.FC = () => {
  const navigate = useNavigate();
  const loggedInUserId = getLoggedInUserId();
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [activeEvents, setActiveEvents] = useState<UserEventDetailsResponse[]>([]);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [processingMode, setProcessingMode] = useState<"mobile" | "business-card">("mobile");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ card?: string; photo?: string; mobile?: string }>({});

  const hasMultipleActive = activeEvents.length > 1;
  const selectedEvent = activeEvents.length === 1 ? activeEvents[0] : null;
  const eventType = selectedEvent?.eventType || "";
  const isMobileMode = processingMode === "mobile";

  const activeEventNames = useMemo(() => activeEvents.map((item) =>
    `${item.eventName || "Event"} (${formatEventTypeLabel(item.eventType || undefined)})`
  ), [activeEvents]);

  const loadEvents = useCallback(async () => {
    if (!loggedInUserId) {
      setActiveEvents([]);
      showToastWarning("Please sign in again to load events.");
      return;
    }
    setLoadingEvents(true);
    try {
      const data = await fetchUserEventDetailsByUserId(loggedInUserId);
      setActiveEvents(Array.isArray(data) ? data.filter((item) => item.id && item.active === true) : []);
    } catch (error) {
      console.error(error);
      setActiveEvents([]);
      showToastError(extractApiErrorMessage(error, "Failed to load events."));
    } finally {
      setLoadingEvents(false);
    }
  }, [loggedInUserId]);

  useEffect(() => { loadEvents(); }, [loadEvents]);
  useEffect(() => {
    setErrors({});
    if (isMobileMode) setCardFile(null);
    else setMobileNumber("");
  }, [isMobileMode]);

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
      showToastWarning("Please sign in again to process a card.");
      return;
    }
    if (hasMultipleActive) {
      showToastWarning("Keep only one active event before processing.");
      return;
    }
    if (!selectedEvent || !eventType) {
      showToastWarning("Activate one event before processing.");
      return;
    }

    const nextErrors: typeof errors = { photo: validateFile(photoFile, true, false) };
    if (!isMobileMode) nextErrors.card = validateFile(cardFile, false);
    else {
      const normalizedPhone = mobileNumber.replace(/[\s()-]/g, "");
      if (!mobileNumber.trim()) nextErrors.mobile = "Mobile number is required.";
      else if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) nextErrors.mobile = "Enter a valid mobile number with 7 to 15 digits.";
    }
    const presentErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, value]) => Boolean(value)));
    setErrors(presentErrors);
    if (Object.keys(presentErrors).length) {
      showToastWarning("Please correct the highlighted fields.");
      return;
    }

    setUploading(true);
    try {
      const result = await processBusinessCardUpload({
        userId: loggedInUserId,
        file: !isMobileMode ? cardFile || undefined : undefined,
        photo: photoFile || undefined,
        mobileNumber: isMobileMode ? mobileNumber.trim() : undefined,
      });
      showToastSuccess(result || "Upload processed successfully.");
      setCardFile(null);
      setPhotoFile(null);
      setMobileNumber("");
      setErrors({});
    } catch (error) {
      console.error(error);
      const message = extractApiErrorMessage(error, "Failed to process business card.");
      if (/personal\s*details\s*first/i.test(message)) {
        Swal.fire({
          icon: "warning",
          title: "Personal Details Required",
          text: "Please fill personal details first.",
          confirmButtonText: "Fill Personal Details",
          confirmButtonColor: "#0891b2",
        }).then(() => navigate("/business-card/my-profile"));
        return;
      }
      showToastError(message);
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
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">Choose mobile with selfie or business card with selfie for your currently active event.</p>
          </div>
          <button type="button" onClick={loadEvents} disabled={!loggedInUserId || loadingEvents} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            <RefreshCw className={`h-4 w-4 ${loadingEvents ? "animate-spin" : ""}`} />Refresh events
          </button>
        </header>

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
                </div>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-xs font-semibold text-slate-700">Choose how you want to process the card</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition focus-within:ring-4 focus-within:ring-cyan-500/10 ${isMobileMode ? "border-cyan-600 bg-cyan-50 shadow-sm" : "border-slate-200 bg-slate-50/60 hover:border-cyan-300 hover:bg-cyan-50/40"}`}>
                      <input type="radio" name="processing-mode" value="mobile" checked={isMobileMode} onChange={() => setProcessingMode("mobile")} className="h-4 w-4 shrink-0 accent-cyan-600" />
                      <span className="min-w-0 flex-1"><span className={`block text-sm font-semibold ${isMobileMode ? "text-cyan-900" : "text-slate-800"}`}>Mobile with selfie</span><span className="mt-0.5 block text-xs text-slate-600">Add a mobile number. Profile photo is optional.</span></span>
                    </label>
                    <label className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition focus-within:ring-4 focus-within:ring-cyan-500/10 ${!isMobileMode ? "border-cyan-600 bg-cyan-50 shadow-sm" : "border-slate-200 bg-slate-50/60 hover:border-cyan-300 hover:bg-cyan-50/40"}`}>
                      <input type="radio" name="processing-mode" value="business-card" checked={!isMobileMode} onChange={() => setProcessingMode("business-card")} className="h-4 w-4 shrink-0 accent-cyan-600" />
                      <span className="min-w-0 flex-1"><span className={`block text-sm font-semibold ${!isMobileMode ? "text-cyan-900" : "text-slate-800"}`}>Business card with selfie</span><span className="mt-0.5 block text-xs text-slate-600">Upload a business card. Profile photo is optional.</span></span>
                    </label>
                  </div>
                </fieldset>

                {isMobileMode && <label className="mt-5 block sm:max-w-xl"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Mobile number <span className="text-red-500">*</span></span><input value={mobileNumber} onChange={(event) => { setMobileNumber(event.target.value); setErrors((current) => ({ ...current, mobile: undefined })); }} placeholder="e.g. +91 86865 45986" inputMode="tel" aria-invalid={Boolean(errors.mobile)} className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm outline-none transition focus:ring-4 ${errors.mobile ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-cyan-600 focus:ring-cyan-500/10"}`} />{errors.mobile && <p className="mt-1.5 text-xs text-red-600">{errors.mobile}</p>}</label>}

                <div className={`mt-5 grid grid-cols-1 gap-5 ${isMobileMode ? "sm:max-w-xl" : "lg:grid-cols-2"}`}>
                  {!isMobileMode && <FilePicker id="card-file" label="Business card file" description="Drop the card file here" accept="image/*,.pdf" file={cardFile} onFile={(file) => { setCardFile(file); setErrors((current) => ({ ...current, card: undefined })); }} error={errors.card} />}
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
