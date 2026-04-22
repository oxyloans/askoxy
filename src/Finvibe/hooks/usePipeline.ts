import { useState, useCallback, useRef, useEffect } from "react";
import { PipelineStep, GenerationResult, CodeFile } from "../type/types";
import { collectAllFiles, mergeFiles, dedupeFiles } from "../type/collectAllFiles";
import BASE_URL from "../../Config";

const BASE = `${BASE_URL}/vibecode-service`;

const STEPS = [
  { name: "planning", step: 1, label: "Planning" },
  { name: "clarification", step: 2, label: "Clarification" },
  { name: "techstack", step: 3, label: "Tech Stack" },
  { name: "usecases", step: 4, label: "Use Cases" },
  { name: "compliance", step: 5, label: "Compliance" },
  { name: "systemdesign", step: 6, label: "System Design" },
  { name: "structure", step: 7, label: "Folder Structure" },
  { name: "prompt", step: 8, label: "Prompt Builder" },
  { name: "backend", step: 9, label: "Backend Generation" },
  { name: "frontend", step: 10, label: "Frontend Generation" },
  { name: "database", step: 11, label: "Database Generation" },
  { name: "testcases", step: 12, label: "Test Cases & Data" },
];

type RawFile = { path: string; content?: string; description?: string };

const toCodeFiles = (arr: any[]): CodeFile[] =>
  arr
    .filter(
      (f): f is { path: string; content: string } =>
        typeof f?.path === "string" &&
        typeof f?.content === "string" &&
        f.content !== "" &&
        f.content !== "null"
    )
    .map(f => ({ path: f.path, content: f.content }));

function buildInitialSteps(): PipelineStep[] {
  return STEPS.map(s => ({ step: s.step, label: s.label, status: "idle" as const }));
}

export type StepTokensMap = Record<number, string>;

export interface ClarificationQuestion {
  id: string;
  question: string;
  options?: string[];
  type?: string;
}

export interface ConversationTurn {
  prompt: string;
  steps: PipelineStep[];
  stepTokens: StepTokensMap;
  result: GenerationResult | null;
  partialResult: Partial<GenerationResult>;
  chatMessage: string | null;
  error: string | null;
  sessionId?: string;
}

type SSEResult = {
  done: boolean;
  result?: GenerationResult;
  chat?: string;
  waitingForAnswer?: boolean;
};

type LocalUpdater = {
  updateStep: (stepNum: number, patch: Partial<PipelineStep>) => void;
  appendToken: (stepNum: number, text: string) => void;
  setPartial: (updater: (prev: Partial<GenerationResult>) => Partial<GenerationResult>) => void;
  setClarification: (q: (ClarificationQuestion & { index: number; total: number }) | null) => void;
};

