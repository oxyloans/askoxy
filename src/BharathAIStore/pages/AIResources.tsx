// /src/AgentStore/AIResources.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { Modal } from "antd";
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
import Logo9 from "../../assets/img/VideoImage.png";

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

// ---------- Assistants ----------
const STATIC_ASSISTANTS: Assistant[] = [
  {
    id: "1",
    object: "assistant",
    created_at: 1697059200000,
    name: "Askoxy.AI",
    description:
      "Askoxy.AI is an AI-powered marketplace designed to help users discover products, services, and intelligent tools in one place. It enables unlimited AI interactions, smart recommendations, and productivity use cases for individuals, businesses, and entrepreneurs across multiple domains.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat", timeAgo: "1d" },
    response_format: "text",
    image: "https://i.ibb.co/SXsSVTXn/ask1.png",
    link: "/",
  },
  {
    id: "2",
    object: "assistant",
    created_at: 1697059200000,
    name: "OXYGPT Chat",
    description:
      "OXYGPT Chat is a conversational AI assistant built for natural, human-like interactions. It helps users ask questions, generate ideas, solve problems, and receive intelligent responses instantly for daily productivity, learning, and professional use cases.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Chat", timeAgo: "18h" },
    response_format: "text",
    image: Logo2,
    link: "/genoxy",
  },
  {
    id: "3",
    object: "assistant",
    created_at: 1697145600000,
    name: "OXYGPT Voice Assistant",
    description:
      "OXYGPT Voice Assistant allows users to interact with AI using voice commands in real time. It supports hands-free conversations, instant responses, and smart task execution, making it ideal for accessibility, multitasking, and voice-driven AI experiences.",
    model: "gpt-4",
    instructions: "Enable real-time voice conversations and commands",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Voice", timeAgo: "18h" },
    response_format: "audio",
    image: Logo1,
    link: "/voiceAssistant/welcome",
  },
  {
    id: "4",
    object: "assistant",
    created_at: 1697232000000,
    name: "AI LLMs",
    description:
      "AI LLMs helps users explore large language models and understand how advanced AI reasoning works. It provides insights, demos, and explanations for developers, learners, and enterprises interested in modern AI language technologies.",
    model: "gpt-4",
    instructions: "Assist with LLM-related insights and demos",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Research", timeAgo: "1d" },
    response_format: "text",
    image: Logo4,
    link: "/genoxy/chat",
  },
  {
    id: "5",
    object: "assistant",
    created_at: 1697318400000,
    name: "AI Video Generation",
    description:
      "AI Video Generation enables users to create videos using artificial intelligence for marketing, education, and storytelling. It supports automated content creation, visual generation, and AI-assisted video workflows for creators and businesses.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media", timeAgo: "3w" },
    response_format: "video",
    image: Logo3,
    link: "/ai-videos",
  },
  {
    id: "6",
    object: "assistant",
    created_at: 1697059200000,
    name: "AI Book",
    description:
      "AI Book is a learning resource designed to help users understand modern artificial intelligence tools and concepts. It provides easy explanations, practical examples, and guided knowledge for beginners, students, and professionals.",
    model: "gpt-4",
    instructions: "Provide conversational AI chat support",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Resources", timeAgo: "1w" },
    response_format: "text",
    image: Logo5,
    link: "/freeaibook",
  },
  {
    id: "7",
    object: "assistant",
    created_at: 1697145600000,
    name: "GLMS",
    description:
      "GLMS is an AI-powered lending and financial intelligence platform supporting multiple BFSI use cases. It helps organizations understand lending workflows, compliance, and AI-driven financial solutions through real-world examples and tools.",
    model: "gpt-4",
    instructions: "Enable real-time voice conversations and commands",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Voice", timeAgo: "20h" },
    response_format: "audio",
    image: Logo6,
    link: "/glms",
  },
  {
    id: "8",
    object: "assistant",
    created_at: 1697232000000,
    name: "Job Street",
    description:
      "Job Street focuses on career readiness and BFSI job preparation by combining AI guidance with industry insights. It helps learners, freshers, and professionals prepare for interviews and develop job-relevant skills.",
    model: "gpt-4",
    instructions: "Assist with LLM-related insights and demos",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Research", timeAgo: "1d" },
    response_format: "text",
    image: Logo7,
    link: "/jobstreet",
  },
  {
    id: "9",
    object: "assistant",
    created_at: 1697318400000,
    name: "BillionAIre Hub",
    description:
      "BillionAIre Hub is an AI studio-as-a-service initiative based in Hyderabad. It enables startups, enterprises, and creators to build, test, and deploy AI solutions with access to tools, expertise, and innovation support.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media", timeAgo: "18h" },
    response_format: "video",
    image: Logo8,
    link: "/freeaibook",
  },
  {
    id: "10",
    object: "assistant",
    created_at: 1697318400000,
    name: "Create Your Own AI Video",
    description:
      "A cinematic video creation using Sora, showcasing AI-powered video creation from simple text prompts.Futuristic digital visuals, smooth camera motion, and a modern professional tech aesthetic.",
    model: "gpt-4",
    instructions: "Assist with AI video creation and generation",
    tools: [],
    top_p: 1,
    temperature: 0.7,
    reasoning_effort: null,
    tool_resources: {},
    metadata: { category: "Media", timeAgo: "18h" },
    response_format: "video",
    image: Logo9,
    link: "/video-creator",
  },
];

