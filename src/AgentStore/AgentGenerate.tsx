// AgentGenerate.tsx — drop-in replacement
import React, { useEffect, useState, DragEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../Config";

type Lang = "en" | "te" | "hi";
type ChatMsg = { role: "agent" | "user"; text: string };
type UploadedDoc = { id: string; name: string; size: number; type: string; url?: string; preview?: string };

const CURRENT_ROUTE = "/bharat-generate";
const ROUTES = {
  step1: "/bharat-agent",
  step2: "/bharat-agentbusiness",
  step3: "/bharat-targetcus",
  step4: "/bharat-agentprocess",
  step5: "/bharat-contact",
  step6: "/bharat-generate",
};

// --- helpers ---
const clean = (o: Record<string, any>) => {
  const out: Record<string, any> = {};
  Object.entries(o).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    if (Array.isArray(v) && v.length === 0) return;
    out[k] = v;
  });
  return out;
};

const getAuthToken = (): string => {
  const viteToken =
    typeof import.meta !== "undefined" ? (import.meta as any)?.env?.VITE_AUTH_TOKEN : undefined;
  const nodeToken =
    (globalThis as any)?.process?.env?.VITE_AUTH_TOKEN ||
    (globalThis as any)?.process?.env?.AUTH_TOKEN;
  return viteToken || nodeToken || localStorage.getItem("auth_token") || "";
};

// fetch wrapper that returns {ok,json,text,status}
async function fetchSmart(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  const ct = res.headers.get("content-type") || "";
  let body: any = null;
  try {
    body = ct.includes("application/json") ? await res.json() : await res.text();
  } catch {
    body = await res.text().catch(() => "");
  }
  return { ok: res.ok, status: res.status, body };
}

// PATCH /ai-service/agent/agentCreation (token optional)
async function patchAgent(body: Record<string, any>) {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetchSmart(`${BASE_URL}/ai-service/agent/agentCreation`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(clean(body)),
  });
  if (!res.ok) {
    const msg = typeof res.body === "string" ? res.body : JSON.stringify(res.body);
    throw new Error(`agentCreation failed (${res.status}): ${msg}`);
  }
  return res.body;
}

