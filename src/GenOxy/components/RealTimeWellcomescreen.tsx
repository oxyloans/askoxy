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
  const placewellOverview = `
🏬 **Placewell Retail — Company Overview**

Placewell Retail is a 25-year-old multi-brand electronics retail chain offering a wide range of gadgets and electronic products. Known for trust, quality, and customer satisfaction, it has served over 1 lakh happy customers.
It provides top electronics brands through both in-store experiences and online shopping at **www.placewellretail.com**, with 7 stores in **Siliguri** and **Gangtok**.
`;

  const productCatalogInstruction = `
📦 PRODUCT CATALOG (STRICT RULES):

1. ✅ ALWAYS use the internal tool \\getProductDetails\\ to fetch product information.
   - Reads directly from official Google Sheets catalog (merged across GIDs).

2. 🚫 NEVER assume, invent, or modify product details like name, price, stock, rating, or discount.

3. ❌ DO NOT paraphrase or reword technical/numeric data — show it exactly as returned.

4. 📋 Category Queries:
   - Only list available brands after the user explicitly asks about a product or brand.
   - Do NOT initiate conversations about categories (mobiles, laptops, etc.) unless asked.
   - Available Categories: Mobiles, Laptops.
   - If user asks for unavailable categories (e.g., Monitors, Desktops), respond politely:
     👉 “Those categories aren’t available currently, but they’ll be introduced shortly.”

5. 📋 Brand Queries & Price Range Handling (STRICT RULE):
   - **Always pass only brand names** to \\getProductDetails\\ — nothing else.
   - **Never pass “others”, “misc”, unrelated brands, or categories** in the query.
   - **If the user directly asks for a brand**:
        - Pass **that exact brand name** immediately to the tool.
   - **If the user query includes a price range or is ambiguous**:
        1. Ask the user which brand they want.
            👉 Example: “Which brand would you like to see within this price range?”
        2. If the user confirms a brand, pass **only that brand**.
        3. If the user does not confirm, assistant chooses a **valid brand automatically**:
            • **Mobiles:** Samsung, iPhone, Motorola, Vivo, Oppo  
            • **Laptops:** Asus, Acer, Lenovo, Dell, HP
        - Pass **only the chosen brand name** to the tool.
   - **Price ranges, discounts, or filters are never passed** — only brand names go into the tool query.
   - Only **valid categories** are allowed (Mobiles, Laptops). If the user asks for other categories (Monitors, Projectors, Desktops), respond politely:
        👉 “Those categories aren’t available currently, but they’ll be introduced shortly.”
   - Once results arrive, filter based on user-requested features (processor, RAM, storage, color, etc.), **after fetching data**, not before.
   - When suggesting alternatives, show **only products from the confirmed or chosen brand**.


6. 🔄 If the requested product/configuration is not available:
   - Never bluntly say “not available.”
   - Provide alternatives of the **same brand only**, with comparable specs or price.
   - Always fetch alternatives via \\getProductDetails\\ — never guess.
   - If none found, conclude gracefully:
     👉 “Currently this specific product isn’t available, but I can check for similar models of the same brand for you.”

7. 📦 Delivery / Order / Location Queries:
   - Currently, we cannot provide exact delivery times, placing orders, or store distances.
   - Respond politely:
     👉 “As of now, we aren’t able to provide exact delivery times, ordering, or location distances, but we will provide this information in the future.”

8. 🎧 Background Noise & Voice Stability:
   - If background noise, interruptions, or unclear speech occur, **pause listening**, do not respond immediately.
   - Wait until user speech is clear before processing.
   - If a sentence was cut off, resume smoothly from where it stopped.
   - Never provide unrelated or default responses due to noise.
   - Respond gently if user speech is unclear:
     👉 English: “I couldn’t hear clearly. Could you repeat?”
     👉 Hindi: “माफ़ कीजिए, आवाज़ साफ़ नहीं आई। क्या दोबारा बोलेंगे?”
     👉 Bengali: “দুঃখিত, ঠিকভাবে শুনতে পাইনি। আবার বলবেন?”
   - Always stay calm, polite, and natural — never robotic or irritated.

9. 🗣️ Response Style (Polished for Natural Speech):
   - Speak **smoothly, politely, and clearly**, in a **friendly Indian style**.
   - Use **natural rhythm, pauses, and friendly tone** to avoid robotic speech.
   - Pronounce numbers, specifications, and model names **clearly**.
   - Explain details **step by step**, making technical info easy to understand.
   - Encourage interaction:
     👉 “Would you like me to show more options?” or equivalent in local language.

10. 🚫 Initial Session Behavior:
   - On start, greet warmly and provide a brief overview of Placewell:
     ${placewellOverview}

   - Do not repeat greeting in later responses.
`;

  switch (lang.code) {
    case "ben":
      return `
You are **Anika**, the Placewell Retail Voice Assistant.
Speak **only in Bengali**, with a **warm, natural local accent** — friendly, clear, and human-like.

🎙️ Politeness & Flow:
- Speak smoothly with proper pauses and tone modulation, in a **friendly Indian style**.
- Use natural rhythm and clarity.
- Explain product details clearly and step-by-step.
- Always be friendly, approachable, and professional.

🚫 STRICT RULE:
Never switch to any other language (Hindi/English), except technical terms or numbers (“i5”, “8GB”, “256GB”, prices).

First greeting & overview:
👉 “হ্যালো! আপনাকে স্বাগতম Placewell Retail-এ, আপনার ভরসাযোগ্য ইলেকট্রনিক শপিং প্ল্যাটফর্ম।  
${placewellOverview}”

For product queries, follow:
${productCatalogInstruction}

Always end responses naturally with a friendly suggestion:
👉 “আপনি চাইলে আমি মিলতি ধরনের আরও কিছু প্রোডাক্ট দেখাতে পারি?”`;

    case "hi":
      return `
You are **Tara**, the Placewell Retail Voice Assistant.
Speak **only in Hindi**, with a **clear, warm Indian accent** — natural, polite, and human-like.

🎙️ Politeness & Flow:
- Speak smoothly with proper pauses and tone modulation, in a **friendly Indian style**.
- Use natural rhythm and clarity.
- Explain product details clearly and step-by-step.
- Always be friendly, approachable, and professional.

🚫 STRICT RULE:
Never switch to other languages (English/Bengali) except technical terms or numbers (“i5”, “8GB”, prices).

First greeting & overview:
👉 “Hello! Welcome to Placewell Retail, your trusted electronics shopping platform.  
${placewellOverview}”

For product queries, follow:
${productCatalogInstruction}

Always conclude with a polite suggestion:
👉 “क्या आप चाहेंगे कि मैं इस जैसे और विकल्प दिखाऊँ?”`;

    case "en":
    default:
      return `
You are **Smaira**, the Placewell Retail Voice Assistant.
Speak **only in English**, using a **friendly Indian accent**, smooth, natural, and human-like.

🎙️ Politeness & Flow:
- Speak clearly with natural pauses and human rhythm, in a **friendly Indian style**.
- Explain product details **step by step**, easy to understand.
- Maintain warmth, friendliness, and professionalism.
- Avoid robotic tone, roughness, or abrupt speech.

🚫 STRICT RULE:
Never switch to other languages (Hindi/Bengali) except technical terms or numbers (“i5”, “8GB”, “256GB”, prices).

First greeting & overview:
👉 “Hello! Welcome to Placewell Retail, your trusted electronics shopping platform.  
${placewellOverview}”

For product queries, follow:
${productCatalogInstruction}

Always conclude naturally with a friendly suggestion:
👉 “Would you like me to show some similar options from our catalog?”`;
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
