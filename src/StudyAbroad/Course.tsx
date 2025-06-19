import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Clock,
  DollarSign,
  GraduationCap,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  Award,
  BookOpen,
  University,
  Crown,
  SlidersHorizontal,
  Filter,
  MapPin,
  ExternalLink,
  CreditCard,
  ChevronLeft,
  Sparkles,
  Globe,
  Users,
  Target,
  TrendingUp,
  Info,
  CheckCircle,
  Send,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
  selectedCountry?:
    | string
    | { countryName: string; countryCode: string; name: string; id: string };
  userRole?: string;
}

// Application Request Interface
interface ApplicationRequest {
  courseName: string;
  intakeMonth: string;
  intakeYear: string;
  remarks: string;
  universityName: string;
  userId: string;
}

// Application Response Interfaces
interface ApplicationResponse200 {
  address: string;
  applicationFee: string;
  applicationId: string;
  cost: string;
  country: string;
  courseName: string;
  courseUrl: string;
  degree: string;
  duration: string;
  intake: string;
  intake2: string;
  intake3: string;
  intakeMonth: string;
  intakeYear: string;
  message: string;
  tutionFee1styr: string;
  typesOfExams: string;
  universityCampusCity: string;
  universityLink: string;
  universityLogo: string;
  universityName: string;
}

interface ApplicationResponse201 {
  message: string;
  universityLink: string | null;
  courseName: string | null;
  duration: string | null;
  typesOfExams: string | null;
  cost: string | null;
  universityName: string | null;
  applicationId: string | null;
  intakeMonth: string | null;
  intakeYear: string | null;
  country: string | null;
  degree: string | null;
  tutionFee1styr: string | null;
  applicationFee: string | null;
  courseUrl: string | null;
  intake2: string | null;
  intake: string | null;
  intake3: string | null;
  universityLogo: string | null;
  address: string | null;
  universityCampusCity: string | null;
}

// Utility function to get access token from localStorage
const getAccessToken = (): string | null => {
  try {
    return (
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    );
  } catch (error) {
    console.error("Error accessing token from storage:", error);
    return null;
  }
};

// Utility function to get user ID from localStorage
const getUserId = (): string | null => {
  try {
    return localStorage.getItem("userId") || sessionStorage.getItem("userId");
  } catch (error) {
    console.error("Error accessing user ID from storage:", error);
    return null;
  }
};

// Utility function to create axios config with auth headers
const createAuthConfig = () => {
  const token = getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Utility function to handle auth errors
const handleAuthError = (error: any, navigate: any) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    navigate("/login", {
      state: { message: "Session expired. Please log in again." },
    });
    return true;
  }
  return false;
};

