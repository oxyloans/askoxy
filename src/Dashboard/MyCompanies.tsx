import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
import Footer from "../components/Footer";

const USER_ID_STORAGE_KEY = "userId";

interface Company {
    id: string;
    companyName: string;
    companyDescription: string;
    locations: string;
    websiteUrl: string;
    linkedinUrl: string;
    logoUrl: string;
    type: string;
    userId: string;
    gstNumber: string;
    gstDocumentUrl: string;
    createdAt: number | string;
    updatedAt: number | string;
    status: boolean;
}

interface CompaniesResponse {
    data?: Company[];
    message?: string;
    status?: boolean;
}

const formatDate = (value: number | string) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const hasValue = (value?: string | null) => {
    const normalized = value?.trim().toLowerCase();
    return Boolean(normalized && normalized !== "null" && normalized !== "undefined");
};

const MyCompanies: React.FC = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedGstDocument, setSelectedGstDocument] = useState<{
        url: string;
        companyName: string;
    } | null>(null);

    useEffect(() => {
        if (!selectedGstDocument) return undefined;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelectedGstDocument(null);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [selectedGstDocument]);

    useEffect(() => {
        const userId = localStorage.getItem(USER_ID_STORAGE_KEY) || "";
        if (!userId) {
            setError("User not found. Please log in again.");
            setLoading(false);
            return;
        }

        customerApi
            .get<CompaniesResponse>(
                `${BASE_URL}/marketing-service/campgin/companies-by-userId/${encodeURIComponent(userId)}`,
            )
            .then((response) => {
                const payload = response.data;
                if (payload?.status === false) {
                    throw new Error(payload.message || "Unable to load companies.");
                }
                setCompanies(Array.isArray(payload?.data) ? payload.data : []);
            })
            .catch((requestError) => {
                setError(requestError instanceof Error ? requestError.message : "Unable to load companies.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white px-3 pb-20 pt-5 sm:px-5 sm:pt-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">My Companies</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {loading ? "Loading your companies..." : `${companies.length} compan${companies.length === 1 ? "y" : "ies"} available`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/main/dashboard/addproduct-service?tab=COMPANY")}
                        className="w-full rounded-lg bg-purple-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-100 sm:w-auto"
                    >
                        + Add Company
                    </button>
                </div>

                {error && <div className="rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700 shadow-sm">{error}</div>}

                {loading && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Loading companies">
                        {[1, 2].map((item) => (
                            <div key={item} className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-gray-100" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-gray-100" />
                                        <div className="h-3 w-1/2 rounded bg-gray-100" />
                                    </div>
                                </div>
                                <div className="mt-5 space-y-2">
                                    <div className="h-3 w-full rounded bg-gray-100" />
                                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && companies.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
                        <h2 className="text-lg font-bold text-slate-800">No companies yet</h2>
                        <p className="mt-1 text-sm text-gray-500">Add your company details to get started.</p>
                    </div>
                )}

                {!loading && !error && <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {companies.map((company) => (
                        <article key={company.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg">
                            <div className="flex items-start gap-3 border-b border-slate-100 p-4 sm:gap-4 sm:p-5">
                                {hasValue(company.logoUrl) && (
                                    <img src={company.logoUrl.trim()} alt={`${company.companyName} logo`} className="h-14 w-14 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1 sm:h-16 sm:w-16" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="break-words text-lg font-bold text-slate-900">{company.companyName}</h2>
                                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${company.status ? "border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-500"}`}>
                                            {company.status ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    {hasValue(company.locations) && (
                                        <p className="mt-1 break-words text-sm text-slate-500">{company.locations.trim()}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 p-4 text-sm sm:p-5">
                                <p className="line-clamp-3 leading-6 text-slate-600">{company.companyDescription || "No description provided."}</p>
                                <div className="grid grid-cols-1 gap-2 text-slate-600 sm:grid-cols-2">
                                    <p><strong className="text-slate-800">GST:</strong> {company.gstNumber || "-"}</p>
                                    <p><strong className="text-slate-800">Updated:</strong> {formatDate(company.updatedAt)}</p>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/main/dashboard/addproduct-service?tab=COMPANY&companyId=${encodeURIComponent(company.id)}`)}
                                        className="rounded-md border border-purple-200 bg-white px-3 py-1.5 font-semibold text-purple-700 transition hover:bg-gray-50"
                                    >
                                        ✏️ Edit
                                    </button>
                                    {hasValue(company.websiteUrl) && <a href={company.websiteUrl.trim()} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-purple-700">Website</a>}
                                    {hasValue(company.linkedinUrl) && <a href={company.linkedinUrl.trim()} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-purple-700">LinkedIn</a>}
                                    {hasValue(company.gstDocumentUrl) && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedGstDocument({ url: company.gstDocumentUrl.trim(), companyName: company.companyName })}
                                            className="rounded-md px-2 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-purple-700"
                                        >
                                            GST document
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>}
            </div>

            {selectedGstDocument && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gst-document-title"
                    onClick={() => setSelectedGstDocument(null)}
                >
                    <div
                        className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[88vh]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-700">Company document</p>
                                <h2 id="gst-document-title" className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                    GST document · {selectedGstDocument.companyName}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedGstDocument(null)}
                                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-100"
                                aria-label="Close GST document viewer"
                            >
                                Close
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 bg-white p-2 sm:p-3">
                            <iframe
                                src={selectedGstDocument.url}
                                title={`GST document for ${selectedGstDocument.companyName}`}
                                loading="lazy"
                                allowFullScreen
                                className="h-full w-full rounded-lg border border-slate-200 bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <span>If the document does not load, open it directly.</span>
                            <a
                                href={selectedGstDocument.url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-purple-700 hover:text-purple-800"
                            >
                                Open in new tab
                            </a>
                        </div>
                    </div>
                </div>
            )}
              <Footer />
        </div>
    );
};

export default MyCompanies;
