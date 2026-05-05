import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaAmazon } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { message } from "antd";

import aiImage from "../assets/img/gt.png";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

const FreeAiBook: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");

  const jobPlanImageUrl = "https://i.ibb.co/twj7WCX3/90-dayl.png";
  const campaignId = "6972eb83-3bc4-4fa9-91a2-e1872b7c04bc";

  const openAmazon = () => {
    window.open("https://amzn.in/d/2Ie3hEg", "_blank");
  };

  useEffect(() => {
    const sendMarketingRequest = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);

        const response = await customerApi.post(
          `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
          {
            askOxyOfers: "FREEAIBOOK",
            mobileNumber: mobileNumber || whatsappNumber,
            userId,
            projectType: "ASKOXY",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (response.status === 200) {
          message.success("Welcome to Free AI Book");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    sendMarketingRequest();
  }, [userId, mobileNumber, whatsappNumber]);

  const handleSignIn = () => {
    setIsLoading(true);

    const slicedCampaignId = campaignId.slice(0, 8);
    const redirectPath = `/campaign/${slicedCampaignId}`;

    sessionStorage.setItem(`campaignFull:${slicedCampaignId}`, campaignId);
    sessionStorage.setItem("redirectPath", redirectPath);

    const uid = localStorage.getItem("userId");

    if (uid) {
      navigate(redirectPath);
      setIsLoading(false);
      return;
    }

    window.location.href = "/whatsappregister";
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const imageLeftAnimation = {
    hidden: { opacity: 0, x: -35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageRightAnimation = {
    hidden: { opacity: 0, x: 35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardClass =
    "mb-8 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.08)]";

  const innerGridClass =
    "grid min-h-[420px] items-center gap-6 p-5 sm:p-6 md:p-7 lg:grid-cols-2 lg:p-8";

  const titleClass =
    "text-xl font-bold leading-snug text-purple-950 sm:text-2xl lg:text-[28px]";

  const paraClass =
    "mt-3 text-sm leading-7 text-gray-600 sm:text-[15px] lg:text-base";

  const badgeClass =
    "mb-3 inline-flex w-fit rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-800 sm:text-sm";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition";

  const imageClass =
    "h-[240px] w-full max-w-[470px] cursor-pointer rounded-xl object-contain transition duration-300 hover:scale-[1.02] sm:h-[300px] lg:h-[340px]";

  return (
    <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <h3 className="text-2xl font-bold leading-tight text-purple-950 sm:text-3xl md:text-4xl">
            Learn AI. Build Skills. Protect Your Digital Future.
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            Explore our AI Book, 90 Days Job Plan, and CelebShield solutions in
            one simple learning journey.
          </p>
        </motion.div>

        {/* CARD 1 */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className={cardClass}
        >
          <div className={innerGridClass}>
            <motion.div
              variants={imageLeftAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex h-full items-center justify-center"
            >
              <img
                src={aiImage}
                alt="AI Book"
                onClick={openAmazon}
                className={imageClass}
              />
            </motion.div>

            <div className="flex h-full flex-col justify-center">
              <span className={badgeClass}>AI Book • 65 Chapters</span>

              <h2 className={titleClass}>Enter the AI & GEN AI Universe</h2>

              <p className={paraClass}>
                Enter the AI & GenAI Universe is a beginner-friendly yet
                powerful guide for anyone who wants to understand and use
                Artificial Intelligence in real life. With 65 practical,
                easy-to-follow chapters, the book simplifies AI, Generative AI,
                Prompt Engineering, Large Language Models (LLMs), how to build
                the future with agentic AI, and future AI careers.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openAmazon}
                  className={buttonClass}
                >
                  <FaAmazon size={18} />
                  Buy on Amazon
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className={cardClass}
        >
          <div className={innerGridClass}>
            <div className="order-2 flex h-full flex-col justify-center lg:order-1">
              <span className={badgeClass}>Job Plan • 90 Days</span>

              <h2 className={titleClass}>90 Days Job Plan</h2>

              <p className="mt-3 text-sm font-semibold text-gray-900 sm:text-base">
                One day. One use case. One step closer to your job.
              </p>

              <p className={paraClass}>
                The 90-Day Job Plan is a structured, discipline-driven job
                readiness program designed to transform learners into confident,
                job-ready professionals in just 90 days.
              </p>

              <p className={paraClass}>
                Unlike traditional courses that focus on theory or certificates,
                this program is built on daily execution, real-world use cases,
                and practical proof of skill.
              </p>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/ninetydayplan")}
                className={`${buttonClass} mt-5 w-fit`}
              >
                View More
                <ArrowRight size={17} />
              </motion.button>
            </div>

            <motion.div
              variants={imageRightAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-1 flex h-full items-center justify-center lg:order-2"
            >
              <img
                src={jobPlanImageUrl}
                alt="90 Days Job Plan"
                className={imageClass}
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className={`${cardClass} mb-0`}
        >
          <div className={innerGridClass}>
            <motion.div
              variants={imageLeftAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex h-full items-center justify-center"
            >
              <div className="aspect-video w-full max-w-[500px] overflow-hidden rounded-xl bg-black shadow-md">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/FR0y9kmy2eY"
                  title="CelebShield"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>

            <div className="flex h-full flex-col justify-center">
              <span className={badgeClass}>CelebShield</span>

              <h2 className={titleClass}>
                Protect Your Fame. Secure Your Identity.
              </h2>

              <p className={paraClass}>
                We file a Writ / Civil Suit seeking protection of Personality
                Rights.
              </p>

              <p className={paraClass}>
                AI-powered legal protection against deepfakes, voice cloning,
                false endorsements, impersonation, deceptive ads, GIF misuse,
                domain squatting, and unauthorized food branding. Backed by
                India's top advocates with 24/7 monitoring and High Court
                verification.
              </p>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/celebshield")}
                className={`${buttonClass} mt-5 w-fit`}
              >
                View More
                <ArrowRight size={17} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeAiBook;
