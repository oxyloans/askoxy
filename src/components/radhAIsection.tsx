import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Mic,
  Sparkles,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { SiX } from "react-icons/si";

import AI1 from "../assets/img/AI1.png";

const RadhAISection: React.FC = () => {
  const navigate = useNavigate();

  const stats = ["100+ LLMs", "1000+ AI Agents", "Voice AI", "24/7 Clone"];

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/oxyradhakrishna/",
      icon: Linkedin,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/tvradhakrishna/",
      icon: Instagram,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/thatavarti.venkataradhakrishna/",
      icon: Facebook,
    },
    {
      name: "X",
      url: "https://x.com/RadhakrishnaIND",
      icon: SiX,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@askoxyDOTai",
      icon: Youtube,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f6f9ff] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#053776] via-[#008ec4] to-[#053776] p-[1px] shadow-[0_35px_90px_rgba(5,55,118,0.22)]"
        >
          <div className="relative overflow-hidden rounded-[33px] bg-gradient-to-br from-[#06182e] via-[#0b315c] to-[#05263a]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,142,196,0.35),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(5,55,118,0.65),transparent_45%)]" />

            <motion.div
              animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#008ec4]/30 blur-3xl"
            />

            <motion.div
              animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12 xl:p-14">
              {/* Content */}
              <div className="order-2 text-center lg:order-1 lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mx-auto mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-cyan-100 backdrop-blur-xl lg:mx-0"
                >
                  <Sparkles size={15} className="text-cyan-200" />
                  CEO AI Clone
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18, duration: 0.6 }}
                  className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-[62px]"
                >
                  Meet{" "}
                  <span className="bg-gradient-to-r from-[#52d9ff] via-white to-[#9beafe] bg-clip-text text-transparent">
                    radhAI
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.28, duration: 0.6 }}
                  className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-200 sm:text-lg lg:mx-0"
                >
                  The AI Clone of CEO{" "}
                  <span className="font-bold text-white">
                    Radhakrishna Thatavarti
                  </span>
                  , available 24/7 to guide users across AI, jobs, loans,
                  investments, business growth, and digital execution.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.38, duration: 0.6 }}
                  className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center lg:justify-start"
                >
                  {stats.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-center text-sm font-bold text-white backdrop-blur-xl"
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="mt-8 flex justify-center lg:justify-start"
                >
                  <motion.button
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/radhAI")}
                    className="group relative overflow-hidden rounded-2xl px-7 py-4 font-bold text-white shadow-[0_20px_50px_rgba(0,142,196,0.35)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#008ec4] via-[#0ea5e9] to-[#053776]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
                    <div className="absolute -left-20 top-0 h-full w-16 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[120%]" />

                    <span className="relative z-10 flex items-center gap-2">
                      <Mic size={18} />
                      Talk to radhAI
                      <ArrowRight size={18} />
                    </span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
                >
                  {socialLinks.map(({ name, url, icon: Icon }) => (
                    <motion.a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      whileHover={{ y: -3, scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              {/* Image */}
              <div className="order-1 flex items-center justify-center lg:order-2">
                <motion.img
                  src={AI1}
                  alt="radhAI"
                  loading="lazy"
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full max-w-[340px] rounded-[32px] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.15)] sm:max-w-[430px] lg:max-w-[520px] xl:max-w-[560px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default RadhAISection;