import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  PersonalDetailsProfileResponse,
  PersonalDetailsWithDocumentResponse,
  UpdatePersonalDetailsRequest,
  fetchPersonalDetailsByUserId,
  getLoggedInUserId,
  savePersonalDetailsWithDocument,
  updatePersonalDetails,
} from "./ceoBusinessCardApi";

type Section = "profile" | "documents";
type Notice = { type: "success" | "warning" | "error"; text: string } | null;
type FieldErrors = Partial<Record<keyof UpdatePersonalDetailsRequest, string>>;

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
      const validationErrors = body.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const messages = Object.values(validationErrors as Record<string, unknown>)
          .flatMap((value) => Array.isArray(value) ? value : [value])
          .filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
        if (messages.length) return messages.join(", ");
      }
    }
    return error.response?.statusText || error.message;
  }
  if (error instanceof Error) return error.message;
  return String(error);
};

const validateProfile = (values: UpdatePersonalDetailsRequest): FieldErrors => {
  const errors: FieldErrors = {};
  const name = values.userName?.trim() || "";
  if (!name) errors.userName = "Name is required.";
  else if (name.length < 2) errors.userName = "Name must contain at least 2 characters.";
  else if (name.length > 100) errors.userName = "Name cannot exceed 100 characters.";

  if ((values.companyName?.trim().length || 0) > 120) errors.companyName = "Company cannot exceed 120 characters.";
  if ((values.designation?.trim().length || 0) > 100) errors.designation = "Designation cannot exceed 100 characters.";
  if ((values.location?.trim().length || 0) > 150) errors.location = "Location cannot exceed 150 characters.";

  const emails = values.email?.split(",").map((value) => value.trim()).filter(Boolean) || [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emails.some((email) => !emailPattern.test(email))) errors.email = "Enter valid email addresses separated by commas.";

  const phones = values.mobileNumber?.split(",").map((value) => value.trim()).filter(Boolean) || [];
  const phonePattern = /^\+?[0-9()\-\s]{7,20}$/;
  if (phones.some((phone) => !phonePattern.test(phone))) errors.mobileNumber = "Enter valid mobile numbers separated by commas.";

  const linkedin = values.linkedin?.trim();
  if (linkedin) {
    try {
      const url = new URL(linkedin);
      if (!/^https?:$/.test(url.protocol) || !url.hostname.toLowerCase().includes("linkedin.com")) {
        errors.linkedin = "Enter a valid LinkedIn URL.";
      }
    } catch {
      errors.linkedin = "Enter a complete LinkedIn URL, including https://.";
    }
  }
  return errors;
};

const emptyForm = (): UpdatePersonalDetailsRequest => ({
  userId: "",
  userName: "",
  mobileNumber: "",
  email: "",
  companyName: "",
  designation: "",
  linkedin: "",
  location: "",
});

const profileToForm = (
  userId: string,
  profile: PersonalDetailsProfileResponse | null
): UpdatePersonalDetailsRequest => ({
  userId,
  userName: profile?.userName || "",
  mobileNumber: profile?.mobileNumber || "",
  email: profile?.email || "",
  companyName: profile?.companyName || "",
  designation: profile?.designation || "",
  linkedin: profile?.linkedin || "",
  location: profile?.location || "",
});

const mergeSavedProfile = (
  userId: string,
  saved: UpdatePersonalDetailsRequest,
  response?: PersonalDetailsProfileResponse | null
): UpdatePersonalDetailsRequest => ({
  userId,
  userName: response?.userName?.trim() || saved.userName?.trim() || "",
  mobileNumber: response?.mobileNumber?.trim() || saved.mobileNumber?.trim() || "",
  email: response?.email?.trim() || saved.email?.trim() || "",
  companyName: response?.companyName?.trim() || saved.companyName?.trim() || "",
  designation: response?.designation?.trim() || saved.designation?.trim() || "",
  linkedin: response?.linkedin?.trim() || saved.linkedin?.trim() || "",
  location: response?.location?.trim() || saved.location?.trim() || "",
});

const getInitials = (name?: string | null) =>
  name?.trim()
    ? name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()
    : "U";

