import BASE_URL from '../../Config';
import type { SSEEvent } from '../type/agents';

export function createSSEConnection(
  sessionId: string,
  onEvent: (event: SSEEvent) => void,
  onError?: (error: Event) => void,
  onOpen?: () => void,
  onSnapshot?: (session: any) => void
): () => void {
  const url = `${BASE_URL}/vibecode-service/sse/${sessionId}`;
  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.info(`[SSE] Connected to ${url}`);
    onOpen?.();

    // Snapshot fetch — handles race condition where awaiting_user_input
    // fired before the SSE connection was established
    fetch(`${BASE_URL}/vibecode-service/session/${sessionId}`)
      .then(res => res.json())
      .then(session => {
        console.info('[SSE] Snapshot — runStatus:', session.runStatus);
        onSnapshot?.(session);

        if (session.runStatus === 'AWAITING_USER_INPUT') {
          // EngineContext field is dynamicRequirements, not requirementsContext
          const reqs = session?.dynamicRequirements ?? {};

          onEvent({
            step:      session.currentStep ?? 2,
            agent:     'RequirementsIntelligence',
            status:    'awaiting_user_input',
            data: {
              questions: reqs?.configurationQuestions ?? [],
              documents: reqs?.requiredDocuments      ?? [],
              signals:   reqs?.requiredDataSignals    ?? [],
            },
            timestamp: new Date().toISOString(),
            message:   'Awaiting Stage 2 configuration input from user',
          } satisfies SSEEvent);
        }
      })
      .catch(err => console.warn('[SSE] Snapshot fetch failed:', err));
  };

  // Backend emits ALL events as unnamed messages (no .name() in SseEmitter.event())
  // So ALL events come through onmessage — named addEventListener will never fire
  eventSource.onmessage = (e: MessageEvent<string>) => {
    try {
      const raw = JSON.parse(e.data);

      // 'connected' event is sent with .name('connected') — handled by addEventListener below
      // All other agent events come here as unnamed messages
      onEvent({
        step:      raw.step      ?? 0,
        agent:     raw.agent     ?? 'unknown',
        status:    raw.status    ?? 'running',
        data:      raw.data      ?? {},
        timestamp: raw.timestamp ?? new Date().toISOString(),
        message:   raw.message,
      } satisfies SSEEvent);

    } catch (err) {
      console.error('[SSE] Failed to parse message:', e.data, err);
    }
  };

  // Only 'connected' uses .name() in the backend — so only this one needs addEventListener
  eventSource.addEventListener('connected', (e: MessageEvent<string>) => {
    try {
      const raw = JSON.parse(e.data);
      console.info('[SSE] Connected event:', raw);
    } catch {
      // ignore
    }
  });

  eventSource.onerror = (e: Event) => {
    console.error('[SSE] Connection error:', e);
    onError?.(e);
  };

  return () => {
    console.info('[SSE] Closing connection');
    eventSource.close();
  };
}

export function isSSESupported(): boolean {
  return typeof EventSource !== 'undefined';
}