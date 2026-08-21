import BASE_URL from "../../Config";
import { getCustomerAccessToken } from "../../utils/cookieUtils";
import type {
  ApiResponse,
  CategoryCount,
  ChatMessage,
  ExternalNewsArticle,
  NewsFeedItem,
  PageResponse,
  PaperclipDetail,
} from "../types";
const BASE_URL1 = `${BASE_URL}/ai-automation`;
const LOCAL_BASE = "http://localhost:9041/api/ai-automation";

const getAccessToken = (): string | null =>
  getCustomerAccessToken() || localStorage.getItem("accessToken");

const getRequestHeaders = (headers?: HeadersInit): Headers => {
  const requestHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return requestHeaders;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL1}${path}`, {
    ...options,
    headers: getRequestHeaders(options?.headers),
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`);
  }
  const body: ApiResponse<T> = await res.json();
  if (body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

async function localRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL1}${path}`, {
    ...options,
    headers: getRequestHeaders(options?.headers),
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`);
  }
  const body: ApiResponse<T> = await res.json();
  if (body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export const api = {
  getFeed: (params: {
    domain?: string;
    category?: string;
    sort?: "latest" | "trending";
    page?: number;
    size?: number;
  }) => {
    const q = new URLSearchParams();
    if (params.domain) q.set("domain", params.domain);
    if (params.category) q.set("category", params.category);
    q.set("sort", params.sort ?? "latest");
    q.set("page", String(params.page ?? 0));
    q.set("size", String(params.size ?? 12));
    return request<PageResponse<NewsFeedItem>>(`/news/feed?${q.toString()}`);
  },

  getCategories: () => request<CategoryCount[]>("/news/categories"),

  // Scraped/fetched news from an external source (e.g. "anthropic", "newsdata").
  // Backend route pattern: /news/external/{sourceName}
  getExternalNews: (sourceName: string, page = 0, size = 20) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    return localRequest<PageResponse<ExternalNewsArticle>>(
      `/news/external/${sourceName.toLowerCase()}?${q.toString()}`
    );
  },

  getAllExternalNews: async (sourceName: string, size = 20) => {
    const firstPage = await api.getExternalNews(sourceName, 0, size);
    if (firstPage.totalPages <= 1) {
      return firstPage;
    }

    const additionalPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, idx) =>
        api.getExternalNews(sourceName, idx + 1, size)
      )
    );

    return {
      ...firstPage,
      content: [firstPage, ...additionalPages].flatMap((page) => page.content),
      last: true,
    };
  },

  // Generic no-param refresh — works for "anthropic" and any future source
  // whose /refresh endpoint takes no query params.
  refreshExternalNews: (sourceName: string) =>
    localRequest<string>(`/news/external/${sourceName.toLowerCase()}/refresh`, {
      method: "POST",
    }),

  // Newsdata.io's /refresh accepts optional query/country/language filters
  // and returns a diagnostic result (backend defaults: country=in, language=en).
  refreshNewsdataNews: (params?: { query?: string; country?: string; language?: string }) => {
    const q = new URLSearchParams();
    if (params?.query) q.set("query", params.query);
    if (params?.country) q.set("country", params.country);
    if (params?.language) q.set("language", params.language);
    const qs = q.toString();
    return localRequest<{ success: boolean; saved: number; fetched: number; message: string }>(
      `/news/external/newsdata/refresh${qs ? `?${qs}` : ""}`,
      { method: "POST" }
    );
  },

  // Finds one article out of the paginated list by id (backend has no
  // single-article-by-id endpoint, only the /content one below).
  getExternalArticle: async (sourceName: string, id: number) => {
    const all = await api.getAllExternalNews(sourceName);
    const found = all.content.find((a) => a.id === id);
    if (!found) throw new Error("Article not found");
    return found;
  },

  // Lazily fetched full body text (backend scrapes/caches on first request).
  getExternalArticleContent: (sourceName: string, id: number) =>
    localRequest<string>(`/news/external/${sourceName.toLowerCase()}/${id}/content`),

  getExternalArticleImage: (sourceName: string, id: number) =>
    localRequest<string | null>(`/news/external/${sourceName.toLowerCase()}/${id}/image`, {
      method: "POST",
    }),

  search: (query: string, page = 0, size = 12) => {
    const q = new URLSearchParams({ q: query, page: String(page), size: String(size) });
    return request<PageResponse<NewsFeedItem>>(`/news/search?${q.toString()}`);
  },

  getPaperclip: (id: string) => request<PaperclipDetail>(`/paperclip/${id}`),

  chat: (id: string, message: string, webSearch = false, conversationId?: string) =>
    fetch(`${BASE_URL1}/paperclip/${id}/chat`, {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify({ message, webSearch, conversationId }),
    }).then((r) => r.json()) as Promise<{
      success: boolean;
      answer: string;
      sources: string[];
    }>,

  getChatHistory: (id: string) =>
    request<ChatMessage[]>(`/paperclip/${id}/chat/history`),
};