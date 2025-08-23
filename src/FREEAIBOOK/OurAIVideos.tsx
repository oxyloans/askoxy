import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import aiImage from "../assets/img/book.png";

const videoLinks = [
  "https://www.youtube.com/embed/3AaF0VepqT8?si=mLyXC2cTc03TpN9K",
  "https://www.youtube.com/embed/8KG3eJWGauA?si=gBj7FULbBxMti1f7",
  "https://www.youtube.com/embed/6VqxOOk2IkE?si=GyOqVA6vZA-lyJyR",
  "https://www.youtube.com/embed/vzMwzErB3i0?si=JMlgtmWjvNIUB5gF",
  "https://www.youtube.com/embed/fJpyURIUXs0?si=-lSlNEIOXzQMuUAq",
];

export default function OurAIVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePrev = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? videoLinks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev === videoLinks.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="flex flex-col items-center max-w-8xl bg-purple-50 py-10 md:py-12 px-4 sm:px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-6 max-w-3xl">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 leading-tight">
          Our AI Videos
        </h3>
        <div className="w-24 h-1.5 mt-4 mx-auto rounded-full bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300"></div>

        {/* Paragraph Description */}
        <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
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
        <div className="relative md:w-1/2 w-full aspect-video flex items-center justify-center bg-black">
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          <motion.iframe
            key={currentIndex} // ensures re-render when index changes
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
            onLoad={() => setLoading(false)} // remove spinner once loaded
          ></motion.iframe>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-6 h-6 text-purple-600" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
