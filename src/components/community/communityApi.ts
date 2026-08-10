import axios, { AxiosError } from "axios";
import BASE_URL from "../../Config";

// Categories are managed by the backend and can change without a frontend release.
export type CommunityCategory = string;

export interface CommunityCategoryItem {
  id: number;
  categoryName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

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

export interface CommunityOnlineUser {
  userId: string;
  name: string;
  badge?: "ADMIN_VERIFIED" | "EMPLOYEE_VERIFIED" | string | null;
}

type OnlineUsersPayload =
  | CommunityOnlineUser[]
  | ApiResponse<CommunityOnlineUser[]>
  | { onlineUsers?: CommunityOnlineUser[]; data?: CommunityOnlineUser[] };

type OnlineUserCountPayload =
  | number
  | {
      count?: number;
      onlineUsers?: number;
      data?: number | { count?: number; onlineUsers?: number };
    };

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
  categoryId: number;
  categoryName: string;
  /** Optional legacy/custom-category fields returned by some backend versions. */
  category?: CommunityCategory | null;
  otherCategoryName?: string | null;
  customCategory?: string | null;
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

type CommunityQueryApiShape = CommunityQuery & {
  totalLikes?: number;
  totalDislikes?: number;
  likedByCurrentUser?: boolean;
  dislikedByCurrentUser?: boolean;
};

const normalizeQueryReactions = (
  query: CommunityQueryApiShape,
): CommunityQuery => ({
  ...query,
  reactions: {
    likedByCurrentUser:
      query.reactions?.likedByCurrentUser ?? query.likedByCurrentUser ?? false,
    dislikedByCurrentUser:
      query.reactions?.dislikedByCurrentUser ??
      query.dislikedByCurrentUser ??
      false,
    totalLikes: Number(query.reactions?.totalLikes ?? query.totalLikes ?? 0),
    totalDislikes: Number(
      query.reactions?.totalDislikes ?? query.totalDislikes ?? 0,
    ),
  },
});

const requireData = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
): T => {
  if (response.data === undefined || response.data === null) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
};

export interface CreateQueryPayload {
  categoryId: number;
  question: string;
  description: string;
  /** Required only when the selected backend category is OTHER. */
  otherCategoryName?: string;
}

export interface UpdateQueryPayload extends CreateQueryPayload {
  version: number;
}

export interface QueryListParams {
  categoryId?: number | "";
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
  },
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

export const getCommunityCategories = async () => {
  const response = await api.get<ApiResponse<CommunityCategoryItem[]>>(
    "/api/user-service/community/categories",
  );

  return requireData(
    response.data,
    "Community categories were not returned by the server.",
  ).filter((category) => category.active);
};

export const normalizeCommunityOnlineUsers = (
  payload: unknown,
): CommunityOnlineUser[] => {
  let source: unknown = payload;

  if (!Array.isArray(source) && source && typeof source === "object") {
    const root = source as Record<string, unknown>;
    source = Array.isArray(root.data)
      ? root.data
      : Array.isArray(root.onlineUsers)
        ? root.onlineUsers
        : source;
  }

  if (!Array.isArray(source)) return [];

  return source
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object"),
    )
    .map((item) => ({
      userId: String(item.userId ?? item.id ?? ""),
      name: String(item.name ?? "Community User"),
      badge:
        item.badge === null || item.badge === undefined
          ? null
          : String(item.badge),
    }))
    .filter((user) => Boolean(user.userId));
};

export const getCommunityOnlineUsers = async () => {
  const response = await api.get<OnlineUsersPayload>(
    "/api/user-service/community/online-users",
  );

  return normalizeCommunityOnlineUsers(response.data);
};

export const getCommunityOnlineUserCount = async (): Promise<number> => {
  const response = await api.get<OnlineUserCountPayload>(
    "/api/user-service/community/online-users/count",
  );
  const payload = response.data;

  if (typeof payload === "number") return Math.max(0, payload);

  const nested = payload?.data;
  const count =
    payload?.count ??
    payload?.onlineUsers ??
    (typeof nested === "number"
      ? nested
      : (nested?.count ?? nested?.onlineUsers ?? 0));

  return Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;
};

export const getCommunityWebSocketUrl = (accessToken?: string | null) => {
  const endpoint = "wss://meta.oxyloans.com/api/user-service/ws/community";
  const token = accessToken?.replace(/^Bearer\s+/i, "").trim();

  // Native browser WebSocket connections cannot attach a custom HTTP
  // Authorization header. Use the backend-supported token query parameter
  // for the upgrade request and also send Authorization in the STOMP CONNECT frame.
  return token ? `${endpoint}?token=${encodeURIComponent(token)}` : endpoint;
};

