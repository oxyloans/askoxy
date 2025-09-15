// src/AgentStore/AllAgentsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import { message, Select } from "antd";

/** -------- Auth helpers -------- */
function getAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("AUTH_TOKEN") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    null
  );
}

function authHeadersBase(): Record<string, string> {
  const token = getAccessToken();
  const h: Record<string, string> = { Accept: "*/*" };
  if (token && token !== "undefined" && token !== "null") {
    h.Authorization = `Bearer ${token}`;
  }
  return h;
}

/**
 * fetch wrapper: injects Authorization, never sets Content-Type for FormData,
 * sets JSON content-type when needed, and uses sane defaults.
 */
async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const base = authHeadersBase();

  const incoming =
    (init.headers &&
      (init.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : Array.isArray(init.headers)
        ? Object.fromEntries(init.headers)
        : (init.headers as Record<string, string>))) ||
    {};

  const isFormData = init.body instanceof FormData;
  const shouldSetJson =
    !isFormData &&
    !!init.body &&
    !("Content-Type" in incoming) &&
    !("content-type" in incoming);

  const headers: Record<string, string> = {
    ...base,
    ...incoming,
    ...(shouldSetJson ? { "Content-Type": "application/json" } : {}),
  };

  return fetch(input, {
    mode: "cors",
    cache: "no-store",
    ...init,
    headers,
  });
}

/** -------- User helpers -------- */
function getUserId(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("USER_ID") ||
    ""
  );
}

/** -------- Types (match your API) -------- */
type Assistant = {
  id: string;
  status: string | null;
  agentStatus: string | null;
  assistantId: string | null;
  userId: string;
  created_at: string | null;
  updatedAt: string | null;
  agentName: string | null;
  voiceStatus: boolean | null;
  activeStatus: boolean | null;
  userRole: string | null;
  userExperience: number | null;
  userExperienceSummary: string | null;
  domain: string | null;
  subDomain: string | null;
  targetUser: string | null;
  mainProblemSolved: string | null;
  description: string | null;
  acheivements: string | null;
  instructions: string | null;
  usageModel: string | null;
  language: string | null;
  business: string | null;
  responseFormat: string | null;
  freeTrial: number | null;
  tool: string | null;
  name: string | null;
  profileImagePath: string | null;
  ageLimit: string | null;
  gender: string | null;
  uniqueSolution: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  converstionTone: string | null;
  contactDetails: string | null;
};

type Conversation = {
  id: string;
  userId: string;
  agentId: string;
  conStarter1: string;
  conStarter2: string;
  conStarter3: string;
  conStarter4: string;
  rateThisPlatform: number;
  shareYourFeedback: string;
  createdAt: string;
};

type AllAgentDataResponse = {
  userId: string;
  assistants: Assistant[];
  conversations: Conversation[];
};

type EditDraft = Partial<
  Pick<
    Assistant,
    | "agentName"
    | "description"
    | "status"
    | "agentStatus"
    | "activeStatus"
    | "voiceStatus"
    | "domain"
    | "subDomain"
    | "targetUser"
    | "usageModel"
    | "responseFormat"
    | "converstionTone"
  >
>;

