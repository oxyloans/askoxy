import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TrustSectionProps {
  isVisible?: boolean;
}

const TrustSection: React.FC<TrustSectionProps> = ({ isVisible = true }) => {
  // Sample avatar colors/initials for demonstration
  const avatars = [
    { initials: "AR", color: "from-blue-500 to-cyan-500" },
    { initials: "SJ", color: "from-purple-500 to-pink-500" },
    { initials: "MK", color: "from-orange-500 to-yellow-500" },
    { initials: "NP", color: "from-green-500 to-teal-500" },
    { initials: "RP", color: "from-red-500 to-pink-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-8 sm:mt-10 text-center lg:text-left"
    >
      <div className="flex flex-col gap-4">
        <p className="text-gray-700 text-sm sm:text-base font-medium">
          Trusted by <strong className="text-purple-700 text-lg">10,000+ students</strong> worldwide
        </p>

        {/* Avatars and Rating */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar Stack */}
          <div className="flex -space-x-3">
            {avatars.map((avatar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className={`w-10 h-10 bg-gradient-to-r ${avatar.color} rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-md hover:scale-110 transition-transform duration-300`}
                title={avatar.initials}
              >
                {avatar.initials}
              </motion.div>
            ))}
          </div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">4.9/5</span>
            <span className="text-gray-600 text-sm">(2,400+ reviews)</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrustSection;
