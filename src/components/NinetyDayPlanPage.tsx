import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ModuleKey = "lo-system" | "fm-system" | "cm-system";
type ViewType = "business" | "system";

type UseCase = {
  day: number; // 1..51
  useCaseId: string;
  title: string;
  description: string;
  module: ModuleKey;
};

type PhaseTask = {
  day: number; // 52..90
  title: string;
  description: string;
  tags?: string[];
};

type BookTopic = {
  no: number;
  title: string;
  page: number;
};

type BookDayPlan = {
  day: number; // 1..ceil(topics/2)
  topics: BookTopic[];
};

type DailyAIToolCategory =
  | "Chat"
  | "Research"
  | "Writing"
  | "Design"
  | "Video"
  | "Automation"
  | "PM"
  | "Coding";

type DailyAITool = {
  day: number;
  tool: string;
  content: string; // exactly 25 words
  link: string;
  category: DailyAIToolCategory;
};

const dailyAITools30: DailyAITool[] = [
  {
    day: 1,
    tool: "ChatGPT",
    content:
      "Learn prompt fundamentals: ask clear questions, define roles, request formats, iterate responses, brainstorm ideas, summarize content, plan tasks, and improve everyday decision making efficiently.",
    link: "https://chat.openai.com",
    category: "Chat",
  },
  {
    day: 2,
    tool: "Perplexity AI",
    content:
      "Research faster using cited answers, compare multiple sources, extract facts, validate claims, build timelines, and save reliable insights for learning, presentations, and professional decision making.",
    link: "https://www.perplexity.ai",
    category: "Research",
  },
  {
    day: 3,
    tool: "Claude",
    content:
      "Analyze long documents by uploading files, generating structured summaries, identifying risks, extracting action items, rewriting content, and validating understanding through follow up questions.",
    link: "https://claude.ai",
    category: "Research",
  },
  {
    day: 4,
    tool: "Google Gemini",
    content:
      "Use multimodal AI to analyze images, write emails, answer questions, and integrate smoothly with Google Docs, Sheets, Gmail, and Drive for daily productivity tasks.",
    link: "https://gemini.google.com",
    category: "Chat",
  },
  {
    day: 5,
    tool: "Grok",
    content:
      "Track real time trends from X by summarizing conversations, identifying opinions, discovering breaking topics, collecting links, and gaining fast social media insights effectively.",
    link: "https://x.ai",
    category: "Research",
  },
  {
    day: 6,
    tool: "DeepL",
    content:
      "Translate text accurately while preserving tone, rewrite sentences professionally, suggest alternatives, and improve clarity for multilingual business communication, marketing content, and documentation.",
    link: "https://www.deepl.com",
    category: "Writing",
  },
  {
    day: 7,
    tool: "Grammarly",
    content:
      "Improve writing by correcting grammar, refining tone, reducing repetition, enhancing clarity, and adjusting style based on audience, intent, and professional communication goals.",
    link: "https://www.grammarly.com",
    category: "Writing",
  },
  {
    day: 8,
    tool: "Jasper",
    content:
      "Generate marketing content including blog outlines, advertisements, landing pages, and product descriptions, then refine outputs to match brand voice and compliance standards.",
    link: "https://www.jasper.ai",
    category: "Writing",
  },
  {
    day: 9,
    tool: "Copy.ai",
    content:
      "Create outreach content such as cold emails, LinkedIn messages, product descriptions, and taglines, test variations, personalize messaging, and optimize conversions effectively.",
    link: "https://www.copy.ai",
    category: "Writing",
  },
  {
    day: 10,
    tool: "Poe",
    content:
      "Compare multiple AI models using identical prompts, evaluate responses, select best outputs, and save winning prompts for research, writing, coding, and analysis tasks.",
    link: "https://poe.com",
    category: "Chat",
  },
  {
    day: 11,
    tool: "Midjourney",
    content:
      "Learn image prompt structure, style keywords, aspect ratios, and iterations to generate high quality brand visuals, thumbnails, concept art, and creative assets.",
    link: "https://www.midjourney.com",
    category: "Design",
  },
  {
    day: 12,
    tool: "DALL·E",
    content:
      "Generate images by describing scenes, styles, and edits, create variations, modify backgrounds, and produce visuals for social posts, presentations, and advertisements.",
    link: "https://openai.com/dall-e",
    category: "Design",
  },
  {
    day: 13,
    tool: "Adobe Firefly",
    content:
      "Create commercial safe visuals, text effects, and generative fills while maintaining brand consistency using Adobe templates, licensed assets, and professional design workflows.",
    link: "https://firefly.adobe.com",
    category: "Design",
  },
  {
    day: 14,
    tool: "Canva AI",
    content:
      "Design quickly using templates, auto generated layouts, platform resizing, and AI tools to create posters, presentations, carousels, and marketing materials efficiently.",
    link: "https://www.canva.com",
    category: "Design",
  },
  {
    day: 15,
    tool: "GPT Image",
    content:
      "Edit and enhance images by removing backgrounds, extending canvases, improving quality, creating mockups, and maintaining consistent branding across all visual assets.",
    link: "https://chat.openai.com",
    category: "Design",
  },
  {
    day: 16,
    tool: "Runway",
    content:
      "Generate videos from prompts, remove objects, add motion effects, and create short ads, reels, and explainers using AI powered video tools.",
    link: "https://runwayml.com",
    category: "Video",
  },
  {
    day: 17,
    tool: "Synthesia",
    content:
      "Create professional avatar videos by writing scripts, selecting presenters, adding captions, and exporting training or marketing videos without cameras or studios.",
    link: "https://www.synthesia.io",
    category: "Video",
  },
  {
    day: 18,
    tool: "Google Veo",
    content:
      "Experiment with cinematic video generation by defining scenes, camera angles, lighting, and motion, then refining prompts for consistent visual storytelling.",
    link: "https://deepmind.google/technologies/veo",
    category: "Video",
  },
  {
    day: 19,
    tool: "OpusClip",
    content:
      "Convert long videos into engaging shorts by detecting highlights automatically, adding captions, and publishing clips across platforms to grow audience reach.",
    link: "https://www.opus.pro",
    category: "Video",
  },
  {
    day: 20,
    tool: "Descript",
    content:
      "Edit audio and video through text by removing filler words, cutting scenes, enhancing sound quality, adding captions, and exporting professional content.",
    link: "https://www.descript.com",
    category: "Video",
  },
  {
    day: 21,
    tool: "Zapier",
    content:
      "Automate repetitive workflows by connecting apps, triggering actions, moving data, sending alerts, and scheduling tasks to save time and effort.",
    link: "https://zapier.com",
    category: "Automation",
  },
  {
    day: 22,
    tool: "Zapier Agents",
    content:
      "Build autonomous agents by defining goals, tools, and triggers to draft replies, update records, create tickets, and notify users automatically.",
    link: "https://zapier.com/agents",
    category: "Automation",
  },
  {
    day: 23,
    tool: "Notion AI",
    content:
      "Summarize notes, generate documents, extract tasks, and organize knowledge bases inside one workspace for projects, processes, documentation, and collaboration.",
    link: "https://www.notion.so",
    category: "PM",
  },
  {
    day: 24,
    tool: "ClickUp AI",
    content:
      "Plan projects by generating tasks, summarizing updates, writing SOPs, tracking progress, identifying blockers, and managing deadlines with smart dashboards.",
    link: "https://clickup.com",
    category: "PM",
  },
  {
    day: 25,
    tool: "Asana AI",
    content:
      "Create structured project plans, suggest next actions, identify risks, automate routing, and keep teams aligned with clear ownership and timelines.",
    link: "https://asana.com",
    category: "PM",
  },
{
  day: 26,
  tool: "GitHub Copilot",
  content:
    "Accelerate coding by generating functions, understanding APIs, writing tests, learning patterns, reviewing suggestions carefully, and committing clean maintainable code.",
  link: "https://github.com/features/copilot",
  category: "Coding",
},
{
  day: 27,
  tool: "Cursor",
  content:
    "Develop faster by chatting with your codebase, refactoring safely, generating files, fixing bugs, and learning concepts by asking contextual questions.",
  link: "https://cursor.sh",
  category: "Coding",
},
{
  day: 28,
  tool: "Tabnine",
  content:
    "Use secure AI autocomplete for private code suggestions, faster typing, reduced errors, and improved productivity across professional development teams.",
  link: "https://www.tabnine.com",
  category: "Coding",
},
{
  day: 29,
  tool: "Bolt.new",
  content:
    "Generate full stack applications directly in the browser using prompts, edit code live, preview instantly, and iterate rapidly without environment setup.",
  link: "https://bolt.new",
  category: "Coding",
},
{
  day: 30,
  tool: "Lovable",
  content:
    "Turn natural language into working applications, generate UI and backend instantly, customize logic, and ship products fast without complex setup.",
  link: "https://lovable.dev",
  category: "Coding",
},
];

