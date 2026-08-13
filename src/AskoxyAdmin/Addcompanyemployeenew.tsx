import React, { useState } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaUserPlus,
  FaUserTie,
} from "react-icons/fa";
import BASE_URL from "../Config";

interface EmployeeForm {
  name: string;
  companyName: string;
  designation: string;
  companyEmail: string;
}

interface FormField {
  name: keyof EmployeeForm;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: "text" | "email";
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  error?: string;
  errorMessage?: string;
  data?: {
    id?: string;
    name?: string;
    companyEmail?: string;
    companyName?: string;
    designation?: string;
  } | null;
}

type Notice = { type: "success" | "error"; message: string; data?: ApiResponse["data"] };

const emptyForm: EmployeeForm = {
  name: "",
  companyName: "",
  designation: "",
  companyEmail: "",
};

const getApiMessage = (data: ApiResponse | undefined, fallback: string) =>
  data?.message || data?.error || data?.errorMessage || fallback;

const AddCompanyEmployeeNew: React.FC = () => {
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setNotice(null);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.companyName.trim()) return "Company name is required.";
    if (!form.designation.trim()) return "Designation is required.";
    if (!form.companyEmail.trim()) return "Company email is required.";
    if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.companyEmail.trim())) {
      return "Enter a valid company email address.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    const validationError = validate();
    if (validationError) {
      setNotice({ type: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/user-service/create-employee-admin`,
        {
          name: form.name.trim(),
          companyName: form.companyName.trim(),
          designation: form.designation.trim(),
          companyEmail: form.companyEmail.trim(),
        },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      if (response.data.status === false) {
        setNotice({ type: "error", message: getApiMessage(response.data, "Unable to create employee.") });
        return;
      }

      setNotice({
        type: "success",
        message: getApiMessage(response.data, "Employee created successfully. Login credentials were sent by email."),
        data: response.data.data,
      });
      setForm(emptyForm);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        const status = error.response?.status;
        const fallback =
          status === 400 ? "Please correct the employee details and try again." :
          status === 409 ? "An employee with this email already exists." :
          status === 401 || status === 403 ? "You are not authorized to create employees." :
          status && status >= 500 ? "The server could not create the employee. Please try again later." :
          error.code === "ECONNABORTED" ? "The request timed out. Please try again." :
          "Unable to reach the server. Please check your connection.";
        setNotice({ type: "error", message: getApiMessage(error.response?.data, fallback) });
      } else {
        setNotice({ type: "error", message: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fields: FormField[] = [
    { name: "name", label: "Employee Name", placeholder: "Enter full name", icon: <FaUserTie /> },
    { name: "companyName", label: "Company Name", placeholder: "Enter company name", icon: <FaBuilding /> },
    { name: "designation", label: "Designation", placeholder: "Example: Software Developer", icon: <FaBriefcase /> },
    { name: "companyEmail", label: "Company Email", placeholder: "employee@company.com", icon: <FaEnvelope />, type: "email" },
  ];

  return (
    <main className="min-h-[calc(100vh-6rem)] bg-slate-50 p-3 text-slate-900 sm:p-5">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 bg-gradient-to-r from-cyan-700 to-blue-700 p-5 text-white sm:p-7">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-lg"><FaUserPlus /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Employee Management</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Add Company Employee</h1>
              <p className="mt-2 text-sm text-cyan-50">A temporary password will be emailed to the employee. They must change it on first login.</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-7">
          {notice && (
            <div role="alert" className={`mb-5 rounded-xl border p-4 ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
              <div className="flex items-start gap-3">
                {notice.type === "success" ? <FaCheckCircle className="mt-0.5 shrink-0" /> : <FaExclamationTriangle className="mt-0.5 shrink-0" />}
                <div><p className="font-bold">{notice.message}</p>
                  {notice.type === "success" && notice.data && (
                    <p className="mt-1 text-sm">Created: {notice.data.name || "Employee"}{notice.data.companyEmail ? ` (${notice.data.companyEmail})` : ""}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.name === "companyEmail" ? "sm:col-span-2" : ""}>
                <label htmlFor={field.name} className="mb-2 block text-sm font-bold text-slate-700">{field.label} <span className="text-rose-600">*</span></label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700">{field.icon}</span>
                  <input id={field.name} name={field.name} type={field.type || "text"} value={form[field.name]} onChange={updateField} disabled={submitting} placeholder={field.placeholder} required className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100" />
                </div>
              </div>
            ))}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { setForm(emptyForm); setNotice(null); }} disabled={submitting} className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Reset</button>
              <button type="submit" disabled={submitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 text-sm font-bold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60">
                <FaUserPlus /> {submitting ? "Creating Employee..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AddCompanyEmployeeNew;





