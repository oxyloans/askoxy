import React, { useState, useEffect } from "react";
import BASE_URL from "../Config";
import { freelanceApi } from "../utils/axiosInstances";
import StatusAlert from "./StatusAlert";
import { extractApiError } from "./apiUtils";
import { LoadingCenter, StatusBadge } from "./marketplaceUi";

interface AssignedFreelancer {
  budget: number;
  companyId: string;
  companyName: string;
  experience: string;
  freelacerId: string;
  freelacerName: string;
  freelacerResume: string;
  positions: number | null;
  requirementId: string | null;
  skillsName: string;
  status: string;
  titleName: string;
}

interface AssignedFreelancersProps {
  companyId: string;
  isMobileScreen: boolean;
}

const btnGhost =
  "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600";
const btnBlue =
  "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700";

const AssignedFreelancers: React.FC<AssignedFreelancersProps> = ({
  companyId,
}) => {
  const [assignedFreelancers, setAssignedFreelancers] = useState<
    AssignedFreelancer[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedFreelancers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await freelanceApi.get(
        `${BASE_URL}/user-service/getPartnerAssignedInformation?companyId=${companyId}`,
      );
      if (res.status === 200 && Array.isArray(res.data))
        setAssignedFreelancers(res.data);
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchAssignedFreelancers();
  }, [companyId]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Assigned Talent</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Freelancers currently assigned to this company
          </p>
        </div>
        <button
          onClick={fetchAssignedFreelancers}
          disabled={loading}
          className={btnGhost}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="px-4 pt-4 sm:px-6">
          <StatusAlert
            message={error}
            variant="error"
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {loading ? (
        <LoadingCenter tip="Loading assigned freelancers…" />
      ) : assignedFreelancers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <svg
              className="h-7 w-7 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-700">
            No Talent Assigned Yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Assign freelancers to this company from the Browse Talent page.
          </p>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-50 px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-500">
              {assignedFreelancers.length}{" "}
              {assignedFreelancers.length === 1
                ? "talent assigned"
                : "talents assigned"}
            </p>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="divide-y divide-gray-50 md:hidden">
            {assignedFreelancers.map((f, i) => (
              <div key={f.freelacerId ?? i} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                      {(f.freelacerName || "F").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {f.freelacerName}
                      </p>
                      <p className="text-xs text-gray-400">{f.titleName}</p>
                    </div>
                  </div>
                  <StatusBadge status={f.status} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-gray-400">Skills</p>
                    <p className="mt-0.5 font-medium text-gray-700">
                      {f.skillsName || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-gray-400">Experience</p>
                    <p className="mt-0.5 font-medium text-gray-700">
                      {f.experience ? `${f.experience} yrs` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-gray-400">Budget</p>
                    <p className="mt-0.5 font-medium text-gray-700">
                      ₹{(f.budget || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-gray-400">Company</p>
                    <p className="mt-0.5 font-medium text-gray-700">
                      {f.companyName || "—"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    f.freelacerResume &&
                    window.open(
                      f.freelacerResume,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  View Resume
                </button>
              </div>
            ))}
          </div>

          {/* ── Desktop table (≥ md) ── */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-gray-50 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "#",
                    "Freelancer",
                    "Job Title",
                    "Skills",
                    "Experience",
                    "Budget",
                    "Status",
                    "Resume",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                        h === "Skills" ? "hidden lg:table-cell" : ""
                      } ${h === "Experience" ? "hidden xl:table-cell" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {assignedFreelancers.map((f, i) => (
                  <tr
                    key={f.freelacerId ?? i}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-5 py-4 text-center text-gray-400">
                      {i + 1}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                          {(f.freelacerName || "F").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {f.freelacerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-semibold text-gray-900">
                      {f.titleName}
                    </td>
                    <td className="hidden px-5 py-4 text-center text-gray-500 lg:table-cell">
                      {f.skillsName || "—"}
                    </td>
                    <td className="hidden px-5 py-4 text-center text-gray-500 xl:table-cell">
                      {f.experience ? `${f.experience} yrs` : "—"}
                    </td>
                    <td className="px-5 py-4 text-center font-medium text-gray-700">
                      ₹{(f.budget || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() =>
                          window.open(
                            f.freelacerResume,
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                        className={btnBlue}
                      >
                        View Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignedFreelancers;