const displayValue = (value?: string | null) => value?.trim() || "Not provided";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100";
const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300";
const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/10 disabled:cursor-not-allowed disabled:opacity-50";

const PersonalDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loggedInUserId = getLoggedInUserId();
  const initialSection: Section = location.pathname.includes("personal-details-document")
    ? "documents"
    : "profile";

  const [section, setSection] = useState<Section>(initialSection);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UpdatePersonalDetailsRequest>(emptyForm());
  const [draft, setDraft] = useState<UpdatePersonalDetailsRequest>(emptyForm());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lastUpload, setLastUpload] = useState<PersonalDetailsWithDocumentResponse | null>(null);

  useEffect(() => {
    setSection(location.pathname.includes("personal-details-document") ? "documents" : "profile");
  }, [location.pathname]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadProfile = useCallback(async () => {
    if (!loggedInUserId) {
      setNotice({ type: "warning", text: "Please sign in again to view your profile." });
      return;
    }
    setLoading(true);
    try {
      const data = await fetchPersonalDetailsByUserId(loggedInUserId);
      const next = profileToForm(loggedInUserId, data);
      setProfile(next);
      setDraft(next);
      setEditing(false);
      setFieldErrors({});
    } catch (error) {
      console.error(error);
      const next = profileToForm(loggedInUserId, null);
      setProfile(next);
      setDraft(next);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const changeSection = (next: Section) => {
    setSection(next);
    navigate(next === "profile" ? "/business-card/my-profile" : "/business-card/personal-details-document");
  };

  const updateField = (key: keyof UpdatePersonalDetailsRequest, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId) {
      setNotice({ type: "warning", text: "Please sign in again to update your profile." });
      return;
    }
    const validationErrors = validateProfile(draft);
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setNotice({ type: "warning", text: "Please correct the highlighted fields." });
      return;
    }

    setSaving(true);
    const payload = { ...draft, userId: loggedInUserId };
    try {
      const immediate = mergeSavedProfile(loggedInUserId, payload);
      setProfile(immediate);
      setDraft(immediate);
      const updated = await updatePersonalDetails(payload);
      const next = mergeSavedProfile(loggedInUserId, payload, updated);
      setProfile(next);
      setDraft(next);
      setEditing(false);
      setFieldErrors({});
      setNotice({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const chooseFile = (file?: File | null) => {
    if (!file) return;
    const validType = file.type.startsWith("image/") || file.type === "application/pdf";
    if (!validType) {
      setNotice({ type: "warning", text: "Choose a PNG, JPG, WEBP, or PDF file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNotice({ type: "warning", text: "The selected file must be 10 MB or smaller." });
      return;
    }
    setDocumentFile(file);
    setLastUpload(null);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId || !documentFile) {
      setNotice({ type: "warning", text: loggedInUserId ? "Please select a file." : "Please sign in again to upload." });
      return;
    }
    setUploading(true);
    try {
      const response = await savePersonalDetailsWithDocument({ file: documentFile, userId: loggedInUserId });
      setLastUpload(response);
      setDocumentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotice({ type: "success", text: response.message || "Document uploaded successfully." });
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setUploading(false);
    }
  };

  const details = [
    ["Name", profile.userName], ["Company", profile.companyName],
    ["Designation", profile.designation], ["Location", profile.location],
    ["Mobile", profile.mobileNumber], ["Email", profile.email],
    ["LinkedIn", profile.linkedin],
  ];

  return (
    <BusinessCardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 border-b border-slate-200 pb-4 sm:mb-5">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Personal details</h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">Manage your profile and supporting documents in one place.</p>
        </header>

        {notice && (
          <div className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-800"}`} role="status">
            {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
            <span className="flex-1">{notice.text}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message"><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:mb-5 sm:w-fit sm:min-w-[320px]">
          {(["profile", "documents"] as Section[]).map((item) => (
            <button key={item} type="button" onClick={() => changeSection(item)} className={`flex h-9 items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition sm:text-sm ${section === item ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              {item === "profile" ? <UserRound className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              {item === "profile" ? "Profile" : "Upload Profile Card"}
            </button>
          ))}
        </div>

        {section === "profile" ? (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xl font-bold text-white shadow-sm">{getInitials(profile.userName)}</div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-slate-900">{profile.userName || "Your profile"}</h2>
                <p className="mt-0.5 truncate text-sm text-slate-500">{profile.designation || "Designation not set"}{profile.companyName ? ` · ${profile.companyName}` : ""}</p>
              </div>
              <button type="button" onClick={loadProfile} disabled={loading || editing} className={secondaryButtonClass}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-sm text-slate-500"><Loader2 className="mb-3 h-6 w-6 animate-spin text-cyan-600" />Loading your profile...</div>
            ) : editing ? (
              <form onSubmit={handleSave} className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {([
                    ["userName", "Name", "Full name", "text"], ["companyName", "Company", "Company name", "text"],
                    ["designation", "Designation", "Your designation", "text"], ["location", "Location", "City, country", "text"],
                    ["mobileNumber", "Mobile", "Mobile number", "tel"], ["email", "Email", "Email address", "email"],
                    ["linkedin", "LinkedIn", "LinkedIn profile URL", "url"],
                  ] as [keyof UpdatePersonalDetailsRequest, string, string, string][]).map(([key, label, placeholder, type]) => (
                    <label key={key} className={key === "linkedin" ? "sm:col-span-2" : ""}>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}{key === "userName" && <span className="text-red-500"> *</span>}</span>
                      <input
                        type={key === "email" ? "text" : type}
                        inputMode={key === "email" ? "email" : key === "mobileNumber" ? "tel" : undefined}
                        value={(draft[key] as string) || ""}
                        onChange={(event) => updateField(key, event.target.value)}
                        placeholder={placeholder}
                        className={`${inputClass} ${fieldErrors[key] ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                        required={key === "userName"}
                        aria-invalid={Boolean(fieldErrors[key])}
                        aria-describedby={fieldErrors[key] ? `${String(key)}-error` : undefined}
                      />
                      {fieldErrors[key] && <p id={`${String(key)}-error`} className="mt-1.5 text-xs text-red-600">{fieldErrors[key]}</p>}
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setDraft(profile); setFieldErrors({}); setEditing(false); }} disabled={saving} className={secondaryButtonClass}>Cancel</button>
                  <button type="submit" disabled={saving || !loggedInUserId} className={primaryButtonClass}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save changes</button>
                </div>
              </form>
            ) : (
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {details.map(([label, value], index) => (
                    <div key={label} className={index === details.length - 1 ? "sm:col-span-2" : ""}>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-800">{displayValue(value)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => { setDraft(profile); setFieldErrors({}); setEditing(true); }} disabled={!loggedInUserId} className={`${primaryButtonClass} w-full sm:w-auto`}><Pencil className="h-4 w-4" />Update profile</button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <form onSubmit={handleUpload} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">Upload personal document</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">Upload one business-card image or PDF. You can replace it with another file before submitting.</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />
            <div
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files?.[0]); }}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition sm:p-10 ${dragging ? "border-cyan-500 bg-cyan-50" : "border-slate-300 bg-slate-50/60 hover:border-cyan-400 hover:bg-cyan-50/40"}`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><UploadCloud className="h-6 w-6" /></div>
              <p className="mt-3 break-all text-sm font-semibold text-slate-700">{documentFile?.name || "Drag and drop your file here"}</p>
              <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP, or PDF</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className={`${secondaryButtonClass} mt-4`}>{documentFile ? "Choose another file" : "Browse files"}</button>
            </div>
            {lastUpload?.documentPath && <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" />Uploaded successfully{lastUpload.documentName ? `: ${lastUpload.documentName}` : ""}</div>}
            <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
              <button type="submit" disabled={!loggedInUserId || !documentFile || uploading} className={`${primaryButtonClass} w-full sm:min-w-[180px] sm:w-auto`}>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Uploading..." : "Upload document"}</button>
            </div>
          </form>
        )}
      </div>
    </BusinessCardLayout>
  );
};

export default PersonalDetailsPage;
