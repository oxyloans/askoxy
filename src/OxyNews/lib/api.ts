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
} from "../types";
import { CODING_AGENTS_DATA, CodingAgentModel } from "../data/codingAgentsData";
import { FALLBACK_RANKINGS } from "../data/rankingsFallbackData";


// AI automation base — single source of truth for all OxyNews API calls
const AI = `${BASE_URL}/ai-automation`;

const HF_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlYzY3OTExYS1iMmIzLTQ3OTMtODZiMy00ZDIxMjg4ODZmYWYiLCJpYXQiOjE3OTU1ODY4ODksImV4cCI6MTc5NjE5MTY4OX0.3rPmNt4POStbFs5Ao45CYbutehCSgs4JrW_DEQ6F2w1nASsbEIABc2dOB7hlmFPbwbHaa5Yy2NS0Qn1Oo2T1gw";

// Legacy aliases kept for any external imports
export const BASE_URL1 = AI;
export const RANKINGS_BASE = AI;

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
  explicitToken?: string | null,
  isGet = false
): Headers => {
  const requestHeaders = new Headers(headers);
  const accessToken = explicitToken || getAccessToken();

  // Don't set Content-Type on GET requests — some backends reject it
  if (!isGet && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (accessToken && !requestHeaders.has("Authorization")) {
    const cleanToken = accessToken.replace(/^Bearer\s+/i, "").trim();
    requestHeaders.set("Authorization", `Bearer ${cleanToken}`);
  }

  return requestHeaders;
};

// GET-specific headers — no Content-Type, with auth token
const getHeaders = () => getRequestHeaders(undefined, HF_TOKEN, true);

// Derive a stable SEO slug from an article URL path segment
export function urlToSlug(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    const last = path.split("/").filter(Boolean).pop() || "";
    return last
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  } catch {
    return url.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
  }
}

// Single request helper — always hits BASE_URL/ai-automation
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isGet = !options?.method || options.method.toUpperCase() === "GET";
  const res = await fetch(`${AI}${path}`, {
    ...options,
    headers: getRequestHeaders(options?.headers, null, isGet),
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
    const res = await fetch(`${AI}/news/external/openai`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data ?? json;
      // { items: [...] } shape
      if (data?.items && Array.isArray(data.items)) return data.items;
      // { channel: { items: [...] } } shape
      if (data?.channel?.items && Array.isArray(data.channel.items)) return data.channel.items;
      if (Array.isArray(data)) return data;
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
      if (typeof b === "string") { paragraphs.push(b); continue; }
      const text = (b.text || b.content || b.value || "").trim();
      if (!text) continue;
      const type = (b.type || "").toLowerCase();
      if (type === "h1" || type === "h2") paragraphs.push(`## ${text}`);
      else if (type === "h3" || type === "h4") paragraphs.push(`### ${text}`);
      else if (type === "blockquote") paragraphs.push(`> ${text}`);
      else if (type === "li") paragraphs.push(`• ${text}`);
      else paragraphs.push(text);
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
    const res = await fetch(`${AI}/news/external/openai/article?${q.toString()}`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data ?? json;
      if (data && typeof data === "object") return data as OpenAiArticleData;
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
    rawView === "month" || rawView === "monthly" ? "month"
    : rawView === "day" || rawView === "daily" || rawView === "today" ? "day"
    : "week";

  const q = new URLSearchParams({ view: normalizedView });
  if (models) q.set("models", models);
  const headers = getRequestHeaders(undefined, token);
  // Remove Content-Type for GET
  headers.delete("Content-Type");

  try {
    const res = await fetch(`${AI}/rankings/models?${q.toString()}`, { headers });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json) ? json
        : Array.isArray(json?.data) ? json.data
        : Array.isArray(json?.data?.items) ? json.data.items
        : [];
      if (list.length > 0) {
        try { sessionStorage.setItem(`rankings_${normalizedView}`, JSON.stringify(list)); } catch {}
        return list as RawRankingsItem[];
      }
    }
  } catch (err) {
    console.warn("Rankings fetch failed:", err);
  }

  try {
    const cached = sessionStorage.getItem(`rankings_${normalizedView}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as RawRankingsItem[];
    }
  } catch {}

  return FALLBACK_RANKINGS;
}

function toHFArticle(item: any): HFArticle {
  return {
    title: item.title || "Untitled",
    url: item.url || "",
    path: item.url || "",
    author: item.author || item.sourceName || "Hugging Face",
    description: item.description || item.content || item.contentText || "",
    image: item.image || item.imageUrl || "",
    publishedAt: item.publishedAt || item.publishedDate || "",
    updatedAt: item.updatedAt || item.fetchedAt || "",
    source: item.source || item.sourceName || "Hugging Face",
    wordCount: item.wordCount || 0,
    readingTimeMin: item.readingTimeMin || 3,
    headings: item.headings || [],
    images: item.images || (item.imageUrl ? [{ src: item.imageUrl, alt: item.title || "" }] : []),
    contentHtml: item.contentHtml || item.content || "",
    contentText: item.contentText || item.content || "",
  };
}

function sortHFArticles(articles: HFArticle[]): HFArticle[] {
  return [...articles].sort((a, b) => {
    const timeA = a.publishedAt && !isNaN(Date.parse(a.publishedAt)) ? Date.parse(a.publishedAt)
      : a.updatedAt && !isNaN(Date.parse(a.updatedAt)) ? Date.parse(a.updatedAt) : 0;
    const timeB = b.publishedAt && !isNaN(Date.parse(b.publishedAt)) ? Date.parse(b.publishedAt)
      : b.updatedAt && !isNaN(Date.parse(b.updatedAt)) ? Date.parse(b.updatedAt) : 0;
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

  getExternalNews: async (sourceName: string, page = 0, size = 20): Promise<PageResponse<ExternalNewsArticle>> => {
    if (sourceName.toLowerCase() === "openai") {
      const items = await fetchOpenAiNews();
      const articles: ExternalNewsArticle[] = items.map((item) => ({
        id: urlToSlug(item.link) as any,
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
        const hfRes = await api.getHuggingFaceList(size);
        const articles: ExternalNewsArticle[] = hfRes.articles.map((item) => ({
          id: urlToSlug(item.url) as any, url: item.url, title: item.title, sourceName: "huggingface",
          category: "AI", publishedDate: item.publishedAt, fetchedAt: item.updatedAt,
          content: item.contentText || item.contentHtml || item.description, imageUrl: item.image,
        }));
        const start = page * size;
        return {
          content: articles.slice(start, start + size),
          totalElements: hfRes.count,
          totalPages: Math.ceil(hfRes.count / size) || 1,
          number: page, size, last: !hfRes.moreAvailable && (start + size >= articles.length),
        };
      } catch {}
    }

    const q = new URLSearchParams({ page: String(page), size: String(size) });
    return request<PageResponse<ExternalNewsArticle>>(`/news/external/${sourceName.toLowerCase()}?${q.toString()}`);
  },

  getAllExternalNews: async (sourceName: string, size = 20) => {
    const firstPage = await api.getExternalNews(sourceName, 0, size);
    if (firstPage.totalPages <= 1) return firstPage;
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

  refreshExternalNews: async (sourceName: string) => {
    if (sourceName.toLowerCase() === "openai") {
      try { return await request<string>(`/news/external/openai/refresh`, { method: "POST" }); }
      catch { return "Refreshed"; }
    }
    return request<string>(`/news/external/${sourceName.toLowerCase()}/refresh`, { method: "POST" });
  },

  refreshNewsdataNews: (params?: { query?: string; country?: string; language?: string }) => {
    const q = new URLSearchParams();
    if (params?.query) q.set("query", params.query);
    if (params?.country) q.set("country", params.country);
    if (params?.language) q.set("language", params.language);
    const qs = q.toString();
    return request<{ success: boolean; saved: number; fetched: number; message: string }>(
      `/news/external/newsdata/refresh${qs ? `?${qs}` : ""}`,
      { method: "POST" }
    );
  },

  getExternalArticle: async (sourceName: string, id: number | string) => {
    const all = await api.getAllExternalNews(sourceName);
    // Match by slug id (string) or numeric id, also fallback-match by URL-derived slug
    let found = all.content.find((a) =>
      String(a.id) === String(id) || urlToSlug(a.url) === String(id)
    );
    if (!found && sourceName.toLowerCase() === "openai" && all.content.length > 0) found = all.content[0];
    if (!found && sourceName.toLowerCase() === "openai") {
      found = {
        id: 1, url: "https://openai.com/index/introducing-openai", title: "Introducing OpenAI",
        sourceName: "openai", category: "Company", publishedDate: "Fri, 11 Dec 2015 08:00:00 GMT",
        fetchedAt: null,
        content: "OpenAI is a non-profit artificial intelligence research company.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      };
    }
    if (!found) throw new Error("Article not found");
    return found;
  },

  getExternalArticleContent: async (sourceName: string, id: number, articleUrl?: string) => {
    if (sourceName.toLowerCase() === "openai") {
      let targetUrl = articleUrl;
      if (!targetUrl) {
        try { const article = await api.getExternalArticle(sourceName, id); targetUrl = article.url; } catch {}
      }
      if (targetUrl) {
        const fullContent = await fetchOpenAiArticleContent(targetUrl);
        if (fullContent?.trim()) return fullContent;
      }
      try { const article = await api.getExternalArticle(sourceName, id); return article.content || ""; } catch { return ""; }
    }
    if (sourceName.toLowerCase() === "huggingface" && articleUrl) {
      try {
        const hfArt = await api.getHuggingFaceArticle(articleUrl);
        if (hfArt && (hfArt.contentHtml || hfArt.contentText || hfArt.description))
          return hfArt.contentHtml || hfArt.contentText || hfArt.description;
      } catch {}
    }
    return request<string>(`/news/external/${sourceName.toLowerCase()}/${id}/content`);
  },

  getExternalArticleImage: async (sourceName: string, id: number) => {
    if (sourceName.toLowerCase() === "openai") {
      const article = await api.getExternalArticle(sourceName, id);
      return article.imageUrl || null;
    }
    return request<string | null>(`/news/external/${sourceName.toLowerCase()}/${id}/image`, { method: "POST" });
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
    fetch(`${AI}/paperclip/rbi`, { headers: getHeaders() })
      .then(res => res.json()).then(body => body?.data ?? []),

  getRbiCampaignPressReleases: (): Promise<RbiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/press-releases-new?organizationName=RBI&type=PRESS_RELEASE`, { headers: getHeaders() })
      .then(res => res.json()),

  getRbiDailyPressReleases: (): Promise<RbiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/daily-press-release`, { headers: getHeaders() })
      .then(res => res.json()),

  getIrdaiPressReleases: (): Promise<IrdaiCampaignResponse> =>
    fetch(`${BASE_URL}/marketing-service/campgin/press-releases-new?organizationName=IRDAI&type=PRESS_RELEASE`, { headers: getHeaders() })
      .then(res => res.json()),

  search: (query: string, page = 0, size = 12) => {
    const q = new URLSearchParams({ q: query, page: String(page), size: String(size) });
    return request<PageResponse<NewsFeedItem>>(`/news/search?${q.toString()}`);
  },

  getPaperclip: (id: string) => request<PaperclipDetail>(`/paperclip/${id}`),

  getPaperclipBySlug: (slug: string) => request<PaperclipDetail>(`/paperclip/slug/${slug}`),

  chat: (id: string, message: string, webSearch = false, conversationId?: string) =>
    fetch(`${AI}/paperclip/${id}/chat`, {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify({ message, webSearch, conversationId }),
    }).then((r) => r.json()) as Promise<{ success: boolean; answer: string; sources: string[] }>,

  getChatHistory: (id: string) => request<ChatMessage[]>(`/paperclip/${id}/chat/history`),

  getHuggingFaceList: async (limit = 30): Promise<HFListResponse> => {
    const q = new URLSearchParams({ limit: String(limit), content: "true" });
    try {
      const res = await fetch(`${AI}/news/external/huggingface?${q.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const data = body?.data ?? body;

      // Shape 1: { content: [...], totalElements, last } (Spring Page)
      if (data && Array.isArray(data.content)) {
        const articles = data.content.map(toHFArticle);
        return { source: "Hugging Face", count: data.totalElements ?? articles.length, moreAvailable: !data.last, articles: sortHFArticles(articles) };
      }
      // Shape 2: { articles: [...], count, moreAvailable }
      if (data && Array.isArray(data.articles)) {
        return { source: data.source || "Hugging Face", count: data.count ?? data.articles.length, moreAvailable: data.moreAvailable ?? false, articles: sortHFArticles(data.articles.map(toHFArticle)) };
      }
      // Shape 3: plain array
      if (Array.isArray(data)) {
        const articles = data.map(toHFArticle);
        return { source: "Hugging Face", count: articles.length, moreAvailable: false, articles: sortHFArticles(articles) };
      }
      // Shape 4: top-level array (no wrapper)
      if (Array.isArray(body)) {
        const articles = body.map(toHFArticle);
        return { source: "Hugging Face", count: articles.length, moreAvailable: false, articles: sortHFArticles(articles) };
      }
    } catch (err) {
      console.warn("getHuggingFaceList failed:", err);
    }
    throw new Error("Hugging Face news unavailable. Please try again later.");
  },

  getHuggingFaceArticle: async (url: string): Promise<HFArticle> => {
    const q = new URLSearchParams({ url, content: "true" });
    try {
      const res = await fetch(`${AI}/news/external/huggingface/article?${q.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const data = body?.data ?? body;
      if (typeof data === "string") {
        return {
          title: "Hugging Face Article", url, path: url, author: "Hugging Face",
          description: data.slice(0, 200), image: "", publishedAt: "", updatedAt: "",
          source: "Hugging Face", wordCount: data.split(/\s+/).length,
          readingTimeMin: Math.ceil(data.split(/\s+/).length / 200),
          headings: [], images: [], contentHtml: data, contentText: data,
        };
      }
      if (data && typeof data === "object") {
        return {
          title: data.title || "Hugging Face Article",
          url: data.url || url,
          path: data.path || data.url || url,
          author: data.author || data.sourceName || "Hugging Face",
          description: data.description || data.content || data.contentText || "",
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
    } catch (err) {
      console.warn("getHuggingFaceArticle failed:", err);
    }
    throw new Error("Article unavailable. Please try again later.");
  },

  getRankings: fetchRankingsModels,
  fetchRankingsModels,

  getCodingAgentsBenchmarks: async (): Promise<CodingAgentModel[]> => {
    try {
      const res = await fetch(`${BASE_URL}/marketing-service/campgin/rankings/coding-agents`, { headers: getRequestHeaders() });
      if (res.ok) {
        const body = await res.json();
        const data = Array.isArray(body) ? body : (body?.data ?? []);
        if (data && data.length > 0) return data;
      }
    } catch {}
    return CODING_AGENTS_DATA;
  },
};