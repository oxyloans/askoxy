import axios from "axios";
import type {
  CallDetail,
  CallHistoryItem,
  CallsResponse,
  AgentInstruction,
  AgentInstructionRecord,
  Platform,
  InstructionDirection,
  OutboundScenario,
  OutboundCallRequest,
  OutboundCallResponse,
  ScheduledCallsResponse,
  CustomerKnowledgeGap,
  DynamicKnowledgeEntry,
  KnowledgeGapStatus,
} from "./types";
import BASE_URL from "../Config";

export const VOICE_API_BASE = `${BASE_URL}/vibecode-service`;

const client = axios.create({
  baseURL: VOICE_API_BASE,
  headers: { Accept: "*/*" },
});

/** Full transcript + summary for the most recent call from a number. */
export const getTranscriptByNumber = async (
  callerNumber: string,
): Promise<CallDetail> => {
  const { data } = await client.get<CallDetail>(
    `/get-Trascript/${encodeURIComponent(callerNumber)}`,
  );
  return data;
};

/** Inbound calls placed within a date range (format: DD-MM-YYYY). */
export const getInboundCalls = async (
  startDate: string,
  endDate: string,
): Promise<CallsResponse> => {
  const { data } = await client.get<CallsResponse>("/calls/inbound", {
    params: { startDate, endDate },
  });
  return data;
};

/** Outbound calls placed within a date range (format: DD-MM-YYYY). */
export const getOutboundCalls = async (
  startDate: string,
  endDate: string,
): Promise<CallsResponse> => {
  const { data } = await client.get<CallsResponse>("/calls/outbound", {
    params: { startDate, endDate },
  });
  return data;
};

/** Full call history (no transcript) for one caller number. */
export const getCallHistory = async (
  callerNumber: string,
): Promise<CallHistoryItem[]> => {
  const { data } = await client.get<CallHistoryItem[]>("/calls/history", {
    params: { callerNumber },
  });
  return data;
};

/** Current system instructions for a platform + call direction. */
export const getAgentInstructions = async (
  platform: Platform,
  direction: InstructionDirection,
): Promise<AgentInstruction> => {
  const { data } = await client.get<AgentInstruction>(
    `/admin/agent-instructions/${platform}/${direction}/system`,
  );
  return data;
};

export const getAllAgentInstructions = async (
  platform: Platform,
): Promise<AgentInstructionRecord[]> => {
  const { data } = await client.get<AgentInstructionRecord[]>(
    `/admin/agent-instructions/${platform}`,
  );
  return data;
};

export const updateAgentInstructions = async (
  platform: Platform,
  direction: InstructionDirection,
  content: string,
): Promise<AgentInstruction> => {
  const { data } = await client.post<AgentInstruction>(
    `/admin/agent-instructions/${platform}/${direction}/system`,
    { content },
  );
  return data;
};

/** Current greeting script for inbound calls on a platform. */
export const getInboundGreeting = async (
  platform: Platform,
): Promise<AgentInstruction> => {
  const { data } = await client.get<AgentInstruction>(
    `/admin/agent-instructions/${platform}/inbound/greeting`,
  );
  return data;
};

export const updateInboundGreeting = async (
  platform: Platform,
  content: string,
): Promise<AgentInstruction> => {
  const { data } = await client.post<AgentInstruction>(
    `/admin/agent-instructions/${platform}/inbound/greeting`,
    { content },
  );
  return data;
};

export const getOutboundGreeting = async (
  platform: Platform,
  scenario: OutboundScenario,
): Promise<AgentInstruction> => {
  const { data } = await client.get<AgentInstruction>(
    `/admin/agent-instructions/${platform}/outbound/greeting/${scenario}`,
  );
  return data;
};

export const updateOutboundGreeting = async (
  platform: Platform,
  scenario: OutboundScenario,
  content: string,
): Promise<AgentInstruction> => {
  const { data } = await client.post<AgentInstruction>(
    `/admin/agent-instructions/${platform}/outbound/greeting/${scenario}`,
    { content },
  );
  return data;
};

