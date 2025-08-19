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
  const [videoOpen, setVideoOpen] = useState(false);

  const socialLinks: Record<string, string> = {
    facebook: "https://www.facebook.com/share/v/1C82pmULn7/",
    instagram:
      "https://www.instagram.com/reel/DM14eqYqk5O/?utm_source=ig_web_copy_link",
    youtube: "https://www.youtube.com/watch?v=429Cq97jxOQ",
    twitter: "https://x.com/RadhakrishnaIND/status/1951525686373421101",
    linkedin:
      "https://www.linkedin.com/feed/update/urn:li:activity:7357030573179064320",
  };

  const handleSocialClick = (platform: string) => {
    window.open(socialLinks[platform], "_blank");
  };

  return (
    <div className="  min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 sm:px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <header className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-amber-700 leading-tight">
            ET Excellence Award
          </h2>
          <div className="mx-auto mb-5 w-28 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - Award Image */}
          <div className="flex justify-center lg:justify-start">
            <div
              // onClick={() => setLightboxOpen(true)}
              className="relative cursor-pointer group w-full max-w-md"
            >
              <img
                src="https://i.ibb.co/Lh65LvNG/award.png"
                alt="ET Excellence Award"
                className=" transition-transform duration-300 group-hover:scale-[1.03] object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right - Video + Text */}
          <div className="space-y-6">
            {/* Video Thumbnail */}
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg cursor-pointer bg-amber-200"
              onClick={() => setVideoOpen(true)}
            >
              <img
                src="https://img.youtube.com/vi/429Cq97jxOQ/hqdefault.jpg"
                alt="Award Ceremony Video"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center text-5xl text-white bg-black bg-opacity-30">
                ▶
              </span>
            </div>

            {/* Text */}
            <p className="text-gray-700 leading-relaxed text-base">
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

            {/* Social Icons */}
            <div className="flex gap-4">
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
                  className="p-3 rounded-full hover:bg-gray-100 transition"
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </button>
              ))}
            </div>
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
              className="max-h-[90vh] max-w-full object-contain "
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://drive.google.com/file/d/1vFxflNUzjZpuQjBnG3wX1tS_dhwTkTcL/preview"
              title="Award Ceremony Video"
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
              onClick={() => setVideoOpen(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardPage;
