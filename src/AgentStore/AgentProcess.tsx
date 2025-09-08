// AgentContact.tsx (Step 5)
// Saves to localStorage only; no PATCH here.
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Lang = "en" | "te" | "hi";

export default function AgentContact() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = (localStorage.getItem("agent_lang") || "en") as Lang;
    setLang(saved === "te" ? "te" : saved === "hi" ? "hi" : "en");
  }, []);

  const [tone, setTone] = useState<"Friendly" | "Professional" | "Empathetic" | "Direct" | "Enthusiastic">("Friendly");
  const [closing, setClosing] = useState("");
  const [share, setShare] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const EMAIL_ERR = share && !/^\S+@\S+\.\S+$/.test(email.trim()) ? "Please enter a valid email or turn off sharing." : "";

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
    if (EMAIL_ERR) return;

    const payloadLocal = { tone, closing: closing.trim(), share, email: email.trim(), lang };
    localStorage.setItem("agent_contact", JSON.stringify(payloadLocal));
    navigate("/bharat-generate");
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Step 5: Delivery & Contact</h1>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100"><div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-purple-600 to-amber-500" /></div>
        <nav className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {steps.map((step, idx) => (
            <button key={step.label} type="button" onClick={() => navigate(step.path!)} className={`inline-flex items-center gap-2 ${idx === activeIndex ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${idx === activeIndex ? "bg-gradient-to-r from-purple-600 to-amber-500" : "bg-gray-400"}`} />
              <span className="whitespace-nowrap">{step.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={onSubmit} noValidate className="md:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-800">Conversation Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value as any)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
            {["Friendly","Professional","Empathetic","Direct","Enthusiastic"].map((t) => (<option key={t}>{t}</option>))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-800">Closing Style</label>
          <textarea rows={4} value={closing} onChange={(e) => setClosing(e.target.value.slice(0, 220))} placeholder='e.g., “If you have any questions, email me — happy to help.”' className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Share contact details?</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShare((s) => !s)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${share ? "bg-purple-600" : "bg-gray-300"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${share ? "translate-x-5" : "translate-x-1"}`} />
            </button>
            <input type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-72 rounded-lg border border-gray-300 px-3 py-2" disabled={!share} />
          </div>
          {EMAIL_ERR && <p className="text-xs text-red-600 mt-1">{EMAIL_ERR}</p>}
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">Save & Continue</button>
        </div>
      </form>
    </div>
  );
}
