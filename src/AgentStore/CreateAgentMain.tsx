import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

type Lang = "en" | "hi" | "te";

type AgentHeader = {
  headerTitle: string;
  id: string;
  status: boolean;
  createdAt: number;
  discription: string; // (intentional API typo)
};

const API_URL = `${BASE_URL}/ai-service/agent/getAgentHeaders`;


const STATIC_LOCALIZED: Record<
  string,
  {
    hi: { title: string; desc: string };
    te: { title: string; desc: string };
  }
> = {
  "AI Twin (Replicator)": {
    hi: {
      title: "AI ट्विन (रिप्लिकेटर)",
      desc:
        "किसी व्यक्ति, टीम या संगठन का प्रतिबिंब।\n\nउदाहरण: CEO का AI ट्विन जो निवेशकों के प्रश्नों का उत्तर देता है।",
    },
    te: {
      title: "AI ట్విన్ (రిప్లికేటర్)",
      desc:
        "వ్యక్తి, బృందం లేదా సంస్థను ప్రతిబింబిస్తుంది.\n\nఉదాహరణ: పెట్టుబడిదారుల ప్రశ్నలకు సమాధానం ఇచ్చే CEO యొక్క AI ట్విన్.",
    },
  },
  "AI Enabler (Assistant)": {
    hi: {
      title: "AI एनेबलर (असिस्टेंट)",
      desc:
        "उत्पादकता और कार्यप्रवाह में मदद करता है।\n\nउदाहरण: GST एनेबलर जो स्वतः रिटर्न तैयार करता है।",
    },
    te: {
      title: "AI ఎనేబ్లర్ (అసిస్టెంట్)",
      desc:
        "ఉత్పాదకత మరియు వర్క్‌ఫ్లోలో సహాయపడుతుంది.\n\nఉదాహరణ: GST ఎనేబ్లర్ స్వయంచాలకంగా రిటర్న్‌లను తయారు చేస్తుంది.",
    },
  },
  "AI Discovery (Explorer)": {
    hi: {
      title: "AI डिस्कवरी (एक्सप्लोरर)",
      desc:
        "ज्ञान, अवसर और संसाधन खोजने में मदद करता है।\n\nउदाहरण: बीमा डिस्कवरी एजेंट जो IRDAI स्वीकृत नीतियाँ ढूँढता है।",
    },
    te: {
      title: "AI డిస్కవరీ (ఎక్స్‌ప్లోరర్)",
      desc:
        "జ్ఞానం, అవకాశాలు మరియు వనరులను కనుగొనడంలో సహాయపడుతుంది.\n\nఉదాహరణ: IRDAI ఆమోదించిన పాలసీలను కనుగొనే ఇన్సూరెన్స్ డిస్కవరీ ఏజెంట్.",
    },
  },
  "AI Companion (Engager)": {
    hi: {
      title: "AI कम्पैनियन (एंगेजर)",
      desc:
        "संवाद करता है, सिखाता है और सहानुभूति के साथ मार्गदर्शन करता है।\n\nउदाहरण: वेलनेस कम्पैनियन जो हिंदी में मेडिटेशन करवाता है।",
    },
    te: {
      title: "AI కంపానియన్ (ఎంగేజర్)",
      desc:
        "మాట్లాడుతుంది, బోధిస్తుంది మరియు అనుకంపతో మార్గనిర్దేశనం చేస్తుంది.\n\nఉదాహరణ: హిందీలో ధ్యానం చేయించే వెల్‌నెస్ కంపానియన్.",
    },
  },
  "AI Operator (Executor + Validator)": {
    hi: {
      title: "AI ऑपरेटर (एक्सीक्यूटर + वेलिडेटर)",
      desc:
        "कार्य निष्पादित करता है और सटीकता की पुष्टि करता है।\n\nउदाहरण: ऑडिट ऑपरेटर जो GST फाइलिंग की जाँच और नोटिस दाख़िल करता है।",
    },
    te: {
      title: "AI ఆపరేటర్ (ఎగ్జిక్యూటర్ + వాలిడేటర్)",
      desc:
        "పనులను అమలు చేసి ఖచ్చితత్వాన్ని నిర్ధారిస్తుంది.\n\nఉదాహరణ: GST ఫైలింగ్‌లను తనిఖీ చేసి నోటీసులు దాఖలు చేసే ఆడిట్ ఆపరేటర్.",
    },
  },
};

export default function CreateAgentMain() {
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<AgentHeader[]>([]);

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

  const handleContinue = (headerTitle: string) => {
    navigate("/main/create-aiagent", {
      state: { headerTitle, headerStatus: false, mode: "create" },
    });
  };

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
              className={`flex-1 px-3 py-2 text-sm font-semibold transition ${
                lang === "en"
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              {T.english}
            </button>
            <button
              onClick={() => setLang("te")}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition border-l border-purple-200 ${
                lang === "te"
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              {T.telugu}
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition border-l border-purple-200 ${
                lang === "hi"
                  ? "bg-purple-600 text-white"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
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
            {Array.from({ length: 5 }).map((_, i) => (
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
                <h3 className="text-lg font-semibold text-slate-900 leading-6">
                  {localizedTitle(h)}
                </h3>
                <div className="mt-2 text-sm text-slate-700 leading-6 whitespace-pre-wrap flex-1">
                  {localizedDesc(h)}
                </div>
                <button
                  onClick={() => handleContinue(h.headerTitle)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
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
