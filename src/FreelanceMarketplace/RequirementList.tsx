import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import { encryptParam } from "../utils/urlEncryption";
import BASE_URL from "../Config";
import { message } from "antd";
import EmployeeLayout from "./EmployeeLayout";
import StatusAlert from "./StatusAlert";
import { extractApiError, extractResponseMessage } from "./apiUtils";
import { LoadingCenter, StatusBadge, pageContainerClass } from "./marketplaceUi";

interface Requirement {
  id: string;
  companyId: string | null;
  title: string;
  skillName: string;
  experience: string;
  budget: number;
  status: string;
  positions: number;
  companyName: string;
}

const inp = "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50";
const lbl = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400";
const btnBlue  = "rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50";
const btnGhost = "rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600";

const STATUS_OPTIONS = ["OPEN", "CLOSED", "ON_HOLD"];

const RequirementList: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [form, setForm] = useState({ title: "", skillName: "", experience: "", budget: "", positions: "", status: "OPEN" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await freelanceApi.get(
        `${BASE_URL}/user-service/showingCompanyRequirementBasedOnUserId?userId=${userId}`
      );
      if (res.status === 200) {
        const flat = res.data.flatMap((c: { companyName: string; list?: Requirement[] }) =>
          (c.list || []).map((r) => ({ ...r, companyName: c.companyName }))
        );
        setRequirements(flat);
      }
    } catch (err: unknown) { setPageError(extractApiError(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequirements(); }, []);

  const openEdit = (r: Requirement) => {
    setEditingReq(r);
    setForm({ title: r.title, skillName: r.skillName, experience: r.experience, budget: String(r.budget), positions: String(r.positions), status: r.status });
    setFormError(null);
    setFormSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeEdit = () => { setEditingReq(null); setFormError(null); setFormSuccess(null); };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReq?.id) return;
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    try {
      setSubmitting(true);
      setFormError(null);
      const res = await freelanceApi.patch(`${BASE_URL}/user-service/companyRequirement`, {
        id: editingReq.id,
        budget: Number(form.budget),
        experience: form.experience,
        positions: Number(form.positions),
        skillName: form.skillName,
        status: form.status,
        title: form.title,
      });
      if (res.status === 200 || res.status === 201) {
        const msg = extractResponseMessage(res.data);
        setFormSuccess(msg || "Updated successfully.");
        if (msg) message.success(msg);
        fetchRequirements();
        setTimeout(closeEdit, 1200);
      } else {
        setFormError(extractResponseMessage(res.data) || "Could not update.");
      }
    } catch (err: unknown) { setFormError(extractApiError(err)); }
    finally { setSubmitting(false); }
  };

  const handleViewFreelancers = (r: Requirement) =>
    navigate(`/employee-freelancers/${encryptParam(r.companyId || "")}/${encryptParam(r.id)}`);

  return (
    <EmployeeLayout>
      <div className={pageContainerClass}>

        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Job Requirements</h1>
            <p className="mt-0.5 text-sm text-gray-500">View, manage and update all open hiring requirements across your companies</p>
          </div>
          <button onClick={fetchRequirements} disabled={loading} className={btnGhost}>
            {loading ? "Refreshing…" : "Refresh List"}
          </button>
        </div>

        {pageError && <StatusAlert message={pageError} variant="error" onDismiss={() => setPageError(null)} className="mb-5" />}

        {/* ── Inline Edit Panel ── */}
        {editingReq && (
          <div className="mb-6 rounded-xl border border-indigo-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">Update Job Requirement</h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Company: <span className="font-semibold text-indigo-600">{editingReq.companyName}</span>
                </p>
              </div>
              <button onClick={closeEdit} className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                Cancel
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              {formError   && <StatusAlert message={formError}   variant="error"   onDismiss={() => setFormError(null)}   className="mb-4" />}
              {formSuccess && <StatusAlert message={formSuccess} variant="success" onDismiss={() => setFormSuccess(null)} className="mb-4" />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={lbl}>Job Title / Role</label>
                  <input className={inp} placeholder="e.g. Lead Product Designer" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Required Skills</label>
                  <input className={inp} placeholder="e.g. React, Figma, Node.js" value={form.skillName} onChange={(e) => setForm((f) => ({ ...f, skillName: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Years of Experience</label>
                  <input className={inp} placeholder="e.g. 4+ Years" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Monthly Budget (₹)</label>
                  <input className={inp} type="number" placeholder="e.g. 80000" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Number of Openings</label>
                  <input className={inp} type="number" placeholder="e.g. 3" value={form.positions} onChange={(e) => setForm((f) => ({ ...f, positions: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Requirement Status</label>
                  <select
                    className={inp}
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button type="submit" disabled={submitting} className={btnBlue}>
                  {submitting ? "Updating…" : "Update Requirement"}
                </button>
                <button type="button" onClick={closeEdit} className={btnGhost}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <LoadingCenter tip="Loading requirements…" />
          ) : requirements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700">No Job Requirements Found</p>
              <p className="mt-1 text-sm text-gray-400">Go to My Companies and post your first job requirement to start hiring</p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 px-6 py-4">
                <p className="text-sm font-semibold text-gray-700">{requirements.length} {requirements.length === 1 ? "Active Requirement" : "Active Requirements"}</p>
              </div>
              {/* Mobile cards */}
              <div className="divide-y divide-gray-50 sm:hidden">
                {requirements.map((r) => (
                  <div key={r.id} className={`p-4 ${editingReq?.id === r.id ? "bg-indigo-50/40" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{r.title}</p>
                        <p className="mt-0.5 text-xs font-medium text-indigo-600">{r.companyName}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-gray-400">Budget</p>
                        <p className="mt-0.5 font-semibold text-gray-700">₹{(r.budget || 0).toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-gray-400">Positions</p>
                        <p className="mt-0.5 font-semibold text-gray-700">{r.positions || "—"}</p>
                      </div>
                    </div>
                    {r.skillName && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {r.skillName.split(",").map((s) => (
                          <span key={s.trim()} className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => openEdit(r)} className="flex-1 rounded-lg bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">Edit</button>
                      <button onClick={() => handleViewFreelancers(r)} className="flex-1 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Browse Talent</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="min-w-full divide-y divide-gray-50 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Title", "Company", "Skills", "Budget", "Status", "Actions"].map((h) => (
                        <th key={h} className={`px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400
                          ${h === "Company" ? "hidden md:table-cell" : ""}
                          ${h === "Skills"  ? "hidden lg:table-cell" : ""}
                          ${h === "Budget"  ? "hidden sm:table-cell" : ""}
                          ${h === "Title"   ? "text-center" : ""}
                        `}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {requirements.map((r, i) => (
                      <tr key={r.id} className={`transition hover:bg-gray-50/80 ${editingReq?.id === r.id ? "bg-indigo-50/40" : ""}`}>
                        <td className="px-5 py-4 text-center text-gray-400">{i + 1}</td>
                        <td className="px-5 py-4 text-center">
                          <p className="font-semibold text-gray-900">{r.title}</p>
                          <p className="mt-0.5 text-xs text-gray-400 md:hidden">{r.companyName}</p>
                          <p className="mt-0.5 text-xs text-gray-400 sm:hidden">₹{(r.budget || 0).toLocaleString()}</p>
                        </td>
                        <td className="hidden px-5 py-4 text-center font-medium text-indigo-600 md:table-cell">{r.companyName}</td>
                        <td className="hidden px-5 py-4 text-center lg:table-cell">
                          <div className="flex flex-wrap justify-center gap-1">
                            {(r.skillName || "").split(",").map((s) => (
                              <span key={s.trim()} className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="hidden px-5 py-4 text-center font-medium text-gray-700 sm:table-cell">
                          ₹{(r.budget || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <button onClick={() => openEdit(r)} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">
                              Edit
                            </button>
                            <button onClick={() => handleViewFreelancers(r)} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                              Browse Talent
                            </button>
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

export default RequirementList;
