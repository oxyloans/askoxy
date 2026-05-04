import React, { useState, useEffect, useRef } from "react";
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
import s13 from "../assets/img/s13.png";

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
  const [showFab, setShowFab] = useState(true);

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

  useEffect(() => {
    if (isGccMateModalOpen || isCryptoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isGccMateModalOpen, isCryptoModalOpen]);

  const LOGIN_URL = "/whatsapplogin";

  const go = (route: string) => {
    navigate(route);
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
  };

  const tiles: Tile[] = [
    { id: "s13", src: s13, route: "/genoxy", title: "OXYGPT" },
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
      onClick: () => setIsGccMateModalOpen(true),
    },
  ];

  const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";

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
              <div className="mx-auto max-w-[780px]" ref={gridRef}>
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

      {showFab && !isCryptoModalOpen && !isGccMateModalOpen && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            right: "0px",
            bottom: "18px",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <button
            onClick={() => navigate("/wearehiring")}
            className="pointer-events-auto transition active:scale-95"
            aria-label="My Services"
            title="My Services"
            type="button"
          >
            <img
              src={ASK_OXY_ICON_URL}
              alt="ASKOXY.AI"
              className="right-0 h-16 w-auto select-none md:h-20"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      )}

      {isGccMateModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6"
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
    </div>
  );
}