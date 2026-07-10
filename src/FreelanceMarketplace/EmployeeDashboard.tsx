import React, { useState, useEffect } from "react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import EmployeeLayout from "./EmployeeLayout";
import StatusAlert from "./StatusAlert";
import { extractApiError, extractResponseMessage } from "./apiUtils";
import { LoadingCenter, pageContainerClass } from "./marketplaceUi";
import Swal from "sweetalert2";

interface CompanyProfile {
  id: string;
  userId: string | null;
  companyName: string;
  companyLocation: string;
  companyLogo?: string | null;
  companyStatus?: string;
}

type FormValues = { companyName: string; companyLocation: string };
type ReqValues = { title: string; skillName: string; experience: string; budget: string; positions: string };

const inp = "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500";
const btnBlue = "rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50";
const btnGreen = "rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50";
const btnGhost = "rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600";

const statusColor: Record<string, string> = {
  APPROVED: "text-emerald-700 bg-emerald-50 border-emerald-200",
  PENDING:  "text-amber-700  bg-amber-50  border-amber-200",
  REJECTED: "text-red-700    bg-red-50    border-red-200",
};

const EmployeeDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Company form panel
  const [showCompanyPanel, setShowCompanyPanel] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CompanyProfile | null>(null);
  const [companyForm, setCompanyForm] = useState<FormValues>({ companyName: "", companyLocation: "" });
  const [companyFormError, setCompanyFormError] = useState<string | null>(null);
  const [companyFormSuccess, setCompanyFormSuccess] = useState<string | null>(null);

  // Requirement form panel
  const [showReqPanel, setShowReqPanel] = useState(false);
  const [reqTarget, setReqTarget] = useState<CompanyProfile | null>(null);
  const [reqForm, setReqForm] = useState<ReqValues>({ title: "", skillName: "", experience: "", budget: "", positions: "" });
  const [reqFormError, setReqFormError] = useState<string | null>(null);
  const [reqFormSuccess, setReqFormSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  useEffect(() => { fetchProfiles(); }, []);
  useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 6000); return () => clearTimeout(t); } }, [error]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await freelanceApi.get<CompanyProfile[]>(
        `${BASE_URL}/user-service/showingCompanyDetailsBasedOnUserId?userId=${userId}`
      );
      setProfiles(res.data?.length ? res.data : []);
    } catch (err: unknown) { setError(extractApiError(err)); }
    finally { setLoading(false); }
  };

  /* ── Company panel ── */
  const openCreate = () => {
    setIsCreating(true);
    setEditingProfile(null);
    setCompanyForm({ companyName: "", companyLocation: "" });
    setCompanyFormError(null);
    setCompanyFormSuccess(null);
    setShowCompanyPanel(true);
    setShowReqPanel(false);
  };

  const openEdit = (p: CompanyProfile) => {
    setIsCreating(false);
    setEditingProfile(p);
    setCompanyForm({ companyName: p.companyName, companyLocation: p.companyLocation });
    setCompanyFormError(null);
    setCompanyFormSuccess(null);
    setShowCompanyPanel(true);
    setShowReqPanel(false);
  };

  const closeCompanyPanel = () => { setShowCompanyPanel(false); setEditingProfile(null); };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.companyName.trim()) { setCompanyFormError("Company name is required."); return; }
    if (!companyForm.companyLocation.trim()) { setCompanyFormError("Location is required."); return; }
    try {
      setSubmitting(true);
      setCompanyFormError(null);
      const payload: Record<string, string> = {
        companyName: companyForm.companyName.trim(),
        companyLocation: companyForm.companyLocation.trim(),
        userId: userId || "",
      };
      if (editingProfile?.id) payload.id = editingProfile.id;
      const res = await freelanceApi.patch(`${BASE_URL}/user-service/companyProfile`, payload);
      if (res.status === 200 || res.status === 201) {
        const msg = extractResponseMessage(res.data) || "Saved successfully.";
        setCompanyFormSuccess(msg);
        Swal.fire({ icon: "success", title: "Success", text: msg, timer: 1800, showConfirmButton: false, toast: true, position: "top-end" });
        fetchProfiles();
        setTimeout(closeCompanyPanel, 1200);
      } else {
        setCompanyFormError(extractResponseMessage(res.data) || "Could not save.");
      }
    } catch (err: unknown) { setCompanyFormError(extractApiError(err)); }
    finally { setSubmitting(false); }
  };

  /* ── Requirement panel ── */
  const openReq = (p: CompanyProfile) => {
    setReqTarget(p);
    setReqForm({ title: "", skillName: "", experience: "", budget: "", positions: "" });
    setReqFormError(null);
    setReqFormSuccess(null);
    setShowReqPanel(true);
    setShowCompanyPanel(false);
  };

  const closeReqPanel = () => { setShowReqPanel(false); setReqTarget(null); };

  const handleReqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.title.trim() || !reqForm.skillName.trim() || !reqForm.experience.trim() || !reqForm.budget || !reqForm.positions) {
      setReqFormError("All fields are required.");
      return;
    }
    try {
      setSubmitting(true);
      setReqFormError(null);
      const res = await freelanceApi.patch(`${BASE_URL}/user-service/companyRequirement`, {
        budget: Number(reqForm.budget),
        experience: reqForm.experience.trim(),
        positions: Number(reqForm.positions),
        title: reqForm.title.trim(),
        skillName: reqForm.skillName.trim(),
        companyId: reqTarget?.id,
      });
      if (res.status === 200 || res.status === 201) {
        const msg = extractResponseMessage(res.data) || "Requirement posted.";
        setReqFormSuccess(msg);
        Swal.fire({ icon: "success", title: "Success", text: msg, timer: 1800, showConfirmButton: false, toast: true, position: "top-end" });
        fetchProfiles();
        setTimeout(closeReqPanel, 1200);
      } else {
        setReqFormError(extractResponseMessage(res.data) || "Could not post.");
      }
    } catch (err: unknown) { setReqFormError(extractApiError(err)); }
    finally { setSubmitting(false); }
  };

  const approved = profiles.filter((p) => p.companyStatus === "APPROVED").length;
  const pending  = profiles.filter((p) => p.companyStatus === "PENDING" || !p.companyStatus).length;

  if (loading) return <EmployeeLayout><LoadingCenter tip="Loading company profiles…" /></EmployeeLayout>;

  return (
    <EmployeeLayout>
      <div className={pageContainerClass}>

        {/* ── Page title row ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Companies</h1>
            <p className="mt-0.5 text-sm text-gray-500">Register and manage your company profiles, then post hiring requirements</p>
          </div>
          <button onClick={openCreate} className={btnBlue}>+ Register Company</button>
        </div>

        {/* ── Stat cards ── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Registered Companies", value: profiles.length, accent: "bg-indigo-600" },
            { label: "Approved & Active",     value: approved,         accent: "bg-emerald-600" },
            { label: "Awaiting Approval",      value: pending,          accent: "bg-amber-500"   },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.accent}`}>
                <span className="text-lg font-bold text-white">{s.value}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{s.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {error && <StatusAlert message={error} variant="error" onDismiss={() => setError(null)} className="mb-5" />}

        {/* ── Inline Company Form Panel ── */}
        {showCompanyPanel && (
          <div className="mb-6 rounded-xl border border-indigo-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-bold text-gray-800">
                {isCreating ? "Register New Company" : `Edit Company — ${editingProfile?.companyName}`}
              </h2>
              <button onClick={closeCompanyPanel} className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                Cancel
              </button>
            </div>
            <form onSubmit={handleCompanySubmit} className="p-6">
              {companyFormError  && <StatusAlert message={companyFormError}  variant="error"   onDismiss={() => setCompanyFormError(null)}  className="mb-4" />}
              {companyFormSuccess && <StatusAlert message={companyFormSuccess} variant="success" onDismiss={() => setCompanyFormSuccess(null)} className="mb-4" />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Company Name</label>
                  <input
                    className={inp}
                    placeholder="e.g. Acme Technologies Pvt. Ltd."
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm((f) => ({ ...f, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={label}>Office Location</label>
                  <input
                    className={inp}
                    placeholder="e.g. Hyderabad, Telangana"
                    value={companyForm.companyLocation}
                    onChange={(e) => setCompanyForm((f) => ({ ...f, companyLocation: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" disabled={submitting} className={btnBlue}>
                  {submitting ? "Saving…" : isCreating ? "Register Company" : "Save Changes"}
                </button>
                <button type="button" onClick={closeCompanyPanel} className={btnGhost}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Inline Requirement Form Panel ── */}
        {showReqPanel && (
          <div className="mb-6 rounded-xl border border-emerald-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">Post a Job Requirement</h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Company: <span className="font-semibold text-indigo-600">{reqTarget?.companyName}</span>
                </p>
              </div>
              <button onClick={closeReqPanel} className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                Cancel
              </button>
            </div>
            <form onSubmit={handleReqSubmit} className="p-6">
              {reqFormError   && <StatusAlert message={reqFormError}   variant="error"   onDismiss={() => setReqFormError(null)}   className="mb-4" />}
              {reqFormSuccess && <StatusAlert message={reqFormSuccess} variant="success" onDismiss={() => setReqFormSuccess(null)} className="mb-4" />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label}>Job Title / Role</label>
                  <input className={inp} placeholder="e.g. Senior React Developer" value={reqForm.title} onChange={(e) => setReqForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className={label}>Required Skills</label>
                  <input className={inp} placeholder="e.g. React, Node.js, TypeScript" value={reqForm.skillName} onChange={(e) => setReqForm((f) => ({ ...f, skillName: e.target.value }))} />
                </div>
                <div>
                  <label className={label}>Years of Experience</label>
                  <input className={inp} placeholder="e.g. 4+ Years" value={reqForm.experience} onChange={(e) => setReqForm((f) => ({ ...f, experience: e.target.value }))} />
                </div>
                <div>
                  <label className={label}>Monthly Budget (₹)</label>
                  <input className={inp} type="number" placeholder="e.g. 80000" value={reqForm.budget} onChange={(e) => setReqForm((f) => ({ ...f, budget: e.target.value }))} />
                </div>
                <div>
                  <label className={label}>Number of Openings</label>
                  <input className={inp} type="number" placeholder="e.g. 3" value={reqForm.positions} onChange={(e) => setReqForm((f) => ({ ...f, positions: e.target.value }))} />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" disabled={submitting} className={btnGreen}>
                  {submitting ? "Posting…" : "Publish Requirement"}
                </button>
                <button type="button" onClick={closeReqPanel} className={btnGhost}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                <svg className="h-7 w-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700">No Companies Registered Yet</p>
              <p className="mt-1 text-sm text-gray-400">Register your first company to start posting requirements and hiring talent</p>
              <button onClick={openCreate} className={`${btnBlue} mt-5`}>+ Register Company</button>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 px-6 py-4">
                <p className="text-sm font-semibold text-gray-700">{profiles.length} {profiles.length === 1 ? "Company Registered" : "Companies Registered"}</p>
              </div>
              {/* Mobile cards */}
              <div className="divide-y divide-gray-50 sm:hidden">
                {profiles.map((p) => (
                  <div key={p.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{p.companyName}</p>
                        <p className="text-xs text-gray-400">{p.companyLocation}</p>
                      </div>
                      <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase ${statusColor[p.companyStatus?.toUpperCase() || ""] ?? "bg-gray-50 border-gray-200 text-gray-500"}`}>
                        {p.companyStatus || "Pending"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">Edit Profile</button>
                      {p.companyStatus === "APPROVED" ? (
                        <button onClick={() => openReq(p)} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Post Requirement</button>
                      ) : (
                        <span className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-400">Post Requirement</span>
                      )}
                      <button onClick={() => navigate(`/employee-assigned-freelancers/${p.id}`)} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">Assigned Talent</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="min-w-full divide-y divide-gray-50 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Company", "Location", "Status", "Actions"].map((h) => (
                        <th key={h} className={`px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 ${h === "Location" ? "hidden md:table-cell" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {profiles.map((p, i) => (
                      <tr key={p.id} className="group transition hover:bg-gray-50/80">
                        <td className="px-5 py-4 text-center text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4 text-center">
                          <p className="font-semibold text-gray-900">{p.companyName}</p>
                          <p className="text-xs text-gray-400 md:hidden">{p.companyLocation}</p>
                        </td>
                        <td className="hidden px-5 py-4 text-center text-gray-500 md:table-cell">{p.companyLocation}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusColor[p.companyStatus?.toUpperCase() || ""] ?? "bg-gray-50 border-gray-200 text-gray-500"}`}>
                            {p.companyStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <button onClick={() => openEdit(p)} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">Edit Profile</button>
                            {p.companyStatus === "APPROVED" ? (
                              <button onClick={() => openReq(p)} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Post Requirement</button>
                            ) : (
                              <span className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-400" title="Company must be approved before posting requirements">Post Requirement</span>
                            )}
                            <button onClick={() => navigate(`/employee-assigned-freelancers/${p.id}`)} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">Assigned Talent</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
