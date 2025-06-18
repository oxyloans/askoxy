import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Search,
  X,
  MapPin,
  Globe,
  Building,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  Star,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
} from "lucide-react";

import BASE_URL from "../Config";

// Type definitions based on API response
interface University {
  id: string;
  universityName: string;
  universityLink: string | null;
  address: string;
  country: string;
  city: string | null;
  universityCampusCity: string;
  universityLogo: string;
  isQSRanked?: boolean;
  ranking?: number;
}

interface Course {
  courseName: string;
  duration: string | null;
  cost: string;
  typesOfExams: string;
  country: string | null;
  universityId: string | null;
  university: string | null;
  degree: string;
  tutionFee1styr: string;
  applicationFee: string;
  courseUrl: string;
  intake: string;
  intake2: string;
  intake3: string;
}

interface ApiResponse {
  data: University[] | Course[];
  count: number;
  success: boolean;
  message?: string;
}

const AllUniversities: React.FC = () => {
  // State management
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [coursePage, setCoursePage] = useState(1);
  const [coursePageSize] = useState(20);
  const [totalCourseCount, setTotalCourseCount] = useState(0);
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "country" | "ranking">("name");
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  // Calculate pagination values for universities
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  // Calculate pagination values for courses
  const totalCoursePages = Math.ceil(totalCourseCount / coursePageSize);
  const courseStartIndex = (coursePage - 1) * coursePageSize + 1;
  const courseEndIndex = Math.min(coursePage * coursePageSize, totalCourseCount);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, debouncedSearchTerm, sortBy, pageSize]);

  // Reset course page when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setCoursePage(1);
    }
  }, [isModalOpen]);

  // Fetch universities function
  const fetchUniversities = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        pageIndex: (page - 1).toString(),
        pageSize: pageSize.toString(),
      });

      if (selectedCountry) queryParams.append('country', selectedCountry);
      if (debouncedSearchTerm) queryParams.append('search', debouncedSearchTerm);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const apiUrl = `${BASE_URL}/user-service/student/universities?${queryParams.toString()}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'API request failed');
      }

      const universitiesData = data.data || [];
      
      setUniversities(universitiesData as University[]);
      setTotalCount(data.count || universitiesData.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch universities';
      setError(errorMessage);
      setUniversities([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, debouncedSearchTerm, sortBy, pageSize]);

  // Fetch courses function
  const fetchCourses = useCallback(async (university: University, page: number = 1) => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);
      
      const queryParams = new URLSearchParams({
        pageIndex: page.toString(),
        pageSize: coursePageSize.toString(),
      });

      const response = await fetch(
        `${BASE_URL}/user-service/student/courses-mapped-to-university?${queryParams.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            countryName: university.country,
            university: university.universityName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'API request failed');
      }

      setCourses(data.data as Course[]);
      setTotalCourseCount(data.count || data.data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
      setCoursesError(errorMessage);
      setCourses([]);
      setTotalCourseCount(0);
    } finally {
      setCoursesLoading(false);
    }
  }, [coursePageSize]);

  useEffect(() => {
    fetchUniversities(currentPage);
  }, [fetchUniversities, currentPage]);

  useEffect(() => {
    if (selectedUniversity && isModalOpen) {
      fetchCourses(selectedUniversity, coursePage);
    }
  }, [fetchCourses, selectedUniversity, isModalOpen, coursePage]);

  // Get unique countries
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(universities.map((uni: University) => uni.country)))
      .filter((country: string) => country)
      .sort();
    return uniqueCountries;
  }, [universities]);

  // Country flags mapping
  const countryFlags: Record<string, string> = {
    'USA': '🇺🇸',
    'UK': '🇬🇧', 
    'CAN': '🇨🇦',
    'AUS': '🇦🇺',
    'GER': '🇩🇪',
    'FRA': '🇫🇷',
    'NLD': '🇳🇱',
    'SWE': '🇸🇪',
    'CHE': '🇨🇭',
    'JPN': '🇯🇵',
  };

  const getCountryName = (code: string) => {
    const names: Record<string, string> = {
      'USA': 'United States',
      'UK': 'United Kingdom',
      'CAN': 'Canada',
      'AUS': 'Australia',
      'GER': 'Germany',
      'FRA': 'France',
      'NLD': 'Netherlands',
      'SWE': 'Sweden',
      'CHE': 'Switzerland',
      'JPN': 'Japan',
    };
    return names[code] || code;
  };

  const clearFilters = () => {
    setSelectedCountry("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSortBy("name");
    setCurrentPage(1);
  };

  // Pagination handlers for universities
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Pagination handlers for courses
  const goToCoursePage = (page: number) => {
    if (page >= 1 && page <= totalCoursePages) {
      setCoursePage(page);
    }
  };

  const goToFirstCoursePage = () => goToCoursePage(1);
  const goToLastCoursePage = () => goToCoursePage(totalCoursePages);
  const goToNextCoursePage = () => goToCoursePage(coursePage + 1);
  const goToPrevCoursePage = () => goToCoursePage(coursePage - 1);

  // Generate page numbers for pagination
  const getPageNumbers = (total: number, current: number) => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  };

  // Handle View Programs click
  const handleViewPrograms = (e: React.MouseEvent, university: University) => {
    e.stopPropagation();
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  // Render university card
  const renderUniversityCard = (university: University) => (
    <div
      key={university.id}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
       onClick={(e) => handleViewPrograms(e, university)}
    >
      <div className="relative h-32 bg-gray-50 rounded-t-lg flex items-center justify-center p-4">
        {university.universityLogo ? (
          <img
            src={university.universityLogo}
            alt={`${university.universityName} logo`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}
        
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium shadow-sm">
          {countryFlags[university.country] || '🌍'} {university.country}
        </div>
        
        {university.isQSRanked && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            {university.ranking ? `#${university.ranking}` : 'QS'}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
          {university.universityName}
        </h3>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{university.universityCampusCity}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
            <span>{getCountryName(university.country)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Building className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{university.address}</span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
          onClick={(e) => handleViewPrograms(e, university)}
        >
          View Programs
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  // Render course card
  const renderCourseCard = (course: Course) => (
    <div
      key={course.courseName}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
        {course.courseName}
      </h3>
      <div className="space-y-1 text-xs text-gray-600">
        <div><span className="font-medium">Degree:</span> {course.degree}</div>
        <div><span className="font-medium">Tuition Fee (1st Year):</span> {course.tutionFee1styr}</div>
        <div><span className="font-medium">Application Fee:</span> {course.applicationFee}</div>
        <div><span className="font-medium">Intakes:</span> {course.intake}, {course.intake2}, {course.intake3}</div>
        {course.courseUrl && (
          <div>
            {/* <a
              href={course.courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn More
            </a> */}
          </div>
        )}
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedUniversity?.universityName} - Programs
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              {coursesLoading ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading programs...</p>
                </div>
              ) : coursesError ? (
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">{coursesError}</p>
                  <button
                    onClick={() => selectedUniversity && fetchCourses(selectedUniversity, coursePage)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No programs found for this university.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {courses.map((course) => renderCourseCard(course))}
                  </div>
                  {totalCoursePages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600">
                        Showing {courses.length > 0 ? courseStartIndex : 0} - {courseEndIndex} of {totalCourseCount} programs
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goToFirstCoursePage}
                          disabled={coursePage === 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="First page"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={goToPrevCoursePage}
                          disabled={coursePage === 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                          {getPageNumbers(totalCoursePages, coursePage).map((page, index) => (
                            <React.Fragment key={index}>
                              {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">...</span>
                              ) : (
                                <button
                                  onClick={() => goToCoursePage(page as number)}
                                  className={`px-3 py-2 rounded-lg border transition-colors ${
                                    coursePage === page
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <button
                          onClick={goToNextCoursePage}
                          disabled={coursePage === totalCoursePages}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={goToLastCoursePage}
                          disabled={coursePage === totalCoursePages}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Last page"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Universities</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {totalCount} universities available
                </p>
              </div>
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search universities..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              
              {(selectedCountry || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Countries</option>
                  {countries.map((country: string) => (
                    <option key={country} value={country}>
                      {countryFlags[country] || '🌍'} {getCountryName(country)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "country" | "ranking")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">University Name</option>
                  <option value="country">Country</option>
                  <option value="ranking">Ranking</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading && universities.length === 0 ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading universities...</p>
          </div>
        </div>
      ) : error && universities.length === 0 ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-6 rounded-lg shadow-sm max-w-md">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Universities</h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <button
              onClick={() => fetchUniversities(currentPage)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing {universities.length > 0 ? startIndex : 0} - {endIndex} of {totalCount} results
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {universities.length === 0 && !loading ? (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Universities Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {universities.map((university: University) => renderUniversityCard(university))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers(totalPages, currentPage).map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          ) : (
                            <button
                              onClick={() => goToPage(page as number)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUniversities;