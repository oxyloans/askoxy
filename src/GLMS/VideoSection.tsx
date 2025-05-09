import React, { useState, useRef } from "react";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

function VideoSection() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

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

  const scroll = (direction:any) => {
    if (scrollContainerRef.current) {
      // Calculate different scroll amounts based on screen size
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle touch scroll for mobile devices
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e:any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e:any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scroll("right");
    }
    if (isRightSwipe) {
      scroll("left");
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            See Our Platform in Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Watch these videos to learn how our Global Loan Management System
            can transform your business operations.
          </p>
        </div>

        {activeVideoIndex !== null && (
          <div className="mb-6 md:mb-10">
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
              <iframe
                src={`${videos[activeVideoIndex].embedUrl}?autoplay=1`}
                title={videos[activeVideoIndex].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <div className="relative group">
          {/* Mobile scroll indicators */}
          <div className="flex justify-between mb-2 md:hidden">
            <button
              onClick={() => scroll("left")}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Desktop left scroll button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-200 hidden md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 gap-3 sm:gap-4 md:gap-6 scrollbar-hide scroll-smooth snap-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`flex-shrink-0 w-64 sm:w-72 md:w-80 bg-white rounded-xl shadow-md cursor-pointer snap-start border transition-all duration-300 hover:shadow-lg ${
                  activeVideoIndex === index
                    ? "border-blue-500 shadow-lg transform scale-[1.02]"
                    : "border-transparent"
                }`}
                onClick={() => setActiveVideoIndex(index)}
              >
                <div className="relative group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-blue-600 rounded-full p-2 sm:p-3 text-white">
                      <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 flex items-center justify-between">
                    <span className="line-clamp-1">{video.title}</span>
                    {activeVideoIndex === index && (
                      <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-1">
                        Now Playing
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop right scroll button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-200 hidden md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Video pagination dots */}
        <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveVideoIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                activeVideoIndex === index
                  ? "bg-blue-600 w-4 sm:w-5"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View video ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
