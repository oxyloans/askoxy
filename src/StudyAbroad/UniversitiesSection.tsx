import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  Globe,
  Star,
  Users,
  School,
  Building,
  CheckCircle,
  GraduationCap,
  Award,
  Percent,
  Clock,
  MapPin,
  TrendingUp,
  Filter,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import thumbnailImage from "../assets/img/thumbnail.png";

// Type definitions
interface University {
  id: string;
  name: string;
  country: string;
  location: string;
  image: string;
  description: string;
  ranking?: string;
  programsCount?: number;
  intakes?: string[];
  tuitionFee?: string;
  offerRate?: string;
  scholarships?: string[];
  specialOffer?: string;
  eligibility?: string;
  scholarshipAmount?: string;
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
  success: boolean;
  message?: string;
  data: Course[];
  count: number;
}

interface ApplicationRequest {
  courseName: string;
  intakeMonth: string;
  intakeYear: string;
  remarks: string;
  universityName: string;
  userId: string;
  universityId: string;
}

const UniversitiesSection: React.FC = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [selectedCourseForApplication, setSelectedCourseForApplication] =
    useState<Course | null>(null);
  const [
    selectedUniversityForApplication,
    setSelectedUniversityForApplication,
  ] = useState<University | null>(null);
  const [availableCoursesForApplication, setAvailableCoursesForApplication] =
    useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState({
    selectedCourse: "",
    intake: "",
    intakeYear: "",
    remarks: "",
  });
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationResponse, setApplicationResponse] = useState<any>(null);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // Video modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  // Ref for timeout cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const BASE_URL = "https://meta.oxyloans.com/api";
  const coursePageSize = 20;
  const displayLimit = 8; // Show 8 initially (2 rows of 4), then show all

  // Google Drive video configuration
  const videoFileId = "1eFue_pAwDlo1wK-Dfas9nAvCJkuBx2Kc";
  const videoEmbedUrl =
    "https://www.youtube.com/embed/UuisrENc974?autoplay=1&rel=0";

  // Updated manual fallback data for UK universities with university building images
  const manualUniversitiesData: University[] = [
    {
      id: "qmul-001",
      name: "Queen Mary University of London",
      country: "United Kingdom",
      location: "London",
      image:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&auto=format", // University campus entrance building
      description:
        "A leading research-intensive university offering world-class education in the heart of London.",
      programsCount: 25,
      eligibility: "60% in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £25,000",
    },
    {
      id: "bham-002",
      name: "University of Birmingham - Edgbaston",
      country: "United Kingdom",
      location: "Birmingham",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&auto=format", // Traditional brick university building
      description:
        "A prestigious Russell Group university known for academic excellence and innovation.",
      programsCount: 30,
      eligibility: "60% in PGT Masters",
      scholarshipAmount: "£3000",
      tuitionFee: "£19,000 - £24,000",
    },
    {
      id: "cov-003",
      name: "Coventry University (Part of Coventry University Group)",
      country: "United Kingdom",
      location: "Coventry",
      image:
        "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=400&h=300&fit=crop&auto=format", // Contemporary university facility
      description:
        "Modern university with excellent industry connections and practical learning approach.",
      programsCount: 20,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£2500",
      tuitionFee: "£16,000 - £20,000",
    },
    {
      id: "liv-004",
      name: "University of Liverpool",
      country: "United Kingdom",
      location: "Liverpool",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format", // Gothic university building
      description:
        "A member of the prestigious Russell Group with a strong global reputation.",
      programsCount: 35,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £26,000",
    },
    {
      id: "uel-005",
      name: "University of East London",
      country: "United Kingdom",
      location: "London",
      image:
        "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=300&fit=crop&auto=format", // Modern university library building
      description:
        "Career-focused university with strong links to industry and professional practice.",
      programsCount: 18,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£2500",
      tuitionFee: "£14,000 - £18,000",
    },
    {
      id: "soton-006",
      name: "University of Southampton",
      country: "United Kingdom",
      location: "Southampton",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format", // Research university complex
      description:
        "Leading research university known for engineering, computer science, and medicine.",
      programsCount: 40,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£2000",
      tuitionFee: "£21,000 - £27,000",
    },
    {
      id: "aston-007",
      name: "Aston University",
      country: "United Kingdom",
      location: "Birmingham",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format", // University administration building
      description:
        "Business-focused university with excellent graduate employment rates.",
      programsCount: 22,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£10,000",
      tuitionFee: "£17,000 - £22,000",
    },
    {
      id: "exeter-008",
      name: "University of Exeter",
      country: "United Kingdom",
      location: "Exeter",
      image:
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop&auto=format", // University college architecture
      description:
        "Russell Group university with beautiful campuses and excellent academic reputation.",
      programsCount: 28,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£10,000",
      tuitionFee: "£22,000 - £28,000",
    },
    {
      id: "ntu-009",
      name: "Nottingham Trent University - City Campus",
      country: "United Kingdom",
      location: "Nottingham",
      image:
        "https://images.unsplash.com/photo-1607457937751-4ad356b9ebc1?w=400&h=300&fit=crop&auto=format", // University lecture building
      description:
        "Modern university known for innovative teaching and strong industry connections.",
      programsCount: 26,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£4000",
      tuitionFee: "£15,000 - £19,000",
    },
    {
      id: "essex-010",
      name: "University of Essex - Colchester Campus",
      country: "United Kingdom",
      location: "Colchester",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&auto=format", // University building complex
      description:
        "Research-intensive university known for political science and economics.",
      programsCount: 24,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£18,000 - £23,000",
    },
    {
      id: "bath-011",
      name: "University of Bath",
      country: "United Kingdom",
      location: "Bath",
      image:
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&auto=format", // Prestigious university facade
      description:
        "Prestigious university known for engineering, management, and architecture.",
      programsCount: 32,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£15,000",
      tuitionFee: "£23,000 - £29,000",
    },
    {
      id: "uea-012",
      name: "University of East Anglia (UEA)",
      country: "United Kingdom",
      location: "Norwich",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&auto=format", // University academic facility
      description:
        "Top-ranked university known for creative writing, environmental sciences, and media.",
      programsCount: 29,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£6000",
      tuitionFee: "£17,000 - £22,000",
    },
    {
      id: "rav-013",
      name: "Ravensbourne University London",
      country: "United Kingdom",
      location: "London",
      image:
        "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=400&h=300&fit=crop&auto=format", // Modern university building
      description:
        "Specialist university for digital media, design, and technology.",
      programsCount: 15,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£3000",
      tuitionFee: "£16,500 - £20,000",
    },
    {
      id: "strath-014",
      name: "University of Strathclyde, Glasgow",
      country: "United Kingdom",
      location: "Glasgow",
      image:
        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&auto=format", // Scottish university architecture
      description:
        "Leading technological university with strong industry partnerships.",
      programsCount: 35,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£12,000",
      tuitionFee: "£19,000 - £25,000",
    },
    {
      id: "cardiff-015",
      name: "Cardiff University - Cathays Park",
      country: "United Kingdom",
      location: "Cardiff",
      image:
        "https://images.unsplash.com/photo-1580457616440-3a3be50bb70f?w=400&h=300&fit=crop&auto=format", // Welsh university building
      description:
        "Russell Group university with excellent research facilities and student satisfaction.",
      programsCount: 38,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £26,000",
    },
    {
      id: "herts-016",
      name: "University of Hertfordshire",
      country: "United Kingdom",
      location: "Hatfield",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=300&fit=crop&auto=format", // Modern university campus
      description:
        "Modern university known for business, engineering, and creative arts.",
      programsCount: 27,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£4000 + £1000 tuition discount",
      tuitionFee: "£14,000 - £18,000",
    },
    {
      id: "lonmet-017",
      name: "London Metropolitan University - Holloway",
      country: "United Kingdom",
      location: "London",
      image:
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&auto=format", // London university building
      description:
        "Diverse university in the heart of London with strong community focus.",
      programsCount: 20,
      eligibility: "50%+ in UG (creative minds)",
      scholarshipAmount: "£3000",
      tuitionFee: "£13,000 - £17,000",
    },
    {
      id: "qub-018",
      name: "Queen's University Belfast",
      country: "United Kingdom",
      location: "Belfast",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format", // Belfast university building
      description:
        "Leading research university and member of the Russell Group.",
      programsCount: 33,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£7500",
      tuitionFee: "£18,000 - £24,000",
    },
    {
      id: "hw-019",
      name: "Heriot-Watt University - Edinburgh",
      country: "United Kingdom",
      location: "Edinburgh",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&auto=format", // Edinburgh university campus
      description:
        "Specialist university known for engineering, business, and built environment.",
      programsCount: 25,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£6000",
      tuitionFee: "£19,000 - £24,000",
    },
    {
      id: "cran-020",
      name: "Cranfield University",
      country: "United Kingdom",
      location: "Cranfield",
      image:
        "https://images.unsplash.com/photo-1580536655246-518764bf4118?w=400&h=300&fit=crop&auto=format", // Academic building exterior
      description:
        "Exclusively postgraduate university specializing in science, engineering, technology and management.",
      programsCount: 45,
      eligibility: "65%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£22,000 - £38,000",
    },
  ];

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get user ID from local storage
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // Get access token from local storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    const userId = getUserId();
    const accessToken = getAccessToken();
    return userId && accessToken;
  };

  // Create auth config for axios
  const createAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Handle auth error
  const handleAuthError = (err: any, navigate: any) => {
    if (err.response?.status === 401) {
      sessionStorage.setItem("redirectPath", window.location.pathname);
      sessionStorage.setItem("fromStudyAbroad", "true");
      navigate("/whatsappregister?primaryType=STUDENT");
      return true;
    }
    return false;
  };

  // Handle login redirect for non-authenticated users
  const handleLoginRedirect = (redirectPath?: string) => {
    sessionStorage.setItem(
      "redirectPath",
      redirectPath || window.location.pathname
    );
    sessionStorage.setItem("fromStudyAbroad", "true");
    navigate("/whatsappregister?primaryType=STUDENT");
  };

  // Fetch courses for a specific university
  const fetchUniversityCourses = async (
    universityName: string,
    universityCountry: string = "United Kingdom"
  ) => {
    try {
      setIsLoadingCourses(true);
      setCoursesError(null);

      console.log(`Fetching courses for university: ${universityName}`);

      const queryParams = new URLSearchParams({
        pageIndex: "1",
        pageSize: coursePageSize.toString(),
      });

      const response = await fetch(
        `${BASE_URL}/user-service/student/courses-mapped-to-university?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            countryName: universityCountry,
            university: universityName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "API request failed");
      }

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setAvailableCoursesForApplication(data.data);
        setCoursesError(null);
      } else {
        setAvailableCoursesForApplication([]);
        setCoursesError(
          `No courses found for ${universityName} in our database. You can enter your desired program manually.`
        );
      }
    } catch (err: any) {
      console.error("Error fetching university courses:", err);
      setAvailableCoursesForApplication([]);
      setCoursesError(
        "Unable to load courses. You can enter your desired program manually."
      );
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Fetch UK universities from API
  const fetchUKUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "https://meta.oxyloans.com/api/user-service/student/getCountryBasedData",
        { countryName: "United Kingdom" }
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const transformedData = response.data
          .slice(0, 20)
          .map((item: any, index: number) => ({
            id: item.universityId || `api-uni-${index}`,
            name: item.university,
            country: "United Kingdom",
            location: item.universityCampusCity || item.address || "UK",
            image:
              manualUniversitiesData.find((uni) =>
                uni.name
                  .toLowerCase()
                  .includes(item.university?.toLowerCase()?.split(" ")[0] || "")
              )?.image ||
              manualUniversitiesData[index % manualUniversitiesData.length]
                ?.image ||
              "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&auto=format",
            description: item.courseName
              ? `Study ${item.courseName} at ${item.university}`
              : `Study at ${item.university}`,
            programsCount: 1,
            eligibility: item.eligibility,
            scholarshipAmount: item.scholarshipAmount,
            tuitionFee:
              item.tutionFee1styr ||
              item.applicationFee ||
              "Contact University",
            specialOffer: item.specialOffer,
          }));

        setUniversities(transformedData);
        setCourses(response.data);
      } else {
        setUniversities(manualUniversitiesData);
        setCourses([]);
      }
    } catch (err) {
      console.error("API Error, using manual fallback data:", err);
      setUniversities(manualUniversitiesData);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUKUniversities();
  }, [fetchUKUniversities]);

  // FIXED: Updated submitApplication function with proper success handling for 201 status
  const submitApplication = async () => {
    if (!selectedUniversityForApplication || !applicationData.selectedCourse)
      return;

    const userId = getUserId();
    if (!userId) {
      handleLoginRedirect();
      return;
    }

    const selectedCourse = availableCoursesForApplication.find(
      (course) => course.courseName === applicationData.selectedCourse
    );
    if (!selectedCourse) {
      setApplicationError("Please select a valid course");
      return;
    }

    setIsSubmittingApplication(true);
    setApplicationError(null);

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/user-service/student/add-application",
        {
          courseName: selectedCourse.courseName,
          intakeMonth: applicationData.intake.split(" ")[0] || "Sep",
          intakeYear:
            applicationData.intake.split(" ")[1] ||
            new Date().getFullYear().toString(),
          remarks: applicationData.remarks,
          universityName:
            selectedCourse.university || selectedUniversityForApplication.name,
          userId: userId,
          universityId:
            selectedCourse.universityId || selectedUniversityForApplication.id,
        },
        createAuthConfig()
      );

      // FIXED: Handle both 200/201 status codes and check for success properly
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data?.success !== false
      ) {
        setApplicationSuccess(true);
        setApplicationResponse(response.data);
        setSelectedCourseForApplication(selectedCourse);

        // FIXED: Clear any existing timeout and set new one with cleanup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          // Reset all states
          setSelectedUniversityForApplication(null);
          setSelectedCourseForApplication(null);
          setAvailableCoursesForApplication([]);
          setIsLoadingCourses(false);
          setCoursesError(null);
          setApplicationSuccess(false);
          setApplicationData({
            selectedCourse: "",
            intake: "",
            intakeYear: "",
            remarks: "",
          });
          setApplicationError(null);
          setApplicationResponse(null);
          setIsSubmittingApplication(false);

          // Navigate to student dashboard
          navigate("/student-dashboard");
        }, 3000); // 3 seconds delay
      } else {
        // Only treat as error if explicitly marked as failed
        setApplicationError(
          response.data?.message || "Application submission failed"
        );
      }
    } catch (err: unknown) {
      console.error("Error submitting application:", err);

      if (handleAuthError(err, navigate)) {
        return;
      }

      let errorMessage = "Failed to submit application. Please try again.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { status?: number; data?: any };
        };

        // FIXED: Handle 201 status in catch block (some axios configurations throw on 201)
        if (axiosError.response?.status === 201) {
          // Treat 201 as success even if it's in catch block
          setApplicationSuccess(true);
          setApplicationResponse(axiosError.response.data);
          setSelectedCourseForApplication(selectedCourse);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            // Reset all states
            setSelectedUniversityForApplication(null);
            setSelectedCourseForApplication(null);
            setAvailableCoursesForApplication([]);
            setIsLoadingCourses(false);
            setCoursesError(null);
            setApplicationSuccess(false);
            setApplicationData({
              selectedCourse: "",
              intake: "",
              intakeYear: "",
              remarks: "",
            });
            setApplicationError(null);
            setApplicationResponse(null);
            setIsSubmittingApplication(false);

            // Navigate to student dashboard
            navigate("/student-dashboard");
          }, 3000);

          setIsSubmittingApplication(false);
          return;
        }

        if (axiosError.response?.status === 400) {
          errorMessage = "Invalid application data. Please check your inputs.";
        } else if (axiosError.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      setApplicationError(errorMessage);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleApplyNow = async (university: University) => {
    if (!isLoggedIn()) {
      handleLoginRedirect();
      return;
    }

    try {
      setSelectedUniversityForApplication(university);

      setApplicationData({
        selectedCourse: "",
        intake: "",
        intakeYear: "",
        remarks: "",
      });

      setSelectedCourseForApplication(null);
      setApplicationSuccess(false);
      setApplicationError(null);
      setApplicationResponse(null);
      setAvailableCoursesForApplication([]);
      setCoursesError(null);
      setIsSubmittingApplication(false);

      await fetchUniversityCourses(
        university.name,
        university.country || "United Kingdom"
      );
    } catch (error) {
      console.error("Error in handleApplyNow:", error);
      setApplicationError(
        "Failed to initialize application. Please try again."
      );
    }
  };

  // Video modal handlers
  const openVideoModal = () => {
    setShowVideoModal(true);
    setVideoLoading(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setVideoLoading(true);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  const countryFlags: Record<string, string> = {
    "United Kingdom": "🇬🇧",
    UK: "🇬🇧",
  };

  const displayedUniversities = showAllCards
    ? universities
    : universities.slice(0, displayLimit);

  const { ref, inView } = useInView({ triggerOnce: true });

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="w-full h-44 bg-gray-200"></div>
          <div className="p-4 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading && universities.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-purple-500"></div>
              <h2 className="mx-3 text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600">
                Top UK Universities
              </h2>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Discover premier UK institutions offering world-class education
              and research opportunities.
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title - REDUCED SIZE */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-purple-500"></div>
            <h2 className="mx-3 text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600">
              Top UK Universities
            </h2>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover premier institutions offering world-class education and
            research opportunities in the United Kingdom.
          </p>
        </div>

        {/* Enhanced Statistics Section - REDUCED SIZE */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-100">
            <Users size={32} className="text-purple-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {inView && <CountUp end={5000} duration={3} />}+
            </div>
            <div className="text-gray-600 text-xs font-medium">
              Happy Students
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
            <School size={32} className="text-blue-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {inView && <CountUp end={100} duration={3} />}+
            </div>
            <div className="text-gray-600 text-xs font-medium">
              UK Universities
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100">
            <Building size={32} className="text-green-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {inView && <CountUp end={1500} duration={3} />}+
            </div>
            <div className="text-gray-600 text-xs font-medium">
              Study Programs
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-orange-100">
            <Award size={32} className="text-orange-600 mb-2 mx-auto" />
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {inView && <CountUp end={25} duration={3} />}+
            </div>
            <div className="text-gray-600 text-xs font-medium">
              Scholarship Programs
            </div>
          </div>
        </div>

        {/* Enhanced Video and Offers Section - REDUCED SIZE */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8">
          {/* UPDATED: Enhanced Video Section with custom thumbnail */}
          <div className="xl:w-3/5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-xl border border-purple-100">
            <div className="relative">
              {/* Video Thumbnail */}
              <div
                className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden cursor-pointer group"
                onClick={openVideoModal}
              >
                <img
                  src={thumbnailImage}
                  alt="Why Study in the UK - Video Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=640&h=360&fit=crop&auto=format";
                  }}
                />

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>

                {/* Enhanced Video Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
                  <div className="absolute top-3/4 left-1/2 w-12 h-12 bg-pink-500 rounded-full blur-xl animate-pulse delay-500"></div>
                </div>

                {/* Enhanced Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="group/play relative">
                    {/* Multiple Ripple Effects */}
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 bg-white rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 bg-white rounded-full animate-ping opacity-30 animation-delay-500"></div>
                    <div className="absolute inset-4 bg-white rounded-full animate-ping opacity-40 animation-delay-1000"></div>

                    {/* Enhanced Play Button */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-full p-6 hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl group-hover/play:shadow-purple-500/25">
                      <Play
                        className="w-12 h-12 text-purple-600 ml-2"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Video Description */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Discover UK Education Excellence
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      Watch our comprehensive guide to understand why the UK is
                      the perfect destination for international students. Learn
                      about world-class education, cultural diversity, career
                      opportunities, and scholarship programs.
                    </p>
                  </div>
                </div>

                {/* Enhanced Video Features */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100">
                    <GraduationCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700">
                      World Rankings
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100">
                    <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700">
                      Global Recognition
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100">
                    <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700">
                      Scholarships
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Scholarship Offers Section - REDUCED SIZE */}
          <div className="xl:w-2/5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                🏆 Exclusive UK Scholarships
              </h3>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black mb-2 text-xs px-3 py-1 rounded-full font-bold">
                Limited Time
              </span>
            </div>

            <div className="space-y-4 mb-2">
              {universities.slice(0, 5).map((uni, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-800 text-sm mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {uni.name}
                      </h4>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">
                          Eligibility:
                        </span>
                        <span className="font-semibold bg-yellow-100 px-2 py-1 rounded-full text-yellow-800">
                          {uni.eligibility}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 font-medium">
                          Scholarship:
                        </span>
                        <span className="font-bold text-green-600 text-sm">
                          {uni.scholarshipAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header & View All */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🏆 UK Universities with 5% Cashback
            </h3>
            <p className="text-gray-600 text-sm">
              UK universities offering exclusive scholarships and admission
              benefits for international students
            </p>
          </div>
        </div>

        {/* FIXED: Enhanced Universities Grid with Consistent Card Heights and Button Alignment */}
        {universities.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedUniversities.map((university, index) => (
                <div
                  key={university.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02] h-full"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    minHeight: "520px", // FIXED: Set minimum height for consistency
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&auto=format";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-3 left-3 space-y-2">
                      {university.specialOffer && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
                          🔥 {university.specialOffer}
                        </span>
                      )}
                      {university.scholarshipAmount && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          💰 {university.scholarshipAmount} Scholarship
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FIXED: Consistent content area with proper flex layout */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <h4
                        className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors duration-300"
                        style={{ minHeight: "3.5rem" }}
                      >
                        {university.name}
                      </h4>

                      <div className="flex items-center text-purple-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {university.location}
                        </span>
                      </div>

                      <p
                        className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4"
                        style={{ minHeight: "4rem" }}
                      >
                        {university.description}
                      </p>

                      <div className="space-y-3 mb-4">
                        {university.programsCount && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <GraduationCap className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold">
                                {university.programsCount}+ Programs
                              </span>
                            </div>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {university.tuitionFee && (
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                              <span className="font-semibold text-green-600">
                                Tuition:
                              </span>{" "}
                              {university.tuitionFee}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FIXED: Consistent Apply Now button positioning at bottom */}
                    <div className="mt-auto pt-4">
                      <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleApplyNow(university)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full relative overflow-hidden group"
                        >
                          <span className="relative z-10">Apply Now</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </button>
                      </div>

                      {/* Enhanced Cashback reminder */}
                      <div className="text-center mt-2">
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                          💰 Get 5% Cashback
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Show More/Less Button */}
            {universities.length > displayLimit && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllCards(!showAllCards)}
                  className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  {showAllCards ? (
                    <>
                      Show Less Universities
                      <ChevronRight className="w-5 h-5 rotate-90 transition-transform duration-300" />
                    </>
                  ) : (
                    <>
                      Show {universities.length - displayLimit} More
                      Universities
                      <ChevronRight className="w-5 h-5 -rotate-90 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Enhanced Popular UK Programs - REDUCED SIZE */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎓 Most Popular UK Study Programs
              </h3>
              <p className="text-gray-600 text-sm">
                Explore trending academic programs across UK universities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Business & Management",
                icon: "💼",
                count: "150+",
                universities: "45 UK Universities",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Computer Science",
                icon: "💻",
                count: "120+",
                universities: "38 UK Universities",
                color: "from-purple-500 to-pink-500",
              },
              {
                name: "Engineering",
                icon: "⚙️",
                count: "200+",
                universities: "52 UK Universities",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Medicine & Health",
                icon: "🏥",
                count: "80+",
                universities: "28 UK Universities",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Arts & Design",
                icon: "🎨",
                count: "90+",
                universities: "32 UK Universities",
                color: "from-pink-500 to-rose-500",
              },
              {
                name: "Law",
                icon: "⚖️",
                count: "60+",
                universities: "25 UK Universities",
                color: "from-gray-600 to-gray-800",
              },
              {
                name: "Environmental Science",
                icon: "🌱",
                count: "70+",
                universities: "30 UK Universities",
                color: "from-green-400 to-blue-500",
              },
              {
                name: "Psychology",
                icon: "🧠",
                count: "85+",
                universities: "35 UK Universities",
                color: "from-indigo-500 to-purple-600",
              },
            ].map((program, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
                onClick={() => {
                  if (!isLoggedIn()) {
                    handleLoginRedirect("/student-dashboard");
                  } else {
                    navigate("/student-dashboard");
                  }
                }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {program.icon}
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {program.name}
                </h4>
                <div
                  className={`text-sm font-bold bg-gradient-to-r ${program.color} bg-clip-text text-transparent mb-1`}
                >
                  {program.count} Courses
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {program.universities}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPDATED: Enhanced Video Modal with improved styling */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-xl font-bold text-gray-900">
                Why Study in the UK?
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative aspect-video bg-gray-900">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
                    <p className="text-base font-medium">Loading video...</p>
                  </div>
                </div>
              )}
              <iframe
                className="w-full h-full"
                src={videoEmbedUrl}
                title="Why Study in the UK - Educational Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
              />
            </div>
          </div>
        </div>
      )}

      {/* FIXED: Enhanced Application Modal with improved dropdown positioning and auto-close */}
      {selectedUniversityForApplication && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">
                  Apply to {selectedUniversityForApplication.name}
                </h3>
                <button
                  onClick={() => {
                    // Clear timeout when manually closing
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setSelectedUniversityForApplication(null);
                    setSelectedCourseForApplication(null);
                    setAvailableCoursesForApplication([]);
                    setIsLoadingCourses(false);
                    setCoursesError(null);
                    setApplicationSuccess(false);
                    setApplicationData({
                      selectedCourse: "",
                      intake: "",
                      intakeYear: "",
                      remarks: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {applicationSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">
                    Application Submitted Successfully! 🎉
                  </h4>
                  <p className="text-gray-600 mb-6 text-base">
                    Your application for {applicationData.selectedCourse} at{" "}
                    {selectedUniversityForApplication.name} has been received.
                  </p>

                  {/* Enhanced cashback and savings information */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-green-600 mr-2" />
                      <h5 className="font-bold text-green-800 text-lg">
                        Congratulations! You're eligible for:
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-xl font-bold text-green-600 mb-1">
                          💰 5% Cashback
                        </div>
                        <p className="text-gray-600">
                          Will be credited after fee payment
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-xl font-bold text-green-600 mb-1">
                          💸 Save ₹1,50,000
                        </div>
                        <p className="text-gray-600">
                          Total potential savings on fees
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl text-left mb-6">
                    <h5 className="font-bold mb-3 text-base">
                      Application Details:
                    </h5>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Course:</span>{" "}
                      {applicationData.selectedCourse}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">University:</span>{" "}
                      {selectedUniversityForApplication.name}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Intake:</span>{" "}
                      {applicationData.intake}
                    </p>
                    {applicationResponse?.applicationId && (
                      <p className="text-sm mt-3">
                        <span className="font-semibold">Application ID:</span>{" "}
                        {applicationResponse.applicationId}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800 font-semibold">
                      <strong>
                        🚀 Redirecting to your dashboard in a few seconds...
                      </strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Track your application status and access exclusive offers
                      in your dashboard.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-base">
                      University Information:
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={selectedUniversityForApplication.image}
                          alt={selectedUniversityForApplication.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=64&h=64&fit=crop&auto=format";
                          }}
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-base">
                            {selectedUniversityForApplication.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedUniversityForApplication.location}
                          </p>
                        </div>
                      </div>
                      {selectedUniversityForApplication.scholarshipAmount && (
                        <div className="bg-green-100 p-3 rounded-lg mt-3">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">
                              🎓 Scholarship Available:
                            </span>{" "}
                            {selectedUniversityForApplication.scholarshipAmount}
                          </p>
                        </div>
                      )}

                      {/* Enhanced cashback information */}
                      <div className="bg-blue-100 p-3 rounded-lg mt-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">
                            💰 Special Offer:
                          </span>{" "}
                          5% Cashback + Save up to ₹1,50,000
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitApplication();
                    }}
                  >
                    <div className="space-y-5">
                      {/* FIXED: Course Selection Dropdown with improved positioning */}
                      <div className="relative">
                        <label
                          htmlFor="course"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Select Course/Program *
                        </label>

                        {isLoadingCourses ? (
                          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5 text-purple-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-gray-600 font-medium text-sm">
                              Loading courses for{" "}
                              {selectedUniversityForApplication?.name}...
                            </span>
                          </div>
                        ) : availableCoursesForApplication.length > 0 ? (
                          <div className="space-y-3">
                            <div className="relative">
                              <select
                                id="course"
                                value={applicationData.selectedCourse}
                                onChange={(e) =>
                                  setApplicationData({
                                    ...applicationData,
                                    selectedCourse: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: "right 0.75rem center",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "1.25em 1.25em",
                                }}
                                required
                              >
                                <option value="">
                                  Choose a course/program
                                </option>
                                {availableCoursesForApplication.map(
                                  (course, index) => (
                                    <option
                                      key={index}
                                      value={course.courseName}
                                    >
                                      {course.courseName}
                                      {course.degree && ` (${course.degree})`}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                              ✅ Found {availableCoursesForApplication.length}{" "}
                              courses for{" "}
                              {selectedUniversityForApplication?.name}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {coursesError && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <svg
                                    className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <p className="text-xs text-yellow-800">
                                    {coursesError}
                                  </p>
                                </div>
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Enter the program you're interested in (e.g., Master of Business Administration, Computer Science, etc.)"
                              value={applicationData.selectedCourse}
                              onChange={(e) =>
                                setApplicationData({
                                  ...applicationData,
                                  selectedCourse: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm shadow-sm"
                              required
                            />
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  fetchUniversityCourses(
                                    selectedUniversityForApplication?.name ||
                                      "",
                                    selectedUniversityForApplication?.country ||
                                      "United Kingdom"
                                  )
                                }
                                className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50 font-medium"
                                disabled={isLoadingCourses}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                Retry loading courses
                              </button>
                              <span className="text-xs text-gray-500">
                                University:{" "}
                                {selectedUniversityForApplication?.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Course Details Display */}
                      {applicationData.selectedCourse &&
                        availableCoursesForApplication.length > 0 && (
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-base">
                              <GraduationCap className="w-5 h-5" />
                              Selected Course Details:
                            </h5>
                            {(() => {
                              const selectedCourse =
                                availableCoursesForApplication.find(
                                  (c) =>
                                    c.courseName ===
                                    applicationData.selectedCourse
                                );
                              if (!selectedCourse) return null;
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div className="text-sm">
                                      <span className="font-semibold text-gray-700">
                                        Course:
                                      </span>
                                      <p className="text-gray-900 mt-1 font-medium">
                                        {selectedCourse.courseName}
                                      </p>
                                    </div>
                                    {selectedCourse.degree && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-gray-700">
                                          Degree Type:
                                        </span>
                                        <p className="text-gray-900 mt-1 font-medium">
                                          {selectedCourse.degree}
                                        </p>
                                      </div>
                                    )}
                                    {selectedCourse.tutionFee1styr && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-gray-700">
                                          Tuition Fee (1st Year):
                                        </span>
                                        <p className="text-green-600 font-bold mt-1 text-base">
                                          {selectedCourse.tutionFee1styr}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-3">
                                    {selectedCourse.applicationFee && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-gray-700">
                                          Application Fee:
                                        </span>
                                        <p className="text-blue-600 font-bold mt-1 text-base">
                                          {selectedCourse.applicationFee}
                                        </p>
                                      </div>
                                    )}
                                    {(selectedCourse.intake ||
                                      selectedCourse.intake2 ||
                                      selectedCourse.intake3) && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-gray-700">
                                          Available Intakes:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {[
                                            selectedCourse.intake,
                                            selectedCourse.intake2,
                                            selectedCourse.intake3,
                                          ]
                                            .filter(Boolean)
                                            .map((intake, idx) => (
                                              <span
                                                key={idx}
                                                className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"
                                              >
                                                {intake}
                                              </span>
                                            ))}
                                        </div>
                                      </div>
                                    )}
                                    {selectedCourse.courseUrl && (
                                      <div className="text-sm">
                                        <a
                                          href={selectedCourse.courseUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 font-medium"
                                        >
                                          <span>View Course Details</span>
                                          <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                      {/* FIXED: Intake Selection with improved styling and positioning */}
                      <div className="relative">
                        <label
                          htmlFor="intake"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Select Intake *
                        </label>
                        <div className="relative">
                          <select
                            id="intake"
                            value={applicationData.intake}
                            onChange={(e) =>
                              setApplicationData({
                                ...applicationData,
                                intake: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: "right 0.75rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.25em 1.25em",
                            }}
                            required
                          >
                            <option value="">Select intake</option>
                            {/* Dynamic intakes based on selected course */}
                            {applicationData.selectedCourse &&
                              availableCoursesForApplication.length > 0 &&
                              (() => {
                                const selectedCourse =
                                  availableCoursesForApplication.find(
                                    (c) =>
                                      c.courseName ===
                                      applicationData.selectedCourse
                                  );
                                if (selectedCourse) {
                                  const intakes = [
                                    selectedCourse.intake,
                                    selectedCourse.intake2,
                                    selectedCourse.intake3,
                                  ].filter(Boolean);
                                  if (intakes.length > 0) {
                                    return intakes.map((intake, index) => (
                                      <option key={index} value={intake}>
                                        {intake}
                                      </option>
                                    ));
                                  }
                                }
                                return null;
                              })()}
                            {/* Default intakes if no course-specific intakes available */}
                            {(!applicationData.selectedCourse ||
                              availableCoursesForApplication.length === 0 ||
                              !availableCoursesForApplication.find(
                                (c) =>
                                  c.courseName ===
                                  applicationData.selectedCourse
                              )?.intake) && (
                              <>
                                <option
                                  value={`Sep ${new Date().getFullYear()}`}
                                >
                                  Sep {new Date().getFullYear()}
                                </option>
                                <option
                                  value={`Jan ${new Date().getFullYear() + 1}`}
                                >
                                  Jan {new Date().getFullYear() + 1}
                                </option>
                                <option
                                  value={`Sep ${new Date().getFullYear() + 1}`}
                                >
                                  Sep {new Date().getFullYear() + 1}
                                </option>
                                <option
                                  value={`May ${new Date().getFullYear() + 1}`}
                                >
                                  May {new Date().getFullYear() + 1}
                                </option>
                              </>
                            )}
                          </select>
                        </div>
                        {applicationData.selectedCourse &&
                          availableCoursesForApplication.length > 0 &&
                          (() => {
                            const selectedCourse =
                              availableCoursesForApplication.find(
                                (c) =>
                                  c.courseName ===
                                  applicationData.selectedCourse
                              );
                            const courseIntakes = selectedCourse
                              ? [
                                  selectedCourse.intake,
                                  selectedCourse.intake2,
                                  selectedCourse.intake3,
                                ].filter(Boolean)
                              : [];
                            if (courseIntakes.length > 0) {
                              return (
                                <p className="text-xs text-green-600 mt-1 bg-green-50 p-2 rounded-lg">
                                  ✅ Showing available intakes for selected
                                  course
                                </p>
                              );
                            }
                            return null;
                          })()}
                      </div>

                      {/* Enhanced Remarks Section */}
                      <div>
                        <label
                          htmlFor="remarks"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Additional Remarks
                        </label>
                        <textarea
                          id="remarks"
                          rows={3}
                          value={applicationData.remarks}
                          onChange={(e) =>
                            setApplicationData({
                              ...applicationData,
                              remarks: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm shadow-sm resize-none"
                          placeholder="Any additional information you'd like to share about your application..."
                        />
                      </div>

                      {applicationError && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                          {applicationError}
                        </div>
                      )}

                      {/* Enhanced cashback reminder before submit button */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-5 h-5 text-green-600" />
                          <h5 className="font-bold text-green-800 text-base">
                            Your Benefits Upon Application:
                          </h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-lg">💰</span>
                            <span className="text-green-700 font-semibold">
                              5% Cashback on fees
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-lg">💸</span>
                            <span className="text-green-700 font-semibold">
                              Save up to ₹1,50,000
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-lg">🎓</span>
                            <span className="text-green-700 font-semibold">
                              Scholarship opportunities
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-lg">⚡</span>
                            <span className="text-green-700 font-semibold">
                              Fast processing
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Submit and Close Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          type="submit"
                          disabled={
                            isSubmittingApplication ||
                            isLoadingCourses ||
                            !applicationData.selectedCourse ||
                            !applicationData.intake
                          }
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          {isSubmittingApplication ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Submitting Application...
                            </>
                          ) : (
                            "Submit Application & Get 5% Cashback"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            // Clear timeout when manually closing
                            if (timeoutRef.current) {
                              clearTimeout(timeoutRef.current);
                            }
                            // Reset all states and close modal
                            setSelectedUniversityForApplication(null);
                            setSelectedCourseForApplication(null);
                            setAvailableCoursesForApplication([]);
                            setIsLoadingCourses(false);
                            setCoursesError(null);
                            setApplicationSuccess(false);
                            setApplicationData({
                              selectedCourse: "",
                              intake: "",
                              intakeYear: "",
                              remarks: "",
                            });
                            setApplicationError(null);
                            setApplicationResponse(null);
                            setIsSubmittingApplication(false);
                          }}
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Close
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default UniversitiesSection;
