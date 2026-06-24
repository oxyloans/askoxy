import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ceoImage from "../assets/img/radhAImain.png";
import element1 from "../assets/img/element1.png";
import element2 from "../assets/img/element2.png";
import element3 from "../assets/img/element3.png";
import element4 from "../assets/img/element4.png";
import { useNavigate } from "react-router-dom";

const RadhAiCeo: React.FC = () => {
  const navigate = useNavigate();

  const handletalktoceo = () => {
    navigate("/radhAI");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 sm:px-8 lg:px-10 xl:px-12">
      <motion.img
        src={element3}
        alt=""
        animate={{ rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute left-0 top-0 z-0 w-[42%] max-w-[520px] opacity-80 sm:w-[34%] lg:w-[30%]"
      />

      <motion.img
        src={element3}
        alt=""
        animate={{ rotate: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute right-0 top-0 z-0 w-[42%] max-w-[540px] scale-x-[-1] opacity-80 sm:w-[36%] lg:w-[32%]"
      />

      <img
        src={element4}
        alt=""
        className="pointer-events-none absolute bottom-[-6px] left-1/2 z-0 w-[1200px] max-w-none -translate-x-1/2 opacity-80 sm:w-[1450px] lg:w-[1650px] xl:w-[1780px]"
      />

      <motion.img
        src={element1}
        alt=""
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="pointer-events-none absolute -bottom-4 -left-10 z-0 w-[220px] opacity-90 sm:-bottom-4 sm:-left-14 sm:w-[290px] lg:-bottom-8 lg:-left-20 lg:w-[370px] xl:-bottom-8 xl:-left-24 xl:w-[430px]"
      />

      <motion.img
        src={element2}
        alt=""
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="pointer-events-none absolute -right-8 -bottom-12 z-0 w-[85px] opacity-95 sm:-right-10 sm:-bottom-16 sm:w-[110px] lg:-right-12 lg:-bottom-20 lg:w-[140px] xl:-right-16 xl:-bottom-24 xl:w-[170px]"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 pt-8 lg:min-h-[690px] lg:flex-row lg:items-start lg:gap-10 lg:pt-[90px] xl:min-h-[735px] xl:pt-[110px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[560px] text-center lg:text-left xl:max-w-[600px]"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[25px] font-extrabold leading-tight tracking-tight text-[#55189d] sm:text-[28px] lg:text-[30px] xl:text-[34px]"
          >
            One Conversation. Every Answer.
          </motion.h1>

          <div className="mt-6 flex items-end justify-center gap-3 sm:gap-4 lg:justify-start">
            <span className="text-[42px] font-light leading-none text-[#3b3b3b] sm:text-[54px] lg:text-[60px] xl:text-[64px]">
              meet
            </span>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-[46px] font-extrabold leading-none text-white sm:text-[58px] lg:text-[68px] xl:text-[72px]"
              style={{
                WebkitTextStroke: "2.5px #5b239b",
                textShadow: "0 2px 0 rgba(91,35,155,0.12)",
              }}
            >
              radhAI
            </motion.span>
          </div>

          <p className="mt-6 max-w-[560px] text-[16px] leading-[1.8] text-[#333] sm:text-[19px] lg:text-[20px] xl:text-[21px]">
            The AI Clone of our CEO, trained on years of business knowledge,
            insights, and experience. Get instant answers, guidance, and
            solutions for all your queries anytime, anywhere.
          </p>

          <h2 className="mt-6 text-[28px] font-black leading-tight tracking-wide text-[#5a159f] sm:text-[34px] lg:text-[39px] xl:text-[42px]">
            TALK . ASK. SOLVE
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handletalktoceo}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#bb77f0] via-[#8234d2] to-[#5d0eb7] px-7 py-2 text-[16px] tracking-wide text-white shadow-[0_18px_45px_rgba(106,29,188,0.25)] sm:px-9 sm:py-3.5 sm:text-[24px] lg:px-10 lg:py-2 lg:text-[28px]"
          >
            Talk to CEO
            <ArrowRight size={32} strokeWidth={3.5} />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative flex w-full max-w-[560px] items-start justify-center lg:max-w-[650px] xl:max-w-[680px]"
        >
          <div className="relative flex h-[330px] w-full items-start justify-center sm:h-[445px] lg:h-[560px] xl:h-[600px]">
            <motion.img
              src={ceoImage}
              alt="Radhakrishna T CEO and AI clone"
              className="h-full w-full object-contain object-center"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RadhAiCeo;
