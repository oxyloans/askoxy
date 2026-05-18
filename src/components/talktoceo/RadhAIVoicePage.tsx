// pages/RadhAIVoicePage.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Coins,
  Cpu,
  Landmark,
  Languages,
  Play,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import BASE_URL from "../../Config";

type LanguageCode = "te" | "en" | "hi";

type LocalLanguageConfig = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechLang: string;
  imageUrl: string;
  assistantName: string;
};

type LocalChatMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

const AUTH_TOKEN =
  sessionStorage.getItem("accessToken") ||
  localStorage.getItem("accessToken") ||
  process.env.REACT_APP_AUTH_TOKEN ||
  "";

const ASSISTANT_ID = "radhAI";
const VOICE_MODE = "ash";
const REALTIME_MODEL = "gpt-4o-realtime-preview-2025-06-03";

const RADHAI_IMAGE = "https://i.ibb.co/RpvNHZCj/ceoai.png";

const LANGUAGES_DATA: Record<LanguageCode, LocalLanguageConfig> = {
  te: {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechLang: "te-IN",
    imageUrl: RADHAI_IMAGE,
    assistantName: "radhAI",
  },
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    speechLang: "en-US",
    imageUrl: RADHAI_IMAGE,
    assistantName: "radhAI",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechLang: "hi-IN",
    imageUrl: RADHAI_IMAGE,
    assistantName: "radhAI",
  },
};

const getInstructionsByLanguage = (code: LanguageCode) => {
  const common = `
You are radhAI, the AI voice clone of Mr. Radhakrishna Thatavarti.

You represent the OXY ecosystem:
- ASKOXY.AI: AI-Z Marketplace for AI agents, jobs, tools, business automation, gold comparison, and digital services.
- OXYLOANS: RBI-approved P2P NBFC platform for borrowers, lenders, loans, and investment-related guidance.
- OXYBRICKS.WORLD: fractional ownership and real estate technology platform.
- OXYGOLD.AI: digital gold ecosystem for gold comparison, gold SIP, bullion, transparency, and AI-powered gold services.
- OXYGLOBAL.TECH: global business ecosystem connecting People, Platforms, Products, and Capital.
- ASKOXY Study Abroad: international education, universities, student guidance, and career opportunities.

Your personality:
- Speak like a professional CEO AI assistant.
- Be confident, friendly, practical, and motivational.
- Keep answers short, clear, natural, and voice-friendly.
- Use simple language for users.
- Give useful business, AI, jobs, finance, gold, real estate, and study-abroad guidance.

Important rules:
- Use provided Radha Chat API context as the main source of truth.
- If company-specific information is not available, do not invent it.
- Do not say "API context" or "Radha Chat API" to the user.
- For loans, investments, gold, or real estate, avoid guaranteed returns or misleading promises.
- Ask users to verify final financial details with official support when needed.
- If the user asks for detailed information, give a structured but still conversational answer.
`;

  if (code === "te") {
    return `${common}

Always answer only in Telugu.
Use English only for brand names or technical terms.
Speak naturally like a Telugu business mentor.`;
  }

  if (code === "hi") {
    return `${common}

Always answer only in Hindi.
Use English only for brand names or technical terms.
Speak naturally like a Hindi business mentor.`;
  }

  return `${common}

Always answer only in English.
Speak naturally like a professional CEO AI assistant.`;
};

const RADHA_CHAT_API =
  "https://radhaclone-production.up.railway.app/api/v1/radha/chat";

