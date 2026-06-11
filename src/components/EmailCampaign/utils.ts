import { isAxiosError } from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data as
    | {
        message?: string;
        error?: string;
        status?: number;
      }
    | string
    | undefined;

  const statusCode = error.response?.status;
  const backendMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.message || responseData?.error || error.message;

  if (statusCode && backendMessage) {
    return `${statusCode}: ${backendMessage}`;
  }

  if (backendMessage) {
    return backendMessage;
  }

  if (statusCode) {
    return `${statusCode}: Request failed`;
  }

  return fallbackMessage;
}

const BULK_FILE_EXTENSIONS = new Set(["csv", "xlsx", "xls"]);

export function isValidBulkCampaignFile(file: File): boolean {
  const extension = file.name.toLowerCase().split(".").pop();
  return extension ? BULK_FILE_EXTENSIONS.has(extension) : false;
}
