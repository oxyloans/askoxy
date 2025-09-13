import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

// === Image imports ===
import s4 from "../assets/img/a3.png";
import s7 from "../assets/img/a5.png";
import s10 from "../assets/img/a4.png";
import s12 from "../assets/img/a2.png";
import s13 from "../assets/img/s13.png";
import s14 from "../assets/img/a1.png";
import leftImage from "../assets/img/genmain.png";

type Tile = {
  id: string;
  src: string;
  title: string;
  route?: string;
  onClick?: () => void;
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const LOGIN_URL = "/whatsapplogin";

  const go = (r: string) => navigate(r);

  const handledSignInAiAgents = () => {
    const redirectPath = "/main/services/6e44/ai-agents-2-earn-money-zero-in";
    handleRedirect(redirectPath);
  };

  const handleSignIn = () => {
    const redirectPath = "/main/crypto";
    handleRedirect(redirectPath);
  };

  const handleRedirect = (redirectPath: string) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Redirect error:", error);
    } finally {
      setIsLoading(false);
      setIsCryptoModalOpen(false);
    }
  };

  const tiles: Tile[] = [
    { id: "s13", src: s13, route: "/genoxy", title: "GENOXY Chat" },
    {
      id: "s7",
      src: s7,
      route: "/genoxy/chat",
      title: "AI LLMs",
    },
    {
      id: "s11",
      src: s14,
      route: "/freeaibook",
      title: "Free AI Book",
    },
    {
      id: "s12",
      src: s12,
      route: "/ai-videos",
      title: "AI Videos",
    },
    {
      id: "s4",
      src: s4,
      route: "/ai-masterclasses",
      title: "AI Masterclasses",
    },
    {
      id: "s10",
      src: s10,
      route: "/voiceAssistant/welcome",
      title: "OXY Voice Assistant",
    },
  ];


  return (
    <div className="w-full overflow-hidden">
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg,#5C3391 0%,#5D4086 30%,#6F4386 65%,#312C74 100%)",
        }}
      >
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
            {/* Left image (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 justify-center lg:justify-start items-center">
              <img
                src={leftImage}
                alt="ASKOXY.AI Super App"
                loading="lazy"
                className="max-h-[500px] w-auto object-contain drop-shadow-2xl select-none"
                draggable={false}
              />
            </div>

            {/* Right grid */}
            <div className="flex-1 flex items-center py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3  w-full">
                {tiles.map((t) => (
                  <div key={t.id} className="flex flex-col items-center ">
                    <button
                      onClick={() =>
                        t.onClick ? t.onClick() : t.route && go(t.route)
                      }
                      className="w-full aspect-square rounded-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center p-3"
                      aria-label={t.title.replace(/\n/g, " ")}
                    >
                      <img
                        src={t.src}
                        alt={t.title}
                        loading="lazy"
                        className="w-4/5 h-4/5 object-contain select-none"
                        draggable={false}
                      />
                    </button>
                    <p className="mt-2 text-center text-white font-semibold leading-tight whitespace-pre-line text-xs sm:text-sm md:text-base">
                      {t.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
