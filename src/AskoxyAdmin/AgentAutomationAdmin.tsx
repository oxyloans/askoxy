import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import { isAxiosError } from "axios";
import type { AxiosError } from "axios";
import {
  Table,
  Button,
  Spin,
  Typography,
  Input,
  Tag,
  Space,
  Select,
  Tooltip,
  Empty,
  Modal,
  message,
  Upload,
  Divider,
  Dropdown,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DownloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileZipOutlined,
  FileTextOutlined,
  RobotOutlined,
  ClearOutlined,
  BulbOutlined,
  DeleteOutlined,
  PlusOutlined,
  RocketOutlined,
  ApartmentOutlined,
  InboxOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BASE_URL from "../Config";
import { getAdminAccessToken } from "../utils/cookieUtils";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;

// ─── API Endpoints ────────────────────────────────────────────────────────────

const GET_ALL_URL = `${BASE_URL}/marketing-service/campgin/agent-automation-get-all`;
const START_URL = `${BASE_URL}/marketing-service/campgin/agent-automation-start`;
const UPDATE_STATUS_URL = `${BASE_URL}/marketing-service/campgin/agent-status-update`;

// ─── Status Enum & Config ─────────────────────────────────────────────────────

export type AgentAutomationStatus =
  | "STARTED"
  | "RESEARCH_DONE"
  | "ZIP_UPLOADED"
  | "COMPLETED"
  | "FAILED";

export const STATUS_CONFIG: Record<
  AgentAutomationStatus,
  { label: string; tagColor: string; icon: React.ReactNode; bg: string; border: string; color: string }
> = {
  STARTED: {
    label: "Started",
    tagColor: "processing",
    icon: <SyncOutlined spin />,
    bg: "#eff6ff",
    border: "#bfdbfe",
    color: "#3b82f6",
  },
  RESEARCH_DONE: {
    label: "Research Done",
    tagColor: "purple",
    icon: <BulbOutlined />,
    bg: "#faf5ff",
    border: "#e9d5ff",
    color: "#8b5cf6",
  },
  ZIP_UPLOADED: {
    label: "ZIP Uploaded",
    tagColor: "warning",
    icon: <FileZipOutlined />,
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#f59e0b",
  },
  COMPLETED: {
    label: "Completed",
    tagColor: "success",
    icon: <CheckCircleOutlined />,
    bg: "#ecfdf5",
    border: "#a7f3d0",
    color: "#10b981",
  },
  FAILED: {
    label: "Failed",
    tagColor: "error",
    icon: <CloseCircleOutlined />,
    bg: "#fef2f2",
    border: "#fecaca",
    color: "#ef4444",
  },
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AgentAutomationItem {
  processId: string;
  userId: string;
  title: string;
  urlMapJson?: Record<string, unknown> | string | null;
  requirementsFileName?: string | null;
  objectiveFileName?: string | null;
  status: AgentAutomationStatus | "PENDING" | "RUNNING" | string;
  zipUrl?: string | null;
  errorMessage?: string | null;
  createdAt: number | string;
  updatedAt: number | string;
}

interface UrlMapRow {
  id: string;
  url: string;
  description: string;
}
const uploadurlwithId = `https://oxybricksv1test.s3.ap-south-1.amazonaws.com/null/${localStorage.getItem("admin_uniquId")}`
export const resolveZipUrl = (zipUrl?: string | null): string => {
  if (!zipUrl) return "";
  const clean = zipUrl.trim();
  if (/^https?:\/\//i.test(clean)) return clean;
  const base = (uploadurlwithId || "").replace(/\/+$/, "");
  const path = clean.startsWith("/") ? clean : `/${clean}`;
  return `${base}${path}`;
};

const formatDate = (val?: number | string | null): string => {
  if (!val) return "—";
  const num = typeof val === "string" ? Number(val) : val;
  const d = Number.isNaN(num) ? dayjs(val) : dayjs(num);
  return d.isValid() ? d.format("DD MMM YYYY") : String(val);
};

const truncateText = (text: string, maxLen = 150): string => {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 3) + "...";
};

const extractErrorMessage = (err: unknown, defaultFallback: string): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (data) {
      // 1. If backend returns an object with errorMessage, message, or error
      if (typeof data === "object" && data !== null) {
        const obj = data as Record<string, unknown>;
        const msg = obj.errorMessage || obj.message || obj.error;
        if (typeof msg === "string" && msg.trim()) {
          return truncateText(msg.trim(), 150);
        }
      }
      // 2. If backend returns a string
      if (typeof data === "string" && data.trim()) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && typeof parsed === "object") {
            const msg = parsed.errorMessage || parsed.message || parsed.error;
            if (typeof msg === "string" && msg.trim()) {
              return truncateText(msg.trim(), 150);
            }
          }
        } catch {
          // Plain text error (ignore raw HTML pages)
          if (!data.includes("<html") && !data.includes("<!DOCTYPE")) {
            return truncateText(data.trim(), 150);
          }
        }
      }
    }
    if (err.response?.statusText) {
      return truncateText(`${defaultFallback} (${err.response.statusText})`, 150);
    }
    if (err.message) {
      return truncateText(err.message, 150);
    }
  } else if (err instanceof Error && err.message) {
    return truncateText(err.message, 150);
  }
  return defaultFallback;
};



