import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import s1 from "../assets/img/s1.png";
import s5 from "../assets/img/s5.png";
import s6 from "../assets/img/s6.png";
import s7 from "../assets/img/s7.png";
import s8 from "../assets/img/s8.png";
import s9 from "../assets/img/s9.png";
import s10 from "../assets/img/s10.png";
import s11 from "../assets/img/s11.png";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isGccMateModalOpen, setIsGccMateModalOpen] = useState(false);
    const [isFreelanceModalOpen, setIsFreelanceModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isGccMateModalOpen || isCryptoModalOpen || isFreelanceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isGccMateModalOpen, isCryptoModalOpen, isFreelanceModalOpen]);

  const LOGIN_URL = "/whatsapplogin";

  const go = (route: string) => {
    navigate(route);
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
  

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/crypto";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
      setIsCryptoModalOpen(false);
    }
  };  const handleEmployerChoice = () => {
      setIsFreelanceModalOpen(false);
      navigate("/employee-login");
    };

  const tiles: Tile[] = [
    {
      id: "s16",
      src: s16,
      onClick: handleFreelanceSignIn,
      title: "Freelance Marketplace",
    },
    {
      id: "s7",
      src: s7,
      route: "/rice2roboecommers",
      title: "Rice 2 Robo\nE-Commerce",
    },
    {
      id: "s11",
      src: s11,
      route: "/90dayjobplan",
      title: "90 Day\nJob Plan",
    },
    {
      id: "s10",
      src: s10,
      route: "/aiblockchainanditservices",
      title: "BlockChain &\nCrypto",
    },
    { id: "s6", src: s6, route: "/realestate", title: "Real Estate" },
    { id: "s5", src: s5, route: "/nyayagpt", title: "Nyaya GPT" },
    { id: "s8", src: s8, route: "/glms", title: "GLMS, Blogs\nJob Street" },
    {
      id: "s1",
      src: s1,
      route: "/caandcsservices",
      title: "CA & CS\nServices",
    },
    {
      id: "s9",
      src: s9,
      title: "GCC Mate",
      route: "/gccmate",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="relative w-full overflow-hidden bg-white text-[#1a1a1a]">
        <div className="pointer-events-none absolute inset-0 " />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.20]"
          // style={{
          //   backgroundImage: `
          //     linear-gradient(30deg, rgba(170,170,170,0.18) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.14) 87.5%, rgba(170,170,170,0.14)),
          //     linear-gradient(150deg, rgba(170,170,170,0.18) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.14) 87.5%, rgba(170,170,170,0.14)),
          //     linear-gradient(90deg, rgba(170,170,170,0.06) 2%, transparent 2.5%, transparent 97%, rgba(170,170,170,0.06) 97.5%, rgba(170,170,170,0.06))
          //   `,
          //   backgroundSize: "42px 72px",
          //   backgroundPosition: "0 0, 0 0, 21px 36px",
          // }}
        />

        {/* <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,rgba(0,0,0,0.14)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-white via-white/80 to-transparent" />

        <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-[#84B6FF]/35 blur-3xl md:h-36 md:w-36" />
        <div className="pointer-events-none absolute right-4 top-[130px] h-36 w-36 rounded-full bg-[#FF67C0]/22 blur-3xl md:h-56 md:w-56" />
        <div className="pointer-events-none absolute left-10 bottom-10 h-24 w-24 rounded-full bg-[#FFD963]/22 blur-3xl md:h-36 md:w-36" />
        <div className="pointer-events-none absolute right-[33%] top-[34%] h-20 w-20 rounded-full bg-[#B86FFF]/14 blur-3xl md:h-28 md:w-28" /> */}

        <div className="relative z-10 mx-auto max-w-[1240px] px-3 pb-0 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
          <div className="flex flex-col-reverse items-center gap-6 sm:gap-8 lg:flex-row lg:items-end lg:gap-12">
            <div className="flex w-full items-end justify-center lg:w-[48%] lg:justify-start">
              <a
                href="https://amzn.in/d/2Ie3hEg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open AI book on Amazon"
                className="block w-full"
              >
                <img
                  src={leftImage}
                  alt="ASKOXY.AI Super App"
                  className="block w-full max-w-[320px] cursor-pointer select-none object-contain drop-shadow-2xl sm:max-w-[380px] md:max-w-[440px] lg:max-w-[520px]"
                  draggable={false}
                />
              </a>
            </div>

            <div className="w-full pb-6 sm:pb-8 lg:w-[52%] lg:pb-10">
              <div className="mx-auto max-w-[780px]">
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-3 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-4">
                  {tiles.map((tile) => (
                    <div key={tile.id} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (tile.onClick) {
                            tile.onClick();
                          } else if (tile.route) {
                            go(tile.route);
                          }
                        }}
                        className="flex aspect-square w-[85%] transform items-center justify-center rounded-[16px] p-2 transition-all duration-150 hover:scale-105 active:scale-95 sm:w-[90%] lg:w-[85%]"
                        type="button"
                        aria-label={tile.title.replace(/\n/g, " ")}
                      >
                        <img
                          src={tile.src}
                          alt={tile.title.replace(/\n/g, " ")}
                          className="h-[85%] w-[85%] object-contain"
                          draggable={false}
                        />
                      </button>

                      <p className="mt-2 max-w-[110px] whitespace-pre-line break-words text-center text-[14px] font-semibold leading-snug text-black sm:max-w-[120px] sm:text-[14px] md:text-[16px]">
                        {tile.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGccMateModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setIsGccMateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white p-5 text-center shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setIsGccMateModalOpen(false)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 active:scale-95"
              type="button"
              aria-label="Close GCC Mate modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#5543C8]/20 blur-2xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#D71D8E]/20 blur-2xl" />

            <div className="relative z-10 pt-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#5543C8] via-[#7B4DFF] to-[#D71D8E] shadow-[0_14px_35px_rgba(85,67,200,0.35)]">
                <img
                  src={s9}
                  alt="GCC Mate"
                  className="h-16 w-16 object-contain"
                  draggable={false}
                />
              </div>

              <div className="mt-5 inline-flex rounded-full bg-[#F2EEFF] px-4 py-1 text-[12px] font-bold uppercase tracking-[0.18em] text-[#5543C8]">
                New Launch
              </div>

              <h2 className="mt-4 text-[26px] font-extrabold tracking-tight text-[#1a1a1a] sm:text-[30px]">
                GCC MATE
              </h2>

              <p className="mt-2 text-[19px] font-bold text-[#D71D8E] sm:text-[20px]">
                Coming Soon...!
              </p>

              <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-6 text-gray-600 sm:text-[15px]">
                A smart experience for Global Capability Centers is getting
                ready. Stay tuned for the launch.
              </p>

              <button
                onClick={() => setIsGccMateModalOpen(false)}
                className="mt-7 w-full rounded-full bg-gradient-to-r from-[#5543C8] to-[#D71D8E] px-6 py-3 text-[15px] font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
                type="button"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {isCryptoModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setIsCryptoModalOpen(false)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setIsCryptoModalOpen(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              type="button"
              aria-label="Close crypto modal"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-center text-xl font-bold text-purple-700 sm:text-2xl">
              🎉 LIMITED TIME OFFER
            </h2>

            <p className="mt-2 text-center text-gray-700">
              Get <span className="font-semibold">₹20 Worth of BMVCOINS</span>{" "}
              Free Today!
            </p>

            <p className="mt-1 text-center text-sm text-gray-600">
              1 BMVCOIN = ₹0.02 • You get 1000 coins = ₹20
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-purple-100 p-4">
                <p className="text-sm text-gray-600">Guaranteed Minimum</p>
                <p className="text-lg font-bold text-purple-700">₹20</p>
                <p className="text-xs text-gray-500">1000 BMVCOINS</p>
              </div>

              <div className="rounded-lg bg-purple-100 p-4">
                <p className="text-sm text-gray-600">Potential Maximum</p>
                <p className="text-lg font-bold text-purple-700">₹2,000</p>
                <p className="text-xs text-gray-500">1,00,000 BMVCOINS</p>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              <span className="font-medium">Total Distributed:</span> ₹2,000+
              1,00,000 BMVCOINS
            </p>

            <button
              onClick={handleSignIn}
              className="mt-6 w-full rounded-lg bg-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
              type="button"
            >
              🚀 {isLoading ? "Processing..." : "Claim Free Coins"}
            </button>
          </div>
        </div>
      )}
       {isFreelanceModalOpen && (
              <div
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
                onClick={() => setIsFreelanceModalOpen(false)}
              >
                <div
                  className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:p-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    onClick={() => setIsFreelanceModalOpen(false)}
                    className="absolute right-4 top-4 z-20 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:right-6 sm:top-6"
                    type="button"
                    aria-label="Close marketplace modal"
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
                      type="button"
                      className="group flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:gap-4 sm:p-4"
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
                      type="button"
                      className="group flex w-full items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-3 text-left shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:gap-4 sm:p-4"
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