/** -------- Main Page -------- */
const AllAgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AllAgentDataResponse | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [editMap, setEditMap] = useState<Record<string, EditDraft>>({});
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const resolvedUserId = useMemo(() => {
    const id = getUserId();
    return id && id !== "null" && id !== "undefined" ? id : "";
  }, []);

  useEffect(() => {
    (async () => {
      const uid =
        resolvedUserId ||
        localStorage.getItem("userId") ||
        (() => {
          try {
            const u = JSON.parse(localStorage.getItem("user") || "null");
            return u?.id || u?.userId || null;
          } catch {
            return null;
          }
        })();

      if (!uid) {
        setError("Missing userId. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = new URL("/api/ai-service/agent/allAgentDataList", BASE_URL);
        url.searchParams.set("userId", uid);

        const res = await authFetch(url.toString(), { method: "GET" });
        const text = await res.text().catch(() => "");
        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          if (text) msg += `: ${text}`;
          throw new Error(msg);
        }

        const json = text ? JSON.parse(text) : {};
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load agents.");
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedUserId]);

  const conversationsByAgent = React.useMemo(() => {
    const map: Record<string, Conversation[]> = {};
    (data?.conversations || []).forEach((c) => {
      if (!map[c.agentId]) map[c.agentId] = [];
      map[c.agentId].push(c);
    });
    return map;
  }, [data]);

  const openUpdateWizard = (a: Assistant) => {
    navigate("/create-aiagent", {
      state: {
        mode: "edit",
        seed: a,
      },
    });
  };
  const filteredAssistants = useMemo(() => {
    if (!data) return [];
    return data.assistants.filter(
      (a) => filterStatus === "All" || a.status === filterStatus
    );
  }, [data, filterStatus]);
  const onChangeDraft = (id: string, patch: EditDraft) => {
    setEditMap((m) => ({ ...m, [id]: { ...(m[id] || {}), ...patch } }));
  };

  const openEdit = (a: Assistant) => {
    setEditMap((m) => ({
      ...m,
      [a.id]: {
        agentName: a.agentName || "",
        description: a.description || "",
        status: a.status || "",
        agentStatus: a.agentStatus || "",
        activeStatus: !!a.activeStatus,
        voiceStatus: !!a.voiceStatus,
        domain: a.domain || "",
        subDomain: a.subDomain || "",
        targetUser: a.targetUser || "",
        usageModel: a.usageModel || "",
        responseFormat: a.responseFormat || "auto",
        converstionTone: a.converstionTone || "",
      },
    }));
    setShowEdit(a.id);
  };

  const saveEdit = async (id: string) => {
    const draft = editMap[id] || {};
    const current = data?.assistants.find((x) => x.id === id);

    // Agent update via AgentCreation
    const payload = {
      agentId: id,
      assistantId: current?.assistantId || "",
      ...draft,
    };

    setSaving(id);
    try {
      const res = await authFetch(
        `${BASE_URL}/api/ai-service/agent/agentCreation`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(
          `Update failed: ${res.status} ${res.statusText}. ${txt || ""}`
        );
      }

      const ref = await authFetch(
        `${BASE_URL}/api/ai-service/agent/allAgentDataList?userId=${encodeURIComponent(
          resolvedUserId
        )}`,
        { method: "GET" }
      );
      const json: AllAgentDataResponse = await ref.json();
      setData(json);
      setShowEdit(null);
    } catch (e: any) {
      message.error(e?.message || "Failed to update agent.");
    } finally {
      setSaving(null);
    }
  };

  const deleteAssistant = async (
    assistantId: string | null,
    agentId: string
  ) => {
    if (!assistantId) {
      message.error("Missing assistantId. Cannot delete this assistant.");
      return;
    }

    setDeleting(agentId);
    try {
      const url = new URL(
        "/api/ai-service/agent/delete/" + encodeURIComponent(assistantId),
        BASE_URL
      );
      const res = await authFetch(url.toString(), { method: "DELETE" });
      const txt = await res.text().catch(() => "");
      if (!res.ok) {
        throw new Error(
          `Delete failed: ${res.status} ${res.statusText}. ${txt || ""}`
        );
      }

      setData((old) =>
        old
          ? {
              ...old,
              assistants: old.assistants.filter((a) => a.id !== agentId),
              conversations: old.conversations.filter(
                (c) => c.agentId !== agentId
              ),
            }
          : old
      );
    } catch (e: any) {
      message.error(e?.message || "Failed to delete assistant.");
    } finally {
      setDeleting(null);
      setDeleteConfirmId(null);
    }
  };

  // FILE upload (AGENT level): POST /api/ai-service/agent/{agentId}/upload
  const uploadFile = async (agentId: string, file: File) => {
    setUploading(agentId);
    try {
      const fd = new FormData();
      fd.append("file", file); // <-- key must be "file"

      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/${encodeURIComponent(agentId)}/addfiles`,
        {
          method: "POST",
          body: fd, // <-- do NOT set Content-Type; browser sets boundary
        }
      );

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
      }
      const data = await res.json();
      message.success(`Uploaded: ${data.filename} file sucessfully`);
    } catch (e: any) {
      message.error(e?.message || "File upload failed.");
    } finally {
      setUploading(null);
    }
  };

  // IMAGE upload (ASSISTANT level): POST /api/ai-service/agent/{assistantId}/uploadImage
  const uploadImage = async (assistantId: string, file: File) => {
    if (!assistantId) {
      message.success("Missing assistantId for image upload.");
      return;
    }
    setUploading(assistantId);
    try {
      const fd = new FormData();
      fd.append("file", file); // <-- key must be "file"

      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/${encodeURIComponent(
          assistantId
        )}/uploadImage`,
        {
          method: "POST",
          body: fd, // <-- no manual Content-Type
        }
      );

      if (!res.ok) {
        throw new Error(
          `Image upload failed: ${res.status} ${await res.text()}`
        );
      }
      const data = await res.json();
      message.success(`Uploaded: ${data.filename} Image succesfully`);
    } catch (e: any) {
      message.success(e?.message || "Image upload failed.");
    } finally {
      setUploading(null);
    }
  };

  // ---------- Hide/Unhide with explicit query param:
  // PATCH /api/ai-service/agent/{userId}/{agentId}/hideStatus?activeStatus=true|false
  const setActiveStatus = async (agentId: string, nextActive: boolean) => {
    const uid = resolvedUserId;
    if (!uid) {
      message.success("Missing userId. Please sign in again.");
      return;
    }

    try {
      const url = new URL(
        `/api/ai-service/agent/${encodeURIComponent(uid)}/${encodeURIComponent(
          agentId
        )}/hideStatus`,
        BASE_URL
      );
      url.searchParams.set("activeStatus", String(nextActive));

      const res = await authFetch(url.toString(), { method: "PATCH" });
      const txt = await res.text().catch(() => "");
      if (!res.ok) {
        throw new Error(
          `Hide status failed: ${res.status} ${res.statusText}. ${txt || ""}`
        );
      }

      // Set to requested value
      setData((old) =>
        old
          ? {
              ...old,
              assistants: old.assistants.map((a) =>
                a.id === agentId ? { ...a, activeStatus: nextActive } : a
              ),
            }
          : old
      );
    } catch (e: any) {
      message.success(e?.message || "Failed to update active status.");
    }
  };

  const gotoStore = () => navigate("/main/bharat-expert");

  return (
    <div className="min-h-screen">
      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-amber-400 rounded-full animate-spin mb-4"></div>
            <p className="text-purple-800 font-medium">
              Loading assistants, please wait…
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-100 border border-red-300 p-4 text-red-700 font-medium mb-6">
            Error: {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {data.assistants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-purple-100">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  No assistants found
                </h3>
                <p className="text-purple-600 mb-6">
                  Get started by creating your first AI assistant
                </p>
                <button
                  onClick={gotoStore}
                  className="rounded-lg px-6 py-3 font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md transition-all hover:shadow-lg"
                >
                  Create Your First Agent
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Select
                    value={filterStatus}
                    onChange={setFilterStatus}
                    style={{ width: 200 }}
                    options={[
                      { value: "All", label: "ALL STATUSES" },
                      { value: "APPROVED", label: "APPROVED" },
                      { value: "DELETED", label: "DELETED" },
                      { value: "REQUESTED", label: "REQUESTED" },
                      { value: "REJECTED", label: "REJECTED" },
                    ]}
                    placeholder="Filter by Status"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssistants.map((a) => {
                    const conv = conversationsByAgent[a.id] || [];
                    return (
                      <div
                        key={a.id}
                        className="rounded-2xl border border-purple-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col"
                      >
                        {/* Top: Avatar/Name/Badges */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-100 to-amber-100 overflow-hidden flex items-center justify-center border border-purple-200">
                            {a.profileImagePath ? (
                              <img
                                src={a.profileImagePath}
                                alt={a.agentName || "Assistant"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-purple-600 text-lg font-bold">
                                {a.agentName?.[0]?.toUpperCase() || "A"}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h2 className="font-semibold text-lg text-purple-900">
                                {a.agentName || a.name}
                              </h2>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {/* ✅ Main Status */}
                              {a.status && (
                                <span className="text-xs rounded-full px-2 py-1 bg-purple-100 text-purple-700 border border-purple-200">
                                  {a.status}
                                </span>
                              )}

                              {/* ✅ Agent Status */}
                              {a.agentStatus && (
                                <span className="text-xs rounded-full px-2 py-1 bg-amber-100 text-amber-700 border border-amber-200">
                                  {a.agentStatus}
                                </span>
                              )}

                              {/* ✅ Active / Inactive */}
                              <span
                                className={`text-xs rounded-full px-2 py-1 border ${
                                  a.activeStatus
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }`}
                              >
                                {a.activeStatus ? "Active" : "Inactive"}
                              </span>

                              {/* ✅ Voice Enabled */}
                              {a.voiceStatus && (
                                <span className="text-xs rounded-full px-2 py-1 bg-blue-100 text-blue-700 border border-blue-200">
                                  Voice
                                </span>
                              )}
                            </div>

                            {/* <div className="text-xs text-purple-500 mt-1 truncate">
                              ID: {a.assistantId || "—"}
                            </div>
                            <div className="text-xs text-purple-400">
                              Created:{" "}
                              {a.created_at
                                ? new Date(a.created_at).toLocaleDateString()
                                : "—"}
                            </div> */}
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="mb-4 text-sm text-purple-800 line-clamp-3 flex-grow">
                          {a.description || "No description provided."}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-purple-700 mb-4">
                          {/* ✅ Domain - always line clamped */}
                          <div className="line-clamp-3">
                            <span className="font-medium">Domain:</span>{" "}
                            {a.domain}
                          </div>

                          {/* Subdomain - normal */}
                          <div>
                            <span className="font-medium">Subdomain:</span>{" "}
                            {a.subDomain}
                          </div>

                          {/* Target - normal */}
                          <div className="line-clamp-3">
                            <span className="font-medium">Target:</span>{" "}
                            {a.targetUser}
                          </div>

                          {/* Model - normal */}
                          <div>
                            <span className="font-medium">Model:</span>{" "}
                            {a.usageModel}
                          </div>
                        </div>

                        {/* Conversations */}
                        {/* <div className="mb-4">
                          <div className="text-xs font-semibold text-purple-800 mb-2 flex items-center">
                            <span>Conversation Starters</span>
                            <span className="ml-2 bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
                              {conv.length}
                            </span>
                          </div>
                          {conv.length === 0 ? (
                            <div className="text-xs text-purple-400 italic">
                              No conversation starters yet.
                            </div>
                          ) : (
                            <ul className="space-y-2 max-h-32 overflow-y-auto">
                              {conv.slice(0, 2).map((c) => (
                                <li
                                  key={c.id}
                                  className="text-xs rounded-lg bg-purple-50 border border-purple-100 px-3 py-2"
                                >
                                  <div className="font-medium text-purple-800">
                                    {c.conStarter1 || "—"}
                                  </div>
                                  {c.conStarter2 && (
                                    <div className="text-purple-600 mt-1">
                                      {c.conStarter2}
                                    </div>
                                  )}
                                  <div className="text-[11px] text-purple-400 mt-1">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                  </div>
                                </li>
                              ))}
                              {conv.length > 2 && (
                                <li className="text-xs text-center text-purple-500 py-1">
                                  +{conv.length - 2} more
                                </li>
                              )}
                            </ul>
                          )}
                        </div> */}

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-purple-100 flex flex-wrap gap-2">
                          {/* Show / Hide */}
                          {a.activeStatus ? (
                            <button
                              onClick={() => setActiveStatus(a.id, false)}
                              className="rounded-md px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-purple-900 hover:from-amber-400 hover:to-amber-500 shadow-sm transition-all"
                              title="Set Inactive"
                            >
                              Hide
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveStatus(a.id, true)}
                              className="rounded-md px-3 py-2 text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-sm transition-all"
                              title="Set Active"
                            >
                              Show
                            </button>
                          )}

                          {/* ✅ Upload File */}
                          <label className="inline-flex items-center gap-2 text-xs cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors">
                            <span className="font-medium">Upload File</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) uploadFile(a.id, f);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>

                          {/* ✅ Upload Image (assistant-level) */}
                          <label className="inline-flex items-center gap-2 text-xs cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors">
                            <span className="font-medium">Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f && a.assistantId)
                                  uploadImage(a.assistantId, f);
                                else if (!a.assistantId)
                                  message.success(
                                    "Missing assistantId for image upload."
                                  );
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>

                          <div className="flex gap-2 ml-auto">
                            {/* Open Edit Flow (optional) */}
                            {/* <button
                            onClick={() => openUpdateWizard(a)}
                            className="rounded-md px-3 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-sm transition-all"
                          >
                            Update
                          </button> */}

                            {/* ✅ Delete */}
                            <button
                              onClick={() => setDeleteConfirmId(a.id)}
                              disabled={deleting === a.id}
                              className="rounded-md px-3 py-2 text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm transition-all disabled:opacity-60"
                            >
                              {deleting === a.id ? "Deleting…" : "Delete"}
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/main/chatinterface/assistant/${a.assistantId}/${a.id}`
                                )
                              }
                              className="rounded-md px-3 py-2 text-xs font-semibold text-white
             bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
             hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700
             active:scale-[.98]
             shadow-sm transition-all
             focus:outline-none focus:ring-2 focus:ring-purple-400/70 focus:ring-offset-2 dark:focus:ring-offset-gray-900
             disabled:opacity-60"
                              title="View"
                            >
                              View
                            </button>
                          </div>
                        </div>

                        {uploading === a.id && (
                          <div className="mt-2 text-xs text-purple-600 flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Uploading…
                          </div>
                        )}

                        {/* Delete Confirmation Modal */}
                        {deleteConfirmId === a.id && (
                          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                                Confirm Deletion
                              </h3>
                              <p className="text-purple-700 mb-6">
                                Are you sure you want to delete this assistant?
                                This action cannot be undone.
                              </p>
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    deleteAssistant(a.assistantId, a.id)
                                  }
                                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-900">
                Update Agent
              </h3>
              <button
                onClick={() => setShowEdit(null)}
                className="text-purple-500 hover:text-purple-700 p-1 rounded-full hover:bg-purple-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Agent Name"
                value={editMap[showEdit]?.agentName || ""}
                onChange={(v) => onChangeDraft(showEdit, { agentName: v })}
              />
              <TextField
                label="Status"
                value={editMap[showEdit]?.status || ""}
                onChange={(v) => onChangeDraft(showEdit, { status: v })}
              />
              <TextField
                label="Agent Status"
                value={editMap[showEdit]?.agentStatus || ""}
                onChange={(v) => onChangeDraft(showEdit, { agentStatus: v })}
              />
              <TextField
                label="Domain"
                value={editMap[showEdit]?.domain || ""}
                onChange={(v) => onChangeDraft(showEdit, { domain: v })}
              />
              <TextField
                label="Sub Domain"
                value={editMap[showEdit]?.subDomain || ""}
                onChange={(v) => onChangeDraft(showEdit, { subDomain: v })}
              />
              <TextField
                label="Target User"
                value={editMap[showEdit]?.targetUser || ""}
                onChange={(v) => onChangeDraft(showEdit, { targetUser: v })}
              />
              <TextField
                label="Usage Model"
                value={editMap[showEdit]?.usageModel || ""}
                onChange={(v) => onChangeDraft(showEdit, { usageModel: v })}
              />
              <TextField
                label="Response Format"
                value={editMap[showEdit]?.responseFormat || "auto"}
                onChange={(v) => onChangeDraft(showEdit, { responseFormat: v })}
                placeholder="auto | JSON_object"
              />
              <TextField
                label="Tone"
                value={editMap[showEdit]?.converstionTone || ""}
                onChange={(v) =>
                  onChangeDraft(showEdit, { converstionTone: v })
                }
              />
              <ToggleField
                label="Active"
                value={!!editMap[showEdit]?.activeStatus}
                onChange={(v) =>
                  onChangeDraft(showEdit, { activeStatus: v as any })
                }
              />
              <ToggleField
                label="Voice"
                value={!!editMap[showEdit]?.voiceStatus}
                onChange={(v) =>
                  onChangeDraft(showEdit, { voiceStatus: v as any })
                }
              />
              <div className="sm:col-span-2">
                <TextArea
                  label="Description"
                  value={editMap[showEdit]?.description || ""}
                  onChange={(v) => onChangeDraft(showEdit, { description: v })}
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEdit(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(showEdit)}
                disabled={saving === showEdit}
                className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md transition-all disabled:opacity-60"
              >
                {saving === showEdit ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving…
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** -------- Small UI helpers -------- */
const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <label className="block text-sm">
    <span className="text-purple-700 font-medium">{label}</span>
    <input
      className="mt-1 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </label>
);

const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ label, value, onChange, rows = 3, placeholder }) => (
  <label className="block text-sm">
    <span className="text-purple-700 font-medium">{label}</span>
    <textarea
      className="mt-1 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
    />
  </label>
);

const ToggleField: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, value, onChange }) => (
  <label className="flex items-center gap-2 text-sm mt-1">
    <div className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </div>
    <span className="text-purple-700 font-medium">{label}</span>
  </label>
);

export default AllAgentsPage;
