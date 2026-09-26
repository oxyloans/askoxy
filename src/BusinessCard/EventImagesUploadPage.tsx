import React, { useState } from "react";
import { Button, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  CalendarPlus,
  ImagePlus,
  Loader2,
  UploadCloud,
} from "lucide-react";

import {
  CEO_EVENT_TYPE_OPTIONS,
  UserEventDetailsSaveRequest,
  getLoggedInUserId,
  saveUserEventDetails,
  uploadEventImages,
} from "./ceoBusinessCardApi";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  extractApiErrorMessage,
  showToastError,
  showToastSuccess,
  showToastWarning,
} from "./businessCardAuthUtils";

type Tab = "create" | "upload";
type CreateErrors = Partial<Record<"eventType" | "eventName" | "location" | "eventDate"| "emailSubjectName" | "content", string>>;

const emptyCreateForm = (): UserEventDetailsSaveRequest => ({
  content: "",
  emailSubjectName: "",
  eventDate: "",
  eventName: "",
  eventType: "",
  location:"",
});

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10";

const EventImagesUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const loggedInUserId = getLoggedInUserId();
  const [tab, setTab] = useState<Tab>("create");
  const [createForm, setCreateForm] = useState<UserEventDetailsSaveRequest>(emptyCreateForm());
  const [createErrors, setCreateErrors] = useState<CreateErrors>({});
  const [creating, setCreating] = useState(false);
  const [uploadEventType, setUploadEventType] = useState("");
  const [uploadEventTypeError, setUploadEventTypeError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);

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
    if (!createForm.location?.trim()) errors.location = "Event location is required.";
    if (!createForm.eventDate?.trim()) errors.eventDate = "Event date is required.";
    if (!createForm.emailSubjectName?.trim()) errors.emailSubjectName = "Email subject is required.";
    else if (createForm.emailSubjectName.trim().length > 150) errors.emailSubjectName = "Email subject cannot exceed 150 characters.";
    if (!createForm.content?.trim()) errors.content = "Content is required.";
    else if (createForm.content.trim().length > 2000) errors.content = "Content cannot exceed 2,000 characters.";
    return errors;
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      showToastWarning("Please sign in again to create an event.");
      return;
    }
    const errors = validateCreate();
    setCreateErrors(errors);
    if (Object.keys(errors).length) {
      showToastWarning("Please correct the highlighted fields.");
      return;
    }
    setCreating(true);
    try {
      const response = await saveUserEventDetails(createForm);
      const responseStr = typeof response === "string" ? response : JSON.stringify(response);
      const possibleMsg = (response && (response.errorMessage || response.message || response.content)) || "";
      const isPersonalDetailsRequired =
        /personal\s*details\s*first/i.test(responseStr) ||
        /personal\s*details\s*first/i.test(possibleMsg);

      if (isPersonalDetailsRequired) {
        Swal.fire({
          icon: "warning",
          title: "Personal Details Required",
          text: "Please fill personal details first.",
          confirmButtonText: "Fill Personal Details",
          confirmButtonColor: "#0891b2",
        }).then(() => {
          navigate("/business-card/my-profile");
        });
        return;
      }

      if (response && response.errorMessage) {
        showToastError(response.errorMessage);
        return;
      }

      setCreateForm(emptyCreateForm());
      setCreateErrors({});
      showToastSuccess("Event created successfully.");
      setTab("upload");
    } catch (error) {
      console.error(error);
      const msg = extractApiErrorMessage(error, "Failed to create event.");

      if (/personal\s*details\s*first/i.test(msg)) {
        Swal.fire({
          icon: "warning",
          title: "Personal Details Required",
          text: msg || "Please fill personal details first.",
          confirmButtonText: "Fill Personal Details",
          confirmButtonColor: "#0891b2",
        }).then(() => {
          navigate("/business-card/my-profile");
        });
        return;
      }

      showToastError(msg);
    } finally {
      setCreating(false);
    }
  };

  const chooseImage = (file: File | null) => {
    setImageError("");
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      const msg = "Select a valid JPG, PNG, or WEBP image.";
      setImageError(msg);
      showToastWarning(msg);
      setImageFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const msg = "Image size must be 10 MB or smaller.";
      setImageError(msg);
      showToastWarning(msg);
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      showToastWarning("Please sign in again to upload an image.");
      return;
    }
    if (!imageFile) {
      setImageError("An image is required.");
      showToastWarning("Please select an image to upload.");
      return;
    }
    if (!uploadEventType.trim()) {
      setUploadEventTypeError("Event type is required.");
      showToastWarning("Please select an event type.");
      return;
    }
    setUploading(true);
    try {
      const response = await uploadEventImages({
        file: imageFile,
        userId: loggedInUserId,
        eventType: uploadEventType,
      });
      if (response.errorMessage?.trim()) {
        if (/personal\s*details\s*first/i.test(response.errorMessage)) {
          Swal.fire({
            icon: "warning",
            title: "Personal Details Required",
            text: "Please fill personal details first.",
            confirmButtonText: "Fill Personal Details",
            confirmButtonColor: "#0891b2",
          }).then(() => navigate("/business-card/my-profile"));
          return;
        }
        showToastError(response.errorMessage);
        return;
      }
      setCreateForm((current) => ({
        ...current,
        eventType: response.eventType?.trim() || uploadEventType || current.eventType,
        eventName: response.eventName?.trim() || current.eventName,
        location: response.location?.trim() || current.location,
        eventDate: response.eventDate?.trim() || current.eventDate,
        emailSubjectName: response.emailSubjectName?.trim() || current.emailSubjectName,
        content: response.content?.trim() || current.content,
      }));
      setCreateErrors({});
      setUploadEventTypeError("");
      showToastSuccess(response.message?.trim() || "Image uploaded successfully. Complete the event details.");
      setImageFile(null);
      setImageError("");
      setTab("create");
    } catch (error) {
      console.error(error);
      const msg = extractApiErrorMessage(error, "Failed to upload image.");
      showToastError(msg);
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
                <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event location <span className="text-red-500">*</span></span><input value={createForm.location || ""} onChange={(event) => updateCreateField("location", event.target.value)} placeholder="Event location" aria-invalid={Boolean(createErrors.location)} className={`${inputClass} ${createErrors.location ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} />{createErrors.location && <p className="mt-1.5 text-xs text-red-600">{createErrors.location}</p>}</label>
                <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event date <span className="text-red-500">*</span></span><input type="date" value={createForm.eventDate || ""} onChange={(event) => updateCreateField("eventDate", event.target.value)} aria-invalid={Boolean(createErrors.eventDate)} className={`${inputClass} ${createErrors.eventDate ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} />{createErrors.eventDate && <p className="mt-1.5 text-xs text-red-600">{createErrors.eventDate}</p>}</label>
                <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Email subject <span className="text-red-500">*</span></span><input value={createForm.emailSubjectName || ""} onChange={(event) => updateCreateField("emailSubjectName", event.target.value)} placeholder="Email subject" aria-invalid={Boolean(createErrors.emailSubjectName)} className={`${inputClass} ${createErrors.emailSubjectName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} />{createErrors.emailSubjectName && <p className="mt-1.5 text-xs text-red-600">{createErrors.emailSubjectName}</p>}</label>
                <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Content <span className="text-red-500">*</span></span><textarea value={createForm.content || ""} onChange={(event) => updateCreateField("content", event.target.value)} placeholder="Add event content or notes" rows={4} aria-invalid={Boolean(createErrors.content)} className={`w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 ${createErrors.content ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`} /><div className="mt-1 flex justify-between gap-3"><span className="text-xs text-red-600">{createErrors.content}</span><span className="text-[10px] text-slate-400">{createForm.content?.length || 0}/2000</span></div></label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { setCreateForm(emptyCreateForm()); setCreateErrors({}); }} disabled={creating} className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50">Clear</button>
                <button type="submit" disabled={creating || !loggedInUserId} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}{creating ? "Creating..." : "Create event"}</button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpload} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5"><h2 className="text-sm font-semibold text-slate-800">Upload event image</h2><p className="mt-1 text-xs text-slate-500">Select the event type, then upload one image.</p></div>
            <div className="p-4 sm:p-5">
              <label className="block sm:max-w-md"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event type <span className="text-red-500">*</span></span><select value={uploadEventType} onChange={(event) => { setUploadEventType(event.target.value); setUploadEventTypeError(""); }} aria-invalid={Boolean(uploadEventTypeError)} className={`${inputClass} ${uploadEventTypeError ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}><option value="">Select event type</option>{CEO_EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{uploadEventTypeError && <p className="mt-1.5 text-xs text-red-600">{uploadEventTypeError}</p>}</label>
              <div className="mt-5"><div className="mb-1.5 flex items-center justify-between"><span className="text-xs font-semibold text-slate-700">Image <span className="text-red-500">*</span></span><span className="text-[10px] text-slate-400">Maximum 10 MB</span></div><div className={`rounded-xl border p-6 text-center sm:p-9 ${imageError ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50/60"}`}><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><UploadCloud className="h-6 w-6" /></div><p className="mt-3 break-all text-sm font-semibold text-slate-700">{imageFile?.name || "Select an image to upload"}</p><p className="mt-1 text-xs text-slate-400">JPG, PNG, or WEBP</p><Upload accept="image/*" maxCount={1} fileList={imageFile ? [{ uid: "event-image", name: imageFile.name, status: "done" }] : []} beforeUpload={(file) => { chooseImage(file); return false; }} onRemove={() => { chooseImage(null); return true; }} className="mt-4 [&_.ant-upload-list]:text-left"><Button type="default">Select image</Button></Upload></div>{imageError && <p className="mt-1.5 text-xs text-red-600">{imageError}</p>}</div>
              <div className="mt-5 flex justify-end border-t border-slate-100 pt-4"><button type="submit" disabled={uploading || !loggedInUserId} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-[180px]">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Uploading..." : "Upload image"}</button></div>
            </div>
          </form>
        )}
      </div>
    </BusinessCardLayout>
  );
};

export default EventImagesUploadPage;
