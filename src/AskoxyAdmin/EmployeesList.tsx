import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCopy,
  FaDownload,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaIdBadge,
  FaPaperPlane,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaTimesCircle,
  FaUser,
  FaUserCheck,
  FaUsers,
  FaUserTimes,
} from "react-icons/fa";
import BASE_URL from "../Config";

type EmployeeStatus = "APPROVED" | "CREATED" | "REJECTED";
type StatusFilter = "ALL" | EmployeeStatus;

interface Company {
  id: string;
  companyName: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  company: Company | null;
  role: string;
  status: EmployeeStatus;
  statusChangedBy: string | null;
  createdAt: number;
  updatedAt: number;
}

interface EmployeesResponse {
  data?: Employee[];
  message?: string;
  status?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface StatusUpdateTarget {
  employee: Employee;
  nextStatus: Exclude<EmployeeStatus, "CREATED">;
}

interface ToastMessage {
  type: "success" | "error";
  text: string;
}

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.response?.data?.error || fallback;
  }

  if (error instanceof Error) return error.message;
  return fallback;
};

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return "—";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "E";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const escapeCsvValue = (value: string | number | null | undefined): string => {
  const normalized = String(value ?? "").replace(/"/g, '""');
  return `"${normalized}"`;
};

const statusStyles: Record<EmployeeStatus, string> = {
  APPROVED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 ring-emerald-100",
  CREATED: "border-amber-200 bg-amber-50 text-amber-700 ring-amber-100",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700 ring-rose-100",
};

const statusIcon: Record<EmployeeStatus, React.ReactNode> = {
  APPROVED: <FaCheckCircle className="h-2.5 w-2.5" />,
  CREATED: <FaClock className="h-2.5 w-2.5" />,
  REJECTED: <FaTimesCircle className="h-2.5 w-2.5" />,
};

const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[9px] font-bold tracking-wide ring-1 ${statusStyles[status]}`}
  >
    {statusIcon[status]}
    {status === "CREATED" ? "PENDING" : status}
  </span>
);

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState<StatusUpdateTarget | null>(
    null
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [updatingEmployeeId, setUpdatingEmployeeId] = useState<string | null>(
    null
  );
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchEmployees = useCallback(async (initialLoad = false) => {
    if (initialLoad) setLoading(true);
    else setRefreshing(true);

    setError("");

    try {
      const response = await axios.get<EmployeesResponse>(
        `${BASE_URL}/marketing-service/campgin/all-employees-contacts`
      );

      const employeeData = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setEmployees(employeeData);
    } catch (fetchError: unknown) {
      setError(
        getErrorMessage(
          fetchError,
          "Unable to load the employees list. Please try again."
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees(true);
  }, [fetchEmployees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, companyFilter]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copiedEmail) return undefined;

    const timer = window.setTimeout(() => setCopiedEmail(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedEmail]);

  useEffect(() => {
    if (!statusTarget && !selectedEmployee) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || updatingEmployeeId) return;
      setStatusTarget(null);
      setSelectedEmployee(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedEmployee, statusTarget, updatingEmployeeId]);

  const companies = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map((employee) => employee.company?.companyName?.trim())
          .filter((companyName): companyName is string => Boolean(companyName))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const searchableText = [
        employee.name,
        employee.email,
        employee.role,
        employee.company?.companyName || "",
        employee.statusChangedBy || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesStatus =
        statusFilter === "ALL" || employee.status === statusFilter;
      const matchesCompany =
        companyFilter === "ALL" ||
        employee.company?.companyName === companyFilter;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [employees, searchTerm, statusFilter, companyFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / PAGE_SIZE)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEmployees, currentPage]);

  const counts = useMemo(
    () => ({
      total: employees.length,
      approved: employees.filter((item) => item.status === "APPROVED").length,
      created: employees.filter((item) => item.status === "CREATED").length,
      rejected: employees.filter((item) => item.status === "REJECTED").length,
    }),
    [employees]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCompanyFilter("ALL");
  };

  const copyEmailAddress = async (email: string) => {
    if (!email) {
      setToast({ type: "error", text: "Email address is not available." });
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!copied) throw new Error("Copy command failed");
      }

      setCopiedEmail(email);
      setToast({ type: "success", text: `Email copied: ${email}` });
    } catch {
      setToast({
        type: "error",
        text: "Unable to copy the email address. Please copy it manually.",
      });
    }
  };

  const openEmailClient = (employee: Employee) => {
    if (!employee.email) {
      setToast({ type: "error", text: "Email address is not available." });
      return;
    }

    const subject = encodeURIComponent(
      `Regarding your ${employee.company?.companyName || "company"} account`
    );
    window.location.href = `mailto:${employee.email}?subject=${subject}`;
  };

  const exportFilteredEmployees = () => {
    if (filteredEmployees.length === 0) {
      setToast({ type: "error", text: "No employee records to export." });
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Company",
      "Role",
      "Status",
      "Created At",
      "Status Changed By",
      "Updated At",
      "Employee ID",
    ];

    const rows = filteredEmployees.map((employee) => [
      employee.name,
      employee.email,
      employee.company?.companyName || "",
      employee.role,
      employee.status,
      formatDate(employee.createdAt),
      employee.statusChangedBy || "",
      formatDate(employee.updatedAt),
      employee.id,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setToast({
      type: "success",
      text: `${filteredEmployees.length} employee record(s) exported successfully.`,
    });
  };

  const updateEmployeeStatus = async () => {
    if (!statusTarget) return;

    const { employee, nextStatus } = statusTarget;
    const adminName =
      localStorage.getItem("admin_userName")?.trim() || "SUPERADMIN";

    setUpdatingEmployeeId(employee.id);
    setToast(null);

    try {
      await axios.put(
        `${BASE_URL}/marketing-service/campgin/employee/${employee.id}/status`,
        null,
        {
          params: {
            name: adminName,
            status: nextStatus,
          },
        }
      );

      const updatedAt = Date.now();

      setEmployees((previousEmployees) =>
        previousEmployees.map((item) =>
          item.id === employee.id
            ? {
                ...item,
                status: nextStatus,
                statusChangedBy: adminName,
                updatedAt,
              }
            : item
        )
      );

      setSelectedEmployee((currentEmployee) =>
        currentEmployee?.id === employee.id
          ? {
              ...currentEmployee,
              status: nextStatus,
              statusChangedBy: adminName,
              updatedAt,
            }
          : currentEmployee
      );

      setToast({
        type: "success",
        text: `${employee.name} has been ${nextStatus.toLowerCase()} successfully.`,
      });
      setStatusTarget(null);
    } catch (updateError: unknown) {
      setToast({
        type: "error",
        text: getErrorMessage(
          updateError,
          `Unable to ${nextStatus.toLowerCase()} ${employee.name}. Please try again.`
        ),
      });
    } finally {
      setUpdatingEmployeeId(null);
    }
  };

  const openStatusModal = (
    employee: Employee,
    nextStatus: Exclude<EmployeeStatus, "CREATED">
  ) => {
    setSelectedEmployee(null);
    setStatusTarget({ employee, nextStatus });
  };

  const openDetailsModal = (employee: Employee) => {
    setStatusTarget(null);
    setSelectedEmployee(employee);
  };

  const renderEmail = (employee: Employee, compact = false) => {
    const copied = copiedEmail === employee.email;

    return (
      <div className="flex min-w-0 items-center gap-1">
        <FaEnvelope className="h-2.5 w-2.5 shrink-0 text-cyan-600" />
        <span
          className={`min-w-0 truncate text-slate-500 ${
            compact ? "text-[10px]" : "text-[11px]"
          }`}
          title={employee.email || "Email not available"}
        >
          {employee.email || "—"}
        </span>
        <button
          type="button"
          onClick={() => void copyEmailAddress(employee.email)}
          disabled={!employee.email}
          className={`flex shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-40 ${
            copied
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          } ${compact ? "h-5 w-5" : "h-6 w-6"}`}
          aria-label={`Copy ${employee.email || "employee email"}`}
          title={copied ? "Copied" : "Copy email"}
        >
          {copied ? (
            <FaCheck className="h-2.5 w-2.5" />
          ) : (
            <FaCopy className="h-2.5 w-2.5" />
          )}
        </button>
      </div>
    );
  };

  const renderActionButtons = (employee: Employee, mobile = false) => {
    const isUpdating = updatingEmployeeId === employee.id;
    const utilityButtonClass = mobile
      ? "inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border px-2 text-[10px] font-bold transition focus:outline-none focus:ring-2"
      : "inline-flex h-7 w-7 items-center justify-center rounded-md border text-[10px] transition focus:outline-none focus:ring-2";

    return (
      <div
        className={`flex flex-wrap items-center ${
          mobile ? "gap-1.5" : "gap-1"
        }`}
      >
        <button
          type="button"
          onClick={() => openDetailsModal(employee)}
          className={`${utilityButtonClass} border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-100`}
          aria-label={`View ${employee.name || "employee"} details`}
          title="View details"
        >
          <FaEye className="h-2.5 w-2.5" />
          {mobile && "View"}
        </button>

        <button
          type="button"
          onClick={() => openEmailClient(employee)}
          disabled={!employee.email}
          className={`${utilityButtonClass} border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-cyan-300 hover:bg-cyan-100 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label={`Send email to ${employee.name || "employee"}`}
          title="Send email"
        >
          <FaPaperPlane className="h-2.5 w-2.5" />
          {mobile && "Email"}
        </button>

        <button
          type="button"
          onClick={() => openStatusModal(employee, "APPROVED")}
          disabled={isUpdating || employee.status === "APPROVED"}
          className={`inline-flex items-center justify-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-40 ${
            mobile ? "h-8 flex-1 px-2 text-[10px]" : "h-7 px-1.5 text-[9px]"
          }`}
        >
          <FaCheck className="h-2.5 w-2.5" />
          Approve
        </button>

        <button
          type="button"
          onClick={() => openStatusModal(employee, "REJECTED")}
          disabled={isUpdating || employee.status === "REJECTED"}
          className={`inline-flex items-center justify-center gap-1 rounded-md border border-rose-200 bg-rose-50 font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-40 ${
            mobile ? "h-8 flex-1 px-2 text-[10px]" : "h-7 px-1.5 text-[9px]"
          }`}
        >
          <FaTimes className="h-2.5 w-2.5" />
          Reject
        </button>
      </div>
    );
  };

  const startItem =
    filteredEmployees.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    filteredEmployees.length
  );

  return (
    <main className="relative min-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl bg-slate-50 text-slate-900">
      <div className="relative mx-auto w-full max-w-[1380px] p-2 sm:p-3 lg:p-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-50/70 p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700">
                  <FaUsers className="h-3 w-3" />
                  Company Management
                </div>

                <h1 className="mt-2.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
                  Employees List
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                  Search employees, copy email IDs, review details and manage access.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                <button
                  type="button"
                  onClick={exportFilteredEmployees}
                  disabled={loading || filteredEmployees.length === 0}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaDownload className="h-3 w-3" />
                  Export CSV
                </button>

                <button
                  type="button"
                  onClick={() => void fetchEmployees(false)}
                  disabled={loading || refreshing}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-white px-3 text-xs font-bold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSyncAlt
                    className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Employees",
                  value: counts.total,
                  icon: <FaUsers />,
                  iconClass: "bg-blue-50 text-blue-700 ring-blue-100",
                },
                {
                  label: "Approved",
                  value: counts.approved,
                  icon: <FaUserCheck />,
                  iconClass:
                    "bg-emerald-50 text-emerald-700 ring-emerald-100",
                },
                {
                  label: "Pending",
                  value: counts.created,
                  icon: <FaClock />,
                  iconClass: "bg-amber-50 text-amber-700 ring-amber-100",
                },
                {
                  label: "Rejected",
                  value: counts.rejected,
                  icon: <FaUserTimes />,
                  iconClass: "bg-rose-50 text-rose-700 ring-rose-100",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ring-1 sm:h-9 sm:w-9 ${item.iconClass}`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-black leading-none text-slate-950 sm:text-xl">
                      {item.value}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-500 sm:text-[11px]">
                      {item.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </header>

          <div className="p-2.5 sm:p-4 lg:p-5">
            {toast && (
              <div
                role="alert"
                aria-live="polite"
                className={`mb-3 flex items-start justify-between gap-2.5 rounded-xl border px-3 py-2.5 text-xs ${
                  toast.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <div className="flex min-w-0 items-start gap-2">
                  {toast.type === "success" ? (
                    <FaCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="break-words leading-4">{toast.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md opacity-60 transition hover:bg-black/5 hover:opacity-100"
                  aria-label="Dismiss message"
                >
                  <FaTimes className="h-2.5 w-2.5" />
                </button>
              </div>
            )}

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-[minmax(230px,1fr)_180px_190px_auto]">
                <label className="relative block md:col-span-2 lg:col-span-1">
                  <span className="sr-only">Search employees</span>
                  <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-cyan-600" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name, email, role, company or admin"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-cyan-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  />
                </label>

                <label className="relative block">
                  <span className="sr-only">Filter by status</span>
                  <FaFilter className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-3 w-3 -translate-y-1/2 text-cyan-600" />
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-cyan-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CREATED">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <FaChevronRight className="pointer-events-none absolute right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-90 text-slate-400" />
                </label>

                <label className="relative block">
                  <span className="sr-only">Filter by company</span>
                  <FaBuilding className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-cyan-600" />
                  <select
                    value={companyFilter}
                    onChange={(event) => setCompanyFilter(event.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-cyan-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="ALL">All Companies</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  <FaChevronRight className="pointer-events-none absolute right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-90 text-slate-400" />
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={
                    !searchTerm &&
                    statusFilter === "ALL" &&
                    companyFilter === "ALL"
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Clear Filters
                </button>
              </div>
            </section>

            {loading ? (
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="mt-4 flex min-h-52 flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-rose-100">
                  <FaExclamationTriangle className="h-5 w-5" />
                </span>
                <h2 className="mt-3 text-base font-black text-rose-900">
                  Employees could not be loaded
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-5 text-rose-700">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void fetchEmployees(true)}
                  className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  <FaSyncAlt className="h-3 w-3" />
                  Try Again
                </button>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="mt-4 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
                  <FaSearch className="h-4 w-4" />
                </span>
                <h2 className="mt-3 text-base font-black text-slate-900">
                  No employees found
                </h2>
                <p className="mt-1.5 text-xs text-slate-500">
                  Change the search or filter options and try again.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 h-9 rounded-xl border border-cyan-200 bg-cyan-50 px-4 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mt-4 hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] border-collapse text-left">
                      <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">
                        <tr>
                          <th className="px-3 py-2.5">Employee</th>
                          <th className="px-3 py-2.5">Company</th>
                          <th className="px-3 py-2.5">Role</th>
                          <th className="px-3 py-2.5">Status</th>
                          <th className="px-3 py-2.5">Created</th>
                          <th className="px-3 py-2.5">Changed By</th>
                          <th className="px-3 py-2.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="transition hover:bg-cyan-50/40"
                          >
                            <td className="px-3 py-2.5">
                              <div className="flex min-w-[205px] items-center gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-[10px] font-black text-white ring-2 ring-cyan-50">
                                  {getInitials(employee.name)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[11px] font-black text-slate-900">
                                    {employee.name || "Unnamed Employee"}
                                  </span>
                                  <span className="mt-0.5 block">
                                    {renderEmail(employee, true)}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="inline-flex max-w-[170px] items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">
                                <FaBuilding className="h-2.5 w-2.5 shrink-0" />
                                <span className="truncate">
                                  {employee.company?.companyName || "—"}
                                </span>
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="flex max-w-[155px] items-center gap-1 text-[10px] font-bold text-slate-700">
                                <FaBriefcase className="h-2.5 w-2.5 shrink-0 text-violet-500" />
                                <span className="truncate">
                                  {employee.role || "—"}
                                </span>
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <StatusBadge status={employee.status} />
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="flex min-w-[125px] items-start gap-1 text-[10px] font-semibold leading-4 text-slate-600">
                                <FaCalendarAlt className="mt-0.5 h-2.5 w-2.5 shrink-0 text-slate-400" />
                                {formatDate(employee.createdAt)}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="flex max-w-[115px] items-center gap-1 text-[10px] font-bold text-slate-600">
                                <FaUser className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                                <span className="truncate">
                                  {employee.statusChangedBy || "Not updated"}
                                </span>
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              {renderActionButtons(employee)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 lg:hidden">
                  {paginatedEmployees.map((employee) => (
                    <article
                      key={employee.id}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2.5 border-b border-slate-100 bg-slate-50/60 p-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-xs font-black text-white ring-2 ring-cyan-50">
                            {getInitials(employee.name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h2 className="truncate text-xs font-black text-slate-950 sm:text-sm">
                              {employee.name || "Unnamed Employee"}
                            </h2>
                            <div className="mt-1 max-w-full">
                              {renderEmail(employee)}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={employee.status} />
                      </div>

                      <div className="grid grid-cols-1 gap-2 p-3 min-[520px]:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                            Company
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <FaBuilding className="h-3 w-3 shrink-0 text-blue-500" />
                            <span className="truncate">
                              {employee.company?.companyName || "—"}
                            </span>
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                            Role
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <FaBriefcase className="h-3 w-3 shrink-0 text-violet-500" />
                            <span className="truncate">{employee.role || "—"}</span>
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                            Created At
                          </p>
                          <p className="mt-1 flex items-start gap-1.5 text-[11px] font-bold leading-4 text-slate-700">
                            <FaCalendarAlt className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                            {formatDate(employee.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
                          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                            Status Changed By
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <FaUser className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="truncate">
                              {employee.statusChangedBy || "Not updated"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 bg-slate-50/60 p-3">
                        {renderActionButtons(employee, true)}
                      </div>
                    </article>
                  ))}
                </div>

                <footer className="mt-4 flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 sm:flex-row sm:items-center sm:justify-between sm:p-3">
                  <p className="text-center text-[11px] font-semibold text-slate-500 sm:text-left sm:text-xs">
                    Showing <span className="font-black text-slate-800">{startItem}</span>–
                    <span className="font-black text-slate-800">{endItem}</span> of{" "}
                    <span className="font-black text-slate-800">
                      {filteredEmployees.length}
                    </span>{" "}
                    employees
                  </p>

                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((previous) => Math.max(1, previous - 1))
                      }
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>

                    <span className="min-w-20 text-center text-[11px] font-bold text-slate-600 sm:text-xs">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((previous) =>
                          Math.min(totalPages, previous + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </footer>
              </>
            )}
          </div>
        </section>
      </div>

      {selectedEmployee && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employee-details-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedEmployee(null)}
            aria-label="Close employee details"
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/80 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-sm font-black text-white ring-4 ring-cyan-50">
                    {getInitials(selectedEmployee.name)}
                  </span>
                  <div className="min-w-0">
                    <h2
                      id="employee-details-title"
                      className="truncate text-base font-black text-slate-950 sm:text-lg"
                    >
                      {selectedEmployee.name || "Unnamed Employee"}
                    </h2>
                    <div className="mt-1">
                      <StatusBadge status={selectedEmployee.status} />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEmployee(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  {
                    label: "Email Address",
                    value: selectedEmployee.email || "—",
                    icon: <FaEnvelope />,
                  },
                  {
                    label: "Company",
                    value: selectedEmployee.company?.companyName || "—",
                    icon: <FaBuilding />,
                  },
                  {
                    label: "Role",
                    value: selectedEmployee.role || "—",
                    icon: <FaBriefcase />,
                  },
                  {
                    label: "Changed By",
                    value: selectedEmployee.statusChangedBy || "Not updated",
                    icon: <FaUser />,
                  },
                  {
                    label: "Created At",
                    value: formatDate(selectedEmployee.createdAt),
                    icon: <FaCalendarAlt />,
                  },
                  {
                    label: "Updated At",
                    value: formatDate(selectedEmployee.updatedAt),
                    icon: <FaClock />,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <dt className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                      <span className="text-cyan-600">{item.icon}</span>
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 break-words text-xs font-bold leading-5 text-slate-800">
                      {item.value}
                    </dd>
                  </div>
                ))}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                    <FaIdBadge className="text-cyan-600" />
                    Employee ID
                  </dt>
                  <dd className="mt-1.5 break-all font-mono text-[10px] font-semibold leading-4 text-slate-700">
                    {selectedEmployee.id || "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => void copyEmailAddress(selectedEmployee.email)}
                  disabled={!selectedEmployee.email}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaCopy className="h-3 w-3" />
                  Copy Email
                </button>

                <button
                  type="button"
                  onClick={() => openEmailClient(selectedEmployee)}
                  disabled={!selectedEmployee.email}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-2 text-[10px] font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaPaperPlane className="h-3 w-3" />
                  Send Email
                </button>

                <button
                  type="button"
                  onClick={() => openStatusModal(selectedEmployee, "APPROVED")}
                  disabled={selectedEmployee.status === "APPROVED"}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaCheck className="h-3 w-3" />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => openStatusModal(selectedEmployee, "REJECTED")}
                  disabled={selectedEmployee.status === "REJECTED"}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2 text-[10px] font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaTimes className="h-3 w-3" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {statusTarget && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => {
              if (!updatingEmployeeId) setStatusTarget(null);
            }}
            aria-label="Close status confirmation"
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl">
            <div
              className={`p-4 sm:p-5 ${
                statusTarget.nextStatus === "APPROVED"
                  ? "bg-gradient-to-br from-emerald-50 to-cyan-50"
                  : "bg-gradient-to-br from-rose-50 to-orange-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg ring-1 ${
                    statusTarget.nextStatus === "APPROVED"
                      ? "text-emerald-700 ring-emerald-100"
                      : "text-rose-700 ring-rose-100"
                  }`}
                >
                  {statusTarget.nextStatus === "APPROVED" ? (
                    <FaUserCheck />
                  ) : (
                    <FaUserTimes />
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => setStatusTarget(null)}
                  disabled={Boolean(updatingEmployeeId)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white bg-white/90 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50"
                  aria-label="Close"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </div>

              <h2
                id="status-modal-title"
                className="mt-4 text-lg font-black tracking-tight text-slate-950 sm:text-xl"
              >
                {statusTarget.nextStatus === "APPROVED"
                  ? "Approve Employee"
                  : "Reject Employee"}
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                Are you sure you want to {statusTarget.nextStatus.toLowerCase()}{" "}
                <span className="font-black text-slate-900">
                  {statusTarget.employee.name}
                </span>
                ?
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-[11px] font-black text-white">
                    {getInitials(statusTarget.employee.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-slate-900">
                      {statusTarget.employee.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {statusTarget.employee.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStatusTarget(null)}
                  disabled={Boolean(updatingEmployeeId)}
                  className="h-9 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void updateEmployeeStatus()}
                  disabled={Boolean(updatingEmployeeId)}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                    statusTarget.nextStatus === "APPROVED"
                      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200"
                      : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200"
                  }`}
                >
                  {updatingEmployeeId ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {statusTarget.nextStatus === "APPROVED" ? (
                        <FaCheck className="h-3 w-3" />
                      ) : (
                        <FaTimes className="h-3 w-3" />
                      )}
                      Confirm{" "}
                      {statusTarget.nextStatus === "APPROVED"
                        ? "Approval"
                        : "Rejection"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmployeesList;