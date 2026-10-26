// src/data/resourceLinks.ts
export interface ResourceLink {
  id: string;
  name: string;
  url: string;
  description: string;
  // Optional — when set, ResourcePage shows a live news feed pulled from
  // the backend's /news/external/{newsSource} endpoint.
  newsSource?: string;
}

export interface ResourceCategory {
  id: string;
  label: string;
  links: ResourceLink[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: "finance-banking",
    label: "Finance & Banking",
    links: [
      { id: "rbi-news", name: "RBI News", url: "/rbi-news", description: "RBI press releases & circulars" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    links: [
      { id: "irdai-news", name: "IRDAI News", url: "/irdai-news", description: "IRDAI press releases & circulars" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    links: [
      { id: "anthropic", name: "Anthropic", url: "/resources/ai/anthropic", description: "Top leader for coding", newsSource: "anthropic" },
      { id: "llm-leaderboard", name: "Model Leaderboard", url: "/resources/ai/llm-leaderboard", description: "Live cross-provider model rankings" },
      { id: "llm-rankings", name: "Top Models", url: "/resources/ai/llm-rankings", description: "By weekly LLM usage" },
      { id: "task-rankings", name: "Top Models by Task", url: "/resources/ai/task-rankings", description: "Models ranked by task & spend" },
      { id: "openai", name: "OpenAI", url: "https://openai.com/", description: "APIs for all" },
      { id: "huggingface", name: "Hugging Face", url: "https://huggingface.co/", description: "AI community" },
      { id: "deepseek", name: "DeepSeek", url: "https://deepseek.com/en/index.html", description: "China AI" },
      { id: "xai", name: "xAI", url: "https://x.ai/company", description: "Elon Musk's AI" },
      { id: "qwen", name: "Qwen", url: "https://qwen.ai/home", description: "Alibaba's Qwen model family" },
      { id: "deepmind", name: "DeepMind", url: "https://deepmind.google/", description: "Google's AI research lab" },
      { id: "llama", name: "Llama (Meta)", url: "https://developer.meta.com/ai/models/llama-4/", description: "Facebook AI" },
      { id: "google-ai", name: "Google AI Leaderboard", url: "/resources/ai/google-ai", description: "AI coding agents & benchmark score leaderboard" },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    links: [
      { id: "sightsinplus-employment", name: "SightsInPlus Employment", url: "https://www.sightsinplus.com/category/news/employment/", description: "Latest employment news and job market updates", newsSource: "sightsinplus" },
    ],
  },
];

export function findResource(categoryId: string, resourceId: string) {
  const category = RESOURCE_CATEGORIES.find((c) => c.id === categoryId);
  const link = category?.links.find((l) => l.id === resourceId);
  return { category, link };
}