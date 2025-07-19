// import React, {
//   memo,
//   type ComponentPropsWithoutRef,
//   type DetailedHTMLProps,
//   type AnchorHTMLAttributes,
//   type ImgHTMLAttributes,
// } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// interface Props {
//   content: string;
//   className?: string;
// }

// const MarkdownRenderer: React.FC<Props> = memo(
//   ({ content, className = "" }) => {
//     const CodeBlock = ({
//       inline,
//       className,
//       children,
//       ...props
//     }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
//       return (
//         <code
//           className={`${
//             inline
//               ? "rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-300 px-1 py-0.5 text-sm font-mono"
//               : "block bg-[#f9f9f9] dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-100 px-4 py-3 my-4 rounded-lg text-sm font-mono overflow-x-auto shadow-sm"
//           }`}
//           {...props}
//         >
//           {children}
//         </code>
//       );
//     };

//     const LinkRenderer = ({
//       href,
//       children,
//       ...rest
//     }: DetailedHTMLProps<
//       AnchorHTMLAttributes<HTMLAnchorElement>,
//       HTMLAnchorElement
//     >) => {
//       const isExternal = href?.startsWith("http");
//       return (
//         <a
//           href={href}
//           target={isExternal ? "_blank" : undefined}
//           rel={isExternal ? "noopener noreferrer" : undefined}
//           className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
//           {...rest}
//         >
//           {children}
//           {isExternal && <span className="ml-1 text-xs">↗</span>}
//         </a>
//       );
//     };

//     const ImageRenderer = ({
//       src,
//       alt,
//     }: ImgHTMLAttributes<HTMLImageElement>) => (
//       <div className="my-6 text-center">
//         <img
//           src={src || ""}
//           alt={alt || ""}
//           className="max-w-full h-auto rounded-xl shadow-md border border-gray-300 dark:border-gray-700"
//           loading="lazy"
//         />
//         {alt && (
//           <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
//             {alt}
//           </p>
//         )}
//       </div>
//     );

//     return (
//       <div
//         className={`prose prose-base sm:prose-lg lg:prose-xl max-w-none dark:prose-invert break-words text-gray-800 dark:text-gray-100 ${className}`}
//       >
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           rehypePlugins={[rehypeHighlight]}
//           components={{
//             h1: ({ children }) => (
//               <h1 className="text-3xl font-bold mt-10 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
//                 {children}
//               </h1>
//             ),
//             h2: ({ children }) => (
//               <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
//             ),
//             h3: ({ children }) => (
//               <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
//             ),
//             h4: ({ children }) => (
//               <h4 className="text-lg font-semibold mt-5 mb-2">{children}</h4>
//             ),
//             h5: ({ children }) => (
//               <h5 className="text-base font-semibold mt-4 mb-1">{children}</h5>
//             ),
//             h6: ({ children }) => (
//               <h6 className="text-sm font-medium mt-3 mb-1 text-gray-500 dark:text-gray-400">
//                 {children}
//               </h6>
//             ),
//             p: ({ children }) => (
//               <p className="leading-relaxed text-[16px] text-gray-800 dark:text-gray-200 mb-4">
//                 {children}
//               </p>
//             ),
//             strong: ({ children }) => (
//               <strong className="font-bold">{children}</strong>
//             ),
//             em: ({ children }) => <em className="italic">{children}</em>,
//             del: ({ children }) => (
//               <del className="line-through">{children}</del>
//             ),
//             blockquote: ({ children }) => (
//               <blockquote className="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-gray-800/40 p-4 my-4 italic text-gray-700 dark:text-gray-300 rounded-r-md">
//                 {children}
//               </blockquote>
//             ),
//             ul: ({ children }) => (
//               <ul className="list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200">
//                 {children}
//               </ul>
//             ),
//             ol: ({ children }) => (
//               <ol className="list-decimal ml-6 space-y-1 text-gray-800 dark:text-gray-200">
//                 {children}
//               </ol>
//             ),
//             li: ({ children }) => (
//               <li className="leading-relaxed">{children}</li>
//             ),
//             code: CodeBlock,
//             a: LinkRenderer,
//             img: ImageRenderer,
//             table: ({ children }) => (
//               <div className="overflow-x-auto my-6">
//                 <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg">
//                   {children}
//                 </table>
//               </div>
//             ),
//             thead: ({ children }) => (
//               <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
//                 {children}
//               </thead>
//             ),
//             tbody: ({ children }) => (
//               <tbody className="bg-white dark:bg-gray-800/60">{children}</tbody>
//             ),
//             tr: ({ children }) => (
//               <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
//                 {children}
//               </tr>
//             ),
//             th: ({ children }) => (
//               <th className="px-4 py-2 font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-left">
//                 {children}
//               </th>
//             ),
//             td: ({ children }) => (
//               <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
//                 {children}
//               </td>
//             ),
//             input: ({ type, checked, ...props }) =>
//               type === "checkbox" ? (
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   disabled
//                   className="mr-2 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
//                   {...props}
//                 />
//               ) : (
//                 <input type={type} {...props} />
//               ),
//           }}
//         >
//           {content}
//         </ReactMarkdown>
//       </div>
//     );
//   }
// );

// export default MarkdownRenderer;





import React, {
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
    const CodeBlock = ({
      inline,
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
      const copyToClipboard = () => {
        navigator.clipboard.writeText(String(children));
      };

      return inline ? (
        <code className="rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-300 px-1 py-0.5 text-sm font-mono">
          {children}
        </code>
      ) : (
        <div className="relative group my-4">
          <pre className="bg-[#f9f9f9] dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-100 px-4 py-3 rounded-xl shadow-sm overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            <code {...props} className="break-words">
              {children}
            </code>
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 hidden group-hover:inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded transition hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Copy code"
            title="Copy code"
          >
            Copy
          </button>
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
          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          {...rest}
        >
          {children}
          {isExternal && <span className="ml-1 text-xs">↗</span>}
        </a>
      );
    };

    const ImageRenderer = ({
      src,
      alt,
    }: ImgHTMLAttributes<HTMLImageElement>) => (
      <div className="my-6 flex justify-center">
        <img
          src={src || ""}
          alt={alt || ""}
          className="max-w-full h-auto rounded-lg border shadow-md dark:border-gray-700"
          loading="lazy"
        />
        {alt && (
          <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400 italic">
            {alt}
          </p>
        )}
      </div>
    );

    return (
      <div
        className={`prose prose-sm sm:prose-base lg:prose-lg max-w-full dark:prose-invert break-words text-gray-800 dark:text-gray-100 ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-10 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-semibold mt-5 mb-2">{children}</h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-base font-semibold mt-4 mb-1">{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-sm font-medium mt-3 mb-1 text-gray-500 dark:text-gray-400">
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p className="leading-relaxed text-[16px] text-gray-800 dark:text-gray-200 mb-4">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            del: ({ children }) => (
              <del className="line-through">{children}</del>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-800/30 p-4 my-4 italic text-gray-700 dark:text-gray-300 rounded-r-md">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 space-y-1 text-gray-800 dark:text-gray-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            code: CodeBlock,
            a: LinkRenderer,
            img: ImageRenderer,
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="bg-white dark:bg-gray-800/50">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 font-medium border-r border-gray-200 dark:border-gray-700 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border-r border-gray-200 dark:border-gray-700">
                {children}
              </td>
            ),
            input: ({ type, checked, ...props }) =>
              type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 text-blue-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
                  {...props}
                />
              ) : (
                <input type={type} {...props} />
              ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

export default MarkdownRenderer;
