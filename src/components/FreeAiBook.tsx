import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import aiImage from "../assets/img/gt.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { message } from "antd";
import axios from "axios";

const FreeAiBook: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const LOGIN_URL = "/whatsappregister";

  const jobPlanImageUrl = "https://i.ibb.co/twj7WCX3/90-dayl.png";

  // ✅ Campaign Id you want to open on "View More"
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

  // ✅ FIX: View More should open CampaignBlogPage route
  const handleSignIn = () => {
    setIsLoading(true);

    const redirectPath = `/campaign/${campaignId}`;
    const uid = localStorage.getItem("userId");

    if (uid) {
      navigate(redirectPath);
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("redirectPath", redirectPath);
    window.location.href = LOGIN_URL;
    // no setIsLoading(false) here because page redirects
  };

  const handleJobPlanViewMore = () => {
    navigate("/90dayjobplan");
  };

  return (
    <section className="flex flex-col items-center bg-purple-50 py-10 px-4 sm:px-6 md:px-12">
      {/* ===== Free AI Book Heading ===== */}
      <div className="text-center mb-6">
        <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
          AI Book
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
      </div>

      {/* ===== Free AI Book Card (Image LEFT) ===== */}
      <motion.div
        className="flex flex-col md:flex-row bg-white border shadow-md w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="md:w-1/2 p-6 flex justify-center">
          <img
            src={aiImage}
            alt="AI Book"
            className="object-contain shadow-lg"
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <p className="text-gray-700 mb-4 text-justify">
            Enter the AI & GenAI Universe is a beginner-friendly yet powerful
            guide for anyone who wants to understand and use Artificial
            Intelligence in real life. With 65 practical chapters, the book
            explains AI, Generative AI, Prompt Engineering, Large Language
            Models (LLMs), AI Agents, and future AI careers in a simple and
            easy-to-follow way.
          </p>

          <p className="text-gray-700 mb-6 text-justify">
            Our Mission is to empower one million learners with real-world AI
            skills and unlock career opportunities of the future. Join the AI
            revolution, master practical AI use cases, and be part of the next
            wave of technological innovation.
          </p>

          <motion.button
            onClick={handleSignIn}
            disabled={isLoading}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "View More"}
          </motion.button>
        </div>
      </motion.div>

      {/* ===== 90 Days Job Plan Heading ===== */}
      <div className="text-center mt-12 mb-6">
        <h3 className="text-3xl md:text-4xl font-extrabold text-purple-900">
          90 Days Job Plan
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300" />
      </div>

      {/* ===== 90 Days Job Plan Card (Image RIGHT on Desktop) ===== */}
      <motion.div
        className="flex flex-col md:flex-row-reverse bg-white border shadow-md w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Image RIGHT */}
        <div className="md:w-1/2 p-6 flex justify-center">
          <img
            src={jobPlanImageUrl}
            alt="90 Days Job Plan"
            className="object-contain shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Content LEFT */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <p className="text-gray-800 mb-3 text-lg font-semibold">
            Become job-ready in 90 days — one use case per day, one step at a
            time.
          </p>

          <p className="text-gray-700 mb-4 text-justify">
            The 90-Day Job Plan is a structured, discipline-driven job readiness
            program designed to transform learners into confident, job-ready
            professionals in just 90 days.
          </p>

          <p className="text-gray-700 mb-4 text-justify">
            Unlike traditional courses that focus on theory or certificates,
            this program is built on daily execution, real-world use cases, and
            practical proof of skill.
          </p>

          <motion.button
            onClick={handleJobPlanViewMore}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold"
          >
            View More
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default FreeAiBook;
