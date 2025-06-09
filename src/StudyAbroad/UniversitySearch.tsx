import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Bookmark,
  Share2,
  ExternalLink,
  Plus,
  Grid3X3,
  List,
  SlidersHorizontal,
  Building2
} from "lucide-react";

const UniversitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [filters, setFilters] = useState({
    country: "all",
    costRange: "all",
    ranking: "all",
    program: "all"
  });

  const universities = [
    {
      id: 1,
      name: "University of California, Berkeley",
      location: "California, USA",
      cost: "$65,000/year",
      ranking: "#4 Global",
      deadline: "December 30, 2024",
      match: "95%",
      programs: "Computer Science, Data Science",
      acceptance: "17%",
      logo: "🎓",
      country: "USA",
      category: "Public",
      founded: 1868,
      students: "45,000+",
      tuitionRange: "high"
    },
    {
      id: 2,
      name: "University College London",
      location: "London, UK",
      cost: "£35,000/year",
      ranking: "#8 Global",
      deadline: "January 15, 2025",
      match: "92%",
      programs: "AI & Machine Learning",
      acceptance: "63%",
      logo: "🏛️",
      country: "UK",
      category: "Public",
      founded: 1826,
      students: "42,000+",
      tuitionRange: "high"
    },
    {
      id: 3,
      name: "University of Toronto",
      location: "Toronto, Canada",
      cost: "CAD 58,000/year",
      ranking: "#18 Global",
      deadline: "January 31, 2025",
      match: "88%",
      programs: "Engineering Science",
      acceptance: "43%",
      logo: "🍁",
      country: "CANADA",
      category: "Public",
      founded: 1827,
      students: "97,000+",
      tuitionRange: "high"
    },
    {
      id: 4,
      name: "Brock University",
      location: "Ontario, Canada",
      cost: "CAD 28,000/year",
      ranking: "#45 Canada",
      deadline: "March 1, 2025",
      match: "85%",
      programs: "Bachelor of Science in Nursing",
      acceptance: "78%",
      logo: "🏫",
      country: "CANADA",
      category: "Public",
      founded: 1964,
      students: "19,000+",
      tuitionRange: "medium"
    },
    {
      id: 5,
      name: "Canadore College",
      location: "Ontario, Canada",
      cost: "CAD 22,000/year",
      ranking: "Top College",
      deadline: "April 15, 2025",
      match: "90%",
      programs: "Practical Nursing Program",
      acceptance: "65%",
      logo: "🎓",
      country: "CANADA",
      category: "College",
      founded: 1967,
      students: "8,000+",
      tuitionRange: "low"
    },
    {
      id: 6,
      name: "Centennial College",
      location: "Toronto, Canada",
      cost: "CAD 25,000/year",
      ranking: "Premier College",
      deadline: "May 1, 2025",
      match: "87%",
      programs: "Bachelor of Science in Nursing",
      acceptance: "72%",
      logo: "🏛️",
      country: "CANADA",
      category: "College",
      founded: 1966,
      students: "30,000+",
      tuitionRange: "medium"
    },
    {
      id: 7,
      name: "Stanford University",
      location: "California, USA",
      cost: "$75,000/year",
      ranking: "#2 Global",
      deadline: "December 15, 2024",
      match: "93%",
      programs: "Computer Science, Engineering",
      acceptance: "4%",
      logo: "🎓",
      country: "USA",
      category: "Private",
      founded: 1885,
      students: "17,000+",
      tuitionRange: "high"
    },
    {
      id: 8,
      name: "MIT",
      location: "Massachusetts, USA",
      cost: "$73,000/year",
      ranking: "#1 Global",
      deadline: "December 20, 2024",
      match: "91%",
      programs: "Artificial Intelligence, Robotics",
      acceptance: "7%",
      logo: "🏛️",
      country: "USA",
      category: "Private",
      founded: 1861,
      students: "11,000+",
      tuitionRange: "high"
    }
  ];

  const countryOptions = ["all", "USA", "UK", "CANADA", "AUSTRALIA", "GERMANY"];
  const costRangeOptions = [
    { value: "all", label: "All Costs" },
    { value: "low", label: "Under $30,000" },
    { value: "medium", label: "$30,000 - $50,000" },
    { value: "high", label: "Above $50,000" }
  ];
  const rankingOptions = [
    { value: "all", label: "All Rankings" },
    { value: "top10", label: "Top 10" },
    { value: "top50", label: "Top 50" },
    { value: "top100", label: "Top 100" }
  ];

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.programs.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filters.country === "all" || uni.country === filters.country;
    const matchesCost = filters.costRange === "all" || uni.tuitionRange === filters.costRange;
    
    return matchesSearch && matchesCountry && matchesCost;
  });

  const resetFilters = () => {
    setFilters({
      country: "all",
      costRange: "all",
      ranking: "all",
      program: "all"
    });
    setSearchTerm("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              University Search
            </h3>
            <p className="text-gray-600">
              Discover your perfect university match from {universities.length} institutions worldwide
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>Saved ({3})</span>
            </button>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
              <Plus className="w-4 h-4" />
              <span>Compare</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search universities, programs, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {countryOptions.map(country => (
                <option key={country} value={country}>
                  {country === "all" ? "All Countries" : country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range</label>
            <select
              value={filters.costRange}
              onChange={(e) => setFilters(prev => ({ ...prev, costRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {costRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ranking</label>
            <select
              value={filters.ranking}
              onChange={(e) => setFilters(prev => ({ ...prev, ranking: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {rankingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredUniversities.length} of {universities.length} universities
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "cards"
                    ? "bg-violet-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-violet-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Universities Grid/List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-violet-300 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {uni.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 text-lg line-clamp-2">
                      {uni.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{uni.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {uni.country}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {uni.ranking}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="font-bold text-violet-600">{uni.match}</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600 font-medium">ANNUAL COST</span>
                  </div>
                  <div className="font-bold text-gray-900">{uni.cost}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600 font-medium">DEADLINE</span>
                    </div>
                    <div className="font-medium text-gray-900 text-sm">{uni.deadline}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 font-medium mb-1">ACCEPTANCE</div>
                    <div className="font-medium text-gray-900 text-sm">{uni.acceptance}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-600 font-medium mb-2">PROGRAMS</div>
                <div className="text-sm text-gray-900 font-medium line-clamp-2">
                  {uni.programs}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 flex-1 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-xl">
                      {uni.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {uni.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-bold text-violet-600">{uni.match}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {uni.location} • {uni.country} • {uni.ranking}
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {uni.programs}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm text-center">
                      <div className="font-bold text-gray-900">{uni.cost}</div>
                      <div className="text-gray-600">Annual Cost</div>
                    </div>
                    <div className="text-sm text-center">
                      <div className="font-bold text-gray-900">{uni.acceptance}</div>
                      <div className="text-gray-600">Acceptance</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-violet-600 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm hover:from-violet-600 hover:to-purple-600 transition">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredUniversities.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more universities.
          </p>
          <button
            onClick={resetFilters}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversitySearch;