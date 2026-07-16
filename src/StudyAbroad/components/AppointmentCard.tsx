import React from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Target, Clock, ArrowRight } from "lucide-react";

interface AppointmentCardProps {
  onBookAppointment?: () => void;
  isVisible?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  onBookAppointment,
  isVisible = true,
}) => {
  const features = [
    { icon: Calendar, text: "Free 30-Min Consultation" },
    { icon: Users, text: "Expert Counsellors" },
    { icon: Target, text: "Personalized Recommendations" },
    { icon: Clock, text: "Instant Appointment Booking" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.9 }
      }
      transition={{ duration: 0.7, delay: 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="hidden lg:block fixed bottom-8 right-8 w-80 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-300/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none"></div>

      <div className="relative space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Book Your Free Counselling
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
        </div>

        {/* Features */}
        <div className="space-y-3 py-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium pt-0.5">
                  {feature.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBookAppointment}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          Book Appointment
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
