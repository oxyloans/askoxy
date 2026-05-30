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
const REALTIME_MODEL = "gpt-realtime";

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

const RADHA_CHAT_API = " ";

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
          content: [
            {
              type: "input_text",
              text: finalText,
            },
          ],
        },
      }),
    );

    dc.send(
      JSON.stringify({
        type: "response.create",
      }),
    );
  };

  const getEphemeralToken = async (instructions: string): Promise<string> => {
    console.log("BASE_URL:", BASE_URL);
    console.log("ASSISTANT_ID:", ASSISTANT_ID);
    console.log("VOICE_MODE:", VOICE_MODE);

    const res = await fetch(
      `${BASE_URL}/student-service/user/voicetoken?assistantId=${ASSISTANT_ID}&voicemode=${VOICE_MODE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instructions }),
      },
    );

    const responseText = await res.text();

    console.log("Voice Token Status:", res.status);
    console.log("Voice Token Response:", responseText);

    if (!res.ok) {
      throw new Error(`Voice token API failed: ${res.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);

    if (!data?.value) {
      throw new Error(`No token received from backend: ${responseText}`);
    }

    return data.value;
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
      console.log("🟢 Data channel opened");

      dc.send(
        JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["audio", "text"],
            voice: "shimmer",
          },
        }),
      );
    };

    dc.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Realtime event:", data.type, data);

        switch (data.type) {
          case "response.output_text.delta":
            assistantBuffer += data.delta || "";

            addMessage({
              role: "assistant",
              text: assistantBuffer,
              timestamp: new Date().toLocaleTimeString(),
            });
            break;

          case "response.output_text.done":
            assistantBuffer = "";
            break;

          case "response.audio.delta":
            setIsAssistantSpeaking(true);
            break;

          case "response.audio.done":
            setIsAssistantSpeaking(false);
            break;

          case "error":
            console.error("Realtime Error:", data);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error("Data channel parse error:", error);
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

  const waitForMicUnmuted = (track: MediaStreamTrack) => {
    return new Promise<void>((resolve) => {
      if (!track.muted) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        console.warn("Mic still muted after wait, continuing...");
        resolve();
      }, 1500);

      track.onunmute = () => {
        console.log("🎤 Mic track unmuted");
        clearTimeout(timeout);
        resolve();
      };
    });
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

      console.log("Ephemeral Key:", ephemeralKey);

      if (!ephemeralKey) {
        throw new Error("Empty ephemeral token received");
      }

      const pc = new RTCPeerConnection();

      pc.oniceconnectionstatechange = () => {
        console.log("🧊 ICE state:", pc.iceConnectionState);
      };

      pc.onconnectionstatechange = () => {
        console.log("🔗 PC state:", pc.connectionState);
      };

      pc.onicegatheringstatechange = () => {
        console.log("🧊 ICE gathering:", pc.iceGatheringState);
      };
      peerConnectionRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      micStreamRef.current = micStream;

      const audioTrack = micStream.getAudioTracks()[0];
      audioTrack.onmute = () => {
        console.warn("🎤 Mic track muted");
      };

      audioTrack.onunmute = () => {
        console.log("🎤 Mic track unmuted");
      };

      audioTrack.onended = () => {
        console.warn("🎤 Mic track ended");
      };

      if (!audioTrack) {
        throw new Error("No microphone audio track found");
      }

      console.log("🎤 Mic tracks:", micStream.getAudioTracks());
      console.log("🎤 Mic enabled:", audioTrack.enabled);
      console.log("🎤 Mic readyState:", audioTrack.readyState);
      console.log("🎤 Audio track settings:", audioTrack.getSettings());

      await waitForMicUnmuted(audioTrack);

      const sender = pc.addTrack(audioTrack, micStream);
      console.log("🎤 Audio sender track:", sender.track);

      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;
      setupDataChannelHandlers(dc);

      console.log("📡 Senders:", pc.getSenders());
      console.log("📡 Transceivers:", pc.getTransceivers());

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
      });

      await pc.setLocalDescription(offer);

      const realtimeUrl = "https://api.openai.com/v1/realtime/calls";

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

      console.log("Realtime Status:", sdpRes.status);
      console.log("Realtime Response:", answerText);

      if (!sdpRes.ok) {
        throw new Error(`Realtime API failed: ${sdpRes.status} ${answerText}`);
      }

      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerText,
      });

      console.log("Realtime session connected");

      setIsSessionActive(true);

      setupSpeechRecognition();
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
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="fixed inset-0 bg-[length:52px_52px,52px_52px,auto,auto,auto] bg-[linear-gradient(rgba(92,225,230,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(92,225,230,0.07)_1px,transparent_1px),radial-gradient(circle_at_18%_20%,rgba(44,224,231,0.22),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(176,104,255,0.24),transparent_34%),radial-gradient(circle_at_52%_95%,rgba(174,255,91,0.12),transparent_35%)]" />

      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#5CE1E6]/15 bg-[#070B18]/92 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 lg:px-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white transition hover:border-[#5CE1E6]/45 hover:bg-[#5CE1E6]/10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] text-[#051018] shadow-[0_0_30px_rgba(212,175,55,.28)] sm:h-11 sm:w-11">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-sm font-black sm:text-lg">radhAI</h1>
              <p className="text-[10px] text-[#B8C2D8] sm:text-xs">
                {selectedLanguage.nativeName} Voice
              </p>
            </div>
          </div>

          <div className="rounded-full bg-gradient-to-r from-[#B8FF5E] to-[#5CE1E6] px-3 py-2 text-[10px] font-black text-[#051018] shadow-[0_0_24px_rgba(92,225,230,.22)] sm:px-4 sm:text-xs">
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

      <main className="relative z-10 mx-auto grid max-w-7xl gap-4 px-3 pb-4 pt-24 sm:px-6 sm:pt-24 lg:min-h-screen lg:grid-cols-[37%_63%] lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-[32px] border border-[#5CE1E6]/15 bg-white/[0.075] p-5 shadow-[0_30px_90px_rgba(0,0,0,.45)] backdrop-blur-2xl lg:block"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5CE1E6]/30 bg-[#5CE1E6]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5CE1E6]">
            <Sparkles size={14} />
            CEO AI Clone
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#5CE1E6]/15 bg-[#121827]/55 p-3">
            <motion.img
              src={RADHAI_IMAGE}
              alt="radhAI"
              animate={{
                scale: isAssistantSpeaking ? 1.04 : 1,
                y: isSessionActive ? [0, -5, 0] : 0,
              }}
              transition={{
                scale: { duration: 0.35 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              className="mx-auto max-h-[500px] w-full object-contain"
            />

            <div className="absolute left-4 top-4 rounded-full border border-[#5CE1E6]/30 bg-[#050816]/80 px-4 py-2 text-xs font-black text-[#E9FBFF] backdrop-blur-xl">
              {isConnecting
                ? "● Connecting"
                : isAssistantSpeaking
                  ? "● Speaking"
                  : isSessionActive
                    ? "● Listening"
                    : "● Ready"}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center justify-center gap-2 rounded-full border border-[#5CE1E6]/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-[#F7FAFF]"
                >
                  <Icon size={15} className="text-[#5CE1E6]" />
                  {item.title}
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex min-h-[calc(100vh-104px)] flex-col overflow-hidden rounded-[22px] border border-[#5CE1E6]/15 bg-[#121827]/72 shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:rounded-[28px] lg:min-h-[78vh]"
        >
          <div className="border-b border-white/10 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5CE1E6]/10 text-[#5CE1E6]">
                    <Languages size={17} />
                  </div>
                  <div>
                    <h3 className="text-base font-black sm:text-lg">
                      {selectedLanguage.code === "te" && "తెలుగు సంభాషణ"}
                      {selectedLanguage.code === "en" && "English Voice"}
                      {selectedLanguage.code === "hi" && "हिन्दी बातचीत"}
                    </h3>
                    <p className="mt-1 text-xs text-[#B8C2D8]">
                      Choose your language and start speaking.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
                onClick={isSessionActive ? stopSession : handleStartSession}
                disabled={isConnecting}
                className={`w-full rounded-xl px-5 py-3 text-sm font-black shadow-lg transition disabled:opacity-50 sm:w-auto ${
                  isSessionActive
                    ? "border border-red-300/40 bg-red-500/15 text-red-100"
                    : "bg-gradient-to-r from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] text-[#051018] hover:brightness-110"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSessionActive ? <X size={18} /> : <Play size={18} />}
                  {isSessionActive
                    ? "Stop Voice"
                    : isConnecting
                      ? "Connecting..."
                      : "Start Voice"}
                </span>
              </motion.button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(Object.keys(LANGUAGES_DATA) as LanguageCode[]).map((code) => {
                const lang = LANGUAGES_DATA[code];
                const active = code === languageCode;

                return (
                  <button
                    key={code}
                    disabled={active || isConnecting}
                    onClick={() => handleLanguageChange(code)}
                    className={`rounded-xl border px-2 py-2.5 text-center text-[11px] font-black transition sm:px-3 sm:text-xs ${
                      active
                        ? "border-[#B8FF5E] bg-gradient-to-r from-[#FFF6D8] to-[#5CE1E6] text-[#051018]"
                        : "border-[#5CE1E6]/15 bg-white/[0.07] text-[#F7FAFF] hover:border-[#B8FF5E]/50"
                    }`}
                  >
                    <span className="block">{lang.nativeName}</span>
                    <span className="mt-1 block text-[10px] opacity-75">
                      {lang.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex shrink-0 items-center justify-center gap-1 rounded-full border border-[#5CE1E6]/15 bg-white/[0.07] px-3 py-2 text-[10px] font-bold text-[#F7FAFF]"
                  >
                    <Icon size={13} className="text-[#5CE1E6]" />
                    {item.title}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={chatRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
          >
            {isConnecting ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-white/12 border-t-[#5CE1E6]" />
                  <p className="font-bold text-[#5CE1E6]">
                    Connecting radhAI...
                  </p>
                </div>
              </div>
            ) : chat.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="w-full max-w-sm rounded-[22px] border border-[#5CE1E6]/15 bg-white/[0.07] px-5 py-7">
                  <Bot className="mx-auto mb-3 text-[#5CE1E6]" size={36} />
                  <p className="font-bold text-[#F7FAFF]">Tap Start Voice</p>
                  <p className="mt-1 text-sm text-[#B8C2D8]">
                    Ask your question by voice or type below.
                  </p>
                </div>
              </div>
            ) : (
              chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-xl sm:max-w-[78%] ${
                      msg.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-[#B86BFF] via-[#5CE1E6] to-[#101A32] text-white"
                        : "rounded-bl-md bg-gradient-to-br from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] text-[#051018]"
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

          <div className="border-t border-[#5CE1E6]/15 p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                value={input}
                disabled={isConnecting || !isSessionActive}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  isSessionActive
                    ? "Type your message..."
                    : "Tap Start Voice first..."
                }
                className="min-w-0 flex-1 rounded-xl border border-[#5CE1E6]/15 bg-[#050816]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-[#8A94AA] focus:border-[#B8FF5E]/70 disabled:opacity-50"
              />

              <button
                onClick={handleSend}
                disabled={isConnecting || !isSessionActive}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] px-4 py-3 font-black text-[#051018] transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50 sm:px-5"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
