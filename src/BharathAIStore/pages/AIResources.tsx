import React, { useMemo, useState, useEffect } from "react";
import { Bot, Star, Shield } from "lucide-react";
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
  link: string; // 👈 Added link
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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
    id: "8",
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
const AssistantSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-8 bg-gray-300 rounded mt-3" />
      </div>
    </div>
  );
};

// ---------- Card Component ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  index: number;
  q: string;
}> = ({ assistant, index, q }) => {
  const navigate = useNavigate();
  const seed = assistant.name || `A${index}`;
  
  const badge =
    (assistant.metadata && (assistant.metadata.category as string)) || "Tools";

  return (
    <div
      className="group rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition overflow-hidden cursor-pointer"
      onClick={() => navigate(assistant.link)} // 👈 Navigate on click
      role="button"
      tabIndex={0}
      aria-label={`Open ${assistant.name}`}
    >
      <div className="relative w-full">
        <div
          className={`h-0 w-full pb-[56%] bg-gradient-to-br ${gradientFor(
            seed
          )} overflow-hidden`}
          aria-hidden="true"
        >
          <img
            src={assistant.image}
            alt={`${assistant.name} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
          <Bot className="h-6 w-6 text-purple-700" />
        </div>
      </div>

      <div className="pt-8 px-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-[15px] text-gray-900">
              <Highlighter text={assistant.name || ""} query={q} />
            </h3>
            <p className="text-[13px] text-gray-600 line-clamp-3 mt-0.5">
              <Highlighter text={assistant.description || ""} query={q} />
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
            <Shield className="h-3.5 w-3.5" />
            {badge}
          </span>
        </div>

       

        <div className="mt-4">
          <button
            onClick={() => navigate(assistant.link)} // 👈 Navigate on click
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-3.5 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition w-full"
            aria-label={`Open ${assistant.name}`}
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

  // simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredAssistants = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    if (!term) return STATIC_ASSISTANTS;
    return STATIC_ASSISTANTS.filter((a) => {
      const name = a.name?.toLowerCase() || "";
      const desc = a.description?.toLowerCase() || "";
      return name.includes(term) || desc.includes(term);
    });
  }, [q]);

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            AI Initiatives
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            Explore our curated AI initiatives. Search by domain, name, or
            description.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
            {filteredAssistants.map((assistant, index) => (
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
