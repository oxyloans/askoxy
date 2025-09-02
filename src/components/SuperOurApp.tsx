import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// === Image imports (s1…s12) ===
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

// Left side big image
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
  const go = (r: string) => navigate(r);
    const LOGIN_URL = "/whatsapplogin";
const handleSignIn = () => {
  try {
    setIsLoading(true);

    const userId = localStorage.getItem("userId");
    const redirectPath = "/main/crypto"; // your desired path

    if (userId) {
      // User is already logged in
      navigate(redirectPath);
    } else {
      // Save redirect path before redirecting to login
      sessionStorage.setItem("redirectPath", redirectPath);
      window.location.href = LOGIN_URL;
    }
  } catch (error) {
    console.error("Sign in error:", error);
  } finally {
    setIsLoading(false);
  }
};
const tiles: Tile[] = [
  { id: "s13", src: s13, route: "/genoxy", title: "GENOXY" },
  { id: "s11", src: s11, route: "/genoxy/chat", title: "AI LLMS" },
  {
    id: "s12",
    src: s12,
    onClick: () => handleSignIn(),
    title: "Crypto",
  },
  {
    id: "s7",
    src: s7,
    route: "/rice2roboecommers",
    title: "Rice 2 Robo\nECommerce",
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
    title: "BlockChain",
  },
  { id: "s5", src: s5, route: "/nyayagpt", title: "Nyaya GPT" },
  { id: "s6", src: s6, route: "/realestate", title: "Real Estate" },
  {
    id: "s3",
    src: s3,
    route: "/goldandsilveranddiamonds",
    title: "Gold, Silver\n& Diamonds",
  },
  { id: "s8", src: s8, route: "/glms", title: "GLMS" },
  { id: "s1", src: s1, route: "/caandcsservices", title: "CA CS\nServices" },
  { id: "s9", src: s9, route: "/studyabroad", title: "Study Abroad" },
];


  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Background (matches poster feel) */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg,#5C3391 0%,#5D4086 30%,#6F4386 65%,#312C74 100%)",
        }}
      >
        {/* Content frame with balanced side padding and vertical rhythm */}
        <div className="mx-auto max-w-[1240px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-end gap-6 sm:gap-8 lg:gap-12">
            {/* Left: phone mockup anchored near bottom like the image */}
            <div className="w-full lg:w-[48%] flex justify-center lg:justify-start">
              <img
                src={leftImage}
                alt="ASKOXY.AI Super App"
                className="max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[520px] w-full h-auto object-contain drop-shadow-2xl select-none"
                draggable={false}
              />
            </div>

            {/* Right: 12-tile grid */}
            <div className="w-full lg:w-[52%]">
              {/* Grid width is slightly narrower than the column to mimic the poster spacing */}
              <div className="mx-auto max-w-[780px]">
                {/* Even, poster-like spacing: tighter column gap, a bit more row gap */}
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
                      {/* Square tile with consistent padding and subtle ring like the image */}
                      <button
                        onClick={() => {
                          if (t.onClick) {
                            t.onClick(); // Custom handler (like Crypto login)
                          } else if (t.route) {
                            go(t.route); // Navigate if route is defined
                          }
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
                        />
                      </button>

                      {/* Caption with tight leading & two-line support (matches poster) */}
                      <p
                        className="mt-2 sm:mt-2.5 text-center text-white font-semibold leading-tight whitespace-pre-line
                                      text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]"
                      >
                        {t.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom breathing space like poster */}
          <div className="h-4 sm:h-6 lg:h-8" />
        </div>
      </div>
    </div>
  );
}
