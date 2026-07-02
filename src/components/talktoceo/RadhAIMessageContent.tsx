import React, { useMemo, useState } from "react";
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
    heading: "text-white",
    blockquoteBorder: "border-white/40",
    blockquoteText: "text-indigo-100",
    hr: "border-white/20",
    tableBorder: "border-white/20",
    tableHeadBg: "bg-white/10",
    codeBlockBg: "bg-black/25",
    codeBlockHeader: "bg-black/20 text-indigo-100",
    codeBlockText: "text-indigo-50",
  },
  "assistant-light": {
    link: "text-indigo-600 underline underline-offset-2 hover:text-indigo-800 break-all font-medium",
    bold: "font-semibold text-slate-900",
    em: "italic text-slate-600",
    code: "rounded px-1 py-0.5 text-[0.9em] font-mono bg-slate-100 text-indigo-700",
    heading: "text-slate-900",
    blockquoteBorder: "border-slate-300",
    blockquoteText: "text-slate-600",
    hr: "border-slate-200",
    tableBorder: "border-slate-200",
    tableHeadBg: "bg-slate-50",
    codeBlockBg: "bg-slate-900",
    codeBlockHeader: "bg-black/20 text-slate-300",
    codeBlockText: "text-slate-100",
  },
  "assistant-dark": {
    link: "text-[#5CE1E6] underline underline-offset-2 hover:text-[#B8FF5E] break-all font-medium",
    bold: "font-semibold text-[#F7FAFF]",
    em: "italic text-[#B8C2D8]",
    code: "rounded px-1 py-0.5 text-[0.9em] font-mono bg-[#5CE1E6]/15 text-[#5CE1E6]",
    heading: "text-[#F7FAFF]",
    blockquoteBorder: "border-[#5CE1E6]/40",
    blockquoteText: "text-[#B8C2D8]",
    hr: "border-white/10",
    tableBorder: "border-white/10",
    tableHeadBg: "bg-white/5",
    codeBlockBg: "bg-black/30",
    codeBlockHeader: "bg-black/20 text-[#5CE1E6]",
    codeBlockText: "text-[#5CE1E6]",
  },
} as const;

const INLINE_RE =
  /(\[([^\]]+)\]\(([^)]+)\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s<>,\)]+)/g;

// Unicode glyphs that LLMs sometimes emit as plain-text "bullets" instead of
// real markdown list syntax ("- text"). None of these are valid CommonMark
// list markers, so without this normalization remark renders them as their
// own disconnected paragraph.
const BULLET_GLYPHS = ["•", "●", "○", "▪", "▫", "◦", "‣", "∙"];
const BULLET_GLYPH_CLASS = BULLET_GLYPHS.join("");

// Characters that are invisible or near-invisible but are NOT stripped by
// String.prototype.trim() — zero-width joiners/spaces, BOM, and NBSP.
// Indic-script text pipelines (Telugu, Hindi, etc.) sometimes leave these
// behind on otherwise-empty lines, which makes a line that LOOKS blank
// fail a plain `line.trim() === ""` check, so it doesn't get collapsed
// with adjacent blank lines and ends up rendered as its own near-empty
// paragraph with its own margin — producing a much bigger visual gap than
// the content actually calls for.
const INVISIBLE_CHARS_RE = /[\u200B-\u200F\uFEFF\u00A0]/g;

function isBlankLine(line: string): boolean {
  return line.replace(INVISIBLE_CHARS_RE, "").trim() === "";
}

/**
 * Collapses any run of consecutive "blank-ish" lines (truly empty, or only
 * whitespace/invisible characters) down to exactly one blank line. This is
 * more robust than a simple `/\n{3,}/g` regex collapse because it treats
 * lines containing stray invisible characters the same as genuinely empty
 * lines, instead of letting them slip through as their own block.
 */
function collapseBlankishLines(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let prevWasBlank = false;

  for (const line of lines) {
    const blank = isBlankLine(line);
    if (blank) {
      if (!prevWasBlank) result.push("");
      prevWasBlank = true;
    } else {
      result.push(line);
      prevWasBlank = false;
    }
  }

  return result.join("\n");
}

/**
 * Rewrites plain-text bullet glyphs into real markdown list syntax.
 * Handles two shapes seen from the model:
 *   1. "• text on the same line"            -> "- text on the same line"
 *   2. "•" alone on its own line, blank
 *      line(s), then the sentence below     -> "- the sentence below"
 */
function convertPseudoBullets(text: string): string {
  const withInlinePrefixFixed = text
    .split("\n")
    .map((line) =>
      line.replace(
        new RegExp(`^([ \\t]*)[${BULLET_GLYPH_CLASS}][ \\t]+(?=\\S)`),
        "$1- ",
      ),
    )
    .join("\n");

  const lines = withInlinePrefixFixed.split("\n");
  const isBulletOnly = (line: string) => BULLET_GLYPHS.includes(line.trim());
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (isBulletOnly(line)) {
      let j = i + 1;
      while (j < lines.length && isBlankLine(lines[j])) j++;

      if (j < lines.length && lines[j].trim() !== "") {
        const contentLines: string[] = [lines[j].trim()];
        let k = j + 1;
        while (k < lines.length && !isBlankLine(lines[k]) && !isBulletOnly(lines[k])) {
          contentLines.push(lines[k].trim());
          k++;
        }
        result.push(`- ${contentLines.join(" ")}`);
        i = k;
        continue;
      }
    }
    result.push(line);
    i++;
  }

  return result.join("\n");
}

