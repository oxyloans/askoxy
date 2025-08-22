import React,{useState, useEffect} from "react";
import { motion } from "framer-motion";
import aiImage from "../assets/img/book.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import {message} from "antd"
import axios from "axios"
const FreeAiBook: React.FC = () => {
    const navigate = useNavigate();
 const [isScrolled, setIsScrolled] = useState(false);
    const userId = localStorage.getItem("userId");
    const mobileNumber = localStorage.getItem("mobileNumber");
    const whatsappNumber = localStorage.getItem("whatsappNumber");
    const LOGIN_URL = "/whatsappregister";

    const participateInFreeAIBook = async () => {
      if (!userId) return;

      try {
       
        await axios.post(
          `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
          {
            askOxyOfers: "FREEAIBOOK",
            mobileNumber: mobileNumber || whatsappNumber,
            userId,
            projectType: "ASKOXY",
          }
        );

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

  

  return (
    <section className="flex flex-col items-center bg-purple-50 py-10 md:py-10 px-4 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 leading-tight">
          Free AI Book
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300"></div>
      </div>

      {/* Card */}
      <motion.div
        className="flex flex-col md:flex-row bg-white border border-gray-200 shadow-md overflow-hidden w-full max-w-7xl hover:shadow-lg transition-shadow duration-300"
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
            Step into the AI Universe: Discover, learn, and create with today’s
            most powerful AI tools. From your very first prompt to shaping
            global impact, explore how AI is transforming industries, generating
            text, images, music, and code, and powering innovations like ChatGPT
            and MidJourney.
          </p>
          <p className="text-gray-700 mb-5 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
            Our Mission: To empower one million learners with AI skills and
            unlock career opportunities of the future. Join the revolution,
            master AI, and be part of the next wave of technological innovation.
          </p>

          <motion.button
            onClick={handleSignIn}
            className="self-start px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition-transform duration-200"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            View More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FreeAiBook;
