import axios from "axios";

export interface UserEmailPasswordResponse {
  timeInMilliSeconds?: string | null;
  emailOtpSession?: string | null;
  whatsappOtpSession?: string | null;
  salt?: string | null;
  status?: string | null;
  token?: string | null;
  accessToken?: string | null;
  userId?: string | null;
  refreshToke?: string | null;
  id?: string | null;
  primaryType?: string | null;
  name?: string | null;
  message?: string | null;
  errorMessage?: string | null;
  error?: string | null;
}

const API_MESSAGE_KEYS = [
  "status",
  "message",
  "errorMessage",
  "error",
  "detail",
  "description",
] as const;

export function extractResponseMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  for (const key of API_MESSAGE_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function isSuccessStatus(status?: string | null): boolean {
  if (!status) return false;
  const normalized = status.toLowerCase();
  return (
    normalized.includes("successful") ||
    normalized.includes("success") ||
    normalized === "ok"
  );
}

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractResponseMessage(error.response?.data);
    if (apiMessage) return apiMessage;

    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please check your internet connection.";
    }
    if (error.code === "ECONNREFUSED" || !error.response) {
      return "Network error. Please check your internet connection.";
    }

    switch (error.response?.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication failed. Please verify your credentials.";
      case 403:
        return "Access denied.";
      case 409:
        return "This resource already exists.";
      case 503:
        return "Service temporarily unavailable. Please try again.";
      case 504:
        return "Gateway timeout. Please try again.";
      default:
        return error.message || "Something went wrong. Please try again.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
