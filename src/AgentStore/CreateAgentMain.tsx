import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../BharathAIStore/components/AppShell";

type Lang = "en" | "te" | "hi";

interface Translations {
  pageTitle: string;
  pageSub: string;

  twinTitle: string;
  twinDesc1: string;
  twinDesc2Bold: string;
  twinDesc2: string;
  twinDoctorUsecaseTitle: string;
  twinDoctorUsecase: string;
  twinCta: string;

  enablerTitle: string;
  enablerDesc1: string;
  enablerDesc2Bold: string;
  enablerDesc2: string;
  enablerExampleTitle: string;
  enablerExample: string;
  enablerCta: string;

  telugu: string;
  hindi: string;
}

export default function CreateAgentMain() {
  const navigate = useNavigate();
  // NEW: required refs for DashboardHeader
  const bharatAgentsStoreRef = useRef<HTMLDivElement>(null);
  const aiResourcesRef = useRef<HTMLDivElement>(null);
  const freeAIBookRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Lang>("en");

  // pass the chosen headerTitle into the wizard + force headerStatus=false there
  const goNext = (type: "ai-twin" | "ai-enabler") => {
    const headerTitle = type === "ai-twin" ? "AI Twin" : "AI Enabler";
    navigate("/create-aiagent", {
      state: {
        headerTitle,
        headerStatus: false, // always send false as per requirement
        mode: "create",
      },
    });
  };

  const T: Translations = useMemo(() => {
    const dict: Record<Lang, Translations> = {
      en: {
        pageTitle: "Create Your AI Agent",
        pageSub: "Choose the perfect AI setup for your journey",

        twinTitle: "AI Twin",
        twinDesc1:
          "Your expert mirror. The agent reflects your professional knowledge, judgement, and standards.",
        twinDesc2Bold: "Meaning:",
        twinDesc2:
          " Your expertise powers the assistant (e.g., Doctor, CA/CS, Advocate).",
        twinDoctorUsecaseTitle:
          "Doctor Twin – Example (AI Enabler style reply)",
        twinDoctorUsecase: `Patient: "I often feel a heavy sensation in my chest after climbing stairs. Should I be worried?"

AI Twin (Doctor): "I understand your concern. Chest heaviness can be related to the heart, lungs, or simple fatigue. If it’s accompanied by dizziness, sweating, or pain radiating to your arm or jaw, please seek immediate care. For now, do you have any history of high BP, diabetes, or heart disease?"`,
        twinCta: "Continue as AI Twin",

        enablerTitle: "AI Enabler",
        enablerDesc1:
          "Build helpful assistants even if you’re not a licensed expert.",
        enablerDesc2Bold: "Meaning:",
        enablerDesc2:
          " A senior (patient/mentor) who faced problems creates solutions and empowers an assistant to help others with the same issues.",
        enablerExampleTitle: "Example Conversation (Chest Heaviness)",
        enablerExample: `Patient: "I feel chest heaviness after stairs."

AI Enabler Assistant: "I understand. It might relate to heart, lungs, or exertion. If severe or radiating to arm/jaw or with sweating, seek urgent care. Meanwhile, do you have a history of heart or BP issues? I can also share a daily checklist based on senior patient learnings."`,
        enablerCta: "Continue as AI Enabler",

        telugu: "తెలుగు",
        hindi: "हिंदी",
      },

      te: {
        pageTitle: "మీ AI ఏజెంట్‌ను సృష్టించండి",
        pageSub: "మీ ప్రయాణానికి సరైన AI అమరికను ఎంచుకోండి",

        twinTitle: "AI ట్విన్",
        twinDesc1:
          "మీ నైపుణ్యం, తీర్పు, ప్రమాణాలను ప్రతిబింబించే నిపుణ సహాయకుడు.",
        twinDesc2Bold: "అర్థం:",
        twinDesc2:
          " మీ నైపుణ్యమే అసిస్టెంట్‌ను నడుపుతుంది (ఉదా: డాక్టర్, CA/CS, అడ్వకేట్).",
        twinDoctorUsecaseTitle: "డాక్టర్ ట్విన్ – ఉదాహరణ",
        twinDoctorUsecase: `రోగి: "మెట్లు ఎక్కిన తర్వాత ఛాతీలో బరువు అనిపిస్తోంది. భయపడాల్సిందా?"

AI ట్విన్ (డాక్టర్): "మీ ఆందోళన అర్థమైంది. ఇది హృదయం/ ఊపిరితిత్తులు లేదా అలసటకు సంబంధించి ఉండొచ్చు. తలనిర్బంధం, చెమటలు, చేతి/ తలువుకు నొప్పి వెళ్తే వెంటనే వైద్య సహాయం తీసుకోండి. మీకు BP, డయాబెటిస్, హృదయ సమస్యల చరిత్ర ఉందా?"`,
        twinCta: "AI ట్విన్‌గా కొనసాగండి",

        enablerTitle: "AI ఎనేబ్లర్",
        enablerDesc1: "లైసెన్స్ లేకపోయినా మీ అనుభవంతో సహాయకులను నిర్మించండి.",
        enablerDesc2Bold: "అర్థం:",
        enablerDesc2:
          " సమస్యలు ఎదుర్కొన్న సీనియర్ (పేషెంట్/మెంటర్) పరిష్కారాలు రూపొందించి, వాటితో అసిస్టెంట్‌ను శక్తివంతం చేస్తాడు.",
        enablerExampleTitle: "ఉదాహరణ సంభాషణ (ఛాతి బరువు)",
        enablerExample: `రోగి: "మెట్లు ఎక్కిన తర్వాత ఛాతి బరువు అనిపిస్తుంది."

AI ఎనేబ్లర్ అసిస్టెంట్: "అర్థమైంది. ఇది హృదయం/ ఊపిరితిత్తులు/ ప్రయాసకు సంబంధించినదై ఉండొచ్చు. తీవ్రంగా ఉంటే లేదా చేతి/ దవడకు విస్తరించిన నొప్పి/ చెమటలు ఉంటే అత్యవసర చికిత్స తీసుకోండి. మీకు హృదయ/ BP చరిత్రుందా? సీనియర్ రోగుల చెక్లిస్టును పంచగలను."`,
        enablerCta: "ఎనేబ్లర్‌గా కొనసాగండి",

        telugu: "తెలుగు",
        hindi: "హिंदी",
      },

      hi: {
        pageTitle: "अपना AI एजेंट बनाएँ",
        pageSub: "अपनी यात्रा के लिए सही AI सेटअप चुनें",

        twinTitle: "AI ट्विन",
        twinDesc1:
          "आपकी विशेषज्ञता, निर्णय और मानकों को दर्शाने वाला पेशेवर सहायक।",
        twinDesc2Bold: "अर्थ:",
        twinDesc2:
          " आपकी विशेषज्ञता ही असिस्टेंट को शक्ति देती है (जैसे डॉक्टर, CA/CS, एडवोकेट)।",
        twinDoctorUsecaseTitle: "डॉक्टर ट्विन – उदाहरण",
        twinDoctorUsecase: `रोगी: "सीढ़ियाँ चढ़ने के बाद सीने में भारीपन लगता है। चिंता की बात है?"

AI ट्विन (डॉक्टर): "आपकी चिंता समझता/समझती हूँ। यह हृदय/फेफड़ों या थकान से जुड़ा हो सकता है। यदि चक्कर, पसीना या बाँह/जबड़े तक दर्द जाए तो तुरंत चिकित्सकीय सहायता लें। क्या आपको BP/शुगर/हृदय रोग का इतिहास है?"`,
        twinCta: "AI ट्विन के रूप में जारी रखें",

        enablerTitle: "AI एनेबलर",
        enablerDesc1: "बिना लाइसेंस के भी अपने अनुभव से सहायक बनाएँ।",
        enablerDesc2Bold: "अर्थ:",
        enablerDesc2:
          " समस्याएँ झेल चुके वरिष्ठ (मरीज़/मेंटोर) समाधान बनाते हैं और असिस्टेंट को सक्षम करते हैं ताकि वही समस्या वाले लोगों की मदद हो सके।",
        enablerExampleTitle: "उदाहरण वार्तालाप (सीने में भारीपन)",
        enablerExample: `रोगी: "सीढ़ियाँ चढ़ने के बाद सीने में भारीपन महसूस होता है।"

AI एनेबलर असिस्टेंट: "समझ गया/गई। यह हृदय/फेफड़ों/मेहनत से जुड़ा हो सकता है। यदि तेज हो या बाँह/जबड़े तक जाए या पसीना आए तो तुरंत डॉक्टर से मिलें। क्या आपको हृदय या BP का इतिहास है? वरिष्ठ मरीज की दैनिक चेकलिस्ट साझा कर सकता/सकती हूँ।"`,
        enablerCta: "एनेबलर के रूप में जारी रखें",

        telugu: "తెలుగు",
        hindi: "हिंदी",
      },
    };

    return dict[lang];
  }, [lang]);

  return (
      <AppShell
          allAgentsHref="/bharath-aistore/agents"
          createAgentHref="/create-aiagent"
        >
   <div className="min-h-screen">
      <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-violet-900" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/20 to-cyan-900/30" />
        </div>

        {/* Main */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
          {/* Language toggle */}
          <div className="mb-6 flex items-center justify-end gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                lang === "en"
                  ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
            <button
              onClick={() => setLang("te")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                lang === "te"
                  ? "bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
              aria-pressed={lang === "te"}
            >
              {T.telugu}
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                lang === "hi"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow"
                  : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
              aria-pressed={lang === "hi"}
            >
              {T.hindi}
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {T.pageTitle}
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">
              {T.pageSub}
            </p>
          </div>

          {/* Cards: equal heights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* AI Twin */}
            <div className="relative group transition-all duration-300 hover:scale-[1.02] h-full">
              <div className="relative h-full flex flex-col rounded-2xl p-6 border backdrop-blur-lg transition-all duration-300 border-white/20 bg-white/10 hover:border-violet-300/50 hover:bg-white/12 shadow-xl shadow-violet-500/10">
                {/* Icon + Title */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {T.twinTitle}
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {T.twinDesc1}
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    <span className="font-semibold">{T.twinDesc2Bold}</span>
                    {T.twinDesc2}
                  </p>
                </div>

                {/* Example */}
                <div className="mb-6 rounded-lg bg-black/20 border border-white/10 p-4">
                  <p className="text-slate-200 text-sm font-semibold mb-2">
                    {T.twinDoctorUsecaseTitle}
                  </p>
                  <pre className="whitespace-pre-wrap text-slate-300 text-xs leading-5">
                    {T.twinDoctorUsecase}
                  </pre>
                </div>

                {/* Footer button pinned to bottom */}
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => goNext("ai-twin")}
                    className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99] shadow-md hover:shadow-lg"
                  >
                    {T.twinCta}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Enabler */}
            <div className="relative group transition-all duration-300 hover:scale-[1.02] h-full">
              <div className="relative h-full flex flex-col rounded-2xl p-6 border backdrop-blur-lg transition-all duration-300 border-white/20 bg-white/10 hover:border-emerald-300/50 hover:bg-white/12 shadow-xl shadow-emerald-500/10">
                {/* Icon + Title */}
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {T.enablerTitle}
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {T.enablerDesc1}
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    <span className="font-semibold">{T.enablerDesc2Bold}</span>
                    {T.enablerDesc2}
                  </p>
                </div>

                {/* Example */}
                <div className="mb-6 rounded-lg bg-black/20 border border-white/10 p-4">
                  <p className="text-slate-200 text-sm font-semibold mb-2">
                    {T.enablerExampleTitle}
                  </p>
                  <pre className="whitespace-pre-wrap text-slate-300 text-xs leading-5">
                    {T.enablerExample}
                  </pre>
                </div>

                {/* Footer button pinned to bottom */}
                <div className="mt-auto flex justify-end">
                  <button
                    onClick={() => goNext("ai-enabler")}
                    className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] shadow-md hover:shadow-lg"
                  >
                    {T.enablerCta}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