const CoursesPage: React.FC<{
  onCourseSelect?: (course: Course) => void;
}> = ({ onCourseSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
  const [selectedCostRange, setSelectedCostRange] = useState<string>("All");
  const [sortBy, setSortBy] = useState<
    "name" | "cost" | "duration" | "university"
  >("name");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCourses, setTotalCourses] = useState(0);

  // Application Modal States
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCourseForApplication, setSelectedCourseForApplication] =
    useState<Course | null>(null);
  const [applicationData, setApplicationData] = useState({
    intakeMonth: "",
    intakeYear: "",
    remarks: "",
  });
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationResponse, setApplicationResponse] = useState<
    ApplicationResponse200 | ApplicationResponse201 | null
  >(null);

  const getCountryName = (
    country:
      | string
      | { countryName: string; countryCode: string; name: string; id: string }
      | undefined
  ): string => {
    if (!country) return "Unknown Country";
    if (typeof country === "string") return country;
    return country.countryName || country.name || "Unknown Country";
  };

  const getCountryForAPI = (
    country:
      | string
      | { countryName: string; countryCode: string; name: string; id: string }
      | undefined
  ): string => {
    if (!country) return "";
    if (typeof country === "string") return country;
    return country.countryName || country.name || "";
  };

  const formatCost = (cost: string | null | undefined): string => {
    if (
      !cost ||
      cost === "null" ||
      cost === "undefined" ||
      cost.trim() === ""
    ) {
      return "Contact for Price";
    }
    // Add currency formatting
    const numericCost = getNumericCost(cost);
    if (numericCost > 0) {
      return `$${numericCost.toLocaleString()}`;
    }
    return cost;
  };

  const shouldDisplayField = (field: string | null | undefined): boolean => {
    return (
      field !== null &&
      field !== undefined &&
      field !== "null" &&
      field.trim() !== "" &&
      field !== "undefined"
    );
  };

  const getAllIntakes = (course: Course): string[] => {
    const intakes: string[] = [];
    if (shouldDisplayField(course.intake)) intakes.push(course.intake!);
    if (shouldDisplayField(course.intake2)) intakes.push(course.intake2!);
    if (shouldDisplayField(course.intake3)) intakes.push(course.intake3!);
    return intakes;
  };

  const degreeTypes = [
    "All",
    ...Array.from(
      new Set(
        courses.map((course) => {
          if (course.degree) return course.degree;
          const match = course.courseName.match(/\[(.*?)\]/);
          return match ? match[1] : "Other";
        })
      )
    ),
  ];

  const durations = [
    "All",
    ...Array.from(
      new Set(courses.map((course) => course.duration || "Not specified"))
    ),
  ];

  const universities = [
    "All",
    ...Array.from(
      new Set(
        courses.map((course) => course.university || "Unknown University")
      )
    ),
  ];

  const costRanges = [
    "All",
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $75,000",
    "Above $75,000",
    "Contact for Price",
  ];

  const getNumericCost = (costString: string): number => {
    if (
      !costString ||
      costString === "Contact for Price" ||
      costString === "null"
    )
      return 0;
    const match = costString.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
  };

  const costInRange = (cost: string | null, range: string): boolean => {
    const formattedCost = formatCost(cost);
    if (formattedCost === "Contact for Price") {
      return range === "All" || range === "Contact for Price";
    }

    const numericCost = getNumericCost(formattedCost);

    switch (range) {
      case "Under $10,000":
        return numericCost > 0 && numericCost < 10000;
      case "$10,000 - $25,000":
        return numericCost >= 10000 && numericCost <= 25000;
      case "$25,000 - $50,000":
        return numericCost >= 25000 && numericCost <= 50000;
      case "$50,000 - $75,000":
        return numericCost >= 50000 && numericCost <= 75000;
      case "Above $75,000":
        return numericCost > 75000;
      case "Contact for Price":
        return formattedCost === "Contact for Price";
      default:
        return true;
    }
  };

  const fetchCourses = async (page: number = 1) => {
    const countryName = getCountryForAPI(state?.selectedCountry);

    if (!countryName) {
      setError("No country selected. Please go back and select a country.");
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
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

      await new Promise((resolve) => setTimeout(resolve, 800));

      const apiResponse: ApiResponse = response.data;
      setCourses(apiResponse.data || []);
      setFilteredCourses(apiResponse.data || []);
      setTotalCourses(apiResponse.count || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error fetching courses:", err);

      if (handleAuthError(err, navigate)) {
        return;
      }

      if (err.response?.status === 404) {
        setError(
          `No programs found for ${getCountryName(
            state?.selectedCountry
          )}. Try selecting a different country.`
        );
      } else if (err.response?.status === 500) {
        setError(
          "Our servers are experiencing issues. Please try again in a few moments."
        );
      } else if (err.code === "NETWORK_ERROR") {
        setError(
          "Connection failed. Please check your internet and try again."
        );
      } else {
        setError(
          "Unable to load programs. Please try again or contact support."
        );
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const fetchUniversities = async (course: Course) => {
    if (!course?.courseName) {
      console.error("No course selected");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
      return;
    }

    const loadingToast = document.createElement("div");
    document.body.appendChild(loadingToast);

    try {
      const encodedCourseName = encodeURIComponent(course.courseName);
      const response = await axios.get(
        `https://meta.oxyloans.com/api/user-service/student/${encodedCourseName}/getCoursesBasedUniversities`,
        createAuthConfig()
      );

      const universityResponse: UniversityApiResponse = response.data;

      const cleanedUniversities =
        universityResponse.universities?.map((university) => ({
          universityName: university.universityName,
          country: university.country,
          address: university.address,
          universityLink: university.universityLink,
          universityId: university.universityId,
          countryId: university.countryId,
          universityCampusCity: university.universityCampusCity,
          universityLogo: university.universityLogo,
        })) || [];

      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }

      const successToast = document.createElement("div");
      successToast.className =
        "fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-green-300";
      const universityCount =
        universityResponse.totalUniversities || cleanedUniversities.length;
      const universityText =
        universityCount === 1 ? "university" : "universities";
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

      navigate("/listofuniversities", {
        state: {
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universities: cleanedUniversities,
          totalUniversities:
            universityResponse.totalUniversities || cleanedUniversities.length,
          programName: getFieldOfStudy(course.courseName),
        },
      });
    } catch (err: any) {
      console.error("Error fetching universities:", err);

      if (loadingToast.parentNode) {
        document.body.removeChild(loadingToast);
      }

      if (handleAuthError(err, navigate)) {
        return;
      }

      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 border border-red-300";

      let errorMessage = "Oops! We couldn't load the universities right now.";
      let errorDetails = "Please try again in a moment.";

      if (err.response?.status === 404) {
        errorMessage = "No universities found";
        errorDetails =
          "This program might not be available at any universities yet.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server is taking a break";
        errorDetails =
          "Our servers are busy. Please try again in a few minutes.";
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage = "Connection issue";
        errorDetails = "Please check your internet connection and try again.";
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

      navigate("/listofuniversities", {
        state: {
          course,
          selectedCountry: getCountryName(state?.selectedCountry),
          universityError: `${errorMessage}: ${errorDetails}`,
          universities: [],
          totalUniversities: 0,
          programName: getFieldOfStudy(course.courseName),
        },
      });
    }
  };

  // Application submission function
  const submitApplication = async () => {
    if (!selectedCourseForApplication) return;

    const userId = getUserId();
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
      return;
    }

    setIsSubmittingApplication(true);

    const requestData: ApplicationRequest = {
      courseName: selectedCourseForApplication.courseName,
      intakeMonth: applicationData.intakeMonth,
      intakeYear: applicationData.intakeYear,
      remarks: applicationData.remarks,
      universityName: selectedCourseForApplication.university,
      userId: userId,
    };

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/user-service/student/add-application",
        requestData,
        createAuthConfig()
      );

      // Handle both 200 and 201 responses
      if (response.status === 200 || response.status === 201) {
        setApplicationResponse(response.data);
        setApplicationSuccess(true);

        // Reset form
        setApplicationData({
          intakeMonth: "",
          intakeYear: "",
          remarks: "",
        });
      }
    } catch (err: any) {
      console.error("Error submitting application:", err);

      if (handleAuthError(err, navigate)) {
        return;
      }

      let errorMessage = "Failed to submit application. Please try again.";
      if (err.response?.status === 400) {
        errorMessage = "Invalid application data. Please check your inputs.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  // Open application modal
  const openApplicationModal = (course: Course) => {
    setSelectedCourseForApplication(course);
    setShowApplicationModal(true);
    setApplicationSuccess(false);
    setApplicationResponse(null);
  };

  // Close application modal
  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedCourseForApplication(null);
    setApplicationData({
      intakeMonth: "",
      intakeYear: "",
      remarks: "",
    });
    setApplicationSuccess(false);
    setApplicationResponse(null);
    setError(null);
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [state?.selectedCountry, currentPage]);

  useEffect(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.university.toLowerCase().includes(searchTerm.toLowerCase());

      const courseType =
        course.degree ||
        (course.courseName.match(/\[(.*?)\]/)
          ? course.courseName.match(/\[(.*?)\]/)![1]
          : "Other");
      const matchesDegree =
        selectedDegree === "All" || courseType === selectedDegree;

      const matchesDuration =
        selectedDuration === "All" || course.duration === selectedDuration;

      const matchesUniversity =
        selectedUniversity === "All" ||
        course.university === selectedUniversity;

      const matchesCostRange =
        selectedCostRange === "All" ||
        costInRange(course.cost, selectedCostRange);

      return (
        matchesSearch &&
        matchesDegree &&
        matchesDuration &&
        matchesUniversity &&
        matchesCostRange
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.courseName.localeCompare(b.courseName);
        case "cost":
          return (
            getNumericCost(formatCost(a.cost)) -
            getNumericCost(formatCost(b.cost))
          );
        case "duration":
          const durationA = parseFloat(
            (a.duration || "0").replace(/[^\d.]/g, "")
          );
          const durationB = parseFloat(
            (b.duration || "0").replace(/[^\d.]/g, "")
          );
          return durationA - durationB;
        case "university":
          return a.university.localeCompare(b.university);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
    setDisplayedCourses(filtered);
  }, [
    searchTerm,
    selectedDegree,
    selectedDuration,
    selectedUniversity,
    selectedCostRange,
    courses,
    sortBy,
  ]);

  const totalPages = Math.ceil(totalCourses / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchCourses(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    setSearchTerm("");
    setSelectedDegree("All");
    setSelectedDuration("All");
    setSelectedUniversity("All");
    setSelectedCostRange("All");
    setSortBy("name");
    setCurrentPage(1);
    fetchCourses(1);
  };

  const formatExamRequirements = (exams: string | null) => {
    if (!exams || !shouldDisplayField(exams)) return [];
    return exams.split("|").filter((exam) => exam.trim());
  };

  const getDegreeType = (course: Course) => {
    if (course.degree) {
      return course.degree;
    }
    const match = course.courseName.match(/\[(.*?)\]/);
    return match ? match[1] : "";
  };

  const getFieldOfStudy = (courseName: string) => {
    return courseName.replace(/\[.*?\]/, "").trim();
  };

  const handleRetry = () => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login", { state: { message: "Please log in to continue." } });
      return;
    }
    fetchCourses(currentPage);
  };

  const handleCourseUrlClick = (
    url: string | undefined,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (url && shouldDisplayField(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const activeFiltersCount = [
    searchTerm !== "",
    selectedDegree !== "All",
    selectedDuration !== "All",
    selectedUniversity !== "All",
    selectedCostRange !== "All",
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
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalCourses)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {totalCourses.toLocaleString()}
          </span>{" "}
          results
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
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                        : "border border-gray-300 hover:bg-gray-50"
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

  // Generate years for intake dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

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
              Finding premium educational opportunities in
              <br />
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
                  className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-xl">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={handleBackClick}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300 border border-gray-200"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                  Study Programs
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {getCountryName(state?.selectedCountry)}
                  <span className="text-purple-600 font-semibold">
                    • {totalCourses.toLocaleString()} programs found
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {/* Search and Sort */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search programs or universities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="name">Sort by Name</option>
                  <option value="cost">Sort by Cost</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="university">Sort by University</option>
                </select>
              </div>

              {/* Filter Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  {degreeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Degree Types" : type}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration === "All" ? "All Durations" : duration}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  {universities.slice(0, 50).map((university) => (
                    <option key={university} value={university}>
                      {university === "All" ? "All Universities" : university}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCostRange}
                  onChange={(e) => setSelectedCostRange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  {costRanges.map((range) => (
                    <option key={range} value={range}>
                      {range === "All" ? "All Price Ranges" : range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            </div>
            <p className="text-gray-600">Loading programs...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                <Search className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No programs found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more
              results.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>
                  Showing {filteredCourses.length} of{" "}
                  {totalCourses.toLocaleString()} programs
                  {activeFiltersCount > 0 &&
                    ` (${activeFiltersCount} filter${
                      activeFiltersCount > 1 ? "s" : ""
                    } applied)`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>Updated daily</span>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {displayedCourses.map((course, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col group-hover:scale-[1.02]">
                    {/* Course Header */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {getDegreeType(course) && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-xs font-bold mb-3">
                              <Crown className="h-3 w-3" />
                              {getDegreeType(course)}
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-purple-700 transition-colors duration-300">
                            {getFieldOfStudy(course.courseName)}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                            <University className="h-4 w-4" />
                            {course.university}
                          </p>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-gray-700">
                            {shouldDisplayField(course.duration)
                              ? course.duration
                              : "Duration not specified"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            {formatCost(course.cost)}
                          </span>
                        </div>

                        {shouldDisplayField(course.universityCampusCity) && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <span className="text-gray-700">
                              {course.universityCampusCity}
                            </span>
                          </div>
                        )}

                        {formatExamRequirements(course.typesOfExams).length >
                          0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-700">
                                Requirements:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {formatExamRequirements(course.typesOfExams)
                                .slice(0, 3)
                                .map((exam, examIndex) => (
                                  <span
                                    key={examIndex}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-200"
                                  >
                                    {exam.trim()}
                                  </span>
                                ))}
                              {formatExamRequirements(course.typesOfExams)
                                .length > 3 && (
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200">
                                  +
                                  {formatExamRequirements(course.typesOfExams)
                                    .length - 3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {getAllIntakes(course).length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-700">
                                Intakes:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {getAllIntakes(course)
                                .slice(0, 2)
                                .map((intake, intakeIndex) => (
                                  <span
                                    key={intakeIndex}
                                    className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200"
                                  >
                                    {intake}
                                  </span>
                                ))}
                              {getAllIntakes(course).length > 2 && (
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200">
                                  +{getAllIntakes(course).length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                      <button
                        onClick={() => handleCourseSelect(course)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        View Universities
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openApplicationModal(course)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PaginationComponent />
          </>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedCourseForApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply for Program
                </h2>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {!applicationSuccess ? (
                <>
                  {/* Course Info */}
                  <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-2">
                      {getFieldOfStudy(selectedCourseForApplication.courseName)}
                    </h3>
                    <p className="text-sm text-purple-700 flex items-center gap-1">
                      <University className="h-4 w-4" />
                      {selectedCourseForApplication.university}
                    </p>
                  </div>

                  {/* Application Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Intake Month *
                      </label>
                      <select
                        value={applicationData.intakeMonth}
                        onChange={(e) =>
                          setApplicationData((prev) => ({
                            ...prev,
                            intakeMonth: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="">Select Month</option>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Intake Year *
                      </label>
                      <select
                        value={applicationData.intakeYear}
                        onChange={(e) =>
                          setApplicationData((prev) => ({
                            ...prev,
                            intakeYear: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        value={applicationData.remarks}
                        onChange={(e) =>
                          setApplicationData((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                          }))
                        }
                        placeholder="Any specific requirements or questions..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeApplicationModal}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={
                        isSubmittingApplication ||
                        !applicationData.intakeMonth ||
                        !applicationData.intakeYear
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingApplication ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // Success State
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your application has been successfully submitted. You'll
                    receive confirmation details shortly.
                  </p>

                  {applicationResponse && (
                    <div className="bg-green-50 rounded-xl p-4 mb-6 text-left border border-green-200">
                      <div className="space-y-2 text-sm">
                        {applicationResponse.applicationId && (
                          <p>
                            <span className="font-semibold">
                              Application ID:
                            </span>{" "}
                            {applicationResponse.applicationId}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold">Program:</span>{" "}
                          {applicationResponse.courseName ||
                            selectedCourseForApplication.courseName}
                        </p>
                        <p>
                          <span className="font-semibold">University:</span>{" "}
                          {applicationResponse.universityName ||
                            selectedCourseForApplication.university}
                        </p>
                        {applicationResponse.intakeMonth &&
                          applicationResponse.intakeYear && (
                            <p>
                              <span className="font-semibold">Intake:</span>{" "}
                              {applicationResponse.intakeMonth}{" "}
                              {applicationResponse.intakeYear}
                            </p>
                          )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={closeApplicationModal}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
