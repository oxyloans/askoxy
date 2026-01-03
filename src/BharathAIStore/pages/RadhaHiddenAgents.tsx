// src/BharathAIStore/pages/RadhaHiddenAgents.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

// ------------------ Types ------------------
export interface Assistant {
  id?: string;
  assistantId?: string;
  agentId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  hideAgent?: boolean; // ✅ from API: true means this agent should be shown here
  link?: string; // Direct link for static agents
}

// ------------------ Initials fallback (same logic as Store) ------------------
const PLAY_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;

const hashSeed = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const gradientFor = (seed: string) => {
  const h = hashSeed(seed || "AI");
  const i1 = h % PLAY_COLORS.length;
  const i2 =
    (i1 + 1 + ((h >> 3) % (PLAY_COLORS.length - 1))) % PLAY_COLORS.length;
  const c1 = PLAY_COLORS[i1];
  const c2 = PLAY_COLORS[i2];
  const angle = [
    [0, 1],
    [1, 0],
    [0, 0],
    [1, 1],
  ][(h >> 7) & 3];
  return { c1, c2, x2: angle[0], y2: angle[1] };
};

function makeInitialsSVG(name: string) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "AI";

  const { c1, c2, x2, y2 } = gradientFor(name || "AI");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${initials}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" rx="28" ry="28" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-size="180" fill="rgba(255,255,255,0.96)" letter-spacing="6">${initials}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const HiddenAssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
}> = ({ assistant, onOpen }) => {
  const fallback = makeInitialsSVG(assistant.name || "AI");
  const chosenThumb = (assistant.imageUrl || "").trim() || fallback;
  const [imgSrc, setImgSrc] = useState<string>(chosenThumb);

  return (
    <div
      onClick={onOpen}
      className={[
        "relative group rounded-2xl cursor-pointer",
        "shadow-purple-400/60",
        "after:absolute after:-inset-[2px] after:rounded-2xl after:content-[''] after:-z-10",
        "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)] after:pointer-events-none",
        "transition-transform hover:-translate-y-0.5",
        "h-full flex flex-col",
      ].join(" ")}
    >
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden flex flex-col h-full">
        {/* Header image area — 16:9 like the store */}
        <div className="relative w-full">
          <div
            className="h-0 w-full pb-[56%] overflow-hidden"
            aria-hidden="true"
          >
            <img
              src={imgSrc}
              alt={`${assistant.name || "Agent"} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallback)}
            />
          </div>
          {/* Bot badge (same position as in store) */}
          <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 px-5 pb-5 flex flex-col h-full">
          <div className="min-w-0">
            <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
              {assistant.name || "Untitled Agent"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {assistant.description || "No description provided."}
            </p>
          </div>

          {/* Open button - now just visual since whole card is clickable */}
          <div className="mt-auto pt-5 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-[13px] font-semibold transition"
              title="Click anywhere on card to open agent"
              disabled
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------ Static Agents ------------------
const staticAgents: Assistant[] = [
  {
    id: "ftcci-agent-static",
    assistantId: "ftcci-agent-static",
    agentId: "ftcci-agent-static",
    name: "FTCCI Agent",
    description:
      "AI Agent that organizes and retrieves FTCCI Federation contacts across industries. Provides quick access to business leaders, policymakers, and professionals, enabling networking, partnerships, and opportunities in Telangana and beyond.",
    imageUrl: "",
    hideAgent: true,
    link: "/asst_CjeprnghuYO8OsMdCD8JIx8A/3bf72057-bdc0-4864-afac-51f39f6a7524/ftcci-agent",
  },
  {
    id: "oxygroup-task-management-static",
    assistantId: "oxygroup-task-management-static",
    agentId: "oxygroup-task-management-static",
    name: "OXYGroup Task Management",
    description:
      "An intelligent agent monitors employees' daily task updates, verifies authenticity, detects duplicate submissions, flags errors, and ensures accurate and genuine reporting of morning plans and end-of-day reports.",
    imageUrl: "",
    hideAgent: true,
    link: "/asst_V41gWq69vrfVyCc4rTMScxIE/d1bc5d31-6c7b-4412-9aae-fa8070ad9ff0/oxygroup-task-management",
  },
];

// ------------------ Page ------------------
const RadhaHiddenAgents: React.FC = () => {
  const navigate = useNavigate();

  const slugify = (s: string) =>
    (s || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleOpen = (a: Assistant) => {
    // For static agents with direct links, navigate directly
    if (a.link) {
      window.location.href = a.link;
      return;
    }

    // Fallback for dynamic agents (though we don't have any now)
    const fullAssistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const fullAgentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const nameSlug = slugify(a.name || "agent");

    // Check if user is logged in
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!userId) {
      // Guest redirect logic
      let intended = "";
      if (fullAssistantId && fullAgentId && nameSlug) {
        intended = `/${encodeURIComponent(
          fullAssistantId
        )}/${encodeURIComponent(fullAgentId)}/${encodeURIComponent(nameSlug)}`;
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
        sessionStorage.setItem("fullAgentId", fullAgentId);
      } else if (fullAssistantId && fullAgentId) {
        intended = `/${encodeURIComponent(
          fullAssistantId
        )}/${encodeURIComponent(fullAgentId)}`;
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
        sessionStorage.setItem("fullAgentId", fullAgentId);
      } else if (fullAssistantId) {
        intended = `/${encodeURIComponent(fullAssistantId)}`;
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
      } else {
        intended = `/by-name/${encodeURIComponent(nameSlug)}`;
      }
      sessionStorage.setItem("redirectPath", intended);
      sessionStorage.setItem("fromAISTore", "true");
      window.location.href = "/whatsappregister?primaryType=AGENT";
    } else {
      // Logged-in user navigation
      let targetPath = "";
      if (fullAssistantId && fullAgentId && nameSlug) {
        targetPath = `/${encodeURIComponent(
          fullAssistantId
        )}/${encodeURIComponent(fullAgentId)}/${encodeURIComponent(nameSlug)}`;
      } else if (fullAssistantId && fullAgentId) {
        targetPath = `/${encodeURIComponent(
          fullAssistantId
        )}/${encodeURIComponent(fullAgentId)}`;
      } else if (fullAssistantId) {
        targetPath = `/${encodeURIComponent(fullAssistantId)}`;
      } else {
        targetPath = `/by-name/${encodeURIComponent(nameSlug)}`;
      }
      navigate(targetPath);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Hidden Agents</h1>
        </div>
        <Link
          to="/bharath-aistore/RadhaAgents"
          className="text-sm font-semibold text-purple-700 hover:text-purple-800"
        >
          ← Back to Radha’s AI Lab
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {staticAgents.map((a) => (
          <div
            key={a.assistantId || a.id || a.agentId || ""}
            className="h-full flex flex-col"
          >
            <HiddenAssistantCard assistant={a} onOpen={() => handleOpen(a)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadhaHiddenAgents;
