import axios from "axios";
import BASE_URL from "../../Config";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

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
  file_search?: {
    vector_store_ids: string[];
  };
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

export async function getAssistants(
  limit = 50,
  after?: string
): Promise<AssistantsResponse> {
  const res = await apiClient.get("/student-service/user/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
    params: { limit, after },
  });
  return res.data;
}

export async function getAssistantDetails(id: string): Promise<Assistant> {
  const res = await apiClient.get(
    `/student-service/user/getAssistantbyid/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );
  return res.data;
}

export async function createAssistant(
  data: Partial<Assistant>
): Promise<Assistant> {
  const res = await apiClient.post(
    "/student-service/user/createAssistant",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );
  return res.data;
}

export async function updateAssistant(
  id: string,
  data: Partial<Assistant>
): Promise<Assistant> {
  const res = await apiClient.patch(
    `/student-service/user/update/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );
  return res.data;
}

export async function uploadFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/student-service/user/addfiles", formData, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  });
  return res.data;
}

export async function askAssistant(
  assistantId: string,
  messages: Message[]
): Promise<Message> {
  try {
    const res = await apiClient.post(
      `/student-service/user/askquestion?assistantId=${assistantId}`,
      messages,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
      }
    );

    const content =
      typeof res.data === "string"
        ? res.data
        : (res.data as Message)?.content || "";

    return {
      role: "assistant",
      content,
    };
  } catch (error: any) {
    console.error("Error asking assistant:", error);

    return {
      role: "assistant",
      content: `⚠️ Sorry, I couldn't process your request now please try again after some time."
      }`,
    };
  }
}

export async function getModels(): Promise<any[]> {
  const res = await apiClient.get("/student-service/user/models", {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  });
  return res.data.data || [];
}

export async function deleteAssistant(id: string): Promise<any> {
  const res = await apiClient.delete(`/student-service/user/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  });
  return res.data;
}

export async function createVectorStore(data: any): Promise<any> {
  const res = await apiClient.post("/student-service/user/vectorstores", data, {
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
  });
  return res.data;
}

export async function addFileToVectorStore(
  vectorStoreId: string,
  fileId: string
): Promise<any> {
  const res = await apiClient.post(
    `/student-service/user/vectorstores/${vectorStoreId}/files`,
    { file_id: fileId },
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    }
  );
  return res.data;
}