const AgentAutomationAdmin: React.FC = () => {
  const [data, setData] = useState<AgentAutomationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Filters & Search
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [artifactFilter, setArtifactFilter] = useState<string>("ALL");

  // ─── Start Automation Modal State ───────────────────────────────────────────
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formUserId, setFormUserId] = useState(
    localStorage.getItem("admin_uniquId") ||
      localStorage.getItem("userId") ||
      "91d2f250-20d0-44a5-9b4e-2acb73118b98"
  );
  const [formAuthToken, setFormAuthToken] = useState(
    getAdminAccessToken() || ""
  );

  // Objective state: mutually exclusive (File vs Text)
  const [objectiveType, setObjectiveType] = useState<"file" | "text" | "">("");
  const [objectiveFile, setObjectiveFile] = useState<File | null>(null);
  const [objectiveText, setObjectiveText] = useState("");

  // Requirements state: mutually exclusive (File vs Text)
  const [requirementsType, setRequirementsType] = useState<"file" | "text" | "">("");
  const [requirementsFile, setRequirementsFile] = useState<File | null>(null);
  const [requirementsText, setRequirementsText] = useState("");

  const handleObjectiveTypeChange = (val: "file" | "text") => {
    setObjectiveType(val);
    if (val === "file") {
      setObjectiveText("");
    } else {
      setObjectiveFile(null);
    }
  };

  const handleRequirementsTypeChange = (val: "file" | "text") => {
    setRequirementsType(val);
    if (val === "file") {
      setRequirementsText("");
    } else {
      setRequirementsFile(null);
    }
  };

  // URL Map state
  const [urlMapRows, setUrlMapRows] = useState<UrlMapRow[]>([
    { id: "1", url: "", description: "" },
  ]);

  // ─── Data Fetching  ─────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<AgentAutomationItem[]>(GET_ALL_URL, {
        headers: { accept: "*/*" },
        timeout: 10000,
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setData(items);
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      console.error("API error fetching agent automations:", err);
      message.error("Could not fetch agent automation records from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Copy to Clipboard ──────────────────────────────────────────────────────

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => message.success(`${label} copied to clipboard!`))
      .catch(() => message.error("Failed to copy to clipboard."));
  };

  // ─── Download Handler ───────────────────────────────────────────────────────

  const handleDownload = (item: AgentAutomationItem) => {
    if (!item.zipUrl) {
      message.warning("No ZIP output file available for this process.");
      return;
    }
    const fullUrl = resolveZipUrl(item.zipUrl);
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    message.success("Opening download link in a new window...");
  };

  // ─── Status Update Handler (PATCH API) ──────────────────────────────────────

  const [updatingProcessId, setUpdatingProcessId] = useState<string | null>(null);

  const handleStatusUpdate = async (item: AgentAutomationItem, newStatus: string) => {
    if (item.status?.toUpperCase() === newStatus.toUpperCase()) return;

    setUpdatingProcessId(item.processId);
    const token = getAdminAccessToken() || "";
    const headers: Record<string, string> = {
      accept: "*/*",
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    const payload = {
      id: item.processId,
      processId: item.processId,
      status: newStatus,
    };

    const updateUrl = `${UPDATE_STATUS_URL}?id=${encodeURIComponent(
      item.processId
    )}&status=${encodeURIComponent(newStatus)}`;

    try {
      await axios.patch(updateUrl, payload, {
        headers,
      });

      message.success(
        `Status updated to "${newStatus}" for "${item.title || item.processId}"`
      );

      setData((prev) =>
        prev.map((d) =>
          d.processId === item.processId ? { ...d, status: newStatus } : d
        )
      );
    } catch (err: unknown) {
      console.error("Failed to update agent status:", err);
      const errorMsg = extractErrorMessage(err, "Failed to update agent status");
      message.error(errorMsg);
    } finally {
      setUpdatingProcessId(null);
    }
  };

  // ─── URL Map Builders & Raw Sync ────────────────────────────────────────────

  const handleAddUrlRow = () => {
    const newRow: UrlMapRow = { id: String(Date.now()), url: "", description: "" };
    setUrlMapRows([...urlMapRows, newRow]);
  };

  const handleUpdateUrlRow = (id: string, field: "url" | "description", val: string) => {
    setUrlMapRows(urlMapRows.map((r) =>
      r.id === id ? { ...r, [field]: val } : r
    ));
  };

  const handleDeleteUrlRow = (id: string) => {
    setUrlMapRows(urlMapRows.filter((r) => r.id !== id));
  };

  // ─── Start Automation Form Submission ───────────────────────────────────────

  const handleStartAutomationSubmit = async () => {
    if (!formTitle.trim()) {
      message.error("Please enter a Title for the automation process.");
      return;
    }
   

    // Prepare URL Map JSON from builder rows
    let finalUrlMap = "";
    const mapObj: Record<string, string> = {};
    urlMapRows.forEach((r) => {
      const u = r.url.trim();
      if (u) mapObj[u] = r.description.trim();
    });
    if (Object.keys(mapObj).length > 0) {
      finalUrlMap = JSON.stringify(mapObj);
    }

    // Build FormData
    const formData = new FormData();
    formData.append("title", formTitle.trim());
    formData.append("userId", localStorage.getItem("admin_uniquId") || "");

    // Mutual exclusivity for Objective: file OR text based on dropdown selection
    if (objectiveType === "file" && objectiveFile) {
      if (!objectiveFile.name.toLowerCase().endsWith(".txt")) {
        message.error("Objective file must be a .txt file.");
        return;
      }
      formData.append("objectiveFile", objectiveFile);
    } else if (objectiveType === "text" && objectiveText.trim()) {
      formData.append("objectiveText", objectiveText.trim());
    } else if (!objectiveType) {
      if (objectiveFile) {
        if (!objectiveFile.name.toLowerCase().endsWith(".txt")) {
          message.error("Objective file must be a .txt file.");
          return;
        }
        formData.append("objectiveFile", objectiveFile);
      } else if (objectiveText.trim()) {
        formData.append("objectiveText", objectiveText.trim());
      }
    }

    // Mutual exclusivity for Requirements: file OR text based on dropdown selection
    if (requirementsType === "file" && requirementsFile) {
      if (!requirementsFile.name.toLowerCase().endsWith(".txt")) {
        message.error("Requirements file must be a .txt file.");
        return;
      }
      formData.append("requirementsFile", requirementsFile);
    } else if (requirementsType === "text" && requirementsText.trim()) {
      formData.append("requirementsText", requirementsText.trim());
    } else if (!requirementsType) {
      if (requirementsFile) {
        if (!requirementsFile.name.toLowerCase().endsWith(".txt")) {
          message.error("Requirements file must be a .txt file.");
          return;
        }
        formData.append("requirementsFile", requirementsFile);
      } else if (requirementsText.trim()) {
        formData.append("requirementsText", requirementsText.trim());
      }
    }

    if (finalUrlMap) {
      formData.append("urlMapJson", finalUrlMap);
    }

    setSubmitting(true);
    const token = formAuthToken.trim();
    const headers: Record<string, string> = {
      accept: "*/*",
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    try {
      await axios.post(START_URL, formData, { headers });
      message.success(
        `Agent automation process "${formTitle}" started successfully!`
      );
      setIsStartModalOpen(false);
      resetStartForm();
      fetchData();
    } catch (err: unknown) {
      console.error("Failed to start agent automation:", err);
      const errorMsg = extractErrorMessage(err, "Failed to start agent automation");
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetStartForm = () => {
    setFormTitle("");
    setObjectiveType("");
    setObjectiveFile(null);
    setObjectiveText("");
    setRequirementsType("");
    setRequirementsFile(null);
    setRequirementsText("");
    setUrlMapRows([{ id: "1", url: "", description: "" }]);
  };

  // ─── Filtered Data & Stats ──────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "ALL") {
        const itemStatus = (item.status || "").toUpperCase();
        if (statusFilter === "STARTED" && (itemStatus === "STARTED" || itemStatus === "RUNNING")) {
          // treat RUNNING as STARTED
        } else if (itemStatus !== statusFilter) {
          return false;
        }
      }

      if (artifactFilter === "HAS_ZIP" && !item.zipUrl) return false;
      if (artifactFilter === "NO_ZIP" && !!item.zipUrl) return false;

      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const processIdMatch = (item.processId || "").toLowerCase().includes(q);
        const userIdMatch = (item.userId || "").toLowerCase().includes(q);
        const reqMatch = (item.requirementsFileName || "").toLowerCase().includes(q);
        const objMatch = (item.objectiveFileName || "").toLowerCase().includes(q);
        const errMatch = (item.errorMessage || "").toLowerCase().includes(q);
        const statusMatch = (item.status || "").toLowerCase().includes(q);

        if (
          !titleMatch &&
          !processIdMatch &&
          !userIdMatch &&
          !reqMatch &&
          !objMatch &&
          !errMatch &&
          !statusMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, artifactFilter, searchText]);

  const stats = useMemo(() => {
    const total = data.length;
    const started = data.filter(
      (d) =>
        (d.status || "").toUpperCase() === "STARTED" ||
        (d.status || "").toUpperCase() === "RUNNING"
    ).length;
    const researchDone = data.filter(
      (d) => (d.status || "").toUpperCase() === "RESEARCH_DONE"
    ).length;
    const zipUploaded = data.filter(
      (d) => (d.status || "").toUpperCase() === "ZIP_UPLOADED"
    ).length;
    const completed = data.filter(
      (d) => (d.status || "").toUpperCase() === "COMPLETED"
    ).length;
    const failed = data.filter(
      (d) =>
        (d.status || "").toUpperCase() === "FAILED" ||
        (d.status || "").toUpperCase() === "ERROR" ||
        !!d.errorMessage
    ).length;
    const withZip = data.filter((d) => !!d.zipUrl).length;

    return { total, started, researchDone, zipUploaded, completed, failed, withZip };
  }, [data]);

  // ─── Status Badge Renderer ──────────────────────────────────────────────────

  const renderStatusTag = (status?: string, hasError?: boolean) => {
    const upper = (status || "").toUpperCase();
    const config = STATUS_CONFIG[upper as AgentAutomationStatus];

    if (config) {
      return (
        <Tag
          icon={config.icon}
          color={config.tagColor}
          style={{ fontSize: 12, padding: "2px 10px", borderRadius: 12 }}
        >
          {upper}
        </Tag>
      );
    }

    if (upper === "RUNNING") {
      return (
        <Tag
          icon={<SyncOutlined spin />}
          color="processing"
          style={{ fontSize: 12, padding: "2px 10px", borderRadius: 12 }}
        >
          RUNNING
        </Tag>
      );
    }

    if (hasError) {
      return (
        <Tag
          icon={<CloseCircleOutlined />}
          color="error"
          style={{ fontSize: 12, padding: "2px 10px", borderRadius: 12 }}
        >
          {upper || "FAILED"}
        </Tag>
      );
    }

    return (
      <Tag
        color="default"
        style={{ fontSize: 12, padding: "2px 10px", borderRadius: 12 }}
      >
        {status || "UNKNOWN"}
      </Tag>
    );
  };

  // ─── Table Columns ──────────────────────────────────────────────────────────

  const columns: ColumnsType<AgentAutomationItem> = [
    {
      title: "S.No",
      key: "sno",
      width: 65,
      align: "center",
      render: (_: unknown, __: AgentAutomationItem, index: number) => (
        <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: "Automation Task",
      key: "task",
      width: 250,
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
      render: (_: unknown, rec: AgentAutomationItem) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Text strong style={{ fontSize: 14, color: "#0f172a" }}>
              {rec.title }
            </Text>
            
          </div>

  </div>
      ),
    },
    {
      title: "Input Files & Config",
      key: "inputs",
      width: 280,
      render: (_: unknown, rec: AgentAutomationItem) => {
        const hasReq = !!rec.requirementsFileName;
        const hasObj = !!rec.objectiveFileName;
        const hasMap = !!rec.urlMapJson;

        if (!hasReq && !hasObj && !hasMap) {
          return (
            <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
              No input files or config
            </Text>
          );
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {hasReq && (
              <Tooltip title={`Requirements File: ${rec.requirementsFileName}`}>
                <Tag
                  icon={<FileTextOutlined style={{ color: "#2563eb", fontSize: 13 }} />}
                  color="blue"
                  style={{
                    fontSize: 12,
                    padding: "3px 8px",
                    borderRadius: 6,
                    margin: 0,
                    maxWidth: 260,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#1e40af" }}>Req:</span>{" "}
                  {rec.requirementsFileName}
                </Tag>
              </Tooltip>
            )}

            {hasObj && (
              <Tooltip title={`Objective File: ${rec.objectiveFileName}`}>
                <Tag
                  icon={<FileTextOutlined style={{ color: "#7c3aed", fontSize: 13 }} />}
                  color="purple"
                  style={{
                    fontSize: 12,
                    padding: "3px 8px",
                    borderRadius: 6,
                    margin: 0,
                    maxWidth: 260,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#6b21a8" }}>Obj:</span>{" "}
                  {rec.objectiveFileName}
                </Tag>
              </Tooltip>
            )}

            {hasMap && (
              <Tag
                color="cyan"
                icon={<ApartmentOutlined style={{ fontSize: 12 }} />}
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  width: "fit-content",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                URL Map Config
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 170,
      align: "center",
      render: (val: string, rec: AgentAutomationItem) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {renderStatusTag(val, !!rec.errorMessage)}
          {rec.errorMessage && (
            <Tooltip title={rec.errorMessage}>
              <Text
                type="danger"
                style={{
                  fontSize: 11,
                  cursor: "pointer",
                  maxWidth: 160,
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {rec.errorMessage}
              </Text>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Output ZIP",
      key: "zipUrl",
      width: 160,
      align: "center",
      render: (_: unknown, rec: AgentAutomationItem) => {
        if (!rec.zipUrl) {
          return (
            <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
              Not generated
            </Text>
          );
        }
        const fullUrl = resolveZipUrl(rec.zipUrl);
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(rec)}
              style={{
                backgroundColor: "#10b981",
                borderColor: "#10b981",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 6,
              }}
            >
              Download
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Timeline",
      key: "timeline",
      width: 180,
      render: (_: unknown, rec: AgentAutomationItem) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ClockCircleOutlined style={{ color: "#64748b", fontSize: 11 }} />
            <Text style={{ fontSize: 12, color: "#1e293b" }}>
              {formatDate(rec.createdAt)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      align: "center",
      render: (_: unknown, rec: AgentAutomationItem) => {
        const isUpdating = updatingProcessId === rec.processId;
        const currentUpper = (rec.status || "").toUpperCase();

        const menuItems = (Object.keys(STATUS_CONFIG) as AgentAutomationStatus[]).map((st) => {
          const cfg = STATUS_CONFIG[st];
          const isCurrent = currentUpper === st;
          return {
            key: st,
            icon: cfg.icon,
            disabled: isCurrent,
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  minWidth: 170,
                  padding: "4px 2px",
                }}
              >
                <span
                  style={{
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? "#0f172a" : "#334155",
                    fontSize: 13,
                  }}
                >
                  {cfg.label}
                </span>
                {isCurrent ? (
                  <Tag
                    color={cfg.tagColor}
                    style={{ margin: 0, fontSize: 10, borderRadius: 10, padding: "0 6px" }}
                  >
                    Current
                  </Tag>
                ) : (
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Set Status</span>
                )}
              </div>
            ),
            onClick: () => handleStatusUpdate(rec, st),
          };
        });

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            disabled={isUpdating}
            placement="bottomRight"
          >
            <Button
              size="middle"
              loading={isUpdating}
              icon={<EditOutlined style={{ color: isUpdating ? undefined : "#008cba" }} />}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12,
                borderColor: "#008cba",
                color: "#008cba",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 2px rgba(0, 140, 186, 0.08)",
              }}
            >
              Update Status <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

 

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {/* ─── Page Header ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
           
            <div>
              <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
                 Agent Automation
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
             Monitor runs, manage files, and start automations.
              </Text>
            </div>
          </div>
        </div>

        <Space size="middle">
          
        
          <Button
            type="primary"
            icon={<RocketOutlined />}
            onClick={() => setIsStartModalOpen(true)}
            style={{
              borderRadius: 8,
              backgroundColor: "#008cba",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            Start New Automation
          </Button>
        </Space>
      </div>


      {/* ─── Metric Stat Cards ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          {
            title: "Total Runs",
            value: stats.total,
            icon: <RobotOutlined />,
            color: "#6366f1",
            bg: "#eef2ff",
            border: "#c7d2fe",
          },
          {
            title: "Started",
            value: stats.started,
            icon: <SyncOutlined spin={stats.started > 0} />,
            color: "#3b82f6",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            title: "Research Done",
            value: stats.researchDone,
            icon: <BulbOutlined />,
            color: "#8b5cf6",
            bg: "#faf5ff",
            border: "#e9d5ff",
          },
          {
            title: "ZIP Uploaded",
            value: stats.zipUploaded,
            icon: <FileZipOutlined />,
            color: "#f59e0b",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            title: "Completed",
            value: stats.completed,
            icon: <CheckCircleOutlined />,
            color: "#10b981",
            bg: "#ecfdf5",
            border: "#a7f3d0",
          },
          {
            title: "Failed / Errors",
            value: stats.failed,
            icon: <CloseCircleOutlined />,
            color: "#ef4444",
            bg: "#fef2f2",
            border: "#fecaca",
          },
        ].map((s) => (
          <div
            key={s.title}
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: `1px solid ${s.border}`,
              background: s.bg,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: 26, color: s.color }}>{s.icon}</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Search & Filters Toolbar ─── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 16,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <Space wrap size="middle">
          <Search
            placeholder="Search title, process ID, user ID, files…"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: 180 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="STARTED">Started</Option>
            <Option value="RESEARCH_DONE">Research Done</Option>
            <Option value="ZIP_UPLOADED">ZIP Uploaded</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="FAILED">Failed</Option>
          </Select>

          <Select
            value={artifactFilter}
            onChange={(val) => setArtifactFilter(val)}
            style={{ width: 170 }}
          >
            <Option value="ALL">All Artifacts</Option>
            <Option value="HAS_ZIP">Has Output ZIP</Option>
            <Option value="NO_ZIP">No ZIP Generated</Option>
          </Select>

          {(searchText || statusFilter !== "ALL" || artifactFilter !== "ALL") && (
            <Button
              icon={<ClearOutlined />}
              onClick={() => {
                setSearchText("");
                setStatusFilter("ALL");
                setArtifactFilter("ALL");
              }}
            >
              Reset Filters
            </Button>
          )}
        </Space>

        <Text type="secondary" style={{ fontSize: 13 }}>
          Showing <b>{filteredData.length}</b> of {data.length} records
        </Text>
      </div>

      {/* ─── Table ─── */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
        }}
      >
        <Spin spinning={loading} tip="Fetching automation runs…">
          {!loading && filteredData.length === 0 ? (
            <Empty
              description={
                <Text type="secondary">
                  {searchText || statusFilter !== "ALL" || artifactFilter !== "ALL"
                    ? "No records match the selected search/filters."
                    : "No agent automation records found in the database."}
                </Text>
              }
              style={{ padding: "48px 0" }}
            />
          ) : (
            <Table<AgentAutomationItem>
              bordered
              size="large"
              rowKey={(r) => r.processId}
              dataSource={filteredData}
              columns={columns}
              scroll={{ x: true }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                style: { padding: "12px 20px" },
              }}
            />
          )}
        </Spin>
      </div>

      {/* ─── Start Automation Modal ─── */}
      <Modal
        title="Start Agent Automation"
        open={isStartModalOpen}
        onCancel={() => {
          if (!submitting) {
            setIsStartModalOpen(false);
          }
        }}
        width={880}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsStartModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<RocketOutlined />}
            loading={submitting}
            onClick={handleStartAutomationSubmit}
            style={{
              backgroundColor: "#008cba",
              borderColor: "#008cba",
              fontWeight: 600,
            }}
          >
            Launch Automation
          </Button>,
        ]}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: "75vh",
            overflowY: "auto",
            paddingRight: 6,
            paddingTop: 8,
          }}
        >
          {/* Title */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 4 }}>
              Automation Title <span style={{ color: "#ef4444" }}>*</span>
            </Text>
            <Input
              size="large"
              placeholder="e.g. austriacolleges or oxford-msc"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* ─── Side-by-Side: Objective & Requirements Sections ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 16,
            }}
          >
            {/* ─── Objective Column ─── */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                    Objective
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                    Provide via file or text
                  </Text>
                </div>

                <Select
                  value={objectiveType || undefined}
                  placeholder="Select File or Text"
                  onChange={handleObjectiveTypeChange}
                  style={{ width: 160 }}
                  options={[
                    {
                      value: "file",
                      label: (
                        <Space size={6}>
                          <InboxOutlined style={{ color: "#008cba" }} />
                          <span>Upload File (.txt)</span>
                        </Space>
                      ),
                    },
                    {
                      value: "text",
                      label: (
                        <Space size={6}>
                          <FileTextOutlined style={{ color: "#8b5cf6" }} />
                          <span>Enter Text</span>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Conditional Input Field based on Dropdown Selection */}
              {objectiveType === "file" && (
                <div>
                  {objectiveFile ? (
                    <div
                      style={{
                        minHeight: 130,
                        padding: "14px 16px",
                        borderRadius: 8,
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <FileTextOutlined style={{ color: "#16a34a", fontSize: 24, marginTop: 2 }} />
                        <div style={{ overflow: "hidden", flex: 1 }}>
                          <Text
                            strong
                            style={{
                              fontSize: 13,
                              color: "#166534",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {objectiveFile.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {(objectiveFile.size / 1024).toFixed(1)} KB • .txt file ready
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setObjectiveFile(null)}
                        >
                          Remove File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Upload.Dragger
                      name="objectiveFile"
                      accept=".txt,text/plain"
                      multiple={false}
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isTxt =
                          file.name.toLowerCase().endsWith(".txt") ||
                          file.type === "text/plain";
                        if (!isTxt) {
                          message.error("Only .txt files are allowed for Objective!");
                          return false;
                        }
                        setObjectiveFile(file);
                        return false;
                      }}
                      style={{
                        minHeight: 130,
                        padding: "8px 10px",
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        borderColor: "#008cba",
                      }}
                    >
                      <div style={{ padding: "6px 8px", textAlign: "center" }}>
                        <InboxOutlined
                          style={{ fontSize: 26, color: "#008cba", marginBottom: 4 }}
                        />
                        <p
                          style={{
                            fontSize: 12,
                            margin: 0,
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          Click or drag file to upload
                        </p>
                        <p style={{ fontSize: 11, color: "#008cba", margin: "4px 0 0", fontWeight: 500 }}>
                          Only .txt files allowed
                        </p>
                      </div>
                    </Upload.Dragger>
                  )}
                </div>
              )}

              {objectiveType === "text" && (
                <TextArea
                  rows={5}
                  placeholder="Type or paste automation objective details here..."
                  value={objectiveText}
                  onChange={(e) => setObjectiveText(e.target.value)}
                  style={{
                    minHeight: 130,
                    resize: "none",
                    fontSize: 12,
                    borderRadius: 8,
                    borderColor: "#cbd5e1",
                  }}
                />
              )}

              {!objectiveType && (
                <div
                  style={{
                    minHeight: 130,
                    borderRadius: 8,
                    border: "1px dashed #cbd5e1",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <RobotOutlined style={{ fontSize: 24, color: "#94a3b8", marginBottom: 6 }} />
                  <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    Select <b>File</b> or <b>Text</b> above
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>
                    The input field will appear here
                  </Text>
                </div>
              )}
            </div>

            {/* ─── Requirements Column ─── */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                    Requirements
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                    Provide via file or text
                  </Text>
                </div>

                <Select
                  value={requirementsType || undefined}
                  placeholder="Select File or Text"
                  onChange={handleRequirementsTypeChange}
                  style={{ width: 160 }}
                  options={[
                    {
                      value: "file",
                      label: (
                        <Space size={6}>
                          <InboxOutlined style={{ color: "#008cba" }} />
                          <span>Upload File (.txt)</span>
                        </Space>
                      ),
                    },
                    {
                      value: "text",
                      label: (
                        <Space size={6}>
                          <FileTextOutlined style={{ color: "#8b5cf6" }} />
                          <span>Enter Text</span>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Conditional Input Field based on Dropdown Selection */}
              {requirementsType === "file" && (
                <div>
                  {requirementsFile ? (
                    <div
                      style={{
                        minHeight: 130,
                        padding: "14px 16px",
                        borderRadius: 8,
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <FileTextOutlined style={{ color: "#16a34a", fontSize: 24, marginTop: 2 }} />
                        <div style={{ overflow: "hidden", flex: 1 }}>
                          <Text
                            strong
                            style={{
                              fontSize: 13,
                              color: "#166534",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {requirementsFile.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {(requirementsFile.size / 1024).toFixed(1)} KB • .txt file ready
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setRequirementsFile(null)}
                        >
                          Remove File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Upload.Dragger
                      name="requirementsFile"
                      accept=".txt,text/plain"
                      multiple={false}
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isTxt =
                          file.name.toLowerCase().endsWith(".txt") ||
                          file.type === "text/plain";
                        if (!isTxt) {
                          message.error("Only .txt files are allowed for Requirements!");
                          return false;
                        }
                        setRequirementsFile(file);
                        return false;
                      }}
                      style={{
                        minHeight: 130,
                        padding: "8px 10px",
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        borderColor: "#008cba",
                      }}
                    >
                      <div style={{ padding: "6px 8px", textAlign: "center" }}>
                        <InboxOutlined
                          style={{ fontSize: 26, color: "#008cba", marginBottom: 4 }}
                        />
                        <p
                          style={{
                            fontSize: 12,
                            margin: 0,
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          Click or drag file to upload
                        </p>
                        <p style={{ fontSize: 11, color: "#008cba", margin: "4px 0 0", fontWeight: 500 }}>
                          Only .txt files allowed
                        </p>
                      </div>
                    </Upload.Dragger>
                  )}
                </div>
              )}

              {requirementsType === "text" && (
                <TextArea
                  rows={5}
                  placeholder="Type or paste automation requirements here..."
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  style={{
                    minHeight: 130,
                    resize: "none",
                    fontSize: 12,
                    borderRadius: 8,
                    borderColor: "#cbd5e1",
                  }}
                />
              )}

              {!requirementsType && (
                <div
                  style={{
                    minHeight: 130,
                    borderRadius: 8,
                    border: "1px dashed #cbd5e1",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <RobotOutlined style={{ fontSize: 24, color: "#94a3b8", marginBottom: 6 }} />
                  <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                    Select <b>File</b> or <b>Text</b> above
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>
                    The input field will appear here
                  </Text>
                </div>
              )}
            </div>
          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* ─── URL Map JSON Section ─── */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 13, color: "#0f172a" }}>
                URL Map Configuration
              </Text>
              <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                Map URLs to their descriptions
              </Text>
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 12,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {urlMapRows.length === 0 ? (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      textAlign: "center",
                      display: "block",
                      padding: "8px 0",
                    }}
                  >
                    No URLs added. Click &quot;Add URL Entry&quot; below to add one.
                  </Text>
                ) : (
                  urlMapRows.map((row) => (
                    <div
                      key={row.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1fr auto",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Input
                        size="large"
                        placeholder="https://..."
                        value={row.url}
                        onChange={(e) =>
                          handleUpdateUrlRow(row.id, "url", e.target.value)
                        }
                      />
                      <Input
                        size="large"
                        placeholder="Description / label"
                        value={row.description}
                        onChange={(e) =>
                          handleUpdateUrlRow(row.id, "description", e.target.value)
                        }
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUrlRow(row.id)}
                      />
                    </div>
                  ))
                )}
              </div>

              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={handleAddUrlRow}
                style={{
                  marginTop: 10,
                  borderRadius: 6,
                  color: "#008cba",
                  borderColor: "#008cba",
                  fontWeight: 500,
                }}
              >
                Add URL Entry
              </Button>
            </div>
          </div>

        </div>
      </Modal>

    
    </div>
  );
};

export default AgentAutomationAdmin;
