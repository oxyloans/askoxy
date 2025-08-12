import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  X,
} from "lucide-react";

const AwardPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const socialLinks: Record<string, string> = {
    facebook: "https://www.facebook.com/share/v/1C82pmULn7/",
    instagram:
      "https://www.instagram.com/reel/DM14eqYqk5O/?utm_source=ig_web_copy_link",
    youtube: "https://youtube.com/shorts/429Cq97jxOQ?feature=share",
    twitter: "https://x.com/RadhakrishnaIND/status/1951525686373421101",
    linkedin:
      "https://www.linkedin.com/feed/update/urn:li:activity:7357030573179064320",
  };

  const handleSocialClick = (platform: string) => {
    window.open(socialLinks[platform], "_blank");
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-700 leading-tight">
            ET Excellence Award
          </h1>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Image Section */}
          <div className="flex justify-center">
            <div
              onClick={() => setLightboxOpen(true)}
              className="cursor-pointer group relative w-full max-w-lg"
            >
              <img
                src="https://i.ibb.co/Lh65LvNG/award.png"
                alt="ET Excellence Award"
                className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02] object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg flex items-center justify-center transition">
                <span className="opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-60 px-3 py-1 rounded-full text-xs sm:text-sm">
                  Click to enlarge
                </span>
              </div>
            </div>
          </div>

          {/* Text + Video */}
          <div className="w-full max-w-xl mx-auto rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            {/* Text */}
            <div className="p-5 sm:p-6">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base text-justify">
                <strong className="text-amber-700">ASKOXY.AI</strong>, led by{" "}
                <strong>Radhakrishna Thatavarti</strong>, is revolutionizing
                India's future with AI-powered innovations. Recognized with the{" "}
                <span className="font-medium text-amber-700">
                  ET Excellence Award
                </span>
                , the platform empowers entrepreneurs, enhances careers, and
                drives digital transformation through its{" "}
                <strong>AI-Z Marketplace</strong> and advanced financial,
                education, and business solutions.
              </p>
            </div>

            {/* Video */}
            <div className="w-full">
              <iframe
                src="https://drive.google.com/file/d/1vFxflNUzjZpuQjBnG3wX1tS_dhwTkTcL/preview?autoplay=1"
                title="Award Ceremony Video"
                className="w-full h-[220px] sm:h-[280px] md:h-[320px] border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Social Icons */}
            {/* Social Icons */}
            <div className="p-5 flex flex-wrap justify-center gap-3 max-w-xs mx-auto sm:max-w-full">
              {[
                { icon: Facebook, color: "text-blue-600", key: "facebook" },
                { icon: Instagram, color: "text-pink-600", key: "instagram" },
                { icon: Youtube, color: "text-red-600", key: "youtube" },
                { icon: Twitter, color: "text-blue-500", key: "twitter" },
                { icon: Linkedin, color: "text-blue-700", key: "linkedin" },
              ].map(({ icon: Icon, color, key }) => (
                <button
                  key={key}
                  onClick={() => handleSocialClick(key)}
                  aria-label={`Share on ${key}`}
                  className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition"
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative max-w-6xl w-full">
              <img
                src="https://i.ibb.co/Lh65LvNG/award.png"
                alt="ET Excellence Award"
                className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardPage;
