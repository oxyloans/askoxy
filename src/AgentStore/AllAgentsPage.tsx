// src/AgentStore/AllAgentsPage.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Tag,
  Select,
  Grid,
  message,
  Input,
  Empty,
  Spin,
} from "antd";
import {
  PlayCircleOutlined,
  CloseOutlined,
  ClearOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";

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

// Safely resolve a display name from historyData (fallback to userId)
function resolveUserDisplayName(
  userId: string | number | null | undefined,
  map?: Record<string, string | null>
) {
  if (userId == null) return "Unknown User";
  const key = String(userId);
  const n = map?.[key];
  if (n && n.trim()) return n.trim();

  // Fallback: pretty userId like “User 1234…abcd”
  const short = key.length > 10 ? `${key.slice(0, 4)}…${key.slice(-4)}` : key;
  return `User ${short}`;
}

// ✅ Helper: formats date/time safely
function fmtDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString; // fallback if invalid
  return d.toLocaleString(); // or use toLocaleDateString() if you want only date
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

// --- Small text helpers (reuse from Agentcreation) ---
const cleanForTransport = (s: string) =>
  (s || "")
    .trim()
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/^"+|"+$|^'+|'+$/g, "")
    .slice(0, 7000);

const cleanInstructionText = (txt: string) =>
  (txt || "")
    .replace(/^\uFEFF/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#{1,6}\s?/gm, "")
    .replace(/\*+/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const parseStartersFromText = (raw: string): string[] => {
  const txt = (raw || "").replace(/\r/g, "").trim();
  if (!txt) return [];

  const lines = txt
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[-*•\d.]+\s*/, "").trim())
    .filter(Boolean);

  const uniq: string[] = [];
  for (const line of lines) {
    if (!line) continue;
    if (uniq.some((x) => x.toLowerCase() === line.toLowerCase())) continue;
    uniq.push(line);
    if (uniq.length >= 4) break; // we only need 4
  }
  return uniq;
};

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
  purpose: string | null;
  goals: string | null;
  roleUser: string | null;
  view: string | null;
  screenStatus?: "STAGE1" | "STAGE2" | "STAGE3" | "STAGE4" | null;
  certificateUrl?: string | null; // ✅ add this
  conStarter1?: string | null;
  conStarter2?: string | null;
  conStarter3?: string | null;
  conStarter4?: string | null;
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

  // 🔹 User History (Public Chats) modal state
  const [historyOpenFor, setHistoryOpenFor] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any | null>(null);

  const [fileModalOpen, setFileModalOpen] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filesMap, setFilesMap] = useState<Record<string, UploadedFile[]>>({});
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({});
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [removingFileId, setRemovingFileId] = useState<string | null>(null);
  const [editAgent, setEditAgent] = useState<Assistant | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // separate loaders for each button
  const [editInstrLoading, setEditInstrLoading] = useState(false);
  const [editStarterLoading, setEditStarterLoading] = useState(false);

  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [tempRecipient, setTempRecipient] = useState("");
  // Edit only Instructions + ConStarters
  const [editScriptAgent, setEditScriptAgent] = useState<Assistant | null>(
    null
  );
  const [editInstr, setEditInstr] = useState("");
  const [editCS1, setEditCS1] = useState("");
  const [editCS2, setEditCS2] = useState("");

  const MAX_INSTRUCTIONS_CHARS = 7000;
  const MAX_CONVERSATION_STARTER_CHARS = 150;

  const [pendingAgentForCert, setPendingAgentForCert] =
    useState<Assistant | null>(null);
  const showId = showEdit ?? "";
  const PURPLE = "#6D28D9";
  const PURPLE_DARK = "#5B21B6";
  const LAVENDER_BG = "#F5F3FF";

  // 🔎 Optional search/filter inside the history modal
  const [historyUserQuery, setHistoryUserQuery] = useState<string>("");
  const filteredUsersInModal = React.useMemo(() => {
    const users: any[] = Array.isArray(historyData?.users)
      ? historyData!.users
      : [];
    if (!historyUserQuery.trim()) return users;
    const q = historyUserQuery.trim().toLowerCase();
    return users.filter((u) => {
      const nm = resolveUserDisplayName(
        u.userId,
        historyData?.userNameMap
      ).toLowerCase();
      const uid = String(u.userId || "").toLowerCase();
      return nm.includes(q) || uid.includes(q);
    });
  }, [historyUserQuery, historyData]);

  const [recipientName, setRecipientName] = useState<string>("");
  const resolvedUserIdRef = React.useRef<string>("");

  if (!resolvedUserIdRef.current) {
    const id = getUserId();
    resolvedUserIdRef.current =
      id && id !== "null" && id !== "undefined" ? id : "";
  }

  // 👉 Use this everywhere
  const resolvedUserId = resolvedUserIdRef.current;

  async function resolveRecipientName(): Promise<string> {
    const idCandidates = [
      resolvedUserId,
      data?.userId || "",
      localStorage.getItem("customerId") || "",
      localStorage.getItem("userId") || "",
    ].filter(Boolean);

    for (const candidate of idCandidates) {
      try {
        const url = new URL(
          "/api/user-service/customerProfileDetails",
          BASE_URL
        );
        url.searchParams.set("customerId", candidate);
        const res = await authFetch(url.toString(), { method: "GET" });
        const txt = await res.text().catch(() => "");
        if (!res.ok) continue;

        const json = txt ? JSON.parse(txt) : {};
        const first =
          (typeof json?.firstName === "string" && json.firstName.trim()) ||
          (typeof json?.userFirstName === "string" &&
            json.userFirstName.trim()) ||
          "";
        const last =
          (typeof json?.lastName === "string" && json.lastName.trim()) ||
          (typeof json?.userLastName === "string" &&
            json.userLastName.trim()) ||
          "";

        const full = [first, last].filter(Boolean).join(" ").trim();
        if (full) return full;
      } catch {
        // continue to next candidate
      }
    }
    return "";
  }

  // Put near other helpers
  const normalizeId = (v: any) =>
    v === null || v === undefined ? "" : String(v).trim();

  function filterHistoryByUser(rawList: any[], selected?: string | null) {
    if (!Array.isArray(rawList)) return [];
    const sel = normalizeId(selected);
    if (!sel) return [];
    return rawList.filter((row) => {
      const a = normalizeId(row?.userId);
      const b = normalizeId((row as any)?.user_id);
      const c = normalizeId((row as any)?.uid);
      return a === sel || b === sel || c === sel;
    });
  }

  const [certLoadingFor, setCertLoadingFor] = useState<string | null>(null);

  async function generateCertificate(agent: Assistant) {
    if (!agent?.id || !agent?.agentName) {
      return message.error("Missing agentId or agentName.");
    }

    try {
      setCertLoadingFor(agent.id);

      // ============================
      // 1️⃣ Get Recipient Name
      // ============================
      let nameToUse = (recipientName || "").trim();
      if (!nameToUse) {
        const fresh = await resolveRecipientName();
        if (fresh) {
          setRecipientName(fresh);
          nameToUse = fresh;
        }
      }

      if (!nameToUse) {
        setCertLoadingFor(null);
        return message.warning(
          "Please enter your first name to generate the certificate."
        );
      }

      // ============================
      // 2️⃣ Get Profile Details API
      // ============================
      const profileUrl = new URL(
        "/api/user-service/customerProfileDetails",
        BASE_URL
      );
      profileUrl.searchParams.set("customerId", resolvedUserId);

      const profileRes = await authFetch(profileUrl.toString(), {
        method: "GET",
      });
      const profileText = await profileRes.text().catch(() => "");

      if (!profileRes.ok) {
        throw new Error("Failed to load user profile details.");
      }

      const profile = profileText ? JSON.parse(profileText) : {};

      // ============================
      // 3️⃣ Extract Email + Contact Number
      // ============================
      const email = profile?.email || profile?.userEmail || "";

      const contactNumber =
        profile?.whatsappNumber || profile?.mobileNumber || "";

      if (!email) {
        return message.error("Email is missing in your profile.");
      }

      if (!contactNumber) {
        return message.error("Contact Number is missing in your profile.");
      }

      // ============================
      // 4️⃣ Build Certificate API URL
      // ============================
      const url = new URL(
        "/api/ai-service/agent/downloadAiCertificate",
        BASE_URL
      );

      url.searchParams.set("agentId", agent.id);
      url.searchParams.set(
        "agentName",
        agent.agentName || agent.name || "AI Agent"
      );
      url.searchParams.set("recipientName", nameToUse);

      // ✔ Correct backend fields
      url.searchParams.set("contactNumber", contactNumber);
      url.searchParams.set("email", email);

      // ============================
      // 5️⃣ Call API
      // ============================
      const res = await authFetch(url.toString(), { method: "POST" });
      const txt = await res.text().catch(() => "");

      if (!res.ok) {
        throw new Error(
          `Certificate generation failed (${res.status})${
            txt ? `: ${txt}` : ""
          }`
        );
      }

      const json = txt ? JSON.parse(txt) : {};
      const urlFromApi =
        json?.certificateUrl || json?.url || json?.downloadUrl || null;

      if (urlFromApi) {
        window.open(urlFromApi, "_blank", "noopener,noreferrer");
      } else {
        message.success("Certificate generated successfully.");
      }

      await refreshData();
    } catch (err: any) {
      message.error(err?.message || "Failed to generate certificate.");
    } finally {
      setCertLoadingFor(null);
    }
  }

  useEffect(() => {
    (async () => {
      const name = await resolveRecipientName();
      if (name) setRecipientName(name);
    })();
    // only on mount or when user changes
  }, [resolvedUserId, data?.userId]);

  // 🔎 Selected user detail view for full history
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Parse your prompt string into [{role, content}] safely (full text, no trimming)
  function parsePromptToMessages(
    prompt?: string
  ): { role: string; content: string }[] {
    if (!prompt) return [];
    // Strip surrounding [ ... ] if present
    let t = String(prompt)
      .trim()
      .replace(/^\s*\[\s*|\s*\]\s*$/g, "");
    // Grab each {...} block
    const objs = t.match(/\{[^}]*\}/g) || [];
    const out: { role: string; content: string }[] = [];
    for (const raw of objs) {
      // role=user, content=...
      const r = /role\s*=\s*(user|assistant)/i.exec(raw);
      const c = /content\s*=\s*([\s\S]*)$/i.exec(raw);
      const role = (r?.[1] || "").toLowerCase();
      // Remove trailing } and trim spaces for content
      const content = (c?.[1] || "").replace(/\}\s*$/, "").trim();
      if (role) out.push({ role, content });
    }
    return out;
  }

  const gotoStore = () => navigate("/main/agentcreate");

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

  function normalizeCreatorAgentDetails(raw: any) {
    const list = Array.isArray(raw?.agentChatListList)
      ? raw.agentChatListList
      : [];

    // Aggregate per-user chat counts
    const byUser: Record<
      string,
      {
        userId: string;
        name?: string;
        chats: number;
        lastChatAt?: string | null;
      }
    > = {};
    // inside normalizeCreatorAgentDetails(raw)
    list.forEach((e: any) => {
      const uid = String(e?.userId ?? "unknown"); // ✅ force string
      if (!byUser[uid]) {
        byUser[uid] = {
          userId: uid,
          name: e?.name,
          chats: 0,
          lastChatAt: e?.createdAt ?? null,
        };
      }
      byUser[uid].chats += 1;
      if (
        e?.createdAt &&
        (!byUser[uid].lastChatAt ||
          new Date(e.createdAt) > new Date(byUser[uid].lastChatAt!))
      ) {
        byUser[uid].lastChatAt = e.createdAt;
      }
    });

    const users = Object.values(byUser).sort((a, b) => b.chats - a.chats);

    return {
      agentName: raw?.agentName ?? null,
      agentId: raw?.agentId ?? null,
      creatorName: raw?.creatorName ?? null,
      totalChats: list.length,
      totalUsers: users.length,
      users,
      // keep whole raw for detail view filtering
      rawList: list,
      // quick map for showing names in detail view
      userNameMap: users.reduce((m, u) => {
        m[u.userId] = u.name || null;
        return m;
      }, {} as Record<string, string | null>),
    };
  }
  useEffect(() => {
    if (!historyOpenFor) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [historyOpenFor]);

  async function fetchCreatorAgentDetails(agentId: string, userId: string) {
    if (!agentId || !userId) {
      message.error("Missing agentId or userId.");
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    setHistoryData(null);

    try {
      const url = new URL(
        "/api/ai-service/agent/getCreatorAgentDeatils",
        BASE_URL
      );
      url.searchParams.set("agentId", agentId);
      url.searchParams.set("userId", userId);

      const res = await authFetch(url.toString(), { method: "GET" });
      const text = await res.text().catch(() => "");
      if (!res.ok) {
        throw new Error(
          `Request failed (${res.status})${text ? `: ${text}` : ""}`
        );
      }

      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      setHistoryData(normalizeCreatorAgentDetails(json));
    } catch (e: any) {
      setHistoryError(e?.message || "Failed to load user history.");
    } finally {
      setHistoryLoading(false);
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
    const res = await authFetch(`${BASE_URL}/ai-service/agent/save-image-url`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

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

  const { xs } = Grid.useBreakpoint();
  /** AntD Button size & layout become compact on phones, roomy on desktop */
  const btnSize: "small" | "middle" | "large" = xs ? "small" : "middle";
  /** On phones, buttons expand to full width; on larger screens they flow inline */
  const btnBlock = !!xs;
  const safeSelectedUserId = normalizeId(selectedUserId);
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
        throw new Error(
          `Fetch AI image failed: ${res.status}${txt ? ` ${txt}` : ""}`
        );
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
        const got = await getAiProfileImage(
          pendingSave.agentId,
          pendingSave.userId
        );
        if (!cancelled && got?.imageUrl) {
          setPreviewSrc(got.imageUrl);
        }

        // 3) Refresh list so profileImagePath (highest priority) shows up
        await refreshData();
        if (!cancelled) message.success("Profile image saved.");
      } catch (err: any) {
        if (!cancelled)
          message.error(err?.message || "Failed to save profile image.");
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

  const usersPaneRef = useRef<HTMLDivElement | null>(null);
  const chatPaneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only on small screens: scroll right/chat pane into view after selection
    if (selectedUserId) {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile && chatPaneRef.current) {
        // wait for DOM to paint messages
        requestAnimationFrame(() => {
          chatPaneRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    }
  }, [selectedUserId]);

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

  const openEditAgent = (a: Assistant) => {
    // pick latest conversations for this agent if available
    const convList = conversationsByAgent[a.id] || [];
    const latest = [...convList].sort(
      (x, y) =>
        new Date(y.createdAt || "").getTime() -
        new Date(x.createdAt || "").getTime()
    )[0];

    setEditAgent({
      ...a,
      // keep only 2 conversation starters
      conStarter1:
        latest?.conStarter1 || a.conStarter1 || (a as any).conStarter1 || "",
      conStarter2:
        latest?.conStarter2 || a.conStarter2 || (a as any).conStarter2 || "",
      conStarter3: null,
      conStarter4: null,
      // keep existing instructions
      instructions: (a.instructions || "").trim(),
    });
  };

  const regenerateInstructionsForEdit = async () => {
    if (!editAgent) return;

    const desc = (editAgent.description || "").trim();
    if (!desc) {
      message.error("Please enter Description before generating instructions.");
      return;
    }

    setEditInstrLoading(true);
    try {
      const url = `${BASE_URL}/ai-service/agent/classifyInstruct?description=${encodeURIComponent(
        cleanForTransport(desc)
      )}`;

      const res = await authFetch(url, { method: "POST" });
      const text = await res.text().catch(() => "");

      if (!res.ok) {
        throw new Error(
          `Generate instructions failed (${res.status})${
            text ? `: ${text}` : ""
          }`
        );
      }

      let instr = text;
      try {
        const maybe = JSON.parse(text);
        if (typeof maybe === "string") instr = maybe;
        else if (maybe && typeof maybe === "object") {
          instr =
            (maybe as any).instructions ||
            (maybe as any).result ||
            (maybe as any).message ||
            text;
        }
      } catch {
        // keep as text
      }

      let cleaned = cleanInstructionText(instr);

      if (cleaned.length > MAX_INSTRUCTIONS_CHARS) {
        cleaned = cleaned.slice(0, MAX_INSTRUCTIONS_CHARS);
        message.error(
          `Instructions cannot exceed ${MAX_INSTRUCTIONS_CHARS} characters. Extra text was trimmed.`
        );
      }

      if (!cleaned) {
        message.warning("No instructions returned. Please try again.");
        return;
      }

      setEditAgent((prev) =>
        prev ? { ...prev, instructions: cleaned } : prev
      );
      message.success("Instructions generated.");
    } catch (e: any) {
      message.error(e?.message || "Failed to generate instructions.");
    } finally {
      setEditInstrLoading(false);
    }
  };

  const regenerateStartersForEdit = async () => {
    if (!editAgent) return;

    const desc = (editAgent.description || "").trim();
    if (!desc) {
      message.error(
        "Please enter Description before generating conversation starters."
      );
      return;
    }

    setEditStarterLoading(true);
    try {
      const url = `${BASE_URL}/ai-service/agent/classifyStartConversation?description=${encodeURIComponent(
        cleanForTransport(desc)
      )}`;

      const res = await authFetch(url, { method: "POST" });
      const text = await res.text().catch(() => "");

      if (!res.ok) {
        throw new Error(
          `Generate conversation starters failed (${res.status})${
            text ? `: ${text}` : ""
          }`
        );
      }

      const prompts = parseStartersFromText(text);
      if (!prompts.length) {
        message.warning(
          "No conversation starters returned. Please tweak your Description and try again."
        );
        return;
      }

      setEditAgent((prev) =>
        prev
          ? {
              ...prev,
              conStarter1: (prompts[0] || prev.conStarter1 || "").slice(
                0,
                MAX_CONVERSATION_STARTER_CHARS
              ),
              conStarter2: (prompts[1] || prev.conStarter2 || "").slice(
                0,
                MAX_CONVERSATION_STARTER_CHARS
              ),
              conStarter3: null,
              conStarter4: null,
            }
          : prev
      );

      if (prompts[0] && prompts[0].length > MAX_CONVERSATION_STARTER_CHARS) {
        message.error(
          `Conversation Starter 1 was trimmed to ${MAX_CONVERSATION_STARTER_CHARS} characters.`
        );
      }
      if (prompts[1] && prompts[1].length > MAX_CONVERSATION_STARTER_CHARS) {
        message.error(
          `Conversation Starter 2 was trimmed to ${MAX_CONVERSATION_STARTER_CHARS} characters.`
        );
      }
      message.success(
        `Updated ${Math.min(2, prompts.length)} conversation starters.`
      );
    } catch (e: any) {
      message.error(e?.message || "Failed to generate conversation starters.");
    } finally {
      setEditStarterLoading(false);
    }
  };

  const saveEditAgent = async () => {
    if (!editAgent) return;

    try {
      setEditLoading(true);

      const payload = {
        // 🔹 Identity
        agentId: editAgent.id,
        assistantId: editAgent.assistantId,
        userId: resolvedUserId,

        // 🔹 Core fields (same as create)
        agentName: editAgent.agentName,
        description: editAgent.description,
        roleUser: editAgent.roleUser,
        goals: editAgent.goals,
        purpose: editAgent.purpose,
        view: editAgent.view,

        // 🔹 Extra profile/business fields – send as-is (even if unchanged)
        status: editAgent.status,
        agentStatus: editAgent.agentStatus,
        userRole: editAgent.userRole,
        userExperience: editAgent.userExperience,
        userExperienceSummary: editAgent.userExperienceSummary,
        domain: editAgent.domain,
        subDomain: editAgent.subDomain,
        targetUser: editAgent.targetUser,
        mainProblemSolved: editAgent.mainProblemSolved,
        acheivements: editAgent.acheivements,
        uniqueSolution: editAgent.uniqueSolution,
        usageModel: editAgent.usageModel,
        language: editAgent.language,
        business: editAgent.business,
        responseFormat: editAgent.responseFormat,
        freeTrial: editAgent.freeTrial,
        tool: editAgent.tool,
        ageLimit: editAgent.ageLimit,
        gender: editAgent.gender,
        converstionTone: editAgent.converstionTone,
        contactDetails: editAgent.contactDetails,

        // 🔹 Instructions + conversation starters (updated)
        instructions: editAgent.instructions || "",
        conStarter1: editAgent.conStarter1 || "",
        conStarter2: editAgent.conStarter2 || "",
        conStarter3: null,
        conStarter4: null,
      };

      const res = await authFetch(
        `${BASE_URL}/ai-service/agent/newAgentPublish`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      const txt = await res.text();
      if (!res.ok) throw new Error(txt || "Update failed");

      message.success("Agent updated successfully!");
      setEditAgent(null);
      refreshData();
    } catch (err: any) {
      message.error(err.message || "Failed to update agent");
    } finally {
      setEditLoading(false);
    }
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
        <Button
          style={{
            backgroundColor: "#1ab394",
            color: "white",
            borderColor: "#1ab394",
          }}
          icon={<PlayCircleOutlined />}
          size={btnSize}
          block={btnBlock}
          onClick={gotoStore}
        >
          Bharath AI Store
        </Button>
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
            <Button
              danger
              size={btnSize}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
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
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  size={btnSize}
                  block={btnBlock}
                  onClick={gotoStore}
                >
                  Create Your First Agent
                </Button>
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
                                  className="
    absolute 
    right-1 bottom-1 
    sm:right-1 sm:bottom-1 
    md:-right-1 md:-bottom-1
    h-7 w-7 sm:h-6 sm:w-6 md:h-8 md:w-8
    rounded-full 
    bg-white border border-purple-200 
    shadow-md 
    flex items-center justify-center 
    hover:scale-105 hover:shadow-lg 
    active:scale-95 
    transition-all duration-200 ease-in-out
  "
                                >
                                  {isUploadingImg || genLoadingFor === a.id ? (
                                    // 🔄 Loading spinner
                                    <svg
                                      className="animate-spin h-4 w-4 sm:h-3.5 sm:w-3.5 text-purple-600"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        className="opacity-25"
                                      />
                                      <path
                                        d="M4 12a8 8 0 0 1 8-8"
                                        fill="currentColor"
                                        className="opacity-75"
                                      />
                                    </svg>
                                  ) : (
                                    // 📷 Camera icon
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-purple-700"
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
                      <div className="mb-4 text-sm text-purple-800 line-clamp-5 flex-grow">
                        {a.description || "No description provided."}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-purple-700 mb-4">
                        <div className="line-clamp-3">
                          <span className="font-medium">Role User:</span>{" "}
                          {a.roleUser}
                        </div>
                        <div>
                          <span className="font-medium">Goals:</span> {a.goals}
                        </div>
                        <div className="line-clamp-3">
                          <span className="font-medium">Purpose:</span>{" "}
                          {a.purpose}
                        </div>
                        <div className="line-clamp-3">
                          <span className="font-medium">View:</span> {a.view}
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

                        <Button
                          size="small"
                          onClick={() =>
                            a.assistantId
                              ? fetchUploadedFiles(a.assistantId)
                              : message.error("Missing assistantId.")
                          }
                          loading={!!loadingFiles[a.assistantId || ""]}
                        >
                          View Files
                        </Button>

                        {/* ✅ Action Buttons: Edit | View | Delete */}
                        <div className="flex gap-2 ml-auto flex-wrap justify-end w-full sm:w-auto">
                          {/* Responsive action row — User History + Certificate */}
                          <div
                            className={`mt-3 w-full flex flex-wrap items-center gap-2 sm:gap-2.5
    ${
      a.status === "APPROVED" && a.assistantId ? "justify-start" : "justify-end"
    }`}
                            style={{
                              paddingRight:
                                a.status !== "APPROVED" ? "4px" : "0px",
                            }}
                          >
                            {/* A single source of truth for equal button sizing */}
                            {/*
    w-[148px] on mobile; w-[168px] on sm+.
    h-9 keeps heights identical.
  */}
                            {(() => {
                              const baseBtn =
                                "inline-flex items-center justify-center gap-1.5 h-9 w-[148px] sm:w-[168px] " +
                                "rounded-md text-[11px] sm:text-xs font-semibold transition-all shadow-sm " +
                                "disabled:opacity-60 disabled:cursor-not-allowed truncate";

                              return (
                                <>
                                  {/* User History Button (always visible) */}
                                  <button
                                    onClick={() => {
                                      setSelectedUserId(null);
                                      setHistoryOpenFor(a.id);
                                      fetchCreatorAgentDetails(
                                        a.id,
                                        resolvedUserId
                                      );
                                    }}
                                    title="View public chat history (creator view)"
                                    className={`${baseBtn} border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4 flex-none"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span className="truncate">
                                      User History
                                    </span>
                                  </button>

                                  {/* Certificate actions — only for Approved + assistantId */}
                                  {a.assistantId &&
                                    a.status === "APPROVED" &&
                                    (a.certificateUrl ? (
                                      <a
                                        href={a.certificateUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        title="Download AI Agent Certificate"
                                        aria-label="Download Certificate"
                                        className={`${baseBtn} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-3.5 h-3.5 flex-none"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M12 5c-5.5 0-9.6 5.1-10 6 .4.9 4.5 6 10 6s9.6-5.1 10-6c-.4-.9-4.5-6-10-6Zm0 9.5A3.5 3.5 0 1 1 12 7a3.5 3.5 0 0 1 0 7.5Z" />
                                        </svg>
                                        <span className="truncate">
                                          Download Certificate
                                        </span>
                                      </a>
                                    ) : (
                                      <button
                                        disabled={certLoadingFor === a.id}
                                        onClick={() => generateCertificate(a)}
                                        title="Generate AI Agent Certificate"
                                        aria-label="Generate Certificate"
                                        className={`${baseBtn} border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100`}
                                      >
                                        {certLoadingFor === a.id ? (
                                          <svg
                                            className="animate-spin h-3.5 w-3.5 flex-none"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth="4"
                                            />
                                            <path
                                              className="opacity-75"
                                              d="M4 12a8 8 0 018-8"
                                              fill="currentColor"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5 flex-none"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M6 2a1 1 0 00-1 1v16.382l3.447-1.724a2 2 0 011.106-.15L12 18l2.447-.492a2 2 0 011.106.15L19 19.382V3a1 1 0 10-2 0v12.618l-1.553-.776a4 4 0 00-2.212-.3L12 15.764l-1.235-.222a4 4 0 00-2.212.3L7 15.618V3a1 1 0 00-1-1z" />
                                          </svg>
                                        )}
                                        <span className="truncate">
                                          {certLoadingFor === a.id
                                            ? "Generating Certificate…"
                                            : "Generate Certificate"}
                                        </span>
                                      </button>
                                    ))}
                                </>
                              );
                            })()}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
                            {/* 👁️ View Button */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/${a.assistantId}/${a.id}/${a.agentName}`
                                )
                              }
                              title="View Agent in a new tab"
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold 
      bg-[#008cba] text-white
      hover:bg-[#0073a0] transition-all shadow-sm
      flex-1 sm:flex-none justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M12 5c-5.5 0-9.6 5.1-10 6 .4.9 4.5 6 10 6s9.6-5.1 10-6c-.4-.9-4.5-6-10-6Zm0 9.5A3.5 3.5 0 1 1 12 7a3.5 3.5 0 0 1 0 7.5Z" />
                              </svg>
                              <span>View</span>
                            </button>

                            {/* ✏️ Edit Button (same row) */}
                            <button
                              onClick={() => openEditAgent(a)}
                              title="Edit AI Agent"
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold 
      bg-gradient-to-r from-purple-600 to-purple-700 text-white
      hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm
      flex-1 sm:flex-none justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.84 1.84 3.75 3.75 1.84-1.84Z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            {/* 🗑️ Delete Button */}
                            <button
                              onClick={() => setDeleteConfirmId(a.id)}
                              title="Delete Agent"
                              disabled={deleting === a.id}
                              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold
      bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm
      disabled:opacity-60 disabled:cursor-not-allowed flex-1 sm:flex-none"
                            >
                              {deleting === a.id ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4"
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
                                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                    ></path>
                                  </svg>
                                  <span>Deleting…</span>
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 0 0 0 2h.293l.853 12.18A2 2 0 0 0 7.14 21h9.72a2 2 0 0 0 1.994-1.82L19.707 7H20a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3H9Z" />
                                  </svg>
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          </div>
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

                      {/* Files Modal (AntD) */}
                      <Modal
                        open={!!fileModalOpen}
                        onCancel={() => setFileModalOpen(null)}
                        footer={null}
                        centered
                        width={880}
                        destroyOnClose
                        maskClosable
                        bodyStyle={{
                          maxHeight: "72vh",
                          overflowY: "auto",
                          padding: 20,
                          background: "#fff",
                        }}
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                height: 32,
                                width: 32,
                                borderRadius: 8,
                                background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
                                display: "grid",
                                placeItems: "center",
                                color: "#fff",
                                fontWeight: 700,
                              }}
                            >
                              ⬆
                            </div>
                            <span style={{ color: "#1f1f1f", fontWeight: 700 }}>
                              Uploaded Files
                            </span>
                          </div>
                        }
                      >
                        {loadingFiles[fileModalOpen || ""] ? (
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
                        ) : (filesMap[fileModalOpen || ""] || []).length ===
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
                            {(filesMap[fileModalOpen || ""] || []).map((f) => {
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
                                    <div
                                      className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-lg"
                                      style={{
                                        background: LAVENDER_BG,
                                        display: "grid",
                                        placeItems: "center",
                                      }}
                                    >
                                      📄
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div
                                        className="text-sm font-medium text-gray-900 truncate"
                                        title={displayName}
                                      >
                                        {displayName}
                                      </div>
                                      <div className="mt-3 flex flex-wrap gap-8">
                                        {f.url && (
                                          <a
                                            href={f.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs px-0 py-0 underline"
                                            style={{ color: PURPLE }}
                                          >
                                            Open
                                          </a>
                                        )}
                                        {idToRemove && (
                                          <Button
                                            danger
                                            size="small"
                                            onClick={() =>
                                              removeUploadedFile(
                                                fileModalOpen!,
                                                idToRemove
                                              )
                                            }
                                            loading={
                                              removingFileId === idToRemove
                                            }
                                          >
                                            {removingFileId === idToRemove
                                              ? "Removing…"
                                              : "Remove"}
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </Modal>

                      {/* Confirm Generated Image (AntD) */}
                      <Modal
                        open={!!(genPreviewUrl && genPreviewAssistantId)}
                        onCancel={() => {
                          setGenPreviewUrl(null);
                          setGenPreviewAssistantId(null);
                        }}
                        footer={null}
                        centered
                        width={720}
                        destroyOnClose
                        maskClosable
                        bodyStyle={{ padding: 20, background: "#fff" }}
                        title={
                          <span style={{ color: "#1f1f1f", fontWeight: 700 }}>
                            Use this as profile?
                          </span>
                        }
                      >
                        <div className="w-full rounded-xl overflow-hidden bg-gray-50 border">
                          {genPreviewUrl && (
                            <img
                              src={genPreviewUrl}
                              alt="Generated profile"
                              className="w-full h-[280px] object-contain bg-white"
                            />
                          )}
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          We won’t show any “prompt” details — only the image is
                          used.
                        </p>

                        <div className="mt-5 grid gap-2 sm:grid-cols-3">
                          <Button
                            type="primary"
                            size="middle"
                            style={{ background: PURPLE, borderColor: PURPLE }}
                            onClick={() => {
                              const agent = (data?.assistants || []).find(
                                (x) => x.assistantId === genPreviewAssistantId
                              );
                              const uid = resolvedUserId;
                              setGenPreviewUrl(null);
                              setGenPreviewAssistantId(null);
                              if (!agent?.id || !uid)
                                return message.error(
                                  "Missing agentId or userId."
                                );
                              setPendingSave({
                                agentId: agent.id,
                                imageUrl: genPreviewUrl!,
                                userId: uid,
                              });
                            }}
                          >
                            Use as Profile
                          </Button>

                          <Button
                            onClick={() => {
                              const asst = (data?.assistants || []).find(
                                (x) => x.assistantId === genPreviewAssistantId
                              );
                              setGenPreviewUrl(null);
                              setGenPreviewAssistantId(null);
                              if (asst) generateProfilePicForAssistant(asst);
                            }}
                          >
                            Generate again
                          </Button>

                          <Button
                            onClick={() => {
                              const agent = (data?.assistants || []).find(
                                (x) => x.assistantId === genPreviewAssistantId
                              );
                              const picker = document.getElementById(
                                `img_${agent?.id || ""}`
                              ) as HTMLInputElement | null;
                              if (picker) picker.click();
                              setGenPreviewUrl(null);
                              setGenPreviewAssistantId(null);
                            }}
                          >
                            Upload Profile…
                          </Button>
                        </div>
                      </Modal>

                      {/* Image Preview (AntD) */}
                      <Modal
                        open={!!previewSrc}
                        onCancel={() => setPreviewSrc(null)}
                        footer={null}
                        centered
                        width="min(92vw, 980px)"
                        destroyOnClose
                        maskClosable
                        bodyStyle={{ padding: 0, background: "#000" }}
                      >
                        {previewSrc && (
                          <img
                            src={previewSrc}
                            alt="Profile preview"
                            style={{
                              maxHeight: "86vh",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </Modal>

                      <Modal
                        open={!!historyOpenFor}
                        onCancel={() => {
                          setHistoryOpenFor(null);
                          setSelectedUserId(null);
                          setHistoryUserQuery("");
                        }}
                        footer={null}
                        centered
                        // Fixed but responsive max width
                        width="min(94vw, 960px)"
                        destroyOnClose
                        maskClosable
                        closeIcon={null}
                        // Keep the body lean; let inner panes scroll
                        bodyStyle={{
                          padding: 0,
                          background: "#fff",
                          maxHeight: "82vh",
                          overflow: "hidden",
                        }}
                        title={
                          <div className="flex items-center justify-between gap-2">
                            {/* Left: Title + meta */}
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-600 to-purple-700 text-white grid place-items-center">
                                <MessageOutlined />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[14px] font-semibold text-purple-900 truncate">
                                  Users Chat History
                                </div>
                                {historyData?.agentName && (
                                  <div className="text-[11px] text-gray-500 truncate">
                                    Agent: {historyData.agentName} • Users:{" "}
                                    {historyData?.totalUsers ?? 0} • Chats:{" "}
                                    {historyData?.totalChats ?? 0}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Clear + Close */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="small"
                                icon={<ClearOutlined />}
                                onClick={() => {
                                  setSelectedUserId(null);
                                  setHistoryUserQuery("");
                                }}
                              >
                                Clear
                              </Button>
                              <Button
                                size="small"
                                type="primary"
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                  setHistoryOpenFor(null);
                                  setSelectedUserId(null);
                                  setHistoryUserQuery("");
                                }}
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        }
                      >
                        {/* Two-pane layout that scrolls correctly on mobile */}
                        <div className="flex flex-col md:flex-row h-[74vh]">
                          {/* LEFT: Users */}
                          <aside className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-gray-100 flex flex-col min-h-0">
                            {/* Search (compact) */}
                            <div className="p-2.5 md:p-3 sticky top-0 bg-white z-10 border-b border-gray-100">
                              <Input
                                allowClear
                                size="small"
                                prefix={
                                  <UserOutlined style={{ color: "#8b5cf6" }} />
                                }
                                placeholder="Search name or User ID…"
                                value={historyUserQuery}
                                onChange={(e) =>
                                  setHistoryUserQuery(e.target.value)
                                }
                                className="text-[13px]"
                              />
                            </div>

                            {/* Scroll area */}
                            <div className="flex-1 min-h-0 overflow-y-auto">
                              {historyLoading && (
                                <div className="flex items-center justify-center p-8">
                                  <Spin tip="Loading chat users…" />
                                </div>
                              )}

                              {!historyLoading && historyError && (
                                <div className="p-4 text-center">
                                  <p className="text-sm text-red-600 font-medium mb-2">
                                    Failed to load history
                                  </p>
                                  <p className="text-xs text-gray-500 mb-3">
                                    {historyError}
                                  </p>
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      fetchCreatorAgentDetails(
                                        historyOpenFor!,
                                        resolvedUserId
                                      )
                                    }
                                  >
                                    Retry
                                  </Button>
                                </div>
                              )}

                              {!historyLoading && !historyError && (
                                <ul className="divide-y divide-gray-100">
                                  {(filteredUsersInModal || []).map(
                                    (u: any) => {
                                      const isActive =
                                        String(selectedUserId || "") ===
                                        String(u.userId || "");
                                      const label = resolveUserDisplayName(
                                        u.userId,
                                        historyData?.userNameMap
                                      );

                                      return (
                                        <li
                                          key={normalizeId(u.userId)}
                                          role="button"
                                          tabIndex={0}
                                          onClick={() => {
                                            const id = normalizeId(u.userId);
                                            setSelectedUserId(id);

                                            // On phones, bring the chat pane into view right away
                                            if (
                                              window.matchMedia(
                                                "(max-width: 767px)"
                                              ).matches
                                            ) {
                                              requestAnimationFrame(() => {
                                                document
                                                  .getElementById("chat-pane")
                                                  ?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                  });
                                              });
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" ||
                                              e.key === " "
                                            )
                                              setSelectedUserId(
                                                normalizeId(u.userId)
                                              );
                                          }}
                                          className={`p-2.5 md:p-3 cursor-pointer transition ${
                                            normalizeId(selectedUserId) ===
                                            normalizeId(u.userId)
                                              ? "bg-purple-50/80"
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                              <div className="text-[13px] font-semibold text-gray-900 truncate">
                                                {label}
                                              </div>
                                              {!!u.lastChatAt && (
                                                <div className="text-[11px] text-gray-500 truncate">
                                                  Last chat:{" "}
                                                  {fmtDate(u.lastChatAt)}
                                                </div>
                                              )}
                                            </div>
                                            <Tag
                                              color="purple"
                                              style={{
                                                fontSize: 11,
                                                lineHeight: "18px",
                                                paddingInline: 6,
                                              }}
                                            >
                                              {u.chats} chats
                                            </Tag>
                                          </div>
                                        </li>
                                      );
                                    }
                                  )}

                                  {/* Empty users */}
                                  {(!filteredUsersInModal ||
                                    filteredUsersInModal.length === 0) &&
                                    !historyLoading &&
                                    !historyError && (
                                      <li className="p-6">
                                        <Empty
                                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                                          description={
                                            <div className="text-sm">
                                              <div className="font-semibold text-gray-800">
                                                No chat users yet
                                              </div>
                                              <div className="text-gray-500">
                                                They’ll appear here after the
                                                first chat.
                                              </div>
                                            </div>
                                          }
                                        />
                                      </li>
                                    )}
                                </ul>
                              )}
                            </div>
                          </aside>

                          <section
                            id="chat-pane"
                            ref={chatPaneRef}
                            className="flex-1 min-w-0 flex flex-col min-h-0"
                          >
                            <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-5">
                              {historyLoading && (
                                <div className="h-full grid place-items-center">
                                  <Spin tip="Loading chats…" />
                                </div>
                              )}

                              {!historyLoading && !historyError && (
                                <>
                                  {/* No chats overall */}
                                  {(!historyData?.rawList ||
                                    historyData.rawList.length === 0) && (
                                    <div className="h-full grid place-items-center">
                                      <Empty
                                        description={
                                          <div className="text-sm">
                                            <div className="font-semibold text-gray-800">
                                              No chats found
                                            </div>
                                            <div className="text-gray-500">
                                              This agent has not received any
                                              public chats yet.
                                            </div>
                                          </div>
                                        }
                                      />
                                    </div>
                                  )}

                                  {/* Chats exist but no user selected */}
                                  {historyData?.rawList?.length > 0 &&
                                    !selectedUserId && (
                                      <div className="h-full grid place-items-center text-center px-6">
                                        <div>
                                          <div className="text-sm font-semibold text-gray-900 mb-1">
                                            Select a user to view chat
                                          </div>
                                          <p className="text-[13px] text-gray-500">
                                            Choose a user from the left panel.
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                  {/* Selected user's chat */}
                                  {historyData?.rawList?.length > 0 &&
                                    selectedUserId && (
                                      <div className="space-y-3">
                                        <div className="space-y-2.5">
                                          {filterHistoryByUser(
                                            historyData.rawList,
                                            selectedUserId
                                          ).map((row: any, idx: number) => {
                                            const messages =
                                              parsePromptToMessages(
                                                row?.prompt || ""
                                              );
                                            const ts = row?.createdAt
                                              ? fmtDate(row.createdAt)
                                              : "";
                                            return (
                                              <div
                                                key={`${row?.id || idx}`}
                                                className="rounded-lg border border-gray-100 p-2.5 md:p-3 bg-white shadow-sm"
                                              >
                                                <div className="mb-1.5 flex items-center justify-between">
                                                  <Tag
                                                    style={{
                                                      fontSize: 11,
                                                      lineHeight: "18px",
                                                    }}
                                                  >
                                                    {row?.conversationId
                                                      ? `Conv: ${row.conversationId}`
                                                      : "Conversation"}
                                                  </Tag>
                                                  <span className="text-[11px] text-gray-500">
                                                    {ts}
                                                  </span>
                                                </div>

                                                <div className="space-y-2">
                                                  {messages.length === 0 && (
                                                    <div className="text-[12px] text-gray-500">
                                                      No message payload
                                                      available.
                                                    </div>
                                                  )}

                                                  {messages.map((m, i) => (
                                                    <div
                                                      key={i}
                                                      className={`rounded-md p-2 md:p-2.5 text-[13px] leading-6 ${
                                                        m.role === "user"
                                                          ? "bg-purple-50 text-gray-900"
                                                          : "bg-gray-50 text-gray-800"
                                                      }`}
                                                    >
                                                      <div className="text-[10px] uppercase tracking-wide font-semibold text-gray-500 mb-1">
                                                        {m.role === "user"
                                                          ? "User"
                                                          : "Assistant"}
                                                      </div>
                                                      <div className="whitespace-pre-wrap break-words">
                                                        {m.content}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          </section>
                        </div>
                      </Modal>

                      <Modal
                        open={namePromptOpen}
                        onCancel={() => {
                          setNamePromptOpen(false);
                          setPendingAgentForCert(null);
                        }}
                        onOk={() => {
                          const v = (tempRecipient || "").trim();
                          if (!v) {
                            message.warning("Please enter your first name");
                            return;
                          }
                          setRecipientName(v);
                          setNamePromptOpen(false);
                          if (pendingAgentForCert) {
                            // proceed after capturing the name
                            generateCertificate(pendingAgentForCert);
                            setPendingAgentForCert(null);
                          }
                        }}
                        title="Enter your name for the certificate"
                        okText="Save"
                      >
                        <input
                          autoFocus
                          className="w-full border rounded px-3 py-2"
                          placeholder="Your first name"
                          value={tempRecipient}
                          onChange={(e) => setTempRecipient(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          This will appear as the recipient name on your AI
                          Agent Certificate.
                        </p>
                      </Modal>

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
      <Modal
        open={!!editAgent}
        onCancel={() => !editLoading && setEditAgent(null)}
        onOk={saveEditAgent}
        okText={editLoading ? "Saving..." : "Save"}
        confirmLoading={editLoading}
        title="Edit AI Agent"
        centered
      >
        {editLoading ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <Spin />
          </div>
        ) : editAgent ? (
          <>
            {/* Gradient / glowing Generate buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {/* Generate Instructions */}
              <button
                type="button"
                onClick={regenerateInstructionsForEdit}
                disabled={editInstrLoading}
                className={
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-md transition-all " +
                  "bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 " +
                  (editInstrLoading
                    ? "animate-pulse ring-2 ring-purple-300 ring-offset-2"
                    : "hover:shadow-lg hover:brightness-110")
                }
              >
                {editInstrLoading && (
                  <span className="inline-flex h-3 w-3 rounded-full bg-white/80 animate-ping" />
                )}
                <span className="flex items-center gap-1">
                  <span>
                    {editInstrLoading
                      ? "Generating Instructions…"
                      : "Generate Instructions"}
                  </span>
                </span>
              </button>

              {/* Generate Conversations */}
              <button
                type="button"
                onClick={regenerateStartersForEdit}
                disabled={editStarterLoading}
                className={
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all " +
                  (editStarterLoading
                    ? "bg-gradient-to-r from-sky-400 via-purple-500 to-emerald-400 text-white animate-pulse ring-2 ring-emerald-300 ring-offset-2"
                    : "bg-slate-50 text-slate-900 border border-slate-200 hover:bg-white hover:shadow-md")
                }
              >
                {editStarterLoading && (
                  <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 animate-pulse" />
                )}
                <span className="flex items-center gap-1">
                  <span>
                    {editStarterLoading
                      ? "Generating Conversations…"
                      : "Generate Conversations"}
                  </span>
                </span>
              </button>
            </div>

            {/* Instructions */}
            <p className="mt-4">
              <b>Instructions</b>
            </p>
            <textarea
              className="w-full border p-2 rounded"
              rows={6}
              value={editAgent?.instructions || ""}
              onChange={(e) => {
                const v = e.target.value || "";
                if (v.length > MAX_INSTRUCTIONS_CHARS) {
                  message.error(
                    `Instructions cannot exceed ${MAX_INSTRUCTIONS_CHARS} characters.`
                  );
                }
                const trimmed = v.slice(0, MAX_INSTRUCTIONS_CHARS);
                setEditAgent((prev) =>
                  prev ? { ...prev, instructions: trimmed } : prev
                );
              }}
            />

            {/* Only 2 Conversation Starters */}
            <p className="mt-3">
              <b>Conversation Starter 1</b>
            </p>
            <Input
              className="mb-2"
              value={editAgent?.conStarter1 ?? ""}
              onChange={(e) => {
                const v = e.target.value || "";
                if (v.length > MAX_CONVERSATION_STARTER_CHARS) {
                  message.error(
                    `Conversation Starter 1 cannot exceed ${MAX_CONVERSATION_STARTER_CHARS} characters.`
                  );
                }
                const trimmed = v.slice(0, MAX_CONVERSATION_STARTER_CHARS);
                setEditAgent((prev) =>
                  prev
                    ? {
                        ...prev,
                        conStarter1: trimmed,
                        conStarter3: null,
                        conStarter4: null,
                      }
                    : prev
                );
              }}
            />

            <p className="mt-2">
              <b>Conversation Starter 2</b>
            </p>
            <Input
              className="mb-2"
              value={editAgent?.conStarter2 ?? ""}
              onChange={(e) => {
                const v = e.target.value || "";
                if (v.length > MAX_CONVERSATION_STARTER_CHARS) {
                  message.error(
                    `Conversation Starter 2 cannot exceed ${MAX_CONVERSATION_STARTER_CHARS} characters.`
                  );
                }
                const trimmed = v.slice(0, MAX_CONVERSATION_STARTER_CHARS);
                setEditAgent((prev) =>
                  prev
                    ? {
                        ...prev,
                        conStarter2: trimmed,
                        conStarter3: null,
                        conStarter4: null,
                      }
                    : prev
                );
              }}
            />
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default AllAgentsPage;
