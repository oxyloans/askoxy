import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, DollarSign, FileText, Users } from "lucide-react";

interface CounsellingBenefitsCardProps {
  onBookNow?: () => void;
  isVisible?: boolean;
}

const CounsellingBenefitsCard: React.FC<CounsellingBenefitsCardProps> = ({
  onBookNow,
  isVisible = true,
}) => {
  const benefits = [
    {
      icon: GraduationCap,
      label: "University Selection",
    },
    {
      icon: DollarSign,
      label: "Scholarship Guidance",
    },
    {
      icon: FileText,
      label: "Visa Assistance",
    },
    {
      icon: Users,
      label: "Career Counselling",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-8 sm:mt-10 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Book Free Counselling
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Get personalized university, course, scholarship and visa guidance
            from our expert counsellors.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg hover:bg-purple-100 transition-colors duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">
                  {benefit.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Book Now Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onBookNow}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CounsellingBenefitsCard;
