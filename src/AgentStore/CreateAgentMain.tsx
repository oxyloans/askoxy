import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

type Lang = "en" | "hi" | "te";

type AgentHeader = {
  headerTitle: string;
  id: string;
  status: boolean;
  createdAt: number;
  // NOTE: API spells this as "discription" — keep as-is
  discription: string;
};

const API_URL = `${BASE_URL}/ai-service/agent/getAgentHeaders`;

/**
 * Static localized copy for the 6 known header types.
 * Shown only for convenience in UI; selection uses original headerTitle.
 */
const STATIC_LOCALIZED: Record<
  string,
  {
    hi: { title: string; desc: string };
    te: { title: string; desc: string };
  }
> = {
  "AI Twin": {
    hi: {
      title: "AI ट्विन",
      desc:
        "एक विशेषज्ञ दर्पण की तरह कार्य करता है (डॉक्टर, CA, CS, वकील, इंजीनियर, शिक्षक आदि)।\n" +
        "ज्ञान-समर्थित, जैसे किसी प्रोफेशनल से परामर्श।\n" +
        "अधिकारपूर्ण, डोमेन-विशेष मार्गदर्शन देता है।\n" +
        "उदाहरण: AI Doctor Twin → डॉक्टर की तरह लक्षण और उपचार समझाता है.",
    },
    te: {
      title: "AI ట్విన్",
      desc:
        "నిపుణుడి అద్దంలా పనిచేస్తుంది (డాక్టర్, CA, CS, అడ్వకేట్, ఇంజనీర్, టీచర్ మొదలైనవి).\n" +
        "జ్ఞానం ఆధారంగా, ప్రొఫెషనల్‌ను సంప్రదించినట్లుగా సలహా ఇస్తుంది.\n" +
        "అధికారిక, డొమైన్-స్పెసిఫిక్ మార్గదర్శనం ఇస్తుంది.\n" +
        "ఉదాహరణ: AI Doctor Twin → డాక్టర్‌లా లక్షణాలు, చికిత్సలు వివరిస్తుంది.",
    },
  },
  "AI Enabler": {
    hi: {
      title: "AI एनेबलर",
      desc:
        "मेंटोर/सीनियर/मरीज़/पीयर गाइड की तरह काम करता है।\n" +
        "अनुभव-आधारित, व्यावहारिक समाधान साझा करता है।\n" +
        "ज़रूरी नहीं कि प्रमाणित प्रोफेशनल की तरह, बल्कि किसी ऐसे व्यक्ति की तरह जिसने खुद अनुभव किया हो।\n" +
        "उदाहरण: AI Patient Enabler → दूसरे मरीज़ को बताता है कि उनके लिए वास्तविक जीवन में क्या काम आया.",
    },
    te: {
      title: "AI ఎనేబ్లర్",
      desc:
        "మెంటర్/సీనియర్/పేషెంట్/సహచర గైడ్‌లా పనిచేస్తుంది.\n" +
        "అనుభవంపై ఆధారిత, ప్రాక్టికల్ పరిష్కారాలు పంచుతుంది.\n" +
        "సర్టిఫైడ్ ప్రొఫెషనల్‌లా కాకపోయినా, చేసిన అనుభవం ఉన్న వ్యక్తిలా సలహా ఇస్తుంది.\n" +
        "ఉదాహరణ: AI Patient Enabler → నిజజీవితంలో తనకు పనిచేసినదాన్ని మరొక పేషెంట్‌కి చెబుతుంది.",
    },
  },
  "AI Discovery": {
    hi: {
      title: "AI डिस्कवरी",
      desc:
        "एक खोज इंजन की तरह कार्य करता है।\n" +
        "उपयोगकर्ताओं को नए रास्ते, अवसर और संसाधन खोजने में मदद करता है।\n" +
        "अंतिम उत्तर देने के बजाय शोध + विकल्प जनरेटर जैसा है।\n" +
        "उदाहरण: AI Discovery → “यहाँ 5 नए उपचार विकल्प और मधुमेह पर नवीनतम अध्ययन हैं जिन्हें आप देख सकते हैं.”",
    },
    te: {
      title: "AI డిస్కవరీ",
      desc:
        "ఎక్స్‌ప్లోరర్ ఇంజిన్‌లా పనిచేస్తుంది.\n" +
        "కొత్త మార్గాలు, అవకాశాలు, వనరులను కనుగొనడంలో సహాయం చేస్తుంది.\n" +
        "ఫైనల్ సమాధానాలకన్నా రీసెర్చ్ + ఆప్షన్స్ జనరేటర్‌లా ఉంటుంది.\n" +
        "ఉదాహరణ: AI Discovery → “మీరు పరిశీలించడానికి 5 కొత్త చికిత్సా ఎంపికలు మరియు డయబెటీస్‌పై తాజా అధ్యయనాలు ఇవి.”",
    },
  },
  "AI Companion": {
    hi: {
      title: "AI कम्पैनियन",
      desc:
        "दोस्त/मोटिवेटर/भावनात्मक सपोर्ट सिस्टम की तरह कार्य करता है।\n" +
        "तनाव कम करने, रिमाइंडर देने और यूज़र को जुड़े रखने में मदद करता है।\n" +
        "उदाहरण: AI Health Companion → समय पर दवा लेने के लिए प्रेरित करता है, सकारात्मकता बढ़ाता है.",
    },
    te: {
      title: "AI కంపానియన్",
      desc:
        "స్నేహితుడు/ప్రేరణదాయకుడు/భావోద్వేగ సహాయక వ్యవస్థలా పనిచేస్తుంది.\n" +
        "స్ట్రెస్ తగ్గించడంలో, రిమైండర్లు ఇవ్వడంలో, యూజర్‌ను ఎంగేజ్‌గా ఉంచడంలో సహాయం చేస్తుంది.\n" +
        "ఉదాహరణ: AI Health Companion → సమయానికి మందు తీసుకోవడానికి ప్రోత్సహిస్తుంది, పాజిటివ్‌గా ఉంచుతుంది.",
    },
  },
  "AI Executor": {
    hi: {
      title: "AI एग्ज़ीक्यूटर",
      desc:
        "सलाह से आगे बढ़कर— यूज़र के लिए कार्य वास्तव में करता है या ऑटोमेट करता है।\n" +
        "ज्ञान और क्रिया के बीच पुल बनाता है (RPA + AI जैसा)।\n" +
        "उदाहरण: AI Tax Executor → केवल कटौतियाँ सुझाता ही नहीं, टैक्स रिटर्न ड्राफ्ट फ़ॉर्म भी भरता है.",
    },
    te: {
      title: "AI ఎగ్జిక్యూటర్",
      desc:
        "సలహా కంటే ముందుకు వెళ్లి— యూజర్ కోసం పనులను నిజంగా చేస్తుంది లేదా ఆటోమేట్ చేస్తుంది.\n" +
        "జ్ఞానాన్ని చర్యతో కలుపుతుంది (RPA + AI లాగా).\n" +
        "ఉదాహరణ: AI Tax Executor → డిడక్షన్‌లను సూచించడమే కాదు, ట్యాక్స్ రిటర్న్ డ్రాఫ్ట్ ఫారమ్‌లను కూడా నింపుతుంది.",
    },
  },
  "AI Validator": {
    hi: {
      title: "AI वेलिडेटर",
      desc:
        "फ़ैक्ट-चेकर/सेकंड ओपिनियन एजेंट के रूप में काम करता है।\n" +
        "दूसरे एजेंट (या मानव) के कथनों का क्रॉस-वेरिफ़िकेशन करता है।\n" +
        "उदाहरण: लीगल के लिए AI Validator → जाँचता है कि किसी अनुबंध की धारा कानूनी रूप से वैध है या नहीं.",
    },
    te: {
      title: "AI వాలిడేటర్",
      desc:
        "ఫాక్ట్-చెకర్/సెకండ్ ఓపీనియన్ ఏజెంట్‌గా పనిచేస్తుంది.\n" +
        "ఇతర ఏజెంట్లు (లేదా మనుషులు) చెప్పింది క్రాస్-వెరిఫై చేస్తుంది.\n" +
        "ఉదాహరణ: లీగల్ కోసం AI Validator → ఒప్పందంలోని క్లాజ్ చట్టబద్ధమా అని చెక్ చేస్తుంది.",
    },
  },
};

