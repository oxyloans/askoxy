export const parseMarkdown = (text: string) => {
  if (!text) return text;

  return (
    text
      // Code block
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto text-sm"><code>$1</code></pre>'
      )
      // Inline code
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>'
      )
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>'
      )
      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 pl-4 italic text-gray-600 dark:text-gray-300 my-2">$1</blockquote>'
      )
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Unordered lists
      .replace(/^\s*-\s+(.*)/gm, "<li>$1</li>")
      .replace(
        /(<li>.*<\/li>)/g,
        '<ul class="list-disc list-inside ml-4">$1</ul>'
      )
      // Simple tables
      .replace(
        /^\|(.+)\|\n^\|([-| ]+)\|\n((^\|.*\|\n?)*)/gim,
        (match, headers, aligns, rows) => {
          const ths = headers
            .split("|")
            .map((h: string) => `<th class="px-4 py-2 border">${h.trim()}</th>`)
            .join("");
          const trs = rows
            .trim()
            .split("\n")
            .map((row: string) => {
              const tds = row
                .split("|")
                .map((d) => `<td class="px-4 py-2 border">${d.trim()}</td>`)
                .join("");
              return `<tr>${tds}</tr>`;
            })
            .join("");
          return `<table class="table-auto border-collapse border my-4 w-full text-left"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
        }
      )
      // Line breaks
      .replace(/\n/g, "<br />")
  );
};
