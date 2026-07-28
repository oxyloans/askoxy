import axios from 'axios';
import BASE_URL from '../../Config';

const api = axios.create({ baseURL: `http://localhost:9876/api/vibecode-service` });

const ENGINE_BASE = `${BASE_URL}/vibecode-service`;

api.interceptors.request.use(
  (config) => {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

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


  getUseCaseSuggestions: () =>
    api.get<{ useCaseId: string; name: string; domain: string; moduleName: string }[]>(
      '/usecase-suggestions',
    ),


  submitStage2: (sessionId: string, answers: Record<string, unknown>) =>
    api.post<{ sessionId: string; status: string }>(`/stage2/${sessionId}`, { answers }),

  getSession: (sessionId: string) =>
    api.get<{
      sessionId: string;
      status: string;
      currentStep: number;
      bankProfile?: any;
      discoveredSystem?: any;
      dynamicRequirements?: any;
    }>(`/session/${sessionId}`),


  getSessions: () =>
    api.get<GenerationSession[]>('/sessions'),


  getSessionHistory: (sessionId: string) =>
    api.get<GenerationStepHistory[]>(`/session/${sessionId}/history`),

  stopSession: (sessionId: string) =>
    api.post<{ sessionId: string; status: string }>(`/session/${sessionId}/stop`),

  resumeSession: (sessionId: string) =>
    api.post<{ sessionId: string; status: string; currentStep: number }>(`/session/${sessionId}/resume`),


  deleteSession: (sessionId: string) =>
    api.delete<{ sessionId: string; message: string }>(`/session/${sessionId}`),

  getDownloadUrl: (sessionId: string): string =>
    `${ENGINE_BASE}/download/${sessionId}`,

  deploySession: (sessionId: string) =>
    api.post<{ sessionId: string; status: string }>(`/session/${sessionId}/deploy`),


  getDeployStatus: (sessionId: string) =>
    api.get<{
      sessionId: string;
      deployStatus: string;
      deployUrl: string;
      deployLogs: string;
    }>(`/session/${sessionId}/deploy-status`),
};

export default engineApi;