// ---------- Offer Modal Component ----------
const OfferModal: React.FC<{ open: boolean; onCancel: () => void }> = ({
  open,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
      title="Offer Information"
      width={520}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div
        style={{
          padding: "16px",
        }}
      >
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 16px 12px",
              borderBottom: "1px solid #f0f0f0",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              Offer Ended
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
              The offer ended on <b>31st December 2025</b>.
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "14px 16px 16px",
              display: "grid",
              gap: 12,
            }}
          >
            {/* Info card */}
            <div
              style={{
                borderRadius: 10,
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                The book will be available again soon in our store.
              </div>
            </div>

            {/* Bid card */}
            <div
              style={{
                borderRadius: 10,
                border: "1px solid #f0f0f0",
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                Special Appreciation Bid
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                To appreciate our first copy buyer, we are hosting a special
                bid.
              </div>

              {/* Highlight */}
              <div
                style={{
                  borderRadius: 10,
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}
                >
                  The highest bidder wins the first copy
                </div>
                <div style={{ marginTop: 4, fontSize: 13, color: "#374151" }}>
                  and an exclusive chit-chat session with our CEO.
                </div>
              </div>

              {/* Note */}
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 10,
                  background: "#F9FAFB",
                  border: "1px solid #f0f0f0",
                  padding: 10,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                Stay tuned for updates!
              </div>
            </div>
          </div>
        </div>

        {/* Responsive width helper */}
        <style>
          {`
          /* Make modal fit nicely on small screens */
          .ant-modal {
            max-width: calc(100vw - 24px) !important;
          }
          .ant-modal-content {
            border-radius: 14px !important;
            overflow: hidden;
          }
        `}
        </style>
      </div>
    </Modal>
  );
};

// ---------- Skeleton Loader (Edge Style) ----------
const AssistantSkeleton: React.FC = () => (
  <div
    style={{
      background: "#fff",
      borderRadius: 26,
      padding: 14,
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      animation: "pulse 1.4s ease-in-out infinite",
    }}
  >
    <div
      style={{
        height: 170,
        borderRadius: 22,
        background: "#e5e7eb",
        marginBottom: 12,
      }}
    />
    <div style={{ padding: "0 8px 6px 8px" }}>
      <div
        style={{
          height: 12,
          width: "60%",
          background: "#e5e7eb",
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <div
        style={{
          height: 14,
          width: "90%",
          background: "#e5e7eb",
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 14,
          width: "75%",
          background: "#e5e7eb",
          borderRadius: 8,
        }}
      />
    </div>
  </div>
);

// ---------- Edge-style Card ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  q: string;
  onShowOfferModal: () => void;
}> = ({ assistant, q, onShowOfferModal }) => {
  const navigate = useNavigate();

  const timeAgo =
    assistant?.metadata?.timeAgo ||
    (() => {
      // fallback from created_at timestamp
      const ms = assistant.created_at;
      if (!ms) return "1d";
      const diff = Date.now() - ms;
      const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      return `${days}d`;
    })();

  const source = assistant?.metadata?.category || "AI Initiatives";

  const onOpen = () => {
    if (assistant.id === "6") {
      // Free AI Book
      onShowOfferModal();
    } else {
      navigate(assistant.link);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
      className="edgeCard"
      style={{
        background: "#ffffff",
        borderRadius: 26,
        padding: 14,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        transition:
          "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
      }}
    >
      {/* Image */}
      <div
        style={{
          borderRadius: 22,
          overflow: "hidden",
          background: "#e9e9e9",
        }}
      >
        <img
          src={assistant.image}
          alt={`${assistant.name} thumbnail`}
          style={{
            width: "100%",
            height: 170,
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div style={{ padding: "12px 8px 6px 8px" }}>
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "rgba(0,0,0,0.62)",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: "rgba(0,0,0,0.2)",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 600, color: "rgba(0,0,0,0.7)" }}>
            {source}
          </span>
          <span style={{ opacity: 0.8 }}>•</span>
          <span style={{ opacity: 0.9 }}>{timeAgo}</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "rgba(0,0,0,0.85)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical" as any,
            overflow: "hidden",
            marginBottom: 6,
          }}
          title={assistant.name}
        >
          <Highlighter text={assistant.name} query={q} />
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(0,0,0,0.62)",
            lineHeight: 1.85,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as any,
            overflow: "hidden",
          }}
          title={assistant.description}
        >
          <Highlighter text={assistant.description} query={q} />
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const AiResources: React.FC = () => {
  const { debouncedQuery: q } = useSearch();
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
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
    <div style={{ background: "white", minHeight: "100vh", padding: 22 }}>
      {/* hover + responsive + pulse */}
      <style>{`
        @keyframes pulse { 
          0%,100% { opacity: 1; } 
          50% { opacity: 0.55; } 
        }
        .edgeCard:hover {
          transform: translateY(-2px);
          border-color: rgba(0,0,0,0.1);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .edgeGrid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        @media (max-width: 1150px) { .edgeGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 860px)  { .edgeGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 520px)  { .edgeGrid { grid-template-columns: repeat(1, minmax(0, 1fr)); } }
      `}</style>

      <main style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "rgba(0,0,0,0.86)",
              margin: 0,
            }}
          >
            AI Initiatives
          </h2>
          <p
            style={{ marginTop: 8, marginBottom: 0, color: "rgba(0,0,0,0.6)" }}
          >
            Explore our curated AI initiatives.
          </p>
        </div>

        {loading ? (
          <div className="edgeGrid">
            {Array.from({ length: 8 }).map((_, i) => (
              <AssistantSkeleton key={i} />
            ))}
          </div>
        ) : filteredAssistants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <Bot style={{ width: 56, height: 56, color: "rgba(0,0,0,0.35)" }} />
            <h3 style={{ marginTop: 14, marginBottom: 6, fontWeight: 800 }}>
              No Initiatives Found
            </h3>
            <p style={{ margin: 0, color: "rgba(0,0,0,0.6)" }}>
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="edgeGrid">
            {filteredAssistants.slice(0, 10).map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                q={q}
                onShowOfferModal={() => setShowOfferModal(true)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Offer Modal for Free AI Book */}
      <OfferModal
        open={showOfferModal}
        onCancel={() => setShowOfferModal(false)}
      />
    </div>
  );
};

export default AiResources;
