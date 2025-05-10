import React, { useState, useEffect } from "react";
import { PlayCircle, X } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Loan Origination Process",
    description: "Streamline your loan application and approval workflow",
    thumbnail: "https://img.youtube.com/vi/Ja0xLoXB9wQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Ja0xLoXB9wQ",
  },
  {
    id: 2,
    title: "Risk Assessment Tools",
    description: "Advanced analytics for better decision making",
    thumbnail: "https://img.youtube.com/vi/razHRDyGvVs/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/razHRDyGvVs",
  },
  {
    id: 3,
    title: "Customer Management Features",
    description: "Build better relationships with borrowers",
    thumbnail: "https://img.youtube.com/vi/YcutEdAwZ5k/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/YcutEdAwZ5k",
  },
  {
    id: 4,
    title: "Reporting & Analytics",
    description: "Gain insights from comprehensive reporting tools",
    thumbnail: "https://img.youtube.com/vi/pB8Ny9Nlw3w/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/pB8Ny9Nlw3w",
  },
  {
    id: 5,
    title: "Integration Capabilities",
    description: "Seamlessly connect with your existing systems",
    thumbnail: "https://img.youtube.com/vi/V7bgksFxk10/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/V7bgksFxk10",
  },
  {
    id: 6,
    title: "Advanced Security Measures",
    description: "Ensure your data is protected at all times",
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
    <section className="py-10 md:py-16 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            See Our Platform in Action
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Watch these videos to learn how our Global Loan Management System
            can transform your business operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setModalVideo(video.embedUrl)}
              className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <PlayCircle className="text-white w-12 h-12" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!showAll && videos.length > 3 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              View All Videos
            </button>
          </div>
        )}

        {/* Video Modal */}
        {modalVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative bg-white rounded-xl max-w-4xl w-full shadow-xl overflow-hidden">
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-3 right-3 text-gray-700 hover:text-red-600 z-10"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-video w-full">
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
