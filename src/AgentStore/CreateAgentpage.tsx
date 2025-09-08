import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Lang = "en" | "te" | "hi";
type RecognitionLike = {
  start: () => void; stop: () => void;
  onresult: ((e: any) => void) | null; onend: (() => void) | null;
  lang: string; interimResults: boolean; continuous: boolean;
};

function useSpeechToText(lang: Lang) {
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const [isListening, setListening] = useState(false);
  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const r: RecognitionLike = new SR();
    r.interimResults = false; r.continuous = false;
    r.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    recognitionRef.current = r;
    return () => { try { recognitionRef.current?.stop(); } catch {} recognitionRef.current = null; };
  }, [lang]);
  const record = (onText: (text: string) => void) => {
    const r = recognitionRef.current; if (!r) return;
    if (isListening) { r.stop(); setListening(false); return; }
    r.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((res: any) => res[0]?.transcript).join(" ");
      onText(transcript);
    };
    r.onend = () => setListening(false);
    setListening(true); r.start();
  };
  return { record, isListening };
}

function MicIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3z" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}
function MicBtn({ active, onClick }: { active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${active ? "border-amber-500 text-amber-700 bg-amber-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
      title="Use microphone"
    >
      <MicIcon active={active} /> {active ? "Listening…" : "Mic"}
    </button>
  );
}

const clampChars = (s: string, max: number) => (s.length > max ? s.slice(0, max) : s);

// NEW: centralised placeholders by language
const PLACEHOLDERS: Record<Lang, { experience: string; problems: string; strength: string }> = {
  en: {
    experience: "e.g., 5 years in civil litigation; appeared before High Court; drafted 200+ contracts…",
    problems:   "Describe problems you solve. e.g., property disputes, contract vetting, legal notices…",
    strength:   "e.g., quick research, concise drafting, client-friendly explanations…"
  },
  te: {
    experience: "ఉదా: 5 సంవత్సరాలు సివిల్ లిటిగేషన్; హైకోర్టులో వాదనలు; 200+ కాంట్రాక్టులు డ్రాఫ్ట్…",
    problems:   "మీరు పరిష్కరించే సమస్యలు. ఉదా: ప్రాపర్టీ వివాదాలు, కాంట్రాక్ట్ వెట్టింగ్, లీగల్ నోటీసులు…",
    strength:   "ఉదా: వేగమైన రీసెర్చ్, క్లియర్ డ్రాఫ్టింగ్, కస్టమర్ ఫ్రెండ్లీ వివరణ…"
  },
  hi: {
    experience: "उदा.: 5 साल सिविल लिटिगेशन; हाईकोर्ट उपस्थिति; 200+ कॉन्ट्रैक्ट ड्राफ्ट…",
    problems:   "आप किन समस्याओं का समाधान करते हैं? उदा.: प्रॉपर्टी विवाद, कॉन्ट्रैक्ट वेटिंग, लीगल नोटिस…",
    strength:   "उदा.: तेज़ रिसर्च, स्पष्ट ड्राफ्टिंग, क्लाइंट-फ्रेंडली समझाना…"
  }
};

export default function CreateAgentStep1() {
  const [lang, setLang] = useState<Lang>("en");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const saved = (localStorage.getItem("agent_lang") || "en") as Lang;
    setLang(saved === "te" ? "te" : saved === "hi" ? "hi" : "en");
  }, []);

  // NEW: memoized placeholders for current language
  const placeholders = useMemo(() => PLACEHOLDERS[lang], [lang]);

  const steps = [
    { label: "Create Agent", path: "/bharat-agent" },
    { label: "Business Context", path: "/bharat-agentbusiness" },
    { label: "Target & Problem", path: "/bharat-targetcus" },
    { label: "Method & Process", path: "/bharat-agentprocess" },
    { label: "Contact", path: "/bharat-contact" },
    { label: "Generate Instructions", path: "/bharat-generate" },
  ];
  const activeIndex = steps.findIndex((s) => s.path === pathname);

  const ROLES = ["Advocate", "CA", "CS", "Consultant", "Entrepreneur", "Domain Expert", "Citizen Creator"];
  const [role, setRole] = useState<string>(ROLES[0]);

  const MAX_EXP = 120, MAX_DESC = 250, MAX_STR = 100;
  const [experience, setExperience] = useState("");
  const [problems, setProblems] = useState("");
  const [strength, setStrength] = useState("");

  const [touched, setTouched] = useState({ role: false, experience: false, problems: false, strength: false });
  const ERR = {
    role: !role ? "Please choose a role." : "",
    experience: !experience.trim() ? "Experience is required." : "",
    problems: !problems.trim() ? "Description is required." : "",
    strength: !strength.trim() ? "Please describe your strengths." : "",
  };
  const isValid = !ERR.role && !ERR.experience && !ERR.problems && !ERR.strength;

  const onExp  = (v: string) => setExperience(clampChars(v, MAX_EXP));
  const onProb = (v: string) => setProblems(clampChars(v, MAX_DESC));
  const onStr  = (v: string) => setStrength(clampChars(v, MAX_STR));

  // NEW: enable mic to fill each field
  const { record, isListening } = useSpeechToText(lang);
  const startDictation = (setter: (v: string) => void, max: number) =>
    record((text) => setter(clampChars(text, max)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ role: true, experience: true, problems: true, strength: true });
    if (!isValid) return;

    // Save locally only
    const payloadLocal = { role, experience, problems, strength, lang };
    localStorage.setItem("agent_step1", JSON.stringify(payloadLocal));

    navigate("/bharat-agentbusiness");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Step 1: Create Agent</h1>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 w-1/6 rounded-full bg-gradient-to-r from-purple-600 to-amber-500" />
        </div>
        <nav className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          {steps.map((s, idx) => (
            <button
              key={s.label}
              type="button"
              onClick={() => navigate(s.path!)}
              className={`inline-flex items-center gap-2 ${idx === activeIndex ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${idx === activeIndex ? "bg-gradient-to-r from-purple-600 to-amber-500" : "bg-gray-400"}`} />
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-800">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
            {ROLES.map((r) => (<option key={r}>{r}</option>))}
          </select>
          {touched.role && ERR.role && <p className="text-xs text-red-600 mt-1">{ERR.role}</p>}
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-semibold text-gray-800">Your Experience</label>
          <textarea
            value={experience}
            onChange={(e) => onExp(e.target.value)}
            placeholder={placeholders.experience}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={3}
          />
          <MicBtn active={isListening} onClick={() => startDictation(onExp, MAX_EXP)} />
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-semibold text-gray-800">Problems Solved / Description</label>
          <textarea
            value={problems}
            onChange={(e) => onProb(e.target.value)}
            placeholder={placeholders.problems}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={4}
          />
          <MicBtn active={isListening} onClick={() => startDictation(onProb, MAX_DESC)} />
          {touched.problems && ERR.problems && <p className="text-xs text-red-600 mt-1">{ERR.problems}</p>}
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-semibold text-gray-800">Strength</label>
          <input
            value={strength}
            onChange={(e) => onStr(e.target.value)}
            placeholder={placeholders.strength}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          <MicBtn active={isListening} onClick={() => startDictation(onStr, MAX_STR)} />
          {touched.strength && ERR.strength && <p className="text-xs text-red-600 mt-1">{ERR.strength}</p>}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="submit" className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
