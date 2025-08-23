import React, { useState, useEffect } from "react";
import { BookOpen, ArrowRight, MapPinIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";
import aiImage from "../assets/img/book.png";
import { message } from "antd";
import { motion } from "framer-motion";

import Mission from "../assets/img/Mission Million.png"
import Billion from "../assets/img/AI Hub.png"
import Jobstreet from "../assets/img/ChatGPT Image Aug 23, 2025, 03_21_01 PM (3).png"
const FreeAIBookHome: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const LOGIN_URL = "/whatsappregister";

  // ✅ Call marketing API automatically if user is logged in
  useEffect(() => {
    const sendMarketingRequest = async () => {
      if (!userId) return; // do nothing if not logged in

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
        } else {
          message.warning("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error("API error:", error);
       
      } finally {
        setIsLoading(false);
      }
    };

    sendMarketingRequest();
  }, [userId, mobileNumber, whatsappNumber]);

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const redirectPath = "/freeaibook/view";
      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenoxy = () => {
    window.location.href = "/genoxy";
  };

  const handledGlms = () => {
    window.location.href= "/glms"
  }
  const handledJobStreet = () =>
  {
    window.location.href ="/jobstreet"
  }
const handledAiVideos = () =>
{
  window.location.href="/freeaivideos"
}
  return (
    <main className="flex flex-col pt-14 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Heading */}
        <h3
          id="main-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600"
        >
          ASKOXY.AI — India’s Specialist LLM Company
        </h3>

        {/* Subheading / Paragraph */}
        <p className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed text-gray-700">
          Powering the future of{" "}
          <span className="font-semibold text-indigo-700">Loans</span>,{" "}
          <span className="font-semibold text-purple-700">Jobs</span> &{" "}
          <span className="font-semibold text-pink-600">Entrepreneurs</span>.
          Based in Hyderabad,{" "}
          <span className="font-semibold text-gray-900">ASKOXY.AI</span> is a
          <span className="font-semibold text-gray-900">
            {" "}
            50-member AI-native company
          </span>{" "}
          pioneering India’s AI revolution with regulation-aligned Large
          Language Models.
        </p>
      </div>

      <section
        id="free-ai-book"
        className="flex flex-col items-center  px-4 sm:px-6 md:px-12"
      >
        {/* Card */}
        <motion.div
          className="flex flex-col md:flex-row bg-white border border-emerald-400 shadow-md overflow-hidden w-full max-w-7xl hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Image */}
          <motion.div
            className="md:w-1/2 w-full flex justify-center items-center p-4 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={aiImage}
              alt="AI Book"
              className="w-full h-full  shadow-lg transition-transform duration-300"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col justify-center p-4 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-700 mb-3 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-violet-600 font-semibold">
                Step into the AI Universe:
              </span>{" "}
              Discover, learn, and create with today’s most powerful AI tools.
              From your very first prompt to shaping global impact, explore how
              AI is transforming industries, generating text, images, music, and
              code, and powering innovations like ChatGPT and MidJourney.
            </p>
            <p className="text-gray-700 mb-5 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-indigo-600 font-semibold">
                Our Mission:
              </span>{" "}
              To empower one million learners with AI skills and unlock career
              opportunities of the future. Join the revolution, master AI, and
              be part of the next wave of technological innovation.
            </p>

            <div className="flex gap-4">
              {/* Free AI Book Button */}
              <motion.button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 
    text-white font-semibold shadow-lg hover:opacity-90 transition-transform duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-5 h-5" />
                Get Free AI Book
              </motion.button>

              {/* AI Videos Button */}
              <motion.button
                onClick={handledAiVideos}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-600 to-pink-500 
    text-white font-semibold shadow-lg hover:opacity-90 transition-transform duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5" />
                Get AI Videos
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>
      <section
        id="mission-million-ai-coders"
        className="flex flex-col items-center py-4 px-4 sm:px-6 md:px-12"
      >
        {/* Card */}
        <motion.div
          className="flex flex-col md:flex-row bg-white border border-pink-300 shadow-md overflow-hidden w-full max-w-7xl hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Content (Text now on left) */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col justify-center p-4 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-700 mb-3 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-violet-600 font-semibold">
                Mission Million AI Coders –{" "}
              </span>
              Skilling India at Scale A movement to train 1 million Indians in
              AI, Blockchain, and Cloud—from students to working professionals.
              With real-world projects, community-led learning, and AI-ready job
              frameworks, this initiative builds confidence, competence, and
              careers
            </p>
            <p className="text-gray-700 mb-5 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-indigo-600 font-semibold">
                Our Mission:
              </span>{" "}
              Build a global digital economy with AI, Blockchain, and Cloud —
              funding entrepreneurs, empowering professionals, solving real
              problems, and training millions, supported by BFSI and LLMs books.
            </p>

            <motion.button
              onClick={handleGenoxy}
              className="flex items-center gap-2 self-start px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold shadow-lg hover:opacity-90 transition-transform duration-200"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              Visit GENOXY
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Image (Image now on right) */}
          <motion.div
            className="md:w-1/2 w-full flex justify-center items-center p-4 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={Mission}
              alt="AI Book"
              className="w-full h-full  shadow-lg transition-transform duration-300"
            />
          </motion.div>
        </motion.div>
      </section>
      <section
        id="billionaire-hub"
        className="flex flex-col items-center  px-4 sm:px-6 md:px-12"
      >
        {/* Card */}
        <motion.div
          className="flex flex-col md:flex-row bg-white border border-purple-400 shadow-md overflow-hidden w-full max-w-7xl hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Image */}
          <motion.div
            className="md:w-1/2 w-full flex justify-center items-center p-4 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={Billion}
              alt="AI Book"
              className="w-full h-full  shadow-lg transition-transform duration-300"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col justify-center p-4 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-700 mb-3 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-violet-600 font-semibold">
                BillionAIre Hub –
              </span>{" "}
              India’s first AI Studio-as-a-Service at Miyapur Metro, Hyderabad.
              A free platform for learning, building, and testing AI.
              Entrepreneurs, students, and professionals explore GPT workflows,
              with contributions rewarded through BMVCOIN, an Ethereum-based
              future-ready token.
            </p>

            <p className="text-gray-700 mb-5 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-indigo-600 font-semibold">
                Our Mission:
              </span>{" "}
              Build a global digital economy with AI, Blockchain, and Cloud —
              funding entrepreneurs, empowering professionals, solving real
              problems, and training millions, supported by BFSI and LLMs books.
            </p>

            <motion.a
              href="https://www.google.com/maps/place/Metro+Station+Miyapur,+Nadigada+Tanda,+Miyapur,+Hyderabad,+Telangana+500049"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 self-start px-6 py-3 rounded-xl 
             bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
             text-white font-semibold shadow-lg hover:opacity-90 
             transition-transform duration-200"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <MapPinIcon className="w-5 h-5" />
              <span>View Location</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <section
        id="glms"
        className="flex flex-col items-center py-4 px-4 sm:px-6 md:px-12"
      >
        {/* Card */}
        <motion.div
          className="flex flex-col md:flex-row bg-white border border-emerald-300 shadow-md overflow-hidden w-full max-w-7xl hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Content (Text now on left) */}
          <motion.div
            className="md:w-1/2 w-full flex flex-col justify-center p-4 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-700 mb-3 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-violet-600 font-semibold">
                Global Lending Management System –{" "}
              </span>
              A powerful, AI-enabled platform tailored for the BFSI sector.
              Features over 60+ industry use cases, 50+ expert roles, and
              inspired by Temenos, Finastra, FinOne, and TCS BaNCS, ensuring a
              secure, scalable, and future-ready solution.
            </p>

            <p className="text-gray-700 mb-5 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <span className="text-indigo-600 font-semibold">
                Our Mission:{" "}
              </span>
              Empower organizations to accelerate digital transformation and
              prepare 1M+ professionals for BFSI jobs with a global, inclusive,
              impactful, future-ready, and sustainable approach.
            </p>

            <div className="flex gap-4">
              {/* GLMS Button */}
              <motion.button
                onClick={handledGlms}
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
               bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500
               text-white font-semibold shadow-lg hover:opacity-90 
               transition-transform duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                GLMS
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Job Street Button */}
              <motion.button
                onClick={handledJobStreet}
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
               bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
               text-white font-semibold shadow-lg hover:opacity-90 
               transition-transform duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                Job Street
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image (Image now on right) */}
          <motion.div
            className="md:w-1/2 w-full flex justify-center items-center p-4 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={Jobstreet}
              alt="AI Book"
              className="w-full h-full  shadow-lg transition-transform duration-300"
            />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
};

export default FreeAIBookHome;
