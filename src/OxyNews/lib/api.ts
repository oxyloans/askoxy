import BASE_URL from "../../Config";
import {
  getCustomerAccessToken,
  getAdminAccessToken,
  getPartnerAccessToken,
  getEmployeeAccessToken,
  getFreelanceAccessToken,
} from "../../utils/cookieUtils";
import type {
  ApiResponse,
  CategoryCount,
  ChatMessage,
  ExternalNewsArticle,
  NewsFeedItem,
  PageResponse,
  PaperclipDetail,
  RbiPressRelease,
  RbiCampaignResponse,
  IrdaiCampaignResponse,
  OpenAiNewsItem,
  OpenAiArticleData,
  OpenAiArticleBlock,
} from "../types";
import { CODING_AGENTS_DATA, CodingAgentModel } from "../data/codingAgentsData";
import { FALLBACK_RANKINGS } from "../data/rankingsFallbackData";

export interface HFArticle {
  title: string;
  url: string;
  path: string;
  author: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
  source: string;
  wordCount: number;
  readingTimeMin: number;
  headings: { level: string; text: string }[];
  images: { src: string; alt: string }[];
  contentHtml?: string;
  contentText?: string;
}

export interface HFListResponse {
  source: string;
  count: number;
  moreAvailable: boolean;
  articles: HFArticle[];
}

export interface RawRankingsItem {
  date: string;
  model_permaslug: string;
  variant: string;
  variant_permaslug: string;
  total_completion_tokens: number;
  total_prompt_tokens: number;
  count: number;
  total_usage: number;
  change: number | null;
  rankingMetricValue: number;
}
export const BASE_URL1 = `http://65.0.147.157:9041/api/ai-automation`;
export const RANKINGS_BASE = BASE_URL1;

export const getAccessToken = (): string | null =>
  getCustomerAccessToken() ||
  localStorage.getItem("accessToken") ||
  sessionStorage.getItem("accessToken") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("token") ||
  sessionStorage.getItem("taskAccessToken") ||
  getAdminAccessToken() ||
  getPartnerAccessToken() ||
  getEmployeeAccessToken() ||
  getFreelanceAccessToken();

export const getRequestHeaders = (
  headers?: HeadersInit,
  explicitToken?: string | null
): Headers => {
  const requestHeaders = new Headers(headers);
  const accessToken = explicitToken || getAccessToken();

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (accessToken && !requestHeaders.has("Authorization")) {
    const cleanToken = accessToken.replace(/^Bearer\s+/i, "").trim();
    requestHeaders.set("Authorization", `Bearer ${cleanToken}`);
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

export const FALLBACK_OPENAI_NEWS: OpenAiNewsItem[] = [
  {
    title: "Introducing OpenAI",
    description:
      "OpenAI is a non-profit artificial intelligence research company. Our goal is to advance digital intelligence in the way that is most likely to benefit humanity as a whole, unconstrained by a need to generate financial return. Since our research is free from financial obligations, we can better focus on a positive human impact.",
    link: "https://openai.com/index/introducing-openai",
    category: "Company",
    pubDate: "Fri, 11 Dec 2015 08:00:00 GMT",
  },
];

export async function fetchOpenAiNews(): Promise<OpenAiNewsItem[]> {
  try {
    const res = await fetch(`${BASE_URL1}/news/external/openai`, {
      headers: getRequestHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.items && Array.isArray(json.data.items)) {
        return json.data.items;
      }
      if (Array.isArray(json?.data)) {
        return json.data;
      }
      if (Array.isArray(json)) {
        return json;
      }
    }
  } catch (err) {
    console.warn("fetchOpenAiNews failed:", err);
  }
  return FALLBACK_OPENAI_NEWS;
}

export function formatOpenAiArticleBlocks(data: OpenAiArticleData): string {
  if (!data) return "";
  const paragraphs: string[] = [];

  if (Array.isArray(data.blocks) && data.blocks.length > 0) {
    for (const b of data.blocks) {
      if (!b) continue;
      if (typeof b === "string") {
        paragraphs.push(b);
        continue;
      }
      const text = (b.text || b.content || b.value || "").trim();
      if (!text) continue;

      const type = (b.type || "").toLowerCase();
      if (type === "h1" || type === "h2") {
        paragraphs.push(`## ${text}`);
      } else if (type === "h3" || type === "h4") {
        paragraphs.push(`### ${text}`);
      } else if (type === "blockquote") {
        paragraphs.push(`> ${text}`);
      } else if (type === "li") {
        paragraphs.push(`• ${text}`);
      } else {
        paragraphs.push(text);
      }
    }
  }

  if (paragraphs.length === 0 && data.description) {
    paragraphs.push(data.description.trim());
  }

  return paragraphs.join("\n\n");
}

export async function fetchOpenAiArticle(articleUrl: string): Promise<OpenAiArticleData | null> {
  const q = new URLSearchParams({ url: articleUrl });
  try {
    const res = await fetch(`${BASE_URL1}/news/external/openai/article?${q.toString()}`, {
      headers: getRequestHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data ?? json;
      if (data && typeof data === "object") {
        return data as OpenAiArticleData;
      }
    }
  } catch (err) {
    console.warn("fetchOpenAiArticle failed:", err);
  }
  return null;
}

export async function fetchOpenAiArticleContent(articleUrl: string): Promise<string> {
  const data = await fetchOpenAiArticle(articleUrl);
  if (!data) return "";
  return formatOpenAiArticleBlocks(data);
}

export { FALLBACK_RANKINGS };

export async function fetchRankingsModels(
  view?: string,
  models?: string,
  token?: string
): Promise<RawRankingsItem[]> {
  const rawView = (view || "").toLowerCase().trim();
  const normalizedView =
    rawView === "month" || rawView === "monthly"
      ? "month"
      : rawView === "day" || rawView === "daily" || rawView === "today"
      ? "day"
      : "week";

  const q = new URLSearchParams({ view: normalizedView });
  if (models) q.set("models", models);
  const headers = getRequestHeaders(undefined, token);

  // 1. Primary: fetch from BASE_URL1 (/ai-automation/rankings/models)
  try {
    const res = await fetch(`${BASE_URL1}/rankings/models?${q.toString()}`, {
      headers,
    });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.items)
        ? json.data.items
        : [];
      if (list.length > 0) {
        try {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(`rankings_${normalizedView}`, JSON.stringify(list));
          }
        } catch {}
        return list as RawRankingsItem[];
      }
    } else {
      console.warn(`Primary rankings endpoint ${BASE_URL1}/rankings/models returned HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn("Primary rankings endpoint fetch failed:", err);
  }

  // 2. Fallback to cached session data if previously loaded
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(`rankings_${normalizedView}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as RawRankingsItem[];
        }
      }
    } catch {}
  }

  // 4. Fallback dataset to guarantee the UI never crashes
  return FALLBACK_RANKINGS;
}

