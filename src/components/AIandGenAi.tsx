import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Video {
  id: string;
  lang: string;
  url: string;
  title: string;
}

interface VideoSeriesItem {
  id: number;
  title: string;
  telugudescription?: string;
  engdescription?: string;
  videos: Video[];
}

const VideoIframe: React.FC<{ video: Video }> = ({ video }) => {
  const [hasError, setHasError] = useState(false);

  return hasError ? (
    <div className="text-center text-red-500 p-6">
      Video unavailable: {video.title}
    </div>
  ) : (
    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={video.url}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onError={() => setHasError(true)}
        aria-label={`Video: ${video.title} in ${video.lang}`}
      />
    </div>
  );
};

const VideoGallery: React.FC = () => {
  const [currentSeries, setCurrentSeries] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setIsLoading(false);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const videoSeries: VideoSeriesItem[] = [
    // Series 1
    {
      id: 1,
      title: "AI & GEN AI - Part 1",
      telugudescription:
        "25 ఏళ్ల బ్యాంకింగ్ సాఫ్ట్‌వేర్ అనుభవంతో AI & GenAI, Verification & Validationపై వీడియో సిరీస్.\n" +
        "✓ 52 బ్యాంకింగ్ ఉపయోగ సందర్భాలు\n" +
        "✓ ప్రతి వీడియో: 3 నిమిషాలు\n" +
        "✓ మొత్తం: 60 వీడియోలు (180 నిమిషాలు)\n" +
        "✓ ఫోకస్: ప్రాంప్ట్ ఇంజనీరింగ్, AI బ్యాంకింగ్, V&V టెక్నిక్స్\n" +
        "✓ ఎవరికి? AI, బ్యాంకింగ్, సాఫ్ట్‌వేర్ ఔత్సాహికులు\n" +
        "✓ ఉచితం – కెరీర్ గ్రోత్ కోసం\n" +
        "✓ లక్ష్యం: ఉద్యోగ అవకాశాలు",
      engdescription:
        "A video series based on 25 years of banking software experience, covering AI & GenAI vs Verification & Validation.\n" +
        "✓ 52 banking use cases\n" +
        "✓ Each video: 3 minutes\n" +
        "✓ Total: 60 videos (180 minutes)\n" +
        "✓ Focus: Prompt engineering, AI banking, V&V techniques\n" +
        "✓ For: AI, banking, and software enthusiasts\n" +
        "✓ Free – For career growth\n" +
        "✓ Goal: Job opportunities",
      videos: [
        {
          id: "tel-1",
          lang: "తెలుగు",
          url: "https://www.youtube.com/embed/pB8Ny9Nlw3w",
          title: "AI & GEN AI - Part 1",
        },
        {
          id: "eng-1",
          lang: "English",
          url: "https://www.youtube.com/embed/Ja0xLoXB9wQ",
          title: "AI & GEN AI - Part 1",
        },
      ],
    },
    // Series 2
    {
      id: 2,
      title: "AI & GEN AI - Part 2",
      telugudescription:
        "బ్యాంకింగ్ ఉపయోగ సందర్భం లోతైన విశ్లేషణ.\n" +
        "✓ యూజర్ చర్యలు & సిస్టమ్ ప్రతిస్పందనలు\n" +
        "✓ కార్యాచరణ చార్ట్ (Activity Diagram)\n" +
        "✓ ప్రీ & పోస్ట్ కండీషన్లు\n" +
        "✓ పాజిటివ్, నెగటివ్, ఎక్సెప్షనల్ ఫ్లోస్\n" +
        "✓ AI ప్రాంప్ట్ డిజైన్ ప్రదర్శన",
      engdescription:
        "In-depth analysis of a banking use case.\n" +
        "✓ User actions & system responses\n" +
        "✓ Activity Diagram\n" +
        "✓ Pre & post conditions\n" +
        "✓ Positive, negative, exceptional flows\n" +
        "✓ Demo of effective AI prompt design",
      videos: [
        {
          id: "tel-2",
          lang: "తెలుగు",
          url: "https://www.youtube.com/embed/V7bgksFxk10",
          title: "AI & GEN AI - Part 2",
        },
        {
          id: "eng-2",
          lang: "English",
          url: "https://www.youtube.com/embed/razHRDyGvVs",
          title: "AI & GEN AI - Part 2",
        },
      ],
    },
    // Series 3 (Fixed title)
    {
      id: 3,
      title: "AI & GEN AI - Part 3",
      telugudescription:
        "1,00,000+ బ్యాంకులు & NBFCs లోన్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్‌పై ఆధారపడతాయి.\n" +
        "✓ బ్యాంకింగ్ ITకి ప్రాంప్ట్ ఇంజనీర్స్ & కోడర్లు అవసరం\n" +
        "✓ ఎవరికి? బ్యాంకర్లు, IT ప్రొఫెషనల్స్, జాబ్ సీకర్స్\n" +
        "✓ నైపుణ్యాలు: బ్యాంకింగ్ డొమైన్, లోన్ సాఫ్ట్‌వేర్, కోడింగ్\n" +
        "✓ లక్ష్యం: హై-పేయింగ్ ఉద్యోగాలు",
      engdescription:
        "1,00,000+ banks & NBFCs rely on Loan Management Software.\n" +
        "✓ High demand for Prompt Engineers & Coders in banking IT\n" +
        "✓ For: Bankers, IT pros, job seekers\n" +
        "✓ Skills: Banking domain, loan software, coding\n" +
        "✓ Goal: High-paying jobs",
      videos: [
        {
          id: "tel-3",
          lang: "తెలుగు",
          url: "https://www.youtube.com/embed/Am2yg9Ala7w",
          title: "AI & GEN AI - Part 3",
        },
        {
          id: "eng-3",
          lang: "English",
          url: "https://www.youtube.com/embed/YcutEdAwZ5k",
          title: "AI & GEN AI - Part 3",
        },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
            AI & GEN AI vs Verification & Validation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our video series on AI, banking, and software development.
          </p>
        </motion.header>

        {/* Series Navigation */}
        <motion.div
          className="mb-12 bg-white rounded-2xl shadow-lg p-6  top-4 z-50"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Select a Video Series
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {videoSeries.map((series) => (
              <button
                key={series.id}
                onClick={() => setCurrentSeries(series.id)}
                className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                  currentSeries === series.id
                    ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
                aria-label={`View Video Series ${series.id}: ${series.title}`}
              >
                Video {series.id}
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
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
                  {series.title}
                </span>
                <div className="h-1 w-32 bg-gradient-to-r from-teal-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
              </h3>

              {/* Videos Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {series.videos.map((video) => (
                  <motion.section
                    key={video.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-gradient-to-r from-teal-500 to-indigo-500 p-4">
                      <h3 className="text-xl font-semibold text-white text-center">
                        {video.lang}
                      </h3>
                    </div>
                    <div className="p-6">
                      <VideoIframe video={video} />
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Description Section */}
              {(series.telugudescription || series.engdescription) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8">
                  {series.telugudescription && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-2xl font-semibold mb-4 text-teal-600">
                        తెలుగు
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                        {series.telugudescription}
                      </p>
                    </div>
                  )}
                  {series.engdescription && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-2xl font-semibold mb-4 text-indigo-600">
                        English
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                        {series.engdescription}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default VideoGallery;
