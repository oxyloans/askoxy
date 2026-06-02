import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import web1 from "../assets/img/web1.png";
import web2 from "../assets/img/web2.png";
import web3 from "../assets/img/web3.png";
import web31 from "../assets/img/web3.11.png";
import web4 from "../assets/img/web4.png";
import web5 from "../assets/img/web5.png";

import arrow0 from "../assets/img/arrow0.png";
import line1 from "../assets/img/line1.png";
import line2 from "../assets/img/line2.png";
import line3 from "../assets/img/line3.png";
import line4 from "../assets/img/line4.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const Whiteboardtheme: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 6);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (
    type: "loans" | "jobs" | "gold" | "bharat" | "studyabroad" | "oxybricks",
  ) => {
    if (type === "studyabroad") return navigate("/studyabroad");
    if (type === "bharat") return navigate("/bharath-aistore");
    if (type === "jobs") return navigate("/jobspremierleague");
    if (type === "gold") return navigate("/oxygold");
    if (type === "loans") return navigate("/loansandinvest");
    if (type === "oxybricks") return navigate("/fpl");
  };

  const handleAdcbAiClick = () => {
    window.open(
      "https://www.askoxy.ai/radha/fab-ai-intelligence",
      "_blank",
      "noopener,noreferrer",
    );
  };
  
  const cards = [
    {
      key: "loans",
      league: "IP2PL",
      image: web1,
      color: "#6B35C7",
      shadow: "drop-shadow(0 10px 10px rgba(107,53,199,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(107,53,199,0.34))",
      onClick: () => handleCardClick("loans"),
    },
    {
      key: "jobs",
      league: "JPL",
      image: web2,
      color: "#0B4697",
      shadow: "drop-shadow(0 10px 10px rgba(11,70,151,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(11,70,151,0.34))",
      onClick: () => handleCardClick("jobs"),
    },
    {
      key: "studyabroad",
      league: "SAPL",
      image: web3,
      color: "#D71D8E",
      shadow: "drop-shadow(0 10px 10px rgba(215,29,142,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(215,29,142,0.34))",
      onClick: () => handleCardClick("studyabroad"),
      big: true,
    },
    {
      key: "oxybricks",
      league: "FPL",
      image: web31,
      color: "#6B35C7",
      shadow: "drop-shadow(0 10px 10px rgba(107,53,199,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(107,53,199,0.34))",
      onClick: () => handleCardClick("oxybricks"),
      big: true,
    },
    {
      key: "gold",
      league: "GPL",
      image: web4,
      color: "#C48A00",
      shadow: "drop-shadow(0 10px 10px rgba(196,138,0,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(196,138,0,0.34))",
      onClick: () => handleCardClick("gold"),
    },
    {
      key: "bharat",
      league: "AIPL",
      image: web5,
      color: "#5A5A5A",
      shadow: "drop-shadow(0 10px 10px rgba(90,90,90,0.22))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(90,90,90,0.30))",
      onClick: () => handleCardClick("bharat"),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white text-[#1a1a1a]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(170,170,170,0.22) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.18) 87.5%),
            linear-gradient(150deg, rgba(170,170,170,0.22) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.18) 87.5%),
            linear-gradient(90deg, rgba(170,170,170,0.08) 2%, transparent 2.5%, transparent 97%, rgba(170,170,170,0.08) 97.5%)
          `,
          backgroundSize: "42px 72px",
          backgroundPosition: "0 0, 0 0, 21px 36px",
        }}
      />

      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#6B35C7]/16 blur-[90px]" />
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[#D71D8E]/14 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-[#C48A00]/16 blur-[95px]" />
      <div className="pointer-events-none absolute bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#1F9D38]/12 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1540px] px-3 pb-5 pt-6 sm:px-6 sm:pb-7 sm:pt-8 md:px-8 lg:px-10 lg:pb-8 lg:pt-10 xl:px-12">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative mx-auto max-w-[1320px] text-center">
            <motion.h5 className="mx-auto max-w-[1320px] text-center text-[28px] leading-[1.08] tracking-[-0.04em] sm:text-[38px] md:text-[48px] lg:text-[58px] xl:text-[64px]">
              <span className="block font-normal text-[#5E5E5E]">
                One Responsible{" "}
                <span className="font-bold text-[#5543C8]">AI</span> Platform
              </span>

              <span className="mt-2 block font-normal text-[#5E5E5E]">
                <span className="font-bold text-[#D71D8E]">Multiple</span>{" "}
                Premier{" "}
                <span className="font-bold text-[#1F9D38]">Leagues</span>
              </span>
            </motion.h5>

            <motion.div
              onClick={() => {
                window.location.href = "/radha/fab-ai-intelligence";
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="h-4 w-4 cursor-pointer rounded-full border-2 border-dotted border-[#5543C8]"
              
            />

            <img
              src={arrow0}
              alt="arrow"
              className="pointer-events-none absolute hidden object-contain lg:block"
              style={{
                left: "14%",
                top: "120%",
                width: "clamp(90px, 7.5vw, 140px)",
                transform: "translateY(10px) rotate(-8deg)",
              }}
            />
          </div>

          <div className="mt-8 grid grid-cols-3 items-end gap-x-1 gap-y-4 sm:mt-9 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:mt-12 md:grid-cols-6 md:gap-x-2 lg:gap-x-3 xl:gap-x-4">
            {cards.map((card, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={card.key}
                  onClick={card.onClick}
                  className="group flex w-full cursor-pointer flex-col items-center justify-end border-0 bg-transparent p-0"
                  type="button"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: "easeOut",
                    }}
                    className={`relative flex w-full items-end justify-center rounded-[24px] ${
                      card.big
                        ? "h-[142px] sm:h-[246px] md:h-[350px]"
                        : "h-[128px] sm:h-[208px] md:h-[270px]"
                    }`}
                  >
                    <motion.img
                      src={card.image}
                      alt={card.league}
                      className={`relative z-10 w-full object-contain ${
                        card.big
                          ? "max-w-[118px] sm:max-w-[232px] md:max-w-[305px]"
                          : "max-w-[106px] sm:max-w-[172px] md:max-w-[224px]"
                      }`}
                      style={{
                        filter: isActive ? card.hoverShadow : card.shadow,
                      }}
                      animate={{
                        scale: isActive ? 1.08 : 1,
                        y: isActive ? -12 : 0,
                      }}
                      transition={{
                        duration: 0.65,
                        ease: "easeInOut",
                      }}
                      whileHover={{
                        scale: 1.18,
                        y: -12,
                        filter: card.hoverShadow,
                        transition: { duration: 0.25 },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: isActive ? 1.08 : 1,
                      opacity: isActive ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.35 }}
                    className="mt-1 flex h-[26px] items-start justify-center px-1 sm:mt-2 sm:h-[42px] md:h-[48px]"
                  >
                    <h3
                      className="text-center text-[14px] font-bold leading-[1.1] sm:text-[19px] md:text-[21px]"
                      style={{ color: card.color }}
                    >
                      {card.league}
                    </h3>
                  </motion.div>
                </button>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.45 }}
            className="mt-7 w-full text-center sm:mt-8 lg:mt-12"
          >
            <div
              className="mx-auto flex max-w-[1500px] flex-wrap items-baseline justify-center text-[#4c4c4c]"
              style={{
                fontSize: "clamp(15px, 2vw, 31px)",
                gap: "0.18em 0.22em",
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              <span>The</span>
              <span
                className="inline-flex items-center rounded-[6px] bg-[#5543C8] font-bold text-white"
                style={{
                  padding: "0.05em 0.34em",
                  fontSize: "0.88em",
                  lineHeight: 1.1,
                }}
              >
                AI
              </span>
              <span>Digital Ecosystem for</span>

              <span className="inline-flex flex-col items-center leading-none text-[#1565C9]">
                <span>Careers,</span>
                <img
                  src={line1}
                  alt=""
                  style={{
                    marginTop: 2,
                    height: "clamp(4px,0.45vw,6px)",
                    width: "100%",
                  }}
                />
              </span>

              <span className="inline-flex flex-col items-center leading-none text-[#1F9D38]">
                <span>Commerce,</span>
                <img
                  src={line2}
                  alt=""
                  style={{
                    marginTop: 2,
                    height: "clamp(4px,0.45vw,6px)",
                    width: "100%",
                  }}
                />
              </span>

              <span className="inline-flex flex-col items-center leading-none text-[#E1A517]">
                <span>Capital</span>
                <img
                  src={line3}
                  alt=""
                  style={{
                    marginTop: 2,
                    height: "clamp(4px,0.45vw,6px)",
                    width: "100%",
                  }}
                />
              </span>

              <span>&amp;</span>

              <span className="inline-flex flex-col items-center leading-none text-[#D71D8E]">
                <span>Global Capability Centers.</span>
                <img
                  src={line4}
                  alt=""
                  style={{
                    marginTop: 2,
                    height: "clamp(4px,0.45vw,6px)",
                    width: "100%",
                  }}
                />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Whiteboardtheme;
