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
function copy(text: string) {
  navigator.clipboard?.writeText(text).then(
    () => message.success("Link copied"),
    () => message.error("Copy failed")
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

// Prefer profileImagePath; fallback to imageUrl if present
function getBestAvatar(a: any): string | null {
  return a?.profileImagePath || a?.imageUrl || null;
}

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

/** -------- Types -------- */
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
  screenStatus?: "STAGE1" | "STAGE2" | "STAGE3" | "STAGE4" | null;
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
type UploadedFile = {
  id?: string;
  fileId?: string;
  filename?: string;
  fileName?: string;
  url?: string;
  uploadedAt?: string;
  createdAt?: any;
  sizeBytes?: number;
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
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AllAgentDataResponse | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ⬇️ place with the other React.useState hooks (top of component)
  const [avatarMenuFor, setAvatarMenuFor] = useState<string | null>(null);
  const [genLoadingFor, setGenLoadingFor] = useState<string | null>(null);
  const [genPreviewUrl, setGenPreviewUrl] = useState<string | null>(null);
  const [genPreviewAssistantId, setGenPreviewAssistantId] = useState<
    string | null
  >(null);

  const [editMap, setEditMap] = useState<Record<string, EditDraft>>({});
  const [fileModalOpen, setFileModalOpen] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filesMap, setFilesMap] = useState<Record<string, UploadedFile[]>>({});
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({});
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [removingFileId, setRemovingFileId] = useState<string | null>(null);
  const showId = showEdit ?? "";

  const resolvedUserId = useMemo(() => {
    const id = getUserId();
    return id && id !== "null" && id !== "undefined" ? id : "";
  }, []);
  const gotoStore = () => navigate("/bharath-aistore");

  const refreshData = async () => {
    try {
      if (!resolvedUserId) return;
      const ref = await authFetch(
        `${BASE_URL}/ai-service/agent/allAgentDataList?userId=${encodeURIComponent(
          resolvedUserId
        )}`,
        { method: "GET" }
      );

      const text = await ref.text().catch(() => "");
      if (!ref.ok) {
        let msg = `Request failed (${ref.status})`;
        if (text) msg += `: ${text}`;
        throw new Error(msg);
      }
      // If server returns 204/empty string while processing, don't clobber current list
      if (!text) return;

      let raw: any = {};
      try {
        raw = JSON.parse(text);
      } catch {
        // bad/empty JSON – keep old state
        return;
      }

      setData((prev) => ({
        userId: raw?.userId ?? prev?.userId ?? resolvedUserId,
        // Only replace arrays when the server actually sends them
        assistants: Array.isArray(raw?.assistants)
          ? raw.assistants
          : prev?.assistants ?? [],
        conversations: Array.isArray(raw?.conversations)
          ? raw.conversations
          : prev?.conversations ?? [],
      }));
    } catch {
      // ignore transient refresh errors
    }
  };

  // Small helper: fetch remote image URL → File, then reuse your uploadImage()
  async function uploadFromUrlToAssistant(assistantId: string, url: string) {
    try {
      const res = await fetch(url, { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch image failed: ${res.status}`);
      const blob = await res.blob();
      // Try to preserve extension if present
      const ext = (blob.type?.split("/")?.[1] || "png").toLowerCase();
      const file = new File([blob], `ai-profile.${ext}`, {
        type: blob.type || "image/png",
      });
      await uploadImage(assistantId, file); // ✅ uses your existing upload API
    } catch (e: any) {
      message.error(e?.message || "Failed to save generated image.");
      throw e;
    }
  }

  // ⬇️ add with the other React.useState hooks
const [pendingSave, setPendingSave] = useState<null | {
  agentId: string;
  imageUrl: string;
  userId: string;
}>(null);

// POST /api/ai-service/agent/save-image-url  (make sure /api prefix is present)
async function saveImageUrl(payload: {
  agentId: string;
  imageUrl: string;
  saveOption: "yes" | "no";
  userId: string;
}) {
  const res = await authFetch(
    `${BASE_URL}/ai-service/agent/save-image-url`,
    { method: "POST", body: JSON.stringify(payload) }
  );

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    // Surface backend error text if present
    throw new Error(
      `Save image URL failed (${res.status})${text ? `: ${text}` : ""}`
    );
  }

  // Some backends return plain text (e.g., "Image URL saved successfully")
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      // If server mislabeled but content is not valid JSON, fall back to text
      return { message: text || "OK" };
    }
  }
  // Non-JSON success
  return { message: text || "OK" };
}



  /** Generate Profile Pic via PATCH /api/ai-service/agent/generateProfilePic
   *  - payload: { agentName, description, userId }
   *  - response: { imageUrl, prompt }  // we won't show the prompt
   *  - then show a confirm modal asking to use it as profile now
   */
  async function generateProfilePicForAssistant(a: Assistant) {
    if (!a) return;
    const uid = resolvedUserId;
    if (!uid) return message.error("Missing userId.");
    try {
      setGenLoadingFor(a.id);
      const body = {
        agentName: a.agentName || a.name || "AI Agent",
        description: a.description || "",
        userId: uid,
      };

      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/generateProfilePic`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        }
      );
      const text = await res.text().catch(() => "");
      if (!res.ok) {
        let msg = `Generate failed (${res.status})`;
        if (text) msg += `: ${text}`;
        throw new Error(msg);
      }
      const json = text ? JSON.parse(text) : {};
      const url: string | null = json?.imageUrl || null;
      if (!url) throw new Error("No imageUrl in response.");

      // Show confirm modal (we DO NOT show 'prompt' to user)
      setGenPreviewUrl(url);
      setGenPreviewAssistantId(a.assistantId || null);
    } catch (e: any) {
      message.error(e?.message || "Failed to generate profile image.");
    } finally {
      setGenLoadingFor(null);
      setAvatarMenuFor(null);
    }
  }

async function getAiProfileImage(agentId: string, userId: string) {
  try {
    const url = new URL(`/ai-service/agent/getAiProfileImage`, BASE_URL);
    url.searchParams.set("agentId", agentId);
    url.searchParams.set("userId", userId);
    const res = await authFetch(url.toString(), { method: "GET" });
    const txt = await res.text().catch(() => "");
    if (!res.ok)
      throw new Error(`Fetch AI image failed: ${res.status}${txt ? ` ${txt}` : ""}`);
    const json = txt ? JSON.parse(txt) : {};
    return json as {
      userId: string;
      agentName: string;
      imageUrl: string;
      agentId: string;
    };
  } catch (e) {
    return null;
  }
}

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

        const raw = text ? JSON.parse(text) : {};
        setData({
          userId: raw?.userId ?? uid ?? "",
          assistants: Array.isArray(raw?.assistants) ? raw.assistants : [],
          conversations: Array.isArray(raw?.conversations)
            ? raw.conversations
            : [],
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load agents.");
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedUserId]);

  // ▶️ After clicking "Use as Profile", this effect runs the POST then GET, then shows the image
useEffect(() => {
  if (!pendingSave) return;

  let cancelled = false;
  (async () => {
    try {
      // 1) Save (backend returns an error if saveOption === 'no'; we always send 'yes')
      await saveImageUrl({
        agentId: pendingSave.agentId,
        imageUrl: pendingSave.imageUrl,
        saveOption: "yes",
        userId: pendingSave.userId,
      });

      // 2) GET the saved profile image and show it
      const got = await getAiProfileImage(pendingSave.agentId, pendingSave.userId);
      if (!cancelled && got?.imageUrl) {
        setPreviewSrc(got.imageUrl);
      }

      // 3) Refresh list so profileImagePath (highest priority) shows up
      await refreshData();
      if (!cancelled) message.success("Profile image saved.");
    } catch (err: any) {
      if (!cancelled) message.error(err?.message || "Failed to save profile image.");
    } finally {
      if (!cancelled) setPendingSave(null);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [pendingSave]);


  // 🔹 Cache to avoid duplicate profile fetches across renders
  const requestedProfileIdsRef = React.useRef<Set<string>>(new Set());

  // 🔹 Skip API — placeholder-safe effect (no repeated triggers)
  useEffect(() => {
    if (!data?.assistants?.length) return;

    // assistants missing images and not yet requested
    const pending = data.assistants
      .filter(
        (a) =>
          a.assistantId &&
          !a.profileImagePath &&
          !requestedProfileIdsRef.current.has(a.assistantId)
      )
      .reduce<string[]>((acc, a) => {
        const id = a.assistantId as string;
        if (!acc.includes(id)) acc.push(id);
        return acc;
      }, []);

    if (pending.length === 0) return;

    pending.forEach((id) => requestedProfileIdsRef.current.add(id));

    let cancelled = false;

    (async () => {
      try {
        // ⛔️ No API call now — simulate or skip fetching
        const results = pending.map((id) => ({
          id,
          img: null, // or put a placeholder image URL if you want
        }));

        if (cancelled) return;

        // Still update state safely
        setData((prev) =>
          prev
            ? {
                ...prev,
                assistants: prev.assistants.map((a) => {
                  const hit = results.find((r) => r.id === a.assistantId);
                  return hit && hit.img
                    ? { ...a, profileImagePath: hit.img }
                    : a;
                }),
              }
            : prev
        );
      } catch (err) {
        console.error("⚠️ Profile image skip error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data?.assistants]);

  useEffect(() => {
    if (!fileModalOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setFileModalOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fileModalOpen]);

  const conversationsByAgent = React.useMemo(() => {
    const map: Record<string, Conversation[]> = {};
    (data?.conversations || []).forEach((c) => {
      if (!map[c.agentId]) map[c.agentId] = [];
      map[c.agentId].push(c);
    });
    return map;
  }, [data]);

  const openUpdateWizard = (a: Assistant) => {
    sessionStorage.setItem("edit_agentId", a.id);
    sessionStorage.setItem("edit_assistantId", a.assistantId || "");
    const stepFromScreen =
      a?.screenStatus === "STAGE2"
        ? 1
        : a?.screenStatus === "STAGE3"
        ? 2
        : a?.screenStatus === "STAGE4"
        ? 3
        : 0;
    sessionStorage.setItem("edit_jumpStep", String(stepFromScreen));
    const convList = conversationsByAgent[a.id] || [];
    const latest = [...convList].sort(
      (x, y) =>
        new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
    )[0];
    const seed = latest
      ? {
          ...a,
          conStarter1: latest.conStarter1,
          conStarter2: latest.conStarter2,
          conStarter3: latest.conStarter3,
          conStarter4: latest.conStarter4,
          rateThisPlatform: latest.rateThisPlatform,
          shareYourFeedback: latest.shareYourFeedback,
        }
      : a;
    const qs = new URLSearchParams({
      agentId: a.id,
      assistantId: a.assistantId || "",
      mode: "edit",
    }).toString();
    navigate(`/main/create-aiagent?${qs}`, {
      state: { mode: "edit", seed, jumpToStep: stepFromScreen },
    });
  };

  // VIEW files
  const fetchUploadedFiles = async (assistantId: string) => {
    if (!assistantId) {
      message.error("Missing assistantId.");
      return;
    }
    setLoadingFiles((m) => ({ ...m, [assistantId]: true }));
    try {
      const url = new URL("/api/ai-service/agent/getUploaded", BASE_URL);
      url.searchParams.set("assistantId", assistantId);
      const res = await authFetch(url.toString(), { method: "GET" });
      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(`Fetch files failed: ${res.status} ${text}`);
      let data: any = [];
      try {
        data = text ? JSON.parse(text) : [];
      } catch {
        data = [];
      }
      const list: UploadedFile[] = Array.isArray(data)
        ? data
        : data?.files || [];
      setFilesMap((m) => ({ ...m, [assistantId]: list }));
      setFileModalOpen(assistantId);
    } catch (e: any) {
      message.error(e?.message || "Failed to fetch uploaded files.");
    } finally {
      setLoadingFiles((m) => ({ ...m, [assistantId]: false }));
    }
  };

  const removeUploadedFile = async (assistantId: string, fileId: string) => {
    if (!assistantId || !fileId) {
      message.error("Missing assistantId or fileId.");
      return;
    }
    setRemovingFileId(fileId);
    try {
      const url = new URL("/api/ai-service/agent/removeFiles", BASE_URL);
      url.searchParams.set("assistantId", assistantId);
      url.searchParams.set("fileId", fileId);
      let res = await authFetch(url.toString(), { method: "DELETE" });
      if (res.status === 405 || res.status === 501) {
        res = await authFetch(url.toString(), { method: "GET" });
      }
      const text = await res.text().catch(() => "");
      if (!res.ok)
        throw new Error(
          `Remove failed: ${res.status}${text ? ` ${text}` : ""}`
        );
      setFilesMap((m) => ({
        ...m,
        [assistantId]: (m[assistantId] || []).filter(
          (f) => (f.fileId || f.id) !== fileId
        ),
      }));
      message.success("File removed.");
    } catch (e: any) {
      message.error(e?.message || "Failed to remove file.");
    } finally {
      setRemovingFileId(null);
    }
  };

  const filteredAssistants = useMemo(() => {
    const list = Array.isArray(data?.assistants) ? data!.assistants : [];
    if (filterStatus === "All")
      return list.filter((a) => a.status !== "DELETED");
    return list.filter((a) => a.status === filterStatus);
  }, [data, filterStatus]);

  const onChangeDraft = (id: string, patch: EditDraft) => {
    setEditMap((m) => ({ ...m, [id]: { ...(m[id] || {}), ...patch } }));
  };

  const saveEdit = async (id: string) => {
    const draft = editMap[id] || {};
    const current = data?.assistants.find((x) => x.id === id);
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
      await refreshData();
      setShowEdit(null);
      message.success("Agent updated.");
    } catch (e: any) {
      message.error(e?.message || "Failed to update agent.");
    } finally {
      setSaving(null);
    }
  };

  /** Soft archive (recommended): set inactive and optionally mark status */
  const archiveAgent = async (agent: Assistant) => {
    try {
      const payload = {
        agentId: agent.id,
        assistantId: agent.assistantId || "",
        activeStatus: false,
        status: "DELETED", // shows as Inactive/Archived in UI filter
      };
      const res = await authFetch(
        `${BASE_URL}/api/ai-service/agent/agentCreation`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Archive failed: ${res.status} ${txt || ""}`);
      }
      await refreshData();
      message.success("Agent archived (inactive).");
    } catch (e: any) {
      message.error(e?.message || "Failed to archive agent.");
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
      if (!res.ok)
        throw new Error(
          `Delete failed: ${res.status} ${res.statusText}. ${txt || ""}`
        );
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
      message.success("Deleted permanently.");
    } catch (e: any) {
      message.error(e?.message || "Failed to delete assistant.");
    } finally {
      setDeleting(null);
      setDeleteConfirmId(null);
    }
  };

  // MULTI-FILE upload (assistant-level)
  const uploadFiles = async (assistantId: string, files: File[]) => {
    if (!assistantId)
      return message.error("Missing assistantId for file upload.");
    if (!files || files.length === 0)
      return message.error("Please choose at least one file.");
    setUploadingMap((prev) => ({ ...prev, [assistantId]: true }));
    try {
      const fd = new FormData();
      for (const f of files) {
        fd.append("file", f);
        fd.append("files", f);
      }
      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/${encodeURIComponent(
          assistantId
        )}/addfiles`,
        { method: "POST", body: fd }
      );
      const text = await res.text().catch(() => "");
      if (!res.ok)
        throw new Error(
          `Upload failed: ${res.status} ${res.statusText}${
            text ? ` — ${text}` : ""
          }`
        );
      message.success(`Files uploaded successfully`);
      // optional: refresh file list if modal is open for this assistant
      if (fileModalOpen === assistantId) fetchUploadedFiles(assistantId);
    } catch (e: any) {
      message.error(e?.message || "File upload failed.");
    } finally {
      setUploadingMap((prev) => ({ ...prev, [assistantId]: false }));
    }
  };

  // IMAGE upload with WhatsApp-style avatar edit
  const uploadImage = async (assistantId: string, file: File) => {
    if (!assistantId)
      return message.error("Missing assistantId for image upload.");
    setUploading(assistantId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/${encodeURIComponent(
          assistantId
        )}/uploadImage`,
        { method: "POST", body: fd }
      );
      if (!res.ok)
        throw new Error(
          `Image upload failed: ${res.status} ${await res.text()}`
        );
      // Don’t show filename: keep it clean like WhatsApp
      message.success("Profile image updated.");
      // Show the new image immediately (like WhatsApp), then refresh safely
      const preview = URL.createObjectURL(file);
      setData((old) =>
        old
          ? {
              ...old,
              assistants: Array.isArray(old.assistants)
                ? old.assistants.map((a) =>
                    a.assistantId === assistantId
                      ? { ...a, profileImagePath: preview }
                      : a
                  )
                : [],
            }
          : old
      );

      await refreshData();
    } catch (e: any) {
      message.error(e?.message || "Image upload failed.");
    } finally {
      setUploading(null);
    }
  };

  // Active toggle
  const setActiveStatus = async (agentId: string, nextActive: boolean) => {
    const uid = resolvedUserId;
    if (!uid) return message.error("Missing userId. Please sign in again.");
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
      if (!res.ok)
        throw new Error(
          `Hide status failed: ${res.status} ${res.statusText}. ${txt || ""}`
        );
      // ✅ update in place instead of filtering the agent OUT
      setData((old) =>
        old
          ? {
              ...old,
              assistants: Array.isArray(old.assistants)
                ? old.assistants.map((a) =>
                    a.id === agentId ? { ...a, activeStatus: nextActive } : a
                  )
                : [],
            }
          : old
      );
      message.success(
        nextActive
          ? "Agent Status Updated to Active."
          : "Agent Status Updated to Inactive."
      );
    } catch (e: any) {
      message.error(e?.message || "Failed to update active status.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* 🔝 Top Bar */}
      <div className="sticky w-full bg-white shadow-sm border-b border-purple-200 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-auto">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            size="large"
            className="w-full sm:w-[220px]"
            options={[
              { value: "All", label: "ALL " },
              { value: "APPROVED", label: "APPROVED" },
              { value: "DELETED", label: "DELETED" },
              { value: "REQUESTED", label: "REQUESTED" },
              { value: "REJECTED", label: "REJECTED" },
            ]}
            placeholder="Filter by Status"
          />
        </div>
        <button
          onClick={gotoStore}
          className="w-full sm:w-auto h-10 rounded-lg px-5 font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md transition-all"
        >
          Bharath AI Store
        </button>
      </div>

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
            {(data?.assistants?.length ?? 0) === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssistants.map((a) => {
                  const isUploadingImg = uploading === a.assistantId;
                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-purple-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col h-full"
                    >
                      {/* Header: Avatar + Title + Badges */}
                      <div className="flex items-start gap-3 mb-4 w-full">
                        {/* Avatar with camera overlay (WhatsApp style) */}
                        <div className="relative">
                          {(() => {
                            const bestAvatar = getBestAvatar(a);
                            return (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    bestAvatar && setPreviewSrc(bestAvatar)
                                  }
                                  className="h-14 w-14 rounded-full overflow-hidden border border-purple-200 bg-gradient-to-br from-purple-100 to-amber-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-400"
                                  title={bestAvatar ? "Tap to preview" : ""}
                                >
                                  {bestAvatar ? (
                                    <img
                                      src={bestAvatar}
                                      alt={
                                        a.agentName
                                          ? `${a.agentName} avatar`
                                          : "AI Agent avatar"
                                      }
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <span className="text-purple-600 text-lg font-bold">
                                      {a.agentName?.[0]?.toUpperCase() || "A"}
                                    </span>
                                  )}
                                </button>

                                {/* hidden file input */}
                                <input
                                  id={`img_${a.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.currentTarget.files?.[0];
                                    if (f && a.assistantId)
                                      uploadImage(a.assistantId, f);
                                    else if (!a.assistantId)
                                      message.error(
                                        "Missing assistantId for image upload."
                                      );
                                    e.currentTarget.value = "";
                                    setAvatarMenuFor(null);
                                  }}
                                />

                                {/* camera icon → opens small actions menu */}
                                <button
                                  title="Generate or Upload profile"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setAvatarMenuFor((curr) =>
                                      curr === a.id ? null : a.id
                                    );
                                  }}
                                  className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-white border border-purple-200 shadow flex items-center justify-center hover:scale-[1.05]"
                                >
                                  {isUploadingImg || genLoadingFor === a.id ? (
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                      <path
                                        d="M4 12a8 8 0 0 1 8-8"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M9 2a1 1 0 0 0-.894.553L7.382 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-2.382l-.724-1.447A1 1 0 0 0 14 2H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
                                    </svg>
                                  )}
                                </button>

                                {/* tiny action sheet */}
                                {avatarMenuFor === a.id && (
                                  <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-8 w-[180px] rounded-xl bg-white border border-purple-200 shadow-lg p-2">
                                    <button
                                      onClick={() => {
                                        // OPEN native file picker (your upload image API)
                                        const el = document.getElementById(
                                          `img_${a.id}`
                                        ) as HTMLInputElement | null;
                                        if (el) el.click();
                                      }}
                                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-purple-50"
                                    >
                                      Upload Profile…
                                    </button>
                                    <button
                                      onClick={() =>
                                        generateProfilePicForAssistant(a)
                                      }
                                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-purple-50"
                                      disabled={!!genLoadingFor}
                                    >
                                      {genLoadingFor === a.id
                                        ? "Generating…"
                                        : "Generate with AI"}
                                    </button>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="font-semibold text-lg text-purple-900 truncate">
                              {a.agentName || a.name}
                            </h2>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-1">
                            {a.status && (
                              <span
                                className={`text-[11px] rounded-full px-2 py-0.5 font-semibold border 
      ${
        a.status === "APPROVED"
          ? "bg-green-100 text-green-800 border-green-200"
          : a.status === "REQUESTED"
          ? "bg-sky-100 text-sky-700 border-sky-200"
          : a.status === "DELETED"
          ? "bg-red-100 text-red-700 border-red-200"
          : a.status === "REJECTED"
          ? "bg-orange-100 text-orange-700 border-orange-200"
          : "bg-purple-100 text-purple-700 border-purple-200"
      }`}
                              >
                                {a.status}
                              </span>
                            )}

                            {a.voiceStatus && (
                              <span className="text-[11px] rounded-full px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200">
                                Voice
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mb-4 text-sm text-purple-800 line-clamp-3 flex-grow">
                        {a.description || "No description provided."}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-purple-700 mb-4">
                        <div className="line-clamp-3">
                          <span className="font-medium">Domain:</span>{" "}
                          {a.domain}
                        </div>
                        <div>
                          <span className="font-medium">Subdomain:</span>{" "}
                          {a.subDomain}
                        </div>
                        <div className="line-clamp-3">
                          <span className="font-medium">Target:</span>{" "}
                          {a.targetUser}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-auto pt-4 border-t border-purple-100 flex flex-col sm:flex-row sm:flex-wrap gap-2 items-start sm:items-center">
                        {/* Active switch */}
                        <label className="flex items-center gap-2 text-xs">
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!a.activeStatus}
                              onChange={(e) =>
                                setActiveStatus(a.id, e.target.checked)
                              }
                            />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:outline-none" />
                            <div className="pointer-events-none absolute left-0 top-0 h-5 w-5 translate-x-[2px] peer-checked:translate-x-[20px] transition-transform bg-white rounded-full border border-gray-300" />
                          </div>
                          <span className="text-purple-700 font-medium">
                            Active
                          </span>
                        </label>

                        {/* Files */}
                        <label className="inline-flex items-center gap-2 text-xs cursor-pointer bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors">
                          <span className="font-medium">Upload Files</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              const list = e.target.files;
                              if (list && list.length > 0) {
                                if (a.assistantId)
                                  uploadFiles(a.assistantId, Array.from(list));
                                else
                                  message.error(
                                    "This agent has no assistantId yet. Open/Edit & save the agent, then upload."
                                  );
                              } else {
                                message.error(
                                  "Please choose at least one file."
                                );
                              }
                              e.currentTarget.value = "";
                            }}
                          />
                        </label>

                        <button
                          onClick={() =>
                            a.assistantId
                              ? fetchUploadedFiles(a.assistantId)
                              : message.error("Missing assistantId.")
                          }
                          className="rounded-md px-3 py-2 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                          disabled={loadingFiles[a.assistantId || ""]}
                        >
                          {loadingFiles[a.assistantId || ""]
                            ? "Loading…"
                            : "View Files"}
                        </button>

                        {/* ✅ Action Buttons: Edit | View | Delete */}
                        <div className="flex gap-2 ml-auto flex-wrap justify-end w-full sm:w-auto">
                          {/* ✏️ Edit Button */}
                          <button
                            onClick={() => openUpdateWizard(a)}
                            title="Edit"
                            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold 
               bg-gradient-to-r from-purple-600 to-purple-700 text-white 
               hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.84 1.84 3.75 3.75 1.84-1.84Z" />
                            </svg>
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* 👁️ View Button */}
                          <button
                            onClick={() =>
                              navigate(
                                `/main/chatinterface/assistant/${a.assistantId}/${a.id}`
                              )
                            }
                            title="View"
                            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold 
               bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 
               text-white hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 
               transition-all shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M12 5c-5.5 0-9.6 5.1-10 6 .4.9 4.5 6 10 6s9.6-5.1 10-6c-.4-.9-4.5-6-10-6Zm0 9.5A3.5 3.5 0 1 1 12 7a3.5 3.5 0 0 1 0 7.5Z" />
                            </svg>
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {/* 🗑️ Delete Button (with icon always visible) */}
                          <button
                            onClick={() => setDeleteConfirmId(a.id)}
                            title="Delete Agent"
                            disabled={deleting === a.id}
                            className="shrink-0 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold
             bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {deleting === a.id ? (
                              // Spinner during delete
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  d="M4 12a8 8 0 018-8"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            ) : (
                              // Trash icon (Lucide style)
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            )}

                            {/* Label (hidden on mobile, shown from sm and up) */}
                            <span className="hidden sm:inline">
                              {deleting === a.id ? "Deleting…" : "Delete"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Uploading indicator for files */}
                      {uploadingMap[a.assistantId || ""] && (
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

                      {/* Files Modal */}
                      {fileModalOpen && (
                        <div
                          className="fixed inset-0 z-50 bg-black/10 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                          onMouseDown={(e) => {
                            if (e.target === e.currentTarget)
                              setFileModalOpen(null);
                          }}
                          role="dialog"
                          aria-modal="true"
                        >
                          <div className="w-full max-w-3xl max-h-[82vh] overflow-hidden rounded-2xl bg-white text-gray-900 shadow border border-gray-200">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M14.59 2.59A2 2 0 0 0 13.17 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.41l-4.82-4.83Z" />
                                  </svg>
                                </div>
                                <h3 className="text-lg font-semibold">
                                  Uploaded Files
                                </h3>
                              </div>
                              <button
                                onClick={() => setFileModalOpen(null)}
                                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                aria-label="Close"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="p-5 overflow-y-auto max-h-[calc(82vh-4rem)]">
                              {loadingFiles[fileModalOpen] ? (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <svg
                                    className="animate-spin h-5 w-5 text-gray-500"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-20"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-80"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V2C5.373 2 0 7.373 0 14h4z"
                                    />
                                  </svg>
                                  Loading files…
                                </div>
                              ) : (filesMap[fileModalOpen] || []).length ===
                                0 ? (
                                <div className="text-sm text-gray-500 italic">
                                  No files found.
                                </div>
                              ) : (
                                <ul
                                  className="grid gap-3"
                                  style={{
                                    gridTemplateColumns:
                                      "repeat(auto-fill, minmax(240px, 1fr))",
                                  }}
                                >
                                  {(filesMap[fileModalOpen] || []).map((f) => {
                                    const key =
                                      f.fileId ||
                                      f.id ||
                                      f.fileName ||
                                      Math.random().toString(36);
                                    const displayName =
                                      f.fileName ||
                                      f.filename ||
                                      f.fileId ||
                                      f.id ||
                                      "Unnamed file";
                                    const idToRemove = (
                                      f.fileId ||
                                      f.id ||
                                      ""
                                    ).toString();
                                    return (
                                      <li
                                        key={key}
                                        className="group rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-3"
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5 text-gray-600"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M14.59 2.59A2 2 0 0 0 13.17 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.41l-4.82-4.83Z" />
                                            </svg>
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div
                                              className="text-sm font-medium text-gray-900 truncate"
                                              title={displayName}
                                            >
                                              {displayName}
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                              {f.url && (
                                                <a
                                                  href={f.url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-200"
                                                >
                                                  Open
                                                </a>
                                              )}
                                              {idToRemove && (
                                                <button
                                                  onClick={() =>
                                                    removeUploadedFile(
                                                      fileModalOpen!,
                                                      idToRemove
                                                    )
                                                  }
                                                  className="text-xs px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                                                  disabled={
                                                    removingFileId ===
                                                    idToRemove
                                                  }
                                                >
                                                  {removingFileId === idToRemove
                                                    ? "Removing…"
                                                    : "Remove"}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ✅ Confirm Generated Image Modal */}
                      {genPreviewUrl && genPreviewAssistantId && (
                        <div
                          className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px] flex items-center justify-center px-4"
                          onMouseDown={(e) => {
                            if (e.target === e.currentTarget) {
                              setGenPreviewUrl(null);
                              setGenPreviewAssistantId(null);
                            }
                          }}
                          role="dialog"
                          aria-modal="true"
                        >
                          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-purple-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-purple-900">
                                Use this as profile?
                              </h3>
                              <button
                                onClick={() => {
                                  setGenPreviewUrl(null);
                                  setGenPreviewAssistantId(null);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label="Close"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="p-5">
                              <div className="w-full rounded-xl overflow-hidden bg-gray-50 border">
                                <img
                                  src={genPreviewUrl}
                                  alt="Generated profile"
                                  className="w-full h-[280px] object-contain bg-white"
                                />
                              </div>

                              <p className="mt-3 text-xs text-gray-500">
                                We won’t show any “prompt” details — only the
                                image is used.
                              </p>

                              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                                {/* ✅ USE AS PROFILE: upload, then GET & show the image */}
<button
  onClick={async () => {
    // Close the modal right away
    const agent = (data?.assistants || []).find(
      x => x.assistantId === genPreviewAssistantId
    );
    const uid = resolvedUserId;

    setGenPreviewUrl(null);
    setGenPreviewAssistantId(null);

    if (!agent?.id || !uid) {
      return message.error("Missing agentId or userId.");
    }

    // Kick off the effect: POST save-image-url, then GET and show
    setPendingSave({
      agentId: agent.id,
      imageUrl: genPreviewUrl!, // from generation response
      userId: uid,
    });
  }}
  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
>
  Use as Profile
</button>


                                {/* 🔄 GENERATE AGAIN: close modal, show loader while generating */}
                                <button
                                  onClick={() => {
                                    // Close modal & clear preview
                                    const asst = (data?.assistants || []).find(
                                      (x) =>
                                        x.assistantId === genPreviewAssistantId
                                    );
                                    setGenPreviewUrl(null);
                                    setGenPreviewAssistantId(null);
                                    if (asst) {
                                      // generateProfilePicForAssistant will set genLoadingFor (spinner on camera)
                                      generateProfilePicForAssistant(asst);
                                    }
                                  }}
                                  className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50 font-semibold text-gray-800"
                                >
                                  Generate again
                                </button>

                                {/* ⬆️ UPLOAD PROFILE: opens your upload image API (file picker) */}
                                <button
                                  onClick={() => {
                                    // Find the agent card DOM input by AGENT id (not assistantId)
                                    const agent = (data?.assistants || []).find(
                                      (x) =>
                                        x.assistantId === genPreviewAssistantId
                                    );
                                    const picker = document.getElementById(
                                      `img_${agent?.id || ""}`
                                    ) as HTMLInputElement | null;
                                    if (picker) picker.click();

                                    // Optional: close the modal to avoid confusion
                                    setGenPreviewUrl(null);
                                    setGenPreviewAssistantId(null);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-800"
                                >
                                  Upload Profile…
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {previewSrc && (
                        <div
                          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-4"
                          onMouseDown={(e) => {
                            if (e.target === e.currentTarget)
                              setPreviewSrc(null);
                          }}
                          role="dialog"
                          aria-modal="true"
                        >
                          <div className="relative max-w-[92vw] max-h-[86vh]">
                            <img
                              src={previewSrc}
                              alt="Profile preview"
                              className="rounded-2xl shadow-2xl max-h-[86vh] max-w-[92vw] object-contain"
                            />

                            {/* 🔹 Top-right corner buttons */}
                            <div className="absolute top-3 right-3 flex gap-2">
                              {/* 🟢 Update Profile Button */}
                              {/* <label
          htmlFor="updateProfileImage"
          className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 shadow cursor-pointer"
        >
          Update Profile
        </label>
        <input
          id="updateProfileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f && data?.assistants?.[0]?.assistantId)
              uploadImage(data.assistants[0].assistantId, f);
            e.currentTarget.value = "";
          }}
        /> */}

                              {/* ❌ Close Icon */}
                              <button
                                onClick={() => setPreviewSrc(null)}
                                className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow"
                                aria-label="Close preview"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ✅ Delete / Inactive Confirmation (no "Archive") */}
                      {deleteConfirmId === a.id && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-purple-900 mb-2">
                              Delete Agent
                            </h3>

                            <p className="text-purple-700 mb-5">
                              Make it{" "}
                              <span className="font-semibold">Inactive</span> to
                              hide and keep history.
                              <span className="font-semibold text-red-600">
                                {" "}
                                Delete Permanently{" "}
                              </span>
                              erases all data and can’t be undone. Are you sure
                              you want to delete anyway?
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                              {/* Cancel */}
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 text-sm font-medium border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50"
                              >
                                Cancel
                              </button>

                              {/* Inactive */}
                              <button
                                onClick={() => {
                                  setDeleteConfirmId(null);
                                  // use your existing toggle API to set inactive
                                  setActiveStatus(a.id, false);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-amber-500 text-purple-900 rounded-md hover:bg-amber-400"
                              >
                                Inactive
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  setDeleteConfirmId(null);
                                  deleteAssistant(a.assistantId, a.id);
                                }}
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
            )}
          </>
        )}
      </main>
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