const C1 = "#364d69";
const C2 = "#90b7d7";
const C3 = "#173b63";

const GRAD = "linear-gradient(135deg, #364d69 0%, #90b7d7 52%, #173b63 100%)";
const SOFT_BG =
  "radial-gradient(circle at 18% 18%, rgba(144,183,215,0.22), transparent 55%), radial-gradient(circle at 82% 70%, rgba(23,59,99,0.18), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.86))";

const cx = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const images = [
  "https://i.ibb.co/Pz5RSRWy/6-8-9-7-ASKOXY-AI-BOOK-images-7.jpg",
  "https://i.ibb.co/7xvJXrmv/6-8-9-7-ASKOXY-AI-BOOK-images-8.jpg",
  "https://i.ibb.co/Cprh5mfK/6-8-9-7-ASKOXY-AI-BOOK-images-9.jpg",
  "https://i.ibb.co/CK7D4QG1/6-8-9-7-ASKOXY-AI-BOOK-images-10.jpg",
  "https://i.ibb.co/LXvTMdQD/6-8-9-7-ASKOXY-AI-BOOK-images-11.jpg",
  "https://i.ibb.co/MyMcjH0h/6-8-9-7-ASKOXY-AI-BOOK-images-12.jpg",
  "https://i.ibb.co/XZ2VzFgQ/6-8-9-7-ASKOXY-AI-BOOK-images-13.jpg",
  "https://i.ibb.co/jkryC3x4/6-8-9-7-ASKOXY-AI-BOOK-images-14.jpg",
  "https://i.ibb.co/whR03KjG/6-8-9-7-ASKOXY-AI-BOOK-images-15.jpg",
  "https://i.ibb.co/Pv6cRyV6/6-8-9-7-ASKOXY-AI-BOOK-images-16.jpg",
  "https://i.ibb.co/7xDBzhwr/6-8-9-7-ASKOXY-AI-BOOK-images-17.jpg",
  "https://i.ibb.co/d46dwyzQ/6-8-9-7-ASKOXY-AI-BOOK-images-18.jpg",
  "https://i.ibb.co/BDbzQ1N/6-8-9-7-ASKOXY-AI-BOOK-images-19.jpg",
  "https://i.ibb.co/1fm2hDFf/6-8-9-7-ASKOXY-AI-BOOK-images-20.jpg",
  "https://i.ibb.co/MkSwpL7f/6-8-9-7-ASKOXY-AI-BOOK-images-21.jpg",
  "https://i.ibb.co/mCLqjGK1/6-8-9-7-ASKOXY-AI-BOOK-images-22.jpg",
  "https://i.ibb.co/sdNbZ0Vv/6-8-9-7-ASKOXY-AI-BOOK-images-23.jpg",
  "https://i.ibb.co/vxT6v2Ts/6-8-9-7-ASKOXY-AI-BOOK-images-24.jpg",
  "https://i.ibb.co/zTDby58w/6-8-9-7-ASKOXY-AI-BOOK-images-25.jpg",
  "https://i.ibb.co/v6xbs6j0/6-8-9-7-ASKOXY-AI-BOOK-images-26.jpg",
  "https://i.ibb.co/GQPkD5bH/6-8-9-7-ASKOXY-AI-BOOK-images-27.jpg",
  "https://i.ibb.co/JWFvSccb/6-8-9-7-ASKOXY-AI-BOOK-images-28.jpg",
  "https://i.ibb.co/Ng9drLyB/6-8-9-7-ASKOXY-AI-BOOK-images-29.jpg",
  "https://i.ibb.co/DfsmBYWD/6-8-9-7-ASKOXY-AI-BOOK-images-30.jpg",
  "https://i.ibb.co/x8hMtc8N/6-8-9-7-ASKOXY-AI-BOOK-images-31.jpg",
  "https://i.ibb.co/7xGnPRdK/6-8-9-7-ASKOXY-AI-BOOK-images-32.jpg",
  "https://i.ibb.co/8nsdmFNH/6-8-9-7-ASKOXY-AI-BOOK-images-33.jpg",
  "https://i.ibb.co/NgjkfDrC/6-8-9-7-ASKOXY-AI-BOOK-images-34.jpg",
  "https://i.ibb.co/39kzTV71/6-8-9-7-ASKOXY-AI-BOOK-images-35.jpg",
  "https://i.ibb.co/GQrx4mj0/6-8-9-7-ASKOXY-AI-BOOK-images-36.jpg",
  "https://i.ibb.co/sd7g2X61/6-8-9-7-ASKOXY-AI-BOOK-images-37.jpg",
  "https://i.ibb.co/TMScMmR0/6-8-9-7-ASKOXY-AI-BOOK-images-38.jpg",
  "https://i.ibb.co/FT3FKVb/6-8-9-7-ASKOXY-AI-BOOK-images-39.jpg",
  "https://i.ibb.co/YB903bL5/6-8-9-7-ASKOXY-AI-BOOK-images-40.jpg",
  "https://i.ibb.co/C5XcgBqL/6-8-9-7-ASKOXY-AI-BOOK-images-41.jpg",
  "https://i.ibb.co/xSwxLW28/6-8-9-7-ASKOXY-AI-BOOK-images-42.jpg",
  "https://i.ibb.co/6JpZnZz2/6-8-9-7-ASKOXY-AI-BOOK-images-43.jpg",
  "https://i.ibb.co/gZp1PNnr/6-8-9-7-ASKOXY-AI-BOOK-images-44.jpg",
  "https://i.ibb.co/Nd4MQ5pG/6-8-9-7-ASKOXY-AI-BOOK-images-47.jpg",
  "https://i.ibb.co/9HtnGWnx/6-8-9-7-ASKOXY-AI-BOOK-images-48.jpg",
  "https://i.ibb.co/VYtz6GrY/6-8-9-7-ASKOXY-AI-BOOK-images-49.jpg",
  "https://i.ibb.co/4Z3qzt11/6-8-9-7-ASKOXY-AI-BOOK-images-50.jpg",
  "https://i.ibb.co/bgq164rq/6-8-9-7-ASKOXY-AI-BOOK-images-51.jpg",
  "https://i.ibb.co/NnLPjLPg/6-8-9-7-ASKOXY-AI-BOOK-images-52.jpg",
  "https://i.ibb.co/Dft2RwFH/6-8-9-7-ASKOXY-AI-BOOK-images-53.jpg",
  "https://i.ibb.co/5XVXXvSd/6-8-9-7-ASKOXY-AI-BOOK-images-54.jpg",
  "https://i.ibb.co/qPm27L0/6-8-9-7-ASKOXY-AI-BOOK-images-55.jpg",
  "https://i.ibb.co/sp6KnZHz/6-8-9-7-ASKOXY-AI-BOOK-images-56.jpg",
  "https://i.ibb.co/TDXkpLg1/6-8-9-7-ASKOXY-AI-BOOK-images-57.jpg",
  "https://i.ibb.co/Fksrxzgz/6-8-9-7-ASKOXY-AI-BOOK-images-58.jpg",
  "https://i.ibb.co/35XnzTyQ/6-8-9-7-ASKOXY-AI-BOOK-images-59.jpg",
  "https://i.ibb.co/gZNLQ94f/6-8-9-7-ASKOXY-AI-BOOK-images-60.jpg",
  "https://i.ibb.co/GqftNzP/6-8-9-7-ASKOXY-AI-BOOK-images-61.jpg",
  "https://i.ibb.co/d4YVvJkd/6-8-9-7-ASKOXY-AI-BOOK-images-62.jpg",
  "https://i.ibb.co/5gcSPZMJ/6-8-9-7-ASKOXY-AI-BOOK-images-63.jpg",
  "https://i.ibb.co/VW5bQ0Vq/6-8-9-7-ASKOXY-AI-BOOK-images-64.jpg",
  "https://i.ibb.co/7JYjCLxX/6-8-9-7-ASKOXY-AI-BOOK-images-65.jpg",
  "https://i.ibb.co/Tx37Vhk2/6-8-9-7-ASKOXY-AI-BOOK-images-66.jpg",
  "https://i.ibb.co/M5VrZGZx/6-8-9-7-ASKOXY-AI-BOOK-images-67.jpg",
  "https://i.ibb.co/m5F4RpDv/6-8-9-7-ASKOXY-AI-BOOK-images-68.jpg",
  "https://i.ibb.co/wFLSJJ2x/6-8-9-7-ASKOXY-AI-BOOK-images-69.jpg",
  "https://i.ibb.co/zVWyQnP2/6-8-9-7-ASKOXY-AI-BOOK-images-70.jpg",
  "https://i.ibb.co/8n5GQjRB/6-8-9-7-ASKOXY-AI-BOOK-images-71.jpg",
  "https://i.ibb.co/Qj3Trv8S/6-8-9-7-ASKOXY-AI-BOOK-images-72.jpg",
  "https://i.ibb.co/60mSkxL4/6-8-9-7-ASKOXY-AI-BOOK-images-73.jpg",
  "https://i.ibb.co/MxdDKptH/6-8-9-7-ASKOXY-AI-BOOK-images-74.jpg",
  "https://i.ibb.co/ksTMYZxp/6-8-9-7-ASKOXY-AI-BOOK-images-75.jpg",
  "https://i.ibb.co/RpLs69tW/6-8-9-7-ASKOXY-AI-BOOK-images-76.jpg",
  "https://i.ibb.co/tT65xjvs/6-8-9-7-ASKOXY-AI-BOOK-images-77.jpg",
  "https://i.ibb.co/VYZvKdrB/6-8-9-7-ASKOXY-AI-BOOK-images-78.jpg",
  "https://i.ibb.co/TMxY0Q6s/6-8-9-7-ASKOXY-AI-BOOK-images-79.jpg",
  "https://i.ibb.co/G3TKjtPW/6-8-9-7-ASKOXY-AI-BOOK-images-80.jpg",
  "https://i.ibb.co/nMQDJtWJ/6-8-9-7-ASKOXY-AI-BOOK-images-81.jpg",
  "https://i.ibb.co/wZ5w0fnq/6-8-9-7-ASKOXY-AI-BOOK-images-82.jpg",
  "https://i.ibb.co/JFvQqZvL/6-8-9-7-ASKOXY-AI-BOOK-images-83.jpg",
  "https://i.ibb.co/HL56f16t/6-8-9-7-ASKOXY-AI-BOOK-images-84.jpg",
  "https://i.ibb.co/m51mBXzy/6-8-9-7-ASKOXY-AI-BOOK-images-85.jpg",
  "https://i.ibb.co/Xf6dGrtg/6-8-9-7-ASKOXY-AI-BOOK-images-86.jpg",
  "https://i.ibb.co/7xwC465Z/6-8-9-7-ASKOXY-AI-BOOK-images-87.jpg",
];

