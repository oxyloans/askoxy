import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CountryFilter from "./CountryFilter";
import UniversityCard from "./UniversityCard";
import UniversityModal from "./UniversityModal";
import UniversityApplicationModal from "./UniversityApplicationModal";
import universities from "../data/universities.json";

interface University {
  id: number;
  universityId: string;
  name: string;
  country: string;
  description: string;
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
}

interface Props {
  pendingUniversityId?: number | null;
}

const OfferLetterSection: React.FC<Props> = ({ pendingUniversityId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyUniversity, setApplyUniversity] = useState<University | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const universityNames = useMemo(() => universities.map((u) => u.name), []);

  // Auto-open application modal for university selected before login
  useEffect(() => {
    if (!pendingUniversityId) return;
    const uni = universities.find((u) => u.id === pendingUniversityId);
    if (uni) {
      sessionStorage.removeItem("pendingApplyUniversityId");
      setApplyUniversity(uni as any);
      setIsApplyOpen(true);
    }
  }, [pendingUniversityId]);

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedUniversityFilter === "" || uni.name === selectedUniversityFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedUniversityFilter]);

  const handleKnowMore = (id: number) => {
    const uni = universities.find((u) => u.id === id);
    if (uni) { setSelectedUniversity(uni); setIsModalOpen(true); }
  };

  const handleApplyNow = (id: number) => {
    const isLoggedIn = !!localStorage.getItem("userId");
    if (isLoggedIn) {
      const uni = universities.find((u) => u.id === id);
      if (uni) { setApplyUniversity(uni as any); setIsApplyOpen(true); }
    } else {
      sessionStorage.setItem("pendingApplyUniversityId", String(id));
      sessionStorage.setItem("redirectPath", "/student-dashboard");
      sessionStorage.setItem("fromStudyAbroad", "true");
      sessionStorage.setItem("primaryType", "STUDENT");
      navigate("/whatsappregister?primaryType=STUDENT");
    }
  };

  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            7 Days{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                University Offer Letter
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-60" />
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-2" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            Receive your university offer letter in just{" "}
            <span className="text-purple-700 font-semibold">7 working days</span>{" "}
            from our trusted global university network through AskOxy.ai
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-[0_2px_20px_rgba(109,40,217,0.07)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="md:col-span-2">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by university name, country..." />
              </div>
              <div className="md:col-span-1">
                <CountryFilter universityNames={universityNames} selectedUniversity={selectedUniversityFilter} onUniversityChange={setSelectedUniversityFilter} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                <span className="text-purple-600 font-bold">{filteredUniversities.length}</span> of 7 universities
              </p>
              {(searchTerm || selectedUniversityFilter) && (
                <button onClick={() => { setSearchTerm(""); setSelectedUniversityFilter(""); }}
                  className="text-xs text-purple-400 hover:text-purple-600 font-medium transition-colors">
                  Clear all
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Universities Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-16 lg:mb-20"
        >
          {filteredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {filteredUniversities.map((university) => (
                <UniversityCard
                  key={university.id}
                  id={university.id}
                  name={university.name}
                  country={university.country}
                  location={(university as any).location}
                  description={university.description}
                  image={university.image}
                  onKnowMore={handleKnowMore}
                  onApplyNow={handleApplyNow}
                />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-2xl text-gray-500 font-semibold">No universities found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter options.</p>
            </motion.div>
          )}
        </motion.div>

      </div>

      <UniversityModal
        isOpen={isModalOpen}
        university={selectedUniversity}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyNow}
      />

      <UniversityApplicationModal
        isOpen={isApplyOpen}
        university={applyUniversity}
        onClose={() => setIsApplyOpen(false)}
      />
    </section>
  );
};

export default OfferLetterSection;