import Swal, { SweetAlertIcon, SweetAlertPosition } from "sweetalert2";
import axios from "axios";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end" as SweetAlertPosition,
  showConfirmButton: false,
  timerProgressBar: true,
  timer: 3000,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showToast = (
  title: string,
  icon: SweetAlertIcon = "info",
  timer?: number
) => {
  return Toast.fire({
    icon,
    title,
    ...(timer ? { timer } : {}),
  });
};

export const showToastSuccess = (title: string, timer = 2500) =>
  showToast(title, "success", timer);

export const showToastError = (title: string, timer = 4000) =>
  showToast(title, "error", timer);

export const showToastWarning = (title: string, timer = 3500) =>
  showToast(title, "warning", timer);

export const showToastInfo = (title: string, timer = 3000) =>
  showToast(title, "info", timer);

// Backward-compatible auth-named exports
export const showAuthSuccess = showToastSuccess;
export const showAuthError = showToastError;
export const showAuthWarning = showToastWarning;
export const showAuthInfo = showToastInfo;

/**
 * Extracts error message from API response, prioritizing backend `errorMessage`,
 * followed by other common fields and error shapes.
 */
export const extractApiErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as unknown;
    if (typeof data === "string" && data.trim()) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          const msg = extractFromData(parsed as Record<string, unknown>);
          if (msg) return msg;
        }
      } catch {
        return data.trim();
      }
    }
    if (data && typeof data === "object") {
      const msg = extractFromData(data as Record<string, unknown>);
      if (msg) return msg;
    }
    if (error.response?.statusText) {
      return error.response.statusText;
    }
    if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
      return "Request timed out. Please check your connection.";
    }
    if (error.message?.toLowerCase().includes("network error")) {
      return "Network error. Please check your connection.";
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  return fallback;
};

const extractFromData = (body: Record<string, unknown>): string | null => {
  const priorityKeys = [
    "errorMessage",
    "message",
    "error",
    "details",
    "responseMessage",
    "msg",
    "description",
  ];
  for (const key of priorityKeys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value) && value.length) {
      const text = value.map(String).filter((s) => s.trim()).join(", ");
      if (text) return text;
    }
  }
  if (body.errors) {
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors.map(String).filter((s) => s.trim()).join(", ");
    }
    if (typeof body.errors === "object" && body.errors !== null) {
      const messages = Object.values(body.errors as Record<string, unknown>)
        .flatMap((val) => (Array.isArray(val) ? val : [val]))
        .filter((val): val is string => typeof val === "string" && Boolean(val.trim()));
      if (messages.length) return messages.join(", ");
    }
  }
  return null;
};
