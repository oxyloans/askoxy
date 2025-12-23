import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Close icon

import s1 from "../assets/img/s1.png";
import s2 from "../assets/img/s2.png";
import s3 from "../assets/img/s3.png";
import s4 from "../assets/img/s4.png";
import s5 from "../assets/img/s5.png";
import s6 from "../assets/img/s6.png";
import s7 from "../assets/img/s7.png";
import s8 from "../assets/img/s8.png";
import s9 from "../assets/img/s9.png";
import s10 from "../assets/img/s10.png";
import s11 from "../assets/img/s11.png";
import s12 from "../assets/img/s12.png";
import s13 from "../assets/img/s13.png";
import s14 from "../assets/img/s14.png";

import leftImage from "../assets/img/megahero.png";

type Tile = {
  id: string;
  src: string;
  title: string;
  route?: string;
  onClick?: () => void;
};

export default function SuperOurApp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState<boolean>(false);

  // ✅ control FAB visibility based on grid visibility
  const [showFab, setShowFab] = useState<boolean>(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFab(entry.isIntersecting && entry.intersectionRatio >= 0.1);
      },
      { threshold: [0, 0.1, 0.5, 1] }
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const LOGIN_URL = "/whatsapplogin";
  const go = (r: string) => navigate(r);

  const handledSignInAiAgents = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/bharath-aistore";
      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
      setIsCryptoModalOpen(false);
    }
  };

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/crypto";
      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
      setIsCryptoModalOpen(false);
    }
  };

  // ✅ UPDATED ORDER:
  // Row-1: OXYGPT, Rice2Robo, Bharat AI Store, 90 DAY JOB PLAN
  // Row-2: Loans, BlockChain, Real Estate, Gold/Silver
  // Row-3: Nyaya GPT, GLMS, CA&CS, Study Abroad
  // ❌ Crypto removed from grid (now separate button below)
  const tiles: Tile[] = [
    { id: "s13", src: s13, route: "/genoxy", title: "OXYGPT" },
    {
      id: "s7",
      src: s7,
      route: "/rice2roboecommers",
      title: "Rice 2 Robo\nECommerce",
    },
    {
      id: "s2",
      src: s2,
      onClick: () => navigate("/bharath-aistore"),
      title: "Bharat AI \nStore & More",
    },
    {
      id: "s11",
      src: s11,
      route: "/90dayjobplan",
      title: "90 Day\nJob Plan",
    },

    {
      id: "s4",
      src: s4,
      route: "/loansinvestments",
      title: "Loans &\nInvestments",
    },
    {
      id: "s10",
      src: s10,
      route: "/aiblockchainanditservices",
      title: "BlockChain & \nCrypto",
    },
    { id: "s6", src: s6, route: "/realestate", title: "Real Estate" },
    {
      id: "s3",
      src: s3,
      route: "/goldandsilveranddiamonds",
      title: "Gold, Silver\n& Diamonds",
    },

    { id: "s5", src: s5, route: "/nyayagpt", title: "Nyaya GPT" },
    { id: "s8", src: s8, route: "/glms", title: "GLMS, Blogs\nJob Street" },
    {
      id: "s1",
      src: s1,
      route: "/caandcsservices",
      title: "CA & CS\nServices",
    },
    { id: "s9", src: s9, route: "/studyabroad", title: "Study Abroad" },
  ];

  // === ASKOXY-style floating icon (like in the screenshot) ===
  const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg,#5C3391 0%,#5D4086 30%,#6F4386 65%,#312C74 100%)",
        }}
      >
        <div className="mx-auto max-w-[1240px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-end gap-6 sm:gap-8 lg:gap-12">
            {/* Left: phone mockup */}
            <div className="w-full lg:w-[48%] flex justify-center lg:justify-start">
              <img
                src={leftImage}
                alt="ASKOXY.AI Super App"
                className="max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[520px] w-full h-auto object-contain drop-shadow-2xl select-none"
                draggable={false}
              />
            </div>

            {/* Right: grid + crypto button */}
            <div className="w-full lg:w-[52%]">
              <div className="mx-auto max-w-[780px]" ref={gridRef}>
                {/* 12-tile grid */}
                <div
                  className={[
                    "grid",
                    "grid-cols-3 sm:grid-cols-3 lg:grid-cols-4",
                    "gap-x-3 sm:gap-x-3 lg:gap-x-3",
                    "gap-y-3 sm:gap-y-3 lg:gap-y-3",
                  ].join(" ")}
                >
                  {tiles.map((t) => (
                    <div key={t.id} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (t.onClick) t.onClick();
                          else if (t.route) go(t.route);
                        }}
                        className={[
                          "w-full aspect-square rounded-[18px]",
                          "transform hover:scale-110 transition-all duration-150",
                          "flex items-center justify-center p-2 sm:p-2.5 md:p-3",
                        ].join(" ")}
                        aria-label={t.title.replace(/\n/g, " ")}
                      >
                        <img
                          src={t.src}
                          alt={t.title}
                          className="w-full h-full object-contain select-none"
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                      <p className="mt-2 sm:mt-2.5 text-center text-white font-semibold leading-tight whitespace-pre-line text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]">
                        {t.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ✅ Crypto button (like tile), but NOT inside grid */}
                {/* <div className="mt-4 flex justify-center sm:justify-end">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setIsCryptoModalOpen(true)}
                      className={[
                        "w-[96px] sm:w-[110px] md:w-[120px]",
                        "aspect-square rounded-[18px]",
                        "transform hover:scale-110 transition-all duration-150",
                        "flex items-center justify-center p-2 sm:p-2.5 md:p-3",
                      ].join(" ")}
                      aria-label="Crypto"
                      title="Crypto"
                    >
                      <img
                        src={s12}
                        alt="Crypto"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                    <p className="mt-2 text-center text-white font-semibold leading-tight text-[11px] sm:text-[12px] md:text-[13px]">
                      Crypto
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bottom breathing space */}
          <div className="h-4 sm:h-6 lg:h-8" />
        </div>
      </div>

      {/* Floating ASKOXY icon button (click => My Services) */}
      {showFab && !isCryptoModalOpen && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            right: "0px",
            bottom: "18px",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <button
            onClick={() => navigate("/wearehiring")}
            className="pointer-events-auto active:scale-95 transition"
            aria-label="My Services"
            title="My Services"
          >
            <img
              src={ASK_OXY_ICON_URL}
              alt="ASKOXY.AI"
              className="right-0 h-16 w-auto md:h-20 select-none"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      )}

      {/* Modal for Crypto Claim */}
      {isCryptoModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsCryptoModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-700">
              🎉 LIMITED TIME OFFER
            </h2>

            <p className="text-center text-gray-700 mt-2">
              Get <span className="font-semibold">₹20 Worth of BMVCOINS</span>{" "}
              Free Today!
            </p>

            <p className="text-center text-sm text-gray-600 mt-1">
              (1 BMVCOIN = ₹0.02 • You get 1000 coins = ₹20)
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6 text-center">
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Guaranteed Minimum</p>
                <p className="text-lg font-bold text-purple-700">₹20</p>
                <p className="text-xs text-gray-500">(1000 BMVCOINS)</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Potential Maximum</p>
                <p className="text-lg font-bold text-purple-700">₹2,000</p>
                <p className="text-xs text-gray-500">(1,00,000 BMVCOINS)</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              <span className="font-medium">Total Distributed:</span> ₹2,000+
              (1,00,000 BMVCOINS)
            </p>

            <button
              onClick={handleSignIn}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
              disabled={isLoading}
            >
              🚀 {isLoading ? "Processing..." : "Claim Free Coins"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