function streamStepSSE(
  sessionId: string,
  stepName: string,
  u: LocalUpdater,
  getLocalPartial: () => Partial<GenerationResult>,
  getStepTokens: () => StepTokensMap,
  signal?: AbortSignal
): Promise<SSEResult> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const abortHandler = () => {
      reader?.cancel();
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', abortHandler);

    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    fetch(`${BASE}/session/${sessionId}/step/${stepName}`, { method: "POST", signal })
      .then(res => {
        if (!res.ok) {
          signal?.removeEventListener('abort', abortHandler);
          reject(new Error(`Step ${stepName} failed: ${res.status}`));
          return;
        }

        reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let lastEvent = "";

        const read = (): Promise<void> => {
          if (signal?.aborted) {
            reader?.cancel();
            signal?.removeEventListener('abort', abortHandler);
            return Promise.reject(new DOMException('Aborted', 'AbortError'));
          }

          return reader!.read().then(({ done, value }) => {
            if (signal?.aborted) {
              reader?.cancel();
              signal?.removeEventListener('abort', abortHandler);
              return Promise.reject(new DOMException('Aborted', 'AbortError'));
            }

            if (done) {
              signal?.removeEventListener('abort', abortHandler);
              resolve({ done: false });
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                lastEvent = line.replace("event:", "").trim();
                continue;
              }
              if (!line.startsWith("data:")) continue;

              const json = line.replace("data:", "").trim();
              try {
                const payload = JSON.parse(json);

                if (lastEvent === "step") {
                  u.updateStep(payload.step, {
                    status: payload.status,
                    label: payload.label,
                    data: (() => {
                      const incoming = payload.data;
                      const incomingFiles: RawFile[] | undefined =
                        Array.isArray(incoming?.fileList) ? incoming.fileList :
                          Array.isArray(incoming?.files) ? incoming.files : undefined;
                      if (!incomingFiles || incomingFiles.length === 0) return incoming;
                      return { ...incoming, files: incomingFiles, fileList: incomingFiles };
                    })(),
                  });

                  const rawFiles: RawFile[] =
                    Array.isArray(payload.data?.fileList) ? payload.data.fileList :
                      Array.isArray(payload.data?.files) ? payload.data.files : [];

                  const files = toCodeFiles(rawFiles);

                  if (files.length > 0) {
                    if (payload.label === "Backend Generation")
                      u.setPartial(p => ({ ...p, backend: mergeFiles(p.backend ?? [], files) }));
                    if (payload.label === "Frontend Generation")
                      u.setPartial(p => ({ ...p, frontend: mergeFiles(p.frontend ?? [], files) }));
                    if (payload.label === "Database Generation")
                      u.setPartial(p => ({ ...p, database: mergeFiles(p.database ?? [], files) }));
                  }

                } else if (lastEvent === "token") {
                  u.appendToken(payload.step, payload.text);

                } else if (lastEvent === "clarification-question") {
                  u.setClarification({ ...payload.question, index: payload.index, total: payload.total });

                } else if (lastEvent === "clarification-waiting") {
                  signal?.removeEventListener('abort', abortHandler);
                  resolve({ done: true, waitingForAnswer: true });
                  return;

                } else if (lastEvent === "done") {
                  // Read token text for this specific step
                  const stepMeta = STEPS.find(s => s.name === stepName);
                  const tokenText = stepMeta ? (getStepTokens()[stepMeta.step] ?? "") : "";

                  // Scan accumulated token stream for all {"files":[...]} blobs
                  const fromTokens = collectAllFiles(tokenText);

                  const backendFromPayload = dedupeFiles(
                    toCodeFiles(Array.isArray(payload?.backend) ? payload.backend : [])
                  );
                  const frontendFromPayload = dedupeFiles(
                    toCodeFiles(Array.isArray(payload?.frontend) ? payload.frontend : [])
                  );
                  const databaseFromPayload = dedupeFiles(
                    toCodeFiles(Array.isArray(payload?.database) ? payload.database : [])
                  );
                  const filesFromPayload = dedupeFiles(
                    toCodeFiles([
                      ...(Array.isArray(payload?.files) ? payload.files : []),
                      ...(Array.isArray(payload?.fileList) ? payload.fileList : []),
                    ])
                  );

                  // Merge: tokens (base) → generic payload files → specific category payload
                  const backend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), backendFromPayload);
                  const frontend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), frontendFromPayload);
                  const database = mergeFiles(mergeFiles(fromTokens, filesFromPayload), databaseFromPayload);

                  // Only update a category if it has files — prevents empty merge wiping accumulated data
                  u.setPartial(p => ({
                    backend: backend.length > 0 ? mergeFiles(p.backend ?? [], backend) : (p.backend ?? []),
                    frontend: frontend.length > 0 ? mergeFiles(p.frontend ?? [], frontend) : (p.frontend ?? []),
                    database: database.length > 0 ? mergeFiles(p.database ?? [], database) : (p.database ?? []),
                  }));

                  const lp = getLocalPartial();
                  signal?.removeEventListener('abort', abortHandler);
                  resolve({
                    done: true,
                    result: {
                      backend: mergeFiles(lp.backend ?? [], backend),
                      frontend: mergeFiles(lp.frontend ?? [], frontend),
                      database: mergeFiles(lp.database ?? [], database),
                    },
                  });
                  return;

                } else if (lastEvent === "chat") {
                  signal?.removeEventListener('abort', abortHandler);
                  resolve({ done: true, chat: payload.message });
                  return;

                } else if (lastEvent === "step_done") {
                  signal?.removeEventListener('abort', abortHandler);
                  resolve({ done: false });
                  return;

                } else if (lastEvent === "error") {
                  signal?.removeEventListener('abort', abortHandler);
                  reject(new Error(payload.message));
                  return;
                }

              } catch { /* ignore partial / malformed chunks */ }
            }
            return read();
          });
        };

        read().catch((err) => {
          signal?.removeEventListener('abort', abortHandler);
          reject(err);
        });
      }).catch((err) => {
        signal?.removeEventListener('abort', abortHandler);
        reject(err);
      });
  });
}

