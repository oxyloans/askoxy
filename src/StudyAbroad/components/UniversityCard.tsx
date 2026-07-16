import React from "react";
import { motion } from "framer-motion";
import { MapPin, Zap } from "lucide-react";

interface UniversityCardProps {
  id: number;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  onKnowMore: (id: number) => void;
  onApplyNow: (id: number) => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  id,
  name,
  country,
  location,
  description,
  image,
  onKnowMore,
  onApplyNow,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(109,40,217,0.10)] hover:shadow-[0_12px_40px_rgba(109,40,217,0.22)] transition-all duration-400 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col border border-purple-50">
        {/* Image Container */}
        <div className="relative h-36 sm:h-40 lg:h-48 bg-gradient-to-br from-purple-100 to-indigo-100 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* 7-Day Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Zap className="w-3 h-3" />
            7 Days
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-5 flex flex-col">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[0.85rem] sm:text-[0.9rem] lg:text-[1rem] font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors leading-snug" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                {name}
              </h3>
              <div className="flex items-center gap-1 text-purple-500 text-[10px] sm:text-xs font-semibold whitespace-nowrap mt-1 bg-purple-50 px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3 text-purple-500 flex-shrink-0" />
                {location}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.6] font-normal tracking-wide mb-3 sm:mb-4" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {description}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-auto">
            <button
              onClick={() => onKnowMore(id)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 text-xs sm:text-sm"
            >
              Know More
            </button>
            <button
              onClick={() => onApplyNow(id)}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm transform hover:scale-105"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversityCard;
