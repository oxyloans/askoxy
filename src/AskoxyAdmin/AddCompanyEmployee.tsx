import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaBuilding,
  FaCheck,
  FaCheckCircle,
  FaChevronRight,
  FaEnvelope,
  FaExclamationTriangle,
  FaIdBadge,
  FaPlus,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import BASE_URL from "../Config";

interface Company {
  id: string;
  companyName: string;
}

interface FormState {
  name: string;
  companyEmailId: string;
  companyId: string;
  personRole: string;
}

interface StatusMessage {
  type: "success" | "error";
  text: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const initialFormState: FormState = {
  name: "",
  companyEmailId: "",
  companyId: "",
  personRole: "",
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.response?.data?.error || fallback;
  }

  if (error instanceof Error) return error.message;
  return fallback;
};

const fieldClassName =
  "h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-cyan-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:h-11 sm:text-sm";

const labelClassName = "mb-1.5 block text-xs font-bold text-slate-700 sm:text-sm";

interface FieldShellProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FieldShell: React.FC<FieldShellProps> = ({ icon, children }) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-cyan-600">
      {icon}
    </span>
    {children}
  </div>
);

const AddCompanyEmployee: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesRefreshing, setCompaniesRefreshing] = useState(false);
  const [companiesError, setCompaniesError] = useState("");

  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [addCompanySubmitting, setAddCompanySubmitting] = useState(false);
  const [addCompanyError, setAddCompanyError] = useState("");

  const sortedCompanies = useMemo(
    () =>
      [...companies].sort((a, b) =>
        a.companyName.localeCompare(b.companyName, undefined, {
          sensitivity: "base",
        })
      ),
    [companies]
  );

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === form.companyId),
    [companies, form.companyId]
  );

  const completedFields = useMemo(
    () =>
      [
        Boolean(form.companyId),
        Boolean(form.name.trim()),
        Boolean(form.personRole.trim()),
        Boolean(form.companyEmailId.trim()),
      ].filter(Boolean).length,
    [form]
  );

  const completionPercentage = completedFields * 25;

  const fetchCompanies = useCallback(
    async (initialLoad = false): Promise<Company[]> => {
      if (initialLoad) setCompaniesLoading(true);
      else setCompaniesRefreshing(true);

      setCompaniesError("");

      try {
        const response = await axios.get(
          `${BASE_URL}/marketing-service/campgin/jobs-companies`
        );

        const data = Array.isArray(response.data?.data)
          ? (response.data.data as Company[])
          : [];

        setCompanies(data);
        return data;
      } catch (error: unknown) {
        setCompaniesError(
          getErrorMessage(error, "Unable to load companies. Please try again.")
        );
        return [];
      } finally {
        setCompaniesLoading(false);
        setCompaniesRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void fetchCompanies(true);
  }, [fetchCompanies]);

  useEffect(() => {
    if (!showAddCompanyModal) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !addCompanySubmitting) {
        setShowAddCompanyModal(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showAddCompanyModal, addCompanySubmitting]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (statusMessage) setStatusMessage(null);
  };

  const validateForm = (): string | null => {
    if (!form.companyId) return "Please select a company.";
    if (!form.name.trim()) return "Employee name is required.";
    if (!form.personRole.trim()) return "Employee role is required.";
    if (!form.companyEmailId.trim()) return "Company email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.companyEmailId.trim())) {
      return "Please enter a valid company email address.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setStatusMessage({ type: "error", text: validationError });
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/create-employee-credentials`,
        {
          name: form.name.trim(),
          companyEmailId: form.companyEmailId.trim(),
          companyId: form.companyId,
          personRole: form.personRole.trim(),
        }
      );

      setStatusMessage({
        type: "success",
        text:
          response.data?.message ||
          "Employee credentials were created successfully.",
      });
      setForm(initialFormState);
    } catch (error: unknown) {
      setStatusMessage({
        type: "error",
        text: getErrorMessage(
          error,
          "Unable to create employee credentials. Please try again."
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setStatusMessage(null);
  };

  const openAddCompanyModal = () => {
    setNewCompanyName("");
    setAddCompanyError("");
    setShowAddCompanyModal(true);
  };

  const closeAddCompanyModal = () => {
    if (addCompanySubmitting) return;
    setShowAddCompanyModal(false);
  };

  const handleAddCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddCompanyError("");

    const companyName = newCompanyName.trim();

    if (!companyName) {
      setAddCompanyError("Company name is required.");
      return;
    }

    const companyAlreadyExists = companies.some(
      (company) =>
        company.companyName.trim().toLowerCase() === companyName.toLowerCase()
    );

    if (companyAlreadyExists) {
      setAddCompanyError("This company already exists.");
      return;
    }

    setAddCompanySubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/save-or-update-company`,
        {
          companyName,
          type: "JOB",
        }
      );

      const refreshedCompanies = await fetchCompanies(false);
      const createdCompany = refreshedCompanies.find(
        (company) =>
          company.companyName.trim().toLowerCase() === companyName.toLowerCase()
      );

      if (createdCompany) {
        setForm((previous) => ({
          ...previous,
          companyId: createdCompany.id,
        }));
      }

      setStatusMessage({
        type: "success",
        text: response.data?.message || `${companyName} was added successfully.`,
      });
      setShowAddCompanyModal(false);
      setNewCompanyName("");
    } catch (error: unknown) {
      setAddCompanyError(
        getErrorMessage(error, "Unable to add the company. Please try again.")
      );
    } finally {
      setAddCompanySubmitting(false);
    }
  };

  const summaryCards = [
    {
      label: "Available Companies",
      value: companiesLoading ? "—" : companies.length,
      icon: <FaBuilding />,
      iconClass: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      label: "Selected Company",
      value: selectedCompany ? "1" : "0",
      icon: <FaCheckCircle />,
      iconClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Fields Completed",
      value: `${completedFields}/4`,
      icon: <FaIdBadge />,
      iconClass: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      label: "Completion",
      value: `${completionPercentage}%`,
      icon: <FaShieldAlt />,
      iconClass: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    },
  ];

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
                  Add Company Employee
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                  Add a company when required, then create and connect employee
                  credentials from the same management section.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                <button
                  type="button"
                  onClick={() => void fetchCompanies(false)}
                  disabled={companiesLoading || companiesRefreshing}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-white px-3 text-xs font-bold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSyncAlt
                    className={`h-3 w-3 ${
                      companiesRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {companiesRefreshing ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={openAddCompanyModal}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-600 bg-cyan-600 px-3 text-xs font-bold text-white transition hover:border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                >
                  <FaPlus className="h-3 w-3" />
                  Add Company
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {summaryCards.map((item) => (
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
                    <span className="block truncate text-lg font-black leading-none text-slate-950 sm:text-xl">
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
            {statusMessage && (
              <div
                role="alert"
                aria-live="polite"
                className={`mb-3 flex items-start justify-between gap-2.5 rounded-xl border px-3 py-2.5 text-xs sm:text-sm ${
                  statusMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <div className="flex min-w-0 items-start gap-2">
                  {statusMessage.type === "success" ? (
                    <FaCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="break-words leading-5">{statusMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md opacity-60 transition hover:bg-black/5 hover:opacity-100"
                  aria-label="Dismiss message"
                >
                  <FaTimes className="h-2.5 w-2.5" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
                        <FaUserPlus className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-black text-slate-950 sm:text-base">
                          Employee Details
                        </h2>
                        <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                          Complete all required fields to create an employee.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 sm:text-xs">
                      {completedFields}/4 completed
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 sm:w-24">
                      <div
                        className="h-full rounded-full bg-cyan-600 transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-busy={submitting}
                  className="space-y-4 p-3 sm:p-4 lg:p-5"
                >
                  <div>
                    <label
                      htmlFor="companyId"
                      className="mb-1.5 block text-xs font-bold text-slate-700 sm:text-sm"
                    >
                      Select Company <span className="text-rose-500">*</span>
                    </label>

                    {companiesLoading ? (
                      <div className="flex h-10 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:h-11">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
                        <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                          Loading companies...
                        </span>
                      </div>
                    ) : companiesError ? (
                      <div className="flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-rose-700 sm:text-sm">
                          {companiesError}
                        </p>
                        <button
                          type="button"
                          onClick={() => void fetchCompanies(false)}
                          className="h-8 shrink-0 rounded-lg border border-rose-200 bg-white px-3 text-[10px] font-bold text-rose-700 transition hover:bg-rose-100 sm:text-xs"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <FieldShell icon={<FaBuilding className="h-3.5 w-3.5" />}>
                        <select
                          id="companyId"
                          name="companyId"
                          value={form.companyId}
                          onChange={handleChange}
                          className={`${fieldClassName} appearance-none pr-9`}
                          required
                        >
                          <option value="">Choose a company</option>
                          {sortedCompanies.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                        </select>
                        <FaChevronRight className="pointer-events-none absolute right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-90 text-slate-400" />
                      </FieldShell>
                    )}

                    {selectedCompany && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 sm:text-xs">
                        <FaCheckCircle className="h-3 w-3" />
                        Selected: {selectedCompany.companyName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClassName}>
                        Employee Name <span className="text-rose-500">*</span>
                      </label>
                      <FieldShell icon={<FaUserPlus className="h-3.5 w-3.5" />}>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter employee name"
                          autoComplete="name"
                          className={fieldClassName}
                          required
                        />
                      </FieldShell>
                    </div>

                    <div>
                      <label htmlFor="personRole" className={labelClassName}>
                        Employee Role <span className="text-rose-500">*</span>
                      </label>
                      <FieldShell icon={<FaBriefcase className="h-3.5 w-3.5" />}>
                        <input
                          id="personRole"
                          type="text"
                          name="personRole"
                          value={form.personRole}
                          onChange={handleChange}
                          placeholder="Example: HR Manager"
                          className={fieldClassName}
                          required
                        />
                      </FieldShell>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyEmailId" className={labelClassName}>
                      Company Email ID <span className="text-rose-500">*</span>
                    </label>
                    <FieldShell icon={<FaEnvelope className="h-3.5 w-3.5" />}>
                      <input
                        id="companyEmailId"
                        type="email"
                        name="companyEmailId"
                        value={form.companyEmailId}
                        onChange={handleChange}
                        placeholder="employee@company.com"
                        autoComplete="email"
                        inputMode="email"
                        spellCheck={false}
                        className={fieldClassName}
                        required
                      />
                    </FieldShell>
                  </div>

                  <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={submitting}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Reset Form
                    </button>

                    <button
                      type="submit"
                      disabled={
                        submitting || companiesLoading || Boolean(companiesError)
                      }
                      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-600 bg-cyan-600 px-5 text-xs font-bold text-white transition hover:border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-40"
                    >
                      {submitting ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="h-3 w-3" />
                          Create Employee
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>

              <aside className="space-y-3">
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
                      <FaShieldAlt className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 sm:text-sm">
                        Account Setup
                      </h2>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                        Employee credentials are connected to the selected company
                        and assigned the entered role.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {[
                      "Select the correct company",
                      "Enter the employee's official name",
                      "Assign the correct company role",
                      "Use an active company email ID",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                            index < completedFields
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {index < completedFields ? <FaCheck /> : index + 1}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600 sm:text-xs">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
                  <div className="flex items-start gap-2.5">
                    <FaBuilding className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                    <div>
                      <p className="text-xs font-black text-blue-900 sm:text-sm">
                        Company not listed?
                      </p>
                      <p className="mt-1 text-[10px] leading-4 text-blue-700 sm:text-xs sm:leading-5">
                        Use the action in the page header. After creation, the company
                        is refreshed and selected automatically.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {showAddCompanyModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-slate-950/55 p-2.5 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-company-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={closeAddCompanyModal}
            aria-label="Close add company modal"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
                  <FaBuilding className="h-4 w-4" />
                </span>
                <div>
                  <h2
                    id="add-company-title"
                    className="text-base font-black tracking-tight text-slate-950 sm:text-lg"
                  >
                    New Company
                  </h2>
                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    The new company will be selected automatically.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAddCompanyModal}
                disabled={addCompanySubmitting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                aria-label="Close"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="newCompanyName" className={labelClassName}>
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <FieldShell icon={<FaBuilding className="h-3.5 w-3.5" />}>
                  <input
                    id="newCompanyName"
                    type="text"
                    autoFocus
                    value={newCompanyName}
                    onChange={(event) => {
                      setNewCompanyName(event.target.value);
                      if (addCompanyError) setAddCompanyError("");
                    }}
                    placeholder="Enter company name"
                    className={fieldClassName}
                    required
                  />
                </FieldShell>
              </div>

              {addCompanyError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
                >
                  <FaExclamationTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="leading-4">{addCompanyError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeAddCompanyModal}
                  disabled={addCompanySubmitting}
                  className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addCompanySubmitting}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan-600 bg-cyan-600 text-xs font-bold text-white transition hover:border-cyan-700 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addCompanySubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaCheck className="h-3 w-3" />
                      Save Company
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddCompanyEmployee;
