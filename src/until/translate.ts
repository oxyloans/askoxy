// utils/translate.ts
const LT_URL = "https://libretranslate.com/translate"; // public demo may rate-limit / block CORS
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const CACHE_KEY = "translate_cache_v1";

type Lang = "en" | "hi" | "te";

type CacheMap = {
  // key = `${text}:::${target}`
  [key: string]: string;
};

function loadCache(): CacheMap {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheMap) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: CacheMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export async function translateText(text: string, target: Lang): Promise<string> {
  if (!text || target === "en") return text;

  const key = `${text}:::${target}`;
  const cache = loadCache();
  if (cache[key]) return cache[key];

  // --- Provider 1: LibreTranslate (POST) ---
  try {
    const res = await fetch(LT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `format` helps with punctuation/newlines; `source: "auto"` is safer if input may vary
      body: JSON.stringify({ q: text, source: "auto", target, format: "text" }),
      // mode: "cors" // usually default; you can add explicitly if needed
    });
    if (res.ok) {
      const data = await res.json();
      const out = data?.translatedText || text;
      cache[key] = out;
      saveCache(cache);
      return out;
    }
  } catch {}

  // --- Provider 2: MyMemory (GET) fallback — generally CORS-friendly ---
  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(
      `en|${target}`
    )}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const out = data?.responseData?.translatedText || text;
      cache[key] = out;
      saveCache(cache);
      return out;
    }
  } catch {}

  // Final fallback: return original text
  return text;
}
