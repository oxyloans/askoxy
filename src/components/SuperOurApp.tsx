import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

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
import s16 from "../assets/img/s16.png";

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
  const [isFreelanceModalOpen, setIsFreelanceModalOpen] = useState<boolean>(false);

  const [showFab, setShowFab] = useState<boolean>(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFab(entry.isIntersecting && entry.intersectionRatio >= 0.1);
      },
      { threshold: [0, 0.1, 0.5, 1] },
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

  const handleFreelanceSignIn = () => {
    setIsFreelanceModalOpen(true);
  };

  const handleFreelancerChoice = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/freelanceform";
      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = `${LOGIN_URL}`;
      }
    } catch (error) {
      console.error("Freelancer choice error:", error);
    } finally {
      setIsLoading(false);
      setIsFreelanceModalOpen(false);
    }
  };

  const handleEmployerChoice = () => {
    setIsFreelanceModalOpen(false);
    navigate("/employee-login");
  };

  const tiles: Tile[] = [
    // {
    //   id: "s16",
    //   src: s16,
    //   onClick: handleFreelanceSignIn,
    //   title: "Freelance Marketplace",
    // },
    { id: "s13", src: s13, route: "/genoxy", title: "OXYGPT" },
    {
      id: "s7",
      src: s7,
      route: "/rice2roboecommers",
      title: "Rice 2 Robo\nE-Commerce",
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
      title: "BlockChain & \ncrypto",
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

  const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";

  return (
    <div className="w-full overflow-hidden">
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg,#5C3391 0%,#5D4086 30%,#6F4386 65%,#312C74 100%)",
        }}
      >
        <div className="mx-auto max-w-[1240px] px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-0">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-end gap-6 sm:gap-8 lg:gap-12">
            <div className="w-full lg:w-[48%] flex justify-center lg:justify-start items-end">
              <a
                href="https://amzn.in/d/2Ie3hEg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open AI book on Amazon"
                className="w-full block"
              >
                <img
                  src={leftImage}
                  alt="ASKOXY.AI Super App"
                  className="max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[520px] w-full object-contain drop-shadow-2xl select-none block cursor-pointer"
                  draggable={false}
                />
              </a>
            </div>

            <div className="w-full lg:w-[52%] pb-6 sm:pb-8 lg:pb-10">
              <div className="mx-auto max-w-[780px]" ref={gridRef}>
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
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {isCryptoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsCryptoModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                🎉 LIMITED TIME OFFER
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Get <span className="font-semibold">₹20 Worth of BMVCOINS</span> Free Today!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-xs sm:text-sm">Guaranteed Minimum</p>
                <p className="text-lg sm:text-xl font-bold text-purple-700 mt-1">₹20</p>
                <p className="text-xs text-gray-500 mt-1">(1000 BMVCOINS)</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-xs sm:text-sm">Potential Maximum</p>
                <p className="text-lg sm:text-xl font-bold text-purple-700 mt-1">₹2,000</p>
                <p className="text-xs text-gray-500 mt-1">(1,00,000 BMVCOINS)</p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-600 mb-6">
              <span className="font-medium">Total Distributed:</span> ₹2,000+ (1,00,000 BMVCOINS)
            </p>

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              🚀 {isLoading ? "Processing..." : "Claim Free Coins"}
            </button>
          </div>
        </div>
      )}

      {isFreelanceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 relative">
            <button
              onClick={() => setIsFreelanceModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                Join Our Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Choose your role to get started
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleFreelancerChoice}
                disabled={isLoading}
                className="w-full group flex items-center gap-3 sm:gap-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 p-3 sm:p-4 rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-blue-900 text-sm sm:text-base leading-tight">Job Seeker (Freelancer)</h3>
                  <p className="text-blue-600/70 text-[11px] sm:text-xs leading-tight mt-1 font-medium">Find projects and showcase your talent</p>
                </div>
                <div className="text-blue-300 group-hover:text-blue-500 text-lg sm:text-xl flex-shrink-0 transition-colors">→</div>
              </button>

              <button
                onClick={handleEmployerChoice}
                disabled={isLoading}
                className="w-full group flex items-center gap-3 sm:gap-4 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 hover:border-purple-300 p-3 sm:p-4 rounded-xl transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100/50 flex items-center justify-center text-purple-600 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                  🏢
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-purple-900 text-sm sm:text-base leading-tight">Employer (CEO / HR / Company)</h3>
                  <p className="text-purple-600/70 text-[11px] sm:text-xs leading-tight mt-1 font-medium">Hire top professionals for your projects</p>
                </div>
                <div className="text-purple-300 group-hover:text-purple-500 text-lg sm:text-xl flex-shrink-0 transition-colors">→</div>
              </button>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-center text-xs sm:text-sm text-gray-500 italic">
                "Your gateway to global opportunities and elite talent"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