function sortHFArticles(articles: HFArticle[]): HFArticle[] {
  return [...articles].sort((a, b) => {
    const timeA = a.publishedAt && !isNaN(Date.parse(a.publishedAt))
      ? Date.parse(a.publishedAt)
      : a.updatedAt && !isNaN(Date.parse(a.updatedAt))
      ? Date.parse(a.updatedAt)
      : 0;
    const timeB = b.publishedAt && !isNaN(Date.parse(b.publishedAt))
      ? Date.parse(b.publishedAt)
      : b.updatedAt && !isNaN(Date.parse(b.updatedAt))
      ? Date.parse(b.updatedAt)
      : 0;
    if (timeA && timeB) return timeB - timeA;
    if (timeB && !timeA) return 1;
    if (timeA && !timeB) return -1;
    return 0;
  });
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

  // Scraped/fetched news from an external source (e.g. "anthropic", "openai", "newsdata").
  // Backend route pattern: /news/external/{sourceName}
  getExternalNews: async (sourceName: string, page = 0, size = 20): Promise<PageResponse<ExternalNewsArticle>> => {
    if (sourceName.toLowerCase() === "openai") {
      const items = await fetchOpenAiNews();
      const articles: ExternalNewsArticle[] = items.map((item, idx) => ({
        id: idx + 1,
        url: item.link,
        title: item.title,
        sourceName: "openai",
        category: item.category || "Company",
        publishedDate: item.pubDate,
        fetchedAt: null,
        content: item.description,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      }));
      const start = page * size;
      const paged = articles.slice(start, start + size);
      return {
        content: paged,
        totalElements: articles.length,
        totalPages: Math.ceil(articles.length / size) || 1,
        number: page,
        size,
        last: start + size >= articles.length,
      };
    }

    if (sourceName.toLowerCase() === "huggingface") {
      try {
        const q = new URLSearchParams({
          page: String(page),
          size: String(size),
          limit: String(size),
          content: "true",
        });
        const res = await localRequest<any>(`/news/external/huggingface?${q.toString()}`);
        if (res && Array.isArray(res.content)) {
          return res as PageResponse<ExternalNewsArticle>;
        }
        if (res && Array.isArray(res.articles)) {
          const articles: ExternalNewsArticle[] = res.articles.map((item: any, idx: number) => ({
            id: idx + 1,
            url: item.url,
            title: item.title,
            sourceName: "huggingface",
            category: "AI",
            publishedDate: item.publishedAt,
            fetchedAt: item.updatedAt,
            content: item.contentText || item.contentHtml || item.description,
            imageUrl: item.image,
          }));
          const start = page * size;
          const paged = articles.slice(start, start + size);
          return {
            content: paged,
            totalElements: res.count || articles.length,
            totalPages: Math.ceil((res.count || articles.length) / size) || 1,
            number: page,
            size,
            last: !res.moreAvailable && (start + size >= articles.length),
          };
        }
      } catch {
        // Fall back to standard external news request below
      }
    }

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
  refreshExternalNews: async (sourceName: string) => {
    if (sourceName.toLowerCase() === "openai") {
      try {
        return await localRequest<string>(`/news/external/openai/refresh`, { method: "POST" });
      } catch {
        return "Refreshed";
      }
    }
    return localRequest<string>(`/news/external/${sourceName.toLowerCase()}/refresh`, {
      method: "POST",
    });
  },

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
    let found = all.content.find((a) => a.id === id);
    if (!found && sourceName.toLowerCase() === "openai" && all.content.length > 0) {
      found = all.content[0];
    }
    if (!found && sourceName.toLowerCase() === "openai") {
      found = {
        id: 1,
        url: "https://openai.com/index/introducing-openai",
        title: "Introducing OpenAI",
        sourceName: "openai",
        category: "Company",
        publishedDate: "Fri, 11 Dec 2015 08:00:00 GMT",
        fetchedAt: null,
        content: "OpenAI is a non-profit artificial intelligence research company. Our goal is to advance digital intelligence in the way that is most likely to benefit humanity as a whole, unconstrained by a need to generate financial return. Since our research is free from financial obligations, we can better focus on a positive human impact.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      };
    }
    if (!found) throw new Error("Article not found");
    return found;
  },

  // Lazily fetched full body text (backend scrapes/caches on first request).
  getExternalArticleContent: async (sourceName: string, id: number, articleUrl?: string) => {
    if (sourceName.toLowerCase() === "openai") {
      let targetUrl = articleUrl;
      if (!targetUrl) {
        try {
          const article = await api.getExternalArticle(sourceName, id);
          targetUrl = article.url;
        } catch {
          // ignore
        }
      }
      if (targetUrl) {
        const fullContent = await fetchOpenAiArticleContent(targetUrl);
        if (fullContent && fullContent.trim().length > 0) {
          return fullContent;
        }
      }
      try {
        const article = await api.getExternalArticle(sourceName, id);
        return article.content || "";
      } catch {
        return "";
      }
    }
    if (sourceName.toLowerCase() === "huggingface" && articleUrl) {
      try {
        const hfArt = await api.getHuggingFaceArticle(articleUrl);
        if (hfArt && (hfArt.contentHtml || hfArt.contentText || hfArt.description)) {
          return hfArt.contentHtml || hfArt.contentText || hfArt.description;
        }
      } catch {}
    }
    return localRequest<string>(`/news/external/${sourceName.toLowerCase()}/${id}/content`);
  },

  getExternalArticleImage: async (sourceName: string, id: number) => {
    if (sourceName.toLowerCase() === "openai") {
      const article = await api.getExternalArticle(sourceName, id);
      return article.imageUrl || null;
    }
    return localRequest<string | null>(`/news/external/${sourceName.toLowerCase()}/${id}/image`, {
      method: "POST",
    });
  },

  fetchOpenAiNews,
  fetchOpenAiArticle,
  fetchOpenAiArticleContent,
  formatOpenAiArticleBlocks,
  getOpenAiArticle: fetchOpenAiArticle,

  getRbiPressReleases: (page = 0, size = 50) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    return request<PageResponse<RbiPressRelease>>(`/news/external/rbi?${q.toString()}`);
  },

  getRbiFeedItems: (): Promise<NewsFeedItem[]> =>
    fetch(`${BASE_URL1}/paperclip/rbi`, {
      headers: getRequestHeaders(),
    }).then(res => res.json()).then(body => body?.data ?? []),

  getRbiCampaignPressReleases: (): Promise<RbiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/press-releases-new?organizationName=RBI&type=PRESS_RELEASE`)
      .then(res => res.json()),

  getRbiDailyPressReleases: (): Promise<RbiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/daily-press-release`)
      .then(res => res.json()),

  getIrdaiPressReleases: (): Promise<IrdaiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/press-releases-new?organizationName=IRDAI&type=PRESS_RELEASE`)
      .then(res => res.json()),

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

  getHuggingFaceList: async (limit = 30): Promise<HFListResponse> => {
    const q = new URLSearchParams({
      limit: String(limit),
      content: "true",
    });
    try {
      const res = await fetch(`${BASE_URL1}/news/external/huggingface?${q.toString()}`, {
        headers: getRequestHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success !== false) {
          const data = body.data ?? body;

          // 1. If backend returns PageResponse (Anthropic style)
          if (data && Array.isArray(data.content)) {
            const articles: HFArticle[] = data.content.map((item: any) => ({
              title: item.title || "Untitled",
              url: item.url || "",
              path: item.url || "",
              author: item.sourceName || item.author || "Hugging Face",
              description: item.content || item.description || "",
              image: item.imageUrl || item.image || "",
              publishedAt: item.publishedDate || item.publishedAt || "",
              updatedAt: item.fetchedAt || item.updatedAt || "",
              source: item.sourceName || "Hugging Face",
              wordCount: item.wordCount || 0,
              readingTimeMin: item.readingTimeMin || 3,
              headings: item.headings || [],
              images: item.images || (item.imageUrl ? [{ src: item.imageUrl, alt: item.title || "" }] : []),
              contentHtml: item.contentHtml || item.content || "",
              contentText: item.contentText || item.content || "",
            }));
            return {
              source: "Hugging Face",
              count: data.totalElements ?? articles.length,
              moreAvailable: !data.last,
              articles: sortHFArticles(articles),
            };
          }

          // 2. If backend returns HFListResponse format
          if (Array.isArray(data?.articles)) {
            return {
              source: data.source || "Hugging Face",
              count: data.count ?? data.articles.length,
              moreAvailable: data.moreAvailable ?? false,
              articles: sortHFArticles(data.articles),
            };
          }

          // 3. If backend returns an array of articles directly
          if (Array.isArray(data)) {
            const articles: HFArticle[] = data.map((item: any) => ({
              title: item.title || "Untitled",
              url: item.url || "",
              path: item.url || "",
              author: item.author || item.sourceName || "Hugging Face",
              description: item.description || item.content || "",
              image: item.image || item.imageUrl || "",
              publishedAt: item.publishedAt || item.publishedDate || "",
              updatedAt: item.updatedAt || item.fetchedAt || "",
              source: item.source || "Hugging Face",
              wordCount: item.wordCount || 0,
              readingTimeMin: item.readingTimeMin || 3,
              headings: item.headings || [],
              images: item.images || (item.imageUrl ? [{ src: item.imageUrl, alt: item.title || "" }] : []),
              contentHtml: item.contentHtml || item.content || "",
              contentText: item.contentText || item.content || "",
            }));
            return {
              source: "Hugging Face",
              count: articles.length,
              moreAvailable: false,
              articles: sortHFArticles(articles),
            };
          }
        }
      }
    } catch (err) {
      console.warn("getHuggingFaceList failed:", err);
    }
    throw new Error("Hugging Face news unavailable. Please try again later.");
  },

  getHuggingFaceArticle: async (url: string): Promise<HFArticle> => {
    const q = new URLSearchParams({ url });
    try {
      const res = await fetch(`${BASE_URL1}/news/external/huggingface/article?${q.toString()}`, {
        headers: getRequestHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success !== false) {
          const data = body.data ?? body;
          if (typeof data === "string") {
            return {
              title: "Hugging Face Article",
              url,
              path: url,
              author: "Hugging Face",
              description: data.slice(0, 200),
              image: "",
              publishedAt: "",
              updatedAt: "",
              source: "Hugging Face",
              wordCount: data.split(/\s+/).length,
              readingTimeMin: Math.ceil(data.split(/\s+/).length / 200),
              headings: [],
              images: [],
              contentHtml: data,
              contentText: data,
            };
          }
          if (data && typeof data === "object") {
            return {
              title: data.title || "Hugging Face Article",
              url: data.url || url,
              path: data.path || data.url || url,
              author: data.author || data.sourceName || "Hugging Face",
              description: data.description || data.content || "",
              image: data.image || data.imageUrl || "",
              publishedAt: data.publishedAt || data.publishedDate || "",
              updatedAt: data.updatedAt || data.fetchedAt || "",
              source: data.source || data.sourceName || "Hugging Face",
              wordCount: data.wordCount || 0,
              readingTimeMin: data.readingTimeMin || 3,
              headings: data.headings || [],
              images: data.images || (data.imageUrl ? [{ src: data.imageUrl, alt: data.title || "" }] : []),
              contentHtml: data.contentHtml || data.content || "",
              contentText: data.contentText || data.content || "",
            };
          }
        }
      }
    } catch (err) {
      console.warn("getHuggingFaceArticle failed:", err);
    }
    throw new Error("Article unavailable. Please try again later.");
  },

  getRankings: fetchRankingsModels,
  fetchRankingsModels,

  getCodingAgentsBenchmarks: async (): Promise<CodingAgentModel[]> => {
    try {
      const res = await fetch(`${BASE_URL}/marketing-service/campgin/rankings/coding-agents`, {
        headers: getRequestHeaders(),
      });
      if (res.ok) {
        const body = await res.json();
        const data = Array.isArray(body) ? body : (body?.data ?? []);
        if (data && data.length > 0) return data;
      }
    } catch {
      // Fallback to verified Artificial Analysis Coding Agents benchmark dataset
    }
    return CODING_AGENTS_DATA;
  },
};
