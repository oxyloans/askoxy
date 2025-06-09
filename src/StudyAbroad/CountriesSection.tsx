import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  Globe,
  Award,
  GraduationCap,
  X,
  School,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CanadaFlag from "../assets/img/canada.png";
import USAFlag from "../assets/img/usa.png";
import UKFlag from "../assets/img/uk.png";
import AustraliaFlag from "../assets/img/australia.png";
import NewZealandFlag from "../assets/img/newzealand.png";
import IrelandFLag from "../assets/img/ireland.png";
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

interface CountriesSectionProps {
  onViewAllClick?: () => void; // Add prop for navigation
}

const CountriesSection: React.FC<CountriesSectionProps> = ({ onViewAllClick }) => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
  const [arrowPosition, setArrowPosition] = useState({ left: 0, top: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const countryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Custom styles to ensure flag images don't show white borders
  const flagStyle = {
    ".flag-container": {
      overflow: "hidden",
    },
    ".flag-image": {
      transform: "scale(1.15)",
      transformOrigin: "center",
    }
  };

  const countries: Country[] = [
  {
    "name": "USA",
    "description": "Home to Ivy League schools and cutting-edge research institutions",
    "details": {
      "visaInfo": "F-1 Student Visa required",
      "langRequirements": "TOEFL 80–100+ or IELTS 6.5–7.5+",
      "avgTuition": "$20,000 – $60,000 per year",
      "popularPrograms": ["Business", "Computer Science", "Engineering"],
      "scholarships": ["Fulbright Program", "Merit-based scholarships"]
    }
  },
  {
    "name": "UK",
    "description": "Centuries of academic excellence and diverse opportunities",
    "details": {
      "visaInfo": "Student Visa required",
      "langRequirements": "IELTS 6.0+ typically required",
      "avgTuition": "£12,000 – £35,000 per year",
      "popularPrograms": ["Business", "Law", "Arts"],
      "scholarships": ["Chevening Scholarships", "Commonwealth Scholarships"]
    }
  },
  {
    "name": "Canada",
    "description": "Quality education with welcoming immigration policies",
    "details": {
      "visaInfo": "Study Permit required",
      "langRequirements": "IELTS 6.0+ or TOEFL equivalent",
      "avgTuition": "CAD $15,000 – $40,000 per year",
      "popularPrograms": ["Business", "Healthcare", "Technology"],
      "scholarships": ["Vanier Canada Graduate Scholarships"]
    }
  },
  {
    "name": "Germany",
    "description": "Renowned for engineering, tuition-free public universities",
    "details": {
      "visaInfo": "German Student Visa required",
      "langRequirements": "German proficiency or English for international programs",
      "avgTuition": "€0 – €3,000 per year",
      "popularPrograms": ["Engineering", "Physics", "Medicine"],
      "scholarships": ["DAAD Scholarships", "Erasmus+"]
    }
  },
  {
    "name": "Italy",
    "description": "Rich cultural heritage and prestigious ancient universities",
    "details": {
      "visaInfo": "Student Visa type D required for non-EU students",
      "langRequirements": "Italian proficiency or English for international programs",
      "avgTuition": "€1,000 – €5,000 per year",
      "popularPrograms": ["Arts", "Architecture", "Fashion Design"],
      "scholarships": ["Italian Government Scholarships", "Regional Scholarships"]
    }
  },
  {
    "name": "Ireland",
    "description": "Friendly atmosphere with high academic standards and rich culture",
    "details": {
      "visaInfo": "Irish Study Visa required for non-EU students",
      "langRequirements": "IELTS 6.0+ typically required",
      "avgTuition": "€10,000 – €25,000 per year",
      "popularPrograms": ["Literature", "Medicine", "Information Technology"],
      "scholarships": ["Government of Ireland Scholarship", "Walsh Fellowship"]
    }
  },
  {
    "name": "Australia",
    "description": "Top-ranked universities with excellent post-study work options",
    "details": {
      "visaInfo": "Student Visa (subclass 500) required",
      "langRequirements": "IELTS 6.0+ typically required",
      "avgTuition": "AUD $20,000 – $50,000 per year",
      "popularPrograms": ["Engineering", "Business", "Medicine"],
      "scholarships": ["Australia Awards", "Endeavour Scholarships"]
    }
  },
  {
    "name": "New Zealand",
    "description": "Quality education with breathtaking natural landscapes",
    "details": {
      "visaInfo": "Student Visa required",
      "langRequirements": "IELTS 6.0+ typically required",
      "avgTuition": "NZ$22,000 – $35,000 per year",
      "popularPrograms": ["Agriculture", "Environmental Sciences", "Tourism"],
      "scholarships": ["New Zealand Excellence Awards"]
    }
  },
  {
    "name": "France",
    "description": "World-class education in arts, sciences, and culinary studies",
    "details": {
      "visaInfo": "VLS-TS Student Visa required",
      "langRequirements": "French or English depending on program",
      "avgTuition": "€3,000 – €10,000 per year",
      "popularPrograms": ["Business", "Arts", "Culinary"],
      "scholarships": ["Eiffel Excellence Scholarship"]
    }
  },
  {
    "name": "Netherlands",
    "description": "High-quality education with many English-taught programs",
    "details": {
      "visaInfo": "Residence Permit required for non-EU students",
      "langRequirements": "IELTS 6.0+ or TOEFL equivalent for English programs",
      "avgTuition": "€8,000 – €20,000 per year",
      "popularPrograms": ["Business", "Engineering", "Social Sciences"],
      "scholarships": ["Orange Knowledge Programme", "Holland Scholarship"]
    }
  }
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
      Germany: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${GermanyFlag})` }} />
    ),
     Italy: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${ItalyFlag})` }} />
    ),
     Ireland: (
      <div className="w-full h-full bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: `url(${IrelandFLag})` }} />
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

  const handleViewAllClick = () => {
    if (onViewAllClick) {
      onViewAllClick();
    }
    // If using React Router, you could also do:
    navigate('/all-universities');
  };

  const handleCountrySelect = (country: Country) => {
    if (activeCountry?.name === country.name && showDetails) {
      setShowDetails(false);
      return;
    }

    setActiveCountry(country);
    setSelectedCountry(country.name);

    // Calculate arrow position
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
    // Handle explore country universities click
    console.log(`Explore ${countryName} universities`);
    handleViewAllClick();
  };

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

          {/* Country flags row with dynamic arrow - Updated to circular design */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 mb-16 relative">
            {/* Dynamic arrow that follows the selected country */}
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
                {/* Updated Container for main country selection flags */}
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

          {/* Country Details Section with smooth animation */}
          {(showDetails || isAnimating) && activeCountry && (
            <div
              id="country-details"
              className={`relative w-full mb-12 transition-all duration-300 ${
                showDetails
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform -translate-y-4"
              }`}
            >
              <div className="border-3 border-yellow-500 rounded-lg p-6 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    {/* Updated flag container in country details */}
                    <div className="w-12 h-12 mr-4 ring-2 ring-purple-200 rounded-full overflow-hidden flag-container" style={{ padding: 0 }}>
                      <div className="w-full h-full">
                        {
                          countryFlags[
                            activeCountry.name as keyof typeof countryFlags
                          ]
                        }
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-900">
                      {activeCountry.name} Study Information
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="mb-6 text-gray-600 italic border-l-4 border-yellow-500 pl-3">
                  {activeCountry.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Visa Requirements
                    </h4>
                    <p>{activeCountry.details.visaInfo}</p>

                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Globe className="w-5 h-5 mr-2" />
                      Language Requirements
                    </h4>
                    <p>{activeCountry.details.langRequirements}</p>

                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Award className="w-5 h-5 mr-2" />
                      Average Tuition
                    </h4>
                    <p>{activeCountry.details.avgTuition}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 flex items-center text-purple-800">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Popular Programs
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {activeCountry.details.popularPrograms.map(
                        (program, index) => (
                          <li key={index}>{program}</li>
                        )
                      )}
                    </ul>

                    <h4 className="font-semibold text-lg mt-5 mb-3 flex items-center text-purple-800">
                      <Award className="w-5 h-5 mr-2" />
                      Scholarships
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {activeCountry.details.scholarships.map(
                        (scholarship, index) => (
                          <li key={index}>{scholarship}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => handleExploreCountryUniversities(activeCountry.name)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-2 px-6 rounded-full shadow-md transition duration-300"
                  >
                    Explore {activeCountry.name} Universities
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Universities Section with divider */}
          <div className="w-full border-t-2 border-yellow-500 pt-8 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-purple-900">
                  1000+ Universities
                </h3>
                <p className="text-xl flex items-center">
                  <span className="inline-block w-8 h-1 bg-yellow-500 mr-2"></span>
                  600+ Courses Available
                </p>
              </div>
              <button 
                onClick={handleViewAllClick}
                className="bg-white border-2 border-yellow-500 text-purple-800 hover:bg-yellow-50 px-6 py-2 rounded-full shadow-md transition duration-300 font-semibold flex items-center group"
              >
                View all universities
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* University Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Card */}
              {[
                {
                  name: "Harvard University",
                  location: "Cambridge, Massachusetts",
                  country: "USA",
                  imageUrl: "/api/placeholder/400/250",
                },
                {
                  name: "University of California, Berkeley",
                  location: "Berkeley, California",
                  country: "USA",
                  imageUrl: "/api/placeholder/400/250",
                },
                {
                  name: "University of Southern California",
                  location: "Los Angeles, California",
                  country: "USA",
                  imageUrl: "/api/placeholder/400/250",
                },
              ].map((uni, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={uni.imageUrl}
                      alt={uni.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Updated flag badge */}
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 ring-2 ring-white shadow-md overflow-hidden rounded-full flag-container" style={{ padding: 0 }}>
                        <div className="w-full h-full">
                          {countryFlags[uni.country as keyof typeof countryFlags]}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-70"></div>
                  </div>
                  <div className="p-4 text-center bg-white">
                    <h4 className="font-semibold text-lg text-purple-900">
                      {uni.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{uni.location}</p>
                    <div className="mt-3 flex justify-center">
                      <button className="text-purple-700 hover:text-purple-900 text-sm font-medium inline-flex items-center group">
                        View Programs
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Updated View more universities section to match UniversitiesSection style */}
            <div className="mt-12 text-center">
              <button 
                onClick={handleViewAllClick}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <School className="w-5 h-5" />
                View All Universities
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;