import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const VideoGallery = () => {
  // State for current series
  const [currentSeries, setCurrentSeries] = useState(1);
  // State for screen size to enhance responsive behavior
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Video data organized by series
  const videoSeries = [
    // Series 1
    {
      id: 1,
      title: "AI & GEN AI - పార్ట్ 1",
      videos: [
        {
          id: "tel-1",
          lang: "తెలుగు",
          url: "https://www.youtube.com/embed/pB8Ny9Nlw3w",
          title: "AI & GEN AI తెలుగు - పార్ట్ 1",
        },
        {
          id: "eng-1",
          lang: "English",
          url: "https://www.youtube.com/embed/Ja0xLoXB9wQ",
          title: "AI & GEN AI English - Part 1",
        },
      ],
    },
    // Series 2
    {
      id: 2,
      title: "AI & GEN AI - పార్ట్ 2",
      videos: [
        {
          id: "tel-2",
          lang: "తెలుగు",
          url: "https://www.youtube.com/embed/V7bgksFxk10",
          title: "AI & GEN AI తెలుగు - పార్ట్ 2",
        },
        {
          id: "eng-2",
          lang: "English",
          url: "https://www.youtube.com/embed/razHRDyGvVs",
          title: "AI & GEN AI English - Part 2",
        },
      ],
    },
    
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-500">
            AI & GEN AI vs VERFICATION & VALIDATION
          </h1>
          {/* <p className="text-xl text-gray-600">
            రాధ నుండి శుభాకాంక్షలు | Greetings from Radha
          </p> */}
        </motion.header>

        {/* Series Navigation */}
        <motion.div
          className="mb-10 bg-white rounded-xl shadow-md p-6"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            వీడియో సిరీస్
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {videoSeries.map((series) => (
              <button
                key={series.id}
                onClick={() => setCurrentSeries(series.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  currentSeries === series.id
                    ? "bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg transform scale-105"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow"
                }`}
              >
                పార్ట్ {series.id}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current Series Videos */}
        {videoSeries
          .filter((series) => series.id === currentSeries)
          .map((series) => (
            <motion.div
              key={series.id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  {series.title}
                </span>
                <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-3 rounded-full"></div>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {series.videos.map((video) => (
                  <motion.section
                    key={video.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    variants={itemVariants}
                  >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3">
                      <h3 className="text-xl font-bold text-white text-center">
                        {video.lang}
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="w-full h-0 pb-[56.25%] relative rounded-lg overflow-hidden">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={video.url}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          ))}

        {/* About Section */}
        <motion.section
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              AI & GEN AI vs VERFICATION & VALIDATION
            </span>
            <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-3 rounded-full"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                తెలుగు
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                నేను గత 25 సంవత్సరాల బ్యాంకింగ్ సాఫ్ట్‌వేర్ అనుభవాన్ని AI &
                GenAI vs Verification & Validation పై కొత్త వీడియో సిరీస్ ద్వారా
                పంచుకుంటున్నాను. 52 బ్యాంకింగ్ Use cases సందర్భాలను ఇందులో కవర్
                చేస్తున్నాను.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    సరళంగా & స్పష్టంగా: ప్రతి వీడియో కేవలం 3 నిమిషాలు మాత్రమే.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    మొత్తం సిరీస్: 60 వీడియోలు, 180 నిమిషాల ఫుల్ లెర్నింగ్.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    ఫోకస్: ప్రాంప్ట్ ఇంజనీరింగ్, AI బ్యాంకింగ్ అప్లికేషన్లు,
                    వెరిఫికేషన్ & వాలిడేషన్ టెక్నిక్స్.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>భాషలు: తెలుగు & ఇంగ్లీష్ లో అందుబాటులో ఉంది.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    ✓ ఎవరికి?: AI, బ్యాంకింగ్, మరియు సాఫ్ట్‌వేర్ డెవలప్‌మెంట్‌లో
                    విజయాన్ని సాధించాలని ఆశించే వారికి.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    ఎందుకు? ఇది నా హాబీ! ఇది ఉచితం మాత్రమే కాదు, ఇది కెరీర్
                    గ్రోత్ కోసం.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    లక్ష్యం: AI & బ్యాంకింగ్ రంగంలో మరింత మంది ఉద్యోగ అవకాశాలు
                    పొందడం.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                English
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                I'm sharing my 25 years of banking software experience through
                this new video series on AI & GenAI vs Verification &
                Validation. I'm covering 52 banking use cases.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Simple & Clear: Each video is only 3 minutes.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>
                    Complete Series: 60 videos, 180 minutes of full learning.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>
                    Focus: Prompt engineering, AI banking applications,
                    verification & validation techniques.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Languages: Available in Telugu & English</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>
                    Why? It’s my hobby to share knowledge—this is about learning
                    & career growth, not just free content.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>
                    For whom? Those who want to grow in AI, banking, software
                    development
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>
                    Goal: More people getting job opportunities in AI & banking
                    sector.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default VideoGallery;
