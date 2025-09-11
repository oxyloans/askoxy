import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BharathAIStoreLayout from "../BharathAIStore/components/Layout";
import BASE_URL from "../Config";
import { translateText } from "../until/translate";
type Lang = "en" | "hi" | "te";

type AgentHeader = {
  headerTitle: string;
  id: string;
  status: boolean;
  createdAt: number;
  discription: string; // (sp) preserved from API
  translations?: Partial<
    Record<
      Lang,
      {
        title: string;
        desc: string;
      }
    >
  >;
};

const API_URL = `${BASE_URL}/ai-service/agent/getAgentHeaders`;

export default function CreateAgentMain() {
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<AgentHeader[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const translatingRef = useRef(false);

  // --- Static UI labels (already localized for instant feel) ---
  const T = useMemo(() => {
    const dict: Record<
      Lang,
      {
        title: string;
        sub: string;
        continuePrefix: string;
        english: string;
        telugu: string;
        hindi: string;
      }
    > = {
      en: {
        title: "Before You Begin Create Agent: Choose Your AI Role",
sub:"",
        continuePrefix: "Continue as",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
      hi: {
        title: "एजेंट बनाना शुरू करने से पहले: अपनी AI भूमिका चुनें",
sub:"",
        continuePrefix: "के रूप में जारी रखें",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
      te: {
        title:
          "మీరు ఏజెంట్‌ను సృష్టించడం ప్రారంభించడానికి ముందు: మీ AI పాత్రను ఎంచుకోండి",
sub:"",
        continuePrefix: "గా కొనసాగండి",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
    };
    return dict[lang];
  }, [lang]);

  // 1) Fetch headers once (show English immediately)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as AgentHeader[];
        if (!mounted) return;

        setHeaders(Array.isArray(json) ? json : []);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) Translate lazily when language changes (non-blocking, cached)
  useEffect(() => {
    if (lang === "en") return;
    if (!headers.length) return;
    if (translatingRef.current) return;

    translatingRef.current = true;
    setIsTranslating(true);
    let cancelled = false;

    (async () => {
      // Work per-card; update progressively to feel instant
      const jobs = headers.map(async (h) => {
        if (h.translations?.[lang]) return h; // already translated
        const [tTitle, tDesc] = await Promise.all([
          translateText(h.headerTitle, lang),
          translateText(h.discription, lang),
        ]);
        return {
          ...h,
          translations: {
            ...(h.translations || {}),
            [lang]: { title: tTitle, desc: tDesc },
          },
        } as AgentHeader;
      });

      for (const p of jobs) {
        try {
          const done = await p;
          if (!done || cancelled) return;
          setHeaders((prev) => prev.map((x) => (x.id === done.id ? done : x)));
        } catch {
          // ignore one-off failures (English remains as fallback)
        }
      }

      if (!cancelled) {
        translatingRef.current = false;
        setIsTranslating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang, headers]);

  const handleContinue = (headerTitle: string) => {
    navigate("/create-aiagent", {
      state: { headerTitle, headerStatus: false, mode: "create" },
    });
  };

  // Helpers to pick localized strings (fallback to English if unavailable)
  const titleFor = (h: AgentHeader) =>
    (lang !== "en" ? h.translations?.[lang]?.title : null) || h.headerTitle;

  const descFor = (h: AgentHeader) =>
    (lang !== "en" ? h.translations?.[lang]?.desc : null) || h.discription;

  return (
    <BharathAIStoreLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
        {/* Top Bar */}
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                {T.title}
              </h1>
              <p className="text-slate-600 mt-1">{T.sub}</p>
            </div>

            {/* Language Switcher */}
            <div className="inline-flex w-full sm:w-auto rounded-xl border border-purple-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setLang("en")}
                className={`flex-1 sm:flex-none px-3 py-2 text-sm font-semibold transition ${
                  lang === "en"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
                aria-pressed={lang === "en"}
              >
                English
              </button>
              <button
                onClick={() => setLang("te")}
                className={`flex-1 sm:flex-none px-3 py-2 text-sm font-semibold transition border-l border-purple-200 ${
                  lang === "te"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
                aria-pressed={lang === "te"}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`flex-1 sm:flex-none px-3 py-2 text-sm font-semibold transition border-l border-purple-200 ${
                  lang === "hi"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
                aria-pressed={lang === "hi"}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Tiny translating indicator (non-blocking) */}
          {isTranslating && lang !== "en" && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-purple-50 px-2.5 py-1 text-xs text-purple-700 border border-purple-100">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-purple-600" />
              Translating content…
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
                >
                  <div className="h-6 w-2/3 bg-slate-200 rounded mb-3" />
                  <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded mb-6" />
                  <div className="h-10 w-full bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              Failed to load: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {headers.map((h) => (
                <div
                  key={h.id}
                  className="group relative h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-purple-300 pointer-events-none" />

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 leading-6">
                    {titleFor(h)}
                  </h3>

                  {/* Description — FULL text */}
                  <div className="mt-2 text-sm text-slate-700 leading-6 whitespace-pre-wrap flex-1">
                    {descFor(h)}
                  </div>

                  {/* CTA pinned to bottom across all cards */}
                  <button
                    onClick={() => handleContinue(h.headerTitle)}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white
      bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
      shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                  >
                    {lang === "en" && `${T.continuePrefix} ${titleFor(h)}`}
                    {lang === "hi" && `${titleFor(h)} ${T.continuePrefix}`}
                    {lang === "te" && `${titleFor(h)} ${T.continuePrefix}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BharathAIStoreLayout>
  );
}