const Pill = ({ text }: { text: string }) => (
  <span
    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white/70"
    style={{ borderColor: `${C2}66`, color: C3 }}
  >
    {text}
  </span>
);

const SoftCard = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cx(
      "relative overflow-hidden rounded-3xl border bg-white/85 backdrop-blur-sm",
      className
    )}
    style={{
      borderColor: `${C2}66`,
      boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
    }}
  >
    {children}
  </div>
);

const PrimaryBtn = ({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white",
      "transition hover:opacity-95 active:scale-[0.99]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    style={{ background: GRAD }}
  >
    {label}
  </button>
);

const SecondaryBtn = ({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center rounded-2xl border bg-white/80 px-5 py-3 text-sm font-semibold",
      "transition hover:bg-white active:scale-[0.99]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    style={{ borderColor: `${C2}66`, color: C3 }}
  >
    {label}
  </button>
);

const ToggleBtn = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      active ? "bg-white" : "bg-white/60"
    )}
    style={{
      borderColor: `${C2}66`,
      color: active ? C3 : "#64748b",
    }}
  >
    {label}
  </button>
);

const DayChip = ({
  day,
  active,
  onClick,
  prefix = "Day",
}: {
  day: number;
  active: boolean;
  onClick: () => void;
  prefix?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      active ? "bg-white" : "bg-white/70 hover:bg-white"
    )}
    style={{
      borderColor: active ? `${C3}55` : `${C2}66`,
      color: active ? C3 : "#334155",
      boxShadow: active ? "0 10px 22px rgba(23,59,99,0.12)" : "none",
    }}
    aria-label={`${prefix} ${day}`}
  >
    {prefix} {day}
  </button>
);

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>Progress</span>
        <span className="font-semibold" style={{ color: C3 }}>
          {value}/{max} days
        </span>
      </div>
      <div
        className="mt-2 h-2.5 rounded-full border bg-white overflow-hidden"
        style={{ borderColor: `${C2}66` }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: GRAD }}
        />
      </div>
    </div>
  );
};

