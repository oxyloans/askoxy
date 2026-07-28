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

export const placeOutboundCall = async (
  req: OutboundCallRequest,
): Promise<OutboundCallResponse> => {
  const { data } = await client.post<OutboundCallResponse>(
    "/outbound/call",
    req,
  );
  return data;
};