/** Upcoming/pending scheduled calls within a date range (format: DD-MM-YYYY). */
export const getScheduledCalls = async (
  startDate: string,
  endDate: string,
): Promise<ScheduledCallsResponse> => {
  const { data } = await client.get<ScheduledCallsResponse>(
    "/calls/scheduled",
    { params: { startDate, endDate } },
  );
  return data;
};

export const placeOutboundCall = async (
  req: OutboundCallRequest,
): Promise<OutboundCallResponse> => {
  const { data } = await client.post<OutboundCallResponse>(
    "/outbound/call",
    req,
  );
  return data;
};

// ── Autonomous Self-Learning & Dynamic Knowledge APIs ────────────────────────

/** Fetch customer knowledge gaps (unanswered / fallback queries from calls). */
export const getKnowledgeGaps = async (
  platform?: string,
  status?: KnowledgeGapStatus,
): Promise<CustomerKnowledgeGap[]> => {
  const { data } = await client.get<CustomerKnowledgeGap[]>(
    "/admin/self-learning/gaps",
    { params: { platform: platform === "ALL" ? undefined : platform, status } },
  );
  return data;
};

/** Fetch active dynamically learned knowledge entries. */
export const getActiveKnowledgeEntries = async (
  platform?: string,
): Promise<DynamicKnowledgeEntry[]> => {
  const { data } = await client.get<DynamicKnowledgeEntry[]>(
    "/admin/self-learning/entries",
    { params: { platform: platform === "ALL" ? undefined : platform } },
  );
  return data;
};

/** Approve and publish a knowledge gap into live voice AI calls. */
export const approveKnowledgeGap = async (
  gapId: number,
  answer?: string,
  teluguAnswer?: string,
): Promise<{ status: string; message: string; entry: DynamicKnowledgeEntry }> => {
  const { data } = await client.post(
    `/admin/self-learning/approve/${gapId}`,
    { answer, teluguAnswer },
  );
  return data;
};

/** Reject a knowledge gap. */
export const rejectKnowledgeGap = async (
  gapId: number,
): Promise<{ status: string; message: string }> => {
  const { data } = await client.post(
    `/admin/self-learning/reject/${gapId}`,
  );
  return data;
};

/** Create a dynamic knowledge entry directly. */
export const createDirectKnowledgeEntry = async (
  payload: {
    platform: string;
    intentKey: string;
    queryMatchPatterns: string;
    verifiedAnswer: string;
    teluguAnswer?: string;
  },
): Promise<{ status: string; message: string; entry: DynamicKnowledgeEntry }> => {
  const { data } = await client.post(
    "/admin/self-learning/create",
    payload,
  );
  return data;
};

/** Update an existing dynamic knowledge entry in live calls. */
export const updateKnowledgeEntry = async (
  id: number,
  payload: {
    platform?: string;
    intentKey?: string;
    queryMatchPatterns?: string;
    verifiedAnswer?: string;
    teluguAnswer?: string;
    active?: boolean;
  },
): Promise<{ status: string; message: string; entry: DynamicKnowledgeEntry }> => {
  const { data } = await client.put(
    `/admin/self-learning/entries/${id}`,
    payload,
  );
  return data;
};

/** Delete a dynamic knowledge entry. */
export const deleteKnowledgeEntry = async (
  id: number,
): Promise<{ status: string; message: string }> => {
  const { data } = await client.delete(
    `/admin/self-learning/entries/${id}`,
  );
  return data;
};

/** Test AI Knowledge Match in real-time. */
export const testKnowledgeMatch = async (payload: {
  platform: string;
  query: string;
  language?: "english" | "telugu";
}): Promise<{
  matched: boolean;
  intentKey?: string;
  matchedKeywords?: string;
  spokenAnswer: string;
  confidence: number;
  entry?: DynamicKnowledgeEntry;
}> => {
  const { data } = await client.post(
    "/admin/self-learning/test",
    payload,
  );
  return data;
};
