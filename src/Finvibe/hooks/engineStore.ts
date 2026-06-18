import { create } from 'zustand';
import { type AgentInfo, type SSEEvent, AGENT_DEFINITIONS, type AgentStatus } from '../type/agents';
import BASE_URL from '../../Config';

export interface Stage1Data {
  selectedUseCase: string;
  regulatoryFramework: string;
  bankName: string;
  backendStack: string;
  frontendStack: string;
  databaseType: string;
  aiProvider: string;
  aiModelId: string;
  existingServices: string[];
}

export interface LogEntry {
  timestamp: string;
  agent: string;
  message: string;
  level: 'info' | 'success' | 'error' | 'warn';
}

interface EngineStore {
  sessionId: string | null;
  stage1Data: Stage1Data | null;
  stage2Questions: unknown[] | null;
  stage2Documents: unknown[] | null;
  agentStatuses: AgentInfo[];
  engineContext: unknown | null;
  downloadUrl: string | null;
  isRunning: boolean;
  currentStep: number;
  runStatus: 'idle' | 'running' | 'awaiting_input' | 'completed' | 'failed';
  logs: LogEntry[];

  setSessionId: (id: string) => void;
  setStage1Data: (data: Stage1Data) => void;
  setStage2Questions: (questions: unknown[], documents: unknown[]) => void;
  updateAgentStatus: (step: number, status: AgentStatus, data?: unknown) => void;
  processSSEEvent: (event: SSEEvent) => void;
  setDownloadUrl: (url: string) => void;
  setEngineContext: (ctx: unknown) => void;
  addLog: (agent: string, message: string, level?: LogEntry['level']) => void;
  syncFromSession: (session: any) => void;
  reset: () => void;
}

const initialAgentStatuses = (): AgentInfo[] =>
  AGENT_DEFINITIONS.map(def => ({ ...def, status: 'waiting' as AgentStatus }));