export function usePipeline() {
  const [steps, setSteps] = useState<PipelineStep[]>(buildInitialSteps());
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [partialResult, setPartialResult] = useState<Partial<GenerationResult>>({});
  const [chatMessage, setChatMessage] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepTokens, setStepTokens] = useState<StepTokensMap>({});
  const [prompt, setPrompt] = useState<string>("");
  const [clarificationQuestion, setClarificationQuestion] =
    useState<(ClarificationQuestion & { index: number; total: number }) | null>(null);
  const [history, setHistory] = useState<ConversationTurn[]>([]);

  const sessionIdRef = useRef<string | null>(null);
  const partialResultRef = useRef<Partial<GenerationResult>>({});
  const stepsRef = useRef<PipelineStep[]>(buildInitialSteps());
  const stepTokensRef = useRef<StepTokensMap>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const wasRunningRef = useRef(false);

  const updateStep = useCallback((stepNum: number, patch: Partial<PipelineStep>) => {
    setSteps(prev => {
      const next = prev.map(s => {
        if (s.step !== stepNum) return s;

        const prevData = s.data as any;
        const nextData = patch.data as any;

        if (nextData && (Array.isArray(nextData.files) || Array.isArray(nextData.fileList))) {
          const prevFiles = toCodeFiles(prevData?.fileList ?? prevData?.files ?? []);
          const nextFiles = toCodeFiles(nextData.fileList ?? nextData.files ?? []);
          const merged = mergeFiles(prevFiles, nextFiles);
          patch = { ...patch, data: { ...nextData, files: merged, fileList: merged } };
        }

        return { ...s, ...patch };
      });
      stepsRef.current = next;
      return next;
    });
  }, []);

  const appendToken = useCallback((stepNum: number, text: string) => {
    setStepTokens(prev => ({ ...prev, [stepNum]: (prev[stepNum] ?? "") + text }));
    stepTokensRef.current = { ...stepTokensRef.current, [stepNum]: (stepTokensRef.current[stepNum] ?? "") + text };
  }, []);

  const setPartialResultSynced = useCallback(
    (updater: (prev: Partial<GenerationResult>) => Partial<GenerationResult>) => {
      setPartialResult(prev => {
        const next = updater(prev);
        partialResultRef.current = next;
        return next;
      });
    }, []
  );

  // ── run ──────────────────────────────────────────────────────────────────────
  const run = useCallback(async (userPrompt: string) => {
    const hasActiveData =
      steps.some(s => s.status !== "idle") ||
      result ||
      Object.keys(stepTokens).length > 0 ||
      chatMessage;

    if (hasActiveData && prompt) {
      setHistory(prev => [...prev, { prompt, steps, stepTokens, result, partialResult, chatMessage, error }]);
    }

    setSteps(buildInitialSteps());
    stepsRef.current = buildInitialSteps();
    setResult(null);
    setPartialResult({});
    partialResultRef.current = {};
    setChatMessage(null);
    setError(null);
    setStopped(false);
    setStepTokens({});
    stepTokensRef.current = {};
    setClarificationQuestion(null);
    setPrompt(userPrompt);
    setRunning(true);

    let localPartial: Partial<GenerationResult> = {};
    let localResult: GenerationResult | null = null;

    const u: LocalUpdater = {
      updateStep: (stepNum, patch) => updateStep(stepNum, patch),
      appendToken: (stepNum, text) => appendToken(stepNum, text),
      setPartial: (updater) => {
        localPartial = updater(localPartial);
        setPartialResultSynced(updater);
      },
      setClarification: (q) => setClarificationQuestion(q),
    };

    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`${BASE}/session/start?userid=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (!res.ok) throw new Error(`Failed to start session: ${res.status}`);
      const { sessionId } = await res.json();
      sessionIdRef.current = sessionId;

      abortControllerRef.current = new AbortController();

      for (const step of STEPS) {
        const r = await streamStepSSE(
          sessionId,
          step.name,
          u,
          () => localPartial,
          () => stepTokensRef.current,
          abortControllerRef.current.signal
        );

        if (r.chat) {
          setChatMessage(r.chat);
          setHistory(prev => [...prev, {
            prompt: userPrompt,
            steps: buildInitialSteps(),
            stepTokens: {},
            result: null,
            partialResult: {},
            chatMessage: r.chat!,
            error: null,
          }]);
          setChatMessage(null);
          setPrompt("");
          break;
        }

        if (r.waitingForAnswer) { setPaused(true); setRunning(false); return; }

        if (r.done && r.result) {
          localResult = r.result;
          setResult(r.result);
          break;
        }
      }

      // Fallback: resolve from accumulated partialResult if no explicit done result
      if (!localResult) {
        const latest = partialResultRef.current;
        if (latest.backend?.length || latest.frontend?.length || latest.database?.length) {
          localResult = {
            backend: latest.backend ?? [],
            frontend: latest.frontend ?? [],
            database: latest.database ?? [],
          };
          setResult(localResult);
        }
      }

      // Second fallback: scan all token text for files
      if (!localResult) {
        const allTokenText = Object.values(stepTokensRef.current).join("\n");
        const fromTokens = collectAllFiles(allTokenText);
        if (fromTokens.length > 0) {
          localResult = { backend: fromTokens, frontend: [], database: [] };
          setResult(localResult);
        }
      }

      if (localResult) {
        const finalSteps = stepsRef.current;
        const finalTokens = stepTokensRef.current;

        const patchedSteps = finalSteps.map(s => {
          if (s.label === "Backend Generation" && localResult!.backend.length > 0)
            return { ...s, data: { files: localResult!.backend, fileList: localResult!.backend } };
          if (s.label === "Frontend Generation" && localResult!.frontend.length > 0)
            return { ...s, data: { files: localResult!.frontend, fileList: localResult!.frontend } };
          if (s.label === "Database Generation" && localResult!.database.length > 0)
            return { ...s, data: { files: localResult!.database, fileList: localResult!.database } };
          return s;
        });

        setSteps(buildInitialSteps());
        stepsRef.current = buildInitialSteps();
        setResult(null);
        setPartialResult({});
        partialResultRef.current = {};
        setStepTokens({});
        stepTokensRef.current = {};
        setPrompt("");

        setHistory(h => [...h, {
          prompt: userPrompt,
          steps: patchedSteps,
          stepTokens: finalTokens,
          result: localResult,
          partialResult: {},
          chatMessage: null,
          error: null,
        }]);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Generation stopped by user');
        setStopped(true);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      abortControllerRef.current = null;
    }

    setRunning(false);
  }, [updateStep, appendToken, setPartialResultSynced, steps, result, stepTokens, prompt, partialResult, chatMessage, error]);

  // ── answerQuestion ────────────────────────────────────────────────────────────
  const answerQuestion = useCallback(async (answer: string) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    setClarificationQuestion(null);
    setPaused(false);
    setRunning(true);

    try {
      const res = await fetch(`${BASE}/session/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      if (!res.ok) throw new Error(`Answer failed: ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastEvent = "";

      const read = (): Promise<void> => reader.read().then(({ done, value }) => {
        if (done) { return; }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            lastEvent = line.replace("event:", "").trim();
            continue;
          }
          if (!line.startsWith("data:")) continue;

          const json = line.replace("data:", "").trim();
          try {
            const payload = JSON.parse(json);

            if (lastEvent === "step") {
              updateStep(payload.step, {
                status: payload.status,
                label: payload.label,
                data: (() => {
                  const incoming = payload.data;
                  const incomingFiles: RawFile[] | undefined =
                    Array.isArray(incoming?.fileList) ? incoming.fileList :
                      Array.isArray(incoming?.files) ? incoming.files : undefined;
                  if (!incomingFiles || incomingFiles.length === 0) return incoming;
                  return { ...incoming, files: incomingFiles, fileList: incomingFiles };
                })(),
              });

              const files = toCodeFiles(
                Array.isArray(payload.data?.fileList) ? payload.data.fileList :
                  Array.isArray(payload.data?.files) ? payload.data.files : []
              );

              if (files.length > 0) {
                if (payload.label === "Backend Generation")
                  setPartialResultSynced(prev => ({ ...prev, backend: mergeFiles(prev.backend ?? [], files) }));
                if (payload.label === "Frontend Generation")
                  setPartialResultSynced(prev => ({ ...prev, frontend: mergeFiles(prev.frontend ?? [], files) }));
                if (payload.label === "Database Generation")
                  setPartialResultSynced(prev => ({ ...prev, database: mergeFiles(prev.database ?? [], files) }));
              }

            } else if (lastEvent === "token") {
              appendToken(payload.step, payload.text);

            } else if (lastEvent === "clarification-question") {
              setClarificationQuestion({ ...payload.question, index: payload.index, total: payload.total });

            } else if (lastEvent === "done") {
              // Scan all accumulated token text for multi-blob files
              const allTokenText = Object.values(stepTokensRef.current).join("\n");
              const fromTokens = collectAllFiles(allTokenText);

              const backendFromPayload = dedupeFiles(
                toCodeFiles(Array.isArray(payload?.backend) ? payload.backend : [])
              );
              const frontendFromPayload = dedupeFiles(
                toCodeFiles(Array.isArray(payload?.frontend) ? payload.frontend : [])
              );
              const databaseFromPayload = dedupeFiles(
                toCodeFiles(Array.isArray(payload?.database) ? payload.database : [])
              );
              const filesFromPayload = dedupeFiles(
                toCodeFiles([
                  ...(Array.isArray(payload?.files) ? payload.files : []),
                  ...(Array.isArray(payload?.fileList) ? payload.fileList : []),
                ])
              );

              const backend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), backendFromPayload);
              const frontend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), frontendFromPayload);
              const database = mergeFiles(mergeFiles(fromTokens, filesFromPayload), databaseFromPayload);

              setPartialResultSynced(prev => ({
                backend: backend.length > 0 ? mergeFiles(prev.backend ?? [], backend) : (prev.backend ?? []),
                frontend: frontend.length > 0 ? mergeFiles(prev.frontend ?? [], frontend) : (prev.frontend ?? []),
                database: database.length > 0 ? mergeFiles(prev.database ?? [], database) : (prev.database ?? []),
              }));

              const latest = partialResultRef.current;
              setResult({
                backend: mergeFiles(latest.backend ?? [], backend),
                frontend: mergeFiles(latest.frontend ?? [], frontend),
                database: mergeFiles(latest.database ?? [], database),
              });

              setRunning(false);
              return;

            } else if (lastEvent === "error") {
              setError(payload.message);
              setRunning(false);
              return;
            }

          } catch { /* ignore partial / malformed chunks */ }
        }
        return read();
      });

      await read();

    } catch (err: any) {
      setError(err.message);
      setRunning(false);
    }
  }, [updateStep, appendToken, setPartialResultSynced]);

  // ── stop ─────────────────────────────────────────────────────────────────────
  const stop = useCallback(async () => {
    const sessionId = sessionIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (sessionId) {
      try {
        await fetch(`${BASE}/stop/${sessionId}`, { method: "POST" });
      } catch (err) {
        console.error("Failed to stop session:", err);
      }
    }

    setRunning(false);
    setStopped(true);
  }, []);

  // ── resume ────────────────────────────────────────────────────────────────────
  const resume = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      setError("No active session to resume");
      return;
    }

    const existingTurn = history[0];
    if (existingTurn) {
      const seededSteps = existingTurn.steps.map(s => ({ ...s }));
      setSteps(seededSteps);
      stepsRef.current = seededSteps;
      setPrompt(existingTurn.prompt);
      const seededPartial: Partial<GenerationResult> = {
        backend: existingTurn.result?.backend ?? [],
        frontend: existingTurn.result?.frontend ?? [],
        database: existingTurn.result?.database ?? [],
      };
      setPartialResult(seededPartial);
      partialResultRef.current = seededPartial;
      setHistory([]);
    }

    setError(null);
    setStopped(false);
    setRunning(true);

    let localPartial: Partial<GenerationResult> = { ...partialResultRef.current };
    let localResult: GenerationResult | null = null;

    const u: LocalUpdater = {
      updateStep: (stepNum, patch) => updateStep(stepNum, patch),
      appendToken: (stepNum, text) => appendToken(stepNum, text),
      setPartial: (updater) => {
        localPartial = updater(localPartial);
        setPartialResultSynced(updater);
      },
      setClarification: (q) => setClarificationQuestion(q),
    };

    try {
      const res = await fetch(`${BASE}/resume/${sessionId}`, { method: "POST" });
      if (!res.ok) throw new Error(`Failed to resume session: ${res.status}`);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const abortHandler = () => {
        reader?.cancel();
      };
      signal.addEventListener('abort', abortHandler);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastEvent = "";

      const read = (): Promise<void> => {
        if (signal.aborted) {
          reader.cancel();
          signal.removeEventListener('abort', abortHandler);
          return Promise.reject(new DOMException('Aborted', 'AbortError'));
        }

        return reader.read().then(({ done, value }) => {
          if (signal.aborted) {
            reader.cancel();
            signal.removeEventListener('abort', abortHandler);
            return Promise.reject(new DOMException('Aborted', 'AbortError'));
          }

          if (done) {
            signal.removeEventListener('abort', abortHandler);
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              lastEvent = line.replace("event:", "").trim();
              continue;
            }
            if (!line.startsWith("data:")) continue;

            const json = line.replace("data:", "").trim();
            try {
              const payload = JSON.parse(json);

              if (lastEvent === "step") {
                updateStep(payload.step, {
                  status: payload.status,
                  label: payload.label,
                  data: (() => {
                    const incoming = payload.data;
                    const incomingFiles: RawFile[] | undefined =
                      Array.isArray(incoming?.fileList) ? incoming.fileList :
                        Array.isArray(incoming?.files) ? incoming.files : undefined;
                    if (!incomingFiles || incomingFiles.length === 0) return incoming;
                    return { ...incoming, files: incomingFiles, fileList: incomingFiles };
                  })(),
                });

                const files = toCodeFiles(
                  Array.isArray(payload.data?.fileList) ? payload.data.fileList :
                    Array.isArray(payload.data?.files) ? payload.data.files : []
                );

                if (files.length > 0) {
                  if (payload.label === "Backend Generation")
                    u.setPartial(p => ({ ...p, backend: mergeFiles(p.backend ?? [], files) }));
                  if (payload.label === "Frontend Generation")
                    u.setPartial(p => ({ ...p, frontend: mergeFiles(p.frontend ?? [], files) }));
                  if (payload.label === "Database Generation")
                    u.setPartial(p => ({ ...p, database: mergeFiles(p.database ?? [], files) }));
                }

              } else if (lastEvent === "token") {
                appendToken(payload.step, payload.text);

              } else if (lastEvent === "done") {
                // Scan all accumulated token text for multi-blob files
                const allTokenText = Object.values(stepTokensRef.current).join("\n");
                const fromTokens = collectAllFiles(allTokenText);

                const backendFromPayload = dedupeFiles(
                  toCodeFiles(Array.isArray(payload?.backend) ? payload.backend : [])
                );
                const frontendFromPayload = dedupeFiles(
                  toCodeFiles(Array.isArray(payload?.frontend) ? payload.frontend : [])
                );
                const databaseFromPayload = dedupeFiles(
                  toCodeFiles(Array.isArray(payload?.database) ? payload.database : [])
                );
                const filesFromPayload = dedupeFiles(
                  toCodeFiles([
                    ...(Array.isArray(payload?.files) ? payload.files : []),
                    ...(Array.isArray(payload?.fileList) ? payload.fileList : []),
                  ])
                );

                const backend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), backendFromPayload);
                const frontend = mergeFiles(mergeFiles(fromTokens, filesFromPayload), frontendFromPayload);
                const database = mergeFiles(mergeFiles(fromTokens, filesFromPayload), databaseFromPayload);

                u.setPartial(prev => ({
                  backend: backend.length > 0 ? mergeFiles(prev.backend ?? [], backend) : (prev.backend ?? []),
                  frontend: frontend.length > 0 ? mergeFiles(prev.frontend ?? [], frontend) : (prev.frontend ?? []),
                  database: database.length > 0 ? mergeFiles(prev.database ?? [], database) : (prev.database ?? []),
                }));

                const latest = partialResultRef.current;
                localResult = {
                  backend: mergeFiles(latest.backend ?? [], backend),
                  frontend: mergeFiles(latest.frontend ?? [], frontend),
                  database: mergeFiles(latest.database ?? [], database),
                };
                setResult(localResult);
                signal.removeEventListener('abort', abortHandler);
                setRunning(false);
                return;

              } else if (lastEvent === "error") {
                setError(payload.message);
                signal.removeEventListener('abort', abortHandler);
                setRunning(false);
                return;
              }

            } catch { /* ignore partial / malformed chunks */ }
          }
          return read();
        });
      };

      await read().catch((err) => {
        signal.removeEventListener('abort', abortHandler);
        throw err;
      });

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Resume stopped by user');
        setStopped(true);
      } else {
        setError(err.message);
      }
      setRunning(false);
    } finally {
      abortControllerRef.current = null;
    }
  }, [updateStep, appendToken, setPartialResultSynced, history]);

  // ── Visibility change handler for auto-resume ─────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasRunningRef.current = running;
      } else {
        if (wasRunningRef.current && sessionIdRef.current && !running) {
          console.log('Screen turned on - auto-resuming generation');
          resume();
        }
        wasRunningRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [running, resume]);

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const progress = Math.round((completedSteps / STEPS.length) * 100);

  const fetchHistory = useCallback(async (): Promise<any[]> => {
    const userId = localStorage.getItem("userId");
    if (!userId) return [];
    try {
      const res = await fetch(`${BASE}/getHistoryByUserId/${userId}`);
      const data = await res.json();
      return Array.isArray(data) ? [...data].reverse() : [];
    } catch {
      return [];
    }
  }, []);

  const clearAll = useCallback(() => {
    setSteps(buildInitialSteps());
    stepsRef.current = buildInitialSteps();
    setResult(null);
    setPartialResult({});
    partialResultRef.current = {};
    setChatMessage(null);
    setError(null);
    setStopped(false);
    setStepTokens({});
    stepTokensRef.current = {};
    setPrompt("");
    setHistory([]);
  }, []);

  const loadHistoryTurn = useCallback((item: any) => {
    const STEP_KEY_MAP: { key: string; label: string; step: number }[] = [
      { key: "planning", label: "Planning", step: 1 },
      { key: "clarification", label: "Clarification", step: 2 },
      { key: "techstack", label: "Tech Stack", step: 3 },
      { key: "usecases", label: "Use Cases", step: 4 },
      { key: "compliance", label: "Compliance", step: 5 },
      { key: "systemdesign", label: "System Design", step: 6 },
      { key: "structure", label: "Folder Structure", step: 7 },
      { key: "prompt", label: "Prompt Builder", step: 8 },
      { key: "backend", label: "Backend Generation", step: 9 },
      { key: "frontend", label: "Frontend Generation", step: 10 },
      { key: "database", label: "Database Generation", step: 11 },
      { key: "testcases", label: "Test Cases & Data", step: 12 },
    ];

    const builtSteps: PipelineStep[] = STEP_KEY_MAP.map(({ key, label, step }) => {
      const raw = item[key];
      const hasData = raw !== null && raw !== undefined;
      let parsed: any = null;
      if (hasData) {
        try { parsed = typeof raw === "string" ? JSON.parse(raw) : raw; }
        catch { parsed = raw; }
      }
      return { step, label, status: hasData ? "completed" as const : "idle" as const, data: parsed };
    });

    // Always scan ALL JSON blobs in the raw string — handles the DB format
    // where the string is two concatenated objects:
    //   {"files":["path1","path2",...]}   ← paths-only manifest (ignored)
    //   {"files":[{"path":"...","content":"..."},...]}  ← actual file content
    const parseFiles = (raw: string | null): CodeFile[] => {
      if (!raw) return [];
      return collectAllFiles(typeof raw === "string" ? raw : JSON.stringify(raw));
    };

    const backendFiles = parseFiles(item.backend);
    const frontendFiles = parseFiles(item.frontend);
    const databaseFiles = parseFiles(item.database);

    const patchedSteps = builtSteps.map(s => {
      if (s.label === "Backend Generation" && backendFiles.length > 0)
        return { ...s, data: { files: backendFiles, fileList: backendFiles } };
      if (s.label === "Frontend Generation" && frontendFiles.length > 0)
        return { ...s, data: { files: frontendFiles, fileList: frontendFiles } };
      if (s.label === "Database Generation" && databaseFiles.length > 0)
        return { ...s, data: { files: databaseFiles, fileList: databaseFiles } };
      return s;
    });

    const histResult: GenerationResult | null =
      backendFiles.length || frontendFiles.length || databaseFiles.length
        ? { backend: backendFiles, frontend: frontendFiles, database: databaseFiles }
        : null;

    const turn: ConversationTurn = {
      prompt: item.userPrompt,
      steps: patchedSteps,
      stepTokens: {},
      result: histResult,
      partialResult: {},
      chatMessage: null,
      error: null,
      sessionId: item.sessionId,
    };

    setSteps(buildInitialSteps());
    stepsRef.current = buildInitialSteps();
    setResult(null);
    setPartialResult({});
    partialResultRef.current = {};
    setChatMessage(null);
    setError(null);
    setStopped(false);
    setStepTokens({});
    stepTokensRef.current = {};
    setPrompt("");
    sessionIdRef.current = item.sessionId ?? null;
    setHistory([turn]);
  }, []);

  return {
    steps, result, partialResult, partialResultRef,
    chatMessage, running, paused, stopped, error, progress,
    stepTokens, prompt, clarificationQuestion, history,
    run, answerQuestion, stop, resume, loadHistoryTurn, clearAll, fetchHistory,
  };
}