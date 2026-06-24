import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export type RadhAIMessageTheme = "user" | "assistant-light" | "assistant-dark";

const THEMES = {
  user: {
    link: "text-cyan-200 underline underline-offset-2 hover:text-cyan-100 break-all font-medium",
    bold: "font-bold text-white",
    em: "italic text-indigo-100",
    code: "rounded px-1 py-0.5 text-[0.9em] font-mono bg-white/20 text-cyan-100",
  },
  "assistant-light": {
    link: "text-indigo-600 underline underline-offset-2 hover:text-indigo-800 break-all font-medium",
    bold: "font-semibold text-slate-900",
    em: "italic text-slate-600",
    code: "rounded px-1 py-0.5 text-[0.9em] font-mono bg-slate-100 text-indigo-700",
  },
  "assistant-dark": {
    link: "text-[#5CE1E6] underline underline-offset-2 hover:text-[#B8FF5E] break-all font-medium",
    bold: "font-semibold text-[#F7FAFF]",
    em: "italic text-[#B8C2D8]",
    code: "rounded px-1 py-0.5 text-[0.9em] font-mono bg-[#5CE1E6]/15 text-[#5CE1E6]",
  },
} as const;

const INLINE_RE =
  /(\[([^\]]+)\]\(([^)]+)\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s<>,\)]+)/g;

function buildMarkdownComponents(theme: RadhAIMessageTheme): Components {
  const t = THEMES[theme];
  return {
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className={t.link}>
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className={t.bold}>{children}</strong>,
    em: ({ children }) => <em className={t.em}>{children}</em>,
    code: ({ children }) => <code className={t.code}>{children}</code>,
    p: ({ children }) => (
      <p className="whitespace-pre-wrap [&:not(:last-child)]:mb-2">{children}</p>
    ),
  };
}

export function renderFormattedPlainText(
  text: string,
  theme: RadhAIMessageTheme,
): React.ReactNode {
  const t = THEMES[theme];
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));

    const raw = m[0];

    if (raw.startsWith("`")) {
      parts.push(
        <code key={key++} className={t.code}>
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (raw.startsWith("**")) {
      parts.push(
        <strong key={key++} className={t.bold}>
          {raw.slice(2, -2)}
        </strong>,
      );
    } else if (raw.startsWith("*")) {
      parts.push(
        <em key={key++} className={t.em}>
          {raw.slice(1, -1)}
        </em>,
      );
    } else if (raw.startsWith("[")) {
      parts.push(
        <a key={key++} href={m[3]} target="_blank" rel="noopener noreferrer" className={t.link}>
          {m[2]}
        </a>,
      );
    } else if (/^https?:\/\//.test(raw)) {
      parts.push(
        <a key={key++} href={raw} target="_blank" rel="noopener noreferrer" className={t.link}>
          {raw}
        </a>,
      );
    }

    last = m.index + raw.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 0 ? text : parts;
}

type RadhAIMessageContentProps = {
  text: string;
  theme: RadhAIMessageTheme;
  asMarkdown?: boolean;
  className?: string;
};

export function RadhAIMessageContent({
  text,
  theme,
  asMarkdown = false,
  className,
}: RadhAIMessageContentProps) {
  const components = useMemo(() => buildMarkdownComponents(theme), [theme]);

  if (asMarkdown) {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {text}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <span className={className}>
      {renderFormattedPlainText(text, theme)}
    </span>
  );
}
