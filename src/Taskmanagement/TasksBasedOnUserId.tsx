import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import { employeeApi } from "../utils/axiosInstances";

type TaskStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "PENDING"
  | "ASSIGNED"
  | "OPEN"
  | string;

interface TaskItem {
  taskAssignBy: string | null;
  taskAssignTo: Array<string | null> | null;
  taskName: string | null;
  status: TaskStatus | null;
  id: string;
  tastCreatedDate: string | null;
  taskAssignedDate: string | null;
  taskCompleteDate: string | null;
  image: string | null;
}

type ActionStatus = "ACCEPTED" | "REJECTED" | "HOLD" | "COMPLETED";

interface ActionModal {
  taskId: string;
  action: ActionStatus;
  comment: string;
  submitting: boolean;
  error: string;
}

interface CommentType {
  commentsBy: string;
  comments: string;
  status?: string;
}


type StatusFilter = "ALL" | ActionStatus;

const DEFAULT_USER_ID = sessionStorage.getItem("userId") || "default_user_id";

const ACTION_CONFIG: Record<ActionStatus, { label: string; color: string; bg: string; border: string; needsComment: boolean }> = {
  ACCEPTED: { label: "Accept", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd", needsComment: true },
  REJECTED: { label: "Reject", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca", needsComment: true },
  HOLD: { label: "Hold", color: "#92400e", bg: "#fffbeb", border: "#fcd34d", needsComment: true },
  COMPLETED: { label: "Completed", color: "#1e3a5f", bg: "#eff6ff", border: "#bfdbfe", needsComment: true },
};



const normalizeStatus = (status?: string | null): TaskStatus | ActionStatus => {
  const value = (status || "").trim().toUpperCase().replace(/\s+/g, "_");

  if (["COMPLETED", "COMPLETE", "DONE"].includes(value)) return "COMPLETED";
  if (["IN_PROGRESS", "INPROGRESS", "PROGRESS", "STARTED"].includes(value))
    return "IN_PROGRESS";
  if (["ACCEPTED", "ACCEPT"].includes(value)) return "ACCEPTED";
  if (["REJECTED", "REJECT"].includes(value)) return "REJECTED";
  if (["HOLD", "ON_HOLD", "ONHOLD"].includes(value)) return "HOLD";

  return "PENDING";
};

const sortTasksByCreatedDate = (taskList: TaskItem[]) =>
  [...taskList].sort((firstTask, secondTask) => {
    const getDateValue = (date?: string | null) => {
      if (!date) return 0;
      const [day, month, year] = date.split("/").map(Number);
      if (!day || !month || !year) return 0;
      return new Date(year, month - 1, day).getTime();
    };

    return getDateValue(secondTask.tastCreatedDate) - getDateValue(firstTask.tastCreatedDate);
  });


type AttachmentPreviewProps = {
  url: string | null;
  onImageClick: (url: string) => void;
};

const getAttachmentLabel = (url: string) => {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".pdf")) return "PDF Document";
  if (/\.(mp4|webm|mov|m4v|avi|mkv)$/.test(cleanUrl)) return "Video File";
  if (/\.(doc|docx)$/.test(cleanUrl)) return "Word Document";
  if (/\.(xls|xlsx|csv)$/.test(cleanUrl)) return "Spreadsheet";
  if (/\.(ppt|pptx)$/.test(cleanUrl)) return "Presentation";
  if (/\.(zip|rar|7z)$/.test(cleanUrl)) return "Archive File";

  return "Attachment";
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  url,
  onImageClick,
}) => {
  const [imageState, setImageState] = useState<"checking" | "image" | "file">(
    url ? "checking" : "file",
  );

  useEffect(() => {
    if (!url) {
      setImageState("file");
      return;
    }

    let active = true;
    const probe = new Image();

    probe.onload = () => {
      if (active) setImageState("image");
    };

    probe.onerror = () => {
      if (active) setImageState("file");
    };

    probe.src = url;

    return () => {
      active = false;
      probe.onload = null;
      probe.onerror = null;
    };
  }, [url]);

  if (!url) {
    return (
      <div className="attachment-empty" aria-label="No attachment">
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M8 12.5 13.5 7a3 3 0 0 1 4.2 4.2l-7 7a5 5 0 0 1-7.1-7.1l7.3-7.3" />
        </svg>
        <span>No attachment</span>
      </div>
    );
  }

  if (imageState === "checking") {
    return (
      <div className="attachment-checking" aria-label="Checking attachment">
        <span className="task-search__spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (imageState === "image") {
    return (
      <button
        type="button"
        className="image-preview-button"
        onClick={() => onImageClick(url)}
        aria-label="Preview task image"
      >
        <img src={url} alt="Task attachment" loading="lazy" />
        <span className="image-preview-overlay">View image</span>
      </button>
    );
  }

  return (
    <a
      className="file-attachment-card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${getAttachmentLabel(url)} in a new tab`}
    >
      <span className="file-attachment-card__icon">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v5h5" />
          <path d="M9.5 14h5M9.5 17h4" />
        </svg>
      </span>

      <span className="file-attachment-card__text">
        <strong>{getAttachmentLabel(url)}</strong>
        <small>Open in new tab</small>
      </span>

      <svg
        className="file-attachment-card__open"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 5h5v5" />
        <path d="m11 13 8-8" />
        <path d="M19 13v6H5V5h6" />
      </svg>
    </a>
  );
};

const getStoredUserId = () => {
  if (typeof window === "undefined") return DEFAULT_USER_ID;

  const directKeys = [
    "userId",
    "user_id",
    "USER_ID",
    "employeeId",
    "employee_id",
  ];

  for (const key of directKeys) {
    const value = sessionStorage.getItem(key);
    if (value && value !== "null" && value !== "undefined") return value;
  }

  const objectKeys = ["user", "userData", "profile", "loginData"];

  for (const key of objectKeys) {
    const value = sessionStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);
      const userId =
        parsed?.userId ||
        parsed?.user_id ||
        parsed?.id ||
        parsed?.employeeId ||
        parsed?.employee_id;

      if (userId) return String(userId);
    } catch {
      // Ignore invalid sessionStorage JSON.
    }
  }

  return DEFAULT_USER_ID;
};

