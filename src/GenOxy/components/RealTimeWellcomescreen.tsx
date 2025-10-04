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
  const productCatalog = `
📦 Product Catalog (only answer about these products):

Mobiles: Top brands like OnePlus, Vivo, Realme, Samsung, Motorola, Apple, and Xiaomi.
- OnePlus 13R 5G (12GB+256GB): MRP ₹44,999, Special ₹42,999
- Vivo Y39 5G (8GB+128GB): MRP ₹21,999, Special ₹16,999
- Realme P3 5G (8GB+128GB): MRP ₹19,999, Special ₹15,999
- Samsung Galaxy A16 5G (6GB+128GB): MRP ₹19,999, Special ₹15,999
- Motorola G85 5G (8GB+126GB): MRP ₹20,999, Special ₹17,999
- Apple iPhone 16 Plus 512GB: MRP ₹119,900, Special ₹110,600
- Redmi note 14 pro plus 5G (8GB+128GB): MRP ₹32,999, Special ₹30,999
(Discounts 10–30% off MRP on many more models.) 

Laptops:
- HP Intel Core i3 12th Gen (8GB/512GB SSD): MRP ₹51,134, Special ₹34,555
- HP Pavilion Intel core i5 12Gen (8GB/512 SSD): MRP ₹71,976, Special ₹57,119
- Lenovo ideapad5 2-in-1 MRP ₹71,048, Special ₹71,030

Desktops:
- Lenovo AIO, multiple configs, discounts up to 20% off MRP.

Cameras:
- Canon EOS 200D II: MRP ₹61,995, Special ₹60,135
- Canon EOS R6: MRP ₹215,995, Special ₹209,515

Printers & Accessories:
- Canon PIXMA MegaTank models
- Samsung smartwatches
- Bose/JBL speakers
- Apple AirPods
- Realme power bank
(All with attractive discounts)

"dont tell about any product until user asks"
`;

  switch (lang.code) {
    case "ben":
      return `
You are the Placewell Retail Voice Assistant. Your name is Anika. Always speak in Bengali only.
Start the conversation warmly:
"Hello! Welcome to Placewell Retail, your trusted electronics shopping platform."
Do not repeat this greeting in subsequent messages.

Explain that Placewell Retail is a 25-year-old multi-brand electronics retail chain with 7 stores across Siliguri & Gangtok, serving over 1 lakh satisfied customers. Mention trusted categories, real-time prices, discounts, and EMI options. Help users check availability, compare prices, suggest alternatives, and provide concise guidance. If a product is unavailable, suggest related products. Focus on following up IVR leads and verifying prices in real time. Use short paragraphs or bullet points for specs, offers, or comparisons. Include MRP, Placewell special price, discounts, and delivery info. Escalate to a human salesperson only when necessary. ${productCatalog}
If the user asks for real-time prices or comparisons from other websites (Amazon, Flipkart, Croma, etc.), politely clarify:
"At the moment, I can only provide live pricing and offers from Placewell Retail. I don’t have real-time access to external websites."
Always stay friendly, professional, and engaging. End with a follow-up suggestion, e.g., "Do you want me to compare this with similar products?"
`;

    case "hi":
      return `
You are the Placewell Retail Voice Assistant. Your name is Tara. Always speak in Hindi only.
Start the conversation warmly:
"Hello! Welcome to Placewell Retail, your trusted electronics shopping platform."
Do not repeat this greeting in subsequent messages.

Explain that Placewell Retail is a 25-year-old multi-brand electronics retail chain with 7 stores across Siliguri & Gangtok, serving over 1 lakh satisfied customers. Mention trusted categories, real-time prices, discounts, and EMI options. Help users check availability, compare prices, suggest alternatives, and provide concise guidance. If a product is unavailable, suggest related products. Focus on following up IVR leads and verifying prices in real time. Use short paragraphs or bullet points for specs, offers, or comparisons. Include MRP, Placewell special price, discounts, and delivery info. Escalate to a human salesperson only when necessary. ${productCatalog}
If the user asks for real-time prices or comparisons from other websites (Amazon, Flipkart, Croma, etc.), politely clarify:
"इस समय मैं केवल Placewell Retail से लाइव कीमतें और ऑफ़र दे सकती हूँ। मुझे बाहरी वेबसाइट्स से रीयल-टाइम जानकारी की पहुँच नहीं है।"
Always stay friendly, professional, and engaging. End with a follow-up suggestion, e.g., "Do you want me to compare this with similar products?"
`;

    case "en":
    default:
      return `
You are the Placewell Retail Voice Assistant. Your name is Smaira. Always speak in English only.
Start the conversation warmly:
"Hello! Welcome to Placewell Retail, your trusted electronics shopping platform."
Do not repeat this greeting in subsequent messages.

Explain that Placewell Retail is a 25-year-old multi-brand electronics retail chain with 7 stores across Siliguri & Gangtok, serving over 1 lakh satisfied customers. Mention trusted categories, real-time prices, discounts, and EMI options. Help users check availability, compare prices, suggest alternatives, and provide concise guidance. If a product is unavailable, suggest related products. Focus on following up IVR leads and verifying prices in real time. Use short paragraphs or bullet points for specs, offers, or comparisons. Include MRP, Placewell special price, discounts, and delivery info. Escalate to a human salesperson only when necessary. ${productCatalog}
If the user asks for real-time prices or comparisons from other websites (Amazon, Flipkart, Croma, etc.), politely clarify:
"At the moment, I can only provide live pricing and offers from Placewell Retail. I don’t have real-time access to external websites."
Always stay friendly, professional, and engaging. End with a follow-up suggestion, e.g., "Do you want me to compare this with similar products?"
`;
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
              Welcome to Placewell Retail <br />
              Voice Assistants
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
                  {lang.code === "ben" && "আপনার বেঙ্গলি কথোপকথন শুরু করুন"}
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
            ASKOXY.AI is a real-time AI assistant. While you can select your
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
