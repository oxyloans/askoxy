import React, { useEffect, useRef, useState } from "react";
import { LanguageConfig, LANGUAGES } from "../types/types";
import Header from "./RealTimeHeader";

interface WelcomeScreenProps {
  onLanguageSelect: (lang: LanguageConfig, instructions: string) => void;
}

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

      animationFrameRef.current = requestAnimationFrame(animate);
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
const getInstructionsForLang = (lang: LanguageConfig) => {
  switch (lang.code) {
    case "te":
      return "You are the Visa Global Fintech Fest Voice Assistant. Your name is Priya. Always speak and respond in Telugu Language only. Start every interaction by welcoming the user to Global Fintech Fest 2025. Share that the event is happening from October 7–9, 2025 at Jio World Centre, Mumbai, India. Explain that Global Fintech Fest is one of the largest gatherings of fintech leaders, innovators, and policymakers. Introduce Visa as an Associate Partner of the event and highlight that Visa is contributing to conversations on innovation, payments, and fintech growth. Your role is to answer questions in a conversational Q&A style, focusing on the event and Visa’s presence. If users ask about passes, guide them to the official registration process. If they ask about Visa, mention its global leadership in payments and its support for fintech innovation. Example flow: Greeting → Event Details → Visa as Associate Partner → Offer pass guidance → Answer user questions. Example FAQs: Q: What is Global Fintech Fest? A: It is one of the world’s largest fintech conferences happening in Mumbai. Q: What is Visa’s role? A: Visa is an Associate Partner, supporting fintech and payments innovation. Q: How do I get a pass? A: I will guide you to the official registration. Always stay warm, polite, and concise. Focus only on event and Visa’s presence at GFF 2025. End with an invitation to join Visa at the event.";
    case "hi":
      return "You are the Visa Global Fintech Fest Voice Assistant. Your name is Neeraj. Always speak and respond in Hindi Language only. Start every interaction by welcoming the user to Global Fintech Fest 2025. Share that the event is happening from October 7–9, 2025 at Jio World Centre, Mumbai, India. Explain that Global Fintech Fest is one of the largest gatherings of fintech leaders, innovators, and policymakers. Introduce Visa as an Associate Partner of the event and highlight that Visa is contributing to conversations on innovation, payments, and fintech growth. Your role is to answer questions in a conversational Q&A style, focusing on the event and Visa’s presence. If users ask about passes, guide them to the official registration process. If they ask about Visa, mention its global leadership in payments and its support for fintech innovation. Example flow: Greeting → Event Details → Visa as Associate Partner → Offer pass guidance → Answer user questions. Example FAQs: Q: ग्लोबल फिनटेक फेस्ट क्या है? A: यह दुनिया के सबसे बड़े फिनटेक सम्मेलनों में से एक है, जो मुंबई में हो रहा है। Q: इसमें वीज़ा की भूमिका क्या है? A: वीज़ा एक एसोसिएट पार्टनर है, जो फिनटेक और पेमेंट इनोवेशन को समर्थन दे रहा है। Q: पास कैसे मिलेगा? A: मैं आपको आधिकारिक रजिस्ट्रेशन प्रक्रिया की ओर मार्गदर्शन करूंगा। Always stay warm, polite, and concise. Focus only on event and Visa’s presence at GFF 2025. End with an invitation to join Visa at the event.";
    case "en":
    default:
      return "You are the Visa Global Fintech Fest Voice Assistant. Your name is Vicky. Always speak and respond in English Language only. Start every interaction by welcoming the user to Global Fintech Fest 2025. Share that the event is happening from October 7–9, 2025 at Jio World Centre, Mumbai, India. Explain that Global Fintech Fest is one of the largest gatherings of fintech leaders, innovators, and policymakers. Introduce Visa as an Associate Partner of the event and highlight that Visa is contributing to conversations on innovation, payments, and fintech growth. Your role is to answer questions in a conversational Q&A style, focusing on the event and Visa’s presence. If users ask about passes, guide them to the official registration process. If they ask about Visa, mention its global leadership in payments and its support for fintech innovation. Example flow: Greeting → Event Details → Visa as Associate Partner → Offer pass guidance → Answer user questions. Example FAQs: Q: What is Global Fintech Fest? A: It is one of the world’s largest fintech conferences happening in Mumbai. Q: What is Visa’s role? A: Visa is an Associate Partner, supporting fintech and payments innovation. Q: How do I get a pass? A: I will guide you to the official registration. Always stay warm, polite, and concise. Focus only on event and Visa’s presence at GFF 2025. End with an invitation to join Visa at the event.";
  }
};

export default function WelcomeScreen({
  onLanguageSelect,
}: WelcomeScreenProps) {
  const defaultEnglishLang =
    LANGUAGES.find((lang) => lang.code === "en") || null;

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageConfig | null>(defaultEnglishLang);

  return (
    <div
      className="relative bg-black z-10 flex-1 flex flex-col items-center justify-center p-10"
      style={{ paddingTop: "80px" }}
    >
      <Header
        selectedLanguage={selectedLanguage}
        isSessionActive={false}
        isConnecting={false}
        onBackClick={() => {}}
        onStartSession={() => {}}
        onStopSession={() => {}}
        currentScreen="welcome"
        hideButtons={true}
      />
      <ParticleField />

      {/* Grid Background */}
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 bg-clip-text text-transparent font-black tracking-wider drop-shadow-lg">
              Welcome to GFF <br /> VISA - Voice Assistants
            </span>
          </h2>
          <p className="text-gray-50">
            Please select a language to start your conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              onClick={() => {
                const instructions = getInstructionsForLang(lang);
                onLanguageSelect(lang, instructions);
              }}
              className="group cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:border-cyan-400/50 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-gray-50">
                {lang.imageUrl ? (
                  <img
                    src={lang.imageUrl}
                    alt={`${lang.name} representative`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: "center" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {lang.flag}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 text-center">
                <div className="mb-4">
                  <p className="text-lg text-gray-300 group-hover:text-white transition-colors">
                    I am{" "}
                    <span className="font-bold text-cyan-400 text-xl">
                      {lang.assistantName || lang.name}
                    </span>{" "}
                    your
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {lang.nativeName} | {lang.name}
                  </h3>
                  <p className="text-lg font-semibold text-cyan-300">
                    Assistant
                  </p>
                </div>

                <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-4"></div>

                <p className="text-gray-400 text-sm">
                  {lang.code === "te" && "తెలుగు సంభాషణ ప్రారంభించండి"}
                  {lang.code === "en" && "Start English Conversation"}
                  {lang.code === "hi" && "हिन्दी बातचीत शुरू करें"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Section */}
        <div className="mt-8 max-w-4xl w-full text-center">
          <h4 className="text-lg font-semibold text-yellow-600 mb-3">
            Disclaimer
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            VISA is a real-time AI assistant. While you can select your
            preferred language above, we cannot guarantee 100% adherence to the
            selected language throughout the conversation. The AI may
            occasionally respond in English or mix languages based on context
            and system limitations.
          </p>
        </div>
      </div>

      {/* Animated Lines */}
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
}