const TaskBasedOnUserId: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<TaskItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<ActionModal | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [comments, setComments] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const openAction = (taskId: string, action: ActionStatus) => {
    setActionModal({ taskId, action, comment: "", submitting: false, error: "" });
  };

  const closeAction = () => setActionModal(null);

  const submitAction = async () => {
    if (!actionModal) return;

    const { taskId, action, comment } = actionModal;
    const cleanComment = comment.trim();

    if (!cleanComment) {
      setActionModal((previous) =>
        previous
          ? {
            ...previous,
            error: `Comment is mandatory when you ${ACTION_CONFIG[action].label.toLowerCase()} a task.`,
          }
          : previous,
      );
      return;
    }

    if (cleanComment.length < 3) {
      setActionModal((previous) =>
        previous
          ? { ...previous, error: "Please enter at least 3 characters." }
          : previous,
      );
      return;
    }

    if (cleanComment.length > 500) {
      setActionModal((previous) =>
        previous
          ? { ...previous, error: "Comment cannot exceed 500 characters." }
          : previous,
      );
      return;
    }

    setActionModal((previous) =>
      previous ? { ...previous, submitting: true, error: "" } : previous,
    );

    try {
      const now = new Date();
      const fmt = (date: Date) => date.toISOString().slice(0, 19);

      await employeeApi.patch(
        `${BASE_URL}/ai-service/agent/taskCommentsUpdation`,
        {
          taskId,
          taskStatus: action,
          comments: cleanComment,
          taskStartDate: fmt(now),
          taskEndDate: fmt(now),
        },
      );

      const updateStatus = (list: TaskItem[]) =>
        list.map((task) =>
          task.id === taskId ? { ...task, status: action } : task,
        );

      setTasks(updateStatus);
      setSearchResults(updateStatus);
      closeAction();
    } catch (err: any) {
      setActionModal((previous) =>
        previous
          ? {
            ...previous,
            submitting: false,
            error:
              err?.response?.data?.message ||
              "Failed to update. Please try again.",
          }
          : previous,
      );
    }
  };

  const handleViewComments = async (task: TaskItem) => {
    try {
      setCommentsLoading(true);
      setSelectedTask(task);

      const response = await employeeApi.get(
        `${BASE_URL}/ai-service/agent/taskedIdBasedOnComments`,
        { params: { taskId: task.id } },
      );

      setCommentsData(Array.isArray(response?.data) ? response.data : []);
      setViewModalVisible(true);
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to fetch comments",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentsUpdate = async () => {
    if (!selectedTask?.id) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Task not selected",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!comments.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please enter a comment before submitting.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setCommentSubmitting(true);

      await employeeApi.post(
        `${BASE_URL}/ai-service/agent/userAndRadhaSirComments`,
        {
          taskId: selectedTask.id,
          comments: comments.trim(),
          commentsBy: "EMPLOYEE",
        },
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Comment added successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setCommentsModalVisible(false);
      setComments("");
      await handleViewComments(selectedTask);
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add comment",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setCommentSubmitting(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getStoredUserId();

      const response = await employeeApi.get(
        `${BASE_URL}/ai-service/agent/showingTaskBasedOnUserId`,
        {
          params: { userId },
        }
      );

      const taskData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setTasks(sortTasksByCreatedDate(taskData));
    } catch (err) {
      console.error("Failed to fetch user tasks:", err);
      setError("Unable to load your tasks. Please try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const query = searchText.trim();

    // Empty search = show the normal user task list again.
    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    const controller = new AbortController();
    const debounceTimer = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        setSearchError("");

        const response = await employeeApi.get(
          `${BASE_URL}/ai-service/agent/messages`,
          {
            params: { search: query },
            signal: controller.signal,
          }
        );

        const taskData = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

        setSearchResults(sortTasksByCreatedDate(taskData));
      } catch (err: any) {
        // Axios uses ERR_CANCELED when a newer search replaces the current request.
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;

        console.error("Failed to search tasks:", err);
        setSearchResults([]);
        setSearchError("Unable to search tasks. Please try again.");
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchText]);

  useEffect(() => {
    const closeFilter = () => setShowFilterMenu(false);

    window.addEventListener("resize", closeFilter);
    return () => window.removeEventListener("resize", closeFilter);
  }, []);

  useEffect(() => {
    const closeImagePreview = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", closeImagePreview);
    return () => window.removeEventListener("keydown", closeImagePreview);
  }, []);

  const counts = useMemo(() => {
    return tasks.reduce(
      (accumulator, task) => {
        const status = normalizeStatus(task.status);

        accumulator.total += 1;

        if (status === "COMPLETED") accumulator.completed += 1;
        else if (status === "ACCEPTED") accumulator.accepted += 1;
        else if (status === "REJECTED") accumulator.rejected += 1;
        else if (status === "HOLD") accumulator.hold += 1;
        else accumulator.pending += 1;

        return accumulator;
      },
      {
        total: 0,
        completed: 0,
        accepted: 0,
        rejected: 0,
        hold: 0,
        pending: 0,
      },
    );
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const sourceTasks = searchText.trim() ? searchResults : tasks;

    return sourceTasks.filter((task) => {
      const status = normalizeStatus(task.status);
      return statusFilter === "ALL" || status === statusFilter;
    });
  }, [tasks, searchResults, searchText, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / PAGE_SIZE),
  );

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTasks.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTasks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const statusLabel = (status?: string | null) => {
    const normalized = normalizeStatus(status);

    if (normalized === "COMPLETED") return "Completed";
    if (normalized === "ACCEPTED") return "Accepted";
    if (normalized === "REJECTED") return "Rejected";
    if (normalized === "HOLD") return "On Hold";

    return "Pending";
  };

  return (
    <UserPanelLayout>
      <div className="task-page">
        <div className="task-page__header">
          <div>
            <h1>My Tasks</h1>
            <p>View and manage all your assigned tasks</p>
          </div>

          <div className="task-page__actions">
            <div className="task-search">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by task #, name, keyword..."
                aria-label="Search tasks"
                aria-busy={searchLoading}
              />
              {searchLoading && (
                <span className="task-search__spinner" aria-label="Searching" />
              )}
            </div>

            <div className="filter-wrap">
              <button
                className={`filter-button ${statusFilter !== "ALL" ? "filter-button--active" : ""
                  }`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowFilterMenu((value) => !value);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 6h16" />
                  <path d="M7 12h10" />
                  <path d="M10 18h4" />
                </svg>
                <span>{statusFilter === "ALL" ? "All" : statusLabel(statusFilter)}</span>
              </button>

              {showFilterMenu && (
                <div
                  className="filter-menu"
                  onClick={(event) => event.stopPropagation()}
                >
                  {(
                    [
                      ["ALL", "All"],
                      ["ACCEPTED", "Accepted"],
                      ["REJECTED", "Rejected"],
                      ["HOLD", "Hold"],
                      ["COMPLETED", "Completed"],
                    ] as Array<[StatusFilter, string]>
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        statusFilter === value
                          ? "filter-menu__item filter-menu__item--active"
                          : "filter-menu__item"
                      }
                      onClick={() => {
                        setStatusFilter(value);
                        setShowFilterMenu(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="task-stats" aria-label="Task summary">
          <article className="stat-card stat-card--total">
            <div>
              <span>Total Tasks</span>
              <strong>{counts.total}</strong>
            </div>
            <div className="stat-icon stat-icon--total">
              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="6" y="5" width="12" height="15" rx="2" />
                <path d="M9 5V3h6v2M9 10h6M9 14h6" />
              </svg>
            </div>
          </article>

          <article className="stat-card stat-card--completed">
            <div>
              <span>Completed</span>
              <strong>{counts.completed}</strong>
            </div>
            <div className="stat-icon stat-icon--completed">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16.5 9" />
              </svg>
            </div>
          </article>

          <article className="stat-card stat-card--hold">
            <div>
              <span>On Hold</span>
              <strong>{counts.hold}</strong>
            </div>
            <div className="stat-icon stat-icon--hold">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 8v8M15 8v8" />
              </svg>
            </div>
          </article>

          <article className="stat-card stat-card--accepted">
            <div>
              <span>Accepted</span>
              <strong>{counts.accepted}</strong>
            </div>
            <div className="stat-icon stat-icon--accepted">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16.5 9" />
              </svg>
            </div>
          </article>

          <article className="stat-card stat-card--rejected">
            <div>
              <span>Rejected</span>
              <strong>{counts.rejected}</strong>
            </div>
            <div className="stat-icon stat-icon--rejected">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m9 9 6 6M15 9l-6 6" />
              </svg>
            </div>
          </article>

          <article className="stat-card stat-card--pending">
            <div>
              <span>Pending</span>
              <strong>{counts.pending}</strong>
            </div>
            <div className="stat-icon stat-icon--pending">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6l4 2" />
              </svg>
            </div>
          </article>
        </section>

        <section className="task-content">
          {loading && !searchText.trim() ? (
            <div className="task-grid">
              {[1, 2, 3, 4].map((item) => (
                <div className="task-card task-card--loading" key={item}>
                  <div className="skeleton skeleton--image" />
                  <div className="skeleton-area">
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--line" />
                    <div className="skeleton skeleton--line skeleton--short" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchText.trim() && searchError ? (
            <div className="state-card">
              <div className="state-card__icon state-card__icon--error">!</div>
              <h3>Couldn&apos;t search tasks</h3>
              <p>{searchError}</p>
              <button type="button" onClick={() => setSearchText((value) => value + " ")}>
                Try Again
              </button>
            </div>
          ) : error ? (
            <div className="state-card">
              <div className="state-card__icon state-card__icon--error">!</div>
              <h3>Couldn&apos;t load tasks</h3>
              <p>{error}</p>
              <button type="button" onClick={fetchTasks}>
                Try Again
              </button>
            </div>
          ) : searchText.trim() && searchLoading ? (
            <div className="state-card state-card--searching">
              <span className="task-search__large-spinner" aria-hidden="true" />
              <h3>Searching tasks...</h3>
              <p>Looking for tasks matching “{searchText.trim()}”.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="state-card">
              <div className="state-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="5" y="4" width="14" height="16" rx="2" />
                  <path d="M9 9h6M9 13h4" />
                </svg>
              </div>
              <h3>No tasks found</h3>
              <p>
                {searchText || statusFilter !== "ALL"
                  ? "Try changing your search or task filter."
                  : "No tasks have been assigned to you yet."}
              </p>
            </div>
          ) : (
            <div className="task-grid">
              {paginatedTasks.map((task) => {
                const normalizedStatus = normalizeStatus(task.status);

                return (
                  <article className="task-card" key={task.id}>
                    <div className="task-card__media">
                      <AttachmentPreview
                        url={task.image}
                        onImageClick={(url) => setSelectedImage(url)}
                      />
                    </div>

                    <div className="task-card__body">
                      <div className="task-card__top">
                        <h2>{task.taskName || "Untitled task"}</h2>

                        <span
                          className={`status-badge status-badge--${normalizedStatus.toLowerCase()}`}
                        >
                          <span className="status-dot" />
                          {statusLabel(task.status)}
                        </span>
                      </div>

                      <div className="assigned-by">
                        <span className="meta-label">Assigned by</span>
                        <span className="avatar">
                          {(task.taskAssignBy || "U")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <span className="assigned-name">
                          {task.taskAssignBy || "Not available"}
                        </span>
                      </div>

                      <div className="task-meta">
                        <div className="task-meta__item">
                          <span className="meta-label">Assigned Date</span>
                          <span className="meta-value">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="5" width="18" height="16" rx="2" />
                              <path d="M8 3v4M16 3v4M3 10h18" />
                            </svg>
                            {task.taskAssignedDate || "—"}
                          </span>
                        </div>

                        {normalizedStatus === "COMPLETED" && (
                          <div className="task-meta__item">
                            <span className="meta-label">Completed Date</span>
                            <span className="meta-value">
                              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="9" />
                                <path d="m8 12 2.5 2.5L16.5 9" />
                              </svg>
                              {task.taskCompleteDate || "—"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ── Action buttons ── */}
                      <div className="task-card__action-row">
                        {normalizedStatus === "COMPLETED" ? (
                          <div className="task-completed-banner">
                            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="10" cy="10" r="8" />
                              <path d="m6 10 2.5 2.5L14 7" />
                            </svg>
                            Task completed successfully.
                          </div>
                        ) : normalizedStatus === "REJECTED" ? (
                          <div className="task-rejected-banner">
                            Task rejected. No further actions available.
                          </div>
                        ) : (
                          <div className="task-actions">
                            {(normalizedStatus === "ACCEPTED"
                              ? (["HOLD", "COMPLETED"] as ActionStatus[])
                              : normalizedStatus === "HOLD"
                                ? (["COMPLETED"] as ActionStatus[])
                                : (["ACCEPTED", "REJECTED"] as ActionStatus[])
                            ).map((act) => {
                              const cfg = ACTION_CONFIG[act];

                              return (
                                <button
                                  key={act}
                                  type="button"
                                  onClick={() => openAction(task.id, act)}
                                  className="task-action-btn"
                                  style={{
                                    color: cfg.color,
                                    background: cfg.bg,
                                    borderColor: cfg.border,
                                  }}
                                >
                                  {cfg.label}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="task-comment-actions">
                          <button
                            type="button"
                            className="task-comment-btn task-comment-btn--add"
                            onClick={() => {
                              setSelectedTask(task);
                              setComments("");
                              setCommentsModalVisible(true);
                            }}
                          >
                            Add Comment
                          </button>

                          <button
                            type="button"
                            className="task-comment-btn task-comment-btn--view"
                            onClick={() => handleViewComments(task)}
                          >
                            View Comments
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading &&
            !searchLoading &&
            !error &&
            !searchError &&
            filteredTasks.length > 0 && (
              <nav className="task-pagination" aria-label="Task pagination">
                <div className="task-pagination__summary">
                  Showing{" "}
                  <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong>–
                  <strong>
                    {Math.min(currentPage * PAGE_SIZE, filteredTasks.length)}
                  </strong>{" "}
                  of <strong>{filteredTasks.length}</strong>
                </div>

                <div className="task-pagination__controls">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span className="task-pagination__page">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
        </section>
      </div>

      {selectedImage && (
        <div
          className="image-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Full task image"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            className="image-preview-modal__close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
          >
            X
          </button>
          <img
            src={selectedImage}
            alt="Full task attachment"
            className="image-preview-modal__image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {/* ── Action Modal ── */}
      {actionModal && (
        <div
          className="action-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeAction}
        >
          <div
            className="action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="action-modal__header" style={{ borderColor: ACTION_CONFIG[actionModal.action].border }}>
              <div
                className="action-modal__icon"
                style={{
                  background: ACTION_CONFIG[actionModal.action].bg,
                  color: ACTION_CONFIG[actionModal.action].color,
                  border: `1px solid ${ACTION_CONFIG[actionModal.action].border}`,
                }}
              >
                {actionModal.action === "ACCEPTED" && <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="m6 10 2.5 2.5L14 7" /></svg>}
                {actionModal.action === "REJECTED" && <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="m7 7 6 6M13 7l-6 6" /></svg>}
                {actionModal.action === "HOLD" && <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="M8 7v6M12 7v6" /></svg>}
                {actionModal.action === "COMPLETED" && <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8" /><path d="m6 10 2.5 2.5L14 7" /></svg>}
              </div>
              <div>
                <h3 className="action-modal__title" style={{ color: ACTION_CONFIG[actionModal.action].color }}>
                  {ACTION_CONFIG[actionModal.action].label} Task
                </h3>
                <p className="action-modal__sub">
                  {actionModal.action === "ACCEPTED" && "Add a comment and confirm you accept this task."}
                  {actionModal.action === "REJECTED" && "Please provide a reason for rejection."}
                  {actionModal.action === "HOLD" && "Describe why this task is on hold."}
                  {actionModal.action === "COMPLETED" && "Add completion notes or remarks."}
                </p>
              </div>
              <button type="button" className="action-modal__close" onClick={closeAction} aria-label="Close">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>

            {/* Comment box */}
            <div className="action-modal__body">
              <label className="action-modal__label">
                Comment *
              </label>
              <textarea
                className="action-modal__textarea"
                rows={4}
                placeholder={
                  actionModal.action === "ACCEPTED" ? "Comment for accepting this task…" :
                    actionModal.action === "REJECTED" ? "Reason for rejection…" :
                      actionModal.action === "HOLD" ? "Reason for hold…" :
                        "Completion notes or remarks…"
                }
                value={actionModal.comment}
                maxLength={500}
                required
                onChange={(e) => setActionModal((p) => p ? { ...p, comment: e.target.value, error: "" } : p)}
                style={{ borderColor: actionModal.error ? "#ef4444" : undefined }}
              />
              {actionModal.error && (
                <p className="action-modal__error">{actionModal.error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="action-modal__footer">
              <button type="button" className="action-modal__cancel" onClick={closeAction} disabled={actionModal.submitting}>
                Cancel
              </button>
              <button
                type="button"
                className="action-modal__submit"
                onClick={submitAction}
                disabled={actionModal.submitting || actionModal.comment.trim().length < 3}
                style={{
                  background: ACTION_CONFIG[actionModal.action].color,
                  opacity: actionModal.submitting ? 0.7 : 1,
                }}
              >
                {actionModal.submitting ? "Submitting…" : `Confirm ${ACTION_CONFIG[actionModal.action].label}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewModalVisible && (
        <div
          className="comments-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Task comments"
          onClick={() => setViewModalVisible(false)}
        >
          <div
            className="comments-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="comments-modal__header">
              <div>
                <h3>Comments</h3>
                <p>
                  {selectedTask?.taskName
                    ? selectedTask.taskName.length > 70
                      ? `${selectedTask.taskName.slice(0, 70)}…`
                      : selectedTask.taskName
                    : "Selected task"}
                </p>
              </div>

              <button
                type="button"
                className="comments-modal__close"
                onClick={() => setViewModalVisible(false)}
                aria-label="Close comments"
              >
                ×
              </button>
            </div>

            <div className="comments-modal__body">
              {commentsLoading ? (
                <div className="comments-modal__state">
                  <span className="task-search__large-spinner" />
                  <span>Loading comments...</span>
                </div>
              ) : commentsData.length > 0 ? (
                <div className="comments-list">
                  {commentsData.map((comment, index) => (
                    <div className="comment-item" key={`${comment.commentsBy}-${index}`}>
                      <div className="comment-item__head">
                        <div className="comment-author">
                          <span className="comment-author__avatar">
                            {(comment.commentsBy || "?").charAt(0).toUpperCase()}
                          </span>
                          <strong>{comment.commentsBy || "User"}</strong>
                        </div>

                        {comment.status && (
                          <span className="comment-status">{comment.status}</span>
                        )}
                      </div>

                      <p>{comment.comments}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="comments-modal__state">
                  <span>No comments yet for this task.</span>
                </div>
              )}
            </div>

            <div className="comments-modal__footer">
              <button
                type="button"
                className="comments-modal__secondary"
                onClick={() => setViewModalVisible(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="comments-modal__primary"
                onClick={() => {
                  setViewModalVisible(false);
                  setComments("");
                  setCommentsModalVisible(true);
                }}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {commentsModalVisible && (
        <div
          className="comments-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Add comment"
          onClick={() => {
            if (!commentSubmitting) {
              setCommentsModalVisible(false);
              setComments("");
            }
          }}
        >
          <div
            className="comments-modal comments-modal--add"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="comments-modal__header">
              <div>
                <h3>Add Comment</h3>
                <p>
                  {selectedTask?.taskName
                    ? selectedTask.taskName.length > 70
                      ? `${selectedTask.taskName.slice(0, 70)}…`
                      : selectedTask.taskName
                    : "Selected task"}
                </p>
              </div>

              <button
                type="button"
                className="comments-modal__close"
                disabled={commentSubmitting}
                onClick={() => {
                  setCommentsModalVisible(false);
                  setComments("");
                }}
                aria-label="Close add comment"
              >
                ×
              </button>
            </div>

            <div className="comments-modal__body">
              <label className="comment-field-label">Comment *</label>
              <textarea
                className="comment-textarea"
                rows={4}
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                placeholder="Write your comment here..."
                maxLength={500}
              />
              <div className="comment-count">{comments.length}/500</div>
            </div>

            <div className="comments-modal__footer">
              <button
                type="button"
                className="comments-modal__secondary"
                disabled={commentSubmitting}
                onClick={() => {
                  setCommentsModalVisible(false);
                  setComments("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="comments-modal__primary"
                disabled={commentSubmitting || !comments.trim()}
                onClick={handleCommentsUpdate}
              >
                {commentSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .task-page {
          width: 100%;
          min-height: 100%;
          padding: 26px;
          background: #fff;
          color: #171720;
        }

        .task-page__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .task-page__header h1 {
          margin: 0;
          font-size: clamp(24px, 2vw, 32px);
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -0.035em;
          color: #17171c;
        }

        .task-page__header p {
          margin: 7px 0 0;
          color: #747583;
          font-size: 14px;
        }

        .task-page__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .task-search {
          width: min(330px, 32vw);
          height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border: 1px solid #e0e2e9;
          border-radius: 10px;
          background: #fff;
          color: #9597a4;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .task-search:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, .08);
        }

        .task-search input {
          width: 100%;
          border: 0;
          outline: 0;
          font: inherit;
          font-size: 13px;
          color: #24242b;
          background: transparent;
        }

        .task-search input::placeholder {
          color: #a2a4ae;
        }

        .task-search__spinner,
        .task-search__large-spinner {
          display: inline-block;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          border-top-color: #6d28d9;
          animation: taskSearchSpin .7s linear infinite;
          flex: 0 0 auto;
        }

        .task-search__spinner {
          width: 16px;
          height: 16px;
        }

        .task-search__large-spinner {
          width: 34px;
          height: 34px;
          margin-bottom: 12px;
          border-width: 3px;
        }

        @keyframes taskSearchSpin {
          to { transform: rotate(360deg); }
        }

        .filter-wrap {
          position: relative;
        }

        .filter-button {
          height: 44px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #e0e2e9;
          border-radius: 10px;
          color: #34343e;
          background: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: all .2s ease;
        }

        .filter-button:hover,
        .filter-button--active {
          color: #6d28d9;
          border-color: #c4b5fd;
          background: #faf8ff;
        }

        .filter-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 170px;
          padding: 6px;
          background: #fff;
          border: 1px solid #ececf1;
          border-radius: 12px;
          box-shadow: 0 14px 40px rgba(32, 23, 70, .14);
          z-index: 30;
        }

        .filter-menu__item {
          width: 100%;
          border: 0;
          padding: 10px 11px;
          text-align: left;
          border-radius: 8px;
          background: transparent;
          color: #4d4d58;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .filter-menu__item:hover,
        .filter-menu__item--active {
          color: #6d28d9;
          background: #f4f0ff;
          font-weight: 650;
        }

        .task-stats {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-card {
          min-height: 86px;
          padding: 16px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid;
          border-radius: 12px;
          background: #fff;
        }

        .stat-card span {
          display: block;
          margin-bottom: 5px;
          color: #646570;
          font-size: 12px;
          font-weight: 500;
        }

        .stat-card strong {
          font-size: 22px;
          line-height: 1;
          font-weight: 750;
          color: #202027;
        }

        .stat-card--total {
          border-color: #ddd4ff;
          background: linear-gradient(135deg, #fff 0%, #f7f4ff 100%);
        }

        .stat-card--completed {
          border-color: #c7edd3;
          background: linear-gradient(135deg, #fff 0%, #f1fbf4 100%);
        }

        .stat-card--hold {
          border-color: #ffe0ad;
          background: linear-gradient(135deg, #fff 0%, #fff8ed 100%);
        }

        .stat-card--accepted {
          border-color: #bfe9ed;
          background: linear-gradient(135deg, #fff 0%, #effbfc 100%);
        }

        .stat-card--rejected {
          border-color: #f3c4d2;
          background: linear-gradient(135deg, #fff 0%, #fff3f7 100%);
        }

        .stat-card--pending {
          border-color: #ffc9cb;
          background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
        }

        .stat-icon--total {
          color: #6d28d9;
          background: #eee7ff;
        }

        .stat-icon--completed {
          color: #16a34a;
          background: #dcf8e5;
        }

        .stat-icon--hold {
          color: #f59e0b;
          background: #fff0d5;
        }

        .stat-icon--accepted {
          color: #0891b2;
          background: #dff7fa;
        }

        .stat-icon--rejected {
          color: #e11d48;
          background: #ffe1ea;
        }

        .stat-icon--pending {
          color: #ef4444;
          background: #ffe2e2;
        }

        .task-content {
          width: 100%;
        }

        .task-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .task-card {
          min-width: 0;
          display: grid;
          grid-template-columns: 124px minmax(0, 1fr);
          gap: 18px;
          padding: 14px;
          border: 1px solid #e7e8ed;
          border-radius: 13px;
          background: #fff;
          box-shadow: 0 4px 16px rgba(23, 23, 31, .045);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .task-card:hover {
          transform: translateY(-1px);
          border-color: #ddd7ef;
          box-shadow: 0 8px 24px rgba(23, 23, 31, .075);
        }

        .task-card__media {
          min-height: 112px;
          height: 100%;
          overflow: hidden;
          position: relative;
          border: 1px solid #eceaf4;
          border-radius: 9px;
          background: linear-gradient(145deg, #f5f2ff, #fafafa);
        }

        .task-card__media img {
          width: 100%;
          height: 100%;
          min-height: 112px;
          display: block;
          object-fit: cover;
        }

        .image-preview-button {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: zoom-in;
        }

        .attachment-empty,
        .attachment-checking {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px;
          color: #8b8d98;
          background: linear-gradient(145deg, #f7f5fb, #fbfbfc);
          font-size: 10px;
          text-align: center;
        }

        .image-preview-overlay {
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: 8px;
          padding: 5px 7px;
          border-radius: 6px;
          background: rgba(15, 23, 42, .72);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          opacity: 0;
          transition: opacity .2s ease;
        }

        .image-preview-button:hover .image-preview-overlay,
        .image-preview-button:focus-visible .image-preview-overlay {
          opacity: 1;
        }

        .file-attachment-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px;
          color: #4f46e5;
          background: linear-gradient(145deg, #f5f3ff, #fafafa);
          text-decoration: none;
          text-align: center;
          transition: background .2s ease;
        }

        .file-attachment-card:hover {
          background: #f0edff;
        }

        .file-attachment-card__icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #ede9fe;
        }

        .file-attachment-card__text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .file-attachment-card__text strong {
          color: #4338ca;
          font-size: 10px;
          line-height: 1.2;
        }

        .file-attachment-card__text small {
          color: #77798a;
          font-size: 8px;
        }

        .file-attachment-card__open {
          color: #8b5cf6;
        }

        .task-pagination {
          margin-top: 18px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid #e7e8ed;
          border-radius: 12px;
          background: #fff;
        }

        .task-pagination__summary,
        .task-pagination__page {
          color: #6b6c76;
          font-size: 12px;
        }

        .task-pagination__controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .task-pagination button {
          height: 34px;
          padding: 0 12px;
          border: 1px solid #ddd7ef;
          border-radius: 8px;
          background: #fff;
          color: #5b21b6;
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .task-pagination button:hover:not(:disabled) {
          border-color: #a78bfa;
          background: #faf8ff;
        }

        .task-pagination button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .image-preview-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background: rgba(15, 23, 42, 0.82);
        }

        .image-preview-modal__image {
          max-width: min(1100px, 94vw);
          max-height: 90vh;
          object-fit: contain;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
        }

        .image-preview-modal__close {
          position: absolute;
          top: 18px;
          right: 22px;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.7);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .image-fallback {
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          color: #b8b5c8;
          background: linear-gradient(145deg, #f7f5fb, #fbfbfc);
        }

        .task-card__action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0eef5;
        }

        .task-card__action-row .task-actions {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
          flex: 0 1 auto;
        }

        .task-card__action-row .task-completed-banner,
        .task-card__action-row .task-rejected-banner {
          margin-top: 0;
          flex: 1 1 auto;
        }

        .task-comment-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-left: auto;
          flex: 0 0 auto;
        }

        .task-comment-btn {
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid;
          border-radius: 8px;
          background: #fff;
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all .18s ease;
        }

        .task-comment-btn--add {
          color: #0369a1;
          border-color: #bae6fd;
          background: #f0f9ff;
        }

        .task-comment-btn--view {
          color: #5b21b6;
          border-color: #ddd6fe;
          background: #f5f3ff;
        }

        .comments-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, .55);
          backdrop-filter: blur(2px);
        }

        .comments-modal {
          width: min(580px, 96vw);
          max-height: min(720px, 90vh);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, .24);
        }

        .comments-modal--add {
          width: min(500px, 96vw);
        }

        .comments-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          padding: 17px 18px 14px;
          border-bottom: 1px solid #eef0f4;
        }

        .comments-modal__header h3 {
          margin: 0;
          color: #1f1f25;
          font-size: 18px;
          font-weight: 750;
        }

        .comments-modal__header p {
          margin: 5px 0 0;
          color: #777985;
          font-size: 11px;
          line-height: 1.45;
        }

        .comments-modal__close {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          border: 1px solid #e6e7eb;
          border-radius: 8px;
          background: #fff;
          color: #666875;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }

        .comments-modal__body {
          min-height: 130px;
          overflow-y: auto;
          padding: 16px 18px;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .comment-item {
          padding: 12px 13px;
          border: 1px solid #e3eaf5;
          border-left: 4px solid #008cba;
          border-radius: 9px;
          background: #f8faff;
        }

        .comment-item__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .comment-author {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .comment-author__avatar {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #351664;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .comment-author strong {
          overflow: hidden;
          color: #351664;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .comment-status {
          flex: 0 0 auto;
          padding: 4px 7px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 9px;
          font-weight: 700;
        }

        .comment-item p {
          margin: 0;
          color: #444650;
          font-size: 12px;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .comments-modal__state {
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #777985;
          font-size: 12px;
          text-align: center;
        }

        .comments-modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 13px 18px;
          border-top: 1px solid #eef0f4;
          background: #fafafa;
        }

        .comments-modal__secondary,
        .comments-modal__primary {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .comments-modal__secondary {
          border: 1px solid #dfe1e7;
          background: #fff;
          color: #555762;
        }

        .comments-modal__primary {
          border: 1px solid #008cba;
          background: #008cba;
          color: #fff;
        }

        .comments-modal__primary:disabled,
        .comments-modal__secondary:disabled,
        .comments-modal__close:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .comment-field-label {
          display: block;
          margin-bottom: 7px;
          color: #474954;
          font-size: 12px;
          font-weight: 700;
        }

        .comment-textarea {
          width: 100%;
          min-height: 110px;
          padding: 11px 12px;
          border: 1px solid #dfe1e7;
          border-radius: 9px;
          outline: none;
          resize: vertical;
          color: #27272f;
          background: #fff;
          font: inherit;
          font-size: 12px;
          line-height: 1.5;
        }

        .comment-count {
          margin-top: 5px;
          color: #9a9ca7;
          font-size: 9px;
          text-align: right;
        }

        .task-card__body {
          min-width: 0;
          padding: 3px 3px 1px 0;
        }

        .task-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .task-card__top h2 {
          min-width: 0;
          margin: 0;
          color: #1f1f25;
          font-size: 16px;
          line-height: 1.42;
          font-weight: 720;
          overflow-wrap: anywhere;
        }

        .status-badge {
          flex: 0 0 auto;
          min-height: 27px;
          padding: 5px 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px solid;
          border-radius: 7px;
          font-size: 10px;
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .025em;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-badge--completed {
          color: #14833b;
          border-color: #bde9ca;
          background: #eaf9ef;
        }

        .status-badge--in_progress {
          color: #c77700;
          border-color: #f6db9f;
          background: #fff7e8;
        }

        .status-badge--pending {
          color: #d63d46;
          border-color: #f3bec2;
          background: #fff0f1;
        }

        .status-badge--accepted {
          color: #0369a1;
          border-color: #bae6fd;
          background: #f0f9ff;
        }

        .status-badge--rejected {
          color: #b91c1c;
          border-color: #fecaca;
          background: #fef2f2;
        }

        .status-badge--hold {
          color: #92400e;
          border-color: #fcd34d;
          background: #fffbeb;
        }

        .assigned-by {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 13px;
          min-width: 0;
          color: #5d5e68;
          font-size: 12px;
        }

        .avatar {
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #655b82;
          background: #f0edf7;
          font-size: 10px;
          font-weight: 750;
        }

        .assigned-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #484953;
          font-weight: 550;
        }

        .meta-label {
          color: #92939d;
          font-size: 11px;
        }

        .task-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 240px));
          gap: 12px 28px;
          margin-top: 15px;
        }

        .task-meta__item {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .meta-value {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4b4c56;
          font-size: 12px;
          font-weight: 550;
        }

        .meta-value svg {
          flex: 0 0 auto;
          color: #6d6e78;
        }

        .state-card {
          min-height: 260px;
          padding: 34px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid #e7e8ed;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 4px 16px rgba(23, 23, 31, .04);
        }

        .state-card__icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 50%;
          color: #6d28d9;
          background: #f3efff;
        }

        .state-card__icon--error {
          color: #dc2626;
          background: #fff0f0;
          font-size: 26px;
          font-weight: 800;
        }

        .state-card h3 {
          margin: 0;
          font-size: 17px;
          color: #2a2a31;
        }

        .state-card p {
          max-width: 420px;
          margin: 7px 0 0;
          color: #81828d;
          font-size: 13px;
          line-height: 1.5;
        }

        .state-card button {
          margin-top: 16px;
          border: 0;
          border-radius: 9px;
          padding: 10px 16px;
          color: #fff;
          background: #6d28d9;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .task-card--loading {
          pointer-events: none;
        }

        .skeleton {
          position: relative;
          overflow: hidden;
          border-radius: 7px;
          background: #ececf1;
        }

        .skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, .68),
            transparent
          );
          animation: shimmer 1.25s infinite;
        }

        .skeleton--image {
          min-height: 112px;
        }

        .skeleton-area {
          padding-top: 8px;
        }

        .skeleton--title {
          width: 70%;
          height: 18px;
          margin-bottom: 17px;
        }

        .skeleton--line {
          width: 55%;
          height: 12px;
          margin-bottom: 12px;
        }

        .skeleton--short {
          width: 38%;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @media (min-width: 1200px) {
          .task-card {
            grid-template-columns: 124px minmax(0, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .task-page {
            padding: 20px;
          }

          .task-page__header {
            align-items: flex-end;
          }

          .task-page__actions {
            flex: 1;
            justify-content: flex-end;
          }

          .task-search {
            width: min(330px, 38vw);
          }

          .task-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .task-card {
            grid-template-columns: 110px minmax(0, 1fr);
          }

          .task-meta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .task-card__action-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .task-card__action-row .task-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
            width: 100%;
          }

          .task-actions .task-action-btn:only-child {
            grid-column: 1 / -1;
          }

          .task-comment-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
            width: 100%;
            margin-left: 0;
          }

          .task-comment-btn {
            width: 100%;
            min-height: 36px;
          }

          .task-page {
            padding: 16px 14px 88px;
          }

          .task-page__header {
            display: block;
            margin-bottom: 14px;
          }

          .task-page__header h1 {
            font-size: 22px;
            text-align: center;
          }

          .task-page__header p {
            display: none;
          }

          .task-page__actions {
            width: 100%;
            margin-top: 16px;
          }

          .task-search {
            width: 100%;
            height: 42px;
          }

          .filter-button {
            width: 42px;
            height: 42px;
            padding: 0;
          }

          .filter-button span {
            display: none;
          }

          .filter-menu {
            right: 0;
          }

          .task-stats {
            gap: 8px;
            margin-bottom: 12px;
          }

          .stat-card {
            min-height: 70px;
            padding: 11px 12px;
            border-radius: 10px;
          }

          .stat-card span {
            font-size: 10px;
            margin-bottom: 3px;
          }

          .stat-card strong {
            font-size: 18px;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
            flex-basis: 32px;
          }

          .stat-icon svg {
            width: 17px;
            height: 17px;
          }

          .task-grid {
            gap: 10px;
          }

          .task-card {
            grid-template-columns: 94px minmax(0, 1fr);
            gap: 11px;
            padding: 10px;
            border-radius: 11px;
          }

          .task-card__media,
          .task-card__media img {
            min-height: 116px;
          }

          .task-card__body {
            padding-right: 0;
          }

          .task-card__top {
            display: block;
          }

          .task-card__top h2 {
            display: -webkit-box;
            overflow: hidden;
            font-size: 13px;
            line-height: 1.38;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }

          .status-badge {
            margin-top: 8px;
            min-height: 23px;
            padding: 4px 8px;
            font-size: 9px;
          }

          .assigned-by {
            margin-top: 8px;
            gap: 5px;
            font-size: 10px;
          }

          .assigned-by .meta-label {
            display: none;
          }

          .avatar {
            width: 19px;
            height: 19px;
            flex-basis: 19px;
            font-size: 8px;
          }

          .task-meta {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
            margin-top: 10px;
          }

          .task-meta__item {
            gap: 3px;
          }

          .task-meta__item .meta-label {
            display: none;
          }

          .meta-value {
            align-items: flex-start;
            gap: 4px;
            font-size: 9px;
            line-height: 1.3;
          }

          .meta-value svg {
            width: 12px;
            height: 12px;
            margin-top: 1px;
          }

          .task-pagination {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            text-align: center;
          }

          .task-pagination__controls {
            justify-content: center;
          }
        }

        @media (max-width: 390px) {
          .task-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          .stat-card {
            padding: 10px;
          }

          .stat-icon {
            width: 29px;
            height: 29px;
            flex-basis: 29px;
          }

          .task-card {
            grid-template-columns: 86px minmax(0, 1fr);
            gap: 9px;
          }

          .task-card__media,
          .task-card__media img {
            min-height: 112px;
          }
        }

        /* ── Action buttons ── */
        .task-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #f0edf7;
        }

        .task-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 30px;
          padding: 0 12px;
          border: 1px solid;
          border-radius: 7px;
          font: inherit;
          font-size: 11px;
          font-weight: 650;
          letter-spacing: .01em;
          transition: filter .15s ease, transform .1s ease;
        }

        .task-action-btn:not(:disabled):hover {
          filter: brightness(0.93);
          transform: translateY(-1px);
        }

        .action-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }


        .task-rejected-banner {
          display: flex;
          align-items: center;
          margin-top: 14px;
          padding: 9px 13px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
        }

        .task-completed-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 9px 13px;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
        }

        .task-action-current {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 30px;
          padding: 0 12px;
          border: 1px solid;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .01em;
          pointer-events: none;
          user-select: none;
        }

        /* ── Action modal ── */
        .action-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(3px);
        }

        .action-modal {
          width: min(480px, 100%);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
          overflow: hidden;
        }

        .action-modal__header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid;
        }

        .action-modal__icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }

        .action-modal__title {
          margin: 0 0 3px;
          font-size: 16px;
          font-weight: 750;
        }

        .action-modal__sub {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }

        .action-modal__close {
          margin-left: auto;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
          color: #6b7280;
          cursor: pointer;
        }

        .action-modal__close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .action-modal__body {
          padding: 18px 20px;
        }

        .action-modal__label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .action-modal__textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font: inherit;
          font-size: 13px;
          color: #1f2937;
          resize: vertical;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }

        .action-modal__textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,.1);
        }

        .action-modal__error {
          margin: 6px 0 0;
          font-size: 12px;
          color: #ef4444;
          font-weight: 600;
        }

        .action-modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 20px 18px;
          border-top: 1px solid #f3f4f6;
        }

        .action-modal__cancel {
          height: 38px;
          padding: 0 18px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #fff;
          color: #374151;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .action-modal__cancel:hover {
          background: #f9fafb;
        }

        .action-modal__submit {
          height: 38px;
          padding: 0 20px;
          border: none;
          border-radius: 9px;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .2s;
        }

        .action-modal__submit:disabled {
          opacity: .48 !important;
          cursor: not-allowed;
        }

        @media (max-width: 767px) {
          .task-actions {
            gap: 6px;
            margin-top: 10px;
            padding-top: 10px;
          }
          .task-action-btn {
            height: 26px;
            padding: 0 9px;
            font-size: 10px;
          }
          .action-modal {
            border-radius: 14px;
          }
        }
      `}</style>
    </UserPanelLayout>
  );
};

export default TaskBasedOnUserId;
