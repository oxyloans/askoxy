// Shared types for the AI Voice Calling Agent control center.

export type CallDirection = "INBOUND" | "OUTBOUND";

export const PLATFORMS = [
  "OXYLOANS",
  "ASKOXY",
  "OXYGOLD",
  "OXYBRICK",
  "STUDYABROAD",
  "OXYBFSAI",
  "OXYGLOBAL",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  OXYLOANS: "OxyLoans",
  ASKOXY: "AskOxy.ai",
  OXYGOLD: "OxyGold",
  OXYBRICK: "OxyBrick",
  STUDYABROAD: "Study Abroad",
  OXYBFSAI: "OxyBFSAI",
  OXYGLOBAL: "OxyGlobal.tech",
};

export type InstructionDirection = "inbound" | "outbound";

export interface TranscriptMessage {
  speaker: "AI" | "Caller" | string;
  text: string;
}

export interface CallDetail {
  callerNumber: string;
  platform: string | null;
  callDirection: CallDirection;
  callScenario: string | null;
  date: string;
  summary: string;
  purpose: string;
  revenueGenerated: boolean;
  revenueDetails: string;
  recordingUrl: string;
  transcript: TranscriptMessage[];
}

export interface CallListItem {
  id: number;
  callerNumber: string;
  platform: string | null;
  callDirection: CallDirection;
  callScenario: string | null;
  callSummary: string;
  callPurpose: string;
  revenueGenerated: boolean;
  revenueDetails: string;
  timestamp: string;
  recordingUrl: string;
  transcript: TranscriptMessage[];
}

export interface CallsResponse {
  callDirection: CallDirection;
  startDate: string;
  endDate: string;
  totalCalls: number;
  revenueGeneratedCalls: number;
  calls: CallListItem[];
}

export interface CallHistoryItem {
  callerNumber: string;
  platform: string | null;
  callDirection: CallDirection;
  callScenario: string | null;
  date: string;
  summary: string;
  purpose: string;
  revenueGenerated: boolean;
  revenueDetails: string;
  recordingUrl: string;
}

export interface AgentInstruction {
  key?: string;
  content: string;
  description?: string | null;
  updatedAt?: string;
}

export interface AgentInstructionRecord {
  key: string;
  content: string;
  description?: string | null;
  updatedAt: string;
}

export const OUTBOUND_SCENARIOS = [
  "CALL_FOLLOWUP",
  "EMI_REMINDER",
  "KYC_PENDING",
  "LEAD_FOLLOWUP",
  "ORDER_STATUS_UPDATE",
  "BIRTHDAY_WISH",
] as const;
 
export type OutboundScenario = (typeof OUTBOUND_SCENARIOS)[number];
 
export const OUTBOUND_SCENARIO_LABELS: Record<OutboundScenario, string> = {
  CALL_FOLLOWUP: "Call Follow-up",
  EMI_REMINDER: "EMI Reminder",
  KYC_PENDING: "KYC Pending",
  LEAD_FOLLOWUP: "Lead Follow-up",
  ORDER_STATUS_UPDATE: "Order Status Update",
  BIRTHDAY_WISH: "Birthday Wish",
};


export type PayloadFieldType = "text" | "number" | "date";
 
export interface PayloadFieldConfig {
  key: string;
  label: string;
  type: PayloadFieldType;
  placeholder?: string;
}
 

export const SCENARIO_PAYLOAD_FIELDS: Record<OutboundScenario, PayloadFieldConfig[]> = {
  CALL_FOLLOWUP: [
    { key: "loanId", label: "Loan ID", type: "text", placeholder: "L12345" },
    { key: "dueAmount", label: "Due Amount", type: "number", placeholder: "5000" },
    { key: "dueDate", label: "Due Date", type: "date" },
  ],
  EMI_REMINDER: [
    { key: "loanId", label: "Loan ID", type: "text", placeholder: "L12345" },
    { key: "emiAmount", label: "EMI Amount", type: "number", placeholder: "3200" },
    { key: "emiDueDate", label: "EMI Due Date", type: "date" },
  ],
  KYC_PENDING: [
    { key: "kycDocumentType", label: "KYC Document Type", type: "text", placeholder: "PAN Card" },
    { key: "kycPendingSince", label: "Pending Since", type: "date" },
  ],
  LEAD_FOLLOWUP: [
    { key: "leadId", label: "Lead ID", type: "text", placeholder: "LD9876" },
    { key: "productInterest", label: "Product Interest", type: "text", placeholder: "Personal Loan" },
    { key: "leadSource", label: "Lead Source", type: "text", placeholder: "Website" },
  ],
  ORDER_STATUS_UPDATE: [
    { key: "orderId", label: "Order ID", type: "text", placeholder: "ORD5521" },
    { key: "orderStatus", label: "Order Status", type: "text", placeholder: "Shipped" },
    { key: "expectedDeliveryDate", label: "Expected Delivery", type: "date" },
  ],
  BIRTHDAY_WISH: [
    { key: "customerName", label: "Customer Name", type: "text", placeholder: "Ravi Kumar" },
    { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  ],
};
 
export interface OutboundCallRequest {
  phoneNumber: string;
  scenario: OutboundScenario;
  platform: Platform;
  payload: Record<string, string>;
}
 
export interface OutboundCallResponse {
  success?: boolean;
  message?: string;
  callId?: string;
  [key: string]: unknown;
}

export type ScheduledCallStatus =
  | "INITIATED"
  | "ANSWERED"
  | "NO_ANSWER"
  | "FAILED"
  | "BUSY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SCHEDULED"
  | string;

export interface ScheduledCallAttempt {
  attemptNumber: number;
  callSid: string;
  status: ScheduledCallStatus;
  scheduledAt: string;
  dialedAt: string | null;
  answeredAt: string | null;
  endedAt: string | null;
  ringDurationSeconds: number | null;
  talkDurationSeconds: number | null;
}

export interface ScheduledCallRecording {
  id: number;
  callerNumber: string;
  platform: string | null;
  callDirection: CallDirection;
  callScenario: string | null;
  callSummary: string;
  callPurpose: string;
  revenueGenerated: boolean;
  revenueDetails: string;
  timestamp: string;
  recordingUrl: string;
  transcript: TranscriptMessage[];
}

export interface ScheduledCallItem {
  phoneNumber: string;
  scenario: OutboundScenario | string;
  followUpReason: string | null;
  finalStatus: ScheduledCallStatus;
  nextRetryAt: string | null;
  attempts: ScheduledCallAttempt[];
  callRecording: ScheduledCallRecording | null;
}

export interface ScheduledCallsResponse {
  startDate: string;
  endDate: string;
  totalCalls: number;
  calls: ScheduledCallItem[];
}