export default function CreateAgentMain() {
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<AgentHeader[]>([]);

  // --- Static UI labels (localized) ---
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
        title: "Before You Begin: Choose Your AI Role",
        sub: "Pick how you want to proceed.",
        continuePrefix: "Continue as",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
      hi: {
        title: "आरंभ करने से पहले: अपनी AI भूमिका चुनें",
        sub: "आप कैसे आगे बढ़ना चाहते हैं",
        continuePrefix: "के रूप में जारी रखें",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
      te: {
        title: "మీరు ప్రారంభించడానికి ముందు: మీ AI పాత్రను ఎంచుకోండి",
        sub: "ఎలా ముందుకు వెళ్లాలనుకుంటున్నారో ఎంచుకోండి.",
        continuePrefix: "గా కొనసాగండి",
        english: "English",
        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
    };
    return dict[lang];
  }, [lang]);

  // Fetch headers (English base from API)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("id_token") ||
          "";

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

  // Keep navigation using original API value (dynamic)
  const handleContinue = (headerTitle: string) => {
    navigate("/main/create-aiagent", {
      state: { headerTitle, headerStatus: false, mode: "create" },
    });
  };

  // Helpers to pick localized strings (fallback to English if unknown)
  const localizedTitle = (h: AgentHeader) => {
    if (lang === "en") return h.headerTitle;
    const pack = STATIC_LOCALIZED[h.headerTitle];
    if (lang === "hi") return pack?.hi.title || h.headerTitle;
    if (lang === "te") return pack?.te.title || h.headerTitle;
    return h.headerTitle;
    };

  const localizedDesc = (h: AgentHeader) => {
    if (lang === "en") return h.discription;
    const pack = STATIC_LOCALIZED[h.headerTitle];
    if (lang === "hi") return pack?.hi.desc || h.discription;
    if (lang === "te") return pack?.te.desc || h.discription;
    return h.discription;
  };

  return (
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
              {T.english}
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
              {T.telugu}
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
              {T.hindi}
            </button>
          </div>
        </div>
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
                  {localizedTitle(h)}
                </h3>

                {/* Description — FULL text */}
                <div className="mt-2 text-sm text-slate-700 leading-6 whitespace-pre-wrap flex-1">
                  {localizedDesc(h)}
                </div>

                {/* CTA pinned to bottom across all cards */}
                <button
                  onClick={() => handleContinue(h.headerTitle)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                  shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                >
                  {lang === "en" && `Continue as ${localizedTitle(h)}`}
                  {lang === "hi" && `${localizedTitle(h)} के रूप में जारी रखें`}
                  {lang === "te" && `${localizedTitle(h)} గా కొనసాగండి`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
