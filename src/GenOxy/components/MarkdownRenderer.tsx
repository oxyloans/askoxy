import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  type ComponentPropsWithoutRef,
  type DetailedHTMLProps,
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = memo(
  ({ content, className = "" }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = useCallback(async (code: string, blockId: string) => {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedId(blockId);
      } catch {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = code;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "-9999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);

          if (successful) setCopiedId(blockId);
          else console.error("Fallback copy failed");
        } catch (fallbackError) {
          console.error("Copy failed:", fallbackError);
        }
      } finally {
        setTimeout(() => setCopiedId(null), 2000);
      }
    }, []);

    const CodeBlock = ({
      inline,
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
      const code = String(children).replace(/\n$/, "");
      const language = className?.replace("language-", "") || "";

      const blockId = useMemo(() => {
        return `code-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      }, [code]);

      if (inline) {
        return (
          <code
            className="bg-gray-800 text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <div className="relative group my-4">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-600">
            {language && (
              <span className="text-xs text-gray-400 font-mono uppercase">
                {language}
              </span>
            )}
            <button
              onClick={() => handleCopy(code, blockId)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Copy code to clipboard"
              disabled={copiedId === blockId}
            >
              {copiedId === blockId ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre
            className="bg-[#1e1e1e] text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm leading-relaxed"
            {...props}
          >
            <code>{children}</code>
          </pre>
        </div>
      );
    };

    const LinkRenderer = ({
      href,
      children,
      ...rest
    }: DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200"
          {...rest}
        >
          {children}
          {isExternal && (
            <span className="inline-block ml-1 text-xs" aria-hidden>
              ↗
            </span>
          )}
        </a>
      );
    };

    const ImageRenderer = ({
      src,
      alt,
    }: ImgHTMLAttributes<HTMLImageElement>) => (
      <div className="my-6">
        <img
          src={src || ""}
          alt={alt || ""}
          className="max-w-full h-auto rounded-lg shadow-lg border border-gray-600"
          loading="lazy"
        />
        {alt && (
          <p className="text-sm text-gray-400 italic mt-2 text-center">{alt}</p>
        )}
      </div>
    );

    return (
      <div
        className={`prose prose-sm max-w-none break-words dark:prose-invert ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-600">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-white mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-100 mt-5 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-semibold text-gray-200 mt-4 mb-2">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-base font-semibold text-gray-300 mt-3 mb-1">
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-sm font-medium text-gray-400 mt-2 mb-1">
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-gray-200 leading-relaxed">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-300">{children}</em>
            ),
            del: ({ children }) => (
              <del className="line-through text-gray-500">{children}</del>
            ),
            hr: () => <hr className="my-6 border-gray-600" />,
            ul: ({ children, ...props }) => (
              <ul
                className="list-disc list-outside ml-6 mb-4 text-gray-200 space-y-1"
                {...props}
              >
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol
                className="list-decimal list-outside ml-6 mb-4 text-gray-200 space-y-1"
                {...props}
              >
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-300 leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 bg-gray-800/30 pl-4 py-2 italic text-gray-300 my-4 rounded-r">
                {children}
              </blockquote>
            ),
            code: CodeBlock,
            a: LinkRenderer,
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-lg border border-gray-600">
                <table className="w-full text-left">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-700">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="bg-gray-800/50">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-gray-600 hover:bg-gray-700/30 transition-colors">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="py-3 px-4 font-semibold text-white border-r border-gray-600 last:border-r-0">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="py-3 px-4 text-gray-300 border-r border-gray-600 last:border-r-0">
                {children}
              </td>
            ),
            img: ImageRenderer,
            input: ({ type, checked, ...props }) =>
              type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  {...props}
                />
              ) : (
                <input type={type} {...props} />
              ),
          }}
        >
          {content}
        </ReactMarkdown>
        {/* Aria live region for copy confirmation */}
        <span className="sr-only" aria-live="polite">
          {copiedId ? "Code copied to clipboard" : ""}
        </span>
      </div>
    );
  }
);

export default MarkdownRenderer;