export const useEngineStore = create<EngineStore>((set, get) => ({
  sessionId: null,
  stage1Data: null,
  stage2Questions: null,
  stage2Documents: null,
  agentStatuses: initialAgentStatuses(),
  engineContext: null,
  downloadUrl: null,
  isRunning: false,
  currentStep: 0,
  runStatus: 'idle',
  logs: [],

  setSessionId: (id) => set({ sessionId: id }),
  setStage1Data: (data) => {
    try { sessionStorage.setItem('finvibe_stage1', JSON.stringify(data)) } catch {}
    set({ stage1Data: data })
  },
  setStage2Questions: (questions, documents) =>
    set({ stage2Questions: questions, stage2Documents: documents }),

  updateAgentStatus: (step, status, data) =>
    set(state => ({
      agentStatuses: state.agentStatuses.map(a =>
        a.step === step
          ? {
              ...a,
              status,
              outputSummary: data
                ? JSON.stringify(data).substring(0, 120) + '...'
                : a.outputSummary,
              startTime: status === 'running' ? new Date().toISOString() : a.startTime,
              endTime:
                status === 'completed' || status === 'failed'
                  ? new Date().toISOString()
                  : a.endTime,
            }
          : a
      ),
      currentStep: status === 'running' ? step : state.currentStep,
      isRunning: status === 'running' ? true : state.isRunning,
    })),

  processSSEEvent: (event) => {
    const { updateAgentStatus, setStage2Questions, addLog, sessionId } = get();

    if (event.status === 'running' || event.status === 'started') {
      updateAgentStatus(event.step, 'running');
      addLog(
        event.agent,
        event.message ?? `⚙ Step ${event.step} — ${event.agent} is processing...`,
        'info'
      );
      set({ runStatus: 'running', isRunning: true });
    } else if (event.status === 'progress') {
      // Progress updates during a running step
      addLog(
        event.agent,
        event.message ?? `Step ${event.step} in progress...`,
        'info'
      );
    } else if (event.status === 'completed') {
      updateAgentStatus(event.step, 'completed', event.data);
      const data = event.data as Record<string, unknown> | undefined;
      addLog(
        event.agent,
        event.message ?? `✅ Step ${event.step} — ${event.agent} completed`,
        'success'
      );
      if (event.step === 12) {
        // Try to get the real package filename from the backend
        const pkgName = (data?.packageName as string) ?? (data?.outputPackage as Record<string, string>)?.packageName;
        const filename = pkgName ?? `generated-package-${sessionId}.zip`;
        set({
          runStatus: 'completed',
          downloadUrl: `${BASE_URL}/vibecode-service/download/${sessionId}`,
          isRunning: false,
        });
        addLog('PackageBuilderAgent', `🎉 Code generation complete! 📦 ${filename} is ready for download.`, 'success');
      }
    } else if (event.status === 'awaiting_user_input') {
      const data = event.data as Record<string, unknown> | undefined;

      let questions: unknown[] = [];
      let documents: unknown[] = [];

      if (Array.isArray(data?.questions)) {
        // Direct backend SSE payload
        questions = (data!.questions) as unknown[];
        documents = (data?.documents ?? []) as unknown[];
      } else if (data?.runStatus === 'AWAITING_USER_INPUT') {
        // Snapshot: dig into the session context
        const reqCtx = (data?.requirementsContext ?? data) as Record<string, unknown>;
        questions = (reqCtx?.questions ?? []) as unknown[];
        documents = (reqCtx?.documents ?? []) as unknown[];
      }

      updateAgentStatus(event.step, 'awaiting_input');
      setStage2Questions(questions, documents);
      set({ runStatus: 'awaiting_input' });
      addLog(event.agent, `⏸ Step ${event.step} — Awaiting Stage 2 configuration input from user`, 'warn');
    } else if (event.status === 'paused') {
      updateAgentStatus(event.step, 'waiting');
      set({ runStatus: 'idle', isRunning: false });
      addLog(
        event.agent,
        event.message ?? `⏸ Step ${event.step} — Generation paused`,
        'warn'
      );
    } else if (event.status === 'resumed') {
      updateAgentStatus(event.step, 'running');
      set({ runStatus: 'running', isRunning: true });
      addLog(
        event.agent,
        event.message ?? `⚙ Step ${event.step} — Generation resumed`,
        'info'
      );
    } else if (event.status === 'error') {
      updateAgentStatus(event.step, 'failed');
      set({ runStatus: 'failed', isRunning: false });
      addLog(event.agent, `❌ Step ${event.step} — ${event.message ?? 'Agent failed with unknown error'}`, 'error');
    }

    // Store context if provided
    if (event.data && event.step !== undefined) {
      set({ engineContext: event.data });
    }
  },

  setDownloadUrl: (url) => set({ downloadUrl: url }),
  setEngineContext: (ctx) => set({ engineContext: ctx }),

  addLog: (agent, message, level = 'info') =>
    set(state => ({
      logs: [
        ...state.logs,
        { timestamp: new Date().toISOString(), agent, message, level },
      ].slice(-200), // Keep last 200 entries
    })),

  syncFromSession: (session) => {
    if (!session) return;
    const { sessionId } = get();

    // 1. Sync stage1Data if present
    const bp = session.bankProfile;
    let stage1Data = null;
    if (bp) {
      stage1Data = {
        selectedUseCase: bp.selectedUseCase ?? bp.useCaseId ?? '',
        regulatoryFramework: bp.regulatoryFramework ?? '',
        bankName: bp.bankName ?? '',
        backendStack: bp.backendStack ?? '',
        frontendStack: bp.frontendStack ?? '',
        databaseType: bp.databaseType ?? '',
        aiProvider: bp.aiProvider ?? '',
        aiModelId: bp.aiModelId ?? '',
        existingServices: bp.existingServices || [],
      };
    }

    // 2. Map runStatus
    let runStatus: 'idle' | 'running' | 'awaiting_input' | 'completed' | 'failed' = 'idle';
    if (session.runStatus === 'COMPLETED') runStatus = 'completed';
    else if (session.runStatus === 'FAILED') runStatus = 'failed';
    else if (session.runStatus === 'AWAITING_USER_INPUT') runStatus = 'awaiting_input';
    else if (session.runStatus === 'RUNNING' || session.runStatus === 'INITIALIZING') runStatus = 'running';
    else if (session.runStatus === 'PAUSED') runStatus = 'idle';

    // 3. Set downloadUrl if completed
    let downloadUrl = null;
    if (session.runStatus === 'COMPLETED' || (session.outputPackage && session.outputPackage.zipContent)) {
      downloadUrl = `${BASE_URL}/vibecode-service/download/${session.sessionId || sessionId}`;
    }

    // 4. Map questions and documents for Stage 2 if available
    const reqs = session.dynamicRequirements;
    const questions = reqs?.configurationQuestions || [];
    const documents = reqs?.requiredDocuments || [];

    // 5. Reconstruct agentStatuses
    const agentStatuses = get().agentStatuses.map(agent => {
      let status: 'waiting' | 'running' | 'completed' | 'failed' | 'awaiting_input' = 'waiting';
      let outputSummary = agent.outputSummary;

      // Reconstruct summaries from completed objects in backend context
      if (agent.step === 0 && session.discoveredSystem) {
        const ds = session.discoveredSystem;
        outputSummary = ds.provided 
          ? `System: ${ds.systemType || 'UNKNOWN'}, Endpoints: ${ds.endpoints?.length || 0}`
          : 'No API specification provided';
      } else if (agent.step === 1 && session.bankProfile) {
        const profile = session.bankProfile;
        outputSummary = `Bank: ${profile.bankName}, Framework: ${profile.regulatoryFramework}`;
      } else if (agent.step === 2 && session.dynamicRequirements) {
        const reqObj = session.dynamicRequirements;
        outputSummary = `Questions: ${reqObj.configurationQuestions?.length || 0}, Docs: ${reqObj.requiredDocuments?.length || 0}`;
      } else if (agent.step === 3 && session.useCaseContext) {
        const uc = session.useCaseContext;
        outputSummary = `Complexity: ${uc.estimatedComplexity || 'MEDIUM'}, Flow Steps: ${uc.executionFlow?.length || 0}`;
      } else if (agent.step === 4 && session.apiMappings && session.apiMappings.length > 0) {
        outputSummary = `Mapped APIs: ${session.apiMappings.length}`;
      } else if (agent.step === 5 && session.complianceContext) {
        const cc = session.complianceContext;
        outputSummary = `Loaded Rules: ${cc.rules?.length || 0}`;
      } else if (agent.step === 6 && session.promptTemplates) {
        outputSummary = 'System prompt configured';
      } else if (agent.step === 7 && session.intermediateRepresentation) {
        const ir = session.intermediateRepresentation;
        outputSummary = `Entities: ${ir.entities?.length || 0}, Screens: ${ir.screens?.length || 0}`;
      } else if (agent.step === 8 && session.generatedBackend) {
        const gb = session.generatedBackend;
        outputSummary = `Backend Files: ${gb.files?.length || 0}`;
      } else if (agent.step === 9 && session.generatedFrontend) {
        const gf = session.generatedFrontend;
        outputSummary = `Frontend Screens: ${gf.screens?.length || 0}`;
      } else if (agent.step === 10 && session.generatedDatabase) {
        const gd = session.generatedDatabase;
        outputSummary = `Tables: ${gd.entities?.length || 0}`;
      } else if (agent.step === 11 && session.generatedTests) {
        const gt = session.generatedTests;
        outputSummary = `Test Suites: ${gt.testSuites?.length || 0}`;
      } else if (agent.step === 12 && session.outputPackage) {
        const op = session.outputPackage;
        outputSummary = op.zipContent 
          ? `ZIP Size: ${(op.zipContent.length / 1024).toFixed(0)} KB` 
          : 'Ready';
      }

      // Reconstruct status based on session status and current step
      if (session.runStatus === 'COMPLETED') {
        status = 'completed';
      } else if (session.runStatus === 'FAILED') {
        if (agent.step < session.currentStep) {
          status = 'completed';
        } else if (agent.step === session.currentStep) {
          status = 'failed';
        }
      } else {
        if (agent.step < session.currentStep) {
          status = 'completed';
        } else if (agent.step === session.currentStep) {
          if (session.runStatus === 'AWAITING_USER_INPUT') {
            status = 'awaiting_input';
          } else if (session.runStatus === 'RUNNING' || session.runStatus === 'INITIALIZING') {
            status = 'running';
          }
        }
      }

      return {
        ...agent,
        status,
        outputSummary,
      };
    });

    set({
      stage1Data: stage1Data || get().stage1Data,
      runStatus,
      downloadUrl,
      stage2Questions: questions.length ? questions : get().stage2Questions,
      stage2Documents: documents.length ? documents : get().stage2Documents,
      agentStatuses,
      isRunning: runStatus === 'running',
    });
  },

  reset: () => {
    try { sessionStorage.removeItem('finvibe_stage1') } catch {}
    set({
      sessionId: null,
      stage1Data: null,
      stage2Questions: null,
      stage2Documents: null,
      agentStatuses: initialAgentStatuses(),
      engineContext: null,
      downloadUrl: null,
      isRunning: false,
      currentStep: 0,
      runStatus: 'idle',
      logs: [],
    })
  },
}));
