import React from "react";
import { motion } from "framer-motion";

interface TrustBadgeProps {
  isVisible?: boolean;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ isVisible = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex justify-center lg:justify-start mb-4"
    >
      <div className="inline-flex items-center gap-3 bg-white border-2 border-purple-200 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300">
        <span className="text-lg">🎓</span>
        <span className="text-xs sm:text-sm text-gray-700 font-medium">
          AI-Powered Guidance • Expert Counsellors • End-to-End Support
        </span>
      </div>
    </motion.div>
  );
};

export default TrustBadge;
