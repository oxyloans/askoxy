import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Inbox,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  CEO_EVENT_TYPE_OPTIONS,
  UserEventDetailsResponse,
  UserEventDetailsSaveRequest,
  fetchUserEventDetailsByUserId,
  formatEventTypeLabel,
  getLoggedInUserId,
  saveUserEventDetails,
} from "./ceoBusinessCardApi";

type Notice = { type: "success" | "warning" | "error"; text: string } | null;
type FieldErrors = Partial<
  Record<"eventType" | "eventName" | "emailSubjectName" | "content", string>
>;

const emptyEventForm = (): UserEventDetailsSaveRequest => ({
  content: "",
  emailSubjectName: "",
  eventName: "",
  eventType: "",
  active: true,
});

const recordToForm = (
  record: UserEventDetailsResponse,
): UserEventDetailsSaveRequest => ({
  id: record.id,
  content: record.content || "",
  emailSubjectName: record.emailSubjectName || "",
  eventName: record.eventName || "",
  eventType: record.eventType || "",
  active: record.active !== false,
});

const extractApiMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as unknown;
    if (typeof data === "string" && data.trim()) return data.trim();
    if (data && typeof data === "object") {
      const body = data as Record<string, unknown>;
      for (const key of [
        "message",
        "errorMessage",
        "error",
        "details",
        "responseMessage",
      ]) {
        const value = body[key];
        if (typeof value === "string" && value.trim()) return value.trim();
        if (Array.isArray(value) && value.length)
          return value.map(String).join(", ");
      }
    }
    return error.response?.statusText || error.message;
  }
  return error instanceof Error ? error.message : String(error);
};

const displayValue = (value?: string | null) => value?.trim() || "Not provided";
const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10";

const FieldBlock: React.FC<{
  label: string;
  value: string;
  fullWidth?: boolean;
}> = ({ label, value, fullWidth }) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium leading-relaxed text-slate-800">
      {value}
    </p>
  </div>
);

