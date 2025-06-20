import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ExternalLink,
  Grid3X3,
  List,
  Building2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import axios from "axios";

// API Interfaces
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
interface UniversitySearchProps {
  onNavigate?: (tab: string) => void;
}

interface UniversitiesApiResponse {
  data: University[];
  count: number;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://meta.oxyloans.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Utility functions
const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error accessing token from storage:', error);
    return null;
  }
};

// Configure axios interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const UniversitySearch: React.FC<UniversitySearchProps> = ({ onNavigate }) => {
  // State management
  const [universities, setUniversities] = useState<University[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    country: "all",
    region: "all"
  });

  // Fetch universities from API
  const fetchUniversities = async (pageIndex: number = 1, search: string = "") => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching universities...', { pageIndex, pageSize });
      
      const response = await apiClient.post<UniversitiesApiResponse>(
        `/user-service/student/universities?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        {} // Empty body since parameters are in query string
      );

      console.log('Universities response:', response.data);
      
      if (response.data) {
        setUniversities(response.data.data || []);
        setTotalCount(response.data.count || 0);
      }
    } catch (err: any) {
      console.error('Error fetching universities:', err);
      setError('Failed to load universities. Please try again.');
      setUniversities([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter universities based on search and filters
  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = searchTerm === "" || 
      uni.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.universityCampusCity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filters.country === "all" || 
      uni.country.toLowerCase().includes(filters.country.toLowerCase());
    
    return matchesSearch && matchesCountry;
  });

  // Get unique countries for filter
  const uniqueCountries = Array.from(new Set(universities.map(uni => uni.country))).sort();

  const resetFilters = () => {
    setFilters({
      country: "all",
      region: "all"
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchUniversities(page, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Search handler
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length === 0 || term.length >= 3) {
      setCurrentPage(1);
      fetchUniversities(1, term);
    }
  };
  const handleApplyToUniversity = (university: University) => {
    // Store selected university data for potential application
    localStorage.setItem('selectedUniversity', JSON.stringify(university));
    onNavigate?.('applications');
  };

  // Effects
  useEffect(() => {
    fetchUniversities(1);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              University Search
            </h3>
            <p className="text-sm text-gray-600">
              Find from {totalCount.toLocaleString()} institutions worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search universities, locations, countries..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, country: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              >
                <option value="all">All Countries</option>
                {uniqueCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, region: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              >
                <option value="all">All Regions</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>

            <div>
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {filteredUniversities.length} of {totalCount.toLocaleString()}{" "}
              universities
              {loading && <span className="ml-2">Loading...</span>}
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "cards"
                    ? "bg-violet-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-violet-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Loading Universities
            </h3>
            <p className="text-sm text-gray-600">Please wait...</p>
          </div>
        )}

        {/* Universities Grid/List */}
        {!loading && (
          <div>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg hover:border-violet-300 transition-all duration-300 group"
                  >
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl overflow-hidden mb-3">
                        {uni.universityLogo ? (
                          <img
                            src={uni.universityLogo}
                            alt={`${uni.universityName} Logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.innerHTML = "🎓";
                            }}
                          />
                        ) : (
                          "🎓"
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 text-base line-clamp-2">
                        {uni.universityName}
                      </h4>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                          {uni.universityCampusCity}
                        </span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {uni.country}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600 font-medium">
                            LOCATION
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 text-sm text-center">
                          {uni.address}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <Building2 className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-gray-600 font-medium">
                            CAMPUS
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 text-sm text-center">
                          {uni.universityCampusCity}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                      {uni.universityLink && (
                        <a
                          href={uni.universityLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium text-sm"
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {/* <button
                        onClick={() => handleApplyToUniversity(uni)}
                        className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium text-sm"
                      >
                        Apply Now
                      </button> */}
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
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                            {uni.universityLogo ? (
                              <img
                                src={uni.universityLogo}
                                alt={`${uni.universityName} Logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.parentElement!.innerHTML =
                                    "🎓";
                                }}
                              />
                            ) : (
                              "🎓"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-base md:text-lg mb-2">
                              {uni.universityName}
                            </h4>
                            <div className="text-sm text-gray-600 mb-2">
                              {uni.universityCampusCity} • {uni.country} •{" "}
                              {uni.address}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between lg:justify-end space-x-4">
                          {uni.universityLink && (
                            <a
                              href={uni.universityLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              <span>Visit</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleApplyToUniversity(uni)}
                            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 md:px-6 py-2 rounded-xl text-sm hover:from-violet-600 hover:to-purple-600 transition"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredUniversities.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <Building2 className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No universities found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more
              universities.
            </p>
            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredUniversities.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} (
                {totalCount.toLocaleString()} total universities)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:text-violet-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-violet-500 text-white"
                            : "text-gray-600 hover:text-violet-600 hover:bg-violet-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:text-violet-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversitySearch;