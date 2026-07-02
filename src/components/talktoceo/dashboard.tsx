import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Bookmark,
  Loader2,
  RotateCcw,
  Search,
  X,
  ExternalLink,
  Link as LinkIcon,
  Download,
  Globe,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import BASE_URL from "../../Config";

const PAPERCLIP_ALL_API = `${BASE_URL}/ai-automation/paperclip/all`;
const PAPERCLIP_UPDATE_API = (paperclipId: string) =>
  `${BASE_URL}/ai-automation/paperclip/${paperclipId}`;
const ITEMS_PER_PAGE = 3;
const FEEDBACK_SAVE_DEBOUNCE_MS = 800;

const TABLE_HEAD_CELL =
  "sticky top-0 z-20 border border-indigo-200 bg-gradient-to-r from-indigo-500 to-violet-600 px-2 py-2.5 text-[12px] font-black uppercase tracking-wider text-white sm:px-3 sm:py-3 sm:text-[13px] sm:tracking-widest";

const TABLE_BODY_CELL = "border border-indigo-100 px-2 py-2.5 align-top bg-white/60 sm:px-3 sm:py-3";

const SERIAL_HEAD_CELL =
  "sticky top-0 z-20 whitespace-nowrap border border-indigo-200 bg-gradient-to-r from-indigo-500 to-violet-600 px-0 py-2.5 text-center text-[10px] font-black leading-none text-white sm:py-3";

const SERIAL_BODY_CELL =
  "whitespace-nowrap border border-indigo-100 px-0 py-2.5 text-center align-top sm:py-3";

const PLAIN_NAME = "break-words text-xs font-bold text-black sm:text-sm";

type Person = {
  name?: string | null;
  designation?: string | null;
  company?: string | null;
  linkedin?: string | null;
  linkedinId?: string | null;
  linkedIn?: string | null;
  linkedinUrl?: string | null;
};

type Company = {
  name?: string | null;
  website?: string | null;
  linkedin?: string | null;
  linkedinId?: string | null;
  linkedIn?: string | null;
  linkedinUrl?: string | null;
};

type Report = {
  title?: string | null;
  source?: string | null;
  downloadUrl?: string | null;
};

type PaperclipData = {
  id?: number | null;
  createdAt?: string | null;
  paperclipId?: string | null;
  extractedText?: string | null;
  analysisJson?: string | null;
  imageUrl?: string | null;
  s3FileUrl?: string | null;
  blogFormat?: string | null;
  fileName?: string | null;
  uploadedAt?: string | null;
  addedToClone?: boolean | null;
  addedToBlog?: boolean | null;
  postedToSocial?: boolean | null;
  blogPublished?: boolean | null;
  feedback?: string | null;
  addedBy?: string | null;
  analysis?: {
    people?: Person[] | null;
    companies?: Company[] | null;
    reports?: Report[] | null;
  } | null;
};

const toast = (icon: "success" | "error" | "warning" | "info", title: string) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2400,
    background: "#f0fdf4",
    color: "#166534",
    customClass: { container: "!top-[60px]" },
  });

const safeText = (value?: string | null) => String(value || "").trim();

const isRealValue = (value?: string | null) => {
  const text = safeText(value).toLowerCase();
  return text !== "" && text !== "na" && text !== "n/a" && text !== "null" && text !== "undefined";
};

const isValidUrl = (value?: string | null) => {
  const text = safeText(value);
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") return false;
  return /^https?:\/\//i.test(text);
};

