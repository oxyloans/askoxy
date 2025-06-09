import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ChevronRight, ArrowLeft, Clock, DollarSign, GraduationCap, 
  Loader2, AlertCircle, X, Calendar, Award, BookOpen, University, 
  Crown, SlidersHorizontal, Filter, MapPin, ExternalLink, CreditCard, 
  ChevronLeft, Sparkles, Globe, Users, Target, TrendingUp, Info
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Course Interface based on updated API response
interface Course {
  courseName: string;
  duration: string;
  cost: string | null;
  typesOfExams: string | null;
  intake: string | null;
  university: string;
  degree?: string;
  tutionFee1styr?: string | null;
  applicationFee?: string | null;
  courseUrl?: string;
  intake2?: string | null;
  intake3?: string | null;
  universityCampusCity?: string;
  address?: string;
}

// Updated University Interface based on new API response (filtered fields)
interface UniversityData {
  universityName: string;
  country: string;
  address: string;
  universityLink: string;
  universityId: string;
  countryId: string;
  universityCampusCity: string;
  universityLogo: string;
}

interface UniversityApiResponse {
  universities: UniversityData[];
  totalUniversities: number;
}

interface ApiResponse {
  data: Course[];
  count: number;
}

interface LocationState {
  selectedCountry?: string | { countryName: string; countryCode: string; name: string; id: string };
  userRole?: string;
}

// Utility function to get access token from localStorage
const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error accessing token from storage:', error);
    return null;
  }
};

// Utility function to create axios config with auth headers
const createAuthConfig = () => {
  const token = getAccessToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};

// Utility function to handle auth errors
const handleAuthError = (error: any, navigate: any) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
    return true;
  }
  return false;
};

