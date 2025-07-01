// // src/components/MarkdownRenderer.tsx
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css"; // 👈 Use a dark-friendly theme

// interface Props {
//   content: string;
// }

// const MarkdownRenderer: React.FC<Props> = ({ content }) => {
//   return (
//     <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-pre:bg-[#1e1e1e] prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4">
//       <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeHighlight]}
//       />
//     </div>
//   );
// };

// export default MarkdownRenderer;


import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ImgHTMLAttributes,
} from "react";

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const code = String(children).replace(/\n$/, "");

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopiedIndex(node.position?.start.offset || 0);
      setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative group">
        <pre className={className} {...props}>
          <code>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
          {copiedIndex === node.position?.start.offset ? "Copied!" : "Copy"}
        </button>
      </div>
    );
  };

  const LinkRenderer = (
    props: DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
  ) => {
    const { href, children, ...rest } = props;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline hover:text-blue-400 transition-colors duration-200"
        {...rest}
      >
        {children}
      </a>
    );
  };

  return (
    <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-pre:bg-[#1e1e1e] prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mt-4 mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-3 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-white mt-2 mb-1">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold text-white mt-2 mb-1">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-white mt-2 mb-1">
              {children}
            </h6>
          ),

          // Text
          p: ({ children }) => (
            <p className="mb-3 text-gray-200 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-300">{children}</em>
          ),
          br: () => <br />,
          hr: () => <hr className="my-4 border-gray-600" />,

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 text-gray-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 text-gray-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4 text-gray-300">{children}</li>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-3">
              {children}
            </blockquote>
          ),

          // Code
          code: CodeBlock,

          // Links
          a: LinkRenderer,

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border border-gray-600 text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-700">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-600">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="py-2 px-3 font-semibold text-white border border-gray-600">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2 px-3 text-gray-300 border border-gray-600">
              {children}
            </td>
          ),

          // Images
          img: ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => (
            <img
              src={src || ""}
              alt={alt || ""}
              className="max-w-full rounded-lg my-4"
            />
          ),
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;






// import React, { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// interface Props {
//   content: string;
// }

// const MarkdownRenderer: React.FC<Props> = ({ content }) => {
//   // Helper function to copy text to clipboard
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       alert("Code copied to clipboard!");
//     });
//   };

//   return (
//     <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-pre:bg-[#1e1e1e] prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4 relative">
//       <ReactMarkdown
//         children={content}
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeHighlight]}
//         components={{
//           code: (props) => {
//             // Use the type from react-markdown for correct typing
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             const { inline, className, children, node, ref, ...rest } = props as any;
//             const match = /language-(\w+)/.exec(className || "");
//             const language = match ? match[1] : "";

//             if (inline) {
//               // Inline code, just render normally
//               return (
//                 <code className={className} {...rest}>
//                   {children}
//                 </code>
//               );
//             }

//             // For code blocks, render with copy button and language label
//             return (
//               <div className="relative group">
//                 <pre
//                   className={className + " rounded-lg p-4 overflow-x-auto"}
//                   {...rest}
//                 >
//                   <code>{children}</code>
//                 </pre>

//                 {/* Language label */}
//                 {language && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: 8,
//                       right: 8,
//                       backgroundColor: "#333",
//                       color: "#fff",
//                       padding: "2px 8px",
//                       borderRadius: "4px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       userSelect: "none",
//                     }}
//                   >
//                     {language.toUpperCase()}
//                   </span>
//                 )}

//                 {/* Copy button */}
//                 <button
//                   onClick={() => copyToClipboard((children ?? "").toString())}
//                   style={{
//                     position: "absolute",
//                     top: 8,
//                     right: language ? 70 : 8, // leave space if language label exists
//                     backgroundColor: "#4a90e2",
//                     border: "none",
//                     color: "white",
//                     padding: "4px 8px",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                     fontSize: "12px",
//                     userSelect: "none",
//                     opacity: 0.8,
//                     transition: "opacity 0.2s",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
//                   onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
//                   aria-label="Copy code"
//                 >
//                   Copy
//                 </button>
//               </div>
//             );
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default MarkdownRenderer;
