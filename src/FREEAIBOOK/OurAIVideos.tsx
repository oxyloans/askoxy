import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import aiImage from "../assets/img/book.png";

const videoLinks = [
  "https://www.youtube.com/embed/L4FEg97j0y4?si=v5TmIOZyRxi94Sxf",
  "https://www.youtube.com/embed/6KbsbrJWagk?si=om0aDXaIXBKdaidV",
  "https://www.youtube.com/embed/j5i8vdr0vUI?si=hU5nUVzVxj_9-eqE",
  "https://www.youtube.com/embed/VSkwxCaS0uw?si=LOXVeJBtWEhRK1Qk",
  "https://www.youtube.com/embed/F_s-apltHsA?si=g_ztL-EAAStB9JAV",
  "https://www.youtube.com/embed/YpvvhhZzsfg?si=mVcdBSK19rwooTN1",
  "https://www.youtube.com/embed/YTxKHsTLpwM?si=Et061ijeFnIx89OW",
  "https://www.youtube.com/embed/x9IP_p6Mpd4?si=t-7oG768yU1JT99K",
  "https://www.youtube.com/embed/4qmIPsy1jHs?si=k6hekTA6JQ6zf0SZ",
  "https://www.youtube.com/embed/csv-rCOTlMY?si=I_j0QlaHgO3MliJm",
  "https://www.youtube.com/embed/GW5CZgZwNyc?si=vUudVd8jf96SA16h",
  "https://www.youtube.com/embed/BcvaxM0cfF0?si=ZV3q3wzvs8EXSc11",
  "https://www.youtube.com/embed/KfZAAG0fsFE?si=3Jh1Q969MedYmfIp",
  "https://www.youtube.com/embed/mwXB3YjyNBA?si=hWfn9ygTf7HSsc2d",
  "https://www.youtube.com/embed/43WiDqpD0qw?si=SF-wfqfhaCNUj9Id",
  "https://www.youtube.com/embed/D9B1YBhPh_k?si=S94Pdyq2_XPNHf_S",
  "https://www.youtube.com/embed/7MZGyEQ_PcE?si=efUXwBmMHZAhVPUT",
  "https://www.youtube.com/embed/Cg3yTHimojo?si=jRsv6H96EFJ6r6rp",
  "https://www.youtube.com/embed/KfaUURipNoo?si=WO0-vQ1yuAjCaEUD",
  "https://www.youtube.com/embed/h4Gy5zyHwRM?si=JE4cM8G3MCIP05U0",
  "https://www.youtube.com/embed/SG8zP3xtG1Q?si=GpxU1PwP3MDmmAsY",
  "https://www.youtube.com/embed/2RURIZBUXt8?si=HEWHwLhIExCjDWoK",
  "https://www.youtube.com/embed/4mcec9IfTw4?si=aIiOeaN0NboX-HNQ",
  "https://www.youtube.com/embed/ogrmL91njEU?si=7XsrwmFcSXP2L06G",
  "https://www.youtube.com/embed/bw4FTsxMa_E?si=jzPtXEkqv8DDd7Km",
  "https://www.youtube.com/embed/Ym0ZYTpcPTg?si=uGkkRL1WlI5ekoWT",
  "https://www.youtube.com/embed/yebcT_p_5H8?si=_Utt9YGkJlC0hXgS",
  "https://www.youtube.com/embed/LP_IicZEHYs?si=cnwCoPk3lZxoOEyF",
  "https://www.youtube.com/embed/iZqil5BK1Wo?si=0iLUlhf9U9Lyu8s0",
  "https://www.youtube.com/embed/hhTOxiKF1KY?si=MGL15PTuMsTWgysJ",
  "https://www.youtube.com/embed/MYPZWzu2DJM?si=ZzbYPOWneYnOhj6s",
  "https://www.youtube.com/embed/bnYzu5j7ohs?si=8F9L_LzxllbMvJvl",
  "https://www.youtube.com/embed/1Bs5YeezU_Y?si=BI9AYGIky32nmlHH",
  "https://www.youtube.com/embed/wJT9P-3lTOM?si=VzkbTT44ue7vO9cB",
  "https://www.youtube.com/embed/ZnERBfMN8Vc?si=yLOS1C8Zb26Aev2x",
  "https://www.youtube.com/embed/eVti8ARpO98?si=eI3IZXGktr8Ur39B",
  "https://www.youtube.com/embed/BNa1FDaERc4?si=gYQRhxLPwa0hr2hS",
  "https://www.youtube.com/embed/3AaF0VepqT8?si=mLyXC2cTc03TpN9K",
  "https://www.youtube.com/embed/8KG3eJWGauA?si=gBj7FULbBxMti1f7",
  "https://www.youtube.com/embed/6VqxOOk2IkE?si=GyOqVA6vZA-lyJyR",
  "https://www.youtube.com/embed/vzMwzErB3i0?si=JMlgtmWjvNIUB5gF",
  "https://www.youtube.com/embed/fJpyURIUXs0?si=-lSlNEIOXzQMuUAq",
];

export default function OurAIVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Hide controls after inactivity
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handlePrev = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? videoLinks.length - 1 : prev - 1));
    setShowControls(true);
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === videoLinks.length - 1 ? 0 : prev + 1));
    setShowControls(true);
  };

  return (
    <section className="flex flex-col items-center max-w-8xl bg-purple-50 py-10 md:py-12 px-4 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-6 max-w-3xl">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 leading-tight">
          Our AI Videos
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300"></div>
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
          Discover how Artificial Intelligence is shaping the future through our
          curated collection of videos. From cutting-edge innovations to
          real-world applications, these videos provide valuable insights into
          the power of AI and how it is transforming industries worldwide.
        </p>
      </div>

      {/* Card */}
      <motion.div
        className="flex flex-col md:flex-row bg-white border border-gray-200 shadow-md overflow-hidden w-full max-w-5xl hover:shadow-xl transition-shadow duration-300 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Image */}
        <motion.div
          className="md:w-1/2 w-full flex justify-center items-center p-0 aspect-video"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={aiImage}
            alt="AI Book"
            className="w-full h-full object-cover rounded-none md:rounded-l-lg"
          />
        </motion.div>

        {/* Right Video */}
        <div
          className="relative md:w-1/2 w-full aspect-video flex items-center justify-center bg-black"
          onMouseMove={() => setShowControls(true)} // show on hover (desktop)
          onTouchStart={() => setShowControls(true)} // show on touch (mobile)
        >
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          <motion.iframe
            key={currentIndex}
            src={videoLinks[currentIndex]}
            title="AI Video"
            frameBorder="0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-none md:rounded-r-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            onLoad={() => setLoading(false)}
          ></motion.iframe>

          {/* Prev Button */}
          {showControls && (
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 p-2 bg-white/90 rounded-full shadow hover:bg-gray-100 transition active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
          )}

          {/* Next Button */}
          {showControls && (
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 p-2 bg-white/90 rounded-full shadow hover:bg-gray-100 transition active:scale-95"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}