const getLinkedInUrl = (value?: string | null) => {
  const text = safeText(value);
  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") return "";
  if (/^https?:\/\//i.test(text)) return text;
  if (text.includes("linkedin.com")) return `https://${text.replace(/^\/+/, "")}`;
  return `https://www.linkedin.com/in/${text.replace(/^@/, "")}`;
};

const getAnyLinkedIn = (item: Person | Company) =>
  getLinkedInUrl(item.linkedin || item.linkedIn || item.linkedinUrl || item.linkedinId || "");

const getDisplayName = (item: PaperclipData) => {
  const fnames = safeText(item.fileName).split(",").map((f) => f.trim()).filter(Boolean);
  if (fnames.length > 1) return `${fnames[0]} +${fnames.length - 1}`;
  return fnames[0] || "Untitled";
};

function StatCard({
  label,
  value,
  icon,
  accent,
  bg,
  border,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3.5 shadow-sm`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: accent }}
          >
            {icon}
          </div>
          <p className="truncate text-xs font-bold uppercase tracking-wide text-gray-600">{label}</p>
        </div>
        <span className="text-2xl font-black shrink-0" style={{ color: accent }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function PaperclipTableRow({
  serial,
  item,
  feedback,
  onFeedbackChange,
  savingState,
  addedBy,
  onAddedByChange,
  savingAddedByState,
}: {
  serial: number;
  item: PaperclipData;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  savingState?: "saving" | "saved" | "error";
  addedBy: string;
  onAddedByChange: (value: string) => void;
  savingAddedByState?: "saving" | "saved" | "error";
}) {
  const id = safeText(item.paperclipId);
  const people = item.analysis?.people || [];
  const companies = item.analysis?.companies || [];
  const reports = item.analysis?.reports || [];

  return (
    <tr className="bg-white transition hover:bg-indigo-50/40 [&>td]:min-h-[120px] sm:[&>td]:min-h-[140px] md:[&>td]:min-h-[160px]">
      <td className={SERIAL_BODY_CELL}>
        <span className="text-xs font-black text-indigo-700">{serial}</span>
      </td>
      <td className={TABLE_BODY_CELL}>
        <p className="break-words text-sm font-black text-gray-900 sm:text-base">{getDisplayName(item)}</p>
        {item.uploadedAt && (
          <p className="mt-0.5 text-xs text-gray-500">
            {new Date(item.uploadedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </td>
      <td className={TABLE_BODY_CELL}>
        {people.length === 0 ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <div className="flex flex-col gap-1.5">
            {people.map((person, i) => {
              const name = safeText(person.name) || `Person ${i + 1}`;
              const linkedIn = getAnyLinkedIn(person);
              return (
                <div
                  key={`${id}-p-${i}`}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-cyan-200 bg-cyan-50/60 px-2 py-1.5"
                >
                  <span className={PLAIN_NAME}>{name}</span>
                  {linkedIn && (
                    <LinkChip href={linkedIn} label="LinkedIn" variant="linkedin" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </td>
      <td className={TABLE_BODY_CELL}>
        {companies.length === 0 ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <div className="flex flex-col gap-1.5">
            {companies.map((company, i) => {
              const name = safeText(company.name) || `Company ${i + 1}`;
              const web = safeText(company.website);
              const linkedIn = getAnyLinkedIn(company);
              return (
                <div
                  key={`${id}-c-${i}`}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-lime-300 bg-lime-50/60 px-2 py-1.5"
                >
                  <span className={PLAIN_NAME}>{name}</span>
                  {isValidUrl(web) && <LinkChip href={web} label="Website" variant="website" />}
                  {linkedIn && <LinkChip href={linkedIn} label="LinkedIn" variant="linkedin" />}
                </div>
              );
            })}
          </div>
        )}
      </td>
      <td className={TABLE_BODY_CELL}>
        {reports.length === 0 ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((report, i) => {
              const title = safeText(report.title) || `Report ${i + 1}`;
              const url = safeText(report.downloadUrl);
              return (
                <div key={`${id}-r-${i}`} className="flex flex-col gap-1">
                  <span className={PLAIN_NAME}>{title}</span>
                  {isValidUrl(url) && (
                    <LinkChip href={url} label="Download" variant="report" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </td>
      <td className={TABLE_BODY_CELL}>
        <div className="relative h-full">
          <textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Add feedback..."
            rows={3}
            className="box-border h-full min-h-[72px] w-full max-w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm leading-relaxed text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:min-h-[88px]"
          />
          {savingState && (
            <span
              className={`pointer-events-none absolute bottom-1.5 right-2 text-[10px] font-bold ${
                savingState === "saving"
                  ? "text-amber-500"
                  : savingState === "saved"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {savingState === "saving" ? "Saving…" : savingState === "saved" ? "Saved" : "Failed"}
            </span>
          )}
        </div>
      </td>
      <td className={TABLE_BODY_CELL}>
        <div className="relative h-full">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <UserCircle2 size={14} className="shrink-0 text-violet-500" />
            <input
              value={addedBy}
              onChange={(e) => onAddedByChange(e.target.value)}
              placeholder="Add name..."
              className="w-full min-w-0 bg-transparent text-xs font-bold text-gray-800 outline-none sm:text-sm"
            />
          </div>
          {savingAddedByState && (
            <span
              className={`pointer-events-none absolute -bottom-4 right-0 text-[10px] font-bold ${
                savingAddedByState === "saving"
                  ? "text-amber-500"
                  : savingAddedByState === "saved"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {savingAddedByState === "saving" ? "Saving…" : savingAddedByState === "saved" ? "Saved" : "Failed"}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="shrink-0 flex flex-wrap items-center justify-center gap-2 border-t border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || totalPages <= 1}
        className="flex h-8 items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 text-[11px] font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-[11px] font-black text-indigo-700 shadow-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages <= 1}
        className="flex h-8 items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 text-[11px] font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:opacity-40"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

function LinkChip({
  href,
  label,
  variant = "linkedin",
}: {
  href: string;
  label: string;
  variant?: "linkedin" | "website" | "report";
}) {
  const styles = {
    linkedin: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
    website: "border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
    report: "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100",
  };
  const icons = {
    linkedin: <LinkIcon size={10} />,
    website: <Globe size={10} />,
    report: <Download size={10} />,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      className={`inline-flex w-fit max-w-full items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-bold transition ${styles[variant]}`}
    >
      {icons[variant]}
      <span className="truncate">{label}</span>
      <ExternalLink size={9} className="shrink-0 opacity-70" />
    </a>
  );
}

export default function PaperclipDashboard() {
  const [paperclips, setPaperclips] = useState<PaperclipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [addedByMap, setAddedByMap] = useState<Record<string, string>>({});
  const [savingMap, setSavingMap] = useState<Record<string, "saving" | "saved" | "error">>({});
  const [savingAddedByMap, setSavingAddedByMap] = useState<Record<string, "saving" | "saved" | "error">>({});

  const fetchJson = async (url: string, options: RequestInit = {}) => {
    const token = sessionStorage.getItem("accessToken") || "";
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(text || "Invalid server response");
    }
    if (!res.ok || data?.success === false)
      throw new Error(data?.message || `API failed: ${res.status}`);
    return data;
  };

  const loadPaperclips = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await fetchJson(PAPERCLIP_ALL_API);
      const list: PaperclipData[] = Array.isArray(data?.data) ? data.data : [];
      setPaperclips(list);
      const initialFeedback: Record<string, string> = {};
      const initialAddedBy: Record<string, string> = {};
      list.forEach((item) => {
        const id = safeText(item.paperclipId);
        if (id) {
          initialFeedback[id] = safeText(item.feedback);
          initialAddedBy[id] = safeText(item.addedBy);
        }
      });
      setFeedbackMap(initialFeedback);
      setAddedByMap(initialAddedBy);
      if (isRefresh) toast("success", "Dashboard refreshed");
    } catch (error: any) {
      toast("error", error?.message || "Failed to load paper clips");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPaperclips();
  }, []);

  // Debounce timers per paperclipId, kept outside React state to avoid re-renders.
  const debounceTimers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const addedByDebounceTimers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const saveField = async (
    paperclipId: string,
    field: "feedback" | "addedBy",
    value: string,
    original: PaperclipData
  ) => {
    const setSaving = field === "feedback" ? setSavingMap : setSavingAddedByMap;
    setSaving((prev) => ({ ...prev, [paperclipId]: "saving" }));
    try {
      const payload = {
        id: original.id ?? 0,
        createdAt: original.createdAt ?? undefined,
        paperclipId,
        extractedText: original.extractedText ?? undefined,
        analysisJson: original.analysisJson ?? undefined,
        imageUrl: original.imageUrl ?? undefined,
        s3FileUrl: original.s3FileUrl ?? undefined,
        blogFormat: original.blogFormat ?? undefined,
        fileName: original.fileName ?? undefined,
        addedToClone: original.addedToClone ?? undefined,
        addedToBlog: original.addedToBlog ?? undefined,
        postedToSocial: original.postedToSocial ?? undefined,
        blogPublished: original.blogPublished ?? undefined,
        feedback: field === "feedback" ? value : original.feedback ?? undefined,
        addedBy: field === "addedBy" ? value : original.addedBy ?? undefined,
      };
      await fetchJson(PAPERCLIP_UPDATE_API(paperclipId), {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSaving((prev) => ({ ...prev, [paperclipId]: "saved" }));
      setPaperclips((prev) =>
        prev.map((p) => (safeText(p.paperclipId) === paperclipId ? { ...p, [field]: value } : p))
      );
      setTimeout(() => {
        setSaving((prev) => {
          const next = { ...prev };
          if (next[paperclipId] === "saved") delete next[paperclipId];
          return next;
        });
      }, 1800);
    } catch (error: any) {
      setSaving((prev) => ({ ...prev, [paperclipId]: "error" }));
      toast("error", error?.message || `Failed to save ${field === "feedback" ? "feedback" : "added by"}`);
    }
  };

  const handleFeedbackChange = (paperclipId: string, value: string, original: PaperclipData) => {
    setFeedbackMap((prev) => ({ ...prev, [paperclipId]: value }));

    if (debounceTimers.current[paperclipId]) {
      clearTimeout(debounceTimers.current[paperclipId]);
    }
    debounceTimers.current[paperclipId] = setTimeout(() => {
      saveField(paperclipId, "feedback", value, original);
    }, FEEDBACK_SAVE_DEBOUNCE_MS);
  };

  const handleAddedByChange = (paperclipId: string, value: string, original: PaperclipData) => {
    setAddedByMap((prev) => ({ ...prev, [paperclipId]: value }));

    if (addedByDebounceTimers.current[paperclipId]) {
      clearTimeout(addedByDebounceTimers.current[paperclipId]);
    }
    addedByDebounceTimers.current[paperclipId] = setTimeout(() => {
      saveField(paperclipId, "addedBy", value, original);
    }, FEEDBACK_SAVE_DEBOUNCE_MS);
  };

  const totals = useMemo(() => {
    let people = 0;
    let companies = 0;
    let websites = 0;
    let reports = 0;
    paperclips.forEach((item) => {
      people += (item.analysis?.people || []).filter((p) => !!getAnyLinkedIn(p)).length;
      companies += (item.analysis?.companies || []).filter((c) => !!getAnyLinkedIn(c)).length;
      websites += (item.analysis?.companies || []).filter((c) => isValidUrl(c.website)).length;
      reports += (item.analysis?.reports || []).filter((r) => isValidUrl(r.downloadUrl)).length;
    });
    return {
      people,
      companies,
      websites,
      reports,
    };
  }, [paperclips]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const matches = (item: PaperclipData) => {
      const searchable = [
        item.fileName,
        item.paperclipId,
        addedByMap[safeText(item.paperclipId)] || item.addedBy,
        ...(item.analysis?.people || []).map(
          (p) => `${p.name} ${p.company} ${getAnyLinkedIn(p)}`
        ),
        ...(item.analysis?.companies || []).map(
          (c) => `${c.name} ${c.website} ${getAnyLinkedIn(c)}`
        ),
        ...(item.analysis?.reports || []).map((r) => `${r.title} ${r.source}`),
        feedbackMap[safeText(item.paperclipId)] || "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    };

    const sorted = [...paperclips].sort((a, b) => {
      const dateA = new Date(a.uploadedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.uploadedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return q ? sorted.filter(matches) : sorted;
  }, [paperclips, searchTerm, feedbackMap, addedByMap]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div
      className="flex flex-col overflow-hidden bg-gray-50 text-gray-900"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(94,221,242,0.09),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(167,139,250,0.08),transparent_35%)]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex flex-col gap-3 px-3 pt-3 pb-2 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pt-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="shrink-0 text-violet-600 sm:size-[22px]" />
              <p className="text-lg font-black bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent sm:text-xl">
                 Dashboard
              </p>
            </div>
            <p className="text-xs font-medium text-slate-700 sm:text-sm">
              All LinkedIn URLs, company links, and reports across every paper clip — in one view.
            </p>
          </div>
          <button
            onClick={() => loadPaperclips(true)}
            disabled={refreshing || loading}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 self-start rounded-xl border border-cyan-300 bg-white px-3 text-[11px] font-bold text-cyan-700 transition hover:bg-cyan-50 disabled:opacity-50 sm:h-8"
          >
            {refreshing ? <Loader2 className="animate-spin" size={12} /> : <RotateCcw size={12} />}
            Refresh
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 pb-2 sm:px-6 sm:pb-2">
          {/* Stat cards */}
          <div className="mb-3 grid w-full grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-4 sm:gap-3 lg:max-w-6xl">
            <StatCard
              label="LinkedIn People"
              value={totals.people}
              icon={<Users size={16} />}
              accent="#0891b2"
              bg="bg-cyan-50"
              border="border-cyan-200"
            />
            <StatCard
              label=" LinkedIn Companies"
              value={totals.companies}
              icon={<Building2 size={16} />}
              accent="#65a30d"
              bg="bg-lime-50"
              border="border-lime-200"
            />
            <StatCard
              label="Website Companies"
              value={totals.websites}
              icon={<Globe size={16} />}
              accent="#ea580c"
              bg="bg-orange-50"
              border="border-orange-200"
            />
            <StatCard
              label="Reports"
              value={totals.reports}
              icon={<Bookmark size={16} />}
              accent="#0284c7"
              bg="bg-sky-50"
              border="border-sky-200"
            />
          </div>

          {/* Search */}
          <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-4" size={15} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clips, people, companies..."
                className="h-10 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-10 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 sm:h-11 sm:pl-11"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <span className="shrink-0 self-start rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-black text-violet-700 sm:self-auto">
              {filteredRows.length} Clip{filteredRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Paginated table — fills remaining height */}
          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 sm:py-20">
              <Loader2 className="mb-3 animate-spin text-violet-600" size={32} />
              <p className="text-sm font-bold text-gray-600">Loading all paper clips...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-12 text-center sm:py-16">
              <FileText size={32} className="mb-3 text-gray-400" />
              <p className="text-sm font-bold text-gray-700">No paper clips found</p>
              <p className="mt-1 text-xs text-gray-500">
                {searchTerm ? "Try a different search term." : "Upload and analyze clips from Paper Clipping AI."}
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-lg">
                <p className="shrink-0 border-b border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-medium text-indigo-600 md:hidden">
                  Swipe horizontally to view all columns
                </p>
                <div className="min-h-0 flex-1 overflow-auto overscroll-x-contain">
                  <table className="min-h-full w-full min-w-[860px] table-fixed border-collapse border border-indigo-200 text-left md:min-w-[1040px]">
                    <colgroup>
                      <col style={{ width: "20px", maxWidth: "20px" }} />
                      <col className="w-[14%]" />
                      <col className="w-[15%]" />
                      <col className="w-[21%]" />
                      <col className="w-[14%]" />
                      <col className="w-[16%]" />
                      <col className="w-[12%]" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className={`${SERIAL_HEAD_CELL} text-white`}>S.NO</th>
                        <th className={`${TABLE_HEAD_CELL}`}>Paper Clip</th>
                        <th className={`${TABLE_HEAD_CELL}`}>
                          <span className="hidden sm:inline"> </span>People
                        </th>
                        <th className={`${TABLE_HEAD_CELL}`}>
                          <span className="hidden sm:inline"> </span>Companies
                        </th>
                        <th className={`${TABLE_HEAD_CELL}`}>Reports</th>
                        <th className={`${TABLE_HEAD_CELL}`}>Feedback</th>
                        <th className={`${TABLE_HEAD_CELL}`}>Added By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((item, index) => {
                        const id = safeText(item.paperclipId) || `row-${index}`;
                        const serial = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                        return (
                          <PaperclipTableRow
                            key={id}
                            serial={serial}
                            item={item}
                            feedback={feedbackMap[id] ?? safeText(item.feedback)}
                            onFeedbackChange={(value) => handleFeedbackChange(id, value, item)}
                            savingState={savingMap[id]}
                            addedBy={addedByMap[id] ?? safeText(item.addedBy)}
                            onAddedByChange={(value) => handleAddedByChange(id, value, item)}
                            savingAddedByState={savingAddedByMap[id]}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}