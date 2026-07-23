import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Inbox,
  Loader2,
  RefreshCw,
  UsersRound,
  X,
} from "lucide-react";
import BusinessCardLayout from "./BusinessCardLayout";
import {
  BusinessUploadDataDto,
  BusinessUploadDataGroup,
  fetchCeoDataUploadDetails,
  formatEventTypeLabel,
  getLoggedInUserId,
  isBusinessEventType,
} from "./ceoBusinessCardApi";

const PAGE_SIZE = 10;

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

const formatMultiValue = (value?: string) =>
  value
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ") || "Not provided";

const pickDefaultEventType = (groups: BusinessUploadDataGroup[]) =>
  groups.find((group) => group.list?.length)?.eventType ||
  groups[0]?.eventType ||
  "";

const matchEventType = (first?: string, second?: string) =>
  (first || "").trim().toUpperCase() === (second || "").trim().toUpperCase();

const RecordImage: React.FC<{ src?: string; alt: string }> = ({ src, alt }) =>
  src ? (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </a>
  ) : (
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-300">
      <ImageOff className="h-5 w-5" />
    </span>
  );

const MobileField: React.FC<{
  label: string;
  value: React.ReactNode;
  full?: boolean;
}> = ({ label, value, full }) => (
  <div className={full ? "col-span-2" : ""}>
    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <div className="mt-1 break-words text-sm font-medium text-slate-800">
      {value}
    </div>
  </div>
);

const CeoUploadDetailsPage: React.FC = () => {
  const loggedInUserId = getLoggedInUserId();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [eventGroups, setEventGroups] = useState<BusinessUploadDataGroup[]>([]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const isBusinessEvent = isBusinessEventType(selectedEventType);
  const rows = useMemo(
    () =>
      eventGroups.find((group) =>
        matchEventType(group.eventType, selectedEventType),
      )?.list || [],
    [eventGroups, selectedEventType],
  );
  const totalRecords = useMemo(
    () =>
      eventGroups.reduce((sum, group) => sum + (group.list?.length || 0), 0),
    [eventGroups],
  );
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [rows, page],
  );

  useEffect(() => {
    setPage(1);
  }, [selectedEventType]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const loadUploadDetails = useCallback(async () => {
    if (!loggedInUserId) {
      setError("Please sign in again to view upload details.");
      return;
    }
    setLoading(true);
    setLoaded(true);
    setError("");
    try {
      const groups = await fetchCeoDataUploadDetails(loggedInUserId);
      const normalized = (Array.isArray(groups) ? groups : []).map((group) => ({
        eventType: group.eventType || "",
        list: Array.isArray(group.list) ? group.list : [],
      }));
      setEventGroups(normalized);
      setSelectedEventType(
        (current) =>
          normalized.find((group) => matchEventType(group.eventType, current))
            ?.eventType || pickDefaultEventType(normalized),
      );
    } catch (requestError) {
      console.error(requestError);
      setError(extractApiMessage(requestError));
      setEventGroups([]);
      setSelectedEventType("");
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    loadUploadDetails();
  }, [loadUploadDetails]);

  const getRowKey = (row: BusinessUploadDataDto, index: number) =>
    `${row.id || row.eventId || row.personName || "row"}-${row.image || row.businessCard || index}-${index}`;

  return (
    <BusinessCardLayout>
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              Upload Details
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
              Review processed business-card and event upload records by event
              type.
            </p>
          </div>
          <button
            type="button"
            onClick={loadUploadDetails}
            disabled={!loggedInUserId || loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        {error && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-5 sm:p-5">
          <label className="block w-full sm:max-w-md">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Event type
            </span>
            <select
              value={selectedEventType}
              onChange={(event) => setSelectedEventType(event.target.value)}
              disabled={loading || !eventGroups.length}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Select event type</option>
              {eventGroups.map((group) => (
                <option key={group.eventType} value={group.eventType}>
                  {formatEventTypeLabel(group.eventType)} ({group.list.length})
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Total records
              </p>
              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {totalRecords}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-600">
                Selected
              </p>
              <p className="mt-0.5 text-lg font-semibold text-cyan-800">
                {rows.length}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {isBusinessEvent ? "Business card records" : "Upload records"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {selectedEventType
                  ? formatEventTypeLabel(selectedEventType)
                  : "Select an event type"}
              </p>
            </div>
            {/* <UsersRound className="h-5 w-5 text-cyan-600" /> */}
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-sm text-slate-500">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-cyan-600" />
                Loading upload details...
              </div>
            ) : !loaded || !eventGroups.length || !rows.length ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-700">
                  {!loaded
                    ? "Upload details not loaded"
                    : !eventGroups.length
                      ? "No upload groups"
                      : "No records"}
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  {selectedEventType
                    ? `No uploads found for ${formatEventTypeLabel(selectedEventType)}.`
                    : "Upload records will appear here after processing."}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {pageRows.map((row, index) => (
                    <article
                      key={getRowKey(row, index)}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <RecordImage
                          src={row.image || row.originalImage}
                          alt="Profile"
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {row.personName || "Unnamed contact"}
                          </h3>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {row.companyName ||
                              formatEventTypeLabel(selectedEventType)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <MobileField
                          label="Email"
                          value={formatMultiValue(row.email)}
                          full
                        />
                        <MobileField
                          label="Mobile"
                          value={formatMultiValue(row.mobileNumber)}
                          full
                        />
                        {isBusinessEvent && (
                          <MobileField
                            label="Business card"
                            value={
                              <RecordImage
                                src={row.businessCard}
                                alt="Business card"
                              />
                            }
                            full
                          />
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "Name",
                          ...(isBusinessEvent ? ["Company"] : []),
                          "Email",
                          "Mobile",
                          "Photo",
                          ...(isBusinessEvent ? ["Business card"] : []),
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {pageRows.map((row, index) => (
                        <tr
                          key={getRowKey(row, index)}
                          className="transition hover:bg-cyan-50/30"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                            {row.personName || "Not provided"}
                          </td>
                          {isBusinessEvent && (
                            <td className="px-4 py-3 text-slate-600">
                              {row.companyName || "Not provided"}
                            </td>
                          )}
                          <td className="max-w-xs px-4 py-3 text-slate-600">
                            <span className="block truncate">
                              {formatMultiValue(row.email)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                            {formatMultiValue(row.mobileNumber)}
                          </td>
                          <td className="px-4 py-3">
                            <RecordImage
                              src={row.image || row.originalImage}
                              alt="Profile"
                            />
                          </td>
                          {isBusinessEvent && (
                            <td className="px-4 py-3">
                              <RecordImage
                                src={row.businessCard}
                                alt="Business card"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Showing {(page - 1) * PAGE_SIZE + 1}–
                      {Math.min(page * PAGE_SIZE, rows.length)} of {rows.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                        disabled={page === 1}
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <span className="min-w-16 text-center text-xs font-medium text-slate-600">
                        {page} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(totalPages, current + 1),
                          )
                        }
                        disabled={page === totalPages}
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </BusinessCardLayout>
  );
};

export default CeoUploadDetailsPage;