export const getQueries = async (params: QueryListParams) => {
  const response = await api.get<
    ApiResponse<SpringPage<CommunityQuery> | CommunityQuery[]>
  >("/api/user-service/community/queries", {
    params: {
      categoryId: params.categoryId === "" ? undefined : params.categoryId,
      keyword: params.keyword?.trim() || undefined,
      page: params.pageNumber ?? 0,
      size: params.pageSize ?? 9,
      sortBy: params.sortBy ?? "LATEST",
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
      queries: root.map((query) => normalizeQueryReactions(query)),
      totalElements: root.length,
      totalPages: 1,
      currentPage: 0,
    };
  }

  const queries = (root.content || root.data || []).map((query) =>
    normalizeQueryReactions(query),
  );

  return {
    queries,
    totalElements: root.totalElements ?? queries.length,
    totalPages: root.totalPages ?? 1,
    currentPage: root.number ?? params.pageNumber ?? 0,
  };
};

export const getQueryById = async (id: number) => {
  const response = await api.get<ApiResponse<CommunityQuery>>(
    `/api/user-service/community/queries/${id}`,
  );
  return normalizeQueryReactions(
    requireData(
      response.data,
      "Query details were not returned by the server.",
    ),
  );
};

export const createQuery = async (payload: CreateQueryPayload) => {
  const request = {
    ...payload,
    otherCategoryName: payload.otherCategoryName?.trim() || undefined,
  };

  const response = await api.post<ApiResponse<CommunityQuery>>(
    "/api/user-service/community/queries",
    request,
  );
  return normalizeQueryReactions(
    requireData(
      response.data,
      "The created query was not returned by the server.",
    ),
  );
};

export const updateQuery = async (id: number, payload: UpdateQueryPayload) => {
  const request = {
    ...payload,
    otherCategoryName: payload.otherCategoryName?.trim() || undefined,
  };

  const response = await api.put<ApiResponse<CommunityQuery>>(
    `/api/user-service/community/queries/${id}`,
    request,
  );
  return normalizeQueryReactions(
    requireData(
      response.data,
      "The updated query was not returned by the server.",
    ),
  );
};

export const deleteQuery = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(
    `/api/user-service/community/queries/${id}`,
  );
  return response.data;
};

export const reactToQuery = async (id: number, type: ReactionType) => {
  const response = await api.post<ApiResponse<Reactions>>(
    `/api/user-service/community/queries/${id}/reactions`,
    { type },
  );
  return requireData(
    response.data,
    "Reaction details were not returned by the server.",
  );
};

type QueryReactionStatusResponse = {
  queryId?: number;
  userId?: string;
  reaction?: ReactionType | null;
};

export const getQueryReactionForUser = async (
  queryId: number,
  userId: string,
): Promise<ReactionType | null> => {
  try {
    const response = await api.get<QueryReactionStatusResponse | ApiResponse<QueryReactionStatusResponse>>(
      `/api/user-service/community/queries/${queryId}/reactions/user/${encodeURIComponent(userId)}`,
    );
    if (!response.data) return null;
    const root = response.data as QueryReactionStatusResponse & {
      data?: QueryReactionStatusResponse;
    };
    const reaction = root.data?.reaction ?? root.reaction ?? null;
    return reaction === "LIKE" || reaction === "DISLIKE" ? reaction : null;
  } catch (error) {
    const status = (error as AxiosError)?.response?.status;
    if (status === 404 || status === 204) return null;
    throw error;
  }
};

export const getComments = async (queryId: number) => {
  const response = await api.get<ApiResponse<CommunityComment[]>>(
    `/api/user-service/api/community/queries/${queryId}/comments`,
  );
  return response.data.data || [];
};

export const addComment = async (queryId: number, comment: string) => {
  const response = await api.post<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/queries/${queryId}/comments`,
    { comment },
  );
  return requireData(
    response.data,
    "The created comment was not returned by the server.",
  );
};

export const replyToComment = async (commentId: number, comment: string) => {
  const response = await api.post<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/comments/${commentId}/reply`,
    { comment },
  );
  return requireData(
    response.data,
    "The created reply was not returned by the server.",
  );
};

export const updateComment = async (
  id: number,
  comment: string,
  version: number,
) => {
  const response = await api.put<ApiResponse<CommunityComment>>(
    `/api/user-service/api/community/comments/${id}`,
    { comment, version },
  );
  return requireData(
    response.data,
    "The updated comment was not returned by the server.",
  );
};

export const deleteComment = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(
    `/api/user-service/api/community/comments/${id}`,
  );
  return response.data;
};

export const reactToComment = async (id: number, type: ReactionType) => {
  const response = await api.post<ApiResponse<Reactions>>(
    `/api/user-service/api/community/comments/${id}/reactions`,
    { type },
  );
  return requireData(
    response.data,
    "Reaction details were not returned by the server.",
  );
};
