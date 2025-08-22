import React, { useState, useEffect } from "react";
import {
  BookOpen,
  
  ArrowRight,
  MapPinIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";
import aiImage from "../assets/img/book.png";
import { message } from "antd";
import { motion } from "framer-motion";

import Mission from "../assets/img/Mission Million.png"
import Billion from "../assets/img/AI Hub.png"
const FreeAIBookHome: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const LOGIN_URL = "/whatsappregister";

  const participateInFreeAIBook = async () => {
    if (!userId) return;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/marketing-service/campgin/allOfferesDetailsForAUser`,
        { userId }
      );

      const alreadyParticipated = data?.some(
        (offer: any) => offer.askOxyOfers === "FREEAIBOOK"
      );

      if (alreadyParticipated) {
        // message.info("You have already participated ✅");
        navigate("/FreeAIBook/view");
        return;
      }

      await axios.post(`${BASE_URL}/marketing-service/campgin/askOxyOfferes`, {
        askOxyOfers: "FREEAIBOOK",
        mobileNumber: mobileNumber || whatsappNumber,
        userId,
        projectType: "ASKOXY",
      });

      message.success("🎉 Welcome to Free AI Book!");
      navigate("/FreeAIBook/view");
    } catch (error) {
      console.error("Participation error:", error);
      // message.error("Something went wrong, please try again!");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Auto participate if user is logged in
    if (userId) {
      participateInFreeAIBook();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId, navigate]);

  // const cardBaseClasses =
  //   "bg-white rounded-3xl shadow-xl p-5 text-center border-t-4 transform transition-transform";

  const handleSignIn = async () => {
    if (!userId) {
      sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
      window.location.href = LOGIN_URL;
    }
  };

  const handleGenoxy = () => {
    window.location.href="/genoxy"
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
              className="w-full h-full object-contain shadow-lg transition-transform duration-300"
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

            <motion.button
              onClick={handleSignIn}
              className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-white font-semibold shadow-lg hover:opacity-90 transition-transform duration-200"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-5 h-5" />
              Get Free AI Book
            </motion.button>
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
              className="w-full h-full object-contain shadow-lg transition-transform duration-300"
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
              className="w-full h-full object-contain shadow-lg transition-transform duration-300"
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
    </main>
  );
};

export default FreeAIBookHome;
