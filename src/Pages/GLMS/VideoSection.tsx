import React, { useState, useEffect } from "react";
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
  const displayedVideos = showAll ? videos : videos.slice(0, 3);

  useEffect(() => {
    document.body.style.overflow = modalVideo ? "hidden" : "auto";
  }, [modalVideo]);

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            See Our Platform in Action
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Watch these videos to learn how our Global Loan Management System can transform your business operations.
          </p>
        </div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setModalVideo(video.embedUrl)}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer group overflow-hidden"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && videos.length > 3 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium text-sm sm:text-base"
            >
              View All Videos
            </button>
          </div>
        )}

        {/* Video Modal */}
        {modalVideo && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl rounded-lg overflow-hidden bg-white shadow-xl animate-fadeIn">
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 text-gray-700 hover:text-red-600 z-10"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-full aspect-video">
                <iframe
                  src={`${modalVideo}?autoplay=1`}
                  title="Video Player"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
