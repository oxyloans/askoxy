import BASE_URL from "../../Config";

export const ATS_API_BASE = `${BASE_URL}/marketing-service/campgin`;

export type AtsReport = {
  overallATSScore: number;
  atsGrade: string;
  atsFriendliness: string;
  resumeCompletenessScore: number;
  professionalismScore: number;
  readabilityScore: number;
  eligibleToUseResumeEditor: boolean;
  minimumResumeScoreForEditor: number;
  resumeEditorReason: string;
  sectionScores: Record<string, number>;
  analysis: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  finalReview: string;
};

export type ResumeStatusResponse = {
  status: boolean;
  jobId: string;
  resumeStatus: string;
  originalFilename: string;
  message?: string;
  atsReport: AtsReport | null;
  errorMessage: string | null;
  createdAt?: number;
  updatedAt?: number;
  resumeUrl?: string | null;
};

export type ParseResumeResponse = {
  jobId: string | null;
  status: boolean;
  resumeStatus: string;
  message: string;
  errorMessage?: string | null;
};

export type ImprovementStartResponse = {
  status: boolean;
  message: string;
  jobId: string;
  overallATSScore: number;
  eligible: boolean;
  pdfStatus?: string;
  errorMessage?: string | null;
};

export type ImprovementStatusResponse = {
  status: boolean;
  message: string;
  jobId: string;
  pdfStatus: string;
  retryCount: number;
  errorMessage?: string | null;
};

const readJson = async <T>(response: Response, fallback: T): Promise<T> =>
  response.json().catch(() => fallback);

export async function uploadResume(
  userId: string,
  file: File,
  signal: AbortSignal,
): Promise<{ response: Response; data: ParseResumeResponse }> {
  const form = new FormData();
  const uploadFile = /\.pdf$/i.test(file.name)
    ? new Blob([file], { type: "application/pdf" })
    : file;
  form.append("resume", uploadFile, file.name);

  const response = await fetch(
    `${ATS_API_BASE}/parse-resume?userId=${encodeURIComponent(userId)}`,
    { method: "POST", headers: { accept: "*/*" }, body: form, signal },
  );
  const data = await readJson<ParseResumeResponse>(response, {
    jobId: null,
    status: false,
    resumeStatus: "FAILED",
    message: "Invalid server response.",
  });
  return { response, data };
}

export async function getResumeStatus(
  jobId: string,
  signal: AbortSignal,
): Promise<{ response: Response; data: ResumeStatusResponse }> {
  const response = await fetch(
    `${ATS_API_BASE}/status/${encodeURIComponent(jobId)}`,
    { headers: { accept: "*/*" }, signal },
  );
  const data = await readJson<ResumeStatusResponse>(response, {
    jobId,
    status: false,
    resumeStatus: "ERROR",
    originalFilename: "",
    atsReport: null,
    errorMessage: "Invalid status response.",
  });
  return { response, data };
}

export async function startImprovement(
  jobId: string,
  score: number,
  signal: AbortSignal,
): Promise<{ response: Response; data: ImprovementStartResponse }> {
  const response = await fetch(
    `${ATS_API_BASE}/resume/update/${encodeURIComponent(jobId)}/start`,
    { method: "POST", headers: { accept: "*/*" }, signal },
  );
  const data = await readJson<ImprovementStartResponse>(response, {
    status: false,
    message: "Invalid server response.",
    jobId,
    overallATSScore: score,
    eligible: false,
  });
  return { response, data };
}

export async function getImprovementStatus(
  jobId: string,
  signal: AbortSignal,
): Promise<{ response: Response; data: ImprovementStatusResponse }> {
  const response = await fetch(
    `${ATS_API_BASE}/resume/update/${encodeURIComponent(jobId)}/status`,
    { headers: { accept: "*/*" }, signal },
  );
  const data = await readJson<ImprovementStatusResponse>(response, {
    status: false,
    message: "Invalid status response.",
    jobId,
    pdfStatus: "ERROR",
    retryCount: 2,
  });
  return { response, data };
}

export async function downloadImprovedResume(jobId: string): Promise<{
  blob: Blob;
  filename: string;
}> {
  const response = await fetch(
    `${ATS_API_BASE}/resume/update/${encodeURIComponent(jobId)}/download`,
    { headers: { accept: "*/*" } },
  );
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let apiMessage = "";
    if (contentType.includes("application/json")) {
      const errorBody = await response.json().catch(() => null) as
        | { message?: string; errorMessage?: string; error?: string }
        | null;
      apiMessage = errorBody?.message || errorBody?.errorMessage || errorBody?.error || "";
    } else {
      apiMessage = (await response.text().catch(() => "")).trim();
    }
    throw new Error(apiMessage || `Download failed (${response.status}). Please try again.`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  const filename = match?.[1]
    ? decodeURIComponent(match[1].replace(/"/g, "").trim())
    : "ASKOXY.AI_RESUME.pdf";
  return { blob, filename };
}
