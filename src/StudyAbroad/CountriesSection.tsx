import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  Globe,
  Award,
  GraduationCap,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CanadaFlag from "../assets/img/canada.png";
import USAFlag from "../assets/img/usa.png";
import UKFlag from "../assets/img/uk.png";
import AustraliaFlag from "../assets/img/australia.png";
import NewZealandFlag from "../assets/img/newzealand.png";
import IrelandFlag from "../assets/img/ireland.png";
import NetherlandsFlag from "../assets/img/netherlands.png";
import GermanyFlag from "../assets/img/germany.png";
import FranceFlag from "../assets/img/france.png";
import ItalyFlag from "../assets/img/italy.png";

// Type definitions
interface CountryDetails {
  visaInfo: string;
  langRequirements: string;
  avgTuition: string;
  popularPrograms: string[];
  scholarships: string[];
}

interface Country {
  name: string;
  description: string;
  details: CountryDetails;
}

interface University {
  id: string;
  universityName: string;
  universityLink: string | null;
  address: string;
  country: string;
  city: string | null;
  universityCampusCity: string;
  universityLogo: string;
}

interface ApiResponse {
  data: University[];
  count: number;
}

interface CountriesSectionProps {
  onViewAllClick?: () => void;
}

const CountriesSection: React.FC<CountriesSectionProps> = ({ 
  onViewAllClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [arrowPosition, setArrowPosition] = useState({ left: 0, top: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Parse query parameter to auto-select country
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryFromQuery = params.get("selected");
    if (countryFromQuery) {
      const country = countries.find(
        (c) => c.name.toLowerCase() === countryFromQuery.toLowerCase()
      );
      if (country) {
        handleCountrySelect(country);
      }
    }
  }, [location.search]);

  // Fetch universities from API using POST method
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);

        const requestBody = {
          pageIndex: 0,
          pageSize: 20,
          filters: {},
          sortBy: null,
          sortOrder: "asc",
        };

        const response = await fetch(
          "https://meta.oxyloans.com/api/user-service/student/universities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          setUniversities(data.data);
        } else if (data && Array.isArray(data)) {
          setUniversities(data);
        } else {
          console.warn("Unexpected response format:", data);
          setUniversities([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load universities";
        setError(errorMessage);
        console.error("Error fetching universities:", err);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Retry function for failed requests
  const retryFetch = () => {
    setError(null);
    setLoading(true);
    const fetchUniversities = async () => {
      try {
        const requestBody = {
          pageIndex: 0,
          pageSize: 20,
          filters: {},
          sortBy: null,
          sortOrder: "asc",
        };

        const response = await fetch(
          "https://meta.oxyloans.com/api/user-service/student/universities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch universities: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          setUniversities(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load universities";
        setError(errorMessage);
        console.error("Error fetching universities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  };

  const countries: Country[] = [
    {
      name: "USA",
      description: "Home to Ivy League schools and cutting-edge research institutions",
      details: {
        visaInfo: "F-1 Student Visa required",
        langRequirements: "TOEFL 80–100+ or IELTS 6.5–7.5+",
        avgTuition: "$20,000 – $60,000 per year",
        popularPrograms: ["Business", "Computer Science", "Engineering"],
        scholarships: ["Fulbright Program", "Merit-based scholarships"],
      },
    },
    {
      name: "UK",
      description: "Centuries of academic excellence and diverse opportunities",
      details: {
        visaInfo: "Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "£12,000 – £35,000 per year",
        popularPrograms: ["Business", "Law", "Arts"],
        scholarships: ["Chevening Scholarships", "Commonwealth Scholarships"],
      },
    },
    {
      name: "Canada",
      description: "Quality education with welcoming immigration policies",
      details: {
        visaInfo: "Study Permit required",
        langRequirements: "IELTS 6.0+ or TOEFL equivalent",
        avgTuition: "CAD $15,000 – $40,000 per year",
        popularPrograms: ["Business", "Healthcare", "Technology"],
        scholarships: ["Vanier Canada Graduate Scholarships"],
      },
    },
    {
      name: "Germany",
      description: "Renowned for engineering, tuition-free public universities",
      details: {
        visaInfo: "German Student Visa required",
        langRequirements: "German proficiency or English for international programs",
        avgTuition: "€0 – €3,000 per year",
        popularPrograms: ["Engineering", "Physics", "Medicine"],
        scholarships: ["DAAD Scholarships", "Erasmus+"],
      },
    },
    {
      name: "Italy",
      description: "Rich cultural heritage and prestigious ancient universities",
      details: {
        visaInfo: "Student Visa type D required for non-EU students",
        langRequirements: "Italian proficiency or English for international programs",
        avgTuition: "€1,000 – €5,000 per year",
        popularPrograms: ["Arts", "Architecture", "Fashion Design"],
        scholarships: ["Italian Government Scholarships", "Regional Scholarships"],
      },
    },
    {
      name: "Ireland",
      description: "Friendly atmosphere with high academic standards and rich culture",
      details: {
        visaInfo: "Irish Study Visa required for non-EU students",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "€10,000 – €25,000 per year",
        popularPrograms: ["Literature", "Medicine", "Information Technology"],
        scholarships: ["Government of Ireland Scholarship", "Walsh Fellowship"],
      },
    },
    {
      name: "Australia",
      description: "Top-ranked universities with excellent post-study work options",
      details: {
        visaInfo: "Student Visa (subclass 500) required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "AUD $20,000 – $50,000 per year",
        popularPrograms: ["Engineering", "Business", "Medicine"],
        scholarships: ["Australia Awards", "Endeavour Scholarships"],
      },
    },
    {
      name: "New Zealand",
      description: "Quality education with breathtaking natural landscapes",
      details: {
        visaInfo: "Student Visa required",
        langRequirements: "IELTS 6.0+ typically required",
        avgTuition: "NZ$22,000 – $35,000 per year",
        popularPrograms: ["Agriculture", "Environmental Sciences", "Tourism"],
        scholarships: ["New Zealand Excellence Awards"],
      },
    },
    {
      name: "France",
      description: "World-class education in arts, sciences, and culinary studies",
      details: {
        visaInfo: "VLS-TS Student Visa required",
        langRequirements: "French or English depending on program",
        avgTuition: "€3,000 – €10,000 per year",
        popularPrograms: ["Business", "Arts", "Culinary"],
        scholarships: ["Eiffel Excellence Scholarship"],
      },
    },
    {
      name: "Netherlands",
      description: "High-quality education with many English-taught programs",
      details: {
        visaInfo: "Residence Permit required for non-EU students",
        langRequirements: "IELTS 6.0+ or TOEFL equivalent for English programs",
        avgTuition: "€8,000 – €20,000 per year",
        popularPrograms: ["Business", "Engineering", "Social Sciences"],
        scholarships: ["Orange Knowledge Programme", "Holland Scholarship"],
      },
    },
  ];

  const countryFlags = {
    USA: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${USAFlag})` }} />
    ),
    UK: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${UKFlag})` }} />
    ),
    Canada: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${CanadaFlag})` }} />
    ),
    CAN: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${CanadaFlag})` }} />
    ),
    Germany: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${GermanyFlag})` }} />
    ),
    Italy: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${ItalyFlag})` }} />
    ),
    Ireland: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${IrelandFlag})` }} />
    ),
    Australia: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${AustraliaFlag})` }} />
    ),
    "New Zealand": (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${NewZealandFlag})` }} />
    ),
    France: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${FranceFlag})` }} />
    ),
    Netherlands: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${NetherlandsFlag})` }} />
    ),
  };

  const getCountryFlag = (countryCode: string) => {
    const flagMap: Record<string, string> = {
      USA: "USA",
      UK: "UK",
      CAN: "Canada",
    };

    const countryName = flagMap[countryCode] || countryCode;
    return countryFlags[countryName as keyof typeof countryFlags] || countryFlags["USA"];
  };

  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    }
    navigate("/all-universities");
  };

  const handleCountrySelect = (country: Country) => {
    if (activeCountry?.name === country.name && showDetails) {
      setShowDetails(false);
      return;
    }

    setActiveCountry(country);
    setSelectedCountry(country.name);

    const ref = countryRefs.current[country.name];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      const containerRect = ref.parentElement?.getBoundingClientRect();
      if (containerRect) {
        setArrowPosition({
          left: rect.left - containerRect.left + rect.width / 2,
          top: rect.bottom - containerRect.top + 10,
        });
      }
    }

    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowDetails(true);
    }, 300);
  };

  const handleExploreCountryUniversities = (countryName: string) => {
    console.log(`Explore ${countryName} universities`);
    handleViewAllClick();
  };

  const displayUniversities = universities.slice(0, 3);

  return (
    <section className="py-4 mb-4">
      <div className="px-4 sm:px-6">
        <div className="border-2 border-yellow-500 rounded-lg p-6 relative bg-white shadow-lg">
          {/* Top Countries Header */}
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            <div className="bg-white px-8 rounded-full border-2 border-yellow-500 shadow-md">
              <h2 className="text-2xl font-bold mb-1.5 mt-1 text-center text-purple-900">
                Top Countries
              </h2>
            </div>
          </div>

          {/* Country flags row with dynamic arrow */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 mb-16 relative">
            {selectedCountry && (
              <div
                className="absolute w-0 h-0 transition-all duration-300 ease-in-out"
                style={{
                  left: `${arrowPosition.left}px`,
                  top: `${arrowPosition.top}px`,
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: "12px solid #f59e0b",
                  transform: "translateX(-12px)",
                  zIndex: 20,
                }}
              ></div>
            )}

            {countries.map((country) => (
              <div
                key={country.name}
                ref={(el) => (countryRefs.current[country.name] = el)}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  selectedCountry === country.name
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
                onClick={() => handleCountrySelect(country)}
              >
                <div
                  className={`relative w-24 h-24 flag-container ${
                    selectedCountry === country.name
                      ? "ring-4 ring-yellow-500 rounded-full"
                      : "rounded-full"
                  } shadow-md overflow-hidden`}
                  style={{ padding: 0 }}
                >
                  {countryFlags[country.name as keyof typeof countryFlags]}
                </div>
                <span
                  className={`mt-3 font-medium ${
                    selectedCountry === country.name
                      ? "text-purple-700 font-bold"
                      : ""
                  }`}
                >
                  {country.name}
                </span>
              </div>
            ))}
          </div>

          {/* Country Details */}
          {(showDetails || isAnimating) && activeCountry && (
            <div
              className={`transition-all duration-300 ${
                showDetails
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="bg-white border border-yellow-400 rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-start sm:items-center mb-6 flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-200 mr-3">
                      {
                        countryFlags[
                          activeCountry.name as keyof typeof countryFlags
                        ]
                      }
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-purple-900">
                      {activeCountry.name} Study Information
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-600 hover:text-red-500 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="italic text-gray-600 border-l-4 border-yellow-500 pl-4 mb-6">
                  {activeCountry.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Visa Requirements
                    </h4>
                    <p className="text-sm">{activeCountry.details.visaInfo}</p>

                    <h4 className="font-semibold text-purple-800 mt-5 mb-2 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Language Requirements
                    </h4>
                    <p className="text-sm">
                      {activeCountry.details.langRequirements}
                    </p>

                    <h4 className="font-semibold text-purple-800 mt-5 mb-2 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Average Tuition
                    </h4>
                    <p className="text-sm">
                      {activeCountry.details.avgTuition}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Popular Programs
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {activeCountry.details.popularPrograms.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>

                    <h4 className="font-semibold text-purple-800 mt-5 mb-2 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Scholarships
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {activeCountry.details.scholarships.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      handleExploreCountryUniversities(activeCountry.name)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md"
                  >
                    Explore {activeCountry.name} Universities
                  </button>
                </div> */}
              </div>
            </div>
          )}

          {/* Universities Section */}
          <div className="border-t-2 border-yellow-400 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-purple-900">
                  1000+ Universities
                </h3>
                <p className="text-lg text-gray-600 mt-2">
                  <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mr-2 align-middle"></span>
                  1500+ Courses Available
                </p>
              </div>

              {/* <button
                onClick={handleViewAllClick}
                className="border-2 border-yellow-400 bg-white hover:bg-yellow-50 text-purple-800 font-semibold px-6 py-2 rounded-full shadow-sm transition-all duration-300 flex items-center group"
              >
                View all universities
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button> */}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading universities...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={retryFetch}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={uni.universityLogo}
                        alt={uni.universityName}
                        className="w-full h-48 object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/300x200?text=University+Logo";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                          {getCountryFlag(uni.country)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold text-purple-900 mb-2">
                        {uni.universityName}
                      </h4>
                      <p className="text-sm text-gray-500 mb-1">
                        {uni.universityCampusCity}, {uni.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;