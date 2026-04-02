import { useState, useCallback, useRef } from "react";
import { PipelineStep, GenerationResult } from "../type/types";
import BASE_URL from "../../Config";

const BASE = `${BASE_URL}/ai-service/vibe-code`;

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

function buildInitialSteps(): PipelineStep[] {
  return STEPS.map(s => ({ step: s.step, label: s.label, status: "idle" }));
}

export type StepTokensMap = Record<number, string>;

export interface ClarificationQuestion {
  id: string;
  question: string;
  options?: string[];
  type?: string;
}

export function usePipeline() {
  const [steps, setSteps] = useState<PipelineStep[]>(buildInitialSteps());
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [partialResult, setPartialResult] = useState<Partial<GenerationResult>>({});
  const [chatMessage, setChatMessage] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false); // true when waiting for clarification answer
  const [error, setError] = useState<string | null>(null);
  const [stepTokens, setStepTokens] = useState<StepTokensMap>({});
  const [prompt, setPrompt] = useState<string>("");
  const [clarificationQuestion, setClarificationQuestion] = useState<ClarificationQuestion & { index: number; total: number } | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const updateStep = useCallback((stepNum: number, patch: Partial<PipelineStep>) => {
    setSteps(prev => prev.map(s => s.step === stepNum ? { ...s, ...patch } : s));
  }, []);

  const appendToken = useCallback((stepNum: number, text: string) => {
    setStepTokens(prev => ({ ...prev, [stepNum]: (prev[stepNum] ?? "") + text }));
  }, []);

  // Attach SSE listeners shared between streamStep and answerQuestion
  const attachListeners = useCallback((es: EventSource, resolve: (v: any) => void, reject: (e: any) => void) => {
    es.addEventListener("step", (e) => {
      const payload = JSON.parse(e.data);
      updateStep(payload.step, { status: payload.status, data: payload.data, label: payload.label });
      if (payload.status === "completed" && payload.data?.fileList?.length) {
        if (payload.label === "Backend Generation") setPartialResult(prev => ({ ...prev, backend: payload.data.fileList }));
        if (payload.label === "Frontend Generation") setPartialResult(prev => ({ ...prev, frontend: payload.data.fileList }));
        if (payload.label === "Database Generation") setPartialResult(prev => ({ ...prev, database: payload.data.fileList }));
      }
    });
    es.addEventListener("token", (e) => {
      const payload = JSON.parse(e.data);
      appendToken(payload.step, payload.text);
    });
    es.addEventListener("clarification-question", (e) => {
      const payload = JSON.parse(e.data);
      setClarificationQuestion({ ...payload.question, index: payload.index, total: payload.total });
      es.close();
      resolve({ done: true, waitingForAnswer: true });
    });
    es.addEventListener("step_done", () => { es.close(); resolve({ done: false }); });
    es.addEventListener("done", (e) => { es.close(); resolve({ done: true, result: JSON.parse(e.data) }); });
    es.addEventListener("chat", (e) => { es.close(); resolve({ done: true, chat: JSON.parse(e.data).message }); });
    es.addEventListener("error", (e: any) => {
      es.close();
      try { reject(new Error(JSON.parse(e.data).message)); }
      catch { reject(new Error("Stream connection error")); }
    });
  }, [updateStep, appendToken]);

  const streamStep = useCallback(
    (sessionId: string, stepName: string): Promise<{ done: boolean; result?: GenerationResult; chat?: string; waitingForAnswer?: boolean }> => {
      return new Promise((resolve, reject) => {
        fetch(`${BASE}/session/${sessionId}/step/${stepName}`, {
          method: "POST",
        }).then(res => {
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
              if (line.startsWith("event:")) { lastEvent = line.replace("event:", "").trim(); continue; }
              if (!line.startsWith("data:")) continue;
              const json = line.replace("data:", "").trim();
              try {
                const payload = JSON.parse(json);
                if (lastEvent === "step") {
                  updateStep(payload.step, { status: payload.status, data: payload.data, label: payload.label });
                  if (payload.status === "completed" && payload.data?.fileList?.length) {
                    if (payload.label === "Backend Generation") setPartialResult(prev => ({ ...prev, backend: payload.data.fileList }));
                    if (payload.label === "Frontend Generation") setPartialResult(prev => ({ ...prev, frontend: payload.data.fileList }));
                    if (payload.label === "Database Generation") setPartialResult(prev => ({ ...prev, database: payload.data.fileList }));
                  }
                } else if (lastEvent === "token") {
                  appendToken(payload.step, payload.text);
                } else if (lastEvent === "clarification-question") {
                  setClarificationQuestion({ ...payload.question, index: payload.index, total: payload.total });
                } else if (lastEvent === "clarification-waiting") {
                  resolve({ done: true, waitingForAnswer: true }); return;
                } else if (lastEvent === "done") {
                  resolve({ done: true, result: payload }); return;
                } else if (lastEvent === "chat") {
                  resolve({ done: true, chat: payload.message }); return;
                } else if (lastEvent === "step_done") {
                  resolve({ done: false }); return;
                } else if (lastEvent === "error") {
                  reject(new Error(payload.message)); return;
                }
              } catch { /* partial */ }
            }
            return read();
          });
          read().catch(reject);
        }).catch(reject);
      });
    },
    [attachListeners, updateStep, appendToken]
  );

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
          if (line.startsWith("event:")) { lastEvent = line.replace("event:", "").trim(); continue; }
          if (!line.startsWith("data:")) continue;
          const json = line.replace("data:", "").trim();
          try {
            const payload = JSON.parse(json);
            if (lastEvent === "step") {
              updateStep(payload.step, { status: payload.status, data: payload.data, label: payload.label });
              if (payload.status === "completed" && payload.data?.fileList?.length) {
                if (payload.label === "Backend Generation") setPartialResult(prev => ({ ...prev, backend: payload.data.fileList }));
                if (payload.label === "Frontend Generation") setPartialResult(prev => ({ ...prev, frontend: payload.data.fileList }));
                if (payload.label === "Database Generation") setPartialResult(prev => ({ ...prev, database: payload.data.fileList }));
              }
            } else if (lastEvent === "token") {
              appendToken(payload.step, payload.text);
            } else if (lastEvent === "clarification-question") {
              // Another question — show it, keep running
              setClarificationQuestion({ ...payload.question, index: payload.index, total: payload.total });
            } else if (lastEvent === "done") {
              setResult(payload);
              setRunning(false);
              return;
            } else if (lastEvent === "error") {
              setError(payload.message);
              setRunning(false);
              return;
            }
            // step_done and clarification-waiting: just keep reading
          } catch { /* partial */ }
        }
        return read();
      });

      await read();
    } catch (err: any) {
      setError(err.message);
      setRunning(false);
    }
  }, [updateStep, appendToken]);

  const run = useCallback(async (userPrompt: string) => {
    setSteps(buildInitialSteps());
    setResult(null);
    setPartialResult({});
    setChatMessage(null);
    setError(null);
    setStepTokens({});
    setClarificationQuestion(null);
    setPrompt(userPrompt);
    setRunning(true);

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
        const r = await streamStep(sessionId, step.name);
        if (r.chat) { setChatMessage(r.chat); setRunning(false); return; }
        if (r.waitingForAnswer) { setPaused(true); return; } // pause — keep UI visible
        if (r.done && r.result) { setResult(r.result); break; }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRunning(false);
    }
  }, [streamStep]);

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const progress = Math.round((completedSteps / STEPS.length) * 100);

  return { steps, result, partialResult, chatMessage, running, paused, error, progress, stepTokens, prompt, clarificationQuestion, run, answerQuestion };
}