const callRadhaChatApi = async (message: string): Promise<string> => {
  console.log("Radha Chat API URL:", RADHA_CHAT_API);
  console.log("Text sent to Radha Chat API:", message);
  console.log("Radha Chat API Payload:", { message });
  console.log(message);

  const res = await fetch(RADHA_CHAT_API, {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const text = await res.text();

  console.log("Radha Chat API Status:", res.status);
  console.log("Radha Chat API Raw Response:", text);

  if (!res.ok) {
    throw new Error(`Radha chat API failed: ${res.status} ${text}`);
  }

  try {
    const data = JSON.parse(text);
    console.log("Radha Chat API Parsed Response:", data);

    return (
      data?.response || data?.message || data?.answer || data?.content || text
    );
  } catch {
    return text;
  }
};

export default function RadhAIVoicePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialLanguageCode = ((
    location.state as { languageCode?: LanguageCode }
  )?.languageCode || "en") as LanguageCode;

  const [languageCode, setLanguageCode] =
    useState<LanguageCode>(initialLanguageCode);

  const selectedLanguage = LANGUAGES_DATA[languageCode];

  const [chat, setChat] = useState<LocalChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const recognitionRef = useRef<any>(null);

  const services = useMemo(
    () => [
      { title: "Jobs", icon: Briefcase },
      { title: "AI", icon: Cpu },
      { title: "Loans", icon: Landmark },
      { title: "Investments", icon: TrendingUp },
      { title: "Gold", icon: Coins },
    ],
    [],
  );

  const addMessage = (message: LocalChatMessage) => {
    setChat((prev) => {
      if (message.role === "assistant") {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), message];
        }
      }

      return [...prev, message];
    });
  };

  const stopSession = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}

    try {
      dataChannelRef.current?.close();
    } catch {}

    try {
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
    } catch {}

    try {
      peerConnectionRef.current?.close();
    } catch {}

    recognitionRef.current = null;
    dataChannelRef.current = null;
    micStreamRef.current = null;
    peerConnectionRef.current = null;

    setIsSessionActive(false);
    setIsAssistantSpeaking(false);
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString(),
    });

    try {
      const apiAnswer = await callRadhaChatApi(text);
      sendMessageToRealtime(text, apiAnswer);
    } catch (error) {
      console.error("Radha Chat API error:", error);
      sendMessageToRealtime(text);
    }
  };

  const sendMessageToRealtime = (text: string, apiContext?: string) => {
    const dc = dataChannelRef.current;

    if (!dc || dc.readyState !== "open") {
      console.warn("Data channel not open");
      return;
    }

    const finalText = apiContext
      ? `
User question:
${text}

Verified knowledge:
${apiContext}

Now answer naturally in ${selectedLanguage.name}.
Use the verified knowledge as the main source.
Do not mention API, backend, or context to the user.
Keep the answer short and voice-friendly.
`
      : `
User question:
${text}

Answer naturally in ${selectedLanguage.name}.
If exact company information is not available, say it politely instead of guessing.
`;

    dc.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: finalText }],
        },
      }),
    );

    dc.send(JSON.stringify({ type: "response.create" }));
  };

  const getEphemeralToken = async (instructions: string): Promise<string> => {
    const assistantId = "";
    const voicemode = VOICE_MODE.toLowerCase();

    const tokenUrl = `${BASE_URL}/student-service/user/voicetoken?assistantId=${encodeURIComponent(
      assistantId,
    )}&voicemode=${encodeURIComponent(voicemode)}`;

    console.log("Voice Token API:", tokenUrl);
    console.log("Voice Token Payload:", { instructions });
    console.log("Assistant ID:", assistantId);
    console.log("Voice Mode:", voicemode);
    console.log("Has Auth Token:", Boolean(AUTH_TOKEN));

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instructions: instructions,
      }),
    });

    const rawText = await res.text();

    if (!res.ok) {
      throw new Error(`Voice token API failed: ${res.status} ${rawText}`);
    }

    const data = JSON.parse(rawText);

    if (!data?.client_secret?.value) {
      throw new Error("client_secret.value missing in voice token response");
    }

    return data.client_secret.value;
  };

  const setupSpeechRecognition = () => {
    const BrowserSpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!BrowserSpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new BrowserSpeechRecognition();

    recognition.lang = selectedLanguage.speechLang;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      if (!transcript) return;

      handleUserMessage(transcript);
    };

    recognition.onerror = (error: any) => {
      console.error("Speech recognition error:", error);
    };

    recognition.onend = () => {
      if (
        dataChannelRef.current &&
        dataChannelRef.current.readyState === "open"
      ) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const setupDataChannelHandlers = (dc: RTCDataChannel) => {
    let assistantBuffer = "";

    dc.onopen = () => {
      console.log("Data channel opened");
    };

    dc.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Realtime event:", data.type, data);

        if (
          (data.type === "response.output_text.delta" ||
            data.type === "response.audio_transcript.delta") &&
          data.delta
        ) {
          assistantBuffer += data.delta;
          setIsAssistantSpeaking(true);

          addMessage({
            role: "assistant",
            text: assistantBuffer,
            timestamp: new Date().toLocaleTimeString(),
          });
        }

        if (data.type === "response.audio.delta") {
          setIsAssistantSpeaking(true);
        }

        if (
          data.type === "response.done" ||
          data.type === "response.stop" ||
          data.type === "output_audio_buffer.stopped" ||
          data.type === "response.audio.done" ||
          data.type === "response.audio_transcript.done"
        ) {
          setIsAssistantSpeaking(false);
          assistantBuffer = "";
        }
      } catch (error) {
        console.error("Data channel event parse error:", error);
      }
    };

    dc.onerror = (error) => {
      console.error("Data channel error:", error);
    };

    dc.onclose = () => {
      console.log("Data channel closed");
      setIsAssistantSpeaking(false);
    };
  };

  const handleStartSession = async () => {
    try {
      setIsConnecting(true);
      setIsSessionActive(false);
      setIsAssistantSpeaking(false);
      setChat([]);
      setInput("");

      stopSession();

      const instructions = getInstructionsByLanguage(languageCode);
      const ephemeralKey = await getEphemeralToken(instructions);

      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      micStreamRef.current = micStream;
      pc.addTrack(micStream.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;
      setupDataChannelHandlers(dc);

      setupSpeechRecognition();

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const realtimeUrl = `https://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`;

      console.log("Voice WebRTC API:", realtimeUrl);

      const sdpRes = await fetch(realtimeUrl, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });

      const answerText = await sdpRes.text();

      if (!sdpRes.ok) {
        throw new Error(`Realtime API failed: ${sdpRes.status} ${answerText}`);
      }

      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerText,
      });

      setIsSessionActive(true);
    } catch (error) {
      console.error("radhAI voice session failed:", error);
      alert(
        "Voice session failed. Please check token API, auth token, and console.",
      );
      stopSession();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLanguageChange = (code: LanguageCode) => {
    if (code === languageCode || isConnecting) return;

    stopSession();
    setChat([]);
    setInput("");
    setLanguageCode(code);

    navigate("/radhAI-talk", {
      replace: true,
      state: { languageCode: code },
    });
  };

  const handleBack = () => {
    stopSession();
    navigate("/talktoceo");
  };

  const handleSend = async () => {
    if (!input.trim() || isConnecting || !isSessionActive) return;
    const text = input.trim();
    setInput("");

    await handleUserMessage(text);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(0,245,255,0.22),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(132,255,0,0.14),transparent_34%)]" />

      <div className="fixed inset-0 opacity-[0.08]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050816]/80 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_10px_28px_rgba(0,0,0,.35)] transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-1"
            />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-200 via-lime-200 to-cyan-400 text-black shadow-[0_0_28px_rgba(0,245,255,.45),inset_0_2px_0_rgba(255,255,255,.7)]">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-base font-black leading-none sm:text-lg">
                radhAI
              </h1>
              <p className="text-[11px] text-slate-400 sm:text-xs">
                {selectedLanguage.nativeName} Voice Session
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-xs font-black text-lime-200 sm:block">
            {isConnecting
              ? "Connecting"
              : isAssistantSpeaking
                ? "Speaking"
                : isSessionActive
                  ? "Listening"
                  : "Ready"}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-5 px-4 pb-6 pt-24 sm:px-6 lg:grid-cols-[42%_58%] lg:gap-6 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 28, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex flex-col justify-center overflow-hidden rounded-[34px] border border-white/15 bg-white/[0.07] p-5 shadow-[0_30px_90px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,.25)]">
            <Sparkles size={14} />
            CEO AI Clone
          </div>

          <div className="relative flex items-center justify-center rounded-[28px] border border-white/10 bg-black/20 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.12)]">
            <motion.img
              src={RADHAI_IMAGE}
              alt="radhAI"
              animate={{
                scale: isAssistantSpeaking ? 1.05 : 1,
                y: isSessionActive ? [0, -6, 0] : 0,
              }}
              transition={{
                scale: { duration: 0.35 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`max-h-[460px] w-full object-contain transition duration-500 ${
                isAssistantSpeaking
                  ? "drop-shadow-[0_0_55px_rgba(132,255,0,0.48)]"
                  : "drop-shadow-[0_0_40px_rgba(0,245,255,0.28)]"
              }`}
            />

            <div className="absolute left-4 top-4 rounded-full border border-lime-300/30 bg-black/60 px-4 py-2 text-xs font-black text-lime-200 shadow-[0_0_24px_rgba(132,255,0,.2)] backdrop-blur-xl">
              {isConnecting
                ? "● Connecting"
                : isAssistantSpeaking
                  ? "● Speaking"
                  : isSessionActive
                    ? "● Listening"
                    : "● Ready"}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  whileHover={{ y: -4, scale: 1.04 }}
                  key={item.title}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_12px_30px_rgba(0,0,0,.25)]"
                >
                  <Icon size={16} className="text-cyan-300" />
                  {item.title}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="flex min-h-[74vh] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-white/[0.07] shadow-[0_30px_90px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl"
        >
          <div className="border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="text-lg font-black">
                  {selectedLanguage.code === "te" && "తెలుగు సంభాషణ"}
                  {selectedLanguage.code === "en" && "English Conversation"}
                  {selectedLanguage.code === "hi" && "हिन्दी बातचीत"}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(Object.keys(LANGUAGES_DATA) as LanguageCode[]).map((code) => {
                  const lang = LANGUAGES_DATA[code];
                  const active = code === languageCode;

                  return (
                    <button
                      key={code}
                      disabled={active || isConnecting}
                      onClick={() => handleLanguageChange(code)}
                      className={`rounded-full border px-3 py-2 text-xs font-black shadow-[inset_0_1px_0_rgba(255,255,255,.18)] transition hover:-translate-y-0.5 ${
                        active
                          ? "border-lime-300/70 bg-gradient-to-r from-lime-200 to-cyan-200 text-black shadow-[0_0_24px_rgba(132,255,0,.24)]"
                          : "border-white/15 bg-white/[0.08] text-slate-200 hover:border-cyan-300/50"
                      } disabled:cursor-not-allowed`}
                    >
                      {lang.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={isSessionActive ? stopSession : handleStartSession}
                disabled={isConnecting}
                className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-sm font-black transition-all duration-300 disabled:opacity-50 sm:w-auto sm:min-w-[170px] ${
                  isSessionActive
                    ? "border border-red-300/40 bg-gradient-to-br from-red-500/25 via-red-500/15 to-orange-400/20 text-red-100 shadow-[0_18px_40px_rgba(239,68,68,.22),inset_0_2px_0_rgba(255,255,255,.18)]"
                    : "border border-cyan-200/40 bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 text-black shadow-[0_18px_45px_rgba(0,245,255,.28),inset_0_2px_0_rgba(255,255,255,.75)]"
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/25 opacity-60" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSessionActive ? (
                    <>
                      <X size={18} />
                      Stop Session
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      {isConnecting ? "Connecting..." : "Start Session"}
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </div>

          <div
            ref={chatRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
          >
            {isConnecting ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
                  <p className="font-bold text-cyan-300">
                    Connecting radhAI...
                  </p>
                </div>
              </div>
            ) : chat.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.06] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,.16)]">
                  <Bot className="mx-auto mb-3 text-cyan-300" size={34} />
                  <p className="font-bold text-slate-200">
                    Click Start Session
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Activate radhAI voice conversation.
                  </p>
                </div>
              </div>
            ) : (
              chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-xl backdrop-blur-xl sm:max-w-[78%] ${
                      msg.role === "user"
                        ? "rounded-br-md border border-cyan-200/25 bg-gradient-to-br from-cyan-500 to-blue-700"
                        : "rounded-bl-md border border-fuchsia-200/25 bg-gradient-to-br from-violet-600 to-fuchsia-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="mt-2 block text-[10px] text-white/70">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={input}
                disabled={isConnecting || !isSessionActive}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  isSessionActive
                    ? "Type your message..."
                    : "Start voice session first..."
                }
                className="flex-1 rounded-2xl border border-white/15 bg-black/35 px-5 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)] outline-none placeholder:text-slate-500 focus:border-cyan-300/60 disabled:opacity-50"
              />

              <button
                onClick={handleSend}
                disabled={isConnecting || !isSessionActive}
                className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-200/40 bg-gradient-to-br from-lime-200 via-cyan-200 to-cyan-400 px-5 py-3 font-black text-black shadow-[0_14px_34px_rgba(0,245,255,.22),inset_0_2px_0_rgba(255,255,255,.7)] transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
