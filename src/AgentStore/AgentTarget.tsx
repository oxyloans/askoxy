// AgentTarget.tsx (Step 3)
// Saves to localStorage only; no PATCH here.
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Lang = "en" | "te" | "hi";
type RecognitionLike = { start: () => void; stop: () => void; onresult: ((e: any) => void) | null; onend: (() => void) | null; lang: string; interimResults: boolean; continuous: boolean; };

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
    r.onresult = (e: any) => { const transcript = Array.from(e.results).map((res: any) => res[0]?.transcript).join(" "); onText(transcript); };
    r.onend = () => setListening(false);
    setListening(true); r.start();
  };
  return { record, isListening };
}

export default function AgentTarget() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = (localStorage.getItem("agent_lang") || "en") as Lang;
    setLang(saved === "te" ? "te" : saved === "hi" ? "hi" : "en");
  }, []);

  const MAX_SUMMARY = 80;
  const [summary, setSummary] = useState("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [gender, setGender] = useState<string[]>([]);

  const steps = [
    { label: "Create Agent", path: "/bharat-agent" },
    { label: "Business Context", path: "/bharat-agentbusiness" },
    { label: "Target & Problem", path: "/bharat-targetcus" },
    { label: "Method & Process", path: "/bharat-agentprocess" },
    { label: "Contact", path: "/bharat-contact" },
    { label: "Generate Instructions", path: "/bharat-generate" },
  ];
  const activeIndex = steps.findIndex((s) => s.path === pathname);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payloadLocal = { summary: summary.trim(), ageRange, gender, lang };
    localStorage.setItem("agent_target", JSON.stringify(payloadLocal));
    navigate("/bharat-agentprocess");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Step 3: Target & Problem</h1>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100"><div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-purple-600 to-amber-500" /></div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          {steps.map((s, idx) => (
            <button key={s.label} type="button" onClick={() => navigate(s.path!)} className={`inline-flex items-center gap-2 ${idx === activeIndex ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${idx === activeIndex ? "bg-gradient-to-r from-purple-600 to-amber-500" : "bg-gray-400"}`} />
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <div className="relative">
          <label className="mb-1 block text-sm font-semibold">Target Summary (≤ 80)</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value.slice(0, MAX_SUMMARY))} className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={2} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Age Range</label>
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="">Select</option>
            <option value="below17">below 17</option>
            <option value="18-25">18–25</option>
            <option value="26-40">26–40</option>
            <option value="40-55">40–55</option>
            <option value="56plus">56+</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Gender</label>
          <div className="flex flex-wrap gap-4">
            {["male","female","other"].map((g) => (
              <label key={g} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={gender.includes(g)} onChange={(e) => setGender(e.target.checked ? [...gender, g] : gender.filter((x) => x !== g))} />
                <span className="capitalize">{g === "other" ? "Other / Non-binary" : g}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">Save & Continue</button>
        </div>
      </form>
    </div>
  );
}
