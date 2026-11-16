import type { TranscriptMessage } from "./types";
import { getCallById } from "./api";

const normalizeSpeakerName = (rawSpeaker: any): "AI" | "Caller" => {
  if (!rawSpeaker) return "Caller";
  const s = String(rawSpeaker).trim().toLowerCase();
  if (
    s === "ai" ||
    s === "agent" ||
    s === "assistant" ||
    s === "priya" ||
    s === "bot" ||
    s === "system" ||
    s.includes("radha krishna")
  ) {
    return "AI";
  }
  return "Caller";
};

const parsePlainTextTranscript = (text: string): TranscriptMessage[] => {
  const turns: TranscriptMessage[] = [];
  const lines = text.split(/\r?\n/);
  let currentSpeaker = "";
  let currentText = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sepIdx = line.indexOf(":");
    if (sepIdx > 0 && sepIdx < 25) {
      const candidate = line.substring(0, sepIdx).trim();
      if (
        /^(ai|assistant|priya|agent|bot|caller|customer|user|human|radha krishna)/i.test(
          candidate,
        )
      ) {
        if (currentSpeaker && currentText) {
          turns.push({
            speaker: normalizeSpeakerName(currentSpeaker),
            text: currentText.trim(),
          });
          currentText = "";
        }
        currentSpeaker = candidate;
        currentText = line.substring(sepIdx + 1).trim();
        continue;
      }
    }

    if (currentSpeaker) {
      currentText = currentText ? `${currentText} ${line}` : line;
    } else {
      currentSpeaker = "Caller";
      currentText = line;
    }
  }

  if (currentSpeaker && currentText) {
    turns.push({
      speaker: normalizeSpeakerName(currentSpeaker),
      text: currentText.trim(),
    });
  }

  return turns;
};

export const normalizeTranscript = (raw: any): TranscriptMessage[] => {
  if (!raw) return [];

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return normalizeTranscript(parsed);
        }
      } catch (e) {
        // Fall back to plain text parsing
      }
    }
    return parsePlainTextTranscript(trimmed);
  }

  if (Array.isArray(raw)) {
    const list: TranscriptMessage[] = [];
    for (const item of raw) {
      if (!item) continue;
      if (typeof item === "string") {
        list.push(...parsePlainTextTranscript(item));
      } else if (typeof item === "object") {
        const rawSpeaker =
          item.speaker ||
          item.role ||
          item.sender ||
          item.name ||
          (item.ai ? "AI" : "Caller");
        const text =
          item.text || item.content || item.message || item.transcript || "";
        if (text && String(text).trim()) {
          list.push({
            speaker: normalizeSpeakerName(rawSpeaker),
            text: String(text).trim(),
          });
        }
      }
    }
    return list;
  }

  return [];
};


export interface TranscriptSource {
  id?: number;
  transcript?: unknown;
  conversation?: unknown;
  rawTranscript?: unknown;
}

/** Use the selected recording only; a phone number does not identify a past call. */
export const getTranscriptForCall = async (
  record: TranscriptSource | null | undefined,
  ...additionalSources: unknown[]
): Promise<TranscriptMessage[]> => {
  for (const source of [
    record?.transcript,
    record?.conversation,
    record?.rawTranscript,
    ...additionalSources,
  ]) {
    const turns = normalizeTranscript(source);
    if (turns.length > 0) return turns;
  }
  if (!record?.id || record.id <= 0) return [];
  const detail = await getCallById(record.id);
  for (const source of [detail.transcript, detail.conversation, detail.rawTranscript]) {
    const turns = normalizeTranscript(source);
    if (turns.length > 0) return turns;
  }
  return [];
};
