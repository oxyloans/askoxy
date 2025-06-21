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

// Country Interface
interface Country {
  countryName: string;
  id: string;
  countryCode: string;
  name: string;
}

// Countries API Response Interface
interface CountriesResponse {
  countries: Country[];
  totalCountries: number;
}

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

  // Country Selection States
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [showCountrySelection, setShowCountrySelection] = useState(true);

  // Course States
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
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
  const [pageSize] = useState(60);
  const [totalCourses, setTotalCourses] = useState(0);

  // Application Modal States
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCourseForApplication, setSelectedCourseForApplication] =
    useState<Course | null>(null);
  const [applicationData, setApplicationData] = useState({
    intake: "",
    intakeYear: "",
    remarks: "",
  });
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationResponse, setApplicationResponse] = useState<
    ApplicationResponse200 | ApplicationResponse201 | null
  >(null);

  // Fetch countries from API with authentication
  const fetchCountries = async () => {
    const token = getAccessToken();
    if (!token) {
      setError("Authentication required. Please log in to continue.");
      setAuthRequired(true);
      setCountriesLoading(false);
      return;
    }

    setCountriesLoading(true);
    setError(null);

    try {
      const response = await axios.get<CountriesResponse>(
        "https://meta.oxyloans.com/api/user-service/student/getAll-countries",
        createAuthConfig()
      );

      if (response.data && response.data.countries) {
        const countriesData = response.data.countries;
        const sortedCountries = [...countriesData].sort(
          (a: Country, b: Country) => a.countryName.localeCompare(b.countryName)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setAuthRequired(false);

        // Check if country was passed in state
        if (state?.selectedCountry) {
          const existingCountry = sortedCountries.find(
            (country) =>
              country.countryName === getCountryName(state.selectedCountry) ||
              country.name === getCountryName(state.selectedCountry)
          );
          if (existingCountry) {
            setSelectedCountry(existingCountry);
            setShowCountrySelection(false);
            setInitialLoad(true);
          }
        }
      } else {
        setError("No countries data received from server.");
      }
    } catch (error: any) {
      console.error("Error fetching countries:", error);

      if (handleAuthError(error, navigate)) {
        return;
      }

      if (error.response?.status === 404) {
        setError("Countries data not found.");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          `Failed to load countries: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
      }
    } finally {
      setCountriesLoading(false);
    }
  };

  // Filter countries based on search term
  useEffect(() => {
    if (countrySearchTerm) {
      const filtered = countries.filter(
        (country) =>
          country.countryName
            .toLowerCase()
            .includes(countrySearchTerm.toLowerCase()) ||
          country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearchTerm, countries]);

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountrySelection(false);
    setInitialLoad(true);
    setCurrentPage(1);
  };

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

  const getCountryForAPI = (country: Country | null): string => {
    if (!country) return "";
    return country.countryName || "";
  };

  // Updated formatCost function to show country-based pricing
  const formatCost = (cost: string | null | undefined): string => {
    if (
      !cost ||
      cost === "null" ||
      cost === "undefined" ||
      cost.trim() === ""
    ) {
      return "Price varies by country";
    }
    return cost;
  };

  // Updated formatApplicationFee function
  const formatApplicationFee = (fee: string | null | undefined): string => {
    if (!fee || fee === "null" || fee === "undefined" || fee.trim() === "") {
      return "Fee varies by country";
    }
    return fee;
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

  // Extract intake options for application modal
  const getIntakeOptions = (course: Course) => {
    const allIntakes = getAllIntakes(course);
    return allIntakes.map((intake) => {
      // Extract month and year from intake string like "Sep -25"
      const parts = intake.split(/[-\s]+/);
      if (parts.length >= 2) {
        const month = parts[0].trim();
        const year = parts[1].trim();
        // Convert 2-digit year to full year
        const fullYear = year.length === 2 ? `20${year}` : year;
        return {
          display: intake,
          month: month,
          year: fullYear,
          value: intake,
        };
      }
      return {
        display: intake,
        month: intake,
        year: "",
        value: intake,
      };
    });
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
    "Price varies by country",
  ];

  const getNumericCost = (costString: string): number => {
    if (
      !costString ||
      costString === "Price varies by country" ||
      costString === "null"
    )
      return 0;
    const match = costString.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
  };

  const costInRange = (cost: string | null, range: string): boolean => {
    const formattedCost = formatCost(cost);
    if (formattedCost === "Price varies by country") {
      return range === "All" || range === "Price varies by country";
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
      case "Price varies by country":
        return formattedCost === "Price varies by country";
      default:
        return true;
    }
  };

  const fetchCourses = async (page: number = 1) => {
    const countryName = getCountryForAPI(selectedCountry);

    if (!countryName) {
      setError("No country selected. Please select a country.");
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
          `No programs found for ${selectedCountry?.countryName}. Try selecting a different country.`
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
          selectedCountry: selectedCountry?.countryName,
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
            <span class="text-lg mr-2">⚠</span>
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
          selectedCountry: selectedCountry?.countryName,
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

    // Extract month and year from the selected intake
    const selectedIntakeOption = getIntakeOptions(
      selectedCourseForApplication
    ).find((option) => option.value === applicationData.intake);

    const requestData: ApplicationRequest = {
      courseName: selectedCourseForApplication.courseName,
      intakeMonth: selectedIntakeOption?.month || applicationData.intake,
      intakeYear: selectedIntakeOption?.year || applicationData.intakeYear,
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
          intake: "",
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
      intake: "",
      intakeYear: "",
      remarks: "",
    });
    setApplicationSuccess(false);
    setApplicationResponse(null);
    setError(null);
  };

  // Initialize countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch courses when country is selected
  useEffect(() => {
    if (selectedCountry && !showCountrySelection) {
      fetchCourses(currentPage);
    }
  }, [selectedCountry, currentPage]);

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
    if (!showCountrySelection && selectedCountry) {
      // If we're showing courses, go back to country selection
      setShowCountrySelection(true);
      setSelectedCountry(null);
      setCourses([]);
      setFilteredCourses([]);
      setDisplayedCourses([]);
      setError(null);
    } else {
      // Otherwise, navigate back
      navigate(-1);
    }
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
    if (showCountrySelection) {
      fetchCountries();
    } else {
      fetchCourses(currentPage);
    }
  };

  const activeFiltersCount = [
    searchTerm !== "",
    selectedDegree !== "All",
    selectedDuration !== "All",
    selectedUniversity !== "All",
    selectedCostRange !== "All",
  ].filter(Boolean).length;

  // Show loading state for initial country fetch
  if (countriesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Loading Available Countries
              </h3>
              <p className="text-gray-600">
                Discovering amazing study destinations worldwide...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error && !loading && (countriesLoading || showCountrySelection)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span>Try Again</span>
              </button>
              {authRequired && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Country Selection Screen
  if (showCountrySelection) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Choose Your Study Destination
                </h4>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Select a country to explore amazing study programs
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearchTerm}
                onChange={(e) => setCountrySearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Countries Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredCountries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No countries found
                </h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredCountries.map((country) => (
                  <div
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 md:mr-4">
                            {country.countryName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm md:text-base">
                              {country.countryName}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500">
                              {country.countryCode}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Courses Page
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBackClick}
              className="mr-3 md:mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
            <div>
              <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                Study Programs in {selectedCountry?.countryName}
              </h4>
              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                Discover amazing educational opportunities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              {totalCourses} programs found
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Search programs, universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 md:px-4 py-2 md:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm md:text-base"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Degree Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree Type
                  </label>
                  <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {degreeTypes.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {universities.map((university) => (
                      <option key={university} value={university}>
                        {university.length > 30
                          ? `${university.substring(0, 30)}...`
                          : university}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cost Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Range
                  </label>
                  <select
                    value={selectedCostRange}
                    onChange={(e) => setSelectedCostRange(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {costRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "name"
                          | "cost"
                          | "duration"
                          | "university"
                      )
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="name">Program Name</option>
                    <option value="cost">Cost</option>
                    <option value="duration">Duration</option>
                    <option value="university">University</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                Loading Programs
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Finding the best study opportunities for you...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Programs
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowCountrySelection(true)}
                className="px-4 md:px-6 py-2 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
              >
                Change Country
              </button>
            </div>
          </div>
        )}
    {/* Courses Grid */}
        {!loading && !error && (
          <>
            {displayedCourses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Programs Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || activeFiltersCount > 0
                    ? "Try adjusting your search terms or filters"
                    : `No programs available for ${selectedCountry?.countryName} at the moment`}
                </p>
                {(searchTerm || activeFiltersCount > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedCourses.map((course, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-slate-300 flex flex-col h-full"
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {getDegreeType(course) && (
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md mb-3">
                              {getDegreeType(course)}
                            </span>
                          )}
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-snug">
                            {getFieldOfStudy(course.courseName)}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-1">
                            <University className="w-4 h-4 mr-2 text-slate-500" />
                            <span className="text-sm line-clamp-1 font-medium">
                              {course.university}
                            </span>
                          </div>
                          {course.universityCampusCity && (
                            <div className="flex items-center text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {course.universityCampusCity}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Course Details - Compact Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                        {/* Duration */}
                        {shouldDisplayField(course.duration) && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            <div>
                              <div className="text-xs text-gray-500">Duration</div>
                              <div className="text-sm font-medium text-gray-900">{course.duration}</div>
                            </div>
                          </div>
                        )}

                        {/* Cost */}
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                          <div>
                            <div className="text-xs text-gray-500">Tuition</div>
                            <div className="text-sm font-medium text-gray-900">{formatCost(course.cost)}</div>
                          </div>
                        </div>

                        {/* Application Fee */}
                        {shouldDisplayField(course.applicationFee) && (
                          <div className="flex items-center col-span-2">
                            <CreditCard className="w-4 h-4 mr-2 text-purple-500" />
                            <div>
                              <span className="text-xs text-gray-500">App Fee: </span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatApplicationFee(course.applicationFee)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Intakes - Compact */}
                      {getAllIntakes(course).length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-xs text-gray-500 font-medium">INTAKES</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {getAllIntakes(course).map((intake, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs rounded font-medium"
                              >
                                {intake}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exam Requirements - Compact */}
                      {formatExamRequirements(course.typesOfExams).length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" />
                            <span className="text-xs text-gray-500 font-medium">EXAMS</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {formatExamRequirements(course.typesOfExams).map((exam, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs rounded font-medium"
                              >
                                {exam.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => openApplicationModal(course)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        style={{
                          marginTop: `${16 + (index % 4) * 4}px`
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Compact Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} ({totalCourses} programs)
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                          currentPage === pageNumber
                            ? "bg-slate-700 text-white border-slate-700"
                            : "border-gray-300 hover:bg-white text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedCourseForApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {applicationSuccess
                    ? "Application Submitted!"
                    : "Apply for Program"}
                </h2>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {applicationSuccess && applicationResponse ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {applicationResponse.message ||
                      "Your application has been submitted successfully."}
                  </p>
                  {applicationResponse.applicationId && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Application ID:</strong>{" "}
                        {applicationResponse.applicationId}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={closeApplicationModal}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Course Info */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-blue-800 mb-1">
                      {getFieldOfStudy(selectedCourseForApplication.courseName)}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {selectedCourseForApplication.university}
                    </p>
                  </div>

                  {/* Application Form */}
                  <div className="space-y-4">
                    {/* Intake Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Intake <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={applicationData.intake}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            intake: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select an intake</option>
                        {getIntakeOptions(selectedCourseForApplication).map(
                          (option, index) => (
                            <option key={index} value={option.value}>
                              {option.display}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Remarks */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Remarks (Optional)
                      </label>
                      <textarea
                        value={applicationData.remarks}
                        onChange={(e) =>
                          setApplicationData({
                            ...applicationData,
                            remarks: e.target.value,
                          })
                        }
                        placeholder="Any additional information or questions..."
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={submitApplication}
                      disabled={
                        !applicationData.intake || isSubmittingApplication
                      }
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isSubmittingApplication ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
