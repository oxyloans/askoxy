import React, { useState, useEffect } from "react";
import BASE_URL from "../Config";

interface BorrowerChatSession {
  bfSessionId: string;
  bfStage: string;
  bfBorrowerName?: string;
  bfPhoneNumber?: string;
  bfRequestedLoanAmount?: number;
  bfEmploymentType?: string;
  bfRiskBucket?: string;
  bfCreatedAt?: string;
  bfUpdatedAt?: string;
  bfChatType?: string;
  bfCompanyName?: string;
  bfMonthlySalary?: number;
  bfSalaryCreditBank?: string;
}

interface BorrowerChatMessage {
  bfSessionId: string;
  bfRole: "USER" | "ASSISTANT" | "SYSTEM";
  bfContent: string;
  bfCreatedAt?: string;
}

interface BorrowerLoanDocument {
  bfDocId?: number;
  bfSessionId: string;
  bfDocType: string;
  bfRawContent?: string;
  bfExtractedJson?: string;
  bfProcessingStatus?: string;
  bfS3Url?: string;
  bfUploadedAt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const riskColors: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

const stageColors: Record<string, string> = {
  FRESH: "bg-slate-100 text-slate-600",
  AWAITING_INCOME_PROOF: "bg-blue-100 text-blue-700",
  AWAITING_PAYSLIP: "bg-blue-100 text-blue-700",
  AWAITING_BANK_STATEMENT: "bg-purple-100 text-purple-700",
  AWAITING_ID_PROOF: "bg-orange-100 text-orange-700",
  PROCESSED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const docStatusColors: Record<string, string> = {
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-600",
};

function formatDate(dt?: string) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dt;
  }
}

function formatAmount(amt?: number) {
  if (amt == null) return "—";
  return "₹" + amt.toLocaleString("en-IN");
}

