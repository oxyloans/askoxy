import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  Zap,
  StopCircle,
  Play,
} from "lucide-react";
import BASE_URL from "../Config";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

// Particle System Component (from page-1)
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 60;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        hue: Math.random() * 360,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime: number) {
      if (!ctx || !canvas) return;

      if (currentTime - lastTime >= frameInterval) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.hue += 0.3;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.alpha})`;
          ctx.fill();

          if (!isMobile) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[j].x - particle.x;
              const dy = particles[j].y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 80) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${
                  0.05 * (1 - distance / 80)
                })`;
                ctx.lineWidth = 0.3;
                ctx.stroke();
              }
            }
          }
        });

        lastTime = currentTime;
      }

      animationFrameRef.current = animationFrameRef.current =
        requestAnimationFrame(animate);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
}

function FloatingOrb() {
  return (
    <div className="relative flex items-center justify-center h-64 w-64 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-500 animate-pulse"></div>
      <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm"></div>
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 shadow-2xl animate-bounce"></div>
      <div className="absolute inset-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-lg"></div>
      </div>
    </div>
  );
}

function VoiceWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-gradient-to-t from-green-400 to-blue-500 rounded-full animate-pulse`}
          style={{
            height: `${Math.random() * 40 + 20}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
const RealTimeVoice: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const micStream = useRef<MediaStream | null>(null);

  async function startSession() {
    setIsConnecting(true);
    try {
      const res = await fetch(`${BASE_URL}/student-service/user/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        },
      });

      const data = await res.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      const pc = new RTCPeerConnection();
      peerConnection.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

      micStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      pc.addTrack(micStream.current.getTracks()[0]);
      setIsMicOn(true);

      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const model = "gpt-4o-realtime-preview-2025-06-03";
      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        }
      );

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpRes.text(),
      };
      await pc.setRemoteDescription(answer);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setIsConnecting(false);
    }
  }

  function stopSession() {
    dataChannel?.close();
    micStream.current?.getTracks().forEach((t) => t.stop());
    peerConnection.current?.close();

    setIsSessionActive(false);
    setIsMicOn(false);
    setChat([]);
    setDataChannel(null);
  }

  useEffect(() => {
    if (dataChannel) {
      dataChannel.onmessage = (e) => {
        const event = JSON.parse(e.data);

        if (event.type === "input_audio_buffer.speech") {
          if (event.transcript && event.is_final) {
            setChat((prev) => [
              {
                role: "user",
                text: event.transcript,
                timestamp: new Date().toLocaleTimeString(),
              },
              ...prev,
            ]);
          }
        }

        if (event.type === "response.output_text.delta" && event.delta) {
          setChat((prev) => {
            const updated = [...prev];
            const lastAssistant = updated.find((m) => m.role === "assistant");
            if (lastAssistant) {
              lastAssistant.text += event.delta;
            } else {
              updated.unshift({
                role: "assistant",
                text: event.delta,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
            return [...updated];
          });
        }

        if (event.type === "response.completed") {
          // could mark assistant bubble as "final"
        }
      };

      dataChannel.onopen = () => {
        setIsSessionActive(true);
        setChat([]);
      };
    }
  }, [dataChannel]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticleField />

      <div className="fixed inset-0 opacity-10 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-cyan-900/30 to-purple-900/30 backdrop-blur-xl border-b border-cyan-500/30"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse">
                <Zap size={18} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GENOXY
                </h1>
                <p className="text-cyan-300 text-xs sm:text-sm tracking-wider">
                  REAL-TIME VOICE ASSISTANT
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              {isSessionActive ? (
                <button
                  onClick={stopSession}
                  className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 text-sm sm:text-base"
                >
                  <StopCircle size={20} />
                  <span className="font-semibold">Stop</span>
                </button>
              ) : (
                <button
                  onClick={startSession}
                  disabled={isConnecting}
                  className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="font-semibold">Starting...</span>
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      <span className="font-semibold">Start</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col pt-20 sm:pt-24 overflow-y-auto overflow-x-hidden">
          {!isSessionActive ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <FloatingOrb />
              <div className="text-center mt-8 space-y-4">
                <h2 className="text-2xl sm:text-4xl font-bold mb-4 relative">
                  <span className="bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-bounce font-black tracking-wider drop-shadow-lg">
                    Welcome to GENOXY Voice Assistant
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-md mx-auto text-center">
                  Connect to start a real-time conversation with AI. Just speak
                  naturally and get instant responses.
                </p>
                <div className="mt-8">
                  <button
                    onClick={startSession}
                    disabled={isConnecting}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-semibold">Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play size={20} />
                        <span className="font-semibold">
                          Start Conversation
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
                {chat.length === 0 ? (
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center justify-center">
                      <VoiceWaveform />
                      <p className="text-gray-300 text-center mt-4 text-lg">
                        Start speaking to begin the conversation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col-reverse gap-4 max-w-4xl mx-auto">
                    {chat.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl max-w-lg backdrop-blur-md border shadow-lg ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white border-blue-400/30"
                              : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-white border-gray-600/30"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                msg.role === "user"
                                  ? "bg-white/20"
                                  : "bg-purple-500/80"
                              }`}
                            >
                              {msg.role === "user" ? "U" : "AI"}
                            </div>
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap leading-relaxed">
                                {msg.text}
                              </p>
                              <span className="text-xs text-gray-300 mt-2 block opacity-70">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mic Status Bar */}
              <footer className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-black/20 backdrop-blur-md border-t border-white/10">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
                  <div
                    className={`p-4 rounded-full transition-all duration-300 ${
                      isMicOn
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 animate-pulse"
                        : "bg-gray-600/50 text-gray-300"
                    }`}
                  >
                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-lg font-semibold ${
                        isMicOn ? "text-green-400" : "text-gray-400"
                      }`}
                    >
                      {isMicOn ? "🎙️ Listening..." : "🔇 Microphone Off"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {isMicOn
                        ? "Speak naturally to interact with the AI"
                        : "Microphone is disabled"}
                    </p>
                  </div>
                  {isMicOn && <VoiceWaveform />}
                </div>
              </footer>
            </div>
          )}
        </main>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="w-full h-px bg-cyan-400 animate-pulse absolute top-1/4"></div>
        <div
          className="w-full h-px bg-purple-400 animate-pulse absolute top-2/4"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="w-full h-px bg-pink-400 animate-pulse absolute top-3/4"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
};
export default RealTimeVoice;
