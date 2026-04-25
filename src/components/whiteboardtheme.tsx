import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import web1 from "../assets/img/web1.png";
import web2 from "../assets/img/web2.png";
import web3 from "../assets/img/web3.png";
import web4 from "../assets/img/web4.png";
import web5 from "../assets/img/web5.png";

import arrow0 from "../assets/img/arrow0.png";
import line1 from "../assets/img/line1.png";
import line2 from "../assets/img/line2.png";
import line3 from "../assets/img/line3.png";
import line4 from "../assets/img/line4.png";

import oxygold from "../assets/img/oxygoldlogo.png";
import oxyloansLogo from "../assets/img/image1.png";

type PreviewCardData = {
  title: string;
  logo: string;
  redirectUrl: string;
  theme: "gold" | "loan";
  bannerPrefix: string;
  bannerHighlight: string;
  features: string[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const Whiteboardtheme: React.FC = () => {
  const navigate = useNavigate();
  const [previewCard, setPreviewCard] = useState<PreviewCardData | null>(null);

  const closePreview = () => setPreviewCard(null);

  const handleJobNavigate = (id: string | null) => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(id ? `${pathPrefix}/${id}/ALL` : `${pathPrefix}/default/ALL`);
  };

  const mobileLogoSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2400,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipeToSlide: true,
  };

  const handleCardClick = (
    type: "loans" | "jobs" | "gold" | "bharat" | "studyabroad",
  ) => {
    if (type === "studyabroad") {
      navigate("/studyabroad");
      return;
    }

    if (type === "bharat") {
      navigate("/bharath-aistore");
      return;
    }

    if (type === "jobs") {
      navigate("/jobspremierleague");
      return;
    }

    if (type === "gold") {
      navigate("/oxygold");
      return;
    }

    if (type === "loans") {
      navigate("/loansandinvest");
      return;
    }
  };

  const sideCards = [
    {
      key: "loans",
      title: "Loans &\nInvestments",
      image: web1,
      titleClass: "text-[#6B35C7]",
      onClick: () => handleCardClick("loans"),
      hoverShadow: "drop-shadow-[0_10px_22px_rgba(107,53,199,0.22)]",
    },
    {
      key: "jobs",
      title: "Our Jobs",
      image: web2,
      titleClass: "text-[#0B4697]",
      onClick: () => handleCardClick("jobs"),
      hoverShadow: "drop-shadow-[0_10px_22px_rgba(11,70,151,0.22)]",
    },
    {
      key: "gold",
      title: "Gold",
      image: web4,
      titleClass: "text-[#C48A00]",
      onClick: () => handleCardClick("gold"),
      hoverShadow: "drop-shadow-[0_10px_22px_rgba(196,138,0,0.24)]",
    },
    {
      key: "bharat",
      title: "Bharat\nAI Store",
      image: web5,
      titleClass: "text-[#5A5A5A]",
      onClick: () => handleCardClick("bharat"),
      hoverShadow: "drop-shadow-[0_10px_22px_rgba(90,90,90,0.18)]",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7] text-[#1a1a1a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,170,255,0.22),transparent_16%),radial-gradient(circle_at_top_right,rgba(255,94,189,0.20),transparent_16%),radial-gradient(circle_at_bottom_left,rgba(255,219,115,0.24),transparent_14%),radial-gradient(circle_at_66%_36%,rgba(177,112,255,0.14),transparent_12%),linear-gradient(180deg,#ffffff_0%,#fafafa_40%,#f5f5f6_100%)]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(170,170,170,0.22) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.18) 87.5%, rgba(170,170,170,0.18)),
            linear-gradient(150deg, rgba(170,170,170,0.22) 12%, transparent 12.5%, transparent 87%, rgba(170,170,170,0.18) 87.5%, rgba(170,170,170,0.18)),
            linear-gradient(90deg, rgba(170,170,170,0.08) 2%, transparent 2.5%, transparent 97%, rgba(170,170,170,0.08) 97.5%, rgba(170,170,170,0.08))
          `,
          backgroundSize: "42px 72px",
          backgroundPosition: "0 0, 0 0, 21px 36px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-gradient-to-t from-white via-white/80 to-transparent" />

      <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-[#84B6FF]/40 blur-3xl md:h-36 md:w-36" />
      <div className="pointer-events-none absolute right-4 top-[130px] h-36 w-36 rounded-full bg-[#FF67C0]/28 blur-3xl md:h-56 md:w-56" />
      <div className="pointer-events-none absolute left-10 bottom-10 h-24 w-24 rounded-full bg-[#FFD963]/28 blur-3xl md:h-36 md:w-36" />
      <div className="pointer-events-none absolute right-[33%] top-[34%] h-20 w-20 rounded-full bg-[#B86FFF]/18 blur-3xl md:h-28 md:w-28" />

      <AnimatePresence>
        {previewCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/35 px-3 sm:px-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className={`relative w-full max-w-[720px] rounded-[24px] px-4 py-5 sm:px-7 sm:py-7 ${
                previewCard.theme === "gold" ? "bg-[#f5eedf]" : "bg-[#e7eef6]"
              }`}
            >
              <button
                onClick={closePreview}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f5f5] text-[28px] font-bold text-[#111] shadow-sm sm:right-4 sm:top-4"
                type="button"
              >
                ×
              </button>

              <div className="flex justify-center pt-3 sm:pt-1">
                <img
                  src={previewCard.logo}
                  alt={previewCard.title}
                  className="h-[56px] object-contain sm:h-[72px] md:h-[82px]"
                />
              </div>

              <div
                className={`mt-5 rounded-full px-4 py-3 text-center text-[14px] font-medium leading-tight sm:px-6 sm:text-[18px] md:text-[20px] ${
                  previewCard.theme === "gold"
                    ? "bg-[#b8860b] text-white"
                    : "bg-[#2c63b5] text-[#ffd91f]"
                }`}
              >
                <span className="mr-2 font-bold text-white">
                  {previewCard.bannerPrefix}
                </span>
                <span>{previewCard.bannerHighlight}</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 text-[14px] text-[#4a4a4a] sm:mt-7 sm:grid-cols-2 sm:text-[16px] md:text-[18px]">
                {previewCard.features.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-[1px] text-[18px] font-bold text-[#2ca24c] sm:text-[22px]">
                      ✔
                    </span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex justify-center">
                <button
                  onClick={() => {
                    window.open(previewCard.redirectUrl, "_blank");
                    closePreview();
                  }}
                  className={`rounded-full px-8 py-3 text-[16px] font-semibold text-white shadow-[0_8px_22px_rgba(0,0,0,0.15)] transition duration-200 hover:scale-[1.03] sm:px-10 sm:text-[18px] ${
                    previewCard.theme === "gold"
                      ? "bg-[#b8860b] hover:bg-[#a07609]"
                      : "bg-[#2c63b5] hover:bg-[#1f4f9a]"
                  }`}
                  type="button"
                >
                  Open Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-[1540px] px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 md:px-8 lg:px-10 lg:pb-10 lg:pt-32 xl:px-12 xl:pb-12 xl:pt-36">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="relative mx-auto max-w-[1320px] text-center">
            <motion.h5 className="mx-auto max-w-[1320px] text-[26px] leading-[1.1] tracking-[-0.03em] text-center sm:text-[34px] md:text-[44px] lg:text-[56px] xl:text-[62px]">
              <span className="block font-normal text-[#5E5E5E]">
                One Responsible{" "}
                <motion.span
                  animate={{
                    scale: [1, 1.08, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatDelay: 10,
                    ease: "easeInOut",
                  }}
                  className="inline-block font-bold text-[#5543C8] will-change-transform"
                  style={{ transformOrigin: "center" }}
                >
                  AI
                </motion.span>{" "}
                Platform
              </span>

              <span className="mt-2 block font-normal text-[#5E5E5E]">
                <motion.span
                  animate={{
                    scale: [1, 1.08, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatDelay: 10,
                    delay: 1.8,
                    ease: "easeInOut",
                  }}
                  className="inline-block font-bold text-[#D71D8E] will-change-transform"
                  style={{ transformOrigin: "center" }}
                >
                  Multiple
                </motion.span>{" "}
                Premier{" "}
                <motion.span
                  animate={{
                    scale: [1, 1.08, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatDelay: 10,
                    delay: 3.6,
                    ease: "easeInOut",
                  }}
                  className="inline-block font-bold text-[#1F9D38] will-change-transform"
                  style={{ transformOrigin: "center" }}
                >
                  Leagues
                </motion.span>
              </span>
            </motion.h5>

            <img
              src={arrow0}
              alt="arrow"
              className="pointer-events-none absolute hidden lg:block object-contain"
              style={{
                left: "17%",
                top: "120%",
                width: "clamp(90px, 7.5vw, 140px)",
                transform: "translateY(10px) rotate(-8deg)",
              }}
            />
          </div>

          <div
            className="mt-10 hidden md:grid lg:mt-12 xl:mt-16"
            style={{
              gridTemplateColumns: "1fr 1fr 1.55fr 1fr 1fr",
              gap: "clamp(12px, 1.4vw, 22px)",
              alignItems: "end",
            }}
          >
            <div className="flex h-full items-end justify-center">
              <button
                onClick={() => handleCardClick("loans")}
                className="group flex w-full flex-col items-center justify-end"
                type="button"
              >
                <div className="flex h-[270px] items-end justify-center">
                  <img
                    src={web1}
                    alt="Loans & Investments"
                    className="w-full max-w-[225px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_22px_rgba(107,53,199,0.22)]"
                  />
                </div>
                <div className="mt-4 flex h-[64px] items-start justify-center">
                  <h3
                    className="whitespace-pre-line text-center font-medium leading-[1.12] tracking-[-0.01em] text-[#6B35C7]"
                    style={{ fontSize: "clamp(18px, 1.28vw, 24px)" }}
                  >
                    {"Loans &\nInvestments"}
                  </h3>
                </div>
              </button>
            </div>

            <div className="flex h-full items-end justify-center">
              <button
                onClick={() => handleCardClick("jobs")}
                className="group flex w-full flex-col items-center justify-end"
                type="button"
              >
                <div className="flex h-[270px] items-end justify-center">
                  <img
                    src={web2}
                    alt="Our Jobs"
                    className="w-full max-w-[225px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_22px_rgba(11,70,151,0.22)]"
                  />
                </div>
                <div className="mt-4 flex h-[64px] items-start justify-center">
                  <h3
                    className="text-center font-medium leading-[1.12] tracking-[-0.01em] text-[#0B4697]"
                    style={{ fontSize: "clamp(18px, 1.28vw, 24px)" }}
                  >
                    Our Jobs
                  </h3>
                </div>
              </button>
            </div>

            <div className="flex h-full items-end justify-center">
              <div
                onClick={() => navigate("/studyabroad")}
                className="group flex w-full cursor-pointer flex-col items-center justify-end"
              >
                <div className="flex h-[340px] items-end justify-center">
                  <img
                    src={web3}
                    alt="STUDY ABROAD"
                    className="w-full max-w-[400px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_24px_rgba(196,40,137,0.18)]"
                  />
                </div>
                <div className="mt-4 h-[38px]" />
              </div>
            </div>

            <div className="flex h-full items-end justify-center">
              <button
                onClick={() => handleCardClick("gold")}
                className="group flex w-full flex-col items-center justify-end"
                type="button"
              >
                <div className="flex h-[270px] items-end justify-center">
                  <img
                    src={web4}
                    alt="Gold"
                    className="w-full max-w-[225px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_22px_rgba(196,138,0,0.24)]"
                  />
                </div>
                <div className="mt-4 flex h-[64px] items-start justify-center">
                  <h3
                    className="text-center font-medium leading-[1.12] tracking-[-0.01em] text-[#C48A00]"
                    style={{ fontSize: "clamp(18px, 1.28vw, 24px)" }}
                  >
                    Gold
                  </h3>
                </div>
              </button>
            </div>

            <div className="flex h-full items-end justify-center">
              <button
                onClick={() => handleCardClick("bharat")}
                className="group flex w-full flex-col items-center justify-end"
                type="button"
              >
                <div className="flex h-[270px] items-end justify-center">
                  <img
                    src={web5}
                    alt="Bharat AI Store"
                    className="w-full max-w-[225px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_22px_rgba(90,90,90,0.18)]"
                  />
                </div>
                <div className="mt-4 flex h-[64px] items-start justify-center">
                  <h3
                    className="whitespace-pre-line text-center font-medium leading-[1.12] tracking-[-0.01em] text-[#5A5A5A]"
                    style={{ fontSize: "clamp(18px, 1.28vw, 24px)" }}
                  >
                    {"Bharat\nAI Store"}
                  </h3>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-10 md:hidden">
            <div className="mb-8 flex justify-center">
              <div className="group">
                <img
                  src={web3}
                  alt="GCCMate"
                  className="w-full max-w-[230px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:brightness-[1.02] group-hover:drop-shadow-[0_10px_24px_rgba(196,40,137,0.18)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6">
              {sideCards.map((card) => (
                <button
                  key={card.key}
                  onClick={card.onClick}
                  className="group flex flex-col items-center"
                  type="button"
                >
                  <div className="flex h-[160px] items-end justify-center">
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`w-full max-w-[145px] object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:brightness-[1.02] ${card.hoverShadow}`}
                    />
                  </div>
                  <div className="mt-3 flex h-[50px] items-start justify-center">
                    <h3
                      className={`whitespace-pre-line text-center font-medium leading-[1.12] tracking-[-0.01em] ${card.titleClass}`}
                      style={{ fontSize: "clamp(15px, 4vw, 20px)" }}
                    >
                      {card.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.45 }}
            className="mt-16 w-full text-center sm:mt-10 lg:mt-16"
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
                    objectFit: "fill",
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
                    objectFit: "fill",
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
                    objectFit: "fill",
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
                    objectFit: "fill",
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