export default function AgentGenerate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = (localStorage.getItem("agent_lang") || "en") as Lang;
    setLang(saved === "te" ? "te" : saved === "hi" ? "hi" : "en");
  }, []);

  // gather previous steps (local only)
  const getJSON = (k: string) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const step1 = getJSON("agent_step1") || {};
  const business = getJSON("agent_business") || {};
  const target = getJSON("agent_target") || {};
  const method = getJSON("agent_method") || {};
  const contact = getJSON("agent_contact") || {};

  const [instructions, setInstructions] = useState<string>(localStorage.getItem("agent_instructions_final") || "");
  const [generated, setGenerated] = useState<boolean>(!!instructions);
  const [editing, setEditing] = useState<boolean>(false);
  const [banner, setBanner] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);

  // MODELS: strictly NO token
  const [models, setModels] = useState<string[]>([]);
  const [modelId, setModelId] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchSmart(`${BASE_URL}/student-service/user/models`, { method: "GET" }); // no headers
        if (!res.ok) throw new Error(`models ${res.status}: ${typeof res.body === "string" ? res.body : JSON.stringify(res.body)}`);

        const raw = res.body;
        let arr: string[] = [];
        if (Array.isArray(raw)) {
          arr = raw.map((x) => (typeof x === "string" ? x : x?.id)).filter(Boolean);
        } else if (Array.isArray(raw?.models)) {
          arr = raw.models.map((x: any) => (typeof x === "string" ? x : x?.id)).filter(Boolean);
        } else if (raw?.object === "list" && Array.isArray(raw?.data)) {
          arr = raw.data.map((m: any) => m?.id).filter(Boolean);
        }
        if (!arr.length) throw new Error("No models parsed");
        setModels(arr);
        setModelId(arr[0] || "");
      } catch (e) {
        console.error(e);
        const fallback = ["gpt-4o", "gpt-4o-mini"];
        setModels(fallback);
        setModelId(fallback[0]);
        setBanner({ kind: "warn", text: "Models API unavailable — using fallback list." });
      }
    })();
  }, []);

  const [enableFileSearch, setEnableFileSearch] = useState<boolean>(false);
  const [enableCodeInterpreter, setEnableCodeInterpreter] = useState<boolean>(false);

  // uploads (local only)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const ACCEPT = ".pdf,.doc,.docx,.txt,.md,.rtf,.csv,.xlsx,.xls,.ppt,.pptx,.json,.html";
  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    Promise.all(list.map(async (file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
      let preview: string | undefined, url: string | undefined;
      try { url = URL.createObjectURL(file); } catch {}
      const isTextLike = /^text\//.test(file.type) || /\.(txt|md|csv|json|html|rtf)$/i.test(file.name);
      if (isTextLike && file.size <= 1024 * 200) {
        try { preview = await file.text(); if (preview.length > 800) preview = preview.slice(0, 800) + " …"; } catch {}
      }
      return { id, name: file.name, size: file.size, type: file.type || "application/octet-stream", url, preview } as UploadedDoc;
    })).then((created) => {
      setUploadedDocs((prev) => [...prev, ...created]);
      setBanner({ kind: "ok", text: `${list.length} file(s) added.` });
    });
  };
  const onInputFiles = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; };
  const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const removeDoc = (id: string) => setUploadedDocs((prev) => prev.filter((d) => d.id !== id));

  // UI steppers
  const steps = [
    { label: "Create Agent", path: ROUTES.step1 },
    { label: "Business Context", path: ROUTES.step2 },
    { label: "Target & Problem", path: ROUTES.step3 },
    { label: "Method & Process", path: ROUTES.step4 },
    { label: "Contact", path: ROUTES.step5 },
    { label: "Generate Instructions", path: CURRENT_ROUTE },
  ];
  const activeIndex = steps.findIndex((s) => s.path === pathname);

  const buildDescription = () => {
    const parts = [
      business?.agentName ? `Agent: ${business.agentName}` : "",
      business?.domain ? `Domain: ${business.domain}` : "",
      business?.subdomain ? `Sub: ${business.subdomain}` : "",
      target?.summary ? `Target: ${target.summary}` : "",
      target?.ageRange ? `Age: ${target.ageRange}` : "",
      Array.isArray(target?.gender) && target.gender.length ? `Gender: ${target.gender.join(",")}` : "",
      method?.style ? `Style: ${method.style}` : "",
      method?.process ? `Process: ${method.process}` : "",
      method?.solutions ? `Solutions: ${method.solutions}` : "",
      contact?.tone ? `Tone: ${contact.tone}` : "",
    ].filter(Boolean);
    return parts.join(" | ");
  };

  // GENERATE → POST classifyInstruct (token optional; no Content-Type since no body)
  const generateInstructions = async () => {
    localStorage.setItem("agent_generate_request", JSON.stringify({ step1, business, target, method, contact, at: new Date().toISOString() }));

    const desc =
      buildDescription() ||
      business?.uniqueSolution ||
      business?.existingSolved ||
      "Create helpful assistant instructions";
    const token = getAuthToken();

    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const url = `${BASE_URL}/ai-service/agent/classifyInstruct?description=${encodeURIComponent(desc)}`;
      const res = await fetchSmart(url, { method: "POST", headers }); // no body, no content-type

      if (!res.ok) {
        const msg = typeof res.body === "string" ? res.body : JSON.stringify(res.body);
        throw new Error(`classifyInstruct failed (${res.status}): ${msg}`);
      }

      const data = res.body;
      const text = typeof data === "string" ? data : (data?.instructions || data?.message || JSON.stringify(data));
      const trimmed = (text || "").slice(0, 7000);
      setInstructions(trimmed);
      setGenerated(true);
      setEditing(false);
      setBanner({ kind: "ok", text: "Instructions generated." });
    } catch (e: any) {
      console.error(e);
      const fallback = [
        `**${business.agentName || "Your Agent"}** should follow these instructions:`,
        `• Start by asking: “${method.firstQ || "What is your current monthly income?"}”`,
        `• Style: ${method.style || "Analytical"}; Tone: ${contact.tone || "Friendly"}.`,
        `• Target: ${target.summary || "-"} (Age: ${target.ageRange || "-"}; Gender: ${(Array.isArray(target.gender) ? target.gender.join(", ") : "-") || "-"})`,
        `• Provide ${method.solutions || "1"} solution(s). Process: ${method.process || "Gather data → analyze → compare → recommend → next steps."}`,
        `• Closing: ${contact.closing || "If you have any questions, email me — happy to help."}`,
      ].join("\n");
      setInstructions(fallback.slice(0, 7000));
      setGenerated(true);
      setEditing(false);
      setBanner({ kind: "warn", text: "Generator API unavailable — used fallback." });
    }
  };

  // SAVE draft locally
  const saveDraft = () => {
    const trimmed = (instructions || "").slice(0, 7000);
    localStorage.setItem("agent_instructions_final", trimmed);
    localStorage.setItem("agent_instructions_status", "draft");
    setBanner({ kind: "ok", text: "Draft saved." });
  };

  // PUBLISH → PATCH agentCreation
  const publish = async () => {
    if (!generated) { setBanner({ kind: "warn", text: "Generate instructions first." }); return; }
    if (!modelId)   { setBanner({ kind: "warn", text: "Select a model." }); return; }

    const instr = (instructions || "").slice(0, 7000);

    const body = clean({
      // Step 1
      userRole: step1?.role,
      userExperience: 0,
      userExperienceSummary: step1?.experience,
      description: step1?.problems,
      acheivements: step1?.strength,
      language: step1?.lang || lang,
      // Step 2
      agentName: business?.agentName,
      domain: business?.domain,
      subDomain: business?.subdomain,
      business: [business?.domain, business?.subdomain].filter(Boolean).join(" / "),
      uniqueSolution: business?.ideaType === "new" ? business?.uniqueSolution : undefined,
      mainProblemSolved: business?.ideaType === "solve" ? business?.existingSolved : undefined,
      // Step 3
      targetUser: target?.summary,
      ageLimit: target?.ageRange,
      gender: Array.isArray(target?.gender) && target.gender.length ? target.gender.join(",") : undefined,
      // Step 4
      conStarter1: method?.firstQ,
      responseFormat: "text",
      // Step 5
      shareYourFeedback: contact?.closing,
      // Step 6
      assistantId: modelId,
      instructions: instr,

      // defaults
      agentStatus: "CREATED",
      status: "APPROVED",
      activeStatus: true,
      voiceStatus: true,
      rateThisPlatform: 0,
      usageModel: "free",
    });

    try {
      await patchAgent(body);
      localStorage.setItem("agent_instructions_final", instr);
      localStorage.setItem("agent_instructions_status", "published");
      setBanner({ kind: "ok", text: "Published!" });
    } catch (e: any) {
      console.error(e);
      setBanner({ kind: "warn", text: e?.message || "Publish failed. Please try again." });
    }
  };

  // UI
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-800">Step 6: Generate Instructions</h1>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100"><div className="h-2 w-full rounded-full bg-gradient-to-r from-purple-600 to-amber-500" /></div>
        <nav className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {[
            { label: "Create Agent", path: ROUTES.step1 },
            { label: "Business Context", path: ROUTES.step2 },
            { label: "Target & Problem", path: ROUTES.step3 },
            { label: "Method & Process", path: ROUTES.step4 },
            { label: "Contact", path: ROUTES.step5 },
            { label: "Generate Instructions", path: CURRENT_ROUTE },
          ].map((step, idx) => (
            <button key={step.label} type="button" onClick={() => navigate(step.path!)} className={`inline-flex items-center gap-2 ${idx === steps.findIndex(s => s.path === pathname) ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${idx === steps.findIndex(s => s.path === pathname) ? "bg-gradient-to-r from-purple-600 to-amber-500" : "bg-gray-400"}`} />
              <span className="whitespace-nowrap">{step.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Row */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <label className="block text-sm font-semibold mb-1">Model</label>
          <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
            {models.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>

        <div className="rounded-xl border p-4">
          <label className="block text-sm font-semibold mb-2">Capabilities</label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={enableFileSearch} onChange={(e) => setEnableFileSearch(e.target.checked)} />
            <span>Enable File Search</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableCodeInterpreter} onChange={(e) => setEnableCodeInterpreter(e.target.checked)} />
            <span>Enable Code Interpreter</span>
          </label>
        </div>

        <div className="rounded-xl border p-4">
          <label className="block text-sm font-semibold mb-1">Upload documents</label>
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="rounded-lg border border-dashed p-4 text-sm text-gray-600">
            Drag & drop files here, or <label className="underline cursor-pointer"><input type="file" multiple accept={ACCEPT} className="hidden" onChange={onInputFiles} />choose files</label>
          </div>
          {!!uploadedDocs.length && (
            <ul className="mt-2 text-xs space-y-1">
              {uploadedDocs.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <button className="text-red-600" onClick={() => removeDoc(f.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Generate / Edit */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={generateInstructions} className="rounded-lg px-3 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">Generate Instructions</button>
          <button onClick={() => setEditing((e) => !e)} className="rounded-lg px-3 py-2 border">{editing ? "Stop Editing" : "Edit"}</button>
          <span className="ml-auto text-xs text-gray-500">{(instructions || "").length}/7000</span>
        </div>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value.slice(0, 7000))} rows={14} className="w-full rounded-lg border px-3 py-2" placeholder="Generated instructions will appear here…" />
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={saveDraft} className="rounded-lg px-4 py-2 border">Save as Draft</button>
        <button onClick={publish} className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-amber-500">Publish</button>
        {banner && <span className={`${banner.kind === "ok" ? "text-green-700" : "text-amber-700"} text-sm`}>{banner.text}</span>}
      </div>
    </div>
  );
}
