import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Globe,
  Star,
  Users,
  School,
  Building,
  CheckCircle,
  GraduationCap,
  Filter,
  Search,
  X,
  MapPin,
  Calendar,
  DollarSign,
  BookOpen,
  Award,
  Eye,
  Heart,
  ArrowUpRight,
  Crown,
  TrendingUp,
  University,
  Clock,
  SlidersHorizontal,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Type definitions
interface University {
  id: number;
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programs?: number;
  intake: string[];
  tuitionFee: string;
  establishedYear: number;
  type: string;
  acceptanceRate: string;
  internationalStudents: string;
}

const AllUniversities = () => {
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedIntake, setSelectedIntake] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "ranking" | "programs" | "year"
  >("name");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const navigate = useNavigate();

  const countries = [
    { code: "USA", name: "United States", flag: "🇺🇸" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "Germany", name: "Germany", flag: "🇩🇪" },
    { code: "Canada", name: "Canada", flag: "🇨🇦" },
    { code: "Australia", name: "Australia", flag: "🇦🇺" },
    { code: "France", name: "France", flag: "🇫🇷" },
    { code: "Netherlands", name: "Netherlands", flag: "🇳🇱" },
    { code: "Sweden", name: "Sweden", flag: "🇸🇪" },
    { code: "Switzerland", name: "Switzerland", flag: "🇨🇭" },
    { code: "Japan", name: "Japan", flag: "🇯🇵" },
  ];

  const intakeOptions = ["Fall", "Spring", "Summer", "Winter"];

  const countryFlags: Record<string, string> = {
    USA: "🇺🇸",
    UK: "🇬🇧",
    Germany: "🇩🇪",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    France: "🇫🇷",
    Netherlands: "🇳🇱",
    Sweden: "🇸🇪",
    Switzerland: "🇨🇭",
    Japan: "🇯🇵",
  };

  // Enhanced universities data with more complete information
  const universities: University[] = [
    {
      id: 1,
      name: "Harvard University",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description:
        "Prestigious Ivy League institution known for excellence in all fields including medicine, law, and business",
      ranking: "#1 Global",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "$54,000/year",
      establishedYear: 1636,
      type: "Private Research",
      acceptanceRate: "3.4%",
      internationalStudents: "25%",
    },
    {
      id: 2,
      name: "Stanford University",
      country: "USA",
      location: "Stanford, California",
      image: "/api/placeholder/400/250",
      description:
        "Leading research university in Silicon Valley with world-class technology and engineering programs",
      ranking: "#2 USA",
      programs: 150,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$56,000/year",
      establishedYear: 1885,
      type: "Private Research",
      acceptanceRate: "4.3%",
      internationalStudents: "22%",
    },
    {
      id: 3,
      name: "Massachusetts Institute of Technology",
      country: "USA",
      location: "Cambridge, Massachusetts",
      image: "/api/placeholder/400/250",
      description:
        "World-renowned institute for technology, engineering, and scientific research with cutting-edge facilities",
      ranking: "#3 USA",
      programs: 120,
      intake: ["Fall", "Spring"],
      tuitionFee: "$55,000/year",
      establishedYear: 1861,
      type: "Private Research",
      acceptanceRate: "6.7%",
      internationalStudents: "33%",
    },
    {
      id: 4,
      name: "University of California, Berkeley",
      country: "USA",
      location: "Berkeley, California",
      image: "/api/placeholder/400/250",
      description:
        "Top public research university with diverse academic programs and renowned faculty across disciplines",
      ranking: "#4 USA",
      programs: 200,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "$45,000/year",
      establishedYear: 1868,
      type: "Public Research",
      acceptanceRate: "14.5%",
      internationalStudents: "18%",
    },
    {
      id: 5,
      name: "Yale University",
      country: "USA",
      location: "New Haven, Connecticut",
      image: "/api/placeholder/400/250",
      description:
        "Historic Ivy League university with exceptional liberal arts programs and distinguished alumni network",
      ranking: "#5 USA",
      programs: 160,
      intake: ["Fall", "Spring"],
      tuitionFee: "$58,000/year",
      establishedYear: 1701,
      type: "Private Research",
      acceptanceRate: "4.6%",
      internationalStudents: "20%",
    },
    {
      id: 6,
      name: "University of Oxford",
      country: "UK",
      location: "Oxford, England",
      image: "/api/placeholder/400/250",
      description:
        "One of the oldest and most prestigious universities globally, offering world-class education since 1096",
      ranking: "#1 UK",
      programs: 200,
      intake: ["Fall"],
      tuitionFee: "£9,250/year",
      establishedYear: 1096,
      type: "Public Research",
      acceptanceRate: "15.9%",
      internationalStudents: "45%",
    },
    {
      id: 7,
      name: "University of Cambridge",
      country: "UK",
      location: "Cambridge, England",
      image: "/api/placeholder/400/250",
      description:
        "Historic university with outstanding academic reputation and innovative research across all disciplines",
      ranking: "#2 UK",
      programs: 190,
      intake: ["Fall"],
      tuitionFee: "£9,250/year",
      establishedYear: 1209,
      type: "Public Research",
      acceptanceRate: "18.8%",
      internationalStudents: "38%",
    },
    {
      id: 8,
      name: "Imperial College London",
      country: "UK",
      location: "London, England",
      image: "/api/placeholder/400/250",
      description:
        "Leading university specialized in science, technology, engineering and medicine with industry connections",
      ranking: "#3 UK",
      programs: 120,
      intake: ["Fall", "Spring"],
      tuitionFee: "£32,000/year",
      establishedYear: 1907,
      type: "Public Research",
      acceptanceRate: "14.3%",
      internationalStudents: "59%",
    },
    {
      id: 9,
      name: "Technical University of Munich",
      country: "Germany",
      location: "Munich, Bavaria",
      image: "/api/placeholder/400/250",
      description:
        "Leading technical university with strong industry partnerships and excellent engineering programs",
      ranking: "#1 Germany",
      programs: 145,
      intake: ["Fall", "Spring"],
      tuitionFee: "€1,500/year",
      establishedYear: 1868,
      type: "Public Technical",
      acceptanceRate: "8%",
      internationalStudents: "35%",
    },
    {
      id: 10,
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, Ontario",
      image: "/api/placeholder/400/250",
      description:
        "Canada's top university with diverse academic programs and world-class research facilities",
      ranking: "#1 Canada",
      programs: 215,
      intake: ["Fall", "Spring", "Summer"],
      tuitionFee: "CAD $58,000/year",
      establishedYear: 1827,
      type: "Public Research",
      acceptanceRate: "43%",
      internationalStudents: "25%",
    },
    {
      id: 11,
      name: "University of Melbourne",
      country: "Australia",
      location: "Melbourne, Victoria",
      image: "/api/placeholder/400/250",
      description:
        "Australia's leading university with excellent research facilities and diverse international community",
      ranking: "#1 Australia",
      programs: 190,
      intake: ["Fall", "Spring"],
      tuitionFee: "AUD $45,000/year",
      establishedYear: 1853,
      type: "Public Research",
      acceptanceRate: "70%",
      internationalStudents: "47%",
    },
    {
      id: 12,
      name: "Sorbonne University",
      country: "France",
      location: "Paris, Île-de-France",
      image: "/api/placeholder/400/250",
      description:
        "Historic university in the heart of Paris, renowned for humanities, sciences, and cultural programs",
      ranking: "#1 France",
      programs: 120,
      intake: ["Fall", "Spring"],
      tuitionFee: "€2,770/year",
      establishedYear: 1150,
      type: "Public Research",
      acceptanceRate: "10%",
      internationalStudents: "21%",
    },
    {
      id: 13,
      name: "University of Amsterdam",
      country: "Netherlands",
      location: "Amsterdam, North Holland",
      image: "/api/placeholder/400/250",
      description:
        "Leading research university in vibrant Amsterdam with strong international programs and partnerships",
      ranking: "#1 Netherlands",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "€2,168/year",
      establishedYear: 1632,
      type: "Public Research",
      acceptanceRate: "25%",
      internationalStudents: "30%",
    },
    {
      id: 14,
      name: "Karolinska Institute",
      country: "Sweden",
      location: "Stockholm",
      image: "/api/placeholder/400/250",
      description:
        "World-renowned medical university known for Nobel Prize connections and cutting-edge medical research",
      ranking: "#1 Sweden",
      programs: 80,
      intake: ["Fall"],
      tuitionFee: "Free for EU",
      establishedYear: 1810,
      type: "Public Medical",
      acceptanceRate: "6%",
      internationalStudents: "15%",
    },
    {
      id: 15,
      name: "ETH Zurich",
      country: "Switzerland",
      location: "Zurich",
      image: "/api/placeholder/400/250",
      description:
        "World-leading science and technology university with exceptional engineering and research programs",
      ranking: "#1 Switzerland",
      programs: 110,
      intake: ["Fall", "Spring"],
      tuitionFee: "CHF 730/year",
      establishedYear: 1855,
      type: "Public Technical",
      acceptanceRate: "8%",
      internationalStudents: "40%",
    },
    {
      id: 16,
      name: "University of Tokyo",
      country: "Japan",
      location: "Tokyo",
      image: "/api/placeholder/400/250",
      description:
        "Japan's most prestigious university with comprehensive programs and strong research in technology",
      ranking: "#1 Japan",
      programs: 180,
      intake: ["Fall", "Spring"],
      tuitionFee: "¥535,800/year",
      establishedYear: 1877,
      type: "Public Research",
      acceptanceRate: "34%",
      internationalStudents: "12%",
    },
  ];

  // Filter universities based on selected filters
  const filteredUniversities = useMemo(() => {
    let filtered = universities.filter((university) => {
      const countryMatch =
        !selectedCountry || university.country === selectedCountry;
      const intakeMatch =
        !selectedIntake || university.intake.includes(selectedIntake);
      const searchMatch =
        !searchTerm ||
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.country.toLowerCase().includes(searchTerm.toLowerCase());

      return countryMatch && intakeMatch && searchMatch;
    });

    // Sort universities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "ranking":
          const rankA = parseInt(a.ranking?.replace(/[^\d]/g, "") || "999");
          const rankB = parseInt(b.ranking?.replace(/[^\d]/g, "") || "999");
          return rankA - rankB;
        case "programs":
          return (b.programs || 0) - (a.programs || 0);
        case "year":
          return a.establishedYear - b.establishedYear;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCountry, selectedIntake, searchTerm, sortBy]);

  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedIntake("");
    setSearchTerm("");
    setSortBy("name");
  };

  const formatEstablishedYear = (year: number) => {
    const currentYear = new Date().getFullYear();
    const yearsOld = currentYear - year;
    if (yearsOld > 500) return `${yearsOld}+ years of legacy`;
    if (yearsOld > 200) return `${yearsOld}+ years old`;
    return `Est. ${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="relative bg-white border-b border-purple-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-purple-600 rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">
                Elite Universities Worldwide
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-600" />
                {universities.length} premium institutions from{" "}
                {countries.length} destinations
              </p>
            </div>
          </div>

          {/* Compact Search Bar */}
          <div className="max-w-xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search universities, locations, programs..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-purple-200 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters Section */}
      <div className="bg-white border-b border-purple-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
            {/* Compact Country Filter */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                COUNTRY
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full appearance-none bg-white border border-purple-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">🌍 All Countries ({countries.length})</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Compact Intake Filter */}
            <div>
              <label className="block text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                INTAKE
              </label>
              <select
                value={selectedIntake}
                onChange={(e) => setSelectedIntake(e.target.value)}
                className="w-full appearance-none bg-white border border-purple-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">All Intakes</option>
                {intakeOptions.map((intake) => (
                  <option key={intake} value={intake}>
                    {intake} 2025
                  </option>
                ))}
              </select>
            </div>

            {/* Compact Sort By */}
            <div>
              <label className="block text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "name" | "ranking" | "programs" | "year"
                  )
                }
                className="w-full appearance-none bg-white border border-purple-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="name">Name</option>
                <option value="ranking">Ranking</option>
                <option value="programs">Programs</option>
                <option value="year">Year</option>
              </select>
            </div>

            {/* Compact Clear Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          {/* Compact Results Summary */}
          <div className="flex items-center justify-between bg-purple-50 rounded-md px-3 py-2 border border-purple-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                <Crown className="w-3 h-3 text-purple-600" />
                {filteredUniversities.length} Universities
              </span>
              <span className="text-xs text-gray-600">
                By:{" "}
                <span className="font-medium text-purple-700 capitalize">
                  {sortBy}
                </span>
              </span>
            </div>
            {selectedCountry && (
              <div className="flex items-center gap-1 text-xs text-purple-600">
                <span>{countryFlags[selectedCountry]}</span>
                <span className="font-medium">
                  {countries.find((c) => c.code === selectedCountry)?.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {filteredUniversities.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto border border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                No Universities Found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any universities matching your search criteria.
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-colors shadow-lg"
              >
                <X size={18} />
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUniversities.map((university) => (
              <div
                key={university.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300 flex flex-col"
              >
                {/* Header with Image and Basic Info */}
                <div className="p-4 pb-3 border-b border-purple-50">
                  <div className="flex items-start gap-3 mb-3">
                    {/* University Image Circle */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={university.image}
                        alt={university.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                      />
                      {/* Country Flag Overlay */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm shadow-sm border border-purple-100">
                        {countryFlags[university.country]}
                      </div>
                    </div>

                    {/* University Name and Location */}
                    <div className="flex-1 min-w-0">
                      {/* Ranking Badge */}
                      {university.ranking && (
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-2 py-1 rounded-full text-xs font-semibold mb-2">
                          <Crown className="w-3 h-3" />
                          {university.ranking}
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                        {university.name}
                      </h3>

                      <div className="flex items-center text-gray-600 text-xs mb-1">
                        <MapPin className="w-3 h-3 mr-1 text-purple-500 flex-shrink-0" />
                        <span className="truncate">{university.location}</span>
                      </div>

                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formatEstablishedYear(university.establishedYear)}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs mb-0 line-clamp-3 leading-relaxed">
                    {university.description}
                  </p>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Programs Count */}
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center text-purple-600 text-xs font-semibold mb-1">
                        <BookOpen className="w-3 h-3 mr-1" />
                        PROGRAMS
                      </div>
                      <div className="text-purple-800 font-bold text-sm">
                        {university.programs}+
                      </div>
                    </div>

                    {/* Acceptance Rate */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center text-blue-600 text-xs font-semibold mb-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        ACCEPTANCE
                      </div>
                      <div className="text-blue-800 font-bold text-sm">
                        {university.acceptanceRate}
                      </div>
                    </div>
                  </div>

                  {/* Tuition and International Students */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <div className="flex items-center text-green-600 text-xs font-semibold mb-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        TUITION
                      </div>
                      <div className="text-green-800 font-bold text-xs leading-tight">
                        {university.tuitionFee}
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <div className="flex items-center text-orange-600 text-xs font-semibold mb-1">
                        <Globe className="w-3 h-3 mr-1" />
                        INTL STUDENTS
                      </div>
                      <div className="text-orange-800 font-bold text-sm">
                        {university.internationalStudents}
                      </div>
                    </div>
                  </div>

                  {/* Next Intake */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-3 border border-purple-200">
                    <div className="flex items-center text-purple-600 text-xs font-semibold mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      NEXT INTAKE
                    </div>
                    <div className="text-purple-800 font-semibold text-sm flex items-center gap-2">
                      {university.intake[0]} {new Date().getFullYear()}
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">
                        Open
                      </span>
                    </div>
                  </div>

                  {/* University Type and Required Exams */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {university.type.toUpperCase()}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                        TOEFL 90+
                      </span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                        IELTS 6.5+
                      </span>
                    </div>
                  </div>

                  {/* Fixed Bottom Button */}
                  <div className="mt-auto">
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                      <Crown className="w-4 h-4" />
                      Explore Elite Program
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUniversities;