function fmtDocType(t: string) {
  return t.replaceAll("_", " ");
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState<BorrowerChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BorrowerChatMessage[]>([]);
  const [documents, setDocuments] = useState<BorrowerLoanDocument[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [chatTypeFilter, setChatTypeFilter] = useState<"GENERIC" | "SALARIED">("GENERIC");
  const [search, setSearch] = useState("");
  // mobile: track whether the detail pane is shown (true) or list (false)
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [chatTypeFilter]);

  // ── API: GET /admin/sessions ───────────────────────────────────────────────
  const loadSessions = async (type = chatTypeFilter) => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`${BASE_URL}/vibecode-service/borrower/admin/sessions?chatType=${type}`);
      const data: BorrowerChatSession[] = await res.json();
      // Newest first
      data.sort(
        (a, b) =>
          new Date(b.bfCreatedAt ?? 0).getTime() -
          new Date(a.bfCreatedAt ?? 0).getTime()
      );
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // ── API: GET /admin/sessions/{id}/messages + /documents ───────────────────
  const loadSessionDetail = async (id: string) => {
    setSelectedId(id);
    setShowDetail(true); // mobile: switch to detail view
    setLoadingDetail(true);
    try {
      const [msgRes, docRes] = await Promise.all([
        fetch(`${BASE_URL}/vibecode-service/borrower/admin/sessions/${encodeURIComponent(id)}/messages`),
        fetch(`${BASE_URL}/vibecode-service/borrower/admin/sessions/${encodeURIComponent(id)}/documents`),
      ]);
      const msgData: BorrowerChatMessage[] = await msgRes.json();
      const docData: BorrowerLoanDocument[] = await docRes.json();
      // Filter out SYSTEM messages — they contain internal AI prior-session context, not for admin view
      setMessages(msgData.filter((m) => m.bfRole !== "SYSTEM"));
      setDocuments(docData);
    } catch {
      setMessages([]);
      setDocuments([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Filtering (name, phone, stage, employment) ────────────────────────────
  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.bfSessionId.toLowerCase().includes(q) ||
      (s.bfBorrowerName ?? "").toLowerCase().includes(q) ||
      (s.bfPhoneNumber ?? "").includes(q) ||
      s.bfStage.toLowerCase().includes(q) ||
      (s.bfEmploymentType ?? "").toLowerCase().includes(q)
    );
  });

  const selectedSession = sessions.find((s) => s.bfSessionId === selectedId);

  // ── Quick stats ────────────────────────────────────────────────────────────
  const total = sessions.length;
  const processed = sessions.filter(
    (s) => s.bfStage === "PROCESSED" || s.bfStage === "CLOSED"
  ).length;
  const active = sessions.filter(
    (s) =>
      s.bfStage !== "PROCESSED" &&
      s.bfStage !== "CLOSED" &&
      s.bfStage !== "FRESH"
  ).length;
  const highRisk = sessions.filter((s) => s.bfRiskBucket === "HIGH").length;

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen w-full bg-[#f5f4f0] font-sans text-[#1f2430]">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 bg-[#1c2b45] shadow-sm shrink-0">
        <div>
          <span className="text-white text-[14px] md:text-[15px] font-bold tracking-tight">OxyLoans</span>
          <span className="ml-2 text-[#c39a4b] text-[12px] md:text-[13px] font-semibold">Admin Dashboard</span>
        </div>
        {/* Stats — hidden on mobile, shown inline on desktop */}
        <div className="hidden md:flex gap-6">
          {[
            { label: "Total Sessions", value: total, color: "text-white" },
            { label: "In Progress", value: active, color: "text-blue-300" },
            { label: "Processed", value: processed, color: "text-emerald-400" },
            { label: "High Risk", value: highRisk, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-[17px] font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => loadSessions()}
          className="text-[12px] bg-[#c39a4b]/20 hover:bg-[#c39a4b]/40 text-[#c39a4b] px-2.5 md:px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Mobile stats strip */}
      <div className="md:hidden flex items-center justify-around bg-[#162236] px-4 py-2 shrink-0">
        {[
          { label: "Total", value: total, color: "text-white" },
          { label: "Active", value: active, color: "text-blue-300" },
          { label: "Done", value: processed, color: "text-emerald-400" },
          { label: "High Risk", value: highRisk, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-[15px] font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 min-h-0">

        {/* ── Session list: full width on mobile (hidden when detail shown), fixed 320px on desktop ── */}
        <div className={`${
          showDetail ? "hidden md:flex" : "flex"
        } w-full md:w-[320px] md:min-w-[320px] flex-col bg-[#f0ede5] border-r border-[#e2ddd2]`}>
          <div className="px-4 pt-4 pb-2 shrink-0">
            {/* Chat Type Filter Tabs */}
            <div className="flex bg-[#e2ddd2] p-1 rounded-xl mb-3">
              <button
                onClick={() => setChatTypeFilter("GENERIC")}
                className={`flex-1 text-[12px] font-semibold py-1.5 rounded-lg transition-all text-center ${
                  chatTypeFilter === "GENERIC"
                    ? "bg-white text-[#1c2b45] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                💬 Generic
              </button>
              <button
                onClick={() => setChatTypeFilter("SALARIED")}
                className={`flex-1 text-[12px] font-semibold py-1.5 rounded-lg transition-all text-center ${
                  chatTypeFilter === "SALARIED"
                    ? "bg-[#1c2b45] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                💼 Salaried
              </button>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, stage…"
              className="w-full text-[12.5px] border border-[#ddd8cc] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#c39a4b] placeholder-slate-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {loadingSessions ? (
              <div className="px-4 py-6 text-[13px] text-slate-400">Loading sessions…</div>
            ) : filteredSessions.length === 0 ? (
              <div className="px-4 py-6 text-[13px] text-slate-400">No sessions found.</div>
            ) : (
              filteredSessions.map((s) => (
                <div
                  key={s.bfSessionId}
                  onClick={() => loadSessionDetail(s.bfSessionId)}
                  className={`mx-1 mb-1.5 px-3 py-2.5 rounded-lg cursor-pointer border transition-all ${
                    selectedId === s.bfSessionId
                      ? "bg-white border-[#c39a4b] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/70"
                  }`}
                >
                  {/* Name + Risk */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[#1f2430] truncate">
                      {s.bfBorrowerName || "Unnamed borrower"}
                    </span>
                    {s.bfRiskBucket && (
                      <span
                        className={`shrink-0 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${
                          riskColors[s.bfRiskBucket] ?? "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {s.bfRiskBucket}
                      </span>
                    )}
                  </div>
                  {/* Phone + Loan Amount */}
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-slate-500">
                      {s.bfPhoneNumber ? `📞 ${s.bfPhoneNumber}` : "No phone yet"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {s.bfRequestedLoanAmount != null ? formatAmount(s.bfRequestedLoanAmount) : ""}
                    </span>
                  </div>
                  {/* Stage + Employment chips */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span
                      className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${
                        stageColors[s.bfStage] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {s.bfStage.replaceAll("_", " ")}
                    </span>
                    {s.bfEmploymentType && (
                      <span className="text-[9.5px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">
                        {s.bfEmploymentType.replaceAll("_", " ")}
                      </span>
                    )}
                  </div>
                  {/* Date */}
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDate(s.bfCreatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Detail pane: full width on mobile, flex-1 on desktop ── */}
        <div className={`${
          showDetail ? "flex" : "hidden md:flex"
        } flex-1 flex-col min-w-0 bg-white`}>
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="text-[40px]">🏦</div>
              <div className="text-[14px]">Select a session to view transcript and documents</div>
            </div>
          ) : (
            <>
              {/* Session header */}
              <div className="shrink-0 px-4 md:px-6 py-3 border-b border-[#ece7db] bg-[#faf8f3]">
                {/* Mobile back button */}
                <button
                  onClick={() => setShowDetail(false)}
                  className="md:hidden flex items-center gap-1 text-[12px] text-[#c39a4b] font-medium mb-2"
                >
                  ← Back to sessions
                </button>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[16px] font-bold text-[#1f2430]">
                      {selectedSession?.bfBorrowerName || "Unnamed borrower"}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 text-[12px] text-slate-500">
                      {selectedSession?.bfPhoneNumber && (
                        <span>📞 {selectedSession.bfPhoneNumber}</span>
                      )}
                      {selectedSession?.bfRequestedLoanAmount != null && (
                        <span>💰 {formatAmount(selectedSession.bfRequestedLoanAmount)}</span>
                      )}
                      {selectedSession?.bfEmploymentType && (
                        <span>💼 {selectedSession.bfEmploymentType.replaceAll("_", " ")}</span>
                      )}
                      {selectedSession?.bfCompanyName && (
                        <span>🏢 {selectedSession.bfCompanyName}</span>
                      )}
                      {selectedSession?.bfMonthlySalary != null && (
                        <span>💵 Salary: {formatAmount(selectedSession.bfMonthlySalary)}/mo</span>
                      )}
                      {selectedSession?.bfSalaryCreditBank && (
                        <span>🏦 Bank: {selectedSession.bfSalaryCreditBank}</span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">{selectedId}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedSession?.bfRiskBucket && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          riskColors[selectedSession.bfRiskBucket] ?? "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {selectedSession.bfRiskBucket} RISK
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        stageColors[selectedSession?.bfStage ?? ""] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {selectedSession?.bfStage?.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-1 text-[10.5px] text-slate-400">
                  <span>Created: {formatDate(selectedSession?.bfCreatedAt)}</span>
                  <span>Updated: {formatDate(selectedSession?.bfUpdatedAt)}</span>
                </div>
              </div>

              {loadingDetail ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-[14px]">
                  Loading session details…
                </div>
              ) : (
                <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3">

                  {/* Chat transcript: full width on mobile, 2/3 on desktop */}
                  <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-[#ece7db] flex flex-col min-h-0" style={{ minHeight: showDetail ? '50vh' : undefined }}>
                    <div className="shrink-0 px-5 pt-3 pb-2 border-b border-[#f0ede5]">
                      <span className="text-[10.5px] font-semibold tracking-widest uppercase text-slate-400">
                        Chat Transcript
                      </span>
                      <span className="ml-2 text-[10.5px] text-slate-400">({messages.length} messages)</span>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-[13px] text-slate-400">No messages recorded.</div>
                      ) : (
                        messages.map((m, i) => (
                          <div
                            key={i}
                            className={`flex gap-2.5 ${m.bfRole === "USER" ? "flex-row-reverse" : ""}`}
                          >
                            <div
                              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                m.bfRole === "USER"
                                  ? "bg-[#1c2b45]"
                                  : "bg-gradient-to-br from-[#c39a4b] to-[#a97e2f]"
                              }`}
                            >
                              {m.bfRole === "USER" ? "B" : "AI"}
                            </div>
                            <div
                              className={`px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed max-w-[72%] whitespace-pre-wrap break-words ${
                                m.bfRole === "USER"
                                  ? "bg-[#1c2b45] text-white rounded-tr-[4px]"
                                  : "bg-[#faf8f3] text-[#1f2430] border border-[#ece7db] rounded-tl-[4px]"
                              }`}
                            >
                              {m.bfContent}
                              {m.bfCreatedAt && (
                                <div className={`text-[9.5px] mt-1 ${m.bfRole === "USER" ? "text-blue-200" : "text-slate-400"}`}>
                                  {formatDate(m.bfCreatedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Documents: full width on mobile, 1/3 on desktop */}
                  <div className="md:col-span-1 flex flex-col min-h-0 bg-[#faf8f3]">
                    <div className="shrink-0 px-4 pt-3 pb-2 border-b border-[#f0ede5]">
                      <span className="text-[10.5px] font-semibold tracking-widest uppercase text-slate-400">
                        Uploaded Documents
                      </span>
                      <span className="ml-2 text-[10.5px] text-slate-400">({documents.length})</span>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                      {documents.length === 0 ? (
                        <div className="text-[13px] text-slate-400">No documents uploaded.</div>
                      ) : (
                        documents.map((d, i) => (
                          <div
                            key={i}
                            className="bg-white border border-[#ece7db] rounded-xl px-3.5 py-3 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-[12.5px] font-semibold text-[#1c2b45]">
                                📄 {fmtDocType(d.bfDocType)}
                              </span>
                              {d.bfProcessingStatus && (
                                <span
                                  className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                    docStatusColors[d.bfProcessingStatus] ?? "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {d.bfProcessingStatus}
                                </span>
                              )}
                            </div>
                            {d.bfUploadedAt && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {formatDate(d.bfUploadedAt)}
                              </div>
                            )}
                            {d.bfS3Url && (
                              <div className="mt-2 text-[12px]">
                                <a
                                  href={d.bfS3Url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#204fd2] hover:underline font-semibold flex items-center gap-1"
                                >
                                  🔗 View Document
                                </a>
                              </div>
                            )}
                            {d.bfExtractedJson && (
                              <pre className="text-[10.5px] text-[#5a6072] mt-2 whitespace-pre-wrap break-words font-mono bg-[#f3efe4] rounded-lg p-2 max-h-44 overflow-y-auto border border-[#e7e1d2]">
                                {(() => {
                                  try {
                                    return JSON.stringify(JSON.parse(d.bfExtractedJson), null, 2);
                                  } catch {
                                    return d.bfExtractedJson;
                                  }
                                })()}
                              </pre>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
