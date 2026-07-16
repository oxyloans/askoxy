import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Award, Calendar, Trophy,
  Users, CheckCircle, BookOpen, Star, PoundSterling,
} from "lucide-react";

interface University {
  id: number;
  name: string;
  country: string;
  location?: string;
  image: string;
  overview: string;
  programs: string[];
  eligibility: string;
  documents: string[];
  tuitionFees: string;
  scholarships: string;
  intake: string[];
  campus: string;
  rankings: string;
  careerSupport: string;
  highlights?: string[];
  description?: string;
}

interface UniversityModalProps {
  isOpen: boolean;
  university: University | null;
  onClose: () => void;
  onApply: (id: number) => void;
}

const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, university, onClose, onApply }) => {
  if (!university) return null;

  const eligibilityLines = university.eligibility.split("|").map((s) => s.trim());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-white sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto z-10 rounded-t-3xl"
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Hero Image */}
            <div className="relative h-52 sm:h-64 lg:h-80 overflow-hidden rounded-t-3xl">
              <img
                src={university.image}
                alt={university.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-7">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow tracking-tight">
                  {university.name}
                </h1>
                <div className="flex items-center gap-2 mt-1.5 text-white/80 text-sm sm:text-base font-medium">
                  <MapPin className="w-4 h-4" />
                  {(university as any).location || university.country}
                </div>
              </div>
            </div>

            {/* Rankings Banner */}
            {university.rankings && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                <p className="text-white text-sm font-semibold tracking-wide">{university.rankings}</p>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

              {/* 1. About the University */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2 uppercase tracking-widest">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  About the University
                </h3>
                <p className="text-[15px] text-gray-700 leading-7 font-normal">{university.overview}</p>
              </div>

              {/* 2. Why Choose */}
              {university.highlights && university.highlights.length > 0 && (
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
                  <h3 className="text-base font-bold text-purple-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Star className="w-5 h-5 text-purple-600" />
                    Why Choose This University
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {university.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-purple-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[15px] text-gray-700 font-medium leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Tuition Fees */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <PoundSterling className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Tuition Fees</p>
                </div>
                <p className="text-xl font-extrabold text-gray-800 ml-[52px]">{university.tuitionFees}</p>
              </div>

              {/* 4. Scholarship */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Scholarship</p>
                </div>
                <p className="text-[15px] font-semibold text-gray-800 leading-relaxed ml-[52px]">{university.scholarships}</p>
              </div>

              {/* 5. Intakes */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">Intakes</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-[52px]">
                  {university.intake.map((month, idx) => (
                    <span key={idx} className="bg-orange-100 border border-orange-200 text-orange-800 text-sm font-bold px-4 py-1.5 rounded-full">
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* 6. Entry Requirements */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
                <h3 className="text-base font-bold text-sky-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Users className="w-5 h-5 text-sky-600" />
                  Entry Requirements & English Proficiency
                </h3>
                <div className="space-y-2.5">
                  {eligibilityLines.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-sky-100 shadow-sm">
                      <CheckCircle className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[15px] text-gray-700 leading-relaxed">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 justify-end rounded-b-3xl">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => { onApply(university.id); onClose(); }}
                className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-200 transition-all duration-200 text-sm"
              >
                Apply Now →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UniversityModal;
