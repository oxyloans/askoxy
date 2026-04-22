import { CodeFile } from "./types";

export function collectAllFiles(text: string): CodeFile[] {
  if (!text) return [];
  const map = new Map<string, CodeFile>();
  let depth = 0, start = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          const obj = JSON.parse(text.slice(start, i + 1));
          const arr: any[] = Array.isArray(obj?.files)
            ? obj.files
            : Array.isArray(obj?.fileList)
            ? obj.fileList
            : [];

          for (const f of arr) {
            if (!f?.path) continue;
            const hasContent =
              f.content !== undefined &&
              f.content !== "" &&
              f.content !== "null";
            const prev = map.get(f.path);
            const prevHasContent =
              prev?.content !== undefined &&
              prev.content !== "" &&
              prev.content !== "null";
            // Only overwrite if incoming has real content, or no previous entry
            if (!prev || hasContent || !prevHasContent) {
              map.set(f.path, { path: f.path, content: f.content ?? "" });
            }
          }
        } catch {
          /* incomplete chunk — skip */
        }
        start = -1;
      }
    }
  }

  return Array.from(map.values()).filter(
    (f) => f.content !== "" && f.content !== "null"
  );
}
export function mergeFiles(
  existing: CodeFile[],
  incoming: CodeFile[]
): CodeFile[] {
  const map = new Map(existing.map((f) => [f.path, f]));
  for (const f of incoming) {
    const prev = map.get(f.path);
    const hasContent =
      f.content !== undefined && f.content !== "" && f.content !== "null";
    const prevHasContent =
      prev?.content !== undefined &&
      prev.content !== "" &&
      prev.content !== "null";
    if (!prev || hasContent || !prevHasContent) {
      map.set(f.path, f);
    }
  }
  return Array.from(map.values()).filter(
    (f) => f.content !== "" && f.content !== "null"
  );
}

/** Deduplicates a single file array by path — content wins. */
export function dedupeFiles(files: CodeFile[]): CodeFile[] {
  return mergeFiles([], files);
}