const CoursesPage: React.FC<{
  onCourseSelect?: (course: Course) => void
}> = ({ onCourseSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [selectedCostRange, setSelectedCostRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'duration' | 'university'>('name');
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCourses, setTotalCourses] = useState(0);

  const getCountryName = (country: string | { countryName: string; countryCode: string; name: string; id: string } | undefined): string => {
    if (!country) return 'Unknown Country';
    if (typeof country === 'string') return country;
    return country.countryName || country.name || 'Unknown Country';
  };

  const getCountryForAPI = (country: string | { countryName: string; countryCode: string; name: string; id: string } | undefined): string => {
    if (!country) return '';
    if (typeof country === 'string') return country;
    return country.countryName || country.name || '';
  };

  const formatCost = (cost: string | null | undefined): string => {
    if (!cost || cost === 'null' || cost === 'undefined' || cost.trim() === '') {
      return 'Contact for Price';
    }
    // Add currency formatting
    const numericCost = getNumericCost(cost);
    if (numericCost > 0) {
      return `$${numericCost.toLocaleString()}`;
    }
    return cost;
  };

  const shouldDisplayField = (field: string | null | undefined): boolean => {
    return field !== null && field !== undefined && field !== 'null' && field.trim() !== '' && field !== 'undefined';
  };

  const getAllIntakes = (course: Course): string[] => {
    const intakes: string[] = [];
    if (shouldDisplayField(course.intake)) intakes.push(course.intake!);
    if (shouldDisplayField(course.intake2)) intakes.push(course.intake2!);
    if (shouldDisplayField(course.intake3)) intakes.push(course.intake3!);
    return intakes;
  };

  const degreeTypes = ['All', ...Array.from(new Set(courses.map(course => {
    if (course.degree) return course.degree;
    const match = course.courseName.match(/\[(.*?)\]/);
    return match ? match[1] : 'Other';
  })))];

  const durations = ['All', ...Array.from(new Set(courses.map(course => course.duration || 'Not specified')))];
  
  const universities = ['All', ...Array.from(new Set(courses.map(course => course.university || 'Unknown University')))];

  const costRanges = [
    'All',
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $75,000',
    'Above $75,000',
    'Contact for Price'
  ];

  const getNumericCost = (costString: string): number => {
    if (!costString || costString === 'Contact for Price' || costString === 'null') return 0;
    const match = costString.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
  };

  const costInRange = (cost: string | null, range: string): boolean => {
    const formattedCost = formatCost(cost);
    if (formattedCost === 'Contact for Price') {
      return range === 'All' || range === 'Contact for Price';
    }
    
    const numericCost = getNumericCost(formattedCost);
    
    switch (range) {
      case 'Under $10,000':
        return numericCost > 0 && numericCost < 10000;
      case '$10,000 - $25,000':
        return numericCost >= 10000 && numericCost <= 25000;
      case '$25,000 - $50,000':
        return numericCost >= 25000 && numericCost <= 50000;
      case '$50,000 - $75,000':
        return numericCost >= 50000 && numericCost <= 75000;
      case 'Above $75,000':
        return numericCost > 75000;
      case 'Contact for Price':
        return formattedCost === 'Contact for Price';
      default:
        return true;
    }
  };

  const fetchCourses = async (page: number = 1) => {
    const countryName = getCountryForAPI(state?.selectedCountry);
    
    if (!countryName) {
      setError('No country selected. Please go back and select a country.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://meta.oxyloans.com/api/user-service/student/getCountryBasedData?pageIndex=${page}&pageSize=${pageSize}`,
        { countryName: countryName },
        createAuthConfig()
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      const apiResponse: ApiResponse = response.data;
      setCourses(apiResponse.data || []);
      setFilteredCourses(apiResponse.data || []);
      setTotalCourses(apiResponse.count || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      
      if (handleAuthError(err, navigate)) {
        return;
      }
      
      if (err.response?.status === 404) {
        setError(`No programs found for ${getCountryName(state?.selectedCountry)}. Try selecting a different country.`);
      } else if (err.response?.status === 500) {
        setError('Our servers are experiencing issues. Please try again in a few moments.');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Connection failed. Please check your internet and try again.');
      } else {
        setError('Unable to load programs. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const fetchUniversities = async (course: Course) => {
    if (!course?.courseName) {
      console.error('No course selected');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      return;
    }

    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center border border-purple-300';
    loadingToast.innerHTML = `
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      <span class="font-medium">🔍 Finding universities for you...</span>
    `;
    document.body.appendChild(loadingToast);

    try {
      const encodedCourseName = encodeURIComponent(course.courseName);
      const response = await axios.get(
        `https://meta.oxyloans.com/api/user-service/student/${encodedCourseName}/getCoursesBasedUniversities`,
        createAuthConfig()
      );
      
      const universityResponse: UniversityApiResponse = response.data;
      
      const cleanedUniversities = universityResponse.universities?.map(university => ({
        universityName: university.universityName,
        country: university.country,
        address: university.address,
        universityLink: university.universityLink,
        universityId: university.universityId,
        countryId: university.countryId,
        universityCampusCity: university.universityCampusCity,
        universityLogo: university.universityLogo
      })) || [];
      
      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }
      
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-green-300';
      const universityCount = universityResponse.totalUniversities || cleanedUniversities.length;
      const universityText = universityCount === 1 ? 'university' : 'universities';
      successToast.innerHTML = `
        <div class="flex items-center">
          <span class="text-lg mr-2">🎓</span>
          <span class="font-medium">Great! Found ${universityCount} amazing ${universityText}</span>
        </div>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => {
        if (successToast.parentNode) {
          document.body.removeChild(successToast);
        }
      }, 3000);
      
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universities: cleanedUniversities,
          totalUniversities: universityResponse.totalUniversities || cleanedUniversities.length,
          programName: getFieldOfStudy(course.courseName)
        } 
      });
      
    } catch (err: any) {
      console.error('Error fetching universities:', err);
      
      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }
      
      if (handleAuthError(err, navigate)) {
        return;
      }
      
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-red-300';
      
      let errorMessage = 'Oops! We couldn\'t load the universities right now.';
      let errorDetails = 'Please try again in a moment.';
      
      if (err.response?.status === 404) {
        errorMessage = 'No universities found';
        errorDetails = 'This program might not be available at any universities yet.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server is taking a break';
        errorDetails = 'Our servers are busy. Please try again in a few minutes.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Connection issue';
        errorDetails = 'Please check your internet connection and try again.';
      }
      
      errorToast.innerHTML = `
        <div>
          <div class="flex items-center mb-1">
            <span class="text-lg mr-2">⚠️</span>
            <span class="font-bold">${errorMessage}</span>
          </div>
          <div class="text-sm opacity-90">${errorDetails}</div>
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => {
        if (errorToast.parentNode) {
          document.body.removeChild(errorToast);
        }
      }, 5000);
      
      navigate('/listofuniversities', { 
        state: { 
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universityError: `${errorMessage}: ${errorDetails}`,
          universities: [],
          totalUniversities: 0,
          programName: getFieldOfStudy(course.courseName)
        } 
      });
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [state?.selectedCountry, currentPage]);

  useEffect(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.university.toLowerCase().includes(searchTerm.toLowerCase());
      
      const courseType = course.degree || 
                        (course.courseName.match(/\[(.*?)\]/) ? course.courseName.match(/\[(.*?)\]/)![1] : 'Other');
      const matchesDegree = selectedDegree === 'All' || courseType === selectedDegree;
      
      const matchesDuration = selectedDuration === 'All' || course.duration === selectedDuration;
      
      const matchesUniversity = selectedUniversity === 'All' || course.university === selectedUniversity;
      
      const matchesCostRange = selectedCostRange === 'All' || costInRange(course.cost, selectedCostRange);
      
      return matchesSearch && matchesDegree && matchesDuration && matchesUniversity && matchesCostRange;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.courseName.localeCompare(b.courseName);
        case 'cost':
          return getNumericCost(formatCost(a.cost)) - getNumericCost(formatCost(b.cost));
        case 'duration':
          const durationA = parseFloat((a.duration || '0').replace(/[^\d.]/g, ''));
          const durationB = parseFloat((b.duration || '0').replace(/[^\d.]/g, ''));
          return durationA - durationB;
        case 'university':
          return a.university.localeCompare(b.university);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
    setDisplayedCourses(filtered);
  }, [searchTerm, selectedDegree, selectedDuration, selectedUniversity, selectedCostRange, courses, sortBy]);

  const totalPages = Math.ceil(totalCourses / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchCourses(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCourseSelect = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    } else {
      fetchUniversities(course);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDegree('All');
    setSelectedDuration('All');
    setSelectedUniversity('All');
    setSelectedCostRange('All');
    setSortBy('name');
    setCurrentPage(1);
    fetchCourses(1);
  };

  const formatExamRequirements = (exams: string | null) => {
    if (!exams || !shouldDisplayField(exams)) return [];
    return exams.split('|').filter(exam => exam.trim());
  };

  const getDegreeType = (course: Course) => {
    if (course.degree) {
      return course.degree;
    }
    const match = course.courseName.match(/\[(.*?)\]/);
    return match ? match[1] : '';
  };

  const getFieldOfStudy = (courseName: string) => {
    return courseName.replace(/\[.*?\]/, '').trim();
  };

  const handleRetry = () => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login', { state: { message: 'Please log in to continue.' } });
      return;
    }
    fetchCourses(currentPage);
  };

  const handleCourseUrlClick = (url: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (url && shouldDisplayField(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const activeFiltersCount = [
    searchTerm !== '',
    selectedDegree !== 'All',
    selectedDuration !== 'All',
    selectedUniversity !== 'All',
    selectedCostRange !== 'All'
  ].filter(Boolean).length;

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, totalCourses)}</span> of <span className="font-semibold text-gray-900">{totalCourses.toLocaleString()}</span> results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };
  
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl animate-pulse">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Discovering Your Future
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Finding premium educational opportunities in<br />
              <span className="font-bold text-purple-700 block mt-2 text-xl">
                {getCountryName(state?.selectedCountry)}
              </span>
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex space-x-1 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 mr-3"></div>
              <div className="space-y-2">
                <div className="h-8 bg-purple-100 rounded w-80"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 animate-pulse">
            <div className="flex flex-wrap gap-3">
              <div className="w-64 h-10 bg-gray-200 rounded-lg"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-32 h-10 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 h-64 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-12 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-auto pt-4">
                    <div className="h-8 bg-purple-100 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-xl">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border-2 border-red-100 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={handleBackClick}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="mr-3 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                Study Programs in {getCountryName(state?.selectedCountry)}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover {totalCourses.toLocaleString()} amazing educational opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Pagination Top */}
        <PaginationComponent />

        {/* Search and Filter Section - All in one row */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search programs or universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              {degreeTypes.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              {universities.map(university => (
                <option key={university} value={university}>{university}</option>
              ))}
            </select>
            <select
              value={selectedCostRange}
              onChange={(e) => setSelectedCostRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              {costRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'cost' | 'duration' | 'university')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px]"
            >
              <option value="name">Sort by Name</option>
              <option value="cost">Sort by Cost</option>
              <option value="duration">Sort by Duration</option>
              <option value="university">Sort by University</option>
            </select>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {filteredCourses.length === totalCourses
              ? `Showing all ${filteredCourses.length.toLocaleString()} programs`
              : `Showing ${filteredCourses.length.toLocaleString()} of ${totalCourses.toLocaleString()} programs`
            }
          </p>
        </div>

        {/* Course Cards Grid */}
        {displayedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No programs found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedCourses.map((course, index) => (
              <div
                key={index}
                onClick={() => handleCourseSelect(course)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-purple-300 p-4"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      {getDegreeType(course) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                          <Award className="mr-1 h-3 w-3" />
                          {getDegreeType(course)}
                        </span>
                      )}
                      {shouldDisplayField(course.courseUrl) && (
                        <button
                          onClick={(e) => handleCourseUrlClick(course.courseUrl, e)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="View course details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
                      {getFieldOfStudy(course.courseName)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      <University className="mr-1 h-3 w-3" />
                      {course.university}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
                    {shouldDisplayField(course.duration) && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <Clock className="mr-1 h-3 w-3" />
                          Duration
                        </div>
                        <div className="text-xs font-semibold text-gray-800">{course.duration}</div>
                      </div>
                    )}
                    
                    {shouldDisplayField(course.universityCampusCity) && (
                      <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          Campus Location
                        </div>
                        <div className="text-xs font-semibold text-gray-800">{course.universityCampusCity}</div>
                      </div>
                    )}
                    
                    {getAllIntakes(course).length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          Intakes
                        </div>
                        <div className="text-xs font-semibold text-gray-800">
                          {getAllIntakes(course).join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {formatExamRequirements(course.typesOfExams).length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <BookOpen className="mr-1 h-3 w-3" />
                          Exams Required
                        </div>
                        <div className="text-xs font-semibold text-gray-800">
                          {formatExamRequirements(course.typesOfExams).join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {shouldDisplayField(course.applicationFee) && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <CreditCard className="mr-1 h-3 w-3" />
                          Application Fee
                        </div>
                        <div className="text-xs font-semibold text-gray-800">
                          {formatCost(course.applicationFee)}
                        </div>
                      </div>
                    )}
                    
                    {shouldDisplayField(course.tutionFee1styr) && course.tutionFee1styr !== course.cost && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <DollarSign className="mr-1 h-3 w-3" />
                          1st Year
                        </div>
                        <div className="text-xs font-semibold text-gray-800">
                          {formatCost(course.tutionFee1styr)}
                                                  </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between">
                      {shouldDisplayField(course.cost) && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm font-bold text-gray-800">
                            {formatCost(course.cost)}
                          </span>
                        </div>
                      )}
                      <button
                        className="ml-auto inline-flex items-center px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2.5 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        View Universities
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bottom */}
        <PaginationComponent />

        {/* Empty State for No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No programs match your search</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;