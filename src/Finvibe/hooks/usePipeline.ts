  import { useState, useCallback, useRef } from "react";
  import { PipelineStep, GenerationResult, CodeFile } from "../type/types";
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
    { name: "validation", step: 12, label: "Validation" },
  ];

  // Loose type for raw SSE payloads — content may be absent in early chunks
  type RawFile = { path: string; content?: string; description?: string };

  /**
   * Merge incoming files into existing ones, deduplicating by path.
   * Rules (handles manifest-then-batch pattern from backend):
   * - Non-empty content always wins over empty/missing content.
   * - Among two non-empty entries for the same path, the incoming one wins (latest batch wins).
   * - Entries with empty or missing content are kept only if no real content exists yet.
   * - Final output filters to only entries with non-empty content (CodeFile).
   */
  function mergeFiles(existing: RawFile[], incoming: RawFile[]): CodeFile[] {
    const map = new Map(existing.map(f => [f.path, f]));
    for (const f of incoming) {
      const prev = map.get(f.path);
      const incomingHasContent = f.content !== undefined && f.content !== "" && f.content !== "null";
      const prevHasContent = prev && prev.content !== undefined && prev.content !== "" && prev.content !== "null";
      // Only overwrite if: no previous entry, OR incoming has real content, OR prev has no real content
      if (!prev || incomingHasContent || !prevHasContent) {
        map.set(f.path, { ...prev, ...f });
      }
    }
    return Array.from(map.values()).filter(
      (f): f is CodeFile => f.content !== undefined && f.content !== "" && f.content !== "null"
    );
  }

  /**
   * Deduplicate a flat file array by path — non-empty content wins over empty.
   * Used to clean the done-event payload before merging.
   */
  function dedupeFiles(files: RawFile[]): RawFile[] {
    const map = new Map<string, RawFile>();
    for (const f of files) {
      const prev = map.get(f.path);
      const hasContent = f.content !== undefined && f.content !== "" && f.content !== "null";
      const prevHasContent = prev && prev.content !== undefined && prev.content !== "" && prev.content !== "null";
      if (!prev || hasContent || !prevHasContent) {
        map.set(f.path, f);
      }
    }
    return Array.from(map.values());
  }

  function buildInitialSteps(): PipelineStep[] {
    return STEPS.map(s => ({ step: s.step, label: s.label, status: "idle" as const }));
  }

  /**
   * Parse all complete {"files":[...]} JSON blobs from a raw token stream.
   * The stream may contain multiple concatenated JSON objects (manifest + batches).
   * Returns only files with non-empty content.
   */
  function parseFilesFromTokens(text: string): RawFile[] {
    if (!text) return [];
    const results: RawFile[] = [];
    // Find all top-level JSON objects in the stream
    let depth = 0, start = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') { if (depth === 0) start = i; depth++; }
      else if (text[i] === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          try {
            const obj = JSON.parse(text.slice(start, i + 1));
            if (Array.isArray(obj?.files)) {
              for (const f of obj.files) {
                if (f?.path && f?.content && f.content !== '' && f.content !== 'null') {
                  results.push(f as RawFile);
                }
              }
            }
          } catch { /* incomplete or invalid JSON chunk, skip */ }
          start = -1;
        }
      }
    }
    return results;
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
    getLocalPartial: () => Partial<GenerationResult>
  ): Promise<SSEResult> {
    return new Promise((resolve, reject) => {
      fetch(`${BASE}/session/${sessionId}/step/${stepName}`, { method: "POST" })
        .then(res => {
          if (!res.ok) { reject(new Error(`Step ${stepName} failed: ${res.status}`)); return; }

          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let lastEvent = "";

          const read = (): Promise<void> => reader.read().then(({ done, value }) => {
            if (done) { resolve({ done: false }); return; }

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
                  // Merge file arrays inside step.data so repeated chunks accumulate
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

                  // Also push into partialResult so PipelineFeed can show partial banners
                  const files: RawFile[] =
                    Array.isArray(payload.data?.fileList) ? payload.data.fileList :
                      Array.isArray(payload.data?.files) ? payload.data.files : [];

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
                  resolve({ done: true, waitingForAnswer: true }); return;

                } else if (lastEvent === "done") {
                  const backend: RawFile[] = dedupeFiles(Array.isArray(payload?.backend) ? payload.backend : []);
                  const frontend: RawFile[] = dedupeFiles(Array.isArray(payload?.frontend) ? payload.frontend : []);
                  const database: RawFile[] = dedupeFiles(Array.isArray(payload?.database) ? payload.database : []);

                  // Merge done-payload files with whatever was already accumulated
                  u.setPartial(p => ({
                    backend: mergeFiles(p.backend ?? [], backend),
                    frontend: mergeFiles(p.frontend ?? [], frontend),
                    database: mergeFiles(p.database ?? [], database),
                  }));

                  // Build the final result from the synchronously-tracked localPartial
                  const lp = getLocalPartial();
                  resolve({
                    done: true,
                    result: {
                      backend: mergeFiles(lp.backend ?? [], backend),
                      frontend: mergeFiles(lp.frontend ?? [], frontend),
                      database: mergeFiles(lp.database ?? [], database),
                    },
                  }); return;

                } else if (lastEvent === "chat") {
                  resolve({ done: true, chat: payload.message }); return;

                } else if (lastEvent === "step_done") {
                  resolve({ done: false }); return;

                } else if (lastEvent === "error") {
                  reject(new Error(payload.message)); return;
                }

              } catch { /* ignore partial / malformed chunks */ }
            }
            return read();
          });

          read().catch(reject);
        }).catch(reject);
    });
  }

  export function usePipeline() {
    const [steps, setSteps] = useState<PipelineStep[]>(buildInitialSteps());
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [partialResult, setPartialResult] = useState<Partial<GenerationResult>>({});
    const [chatMessage, setChatMessage] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
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

    // ── updateStep: merges file arrays in step.data instead of overwriting ──────
    const updateStep = useCallback((stepNum: number, patch: Partial<PipelineStep>) => {
      setSteps(prev => {
        const next = prev.map(s => {
          if (s.step !== stepNum) return s;

          const prevData = s.data as any;
          const nextData = patch.data as any;

          if (nextData && (Array.isArray(nextData.files) || Array.isArray(nextData.fileList))) {
            const prevFiles: RawFile[] = prevData?.fileList ?? prevData?.files ?? [];
            const nextFiles: RawFile[] = nextData.fileList ?? nextData.files ?? [];
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

    // Keeps partialResultRef in sync so run() fallback can read synchronously
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
      setStepTokens({});
      stepTokensRef.current = {};
      setClarificationQuestion(null);
      setPrompt(userPrompt);
      setRunning(true);

      // Synchronous shadow of partialResult for use inside streamStepSSE callbacks
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
        const res = await fetch(`${BASE}/session/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt }),
        });
        if (!res.ok) throw new Error(`Failed to start session: ${res.status}`);
        const { sessionId } = await res.json();
        sessionIdRef.current = sessionId;

        for (const step of STEPS) {
          // Pass getter so streamStepSSE can read the latest localPartial at resolve-time
          const r = await streamStepSSE(sessionId, step.name, u, () => localPartial);

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

          // After each generation step completes, parse token stream to populate partialResult
          const GEN_STEP_MAP: Record<string, keyof GenerationResult> = {
            backend: "backend", frontend: "frontend", database: "database",
          };
          const genKey = GEN_STEP_MAP[step.name];
          if (genKey && !r.done) {
            const stepMeta = STEPS.find(s => s.name === step.name);
            const tokenText = stepMeta ? (stepTokensRef.current[stepMeta.step] ?? "") : "";
            const extracted = parseFilesFromTokens(tokenText);
            if (extracted.length > 0) {
              localPartial = { ...localPartial, [genKey]: mergeFiles((localPartial[genKey] as RawFile[]) ?? [], extracted) };
              setPartialResultSynced(() => ({ ...localPartial }));
            }
          }

          if (r.done && r.result) {
            localResult = r.result;
            setResult(r.result);
            break;
          }
        }

        // Push completed turn into history so ConversationTurnView renders it with View Code banner
        if (localResult) {
          setHistory(h => [...h, {
            prompt: userPrompt,
            steps: stepsRef.current,
            stepTokens: {},
            result: localResult,
            partialResult: {},
            chatMessage: null,
            error: null,
          }]);
        }

        // Fallback 1: synchronously-tracked localPartial
        if (!localResult && (localPartial.backend?.length || localPartial.frontend?.length || localPartial.database?.length)) {
          localResult = {
            backend: localPartial.backend ?? [],
            frontend: localPartial.frontend ?? [],
            database: localPartial.database ?? [],
          };
          setResult(localResult);
        }

        // Fallback 2: ref (catches React async-batching edge cases)
        if (!localResult) {
          const latest = partialResultRef.current;
          if (latest.backend?.length || latest.frontend?.length || latest.database?.length) {
            setResult({
              backend: latest.backend ?? [],
              frontend: latest.frontend ?? [],
              database: latest.database ?? [],
            });
          }
        }

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }

      setRunning(false);
    }, [updateStep, appendToken, setPartialResultSynced, steps, result, stepTokens, prompt, partialResult, chatMessage, error]);

    // ── answerQuestion ───────────────────────────────────────────────────────────
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
                // Use the merge-aware updateStep
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

                const files: RawFile[] =
                  Array.isArray(payload.data?.fileList) ? payload.data.fileList :
                    Array.isArray(payload.data?.files) ? payload.data.files : [];

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
                const backend: RawFile[] = dedupeFiles(Array.isArray(payload?.backend) ? payload.backend : []);
                const frontend: RawFile[] = dedupeFiles(Array.isArray(payload?.frontend) ? payload.frontend : []);
                const database: RawFile[] = dedupeFiles(Array.isArray(payload?.database) ? payload.database : []);

                // Merge done-payload into accumulated state
                setPartialResultSynced(prev => ({
                  backend: mergeFiles(prev.backend ?? [], backend),
                  frontend: mergeFiles(prev.frontend ?? [], frontend),
                  database: mergeFiles(prev.database ?? [], database),
                }));

                // Read ref after the synced update above
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

    const completedSteps = steps.filter(s => s.status === "completed").length;
    const progress = Math.round((completedSteps / STEPS.length) * 100);

    return {
      steps, result, partialResult, partialResultRef,
      chatMessage, running, paused, error, progress,
      stepTokens, prompt, clarificationQuestion, history,
      run, answerQuestion,
    };
  }