/**
 * Removes blank lines that sit directly between two list-item lines so
 * bullet/numbered lists render as a tight, compact list instead of a loose
 * list with extra paragraph spacing between every item.
 */
function tightenListSpacing(text: string): string {
  const lines = text.split("\n");
  const isListLine = (line: string) => /^[ \t]*([-*+]\s|\d+\.\s)/.test(line);
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isBlankLine(line)) {
      const prev = result[result.length - 1];
      const next = lines[i + 1];
      if (prev !== undefined && isListLine(prev) && next !== undefined && isListLine(next)) {
        continue;
      }
    }
    result.push(line);
  }

  return result.join("\n");
}

/**
 * Joins runs of short "Label: value" style lines (e.g. a contact card:
 * "Phone: ...", blank, "Email: ...") that are separated by a single blank
 * line into one tight block using a soft line break, instead of each line
 * becoming its own <p> with its own margin. Genuine prose paragraphs,
 * bullets, headings, and code fences are left untouched.
 */
function joinShortFieldLines(text: string): string {
  const lines = text.split("\n");

  const isShortFieldLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^(#{1,6}\s|[-*+]\s|\d+\.\s|>|```)/.test(trimmed)) return false;
    return trimmed.length <= 80;
  };

  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = result[result.length - 1];
    const next = lines[i + 1];
    const prevIsField = prev !== undefined && isShortFieldLine(prev);
    const nextIsField = next !== undefined && isShortFieldLine(next);

    if (isBlankLine(line) && prevIsField && nextIsField) {
      continue;
    }
    result.push(line);
  }

  return result.join("\n");
}

/**
 * Collapses noisy formatting from LLM output so it renders like a normal
 * chat response instead of a stack of disconnected paragraphs and floating
 * bullet glyphs.
 */
function normalizeMarkdown(text: string): string {
  if (!text) return text;

  let result = convertPseudoBullets(text);
  result = collapseBlankishLines(result);
  result = tightenListSpacing(result);
  result = joinShortFieldLines(result);

  return result;
}

function CodeBlock({
  className,
  children,
  theme,
}: {
  className?: string;
  children: React.ReactNode;
  theme: RadhAIMessageTheme;
}) {
  const [copied, setCopied] = useState(false);
  const t = THEMES[theme];
  const lang = /language-(\w+)/.exec(className || "")?.[1] || "";
  const codeText = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={`my-2 overflow-hidden rounded-lg text-left ${t.codeBlockBg}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 text-[0.7em] ${t.codeBlockHeader}`}>
        <span className="font-mono uppercase tracking-wide opacity-70">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-semibold opacity-70 transition hover:opacity-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 text-[0.85em] leading-relaxed">
        <code className={`font-mono ${t.codeBlockText}`}>{codeText}</code>
      </pre>
    </div>
  );
}

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
    // The sibling selectors below zero out the top margin of a list that
    // directly follows a lead-in line (e.g. "Here's how it works:") so the
    // intro line and its list read as one tight group instead of two
    // loosely related blocks.
    p: ({ children }) => (
      <p className="whitespace-pre-wrap leading-6 [&:not(:last-child)]:mb-3 [&+ul]:mt-0 [&+ol]:mt-0">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className={`mb-2 mt-3 text-[1.2em] font-bold first:mt-0 ${t.heading}`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={`mb-2 mt-3 text-[1.12em] font-bold first:mt-0 ${t.heading}`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className={`mb-1.5 mt-2.5 text-[1.05em] font-semibold first:mt-0 ${t.heading}`}>{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className={`mb-1 mt-2 text-[1em] font-semibold first:mt-0 ${t.heading}`}>{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className={`mb-1 mt-2 text-[0.95em] font-semibold first:mt-0 ${t.heading}`}>{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className={`mb-1 mt-2 text-[0.9em] font-semibold uppercase tracking-wide first:mt-0 ${t.heading}`}>
        {children}
      </h6>
    ),
    ul: ({ children }) => (
      <ul className="my-1 ml-5 list-disc space-y-1 [&:not(:last-child)]:mb-3">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-1 ml-5 list-decimal space-y-1 [&:not(:last-child)]:mb-3">{children}</ol>
    ),
    li: ({ children }) => <li className="pl-0.5 leading-6">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        className={`my-2 border-l-2 pl-3 italic ${t.blockquoteBorder} ${t.blockquoteText}`}
      >
        {children}
      </blockquote>
    ),
    hr: () => <hr className={`my-3 border-t ${t.hr}`} />,
    table: ({ children }) => (
      <div className="my-2 overflow-x-auto">
        <table className={`w-full border-collapse text-[0.92em] ${t.tableBorder}`}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className={t.tableHeadBg}>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className={`border-b ${t.tableBorder}`}>{children}</tr>,
    th: ({ children }) => <th className="px-2 py-1.5 text-left font-semibold">{children}</th>,
    td: ({ children }) => <td className="px-2 py-1.5 align-top">{children}</td>,
    // Block-level <pre> is unwrapped here; CodeBlock below renders its own
    // <pre>, so the default react-markdown <pre> wrapper would just double up.
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const codeText = String(children);
      const isBlock = /language-(\w+)/.test(className || "") || codeText.includes("\n");
      if (isBlock) {
        return (
          <CodeBlock className={className} theme={theme}>
            {children}
          </CodeBlock>
        );
      }
      return <code className={t.code}>{children}</code>;
    },
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
  const normalizedText = useMemo(() => normalizeMarkdown(text), [text]);

  if (asMarkdown) {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {normalizedText}
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