const UserEventDetailsListPage: React.FC = () => {
  const loggedInUserId = getLoggedInUserId();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<UserEventDetailsResponse[]>([]);
  const [editing, setEditing] = useState(false);
  const [eventForm, setEventForm] =
    useState<UserEventDetailsSaveRequest>(emptyEventForm());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadEvents = useCallback(async () => {
    if (!loggedInUserId) {
      setNotice({
        type: "warning",
        text: "Please sign in again to load events.",
      });
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserEventDetailsByUserId(loggedInUserId);
      setEvents(Array.isArray(data) ? data : []);
      setEditing(false);
      setEventForm(emptyEventForm());
      setFieldErrors({});
    } catch (error) {
      console.error(error);
      setEvents([]);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const updateField = (
    key: keyof UserEventDetailsSaveRequest,
    value: string | boolean,
  ) => {
    setEventForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const openEdit = (record: UserEventDetailsResponse) => {
    if (!record.id) {
      setNotice({
        type: "warning",
        text: "This event cannot be updated because its ID is missing.",
      });
      return;
    }
    setEventForm(recordToForm(record));
    setFieldErrors({});
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const name = eventForm.eventName?.trim() || "";
    if (!eventForm.eventType?.trim())
      errors.eventType = "Event type is required.";
    if (!name) errors.eventName = "Event name is required.";
    else if (name.length < 3)
      errors.eventName = "Event name must contain at least 3 characters.";
    else if (name.length > 120)
      errors.eventName = "Event name cannot exceed 120 characters.";
    if ((eventForm.emailSubjectName?.trim().length || 0) > 150)
      errors.emailSubjectName = "Email subject cannot exceed 150 characters.";
    if ((eventForm.content?.trim().length || 0) > 2000)
      errors.content = "Content cannot exceed 2,000 characters.";
    return errors;
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loggedInUserId || !eventForm.id?.trim()) {
      setNotice({
        type: "warning",
        text: loggedInUserId
          ? "Event ID is required for this update."
          : "Please sign in again to update events.",
      });
      return;
    }
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setNotice({
        type: "warning",
        text: "Please correct the highlighted fields.",
      });
      return;
    }

    setSaving(true);
    const payload: UserEventDetailsSaveRequest = {
      id: eventForm.id.trim(),
      content: eventForm.content || "",
      emailSubjectName: eventForm.emailSubjectName || "",
      eventName: eventForm.eventName || "",
      eventType: eventForm.eventType || "",
      active: eventForm.active !== false,
    };
    try {
      const saved = await saveUserEventDetails(payload);
      setEvents((current) =>
        current.map((item) =>
          item.id === payload.id
            ? {
                ...item,
                ...payload,
                id: saved.id || payload.id,
                userId: loggedInUserId,
              }
            : item,
        ),
      );
      setEditing(false);
      setEventForm(emptyEventForm());
      setFieldErrors({});
      setNotice({ type: "success", text: "Event updated successfully." });
      try {
        const refreshed = await fetchUserEventDetailsByUserId(loggedInUserId);
        setEvents(Array.isArray(refreshed) ? refreshed : []);
      } catch {
        // The locally updated event remains visible if the optional refresh fails.
      }
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: extractApiMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BusinessCardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Event List
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Review and update all event details associated with your account.
            </p>
          </div>
          <button
            type="button"
            onClick={loadEvents}
            disabled={!loggedInUserId || loading || editing}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        {notice && (
          <div
            className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : notice.type === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-red-200 bg-red-50 text-red-800"}`}
            role="status"
          >
            {notice.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span className="flex-1">{notice.text}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {editing && (
          <form
            onSubmit={handleUpdate}
            className="mb-5 overflow-hidden rounded-xl border border-cyan-200 bg-white shadow-sm"
          >
            <div className="border-b border-cyan-100 bg-cyan-50/70 px-4 py-3 sm:px-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-cyan-900">
                <Pencil className="h-4 w-4" />
                Update event
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Event type <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={eventForm.eventType || ""}
                    onChange={(event) =>
                      updateField("eventType", event.target.value)
                    }
                    className={`${inputClass} ${fieldErrors.eventType ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  >
                    <option value="">Select event type</option>
                    {CEO_EVENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.eventType && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.eventType}
                    </p>
                  )}
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Event name <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={eventForm.eventName || ""}
                    onChange={(event) =>
                      updateField("eventName", event.target.value)
                    }
                    placeholder="Event name"
                    className={`${inputClass} ${fieldErrors.eventName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  />
                  {fieldErrors.eventName && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.eventName}
                    </p>
                  )}
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email subject
                  </span>
                  <input
                    value={eventForm.emailSubjectName || ""}
                    onChange={(event) =>
                      updateField("emailSubjectName", event.target.value)
                    }
                    placeholder="Email subject"
                    className={`${inputClass} ${fieldErrors.emailSubjectName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  />
                  {fieldErrors.emailSubjectName && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {fieldErrors.emailSubjectName}
                    </p>
                  )}
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={eventForm.active === false ? "inactive" : "active"}
                    onChange={(event) =>
                      updateField("active", event.target.value === "active")
                    }
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Content
                  </span>
                  <textarea
                    rows={4}
                    value={eventForm.content || ""}
                    onChange={(event) =>
                      updateField("content", event.target.value)
                    }
                    placeholder="Event content"
                    className={`w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 ${fieldErrors.content ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                  />
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-red-600">
                      {fieldErrors.content}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {eventForm.content?.length || 0}/2000
                    </span>
                  </div>
                </label>
              </div>
              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEventForm(emptyEventForm());
                    setFieldErrors({});
                  }}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !loggedInUserId}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:bg-slate-300"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Updating..." : "Update event"}
                </button>
              </div>
            </div>
          </form>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All events
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {events.length
                  ? `${events.length} event${events.length === 1 ? "" : "s"}`
                  : "No events found"}
              </p>
            </div>
            {/* <CalendarDays className="h-5 w-5 text-cyan-600" /> */}
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-sm text-slate-500">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-cyan-600" />
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-700">
                  No events
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Create your first event from the Event Details page.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {events.map((item, index) => (
                  <article
                    key={item.id || `event-${index}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                          {displayValue(item.eventName)}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-200">
                            {formatEventTypeLabel(item.eventType || undefined)}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${item.active === true ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}
                          >
                            {item.active === true ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        disabled={editing || !item.id}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:bg-slate-300"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Update
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                      <FieldBlock
                        label="Event type"
                        value={formatEventTypeLabel(
                          item.eventType || undefined,
                        )}
                      />
                      <FieldBlock
                        label="Event name"
                        value={displayValue(item.eventName)}
                      />
                      <FieldBlock
                        label="Email subject"
                        value={displayValue(item.emailSubjectName)}
                      />
                      <FieldBlock
                        label="Status"
                        value={
                          item.active === true
                            ? "Active"
                            : item.active === false
                              ? "Inactive"
                              : "Not provided"
                        }
                      />
                      <FieldBlock
                        label="Content"
                        value={displayValue(item.content)}
                        fullWidth
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </BusinessCardLayout>
  );
};

export default UserEventDetailsListPage;
