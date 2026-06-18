import axios from 'axios';
import BASE_URL from '../../Config';

const api = axios.create({ baseURL: `${BASE_URL}/vibecode-service` });

// ─── Base URL used for direct fetch/download calls ───────────────────────────
const ENGINE_BASE = `${BASE_URL}/vibecode-service`;

api.interceptors.request.use(
  (config) => {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error(`[API Error] ${message}`, error);
    return Promise.reject(new Error(message));
  }
);

export interface GenerationSession {
  sessionId: string;
  bankName: string;
  useCaseId: string;
  regulatoryFramework: string;
  status: 'INITIALIZING' | 'RUNNING' | 'AWAITING_USER_INPUT' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  currentStep: number;
  updatedAt: string;
}

export interface GenerationStepHistory {
  id: number;
  sessionId: string;
  stepNumber: number;
  agentName: string;
  status: string;
  outputDataJson: string; // serialized JSON
  timestamp: string;
}

export const engineApi = {
  /**
   * Stage 1: Start the generation pipeline with form data.
   * POST /api/vibecode-service/engine-start
   * Accepts multipart/form-data (fields + optional swagger specFile).
   */
  startGeneration: (formData: FormData) =>
    api.post<{ sessionId: string; status: string }>('/engine-start', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Stage 2: Submit dynamic configuration answers.
   * POST /api/vibecode-service/stage2/{sessionId}
   */
  submitStage2: (sessionId: string, answers: Record<string, unknown>) =>
    api.post<{ sessionId: string; status: string }>(`/stage2/${sessionId}`, { answers }),

  /**
   * Fetch current session state (for recovery / snapshot).
   * GET /api/vibecode-service/session/{sessionId}
   */
  getSession: (sessionId: string) =>
    api.get<{
      sessionId: string;
      status: string;
      currentStep: number;
      bankProfile?: any;
      discoveredSystem?: any;
      dynamicRequirements?: any;
    }>(`/session/${sessionId}`),

  /**
   * Fetch all historical generation sessions.
   * GET /api/vibecode-service/sessions
   */
  getSessions: () =>
    api.get<GenerationSession[]>('/sessions'),

  /**
   * Fetch audit/step logs of a session.
   * GET /api/vibecode-service/session/{sessionId}/history
   */
  getSessionHistory: (sessionId: string) =>
    api.get<GenerationStepHistory[]>(`/session/${sessionId}/history`),

  /**
   * Stop/Pause a running generation pipeline.
   * POST /api/vibecode-service/session/{sessionId}/stop
   */
  stopSession: (sessionId: string) =>
    api.post<{ sessionId: string; status: string }>(`/session/${sessionId}/stop`),

  /**
   * Resume a paused generation pipeline.
   * POST /api/vibecode-service/session/{sessionId}/resume
   */
  resumeSession: (sessionId: string) =>
    api.post<{ sessionId: string; status: string; currentStep: number }>(`/session/${sessionId}/resume`),

  /**
   * Delete a session and its ZIP bytes from database.
   * DELETE /api/vibecode-service/session/{sessionId}
   */
  deleteSession: (sessionId: string) =>
    api.delete<{ sessionId: string; message: string }>(`/session/${sessionId}`),

  /**
   * Get the direct download URL for the generated ZIP package.
   * GET /api/vibecode-service/download/{sessionId}
   */
  getDownloadUrl: (sessionId: string): string =>
    `${ENGINE_BASE}/download/${sessionId}`,
};

export default engineApi;
