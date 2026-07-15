import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WalkInInterviewStepsModal from "./WalkInInterviewStepsModal";

import web1 from "../assets/img/web1.png";
import web2 from "../assets/img/web2.png";
import web3 from "../assets/img/web3.png";
import web31 from "../assets/img/web3.11.png";
import web4 from "../assets/img/web4.png";
import web5 from "../assets/img/web5.png";

import arrow0 from "../assets/img/arrow0.png";
import arrow1 from "../assets/img/arrow1.png";
import speak1 from "../assets/img/speak1.png";
import line1 from "../assets/img/line1.png";
import line2 from "../assets/img/line2.png";
import line3 from "../assets/img/line3.png";
import line4 from "../assets/img/line4.png";
import BASE_URL from "../Config";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const JOBS_COUNT_API = `${BASE_URL}/marketing-service/campgin/companies-jobs-count`;

type JobsCount = {
  activeJobs: number;
  totalCompanies: number;
};

type CardType =
  | "loans"
  | "jobs"
  | "gold"
  | "bharat"
  | "studyabroad"
  | "oxybricks";

const Whiteboardtheme: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [jobsCount, setJobsCount] = useState<JobsCount>({
    activeJobs: 0,
    totalCompanies: 0,
  });
  const [isJobsCountLoading, setIsJobsCountLoading] = useState(true);
  const [modalActionType, setModalActionType] = useState<"signin" | "hiring">(
    "signin",
  );
  const LOGIN_URL = "/whatsapplogin";
  const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";
  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/viewjobdetails/default/ALL";
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
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const getJobsCount = async () => {
      try {
        const response = await fetch(JOBS_COUNT_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load jobs count (${response.status})`);
        }

        const data: JobsCount = await response.json();
        setJobsCount({
          activeJobs: Number(data.activeJobs) || 0,
          totalCompanies: Number(data.totalCompanies) || 0,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Jobs count error:", error);
        }
      } finally {
        if (!controller.signal.aborted) setIsJobsCountLoading(false);
      }
    };

    getJobsCount();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev: any) => (prev + 1) % 6);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  const handleCardClick = (type: CardType) => {
    if (type === "studyabroad") return navigate("/studyabroad");
    if (type === "bharat") return navigate("/bharath-aistore");
    if (type === "jobs") return navigate("/jpl");
    if (type === "gold") return navigate("/oxygold");
    if (type === "loans") return navigate("/loansandinvest");
    if (type === "oxybricks") return navigate("/fpl");
  };

  const openWalkInModal = () => {
    setModalActionType("signin");
    setIsWalkInModalOpen(true);
  };

  const jobsCountCard = (desktop = false) => (
    <button
      type="button"
      onClick={openWalkInModal}
      className="flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl   text-center  transition-all duration-300 hover:-translate-y-1 active:scale-95"
      style={{ width: desktop ? "clamp(130px, 11vw, 175px)" : "132px" }}
      aria-label={`${jobsCount.activeJobs} active jobs across ${jobsCount.totalCompanies} companies. Apply now`}
    >
      {/* counts */}
      <span className="flex flex-col gap-2 px-2.5 pb-2 pt-2.5">
        <span className="grid grid-cols-[44px_1fr] items-center gap-1.5">
          <strong className="text-right text-[18px] font-extrabold leading-none text-[#5543C8] sm:text-[14px] md:text-[16px]">
            {isJobsCountLoading ? "—" : jobsCount.activeJobs}
          </strong>
          <span className="border-l border-[#ded9ff] pl-1.5 text-left text-[9px] font-bold leading-[1.15] text-[#333] sm:text-[11px] md:text-[12px]">
            Active Jobs
          </span>
        </span>
        <span className="grid grid-cols-[44px_1fr] items-center gap-1.5">
          <strong className="text-right text-[18px] font-extrabold leading-none text-[#D71D8E] sm:text-[14px] md:text-[16px]">
            {isJobsCountLoading ? "—" : jobsCount.totalCompanies}
          </strong>
          <span className="border-l border-[#ded9ff] pl-1.5 text-left text-[9px] font-bold leading-[1.15] text-[#333] sm:text-[11px] md:text-[12px]">
            Total Companies
          </span>
        </span>
      </span>

      {/* divider */}
      <span className="mx-2 block border-t border-[#e8e3ff]" />

      {/* Apply Now */}
      <span className="flex w-full items-center justify-center gap-1 whitespace-nowrap px-2 py-2 text-[10px] font-bold leading-none text-[#5543C8] sm:text-[10px] md:text-[12px]">
        Apply Now
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="h-3 w-3"
        >
          <path
            d="M4 10h11m-4-4 4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );

  const cards = [
    {
      key: "loans",
      league: "IP2PL",
      title: "Peer-to-Peer Lending",
      image: web1,
      color: "#6B35C7",
      shadow: "drop-shadow(0 10px 10px rgba(107,53,199,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(107,53,199,0.34))",
      onClick: () => handleCardClick("loans"),
    },
    {
      key: "jobs",
      league: "JPL",
      title: "Jobs",
      image: web2,
      color: "#0B4697",
      shadow: "drop-shadow(0 10px 10px rgba(11,70,151,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(11,70,151,0.34))",
      onClick: () => handleCardClick("jobs"),
    },
    {
      key: "studyabroad",
      league: "SAPL",
      title: "Study Abroad",
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
      title: "Fractional Ownership",
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
      title: "Gold",
      image: web4,
      color: "#C48A00",
      shadow: "drop-shadow(0 10px 10px rgba(196,138,0,0.25))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(196,138,0,0.34))",
      onClick: () => handleCardClick("gold"),
    },
    {
      key: "bharat",
      league: "AIPL",
      title: "Bharat AI Store",
      image: web5,
      color: "#5A5A5A",
      shadow: "drop-shadow(0 10px 10px rgba(90,90,90,0.22))",
      hoverShadow: "drop-shadow(0 14px 14px rgba(90,90,90,0.30))",
      onClick: () => handleCardClick("bharat"),
    },
  ];

  return (
    <>
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

        <div className="relative z-10 mx-auto max-w-[1540px] px-3 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-8 md:px-8 lg:px-10 lg:pb-7 lg:pt-8 xl:px-12">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="relative mx-auto mb-5 max-w-[1320px] text-center sm:mb-6 md:mb-0">
              <motion.h5 className="mx-auto max-w-[1320px] text-center text-[26px] leading-[1.12] tracking-[-0.04em] sm:text-[38px] md:text-[48px] lg:text-[58px] xl:text-[64px]">
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
            </div>

            <div className="relative">
              <div className="relative z-20 mb-2 grid grid-cols-2 items-start px-3 sm:mb-4 sm:px-6 md:hidden">
                <div className="relative flex h-[158px] w-[132px] flex-col items-center sm:h-[170px]">
                  <button
                    type="button"
                    onClick={() => navigate("/radhai")}
                    className="absolute left-0 top-0 flex h-[132px] w-[132px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-transform duration-300 active:scale-95"
                    aria-label="Speak with radhAI"
                  >
                    <img
                      src={speak1}
                      alt="Speak with radhAI"
                      className="h-full w-full object-contain"
                    />
                  </button>
                  <img
                    src={arrow0}
                    alt=""
                    className="absolute bottom-1 left-1/2 h-[48px] w-[48px] -translate-x-1/2 object-contain sm:h-[54px] sm:w-[54px]"
                  />
                </div>

                <div className="relative ml-auto flex h-[158px] w-[132px] flex-col items-center sm:h-[170px]">
                  <div className="flex h-[132px] w-[132px] items-center justify-center pt-4 sm:pt-3">
                    {jobsCountCard()}
                  </div>
                  <img
                    src={arrow1}
                    alt=""
                    className="absolute bottom-1 left-1/2 h-[48px] w-[48px] -translate-x-1/2 object-contain sm:h-[54px] sm:w-[54px]"
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[130px] md:block lg:h-[145px] xl:h-[155px]">
                <button
                  type="button"
                  onClick={() => navigate("/radhai")}
                  className="pointer-events-auto absolute top-0 -translate-x-1/2 cursor-pointer border-0 bg-transparent p-0 transition-transform duration-300 hover:scale-105"
                  style={{ left: "16.666%" }}
                  aria-label="Speak with radhAI"
                >
                  <img
                    src={speak1}
                    alt="Speak with radhAI"
                    className="h-auto object-contain"
                    style={{ width: "clamp(110px, 10vw, 160px)" }}
                  />
                </button>

                <div
                  className="pointer-events-auto absolute top-0 -translate-x-1/2"
                  style={{ left: "83.333%" }}
                >
                  {jobsCountCard(true)}
                </div>

                <img
                  src={arrow0}
                  alt=""
                  className="absolute object-contain"
                  style={{
                    left: "22%",
                    top: "62%",
                    width: "clamp(65px, 6vw, 100px)",
                  }}
                />
                <img
                  src={arrow1}
                  alt=""
                  className="absolute object-contain"
                  style={{
                    left: "73%",
                    top: "62%",
                    width: "clamp(65px, 6vw, 100px)",
                  }}
                />
              </div>

              <div className="grid grid-cols-3 items-stretch gap-x-2 gap-y-7 pt-1 sm:gap-x-5 sm:gap-y-8 sm:pt-2 md:grid-cols-6 md:gap-x-3 md:gap-y-6 md:pt-[70px] lg:items-end lg:gap-x-3 lg:pt-[74px] xl:gap-x-4 xl:pt-[83px]">
                {cards.map((card, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={card.key}
                      onClick={card.onClick}
                      className="group flex h-full w-full cursor-pointer flex-col items-center justify-end border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5543C8] focus-visible:ring-offset-2"
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
                            ? "h-[120px] sm:h-[220px] md:h-[250px] lg:h-[350px]"
                            : "h-[108px] sm:h-[190px] md:h-[210px] lg:h-[270px]"
                        }`}
                      >
                        <motion.img
                          src={card.image}
                          alt={card.league}
                          className={`relative z-10 w-full object-contain ${
                            card.big
                              ? "max-w-[118px] sm:max-w-[200px] md:max-w-[180px] lg:max-w-[305px]"
                              : "max-w-[106px] sm:max-w-[165px] md:max-w-[145px] lg:max-w-[224px]"
                          }`}
                          style={{
                            filter: isActive ? card.hoverShadow : card.shadow,
                          }}
                          animate={{
                            scale: isActive ? 1.08 : 1,
                            y: isActive ? -12 : 0,
                          }}
                          transition={{ duration: 0.65, ease: "easeInOut" }}
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
                        className="mt-2 flex min-h-[48px] flex-col items-center justify-start px-0.5 sm:min-h-[54px] sm:px-1 md:min-h-[62px] lg:h-auto lg:min-h-0"
                      >
                        <h3
                          className="text-center text-[14px] font-bold leading-[1.1] sm:text-[18px] md:text-[17px] lg:text-[21px]"
                          style={{ color: card.color }}
                        >
                          {card.league}
                        </h3>

                        <h1 className="mt-0.5 block text-center text-[14px] font-bold leading-[1.2] text-gray-600 sm:mt-1 sm:text-[13px] md:text-[14px]">
                          {card.title}
                        </h1>
                      </motion.div>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.45 }}
              className="mt-10 w-full text-center sm:mt-12 md:mt-8 lg:mt-12"
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

      <div
        className="fixed bottom-4 right-1 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:right-2 md:right-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={() => {
            setModalActionType("hiring");
            setIsWalkInModalOpen(true);
          }}
          className=" transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label="We are hiring"
          title="We are hiring"
          type="button"
        >
          <img
            src={ASK_OXY_ICON_URL}
            alt="We are hiring"
            className="h-12 w-auto select-none sm:h-14 md:h-16 lg:h-20"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>

      <WalkInInterviewStepsModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onActionClick={
          modalActionType === "signin"
            ? handleSignIn
            : () => navigate("/wearehiring")
        }
      />
    </>
  );
};

export default Whiteboardtheme;
