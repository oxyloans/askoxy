import React, { useMemo } from "react";
import { Bot, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";

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
}

// ---------- Helpers ----------
const gradientFor = (seed: string) => {
  const hues = [265, 210, 155, 120, 35]; // purple, blue, pink, green, amber
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const h = hues[sum % hues.length];
  return `from-[hsl(${h}deg_90%_60%)] to-[hsl(${(h + 30) % 360}deg_90%_50%)]`;
};

const prettyInstalls = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M+`
    : n >= 1000
    ? `${Math.floor(n / 1000)}k+`
    : `${n}`;

// Build a deterministic SVG data-URI thumb with initials (dummy image)
const initialsThumb = (title: string, seed: string) => {
  const initials = (title || "AI")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  const bg = `hsl(${hue} 70% 55%)`;
  const fg = "#ffffff";

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='240' height='135' viewBox='0 0 240 135'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${bg}' stop-opacity='1'/>
        <stop offset='100%' stop-color='${bg}' stop-opacity='0.8'/>
      </linearGradient>
    </defs>
    <rect width='240' height='135' rx='16' fill='url(#g)'/>
    <circle cx='36' cy='99' r='6' fill='rgba(255,255,255,0.8)' />
    <circle cx='210' cy='24' r='5' fill='rgba(255,255,255,0.75)' />
    <text x='120' y='75' text-anchor='middle' font-family='Inter,system-ui,Segoe UI,Roboto' font-size='44' font-weight='700' fill='${fg}'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ---------- Updated Images ----------
const CARD_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd3?q=80&w=1200&auto=format&fit=crop", // OXYGPT Chat
  "https://images.unsplash.com/photo-1616469829130-5d4d8b0f6a69?q=80&w=1200&auto=format&fit=crop", // OXYGPT Voice Assistant
  "https://images.unsplash.com/photo-1666875753104-2a26e10c6eeb?q=80&w=1200&auto=format&fit=crop", // AI LLMs
  "https://images.unsplash.com/photo-1622547748225-0871c9f3f2f0?q=80&w=1200&auto=format&fit=crop", // AI Video Generation
];

// ---------- Updated Assistants ----------
const STATIC_ASSISTANTS: Assistant[] = [
  {
    id: "1",
    object: "assistant",
    created_at: 1697059200000,
    name: "Free Ai Book",
    description:
      "Learn and explore today’s top AI tools for text, images, music, and code.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat" },
    response_format: "text",
  },
  {
    id: "2",
    object: "assistant",
    created_at: 1697145600000,
    name: "Glms",
    description:
      "AI-powered lending platform with 60+ use cases and 50+ expert roles.",
    model: "gpt-4",
    instructions: "Enable real-time voice conversations and commands",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Voice" },
    response_format: "audio",
  },
  {
    id: "3",
    object: "assistant",
    created_at: 1697232000000,
    name: "Job street",
    description:
      "Helping organizations drive digital transformation and BFSI job readiness.",
    model: "gpt-4",
    instructions: "Assist with LLM-related insights and demos",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Research" },
    response_format: "text",
  },
  {
    id: "4",
    object: "assistant",
    created_at: 1697318400000,
    name: "BillionAIre Hub ",
    description:
      "AI Studio-as-a-Service in Hyderabad, offering free AI learning and building.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media" },
    response_format: "video",
  },
];

// ---------- Card Component ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  index: number;
  q: string;
}> = ({ assistant, index, q }) => {
  const navigate = useNavigate();
  const seed = assistant.name || `A${index}`;
  const installs = 1000 + ((assistant.created_at || index) % 24000);
  const rating = 4 + ((assistant.created_at || index) % 10) / 10;
  const badge =
    (assistant.metadata && (assistant.metadata.category as string)) || "Tools";

  const fallbackThumb = initialsThumb(assistant.name || "AI", seed);
  const chosenThumb = CARD_IMAGES[index % CARD_IMAGES.length];

  return (
    <div
      className="group rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition overflow-hidden cursor-pointer"
      onClick={() => navigate(`/bharath-aistore/assistant/${assistant.id}`)}
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
            src={chosenThumb}
            alt={`${assistant.name} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = fallbackThumb;
            }}
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

        <div className="mt-3 flex items-center justify-between text-[12px] text-gray-600">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-400">•</span>
            <span>{prettyInstalls(installs)} installs</span>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-3.5 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition w-full"
            aria-label={`Open ${assistant.name}`}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const FreeAiBook: React.FC = () => {
  const { debouncedQuery: q } = useSearch();

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
    <div className=" bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
        <div className="mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
         Free Ai Book
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            Explore our curated AI initiatives. Search by domain, name, or
            description.
          </p>
        </div>

        {filteredAssistants.length === 0 ? (
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

export default FreeAiBook;
