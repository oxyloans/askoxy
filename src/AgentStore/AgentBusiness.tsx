// AgentBusiness.tsx (Step 2)
// Saves to localStorage only; no PATCH here.
import React, { useEffect, useRef, useState } from "react";
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

export default function AgentBusiness() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = (localStorage.getItem("agent_lang") || "en") as Lang;
    setLang(saved === "te" ? "te" : saved === "hi" ? "hi" : "en");
  }, []);

  const [agentName, setAgentName] = useState("");
  const [agentImage, setAgentImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [domain, setDomain] = useState("Finance");
  const [subdomain, setSubdomain] = useState("Loans");
  const [ideaType, setIdeaType] = useState<"new" | "solve">("solve");
  const [uniqueSolution, setUniqueSolution] = useState("");
  const [existingSolved, setExistingSolved] = useState("");

  const steps = [
    { label: "Create Agent", path: "/bharat-agent" },
    { label: "Business Context", path: "/bharat-agentbusiness" },
    { label: "Target & Problem", path: "/bharat-targetcus" },
    { label: "Method & Process", path: "/bharat-agentprocess" },
    { label: "Contact", path: "/bharat-contact" },
    { label: "Generate Instructions", path: "/bharat-generate" },
  ];
  const activeIndex = steps.findIndex((s) => s.path === pathname);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) { setAgentImage(null); setPreviewUrl(null); return; }
    const isImage = /^image\//.test(file.type);
    const under5MB = file.size <= 5 * 1024 * 1024;
    if (!isImage || !under5MB) { alert("Please upload a valid image (PNG/JPG ≤ 5MB)."); (e.target as any).value = ""; return; }
    setAgentImage(file); setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const local = { agentName, domain, subdomain, ideaType, uniqueSolution, existingSolved };
    localStorage.setItem("agent_business", JSON.stringify(local));

    navigate("/bharat-targetcus");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Step 2: Business Context</h1>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
          <div className="h-2 w-2/6 rounded-full bg-gradient-to-r from-purple-600 to-amber-500" />
        </div>
        <nav className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          {steps.map((s, idx) => (
            <button key={s.label} type="button" onClick={() => navigate(s.path!)} className={`inline-flex items-center gap-2 ${idx === activeIndex ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${idx === activeIndex ? "bg-gradient-to-r from-purple-600 to-amber-500" : "bg-gray-400"}`} />
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Agent Name</label>
            <input value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="PolicyPal, LoanGenie…" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option>Finance</option><option>Education</option><option>Healthcare</option><option>Legal</option><option>General</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Subdomain</label>
              <input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Problem or Idea</label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="ideaType" checked={ideaType === "new"} onChange={() => setIdeaType("new")} />
                <span>New Business Idea</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="ideaType" checked={ideaType === "solve"} onChange={() => setIdeaType("solve")} />
                <span>Solving Existing Problem</span>
              </label>
            </div>
          </div>

          {ideaType === "new" ? (
            <div>
              <label className="mb-1 block text-sm font-semibold">Unique Solution (≤ 250 chars)</label>
              <textarea value={uniqueSolution} onChange={(e) => setUniqueSolution(e.target.value.slice(0, 250))} className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} />
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-semibold">Existing problem you solved previously? (≤ 150 chars)</label>
              <textarea value={existingSolved} onChange={(e) => setExistingSolved(e.target.value.slice(0, 150))} className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} />
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">Save & Continue</button>
          </div>
        </div>
      </form>
    </div>
  );
}
