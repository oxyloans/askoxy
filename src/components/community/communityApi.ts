import axios, { AxiosError } from "axios";
import BASE_URL from "../../Config";

export type CommunityCategory =
  | "AI"
  | "LOANS_AND_INVESTMENTS"
  | "JOBS"
  | "STUDY_ABROAD"
  | "GOLD"
  | "FRACTIONAL_OWNERSHIP"
  | "NINETY_DAY_JOB_PLAN"
  | "GCC_MATE"
  | "FREELANCE_MARKETPLACE"
  | "NYAYA_GPT"
  | "CA_AND_CS"
  | "BLOCKCHAIN_AND_CRYPTO"
  | "GLMS"
  | "OTHER";

export type CommunitySort =
  | "LATEST"
  | "OLDEST"
  | "MOST_VIEWED"
  | "MOST_COMMENTED";

export type ReactionType = "LIKE" | "DISLIKE";

export interface CommunityUser {
  id: string;
  name: string;
  badge?: "ADMIN_VERIFIED" | "EMPLOYEE_VERIFIED" | string | null;
}

export interface Reactions {
  likedByCurrentUser: boolean;
  dislikedByCurrentUser: boolean;
  totalLikes: number;
  totalDislikes: number;
}

export interface CommunityComment {
  id: number;
  comment: string;
  parentCommentId?: number | null;
  createdAt: string;
  updatedAt: string;
  totalReplies: number;
  version: number;
  user: CommunityUser;
  reactions: Reactions;
  replies?: Array<CommunityComment | null>;
}

export interface CommunityQuery {
  id: number;
  question: string;
  description: string;
  category: CommunityCategory;
  /** Returned when category is OTHER. Keep the field matching your backend DTO. */
  otherCategoryName?: string | null;
  customCategory?: string | null;
  categoryName?: string | null;
  createdAt: string;
  updatedAt: string;
  totalComments: number;
  totalReplies: number;
  totalViews: number;
  version: number;
  user: CommunityUser;
  reactions: Reactions;
  comments?: Array<CommunityComment | null>;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
  timestamp: string;
}

const requireData = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (response.data === undefined || response.data === null) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
};

export interface CreateQueryPayload {
  category: CommunityCategory;
  question: string;
  description: string;
  /**
   * Required only when category is OTHER.
   * Rename this property if your backend DTO uses customCategory/categoryName.
   */
  otherCategoryName?: string;
}

export interface UpdateQueryPayload extends CreateQueryPayload {
  version: number;
}

export interface QueryListParams {
  category?: CommunityCategory | "";
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: CommunitySort;
}

interface SpringPage<T> {
  content?: T[];
  data?: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

const API_BASE_URL = String(BASE_URL)
  .trim()
  .replace(/\/+$/, "")
  .replace(/(?:\/api)+$/i, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && !axios.isAxiosError(error)) {
    return error.message;
  }

  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
    details?: string;
  }>;

  if (!axiosError.response) {
    return "Unable to connect to the community service. Please check the API URL or CORS configuration.";
  }

  return (
    axiosError.response.data?.message ||
    axiosError.response.data?.details ||
    axiosError.response.data?.error ||
    `Request failed with status ${axiosError.response.status}.`
  );
};

export const getQueries = async (params: QueryListParams) => {
  const response = await api.get<
    ApiResponse<SpringPage<CommunityQuery> | CommunityQuery[]>
  >("/api/user-service/community/queries", {
    params: {
      category: params.category || undefined,
      keyword: params.keyword?.trim() || undefined,
      pageNumber: params.pageNumber ?? 0,
      pageSize: params.pageSize ?? 9,
      sortBy: params.sortBy ?? "LATEST",
      paged: true,
    },
  });

  const root = response.data.data;

  if (!root) {
    return {
      queries: [],
      totalElements: 0,
      totalPages: 1,
      currentPage: params.pageNumber ?? 0,
    };
  }

  if (Array.isArray(root)) {
    return {
      queries: root,
      totalElements: root.length,
      totalPages: 1,
      currentPage: 0,
    };
  }

  const queries = root.content || root.data || [];

  return {
    queries,
    totalElements: root.totalElements ?? queries.length,
    totalPages: root.totalPages ?? 1,
    currentPage: root.number ?? params.pageNumber ?? 0,
  };
};

export const getQueryById = async (id: number) => {
  const response = await api.get<ApiResponse<CommunityQuery>>(
    `/api/user-service/community/queries/${id}`
  );
  return requireData(response.data, "Query details were not returned by the server.");
};

export const createQuery = async (payload: CreateQueryPayload) => {
  const request = {
    ...payload,
    otherCategoryName:
      payload.category === "OTHER"
        ? payload.otherCategoryName?.trim()
        : undefined,
  };

  const response = await api.post<ApiResponse<CommunityQuery>>(
    "/api/user-service/community/queries",
    request
  );
  return requireData(response.data, "The created query was not returned by the server.");
};

export const updateQuery = async (
  id: number,
  payload: UpdateQueryPayload
) => {
  const request = {
    ...payload,
    otherCategoryName:
      payload.category === "OTHER"
        ? payload.otherCategoryName?.trim()
        : undefined,
  };

  const response = await api.put<ApiResponse<CommunityQuery>>(
    `/api/user-service/community/queries/${id}`,
    request
  );
  return requireData(response.data, "The updated query was not returned by the server.");
};

export const deleteQuery = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(
    `/api/user-service/community/queries/${id}`,
  );
  return response.data;
};

export const reactToQuery = async (
  id: number,
  type: ReactionType
) => {
  const response = await api.post<ApiResponse<Reactions>>(
    `/api/user-service/community/queries/${id}/reactions`,
    { type }
  );
  return requireData(response.data, "Reaction details were not returned by the server.");
};

export const getComments = async (queryId: number) => {
  const response = await api.get<ApiResponse<CommunityComment[]>>(
    `/api/user-service/api/community/queries/${queryId}/comments`
  );
  return response.data.data || [];
};

export const addComment = async (queryId: number, comment: string) => {
  const response = await api.post<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/queries/${queryId}/comments`,
    { comment }
  );
  return requireData(response.data, "The created comment was not returned by the server.");
};

export const replyToComment = async (
  commentId: number,
  comment: string
) => {
  const response = await api.post<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/comments/${commentId}/reply`,
    { comment }
  );
  return requireData(response.data, "The created reply was not returned by the server.");
};

export const updateComment = async (
  id: number,
  comment: string,
  version: number
) => {
  const response = await api.put<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/comments/${id}`,
    { comment, version }
  );
  return requireData(response.data, "The updated comment was not returned by the server.");
};

export const deleteComment = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(
    `/api/user-service/api/community/comments/${id}`
  );
  return response.data;
};

export const reactToComment = async (
  id: number,
  type: ReactionType
) => {
  const response = await api.post<ApiResponse<Reactions>>(
    `/api/user-service/api/community/comments/${id}/reactions`,
    { type }
  );
  return requireData(response.data, "Reaction details were not returned by the server.");
};