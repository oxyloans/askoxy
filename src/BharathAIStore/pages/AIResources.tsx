// /src/AgentStore/AIResources.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Bot, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";

// ---------- Images ----------
import Logo1 from "../../assets/img/ChatGPT Image Sep 9, 2025, 10_57_29 AM.png";
import Logo2 from "../../assets/img/ChatGPT Image Sep 9, 2025, 10_57_35 AM.png";
import Logo3 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_03_17 AM.png";
import Logo4 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_07_33 AM.png";
import Logo5 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_29_20 AM.png";
import Logo6 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_32_14 AM.png";
import Logo7 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_32_50 AM.png";
import Logo8 from "../../assets/img/ChatGPT Image Sep 9, 2025, 11_34_01 AM.png";

// ---------- Types ----------
interface Assistant {
  id: string;
  object: string;
  created_at: number;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools: any[];
  top_p: number;
  temperature: number;
  reasoning_effort: null;
  tool_resources: any;
  metadata: any;
  response_format: string;
  image?: string;
  link: string;
}

// ---------- Helpers ----------
const gradientFor = (seed: string) => {
  const hues = [265, 210, 155, 120, 35];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const h = hues[sum % hues.length];
  return `from-[hsl(${h}deg_90%_60%)] to-[hsl(${(h + 30) % 360}deg_90%_50%)]`;
};

// ---------- Assistants ----------
const STATIC_ASSISTANTS: Assistant[] = [
  {
    id: "1",
    object: "assistant",
    created_at: 1697059200000,
    name: "Askoxy.AI",
    description:
      "AI-Based Marketplace for Products and Services - Unlimited ChatGPT prompts at no cost.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat" },
    response_format: "text",
    image: "https://i.ibb.co/SXsSVTXn/ask1.png",
    link: "/",
  },
  {
    id: "2",
    object: "assistant",
    created_at: 1697059200000,
    name: "OXYGPT Chat",
    description: "A conversational AI assistant for human-like chat.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat" },
    response_format: "text",
    image: Logo2,
    link: "/genoxy",
  },
  {
    id: "3",
    object: "assistant",
    created_at: 1697145600000,
    name: "OXYGPT Voice Assistant",
    description: "Voice-enabled AI assistant with real-time commands.",
    model: "gpt-4",
    instructions: "Enable real-time voice conversations and commands",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Voice" },
    response_format: "audio",
    image: Logo1,
    link: "/voiceAssistant/welcome",
  },
  {
    id: "4",
    object: "assistant",
    created_at: 1697232000000,
    name: "AI LLMs",
    description: "Explore Large Language Models for knowledge and reasoning.",
    model: "gpt-4",
    instructions: "Assist with LLM-related insights and demos",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Research" },
    response_format: "text",
    image: Logo4,
    link: "/genoxy/chat",
  },
  {
    id: "5",
    object: "assistant",
    created_at: 1697318400000,
    name: "AI Video Generation",
    description: "Generate videos using AI for marketing and education.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media" },
    response_format: "video",
    image: Logo3,
    link: "/ai-videos",
  },
  {
    id: "6",
    object: "assistant",
    created_at: 1697059200000,
    name: "Free Ai Book",
    description: "Learn and explore today’s AI tools.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat" },
    response_format: "text",
    image: Logo5,
    link: "/freeaibook",
  },
  {
    id: "7",
    object: "assistant",
    created_at: 1697145600000,
    name: "Glms",
    description: "AI-powered lending platform with 60+ use cases.",
    model: "gpt-4",
    instructions: "Enable real-time voice conversations and commands",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Voice" },
    response_format: "audio",
    image: Logo6,
    link: "/glms",
  },
  {
    id: "8",
    object: "assistant",
    created_at: 1697232000000,
    name: "Job street",
    description: "Helping organizations with BFSI job readiness.",
    model: "gpt-4",
    instructions: "Assist with LLM-related insights and demos",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Research" },
    response_format: "text",
    image: Logo7,
    link: "/jobstreet",
  },
  {
    id: "9",
    object: "assistant",
    created_at: 1697318400000,
    name: "BillionAIre Hub",
    description: "AI Studio-as-a-Service in Hyderabad.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media" },
    response_format: "video",
    image: Logo8,
    link: "/freeaibook",
  },
];

// ---------- Skeleton Loader ----------
const AssistantSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col h-full">
    <div className="h-40 bg-gray-200" />
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-1" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="h-8 bg-gray-300 rounded mt-4" />
    </div>
  </div>
);

// ---------- Card ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  index: number;
  q: string;
}> = ({ assistant, index, q }) => {
  const navigate = useNavigate();
  const seed = assistant.name || `A${index}`;
  const badge = assistant.metadata?.category || "Tools";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(assistant.link)}
      onKeyDown={(e) =>
        e.key === "Enter" || e.key === " " ? navigate(assistant.link) : null
      }
      className="group relative cursor-pointer flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 overflow-hidden h-full"
    >
      {/* Image Section */}
      <div
        className={`relative h-44 w-full bg-gradient-to-br ${gradientFor(
          seed
        )}`}
      >
        <img
          src={assistant.image}
          alt={`${assistant.name} thumbnail`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <h3 className="font-semibold text-base text-gray-900 mb-1">
            <Highlighter text={assistant.name} query={q} />
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            <Highlighter text={assistant.description} query={q} />
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700 px-2 py-0.5 text-[11px]">
            <Shield className="h-3.5 w-3.5" />
            {badge}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(assistant.link);
            }}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-white text-xs font-semibold hover:bg-purple-700 transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const AiResources: React.FC = () => {
  const { debouncedQuery: q } = useSearch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredAssistants = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    if (!term) return STATIC_ASSISTANTS;
    return STATIC_ASSISTANTS.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ---- Header Section (Left-Aligned) ---- */}
        <div className="mb-8 text-left">
          <h2 className="text-3xl font-bold text-gray-900">AI Initiatives</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Explore our curated AI initiatives.
          </p>
        </div>

        {/* ---- Card Grid (One Row - 4 Cards) ---- */}
        {loading ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
            {Array.from({ length: 9 }).map((_, i) => (
              <AssistantSkeleton key={i} />
            ))}
          </div>
        ) : filteredAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Initiatives Found
            </h3>
            <p className="text-gray-600">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
            {filteredAssistants.slice(0, 9).map((assistant, index) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                index={index}
                q={q}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AiResources;

