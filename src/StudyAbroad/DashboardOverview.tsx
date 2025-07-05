import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Globe,
  Building2,
  Calendar,
  DollarSign,
  Search,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Plus,
  Clock,
  X,
  ChevronRight,
  Loader2,
  Heart,
  Settings,
  RefreshCw,
  Save,
  BookOpen,
  Trash2,
} from "lucide-react";
import axios from "axios";

// API Interfaces
interface Country {
  countryName: string;
  countryCode: string;
  name: string;
  id: string;
}

interface Course {
  courseName: string;
  duration: string;
  cost: string | null;
  intake: string | null;
  university: string;
  degree?: string;
  universityCampusCity?: string;
}

interface CoursesApiResponse {
  data: Course[];
  count?: number;
}
interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

interface UniversityApiResponse {
  universities: University[];
  totalUniversities?: number;
}

interface University {
  universityName: string;
  country: string;
  address: string;
  universityId: string;
  countryId: string;
  universityCampusCity: string;
  universityLogo: string;
  universityLink?: string;
}

interface StudentPreferenceResponse {
  preferenceNumber: string;
  courseName: string;
  universityName: string;
  countryName: string;
  degree: string;
  duration: string;
  intake: string;
  userId: string;
  id: string;
  createdAt: string;
}

interface StudentPreference {
  countryId: string;
  countryName: string;
  courseName: string;
  degree: string;
  duration: string;
  intake: string;
  name: string;
  universityId: string;
  universityName: string;
  userId: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://meta.oxyloans.com/api/user-service',
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

const getUserId = (): string | null => {
  try {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId');
  } catch (error) {
    console.error('Error accessing user ID from storage:', error);
    return null;
  }
};

// Configure axios interceptor for token management
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  // State management
  const [countries, setCountries] = useState<Country[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [savedPreferences, setSavedPreferences] = useState<StudentPreferenceResponse[]>([]);
  
  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [deletingPreference, setDeletingPreference] = useState<string | null>(null);
  
  // Selection states
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  
  // UI states
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    let completed = 3; // Base completion (personal details, academic background, test scores)
    const total = 6;
    
    if (savedPreferences.length > 0) {
      completed += 3; // Country, course, university preferences
    }
    
    return Math.round((completed / total) * 100);
  };

  const progress = calculateProfileCompletion();

  // API Functions
  const fetchStudentPreferences = async () => {
    const token = getAccessToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError('Authentication required. Please log in.');
      setLoadingPreferences(false);
      return;
    }

    setLoadingPreferences(true);
    setError(null);

