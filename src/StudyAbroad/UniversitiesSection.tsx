import React, { useState } from "react";
import { ChevronRight, Globe, Star, Users, School, Building, CheckCircle, GraduationCap, Award, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
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
      image: "https://i.ibb.co/fYT75tzG/mit-supply-chain-management-00-0.jpg",
      description:
        "World's leading institution for technology and innovation research",
      ranking: "#1 Global",
      programs: 220,
      intake: ["Fall", "Spring"],
      tuitionFee: "$57,986",
    },
    {
      name: "Imperial College London",
      country: "UK",
      location: "London, England",
      image: "https://i.ibb.co/s932xwg2/1678969832php9e6w-QM-g.jpg",
      description:
        "Premier institution for science, engineering, medicine and business",
      ranking: "#2 Global",
      programs: 165,
      intake: ["Fall"],
      tuitionFee: "£35,100",
    },
    {
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, England",
      image: "https://i.ibb.co/d41rW2Js/Tanongsak-Mahakusol-9-cropped.jpg",
      description:
        "One of the oldest and most prestigious universities in the world",
      ranking: "#3 Global",
      programs: 200,
      intake: ["Fall"],
      tuitionFee: "£28,950",
    },
    {
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "https://i.ibb.co/S4NRnFsc/download.jpg",
      description:
        "Prestigious Ivy League institution known for excellence in all fields",
      ranking: "#4 Global",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "$54,269",
    },
    {
      name: "University of Cambridge",
      country: "UK",
      location: "Cambridge, England",
      image:
        "https://i.ibb.co/QvLNDQv3/Banner-Image-The-University-of-Cambridge.webp",
      description:
        "Historic university renowned for academic excellence and research",
      ranking: "#5 Global",
      programs: 195,
      intake: ["Fall"],
      tuitionFee: "£24,507",
    },
    {
      name: "Stanford University",
      country: "USA",
      location: "Stanford, California",
      image: "https://i.ibb.co/DDYCj4BT/stanford-main-campus-1.jpg",
      description:
        "Leading research university in Silicon Valley with innovation focus",
      ranking: "#6 Global",
      programs: 210,
      intake: ["Fall", "Spring"],
      tuitionFee: "$56,169",
    },
    {
      name: "ETH Zurich (Swiss Federal Institute of Technology)",
      country: "Switzerland",
      location: "Zurich, Switzerland",
      image: "https://i.ibb.co/v25xvyc/images.jpg",
      description:
        "Europe's leading science and technology university with cutting-edge research",
      ranking: "#7 Global",
      programs: 185,
      intake: ["Fall", "Spring"],
      tuitionFee: "CHF 1,298",
    },
    {
      name: "National University of Singapore (NUS)",
      country: "Singapore",
      location: "Singapore",
      image: "https://i.ibb.co/zHnyR5jr/Education-Resource-Centre-02.jpg",
      description:
        "Asia's top university offering comprehensive education and research excellence",
      ranking: "#8 Global",
      programs: 240,
      intake: ["Fall", "Spring"],
      tuitionFee: "S$37,550",
    },
    {
      name: "University College London (UCL)",
      country: "UK",
      location: "London, England",
      image: "https://i.ibb.co/4gFw9mCX/images-1.jpg",
      description:
        "Leading multidisciplinary university in the heart of London",
      ranking: "#9 Global",
      programs: 290,
      intake: ["Fall"],
      tuitionFee: "£28,500",
    },
  ];

  // Offers-Based Universities (High acceptance rates and special offers)
  const offersBasedUniversities: University[] = [
    {
      name: "Arizona State University",
      country: "USA",
      location: "Tempe, Arizona",
      image: "https://i.ibb.co/s9NvX20S/ASU.jpg",
      description:
        "Innovation-focused university with high acceptance rate and diverse programs",
      offerRate: "88% Acceptance",
      programs: 350,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$31,200",
      scholarships: ["Merit Scholarship", "International Award"],
      specialOffer: "Up to $15,000 Scholarship",
    },
    {
      name: "University of South Florida",
      country: "USA",
      location: "Tampa, Florida",
      image: "https://i.ibb.co/5xw0CqL4/1533899324php-Ts-Wb-Ra.jpg",
      description:
        "Fast-growing research university with excellent student support and opportunities",
      offerRate: "87% Acceptance",
      programs: 230,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$17,324",
      scholarships: ["Academic Excellence", "Global Achievement"],
      specialOffer: "First Year Free Housing",
    },
    {
      name: "Coventry University",
      country: "UK",
      location: "Coventry, England",
      image: "https://i.ibb.co/v4rg0TMs/download-2.jpg",
      description:
        "Modern university known for innovation, practical learning and industry connections",
      offerRate: "85% Acceptance",
      programs: 300,
      intake: ["Fall", "Spring"],
      tuitionFee: "£19,850",
      scholarships: ["Vice-Chancellor Award", "International Scholarship"],
      specialOffer: "25% Tuition Discount",
    },
    {
      name: "Deakin University",
      country: "Australia",
      location: "Melbourne, Victoria",
      image: "https://i.ibb.co/gLzhrsX3/download-3.jpg",
      description:
        "Progressive university offering flexible study options and strong industry partnerships",
      offerRate: "83% Acceptance",
      programs: 280,
      intake: ["March", "July", "November"],
      tuitionFee: "AU$37,400",
      scholarships: ["STEM Scholarship", "Vice-Chancellor's Award"],
      specialOffer: "20% International Scholarship",
    },
    {
      name: "University of Essex",
      country: "UK",
      location: "Colchester, England",
      image: "https://i.ibb.co/PsNBGHt1/download-4.jpg",
      description:
        "Research-intensive university with strong graduate employment rates",
      offerRate: "81% Acceptance",
      programs: 200,
      intake: ["Fall", "Spring"],
      tuitionFee: "£22,750",
      scholarships: ["Academic Excellence", "International Merit"],
      specialOffer: "£5,000 Early Bird Discount",
    },
    {
      name: "Northeastern University",
      country: "USA",
      location: "Boston, Massachusetts",
      image:
        "https://i.ibb.co/6ckFN23N/college-1020-29-14-45-Global-Expansion-8-21-23-Campus-Jessica-Xing-15-2-1200x798.jpg",
      description:
        "Experience-driven university with strong co-op program and industry connections",
      offerRate: "80% Acceptance",
      programs: 275,
      intake: ["Fall", "Spring"],
      tuitionFee: "$59,100",
      scholarships: ["Dean's Scholarship", "Global Scholars"],
      specialOffer: "Co-op Guaranteed Program",
    },
    {
      name: "University of Calgary",
      country: "Canada",
      location: "Calgary, Alberta",
      image: "https://i.ibb.co/MkBsbhmZ/download-5.jpg",
      description:
        "Comprehensive research university with strong energy and engineering programs",
      offerRate: "78% Acceptance",
      programs: 250,
      intake: ["Fall", "Winter", "Spring"],
      tuitionFee: "CAD $26,900",
      scholarships: ["International Entrance", "Academic Excellence"],
      specialOffer: "CAD $10,000 Entrance Award",
    },
    {
      name: "Griffith University",
      country: "Australia",
      location: "Brisbane, Queensland",
      image: "https://i.ibb.co/qF4SjSR5/download-6.jpg",
      description:
        "Innovative university with strong focus on sustainability and employability",
      offerRate: "76% Acceptance",
      programs: 320,
      intake: ["February", "July"],
      tuitionFee: "AU$33,500",
      scholarships: ["International Excellence", "Vice-Chancellor's"],
      specialOffer: "25% First Year Discount",
    },
    {
      name: "Birmingham City University",
      country: "UK",
      location: "Birmingham, England",
      image: "https://i.ibb.co/M5KF7sdQ/download-7.jpg",
      description:
        "Modern university with strong industry links and practical learning approach",
      offerRate: "75% Acceptance",
      programs: 400,
      intake: ["Fall", "Spring"],
      tuitionFee: "£16,300",
      scholarships: ["International Scholarship", "Academic Merit"],
      specialOffer: "30% Tuition Reduction",
    },
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

  const handleViewPrograms = () => {
    navigate("/all-universities");
  };

  const handleApplyNow = () => {
  navigate("/student-home");
  };

  const currentUniversities = activeTab === 'qs-ranked' ? qsRankedUniversities : offersBasedUniversities;
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-purple-500"></div>
            <h2 className="mx-4 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-yellow-500">
              Top Universities
            </h2>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Discover premier institutions offering world-class education and
            research opportunities.
          </p>
        </div>

        {/* Statistics */}
        <div
          ref={ref}
          className="flex flex-wrap justify-center items-center gap-8 mt-6 py-6 w-full px-4"
        >
          <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <Users size={36} className="text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {inView && <CountUp end={5000} duration={5} />}+
            </div>
            <div className="text-gray-600 text-center text-sm">Students</div>
          </div>

          <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <School size={36} className="text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {inView && <CountUp end={1000} duration={5} />}+
            </div>
            <div className="text-gray-600 text-center text-sm">
              Universities
            </div>
          </div>

          <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <Building size={36} className="text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {inView && <CountUp end={1500} duration={5} />}+
            </div>
            <div className="text-gray-600 text-center text-sm">Courses</div>
          </div>

          <div className="text-center flex flex-col items-center w-[140px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <Globe size={36} className="text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {inView && <CountUp end={25} duration={5} />}+
            </div>
            <div className="text-gray-600 text-center text-sm">Countries</div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-full flex space-x-1">
            {[
              { key: "qs-ranked", label: "QS Ranked Universities" },
              { key: "offers-based", label: "Universities with Offers" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(tab.key as "qs-ranked" | "offers-based")
                }
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                  activeTab === tab.key
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header & View All */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeTab === "qs-ranked"
              ? "Top QS Ranked Universities"
              : "Universities with Special Offers"}
          </h3>
          <button
            onClick={handleViewAllClick}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center text-sm"
          >
            View All Universities
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUniversities.map((university, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col"
            >
              <div className="relative">
                <img
                  src={university.image}
                  alt={university.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 space-y-2">
                  {university.specialOffer && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      🔥 {university.specialOffer}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 space-y-2 text-xs">
                  <span className="bg-white px-2 py-1 rounded-full flex items-center gap-1 text-gray-700">
                    {countryFlags[university.country]} {university.country}
                  </span>
                  {university.ranking && (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                      {university.ranking}
                    </span>
                  )}
                  {university.offerRate && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full">
                      {university.offerRate}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {university.name}
                  </h4>
                  <p className="text-purple-600 text-sm mt-1 flex items-center">
                    <Globe className="w-4 h-4 mr-1" /> {university.location}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {university.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    {university.programs && (
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>{university.programs}+ Programs</span>
                        <div className="text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 inline-block" />
                          ))}
                        </div>
                      </div>
                    )}

                    {university.tuitionFee && (
                      <div className="text-sm text-gray-600">
                        <strong>Tuition:</strong> {university.tuitionFee}
                      </div>
                    )}

                    {university.intake && university.intake.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {university.intake.map((month) => (
                          <span
                            key={month}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {month}
                          </span>
                        ))}
                      </div>
                    )}

                    {university.scholarships &&
                      university.scholarships.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {university.scholarships.map((sch) => (
                            <span
                              key={sch}
                              className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
                            >
                              {sch}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={handleViewPrograms}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    View Programs
                  </button>
                  <button
                    onClick={handleApplyNow}
                    className="text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleViewAllClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 inline-flex items-center gap-2"
          >
            <School className="w-5 h-5" />
            View All Universities
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Programs */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Most Popular Study Programs
            </h3>
            <button
              onClick={handleViewAllClick}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center"
            >
              View All Programs
              <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                name: "Business & Management",
                icon: "💼",
                count: "150+",
                universities: "45 Universities",
              },
              {
                name: "Computer Science",
                icon: "💻",
                count: "120+",
                universities: "38 Universities",
              },
              {
                name: "Engineering",
                icon: "⚙️",
                count: "200+",
                universities: "52 Universities",
              },
              {
                name: "Medicine & Health",
                icon: "🏥",
                count: "80+",
                universities: "28 Universities",
              },
              {
                name: "Arts & Design",
                icon: "🎨",
                count: "90+",
                universities: "32 Universities",
              },
              {
                name: "Law",
                icon: "⚖️",
                count: "60+",
                universities: "25 Universities",
              },
              {
                name: "Environmental Science",
                icon: "🌱",
                count: "70+",
                universities: "30 Universities",
              },
              {
                name: "Psychology",
                icon: "🧠",
                count: "85+",
                universities: "35 Universities",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white p-4 text-center rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <h4 className="text-sm font-semibold">{p.name}</h4>
                <p className="text-xs text-purple-600">{p.count} Courses</p>
                <p className="text-xs text-gray-500">{p.universities}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;