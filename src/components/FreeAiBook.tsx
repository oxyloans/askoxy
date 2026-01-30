import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import aiImage from "../assets/img/gt.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { message } from "antd";
import axios from "axios";
import { BookOpen, Clock, Trophy, Zap, Users, Target } from "lucide-react";

const FreeAiBook: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const LOGIN_URL = "/whatsappregister";

  const jobPlanImageUrl = "https://i.ibb.co/twj7WCX3/90-dayl.png";
  const campaignId = "6972eb83-3bc4-4fa9-91a2-e1872b7c04bc";

  useEffect(() => {
    const sendMarketingRequest = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
          {
            askOxyOfers: "FREEAIBOOK",
            mobileNumber: mobileNumber || whatsappNumber,
            userId,
            projectType: "ASKOXY",
          }
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
    const redirectPath = `/campaign/${slicedCampaignId}`; // ✅ SHORT ONLY

    // ✅ store mapping for CampaignBlogPage fetch
    sessionStorage.setItem(`campaignFull:${slicedCampaignId}`, campaignId);

    // ✅ always store redirectPath (don’t depend on old values)
    sessionStorage.setItem("redirectPath", redirectPath);

    const uid = localStorage.getItem("userId");
    if (uid) {
      navigate(redirectPath);
      setIsLoading(false);
      return;
    }

    window.location.href = "/whatsappregister";
  };

  const handleJobPlanViewMore = () => {
    navigate("/90dayjobplan");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-purple-50 py-12 px-4 sm:px-6 md:px-12">
      {/* ✅ background space blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* ===== Heading ===== */}
        <div className="text-center mb-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
            Bid The Book
          </h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Learn AI simply. Win exciting rewards. Build your future.
          </p>
          <div className="w-28 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
        </div>

        {/* ===== Card 1 ===== */}
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(17,24,39,0.10)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* subtle inner gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/30 to-indigo-50/80" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-6 sm:p-8 md:p-10">
            {/* Image */}
            <div className="flex items-center justify-center">
              <div className="w-full flex justify-center">
                <img
                  src={aiImage}
                  alt="AI Book"
                  className="w-full max-w-xl md:max-w-2xl h-auto object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-800">
                AI Book • First Copy Winner Benefit
              </div>

              <p className="mt-4 text-gray-700 text-justify leading-relaxed">
                Enter the AI & GenAI Universe is a beginner-friendly yet
                powerful guide for anyone who wants to understand and use
                Artificial Intelligence in real life. With 65 practical,
                easy-to-follow chapters, the book simplifies AI, Generative AI,
                Prompt Engineering, Large Language Models (LLMs), how to build
                the future with agentic AI, and future AI careers.
              </p>

              <div className="mt-4 rounded-2xl border bg-white p-4 sm:p-5">
                <p className="text-gray-800 font-semibold">
                  Special First Copy Winner Benefit
                </p>
                <p className="text-gray-700 mt-1 leading-relaxed">
                  Permanent training until placement • Direct
                  interaction with Team & CEO • Daily interview & project
                  guidance • Continuous support until you get the job
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Bid Now"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Heading 2 ===== */}
        <div className="text-center mt-14 mb-8">
          <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
            90 Days Job Plan
          </h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            One day. One use case. One step closer to your job.
          </p>
          <div className="w-28 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
        </div>

        {/* ===== Card 2 ===== */}
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(17,24,39,0.10)]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-white/30 to-purple-50/70" />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-6 sm:p-8 md:p-10">
            {/* Content */}
            <div className="flex flex-col justify-center order-2 md:order-1">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-800">
                Job Plan • 90 Days
              </div>

              <p className="mt-4 text-gray-900 text-lg font-semibold">
                Become job-ready in 90 days — one use case per day, one step at
                a time.
              </p>

              <p className="mt-3 text-gray-700 text-justify leading-relaxed">
                The 90-Day Job Plan is a structured, discipline-driven job
                readiness program designed to transform learners into confident,
                job-ready professionals in just 90 days.
              </p>

              <p className="mt-3 text-gray-700 text-justify leading-relaxed">
                Unlike traditional courses that focus on theory or certificates,
                this program is built on daily execution, real-world use cases,
                and practical proof of skill.
              </p>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleJobPlanViewMore}
                className="mt-6 self-start px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg"
              >
                View More
              </motion.button>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center order-1 md:order-2">
              <div className="w-full flex justify-center">
                <img
                  src={jobPlanImageUrl}
                  alt="90 Days Job Plan"
                  className="w-full max-w-xl md:max-w-2xl h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* bottom spacing */}
        <div className="h-6" />
      </div>
    </section>
  );
};

export default FreeAiBook;