    try {
      console.log('Fetching student preferences for userId:', userId);
      const response = await apiClient.get<StudentPreferenceResponse[]>(
        '/student/getStudentPreferences',
        {
          params: { userId: userId }
        }
      );

      console.log('Student preferences response:', response.data);
      setSavedPreferences(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('Error fetching student preferences:', error);
      if (error.response?.status !== 404) {
        setError('Failed to load your preferences.');
      }
      setSavedPreferences([]);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const deleteStudentPreference = async (preferenceId: string) => {
    const token = getAccessToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError('Authentication required. Please log in.');
      return;
    }

    setDeletingPreference(preferenceId);
    setError(null);

    try {
      console.log('Deleting preference:', { preferenceId, userId });
      
      await apiClient.delete('/student/removeStudentPreference', {
        params: {
          preferenceId: preferenceId,
          userId: userId
        }
      });

      setSuccessMessage('Preference deleted successfully!');
      setShowDeleteConfirmation(null);
      
      // Refresh preferences list
      await fetchStudentPreferences();
      
    } catch (error: any) {
      console.error('Error deleting preference:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to delete preference. Please try again.');
    } finally {
      setDeletingPreference(null);
    }
  };

  const fetchCountries = async () => {
    const token = getAccessToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    setLoadingCountries(true);
    setError(null);
    
    try {
      console.log('Fetching countries...');
      const response = await apiClient.get('/student/getAll-countries');
      
      console.log('Countries response:', response.data);
      
      if (response.data?.countries) {
        // Ensure we're using the correct property names
        const processedCountries = response.data.countries.map((country: any) => ({
          countryName: country.countryName || country.name,
          countryCode: country.countryCode,
          name: country.name || country.countryName,
          id: country.id
        }));
        
        const sortedCountries = processedCountries
          .slice()
          .sort((a: Country, b: Country) => (a.name || a.countryName).localeCompare(b.name || b.countryName));
        
        setCountries(sortedCountries);
        console.log('Processed countries:', sortedCountries);
      }
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchCourses = async (countryName: string) => {
    if (!countryName) {
      setError("No country selected. Please go back and select a country.");
      setLoadingCourses(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
      setLoadingCourses(false);
      return;
    }

    setLoadingCourses(true);
    setError(null);

    try {
      console.log('Fetching courses for country:', countryName);
      
      // Use the full country name as requested
      const payload = {
        countryName: countryName  // Using full name like "Australia"
      };
      
      console.log('Courses API payload:', payload);
      
      const response = await apiClient.post<CoursesApiResponse>(
        '/student/getCountryBasedData?pageIndex=1&pageSize=100',
        payload
      );

      console.log('Courses response:', response.data);
      const apiResponse = response.data;
      const coursesData = apiResponse.data || [];
      
      setCourses(coursesData);
      console.log('Processed courses:', coursesData);
      
      if (coursesData.length === 0) {
        setError(`No programs found for ${countryName}. Try selecting a different country.`);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 404) {
        setError(`No programs found for ${countryName}. Try selecting a different country.`);
      } else if (err.response?.status === 500) {
        setError("Our servers are experiencing issues. Please try again in a few moments.");
      } else if (err.code === "NETWORK_ERROR") {
        setError("Connection failed. Please check your internet and try again.");
      } else {
        setError(`Unable to load programs for ${countryName}. Please try again or contact support.`);
      }
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchUniversities = async (courseName: string) => {
    if (!courseName) {
      console.error("No course selected");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
      return;
    }

    setLoadingUniversities(true);
    setError(null);

    try {
      console.log('Fetching universities for course:', courseName);
      const encodedCourseName = encodeURIComponent(courseName);
      const response = await apiClient.get<UniversityApiResponse>(
        `/student/${encodedCourseName}/getCoursesBasedUniversities`
      );

      console.log('Universities response:', response.data);
      const universityResponse = response.data;

      // Clean and process university data
      const cleanedUniversities = universityResponse.universities?.map((university) => ({
        universityName: university.universityName,
        country: university.country,
        address: university.address,
        universityId: university.universityId,
        countryId: university.countryId,
        universityCampusCity: university.universityCampusCity,
        universityLogo: university.universityLogo,
        universityLink: university.universityLink || '',
      })) || [];

      setUniversities(cleanedUniversities);
      console.log('Processed universities:', cleanedUniversities);
      
      if (cleanedUniversities.length === 0) {
        setError("No universities found for this program.");
      }
    } catch (err: any) {
      console.error("Error fetching universities:", err);
      console.error("Error response:", err.response?.data);

      let errorMessage = "Failed to load universities.";

      if (err.response?.status === 404) {
        errorMessage = "No universities found for this program.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server is experiencing issues. Please try again in a few minutes.";
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage = "Connection issue. Please check your internet connection and try again.";
      }

      setError(errorMessage);
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const savePreferences = async () => {
    const token = getAccessToken();
    const userId = getUserId();
    
    if (!token || !userId) {
      setError('Authentication required. Please log in.');
      return;
    }

    if (!selectedCountry || !selectedCourse || !selectedUniversity) {
      setError('Please select country, course, and university.');
      return;
    }

    setSavingPreferences(true);
    setError(null);
    
    try {
      const preferenceData: StudentPreference = {
        countryId: selectedCountry.id,
        countryName: selectedCountry.countryName || selectedCountry.name,
        courseName: selectedCourse.courseName,
        degree: selectedCourse.degree || '',
        duration: selectedCourse.duration,
        intake: selectedCourse.intake || '',
        name: selectedCountry.countryName || selectedCountry.name,
        universityId: selectedUniversity.universityId,
        universityName: selectedUniversity.universityName,
        userId: userId
      };

      console.log('Saving preferences:', preferenceData);

      await apiClient.patch('/student/student-preferences', preferenceData);

      setSuccessMessage('Preferences saved successfully!');
      setShowPreferenceModal(false);
      resetSelections();
      await fetchStudentPreferences();
      
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSavingPreferences(false);
    }
  };

  // Helper functions
  const resetSelections = () => {
    setSelectedCountry(null);
    setSelectedCourse(null);
    setSelectedUniversity(null);
    setCurrentStep(1);
    setCountrySearch('');
    setCourseSearch('');
    setUniversitySearch('');
  };

  const openPreferenceModal = () => {
    setShowPreferenceModal(true);
    resetSelections();
    if (countries.length === 0) {
      fetchCountries();
    }
  };

  const closePreferenceModal = () => {
    setShowPreferenceModal(false);
    resetSelections();
    setError(null);
  };

  const handleDeleteClick = (preferenceId: string) => {
    setShowDeleteConfirmation(preferenceId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirmation) {
      deleteStudentPreference(showDeleteConfirmation);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };

  // Event handlers
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setCurrentStep(2);
    // Use the full country name
    const countryName = country.countryName || country.name;
    console.log('Selected country:', countryName);
    fetchCourses(countryName);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentStep(3);
    fetchUniversities(course.courseName);
  };

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
  };

  // Filter functions
  const filteredCountries = countries.filter(country =>
    (country.name || country.countryName).toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredUniversities = universities.filter(university =>
    university.universityName.toLowerCase().includes(universitySearch.toLowerCase()) ||
    university.universityCampusCity.toLowerCase().includes(universitySearch.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchStudentPreferences();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Get unique data from preferences
  const uniqueCountries = Array.from(new Set(savedPreferences.map(pref => pref.countryName)));
  const uniqueCourses = Array.from(new Set(savedPreferences.map(pref => pref.courseName)));
  const uniqueUniversities = Array.from(new Set(savedPreferences.map(pref => pref.universityName)));

  const kpiCards = [
    {
      title: "Countries Available",
      value: countries.length.toString(),
      subtitle: "Study destinations worldwide",
      icon: Globe,
      color: "from-blue-500 to-blue-600",
      onClick: () => onNavigate?.('courses'),
    },
    {
    title: "Saved Preferences",
    value: savedPreferences.length.toString(),
    subtitle: `${uniqueCountries.length} countries selected`,
    icon: Heart,
    color: "from-purple-500 to-purple-600",
    onClick: () => setShowPreferenceModal(true), // ✅ opens modal
  },
    {
      title: "Course Options",
      value: courses.length.toString(),
      subtitle: courses.length > 0 ? "Available in selected country" : "Select country to view",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      onClick: () => onNavigate?.('courses'),
    },
    {
      title: "Universities",
      value: universities.length.toString(),
      subtitle: universities.length > 0 ? "Ready for applications" : "Select course to view",
      icon: Building2,
      color: "from-orange-500 to-orange-600",
      onClick: () => onNavigate?.('universities'),
    },
  ];

  // Profile completion items
  const profileItems = [
    { label: "Personal Details", done: true },
    { label: "Academic Background", done: true },
    { label: "Test Scores", done: true },
    { label: "Study Preferences", done: savedPreferences.length > 0 },
    { label: "Course Selection", done: savedPreferences.some(p => p.courseName) },
    { label: "University Choice", done: savedPreferences.some(p => p.universityName) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Preference</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this study preference? This will permanently remove it from your saved preferences.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingPreference === showDeleteConfirmation}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deletingPreference === showDeleteConfirmation ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Profile Completion Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" strokeWidth="2" />
                    <circle
                      cx="18" cy="18" r="15.9155" fill="none" stroke="url(#grad)" strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 15.9155} ${2 * Math.PI * 15.9155}`}
                      strokeDashoffset={2 * Math.PI * 15.9155 * (1 - progress / 100)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{progress}%</span>
                    <span className="text-xs text-purple-600 font-medium">Complete</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Profile Strength</h3>
              </div>

              <div className="space-y-3 mb-6">
                {profileItems.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between p-3 rounded-lg ${
                    item.done ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                  }`}>
                    <div className="flex items-center">
                      {item.done ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    {item.done && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">✓</span>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={openPreferenceModal}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Set Preferences
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {kpiCards.map((card, index) => (
      <div 
        key={index} 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={card.onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
        <p className="text-sm text-gray-600">{card.subtitle}</p>
      </div>
    ))}
  </div>

            {/* Saved Preferences */}
            {loadingPreferences ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your preferences...</p>
              </div>
            ) : savedPreferences.length > 0 ? (
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Your Study Preferences</h3>
                      <p className="text-purple-100">
                        {savedPreferences.length} preference{savedPreferences.length > 1 ? 's' : ''} saved
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Globe className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium opacity-80">COUNTRIES</div>
                      <div className="text-lg font-bold">{uniqueCountries.length}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium opacity-80">COURSES</div>
                      <div className="text-lg font-bold">{uniqueCourses.length}</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <Building2 className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium opacity-80">UNIVERSITIES</div>
                      <div className="text-lg font-bold">{uniqueUniversities.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Preferences Saved</h3>
                <p className="text-gray-600 mb-6">Start by setting your study abroad preferences</p>
                <button 
                  onClick={openPreferenceModal}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
                >
                  Set Preferences Now
                </button>
              </div>
            )}

            {/* Preferences List */}
            {savedPreferences.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Your Saved Preferences</h3>
                  <button 
                    onClick={openPreferenceModal}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  {savedPreferences.map((preference) => (
                    <div key={preference.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{preference.courseName}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2 text-blue-600" />
                              <span>{preference.countryName}</span>
                            </div>
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                              <span className="truncate">{preference.universityName}</span>
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-2 text-green-600" />
                              <span>{preference.degree}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-orange-600" />
                              <span>{preference.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500">
                            #{preference.preferenceNumber}
                          </div>
                          <button
                            onClick={() => handleDeleteClick(preference.id)}
                            disabled={deletingPreference === preference.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete preference"
                          >
                            {deletingPreference === preference.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preference Modal */}
      {showPreferenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Set Your Study Preferences</h2>
                  <p className="text-gray-600 mt-1">Step {currentStep} of 3: Choose your study destination and program</p>
                </div>
                <button
                  onClick={closePreferenceModal}
                  className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step <= currentStep 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    <div className={`ml-2 text-sm font-medium ${
                      step <= currentStep ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {step === 1 ? 'Country' : step === 2 ? 'Course' : 'University'}
                    </div>
                    {step < 3 && (
                      <ChevronRight className={`ml-2 h-4 w-4 ${
                        step < currentStep ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Step 1: Country Selection */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Study Destination</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {loadingCountries ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="ml-2 text-gray-600">Loading countries...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <div
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedCountry?.id === country.id
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">{country.name || country.countryName}</h4>
                              <p className="text-sm text-gray-600">{country.countryCode}</p>
                            </div>
                            {selectedCountry?.id === country.id && (
                              <CheckCircle className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Course Selection */}
              {currentStep === 2 && selectedCountry && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Select Your Course in {selectedCountry.name || selectedCountry.countryName}
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {loadingCourses ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="ml-2 text-gray-600">Loading courses...</span>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredCourses.map((course, index) => (
                        <div
                          key={`${course.courseName}-${index}`}
                          onClick={() => handleCourseSelect(course)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedCourse?.courseName === course.courseName
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-2">{course.courseName}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {course.duration}
                                </span>
                                {course.cost && (
                                  <span className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    {course.cost}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <Building2 className="h-4 w-4 mr-2" />
                                  {course.university}
                                </span>
                              </div>
                              {course.intake && (
                                <div className="mt-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Intake: {course.intake}
                                  </span>
                                </div>
                              )}
                            </div>
                            {selectedCourse?.courseName === course.courseName && (
                              <CheckCircle className="h-5 w-5 text-purple-600 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Countries
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: University Selection */}
              {currentStep === 3 && selectedCourse && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Your University</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      For: {selectedCourse.courseName.length > 60 ? 
                        `${selectedCourse.courseName.substring(0, 60)}...` : 
                        selectedCourse.courseName}
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search universities..."
                        value={universitySearch}
                        onChange={(e) => setUniversitySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {loadingUniversities ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="ml-2 text-gray-600">Loading universities...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {filteredUniversities.map((university) => (
                        <div
                          key={university.universityId}
                          onClick={() => handleUniversitySelect(university)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedUniversity?.universityId === university.universityId
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start mb-2">
                                {university.universityLogo && (
                                  <img 
                                    src={university.universityLogo} 
                                    alt={`${university.universityName} Logo`}
                                    className="h-8 w-8 object-contain mr-2"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                  />
                                )}
                                <h4 className="font-semibold text-gray-800">{university.universityName}</h4>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{university.universityCampusCity}</span>
                                </div>
                                <div className="flex items-center">
                                  <Globe className="h-4 w-4 mr-2" />
                                  <span>{university.country}</span>
                                </div>
                              </div>
                            </div>
                            {selectedUniversity?.universityId === university.universityId && (
                              <CheckCircle className="h-5 w-5 text-purple-600 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Courses
                    </button>
                    <button
                      onClick={savePreferences}
                      disabled={!selectedUniversity || savingPreferences}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {savingPreferences ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;