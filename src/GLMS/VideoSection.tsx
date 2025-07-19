import React, { useState, useEffect, useCallback } from "react";
import { PlayCircle, X } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "AI x Banking: 52 Real Use Cases in 60 Bite-Sized Videos",
    description:
      "A free video series built on 25 years of banking software experience, exploring the intersection of AI, GenAI, and banking through 52 real-world use cases",
    thumbnail: "https://img.youtube.com/vi/Ja0xLoXB9wQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Ja0xLoXB9wQ",
  },
  {
    id: 2,
    title: "Banking Use Cases with AI Prompt Design",
    description:
      "Explore real banking scenarios with user actions, system responses, activity diagrams, edge cases, and AI prompt design for automation.",
    thumbnail: "https://img.youtube.com/vi/razHRDyGvVs/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/razHRDyGvVs",
  },
  {
    id: 3,
    title: "Unlock Career Opportunities in Loan Management Software",
    description:
      "100,000+ banks rely on loan management software. Learn skills in coding, banking domain, and prompt engineering for high-paying IT jobs.",
    thumbnail: "https://img.youtube.com/vi/YcutEdAwZ5k/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/YcutEdAwZ5k",
  },
  {
    id: 4,
    title: "AI x Banking: 52 Real Use Cases in 60 Bite-Sized Videos",
    description:
      "A free video series built on 25 years of banking software experience, exploring the intersection of AI, GenAI, and banking through 52 real-world use cases",
    thumbnail: "https://img.youtube.com/vi/pB8Ny9Nlw3w/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/pB8Ny9Nlw3w",
  },
  {
    id: 5,
    title: "Banking Use Cases with AI Prompt Design",
    description:
      "Explore real banking scenarios with user actions, system responses, activity diagrams, edge cases, and AI prompt design for automation.",
    thumbnail: "https://img.youtube.com/vi/V7bgksFxk10/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/V7bgksFxk10",
  },
  {
    id: 6,
    title: "Unlock Career Opportunities in Loan Management Software",
    description:
      "100,000+ banks rely on loan management software. Learn skills in coding, banking domain, and prompt engineering for high-paying IT jobs.",
    thumbnail: "https://img.youtube.com/vi/Am2yg9Ala7w/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Am2yg9Ala7w",
  },
];

const VideoSection = () => {
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleCloseModal = useCallback(() => setModalVideo(null), []);
  const displayedVideos = showAll ? videos : videos.slice(0, 3);

  useEffect(() => {
    document.body.style.overflow = modalVideo ? "hidden" : "auto";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [modalVideo, handleCloseModal]);

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            See Our Platform in Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Watch how GenOxy’s Global Loan Management System transforms banking
            operations with real AI-powered use cases.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setModalVideo(video.embedUrl)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {!showAll && videos.length > 3 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              View All Videos
            </button>
          </div>
        )}

        {/* Video Modal */}
        {modalVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
                aria-label="Close Video"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-full aspect-video">
                <iframe
                  src={`${modalVideo}?autoplay=1`}
                  title="Video Player"
                  className="w-full h-full rounded-b-xl"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
