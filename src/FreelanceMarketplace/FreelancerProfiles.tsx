import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import Swal from "sweetalert2";
import EmployeeLayout from "./EmployeeLayout";
import BASE_URL, { uploadurlwithId } from "../Config";
import { useParams } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import { decryptParam } from "../utils/urlEncryption";
import StatusAlert from "./StatusAlert";
import { extractApiError, extractResponseMessage } from "./apiUtils";
import { LoadingCenter, pageContainerClass } from "./marketplaceUi";

interface Freelancer {
  id: string | null;
  email: string;
  userId: string | null;
  userId1: string;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  openForFreeLancing: string;
  amountNegotiable: string;
  resumeUrl: string;
}

const FILTERS = [
  { value: "all",     label: "All Freelancers"     },
  { value: "budget",  label: "Budget  ≤ ₹100/hr"   },
  { value: "mid",     label: "Mid-Range ₹100–250/hr" },
  { value: "premium", label: "Premium  > ₹250/hr"   },
];

const FreelancerProfiles: React.FC = () => {
  const [freelancers, setFreelancers]     = useState<Freelancer[]>([]);
  const [loading, setLoading]             = useState(true);
  const [priceFilter, setPriceFilter]     = useState("all");
  const [assigning, setAssigning]         = useState(false);
  const [assigningId, setAssigningId]     = useState<string | null>(null);
  const [pageError, setPageError]         = useState<string | null>(null);
  const [assignFeedback, setAssignFeedback] = useState<{ text: string; variant: "success" | "error" } | null>(null);
  const [resumeModal, setResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  const { companyId: encCompany, requirementId: encReq } = useParams();
  const companyId     = decryptParam(encCompany  || "");
  const requirementId = decryptParam(encReq      || "");

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await freelanceApi.get<Freelancer[]>(`${BASE_URL}/ai-service/agent/getAllFreeLancers`);
      setFreelancers(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) { setPageError(extractApiError(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFreelancers(); }, []);

  const filtered = freelancers.filter((f) => {
    if (priceFilter === "budget")  return f.perHour <= 100;
    if (priceFilter === "mid")     return f.perHour > 100 && f.perHour <= 250;
    if (priceFilter === "premium") return f.perHour > 250;
    return true;
  });

  const handleViewResume = (url: string) => {
    if (!url) { Swal.fire({ icon: "warning", title: "Not Available", text: "Resume not available.", timer: 1800, showConfirmButton: false, toast: true, position: "top-end" }); return; }
    const fullUrl = `${uploadurlwithId}${url}`;
    setResumeUrl("");
    setResumeLoading(true);
    setResumeModal(true);
    setTimeout(() => { setResumeUrl(fullUrl); }, 50);
  };

  const handleAssign = async (f: Freelancer) => {
    if (!companyId || !requirementId || !f.userId1) {
      setAssignFeedback({ text: "Missing required information.", variant: "error" });
      return;
    }
    try {
      setAssigning(true);
      setAssigningId(f.userId1);
      setAssignFeedback(null);
      const res = await freelanceApi.post(`${BASE_URL}/user-service/partnerAssignedFreelancer`, {
        companyId, id: requirementId, freelancerId: f.userId1,
      });
      if (res.status === 200 || res.status === 201) {
        const msg = extractResponseMessage(res.data) || "Freelancer assigned successfully.";
        setAssignFeedback({ text: msg, variant: "success" });
        Swal.fire({ icon: "success", title: "Assigned!", text: msg, timer: 1800, showConfirmButton: false, toast: true, position: "top-end" });
      } else {
        setAssignFeedback({ text: extractResponseMessage(res.data) || "Could not assign.", variant: "error" });
      }
    } catch (err: unknown) { setAssignFeedback({ text: extractApiError(err), variant: "error" }); }
    finally { setAssigning(false); setAssigningId(null); }
  };

  if (loading) return <EmployeeLayout><LoadingCenter tip="Loading freelancers…" /></EmployeeLayout>;

  return (
    <EmployeeLayout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className={pageContainerClass}>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Browse Freelance Talent</h1>
            <p className="mt-0.5 text-sm text-gray-500">Discover skilled freelancers and assign them to your open requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            >
              {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <span className="whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              {filtered.length} freelancer{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {pageError    && <StatusAlert message={pageError}            variant="error"   onDismiss={() => setPageError(null)}      className="mb-5" />}
        {assignFeedback && <StatusAlert message={assignFeedback.text} variant={assignFeedback.variant} onDismiss={() => setAssignFeedback(null)} className="mb-5" />}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
              <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-700">No Freelancers Found</p>
            <p className="mt-1 text-sm text-gray-400">Try a different rate filter or check back later</p>
            {freelancers.length > 0 && (
              <button onClick={() => setPriceFilter("all")} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Show All Freelancers
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((f) => (
              <div key={f.userId1} className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                {/* Card top */}
                <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {(f.email || "F").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="max-w-[130px] truncate text-sm font-semibold text-gray-800">{f.email}</p>
                      <p className="text-[10px] text-gray-400">Independent Contractor</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    Open to Work
                  </span>
                </div>

                {/* Pricing */}
                <div className="px-5 py-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Rate Card</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Per Hour",  value: f.perHour  },
                      { label: "Per Day",   value: f.perDay   },
                      { label: "Per Week",  value: f.perWeek  },
                      { label: "Per Month", value: f.perMonth },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-sm font-bold text-indigo-600">₹{(value || 0).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negotiable */}
                <div className="mx-5 mb-4 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5">
                  <span className="text-xs text-gray-500">Open to Negotiation</span>
                  <span className={`text-xs font-bold ${f.amountNegotiable === "YES" ? "text-emerald-600" : "text-red-500"}`}>
                    {f.amountNegotiable === "YES" ? "Yes" : "No"}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2 border-t border-gray-50 px-5 py-4">
                  <button
                    onClick={() => handleViewResume(f.resumeUrl)}
                    className="flex-1 rounded-lg border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    📄 View Resume
                  </button>
                  {companyId && requirementId && (
                    <button
                      disabled={assigning && assigningId === f.userId1}
                      onClick={() => handleAssign(f)}
                      className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {assigning && assigningId === f.userId1 ? "Assigning…" : "Assign to Role"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        title="📄 Resume Preview"
        open={resumeModal}
        onCancel={() => { setResumeModal(false); setResumeUrl(""); setResumeLoading(false); }}
        footer={[
          <Button key="close" type="primary" onClick={() => { setResumeModal(false); setResumeUrl(""); setResumeLoading(false); }}>Close</Button>,
        ]}
        width={860}
        styles={{ body: { padding: 0, height: "75vh", position: "relative" } }}
        centered
        destroyOnClose
      >
        {resumeLoading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", zIndex: 10 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTop: "4px solid #4f46e5", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />
              <span style={{ fontSize: 13, color: "#6b7280" }}>Loading resume…</span>
            </div>
          </div>
        )}
        {resumeUrl && (
          <iframe
            key={resumeUrl}
            src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
            title="Resume"
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "70vh", display: "block" }}
            onLoad={() => setResumeLoading(false)}
          />
        )}
      </Modal>
    </EmployeeLayout>
  );
};

export default FreelancerProfiles;
