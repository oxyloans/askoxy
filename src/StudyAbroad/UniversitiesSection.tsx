import React, { useState } from "react";
import { ChevronRight, Globe, Star, Users, School, Building, CheckCircle, GraduationCap, Award, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Type definitions
interface University {
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programs?: number;
  intake?: string[];
  tuitionFee?: string;
  offerRate?: string;
  scholarships?: string[];
  specialOffer?: string;
}

interface UniversitiesSectionProps {
  onViewAllClick?: () => void;
}

const UniversitiesSection: React.FC<UniversitiesSectionProps> = ({ onViewAllClick }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'qs-ranked' | 'offers-based'>('qs-ranked');

  // QS Ranked Universities (Top 9)
  const qsRankedUniversities: University[] = [
    {
      name: "Massachusetts Institute of Technology (MIT)",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description: "World's leading institution for technology and innovation research",
      ranking: "#1 Global",
      programs: 220,
      intake: ["Fall", "Spring"],
      tuitionFee: "$57,986"
    },
    {
      name: "Imperial College London",
      country: "UK",
      location: "London, England",
      image: "/api/placeholder/400/250",
      description: "Premier institution for science, engineering, medicine and business",
      ranking: "#2 Global",
      programs: 165,
      intake: ["Fall"],
      tuitionFee: "£35,100"
    },
    {
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, England",
      image: "/api/placeholder/400/250",
      description: "One of the oldest and most prestigious universities in the world",
      ranking: "#3 Global",
      programs: 200,
      intake: ["Fall"],
      tuitionFee: "£28,950"
    },
    {
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description: "Prestigious Ivy League institution known for excellence in all fields",
      ranking: "#4 Global",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "$54,269"
    },
    {
      name: "University of Cambridge",
      country: "UK",
      location: "Cambridge, England",
      image: "/api/placeholder/400/250",
      description: "Historic university renowned for academic excellence and research",
      ranking: "#5 Global",
      programs: 195,
      intake: ["Fall"],
      tuitionFee: "£24,507"
    },
    {
      name: "Stanford University",
      country: "USA",
      location: "Stanford, California",
      image: "/api/placeholder/400/250",
      description: "Leading research university in Silicon Valley with innovation focus",
      ranking: "#6 Global",
      programs: 210,
      intake: ["Fall", "Spring"],
      tuitionFee: "$56,169"
    },
    {
      name: "ETH Zurich (Swiss Federal Institute of Technology)",
      country: "Switzerland",
      location: "Zurich, Switzerland",
      image: "/api/placeholder/400/250",
      description: "Europe's leading science and technology university with cutting-edge research",
      ranking: "#7 Global",
      programs: 185,
      intake: ["Fall", "Spring"],
      tuitionFee: "CHF 1,298"
    },
    {
      name: "National University of Singapore (NUS)",
      country: "Singapore",
      location: "Singapore",
      image: "/api/placeholder/400/250",
      description: "Asia's top university offering comprehensive education and research excellence",
      ranking: "#8 Global",
      programs: 240,
      intake: ["Fall", "Spring"],
      tuitionFee: "S$37,550"
    },
    {
      name: "University College London (UCL)",
      country: "UK",
      location: "London, England",
      image: "/api/placeholder/400/250",
      description: "Leading multidisciplinary university in the heart of London",
      ranking: "#9 Global",
      programs: 290,
      intake: ["Fall"],
      tuitionFee: "£28,500"
    }
  ];

  // Offers-Based Universities (High acceptance rates and special offers)
  const offersBasedUniversities: University[] = [
    {
      name: "Arizona State University",
      country: "USA",
      location: "Tempe, Arizona",
      image: "/api/placeholder/400/250",
      description: "Innovation-focused university with high acceptance rate and diverse programs",
      offerRate: "88% Acceptance",
      programs: 350,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$31,200",
      scholarships: ["Merit Scholarship", "International Award"],
      specialOffer: "Up to $15,000 Scholarship"
    },
    {
      name: "University of South Florida",
      country: "USA",
      location: "Tampa, Florida",
      image: "/api/placeholder/400/250",
      description: "Fast-growing research university with excellent student support and opportunities",
      offerRate: "87% Acceptance",
      programs: 230,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$17,324",
      scholarships: ["Academic Excellence", "Global Achievement"],
      specialOffer: "First Year Free Housing"
    },
    {
      name: "Coventry University",
      country: "UK",
      location: "Coventry, England",
      image: "/api/placeholder/400/250",
      description: "Modern university known for innovation, practical learning and industry connections",
      offerRate: "85% Acceptance",
      programs: 300,
      intake: ["Fall", "Spring"],
      tuitionFee: "£19,850",
      scholarships: ["Vice-Chancellor Award", "International Scholarship"],
      specialOffer: "25% Tuition Discount"
    },
    {
      name: "Deakin University",
      country: "Australia",
      location: "Melbourne, Victoria",
      image: "/api/placeholder/400/250",
      description: "Progressive university offering flexible study options and strong industry partnerships",
      offerRate: "83% Acceptance",
      programs: 280,
      intake: ["March", "July", "November"],
      tuitionFee: "AU$37,400",
      scholarships: ["STEM Scholarship", "Vice-Chancellor's Award"],
      specialOffer: "20% International Scholarship"
    },
    {
      name: "University of Essex",
      country: "UK",
      location: "Colchester, England",
      image: "/api/placeholder/400/250",
      description: "Research-intensive university with strong graduate employment rates",
      offerRate: "81% Acceptance",
      programs: 200,
      intake: ["Fall", "Spring"],
      tuitionFee: "£22,750",
      scholarships: ["Academic Excellence", "International Merit"],
      specialOffer: "£5,000 Early Bird Discount"
    },
    {
      name: "Northeastern University",
      country: "USA",
      location: "Boston, Massachusetts",
      image: "/api/placeholder/400/250",
      description: "Experience-driven university with strong co-op program and industry connections",
      offerRate: "80% Acceptance",
      programs: 275,
      intake: ["Fall", "Spring"],
      tuitionFee: "$59,100",
      scholarships: ["Dean's Scholarship", "Global Scholars"],
      specialOffer: "Co-op Guaranteed Program"
    },
    {
      name: "University of Calgary",
      country: "Canada",
      location: "Calgary, Alberta",
      image: "/api/placeholder/400/250",
      description: "Comprehensive research university with strong energy and engineering programs",
      offerRate: "78% Acceptance",
      programs: 250,
      intake: ["Fall", "Winter", "Spring"],
      tuitionFee: "CAD $26,900",
      scholarships: ["International Entrance", "Academic Excellence"],
      specialOffer: "CAD $10,000 Entrance Award"
    },
    {
      name: "Griffith University",
      country: "Australia",
      location: "Brisbane, Queensland",
      image: "/api/placeholder/400/250",
      description: "Innovative university with strong focus on sustainability and employability",
      offerRate: "76% Acceptance",
      programs: 320,
      intake: ["February", "July"],
      tuitionFee: "AU$33,500",
      scholarships: ["International Excellence", "Vice-Chancellor's"],
      specialOffer: "25% First Year Discount"
    },
    {
      name: "Birmingham City University",
      country: "UK",
      location: "Birmingham, England",
      image: "/api/placeholder/400/250",
      description: "Modern university with strong industry links and practical learning approach",
      offerRate: "75% Acceptance",
      programs: 400,
      intake: ["Fall", "Spring"],
      tuitionFee: "£16,300",
      scholarships: ["International Scholarship", "Academic Merit"],
      specialOffer: "30% Tuition Reduction"
    }
  ];

  const countryFlags: Record<string, string> = {
    USA: "🇺🇸",
    UK: "🇬🇧",
    Germany: "🇩🇪",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    France: "🇫🇷",
    Switzerland: "🇨🇭",
    Singapore: "🇸🇬"
  };

  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    }
    navigate('/all-universities');
  };

  const handleViewPrograms = (universityName: string) => {
    console.log(`View programs for ${universityName}`);
  };

  const handleApplyNow = (universityName: string) => {
    console.log(`Apply to ${universityName}`);
  };

  const currentUniversities = activeTab === 'qs-ranked' ? qsRankedUniversities : offersBasedUniversities;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-32 bg-gradient-to-r from-transparent to-purple-500"></div>
            <h2 className="mx-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-yellow-500">
              Top Universities
            </h2>
            <div className="h-px w-32 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover premier institutions offering world-class education and
            research opportunities
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-6 py-6 w-full px-4">
            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Users size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">5000+</div>
              <div className="text-gray-600 text-center text-sm">Students</div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <School size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">1000+</div>
              <div className="text-gray-600 text-center text-sm">Universities</div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Building size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">600+</div>
              <div className="text-gray-600 text-center text-sm">Courses</div>
            </div>

            <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <Globe size={36} className="text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">25+</div>
              <div className="text-gray-600 text-center text-sm">Countries</div>
            </div>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab('qs-ranked')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'qs-ranked'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
    
              QS Ranked Universities
            </button>
            <button
              onClick={() => setActiveTab('offers-based')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'offers-based'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Universities with Offers
            </button>
          </div>
        </div>

        {/* Header with View All link */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            {activeTab === 'qs-ranked' ? 'Top QS Ranked Universities' : 'Universities with Special Offers'}
          </h3>
          <button
            onClick={handleViewAllClick}
            className="text-purple-600 hover:text-purple-800 font-semibold flex items-center group"
          >
            View All Universities
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentUniversities.map((university, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200"
            >
              <div className="relative overflow-hidden">
                <img
                  src={university.image}
                  alt={university.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Country flag and ranking/offer rate badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                    <span>{countryFlags[university.country]}</span>
                    {university.country}
                  </span>
                  {university.ranking && (
                    <span className="bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                      {university.ranking}
                    </span>
                  )}
                  {university.offerRate && (
                    <span className="bg-green-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                      {university.offerRate}
                    </span>
                  )}
                </div>

                {/* Special Offer Badge */}
                {university.specialOffer && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                      🔥 {university.specialOffer}
                    </span>
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {university.name}
                </h3>
                <p className="text-purple-600 text-sm mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {university.location}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {university.description}
                </p>

                {/* Info section */}
                <div className="space-y-2 mb-4">
                  {university.programs && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{university.programs}+ Programs</span>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {university.tuitionFee && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tuition:</span> {university.tuitionFee}
                    </div>
                  )}

                  {university.intake && (
                    <div className="flex flex-wrap gap-1">
                      {university.intake.map((intake) => (
                        <span
                          key={intake}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {intake}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Scholarships for offers-based universities */}
                  {university.scholarships && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {university.scholarships.map((scholarship) => (
                        <span
                          key={scholarship}
                          className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                        >
                          {scholarship}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleViewPrograms(university.name)}
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group"
                  >
                    View Programs
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleApplyNow(university.name)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllClick}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <School className="w-5 h-5" />
            View All Universities
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Featured programs section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Most Popular Study Programs
            </h3>
            <button
              onClick={handleViewAllClick}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group"
            >
              View All Programs
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Business & Management", icon: "💼", count: "150+", universities: "45 Universities" },
              { name: "Computer Science", icon: "💻", count: "120+", universities: "38 Universities" },
              { name: "Engineering", icon: "⚙️", count: "200+", universities: "52 Universities" },
              { name: "Medicine & Health", icon: "🏥", count: "80+", universities: "28 Universities" },
              { name: "Arts & Design", icon: "🎨", count: "90+", universities: "32 Universities" },
              { name: "Law", icon: "⚖️", count: "60+", universities: "25 Universities" },
              { name: "Environmental Science", icon: "🌱", count: "70+", universities: "30 Universities" },
              { name: "Psychology", icon: "🧠", count: "85+", universities: "35 Universities" },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {program.icon}
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                  {program.name}
                </h4>
                <p className="text-xs text-purple-600 font-medium">
                  {program.count} Courses
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {program.universities}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;