const ModuleTag = ({ module }: { module: ModuleKey }) => {
  const label =
    module === "lo-system" ? "LOS" : module === "fm-system" ? "FMS" : "CMS";
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: `${C3}14`, color: C3 }}
    >
      {label}
    </span>
  );
};

const WhatsAppJoinCard = () => {
  const WHATSAPP_GROUP_LINK =
    "https://chat.whatsapp.com/EItom0BMte185NndsmGCXL";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_GROUP_LINK);
      alert("WhatsApp group link copied!");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8 sm:pb-10">
      <div
        className="relative overflow-hidden rounded-[36px] border bg-white/90 backdrop-blur-sm"
        style={{
          borderColor: `${C2}66`,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="absolute inset-0" style={{ background: SOFT_BG }} />
        <div
          className="absolute -inset-10 opacity-30 blur-3xl"
          style={{ background: "rgba(144,183,215,0.25)" }}
        />

        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Pill text="Community" />
                <Pill text="Daily Guidance" />
                <Pill text="90-Day Job Plan" />
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Join our WhatsApp Group
              </h2>

              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Our CEO will guide you daily inside the group. Get daily tasks,
                clarifications, and support to complete the 90-day plan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <PrimaryBtn
                label="Join WhatsApp Group"
                onClick={() => window.open(WHATSAPP_GROUP_LINK, "_blank")}
                className="w-full sm:w-auto"
              />
              <SecondaryBtn
                label="Copy Link"
                onClick={copyLink}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** ✅ BOOK INDEX (topics + page numbers) */
const BOOK_TOPICS: BookTopic[] = [
  { no: 1, title: "What is AI?", page: 5 },
  { no: 2, title: "What is Gen AI?", page: 6 },
  { no: 3, title: "Why Learn AI?", page: 7 },
  { no: 4, title: "How to Use This Book", page: 8 },
  { no: 5, title: "Mission Million AI Coders", page: 9 },
  { no: 6, title: "What is Prompt Engineering?", page: 10 },
  { no: 7, title: "Popular AI Platforms, LLMs & Tools", page: 11 },
  { no: 8, title: "Writing Great AI Prompt Instructions", page: 12 },
  { no: 9, title: "Think in Prompts, Not Just Tasks", page: 13 },
  { no: 10, title: "A Good AI Prompt Engineering", page: 14 },
  { no: 11, title: "AI Prompt Engineering Tips", page: 15 },
  { no: 12, title: "Prompt Engineering Kit", page: 16 },
  { no: 13, title: "Prompt Templates – Reuse, Remix, Repeat", page: 17 },
  { no: 14, title: "Your First 5 Prompts – Get Started Today", page: 18 },
  { no: 15, title: "Daily Prompt Habits to Build Your AI Muscle", page: 19 },
  { no: 16, title: "Chain of Thought – Step-by-Step Thinking", page: 20 },
  { no: 17, title: "Types of Prompts – Zero, One & Few-Shot", page: 21 },
  { no: 18, title: "Role-Based Prompts", page: 22 },
  { no: 19, title: "Agent Style Prompts", page: 23 },
  { no: 20, title: "Meta Prompts", page: 24 },
  { no: 21, title: "Loops in AI / Gen AI", page: 26 },

  { no: 22, title: "Debugging in AI vs Gen AI", page: 27 },
  { no: 23, title: "Prompting Mistakes to Avoid", page: 28 },
  { no: 24, title: "Prompt vs Completion", page: 29 },
  { no: 25, title: "Tone Variations", page: 30 },
  { no: 26, title: "Length Control", page: 31 },
  { no: 27, title: "Language & Dialect Shift", page: 32 },
  { no: 28, title: "Practical: Logic Bugs", page: 33 },
  { no: 29, title: "Testing Your AI Model", page: 34 },
  { no: 30, title: "Test Plan", page: 35 },
  { no: 31, title: "From Binary to Brain – How AI Understands Data", page: 36 },
  { no: 32, title: "What are Tokens & Embeddings", page: 37 },
  { no: 33, title: "LLMs & Tokens", page: 38 },
  { no: 34, title: "What is Vector Embedding?", page: 39 },
  { no: 35, title: "Vector Embeddings", page: 40 },
  { no: 36, title: "Storing Images, Texts & Vectors", page: 41 },
  { no: 37, title: "Image Transformation", page: 42 },
  { no: 38, title: "Spotting Patterns", page: 43 },
  { no: 39, title: "How AI Paints a Picture – From", page: 44 },
  { no: 40, title: "Being Creative with AI & Gen AI", page: 45 },

  { no: 41, title: "Inside a GPU", page: 46 },
  { no: 42, title: "Who Builds AI Tools?", page: 47 },
  { no: 43, title: "Understanding Language Model Sizes", page: 48 },
  { no: 44, title: "Which Model Fits Which Task?", page: 49 },
  { no: 45, title: "What is RAG?", page: 50 },
  { no: 46, title: "Metadata Filtering in LLMs", page: 52 },
  { no: 47, title: "FAISS vs ChromaDB", page: 53 },
  { no: 48, title: "Chunking", page: 54 },
  { no: 49, title: "AI Agents in Action", page: 55 },
  { no: 50, title: "AI Agent vs Assistant vs Language Model", page: 56 },
  { no: 51, title: "Multi-tool Agent in Action", page: 57 },
  { no: 52, title: "Re-ranking Logic in LLM", page: 58 },
  { no: 53, title: "AI Decision Making", page: 59 },
  { no: 54, title: "OpenAI API – Request Structure", page: 60 },
  { no: 55, title: "Streamlit UI Components", page: 61 },
  { no: 56, title: "Ask Your PDF – How It Works", page: 62 },
  {
    no: 57,
    title: "How an AI Prompt Engineer Can Earn Lakhs of Money",
    page: 63,
  },
  { no: 58, title: "Jobs You Can Do as a Prompt Engineer", page: 64 },
  { no: 59, title: "Platforms & Niches", page: 65 },
  { no: 60, title: "Creating Prompt Products – Templates & Packs", page: 66 },
  { no: 61, title: "Can AI Get a Virus?", page: 67 },

  { no: 62, title: "AI Under Attack", page: 68 },
  { no: 63, title: "AI & Human Jobs – A Future Together?", page: 69 },
  { no: 64, title: "AI Under Attack", page: 70 },
  { no: 65, title: "What is Agentic AI?", page: 71 },
];

function getBookPageImageUrl(page: number) {
  const idx = page - 1;
  if (idx >= 0 && idx < images.length) return images[idx];
  return null;
}

function BookPreviewModal({
  open,
  onClose,
  page,
  url,
  onPrevPage,
  onNextPage,
}: {
  open: boolean;
  onClose: () => void;
  page: number;
  url: string | null;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevPage();
      if (e.key === "ArrowRight") onNextPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrevPage, onNextPage]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b px-4 sm:px-6 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              Book Page Preview
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
              style={{ borderColor: `${C2}66`, color: C3 }}
              title="Prev Page (←)"
            >
              Prev
            </button>
            <button
              onClick={onNextPage}
              className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
              style={{ borderColor: `${C2}66`, color: C3 }}
              title="Next Page (→)"
            >
              Next
            </button>
            <button
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
              style={{ background: GRAD }}
              title="Close (Esc)"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {url ? (
            <div
              className="rounded-3xl border bg-white overflow-hidden"
              style={{ borderColor: `${C2}66` }}
            >
              <img
                src={url}
                alt={`Book Page ${page}`}
                className="w-full h-[70vh] object-contain bg-white"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="p-3 text-xs text-slate-600">
                Tip: Use ← / → keys to change page, Esc to close.
              </div>
            </div>
          ) : (
            <div
              className="rounded-3xl border bg-white p-6"
              style={{ borderColor: `${C2}66` }}
            >
              <p className="text-sm font-bold text-slate-900">
                Page image not available
              </p>
              <p className="mt-1 text-sm text-slate-600">
                This page number is out of your image mapping range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NinetyDayPlanPage() {
  const navigate = useNavigate();

  // ✅ Your 51 use cases (LOS + FMS + CMS)
  const useCases: UseCase[] = useMemo(() => {
    const base: Array<
      Pick<UseCase, "useCaseId" | "title" | "description" | "module">
    > = [
      // LOS
      {
        useCaseId: "customer-id-creation",
        title: "Customer ID Creation",
        description:
          "Generate unique customer ID and link it to the Core Banking System (CBS)",
        module: "lo-system",
      },
      {
        useCaseId: "co-applicant-linking",
        title: "Co-applicant & Guarantor Linking",
        description:
          "Upload and link KYC/supporting documents for co-applicants or guarantors",
        module: "lo-system",
      },
      {
        useCaseId: "customer-id-loan-link",
        title: "Customer ID to Loan Linking",
        description:
          "Map customer ID to the loan application for tracking and verification",
        module: "lo-system",
      },
      {
        useCaseId: "loan-appraisal",
        title: "Loan Appraisal System",
        description: "Perform customer credit scoring and financial appraisal",
        module: "lo-system",
      },
      {
        useCaseId: "loan-assessment",
        title: "Loan Assessment Workflow",
        description: "Capture loan application and perform preliminary checks",
        module: "lo-system",
      },
      {
        useCaseId: "recommendation-workflow",
        title: "Recommendation & Sanction Letter",
        description:
          "Review loan details and generate sanction recommendations",
        module: "lo-system",
      },
      {
        useCaseId: "risk-analysis-upload",
        title: "Risk Analysis Documentation",
        description: "Upload signed agreements and perform risk validation",
        module: "lo-system",
      },
      {
        useCaseId: "sanction-disbursement",
        title: "Sanction & Customer Response Tracking",
        description: "Track sanction status and customer acknowledgments",
        module: "lo-system",
      },
      {
        useCaseId: "loan-repayment-schedule",
        title: "Repayment Schedule Generation",
        description: "Generate EMI schedule and repayment tracking data",
        module: "lo-system",
      },
      {
        useCaseId: "terms-conditions-workflow",
        title: "Terms & Conditions Approval",
        description: "Approve and manage loan terms and condition agreements",
        module: "lo-system",
      },
      {
        useCaseId: "asset-details-capture",
        title: "Asset Details Capture",
        description: "Record asset details offered as collateral or security",
        module: "lo-system",
      },
      {
        useCaseId: "limit-check-profile-update",
        title: "Profile Update & Limit Check",
        description: "Update customer info and check applicable credit limits",
        module: "lo-system",
      },
      {
        useCaseId: "account-closure-process",
        title: "Account Closure & Net Worth Analysis",
        description: "Initiate account closure and analyze party's net worth",
        module: "lo-system",
      },

      // FMS
      {
        useCaseId: "asset-details",
        title: "Asset Details",
        description: "Manage and monitor asset-related case information.",
        module: "fm-system",
      },
      {
        useCaseId: "allocation-contract",
        title: "PDC Printing",
        description: "Automated post-dated cheque processing.",
        module: "fm-system",
      },
      {
        useCaseId: "installment-prepayment",
        title: "WF_ Installment Prepayment",
        description: "Handle early repayments and installment adjustments.",
        module: "fm-system",
      },
      {
        useCaseId: "case-reallocation",
        title: "WF_ NPA Grading",
        description: "Non-performing asset classification system.",
        module: "fm-system",
      },
      {
        useCaseId: "npa-provisioning",
        title: "WF_ NPA Provisioning",
        description: "Process provisioning for non-performing assets.",
        module: "fm-system",
      },
      {
        useCaseId: "settlement-knockoff",
        title: "WF_ Settlements - Knock Off",
        description: "Record settlements and update outstanding balances.",
        module: "fm-system",
      },
      {
        useCaseId: "cheque-processing",
        title: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
        description: "Manage cheque-based settlements and payments.",
        module: "fm-system",
      },
      {
        useCaseId: "settlement-advisory",
        title: "WF_ Settlements_Manual Advise",
        description: "Provide manual advisory for payment settlements.",
        module: "fm-system",
      },
      {
        useCaseId: "foreclosure-management",
        title: "WF_ Termination - Foreclosure - Closure",
        description: "Handle early closure and foreclosure of loans.",
        module: "fm-system",
      },
      {
        useCaseId: "finance-viewer",
        title: "WF_FMS_ Finance Viewer",
        description: "View financial metrics and account overviews.",
        module: "fm-system",
      },
      {
        useCaseId: "floating-review",
        title: "WF_FMS_ Floating Review Process",
        description: "Manage reviews for floating-rate financial products.",
        module: "fm-system",
      },
      {
        useCaseId: "daily-workplan",
        title: "WF_FMS_ Settlements - Receipts",
        description: "Automated receipt settlement processing",
        module: "fm-system",
      },
      {
        useCaseId: "settlements-payment",
        title: "WF_FMS_ Settlements_Payment",
        description: "Track and process all types of settlement payments.",
        module: "fm-system",
      },
      {
        useCaseId: "settlements-waiveoff",
        title: "WF_FMS_ Settlements_Waive Off",
        description: "Manage waived-off cases and financial adjustments.",
        module: "fm-system",
      },
      {
        useCaseId: "eod-bod-process",
        title: "WF_FMS_EOD_ BOD",
        description: "Run end-of-day and beginning-of-day operations.",
        module: "fm-system",
      },
      {
        useCaseId: "account-closure",
        title: "Work Flow Closure_Account Closure",
        description: "Close accounts after settlement or full repayment.",
        module: "fm-system",
      },
      {
        useCaseId: "account-status",
        title: "Work Flow Closure_View Account Status",
        description: "Check and track account lifecycle and changes.",
        module: "fm-system",
      },
      {
        useCaseId: "document-master",
        title: "Work Flow_Document Master",
        description: "Manage and define all finance-related documentation.",
        module: "fm-system",
      },
      {
        useCaseId: "bulk-prepayment",
        title: "Work Flow_Finance Rescheduling_Bulk Prepayment",
        description: "Handle bulk prepayment processing and schedules.",
        module: "fm-system",
      },
      {
        useCaseId: "due-date-change",
        title: "Work Flow_Finance Rescheduling_Due Date Change",
        description: "Edit due dates for finance repayments.",
        module: "fm-system",
      },
      {
        useCaseId: "profit-rate-change",
        title: "Work Flow_Finance Rescheduling_Profit Rate Change",
        description: "Adjust profit rates for financial products.",
        module: "fm-system",
      },
      {
        useCaseId: "tenure-change",
        title: "Work Flow_Finance Rescheduling_Tenure Change",
        description: "Modify loan tenures and repayment terms.",
        module: "fm-system",
      },
      {
        useCaseId: "post-disbursal-edit",
        title: "Work Flow_Post Disbursal Edit",
        description: "Amend disbursed loans for corrections or changes.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-constitution",
        title: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
        description: "Manage repayment deferrals by constitution types.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-financewise",
        title: "Work Flow_Repayment Deferral_Finance Wise Deferral",
        description: "Apply deferrals based on finance criteria.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-portfolio",
        title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
        description: "Initiate deferrals across loan portfolios.",
        module: "fm-system",
      },

      // CMS
      {
        useCaseId: "allocation-hold",
        title: "Allocation Hold",
        description:
          "Place delinquent cases on hold based on predefined rules.",
        module: "cm-system",
      },
      {
        useCaseId: "define-allocation-contract",
        title: "Define Allocation Contract",
        description:
          "Upload and manage contracts for delinquent case allocation.",
        module: "cm-system",
      },
      {
        useCaseId: "manual-allocation",
        title: "Manual Allocation",
        description: "Manually assign delinquent cases to collection agents.",
        module: "cm-system",
      },
      {
        useCaseId: "manual-reallocation",
        title: "Manual Reallocation",
        description:
          "Reassign cases based on collector availability and performance.",
        module: "cm-system",
      },
      {
        useCaseId: "bod-process",
        title: "Beginning of Day Process",
        description: "Initialize and prepare daily queue for collections.",
        module: "cm-system",
      },
      {
        useCaseId: "define-queue",
        title: "Define Queue",
        description: "Create and manage delinquent case queues.",
        module: "cm-system",
      },
      {
        useCaseId: "contact-recording",
        title: "Contact Recording",
        description: "Record contact attempts and customer communication logs.",
        module: "cm-system",
      },
      {
        useCaseId: "legal-collections",
        title: "Legal Collections Workflow",
        description: "Initiate and track legal recovery processes.",
        module: "cm-system",
      },
      {
        useCaseId: "prioritize-queue",
        title: "Prioritizing a Queue",
        description: "Set priority for follow-up based on risk and aging.",
        module: "cm-system",
      },
      {
        useCaseId: "communication-mapping",
        title: "Queue Communication Mapping",
        description: "Assign communication templates to specific queues.",
        module: "cm-system",
      },
      {
        useCaseId: "queue-curing",
        title: "Queue Curing",
        description: "Monitor and track cured accounts from delinquency.",
        module: "cm-system",
      },
      {
        useCaseId: "work-plan",
        title: "Collector Work Plan",
        description: "Design and track daily plans for collection agents.",
        module: "cm-system",
      },
    ];

    const finalList: UseCase[] = Array.from({ length: 51 }, (_, idx) => {
      const day = idx + 1;
      const seed = base[idx % base.length];
      return {
        day,
        module: seed.module,
        useCaseId: seed.useCaseId || `usecase-${day}`,
        title: seed.title || `Use Case #${day}`,
        description:
          seed.description ||
          "Business + System scenario with steps, data, validations, and outputs.",
      };
    });

    return finalList;
  }, []);

  const phaseTasks: PhaseTask[] = useMemo(() => {
    const plan: Array<Omit<PhaseTask, "day">> = [
      {
        title: "Integration Setup",
        description: "Project structure, env, API base, auth tokens.",
        tags: ["setup", "env"],
      },
      {
        title: "API Contracts",
        description: "DTOs, schemas, error patterns.",
        tags: ["api", "contracts"],
      },
      {
        title: "UI Components",
        description: "Reusable components (cards, forms, tables).",
        tags: ["ui"],
      },
      {
        title: "State + Data Layer",
        description: "Query patterns, caching, pagination.",
        tags: ["state"],
      },
      {
        title: "Role-Based Access",
        description: "Protected routes, redirects.",
        tags: ["security"],
      },
      {
        title: "Validation + Edge Cases",
        description: "Input validation, empty states.",
        tags: ["quality"],
      },
      {
        title: "Testing",
        description: "Smoke tests + API mocks.",
        tags: ["tests"],
      },
      {
        title: "Deployment",
        description: "Build, CI/CD, monitoring.",
        tags: ["deploy"],
      },
      {
        title: "Documentation",
        description: "README, API docs, demo flow.",
        tags: ["docs"],
      },
    ];

    const tasks: PhaseTask[] = [];
    for (let d = 52; d <= 90; d++) {
      const p = plan[(d - 52) % plan.length];
      tasks.push({
        day: d,
        title: p.title,
        description: p.description,
        tags: p.tags,
      });
    }
    return tasks;
  }, []);

  /** ✅ Book daily plan: 2 topics/day, in index sequence */
  const bookDailyPlan: BookDayPlan[] = useMemo(() => {
    const days: BookDayPlan[] = [];
    let day = 1;
    for (let i = 0; i < BOOK_TOPICS.length; i += 2) {
      days.push({
        day,
        topics: BOOK_TOPICS.slice(i, i + 2),
      });
      day++;
    }
    return days;
  }, []);

  const [tab, setTab] = useState<"usecases" | "integration">("usecases");
  const [viewType, setViewType] = useState<ViewType>("business");
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [moduleFilter, setModuleFilter] = useState<ModuleKey | "all">("all");

  /** ✅ Book plan state */
  const [bookDay, setBookDay] = useState<number>(1);

  const [aiDay, setAiDay] = useState<number>(1);

const aiDayChips = useMemo(() => {
  const days: number[] = [];
  for (let i = 1; i <= dailyAITools30.length; i += 1) days.push(i);
  return days;
}, []);

const selectedAiTool = useMemo(() => {
  return dailyAITools30.find((d) => d.day === aiDay) || dailyAITools30[0];
}, [aiDay]);

  /** ✅ Book modal state */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const maxDay = 90;

  const selectedUseCase = useCases.find((u) => u.day === selectedDay);
  const selectedTask = phaseTasks.find((t) => t.day === selectedDay);
  const isUseCaseDay = selectedDay <= 51;

  const goPrev = useCallback(
    () => setSelectedDay((d) => Math.max(1, d - 1)),
    []
  );
  const goNext = useCallback(
    () => setSelectedDay((d) => Math.min(maxDay, d + 1)),
    []
  );

  const openSelectedUseCase = useCallback(() => {
    if (!selectedUseCase) return;
    navigate(
      `/${selectedUseCase.module}/${selectedUseCase.useCaseId}/${viewType}`
    );
  }, [navigate, selectedUseCase, viewType]);

  const filteredUseCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return useCases.filter((u) => {
      const matchesQuery =
        !q ||
        u.title.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.useCaseId.toLowerCase().includes(q);
      const matchesModule =
        moduleFilter === "all" ? true : u.module === moduleFilter;
      return matchesQuery && matchesModule;
    });
  }, [query, useCases, moduleFilter]);

  const dayChips = useMemo(() => {
    const start = Math.max(1, selectedDay - 7);
    const end = Math.min(maxDay, start + 14);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [selectedDay]);

  const bookDayChips = useMemo(() => {
    const maxBookDay = bookDailyPlan.length;
    const start = Math.max(1, bookDay - 7);
    const end = Math.min(maxBookDay, start + 14);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [bookDay, bookDailyPlan.length]);

  const selectedBookDayPlan = useMemo(() => {
    return bookDailyPlan.find((d) => d.day === bookDay);
  }, [bookDailyPlan, bookDay]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/90dayjobplan";
  }, []);

  const openPreview = useCallback((page: number) => {
    setPreviewPage(page);
    setPreviewOpen(true);
  }, []);

  const previewUrl = useMemo(
    () => getBookPageImageUrl(previewPage),
    [previewPage]
  );

  const changePreviewPageBy = useCallback((delta: number) => {
    setPreviewPage((p) => Math.max(1, Math.min(images.length, p + delta)));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* ✅ Book modal (full screen preview) */}
      <BookPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        page={previewPage}
        url={previewUrl}
        onPrevPage={() => changePreviewPageBy(-1)}
        onNextPage={() => changePreviewPageBy(1)}
      />

      {/* HERO */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-8 sm:pt-14">
        <div
          className="relative overflow-hidden rounded-[36px] border bg-white/90 backdrop-blur-sm"
          style={{
            borderColor: `${C2}66`,
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div className="absolute inset-0" style={{ background: SOFT_BG }} />
          <div
            className="absolute -inset-10 opacity-35 blur-3xl"
            style={{ background: "rgba(144,183,215,0.22)" }}
          />

          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Pill text="90-Day Job Plan" />
                <Pill text="Day 1–51: Use Cases" />
                <Pill text="Day 52–90: Build + Deploy" />
                <Pill text="AI Book: 2 Topics/Day" />
              </div>

              <button
                onClick={handleLogout}
                className="self-start sm:self-auto inline-flex items-center justify-center rounded-2xl border bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Log Out
              </button>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* Left */}
              <div className="lg:col-span-7 min-w-0">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  90 Days → <span style={{ color: C3 }}>Job-Ready</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-prose">
                  Days 1–51: Real BFSI workflows (Business + System). Days
                  52–90: Integration, coding, testing, deployment, documentation
                  — and a complete shipped project.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <PrimaryBtn
                    label="Start Day-1 (Customer ID Creation)"
                    onClick={() => {
                      setTab("usecases");
                      setSelectedDay(1);
                    }}
                  />
                  <SecondaryBtn
                    label="Jump to Build Phase (Day-52)"
                    onClick={() => {
                      setTab("integration");
                      setSelectedDay(52);
                    }}
                  />
                </div>

                <div className="mt-6">
                  <ProgressBar value={selectedDay} max={90} />
                </div>

                {/* Day chips */}
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">
                      Quick day jump
                    </p>
                    <p className="text-xs text-slate-500">
                      Selected: Day {selectedDay}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {dayChips.map((d) => (
                      <DayChip
                        key={d}
                        day={d}
                        active={d === selectedDay}
                        onClick={() => setSelectedDay(d)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-5">
                <SoftCard className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        Current Day
                      </p>
                      <p className="text-lg font-extrabold text-slate-900">
                        Day {selectedDay}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {isUseCaseDay ? "Use Case Day" : "Build & Deploy Day"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-white"
                      style={{ borderColor: `${C2}66`, color: C3 }}
                      aria-hidden="true"
                    >
                      {isUseCaseDay ? "UC" : "BD"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <ToggleBtn
                      active={viewType === "business"}
                      label="Business"
                      onClick={() => setViewType("business")}
                    />
                    <ToggleBtn
                      active={viewType === "system"}
                      label="System"
                      onClick={() => setViewType("system")}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <SecondaryBtn
                      label="Previous"
                      onClick={goPrev}
                      className="w-full"
                    />
                    <PrimaryBtn
                      label="Next"
                      onClick={goNext}
                      className="w-full"
                    />
                  </div>

                  <div
                    className="mt-4 rounded-2xl border bg-white/80 p-4"
                    style={{ borderColor: `${C2}66` }}
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      Today’s focus
                    </p>

                    {isUseCaseDay ? (
                      <>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {selectedUseCase?.title || "Use Case"}
                          </p>
                          {selectedUseCase ? (
                            <ModuleTag module={selectedUseCase.module} />
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {selectedUseCase?.description}
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={openSelectedUseCase}
                            className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                            style={{ background: GRAD }}
                          >
                            Open Day {selectedDay} ({viewType})
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-sm font-bold text-slate-900 truncate">
                          {selectedTask?.title || "Build & Deploy"}
                        </p>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {selectedTask?.description}
                        </p>
                        {selectedTask?.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedTask.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold"
                                style={{
                                  borderColor: `${C2}66`,
                                  color: "#475569",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setTab("usecases")}
                      className={cx(
                        "rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                        tab === "usecases"
                          ? "bg-white"
                          : "bg-white/70 hover:bg-white"
                      )}
                      style={{
                        borderColor: `${C2}66`,
                        color: tab === "usecases" ? C3 : "#64748b",
                      }}
                    >
                      Days 1–51
                    </button>
                    <button
                      onClick={() => setTab("integration")}
                      className={cx(
                        "rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                        tab === "integration"
                          ? "bg-white"
                          : "bg-white/70 hover:bg-white"
                      )}
                      style={{
                        borderColor: `${C2}66`,
                        color: tab === "integration" ? C3 : "#64748b",
                      }}
                    >
                      Days 52–90
                    </button>
                  </div>
                </SoftCard>
              </div>
            </div>
          </div>
        </div>
      </header>

{/* ✅ 30-DAY AI TOOLS PLAN (UPDATED) */}
<section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
  <SoftCard className="overflow-hidden">
    {/* Top hero strip */}
    <div
      className="relative px-5 sm:px-7 py-6"
      style={{
        background: "linear-gradient(135deg, rgba(54,77,105,0.95), rgba(144,183,215,0.92), rgba(23,59,99,0.95))",
      }}
    >
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{ background: "rgba(255,255,255,0.35)" }}
      />
      <div
        className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ background: "rgba(255,255,255,0.28)" }}
      />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold text-white border border-white/20">
              ✅ Top 30 AI Tools
            </span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/15">
              1 Tool / Day
            </span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white border border-white/15">
              Zero → Hero
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Top 30 AI Tools <span className="opacity-95">that change your life</span>
          </h2>
          <p className="mt-1 text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
            From <b>Zero to Hero</b>: learn one tool daily, and open the tool to build real skills fast.
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setAiDay((d) => Math.max(1, d - 1))}
            className="rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setAiDay((d) => Math.min(dailyAITools30.length, d + 1))}
            className="rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold"
            style={{ color: C3 }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 sm:p-6">
      {/* Day chips */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">Pick your tool day</p>
        <p className="text-xs text-slate-500">
          Selected: <span className="font-bold" style={{ color: C3 }}>Day {aiDay}</span>
        </p>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {aiDayChips.map((d) => (
          <DayChip
            key={d}
            day={d}
            prefix="Day"
            active={d === aiDay}
            onClick={() => setAiDay(d)}
          />
        ))}
      </div>

      {/* Selected day content */}
      <div
        className="mt-5 rounded-[28px] border bg-white/85 p-5 sm:p-6"
        style={{
          borderColor: `${C2}66`,
          boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full border bg-white/70 px-3 py-1 text-xs font-extrabold"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Day {selectedAiTool.day}
              </span>

              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${C3}14`, color: C3 }}
              >
                {selectedAiTool.category}
              </span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {selectedAiTool.tool}
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
              {selectedAiTool.content}
            </p>
          </div>

          {/* Right */}
          <div className="w-full lg:w-[260px] flex flex-col gap-2">
            <button
              onClick={() => window.open(selectedAiTool.link, "_blank")}
              className="w-full rounded-2xl px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-95 active:scale-[0.99]"
              style={{ background: GRAD }}
            >
              Open Tool ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  </SoftCard>
</section>

      {/* TOOLBAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <SoftCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {tab === "usecases"
                  ? "Days 1–51: Use Cases"
                  : "Days 52–90: Build & Deploy"}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                {tab === "usecases"
                  ? "Search & open Business/System. Modules: LOS / FMS / CMS"
                  : "39-day build phase: integration, code, tests, deploy, docs."}
              </p>
            </div>

            {tab === "usecases" ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search use cases…"
                  className="w-full sm:w-[320px] rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ borderColor: `${C2}66` }}
                />

                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value as any)}
                  className="w-full sm:w-[160px] rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ borderColor: `${C2}66`, color: "#0f172a" }}
                >
                  <option value="all">All Modules</option>
                  <option value="lo-system">LOS</option>
                  <option value="fm-system">FMS</option>
                  <option value="cm-system">CMS</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SecondaryBtn
                  label="Go Day-51"
                  onClick={() => setSelectedDay(51)}
                />
                <PrimaryBtn
                  label="Go Day-52"
                  onClick={() => setSelectedDay(52)}
                />
              </div>
            )}
          </div>
        </SoftCard>
      </section>

      {/* CONTENT */}
      {tab === "usecases" ? (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUseCases.map((u) => {
              const selected = u.day === selectedDay;
              return (
                <div
                  key={u.day}
                  className={cx(
                    "group relative overflow-hidden rounded-3xl border bg-white/90 backdrop-blur-sm transition",
                    "hover:shadow-xl"
                  )}
                  style={{
                    borderColor: selected ? `${C3}55` : `${C2}66`,
                    boxShadow: selected
                      ? "0 22px 60px rgba(23,59,99,0.12)"
                      : "0 14px 34px rgba(15,23,42,0.06)",
                  }}
                  tabIndex={0}
                >
                  <div
                    className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                                   radial-gradient(circle at 80% 70%, ${C3}1f, transparent 60%)`,
                    }}
                  />

                  <div className="relative p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                      >
                        Day {u.day}
                      </span>
                      <ModuleTag module={u.module} />
                    </div>

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                      {u.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {u.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedDay(u.day);
                          navigate(`/${u.module}/${u.useCaseId}/business`);
                        }}
                        className="rounded-2xl border bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                      >
                        Business
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDay(u.day);
                          navigate(`/${u.module}/${u.useCaseId}/system`);
                        }}
                        className="rounded-2xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        style={{ background: GRAD }}
                      >
                        System
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedDay(u.day)}
                      className="mt-3 w-full rounded-2xl border bg-white/70 px-4 py-2 text-xs font-semibold transition hover:bg-white"
                      style={{
                        borderColor: `${C2}66`,
                        color: selected ? C3 : "#334155",
                      }}
                    >
                      {selected ? "Selected Day" : "Set as Current Day"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <SoftCard className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    After Day-51
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    Days 52–90: Integration + Write Code + Deployment
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    You will combine everything learned and ship an end-to-end
                    project.
                  </p>
                </div>
                <PrimaryBtn
                  label="Go to Day-52"
                  onClick={() => {
                    setTab("integration");
                    setSelectedDay(52);
                  }}
                />
              </div>
            </SoftCard>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {phaseTasks.map((t) => {
              const selected = t.day === selectedDay;
              return (
                <div
                  key={t.day}
                  className="group relative overflow-hidden rounded-3xl border bg-white/90 backdrop-blur-sm transition hover:shadow-xl"
                  style={{
                    borderColor: selected ? `${C3}55` : `${C2}66`,
                    boxShadow: selected
                      ? "0 22px 60px rgba(23,59,99,0.12)"
                      : "0 14px 34px rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                                   radial-gradient(circle at 80% 70%, ${C3}1f, transparent 60%)`,
                    }}
                  />

                  <div className="relative p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                      >
                        Day {t.day}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: `${C3}14`, color: C3 }}
                      >
                        BUILD
                      </span>
                    </div>

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {t.description}
                    </p>

                    {t.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold"
                            style={{ borderColor: `${C2}66`, color: "#475569" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <button
                      onClick={() => setSelectedDay(t.day)}
                      className="mt-auto pt-4 w-full"
                    >
                      <span
                        className="inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                        style={{ background: GRAD }}
                      >
                        {selected ? "Selected Day" : "Set as Current Day"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div
              className="relative rounded-[36px] overflow-hidden p-6 sm:p-8"
              style={{ background: GRAD }}
            >
              <div
                className="absolute -inset-10 opacity-35 blur-3xl"
                style={{ background: "rgba(255,255,255,0.20)" }}
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                    Day-90: Final Deployment + Demo + Portfolio
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-white/85">
                    Deploy your app, record a demo, publish documentation, and
                    showcase proof-of-skill.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(90)}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm sm:text-base font-semibold transition hover:shadow-xl active:scale-[0.99]"
                  style={{ color: C3 }}
                >
                  Go to Day-90
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <WhatsAppJoinCard />

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} ASKOXY.AI • 90-Day Job Plan
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill text="Daily" />
              <Pill text="Practical" />
              <Pill text="Proof of Skill" />
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-4">
        <div
          className="rounded-2xl border bg-white/95 backdrop-blur-md shadow-2xl"
          style={{ borderColor: `${C2}66` }}
        >
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Day {selectedDay} • {isUseCaseDay ? "Use Case" : "Build"}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                {isUseCaseDay ? selectedUseCase?.title : selectedTask?.title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Prev
              </button>

              <button
                onClick={goNext}
                className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Next
              </button>

              <button
                onClick={() => {
                  if (!isUseCaseDay) return;
                  openSelectedUseCase();
                }}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
                style={{ background: GRAD, opacity: isUseCaseDay ? 1 : 0.6 }}
                disabled={!isUseCaseDay}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
