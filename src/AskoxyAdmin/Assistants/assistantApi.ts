import { adminApi as axiosInstance } from "../../utils/axiosInstances";
import BASE_URL from "../../Config";

export interface RankingOptions {
  ranker: string;
  score_threshold: number;
}

export interface FileSearchTool {
  ranking_options: RankingOptions;
}

export interface Tool {
  type: string;
  file_search?: FileSearchTool;
  function?: CustomFunction;
}

export interface ToolResources {
  file_search?: { vector_store_ids: string[] };
}

export interface Assistant {
  id: string;
  object: string;
  created_at: number;
  name: string;
  description?: string | null;
  model: string;
  instructions?: string | null;
  tools?: Tool[];
  top_p?: number;
  temperature?: number;
  reasoning_effort?: number | null;
  tool_resources?: ToolResources;
  metadata?: Record<string, any>;
  response_format?: ResponseFormat;
  functions?: CustomFunction[];
  lastViewed?: string;
}

export interface CustomFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

type ResponseFormat =
  | { type: "auto" }
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: Record<string, any> };

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Thread {
  id: string;
  assistantId: string;
}

export interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface AssistantsResponse {
  object: string;
  data: Assistant[];
  first_id?: string;
  last_id?: string;
  has_more: boolean;
}

export async function getAssistants(limit = 50, after?: string): Promise<AssistantsResponse> {
  const { data } = await axiosInstance.get(`${BASE_URL}/student-service/user/getAllAssistants`, {
    params: { limit, after },
  });
  return data;
}

export async function getAssistantDetails(id: string): Promise<Assistant> {
  const { data } = await axiosInstance.get(`${BASE_URL}/student-service/user/getAssistantbyid/${id}`);
  return data;
}

export async function createAssistant(payload: Partial<Assistant>): Promise<Assistant> {
  const { data } = await axiosInstance.post(`${BASE_URL}/student-service/user/createAssistant`, payload);
  return data;
}

export async function updateAssistant(id: string, payload: Partial<Assistant>): Promise<Assistant> {
  const { data } = await axiosInstance.patch(`${BASE_URL}/student-service/user/update/${id}`, payload);
  return data;
}

export async function uploadFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post(`${BASE_URL}/student-service/user/addfiles`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function askAssistant(assistantId: string, messages: Message[]): Promise<Message> {
  try {
    const { data } = await axiosInstance.post(
      `${BASE_URL}/student-service/user/askquestion?assistantId=${assistantId}`,
      messages
    );
    const content = typeof data === "string" ? data : (data as Message)?.content || "";
    return { role: "assistant", content };
  } catch {
    return {
      role: "assistant",
      content: "⚠️ Sorry, I couldn't process your request now please try again after some time.",
    };
  }
}

export async function getModels(): Promise<any[]> {
  const { data } = await axiosInstance.get(`${BASE_URL}/student-service/user/models`);
  return data.data || [];
}

export async function deleteAssistant(id: string): Promise<any> {
  const { data } = await axiosInstance.delete(`${BASE_URL}/student-service/user/delete/${id}`);
  return data;
}

export async function createVectorStore(payload: any): Promise<any> {
  const { data } = await axiosInstance.post(`${BASE_URL}/student-service/user/vectorstores`, payload);
  return data;
}

export async function addFileToVectorStore(vectorStoreId: string, fileId: string): Promise<any> {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/student-service/user/vectorstores/${vectorStoreId}/files`,
    { file_id: fileId }
  );
  return data;
}
