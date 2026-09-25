import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { adminApi as api } from "../utils/axiosInstances";
import BASE_URL from "../Config";

type Notice = { type: "success" | "warning" | "error"; text: string } | null;
type FieldErrors = Partial<Record<"eventName" | "eventMailSubject", string>>;

interface EventDetail {
  id: string;
  eventName: string;
  eventMailSubject: string;
}

interface EventDetailForm {
  eventName: string;
  eventMailSubject: string;
  id?: string;
}

const emptyForm = (): EventDetailForm => ({
  eventName: "",
  eventMailSubject: "",
});

const recordToForm = (record: EventDetail): EventDetailForm => ({
  id: record.id,
  eventName: record.eventName || "",
  eventMailSubject: record.eventMailSubject || "",
});

const extractApiMessage = (error: unknown, fallback: string): string => {
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
        if (Array.isArray(value) && value.length) {
          return value.map(String).join(", ");
        }
      }
    }

    return error.response?.statusText || error.message || fallback;
  }

  return error instanceof Error ? error.message : String(error) || fallback;
};

const displayValue = (value?: string | null) => value?.trim() || "Not provided";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10";

const EventDetails: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [eventForm, setEventForm] = useState<EventDetailForm>(emptyForm());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const loadEvents = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get<EventDetail[]>(
        `${BASE_URL}/ai-service/agent/getAllEventDetails`,
      );

      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setEvents([]);
      setNotice({
        type: "error",
        text: extractApiMessage(error, "Unable to load event details."),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const updateField = (key: keyof EventDetailForm, value: string) => {
    setEventForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const openCreate = () => {
    setEditing(false);
    setEventForm(emptyForm());
    setFieldErrors({});
    setModalOpen(true);
  };

  const openEdit = (record: EventDetail) => {
    if (!record.id) {
      setNotice({
        type: "warning",
        text: "This event cannot be updated because its ID is missing.",
      });
      return;
    }

    setEditing(true);
    setEventForm(recordToForm(record));
    setFieldErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditing(false);
    setEventForm(emptyForm());
    setFieldErrors({});
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const name = eventForm.eventName.trim();
    const subject = eventForm.eventMailSubject.trim();

    if (!name) {
      errors.eventName = "Event name is required.";
    } else if (name.length < 3) {
      errors.eventName = "Event name must contain at least 3 characters.";
    } else if (name.length > 2000) {
      errors.eventName = "Event name cannot exceed 2,000 characters.";
    }

    if (!subject) {
      errors.eventMailSubject = "Event mail subject is required.";
    } else if (subject.length > 2000) {
      errors.eventMailSubject = "Event mail subject cannot exceed 2,000 characters.";
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editing && !eventForm.id?.trim()) {
      setNotice({
        type: "warning",
        text: "Event ID is required to update this event.",
      });
      return;
    }

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setSaving(true);

    const payload: EventDetailForm = {
      eventName: eventForm.eventName.trim(),
      eventMailSubject: eventForm.eventMailSubject.trim(),
      ...(editing && eventForm.id ? { id: eventForm.id.trim() } : {}),
    };

    try {
      const response = await api.patch<string>(
        `${BASE_URL}/ai-service/agent/eventDetailsUpdate`,
        payload,
      );

      const fallbackMessage = editing
        ? "Event details updated successfully."
        : "Event details created successfully.";

      const messageText =
        typeof response.data === "string" && response.data.trim()
          ? response.data.trim()
          : fallbackMessage;

      setNotice({ type: "success", text: messageText });
      setModalOpen(false);
      setEditing(false);
      setEventForm(emptyForm());
      setFieldErrors({});
      await loadEvents();
    } catch (error) {
      console.error(error);
      setNotice({
        type: "error",
        text: extractApiMessage(
          error,
          editing
            ? "Unable to update event details."
            : "Unable to create event details.",
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<ColumnsType<EventDetail>>(
    () => [
      {
        title: "S.No",
        key: "serialNumber",
        width: 80,
        align: "center",
        render: (_value, _record, index) =>
          (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: "Event Name",
        dataIndex: "eventName",
        key: "eventName",
        width: 300,
        render: (value: string) => (
          <div className="min-w-[220px] max-w-[420px] whitespace-normal break-words">
            <p className="font-semibold leading-5 text-slate-800">
              {displayValue(value)}
            </p>
          </div>
        ),
      },
      {
        title: "Event Mail Subject",
        dataIndex: "eventMailSubject",
        key: "eventMailSubject",
        width: 430,
        render: (value: string) => (
          <div className="min-w-[300px] max-w-[560px] whitespace-normal break-words text-sm leading-6 text-slate-600">
            {displayValue(value)}
          </div>
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 130,
        align: "center",
        render: (_value, record) => (
          <button
            type="button"
            onClick={() => openEdit(record)}
            disabled={!record.id}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <Pencil className="h-3.5 w-3.5" />
            Update
          </button>
        ),
      },
    ],
    [currentPage, pageSize],
  );

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header: title/subtitle left, actions right */}
      <header className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Event Details
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            Create, review and update event details used for event mail reminders.
          </p>
        </div>

        <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={loadEvents}
            disabled={loading || saving}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreate}
            disabled={saving}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300 sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </header>

      {/* API feedback */}
      {notice && (
        <div
          className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : notice.type === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}

          <span className="min-w-0 flex-1 break-words">{notice.text}</span>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
            className="shrink-0 rounded p-0.5 transition hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Event table */}
      <section className="overflow-hidden rounded-md  bg-white ">
       

        <div className="w-full p-3 sm:p-4">
          <Table<EventDetail>
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={events}
            bordered
            loading={{
              spinning: loading,
              indicator: <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />,
            }}
            scroll={{ x: true }}
            tableLayout="auto"
            pagination={{
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} events`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              responsive: true,
            }}
            locale={{
              emptyText: (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-4 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-700">
                    No event details found
                  </h3>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    Click Add Event to create your first event detail.
                  </p>
                  <button
                    type="button"
                    onClick={openCreate}
                    className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-3.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Event
                  </button>
                </div>
              ),
            }}
            className="event-details-table"
          />
        </div>
      </section>

      {/* Add / Update modal */}
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={680}
        closable={!saving}
        maskClosable={!saving}
        keyboard={!saving}
        destroyOnClose
        title={
          <div className="pr-8">
            <h2 className="text-base font-semibold text-slate-900">
              {editing ? "Update Event Details" : "Add Event Details"}
            </h2>
            <p className="mt-1 text-xs font-normal leading-5 text-slate-500">
              {editing
                ? "Review the information below and save your changes."
                : "Enter the event information below to create a new event."}
            </p>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="pt-2">
          <div className="max-h-[68vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Event Name <span className="text-red-500">*</span>
                </span>
                <input
                  autoFocus
                  value={eventForm.eventName}
                  onChange={(event) =>
                    updateField("eventName", event.target.value)
                  }
                  placeholder="Enter event name, e.g. Annual Team Meeting"
                  maxLength={2000}
                  className={`${inputClass} ${
                    fieldErrors.eventName
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }`}
                />
                <div className="mt-1.5 flex items-start justify-between gap-3">
                  {fieldErrors.eventName ? (
                    <p className="text-xs text-red-600">
                      {fieldErrors.eventName}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Enter a clear name that identifies the event.
                    </p>
                  )}
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {eventForm.eventName.length}/2000
                  </span>
                </div>
              </label>

              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Event Mail Subject <span className="text-red-500">*</span>
                </span>
                <input
                  value={eventForm.eventMailSubject}
                  onChange={(event) =>
                    updateField("eventMailSubject", event.target.value)
                  }
                  placeholder="Enter the email subject used for this event"
                  maxLength={2000}
                  className={`${inputClass} ${
                    fieldErrors.eventMailSubject
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }`}
                />
                <div className="mt-1.5 flex items-start justify-between gap-3">
                  {fieldErrors.eventMailSubject ? (
                    <p className="text-xs text-red-600">
                      {fieldErrors.eventMailSubject}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      This subject will be used when event reminder emails are sent.
                    </p>
                  )}
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {eventForm.eventMailSubject.length}/2000
                  </span>
                </div>
              </label>

              {/* {editing && eventForm.id && (
                <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Event ID
                  </p>
                  <p className="mt-1 break-all text-xs font-medium text-slate-600">
                    {eventForm.id}
                  </p>
                </div>
              )} */}
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {saving
                ? editing
                  ? "Updating..."
                  : "Saving..."
                : editing
                  ? "Update Event"
                  : "Save Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventDetails;
