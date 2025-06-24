import React, { useState, useEffect, useRef } from "react";
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
  MapPin,
  X,
  Loader2,
  CalendarDays,
  BookOpen,
  TrendingUp,
  DollarSign,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import axios from "axios";

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
  cashbackPercentage?: number;
  totalSavings?: string;
  featuredPrograms?: string[];
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

interface CashbackUniversitiesPageProps {
  onNavigate?: (tab: string) => void;
}

const CashbackUniversitiesPage: React.FC<CashbackUniversitiesPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversityForApplication, setSelectedUniversityForApplication] = useState<University | null>(null);
  const [availableCoursesForApplication, setAvailableCoursesForApplication] = useState<Course[]>([]);
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
  const [selectedCourseForApplication, setSelectedCourseForApplication] = useState<Course | null>(null);

  // Ref for timeout cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const BASE_URL = "https://meta.oxyloans.com/api";
  const coursePageSize = 20;

 // Updated manual fallback data for UK universities with university building images
  const cashbackUniversitiesData: University[] = [
    {
      id: "qmul-001",
      name: "Queen Mary University of London",
      country: "United Kingdom",
      location: "London",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&auto=format", // University campus entrance building
      description: "A leading research-intensive university offering world-class education in the heart of London.",
      programsCount: 25,
      eligibility: "60% in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £25,000"
    },
    {
      id: "bham-002",
      name: "University of Birmingham - Edgbaston",
      country: "United Kingdom",
      location: "Birmingham",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&auto=format", // Traditional brick university building
      description: "A prestigious Russell Group university known for academic excellence and innovation.",
      programsCount: 30,
      eligibility: "60% in PGT Masters",
      scholarshipAmount: "£3000",
      tuitionFee: "£19,000 - £24,000"
    },
    {
      id: "cov-003",
      name: "Coventry University (Part of Coventry University Group)",
      country: "United Kingdom",
      location: "Coventry",
      image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=400&h=300&fit=crop&auto=format", // Contemporary university facility
      description: "Modern university with excellent industry connections and practical learning approach.",
      programsCount: 20,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£2500",
      tuitionFee: "£16,000 - £20,000"
    },
    {
      id: "liv-004",
      name: "University of Liverpool",
      country: "United Kingdom",
      location: "Liverpool",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop&auto=format", // Gothic university building
      description: "A member of the prestigious Russell Group with a strong global reputation.",
      programsCount: 35,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £26,000"
    },
    {
      id: "uel-005",
      name: "University of East London",
      country: "United Kingdom",
      location: "London",
      image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=300&fit=crop&auto=format", // Modern university library building
      description: "Career-focused university with strong links to industry and professional practice.",
      programsCount: 18,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£2500",
      tuitionFee: "£14,000 - £18,000"
    },
    {
      id: "soton-006",
      name: "University of Southampton",
      country: "United Kingdom",
      location: "Southampton",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format", // Research university complex
      description: "Leading research university known for engineering, computer science, and medicine.",
      programsCount: 40,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£2000",
      tuitionFee: "£21,000 - £27,000"
    },
    {
      id: "aston-007",
      name: "Aston University",
      country: "United Kingdom",
      location: "Birmingham",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&auto=format", // University administration building
      description: "Business-focused university with excellent graduate employment rates.",
      programsCount: 22,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£10,000",
      tuitionFee: "£17,000 - £22,000"
    },
    {
      id: "exeter-008",
      name: "University of Exeter",
      country: "United Kingdom",
      location: "Exeter",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop&auto=format", // University college architecture
      description: "Russell Group university with beautiful campuses and excellent academic reputation.",
      programsCount: 28,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£10,000",
      tuitionFee: "£22,000 - £28,000"
    },
    {
      id: "ntu-009",
      name: "Nottingham Trent University - City Campus",
      country: "United Kingdom",
      location: "Nottingham",
      image: "https://images.unsplash.com/photo-1607457937751-4ad356b9ebc1?w=400&h=300&fit=crop&auto=format", // University lecture building
      description: "Modern university known for innovative teaching and strong industry connections.",
      programsCount: 26,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£4000",
      tuitionFee: "£15,000 - £19,000"
    },
    {
      id: "essex-010",
      name: "University of Essex - Colchester Campus",
      country: "United Kingdom",
      location: "Colchester",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&auto=format", // University building complex
      description: "Research-intensive university known for political science and economics.",
      programsCount: 24,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£18,000 - £23,000"
    },
    {
      id: "bath-011",
      name: "University of Bath",
      country: "United Kingdom",
      location: "Bath",
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&auto=format", // Prestigious university facade
      description: "Prestigious university known for engineering, management, and architecture.",
      programsCount: 32,
      eligibility: "70%+ in UG",
      scholarshipAmount: "£15,000",
      tuitionFee: "£23,000 - £29,000"
    },
    {
      id: "uea-012",
      name: "University of East Anglia (UEA)",
      country: "United Kingdom",
      location: "Norwich",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&auto=format", // University academic facility
      description: "Top-ranked university known for creative writing, environmental sciences, and media.",
      programsCount: 29,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£6000",
      tuitionFee: "£17,000 - £22,000"
    },
    {
      id: "rav-013",
      name: "Ravensbourne University London",
      country: "United Kingdom",
      location: "London",
      image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=400&h=300&fit=crop&auto=format", // Modern university building
      description: "Specialist university for digital media, design, and technology.",
      programsCount: 15,
      eligibility: "50%+ in UG",
      scholarshipAmount: "£3000",
      tuitionFee: "£16,500 - £20,000"
    },
    {
      id: "strath-014",
      name: "University of Strathclyde, Glasgow",
      country: "United Kingdom",
      location: "Glasgow",
      image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&auto=format", // Scottish university architecture
      description: "Leading technological university with strong industry partnerships.",
      programsCount: 35,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£12,000",
      tuitionFee: "£19,000 - £25,000"
    },
    {
      id: "cardiff-015",
      name: "Cardiff University - Cathays Park",
      country: "United Kingdom",
      location: "Cardiff",
      image: "https://images.unsplash.com/photo-1580457616440-3a3be50bb70f?w=400&h=300&fit=crop&auto=format", // Welsh university building
      description: "Russell Group university with excellent research facilities and student satisfaction.",
      programsCount: 38,
      eligibility: "60%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£20,000 - £26,000"
    },
    {
      id: "herts-016",
      name: "University of Hertfordshire",
      country: "United Kingdom",
      location: "Hatfield",
      image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=400&h=300&fit=crop&auto=format", // Modern university campus
      description: "Modern university known for business, engineering, and creative arts.",
      programsCount: 27,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£4000 + £1000 tuition discount",
      tuitionFee: "£14,000 - £18,000"
    },
    {
      id: "lonmet-017",
      name: "London Metropolitan University - Holloway",
      country: "United Kingdom",
      location: "London",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&auto=format", // London university building
      description: "Diverse university in the heart of London with strong community focus.",
      programsCount: 20,
      eligibility: "50%+ in UG (creative minds)",
      scholarshipAmount: "£3000",
      tuitionFee: "£13,000 - £17,000"
    },
    {
      id: "qub-018",
      name: "Queen's University Belfast",
      country: "United Kingdom",
      location: "Belfast",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format", // Belfast university building
      description: "Leading research university and member of the Russell Group.",
      programsCount: 33,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£7500",
      tuitionFee: "£18,000 - £24,000"
    },
    {
      id: "hw-019",
      name: "Heriot-Watt University - Edinburgh",
      country: "United Kingdom",
      location: "Edinburgh",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&auto=format", // Edinburgh university campus
      description: "Specialist university known for engineering, business, and built environment.",
      programsCount: 25,
      eligibility: "55%+ in UG",
      scholarshipAmount: "£6000",
      tuitionFee: "£19,000 - £24,000"
    },
    {
      id: "cran-020",
      name: "Cranfield University",
      country: "United Kingdom",
      location: "Cranfield",
      image: "https://images.unsplash.com/photo-1580536655246-518764bf4118?w=400&h=300&fit=crop&auto=format", // Academic building exterior
      description: "Exclusively postgraduate university specializing in science, engineering, technology and management.",
      programsCount: 45,
      eligibility: "65%+ in UG",
      scholarshipAmount: "£5000",
      tuitionFee: "£22,000 - £38,000"
    }
  ];

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set universities data on component mount
  useEffect(() => {
    setUniversities(cashbackUniversitiesData);
  }, []);

  // Authentication functions
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const isLoggedIn = () => {
    const userId = getUserId();
    const accessToken = getAccessToken();
    return userId && accessToken;
  };

  const createAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    };
  };

  const handleAuthError = (err: any, navigate: any) => {
    if (err.response?.status === 401) {
      sessionStorage.setItem("redirectPath", window.location.pathname);
      sessionStorage.setItem("fromStudyAbroad", "true");
      navigate("/whatsapplogin?primaryType=STUDENT");
      return true;
    }
    return false;
  };

  const handleLoginRedirect = (redirectPath?: string) => {
    sessionStorage.setItem("redirectPath", redirectPath || window.location.pathname);
    sessionStorage.setItem("fromStudyAbroad", "true");
    navigate("/whatsapplogin?primaryType=STUDENT");
  };

  // Fetch courses for a specific university
  const fetchUniversityCourses = async (universityName: string, universityCountry: string = "United Kingdom") => {
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
        setCoursesError(`No courses found for ${universityName} in our database. You can enter your desired program manually.`);
      }
    } catch (err: any) {
      console.error("Error fetching university courses:", err);
      setAvailableCoursesForApplication([]);
      setCoursesError("Unable to load courses. You can enter your desired program manually.");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Submit application function
  const submitApplication = async () => {
    if (!selectedUniversityForApplication || !applicationData.selectedCourse) return;

    const userId = getUserId();
    if (!userId) {
      handleLoginRedirect();
      return;
    }

    const selectedCourse = availableCoursesForApplication.find((course) => course.courseName === applicationData.selectedCourse);
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
          intakeYear: applicationData.intake.split(" ")[1] || new Date().getFullYear().toString(),
          remarks: applicationData.remarks,
          universityName: selectedCourse.university || selectedUniversityForApplication.name,
          userId: userId,
          universityId: selectedCourse.universityId || selectedUniversityForApplication.id,
        },
        createAuthConfig()
      );

      if (response.status === 200 || response.status === 201 || response.data?.success !== false) {
        setApplicationSuccess(true);
        setApplicationResponse(response.data);
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

          // Navigate to applications tab instead of route navigation
          if (onNavigate) {
            onNavigate("applications");
          } else {
            navigate("/student-dashboard");
          }
        }, 3000);
      } else {
        setApplicationError(response.data?.message || "Application submission failed");
      }
    } catch (err: unknown) {
      console.error("Error submitting application:", err);

      if (handleAuthError(err, navigate)) {
        return;
      }

      let errorMessage = "Failed to submit application. Please try again.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: any } };

        if (axiosError.response?.status === 201) {
          setApplicationSuccess(true);
          setApplicationResponse(axiosError.response.data);
          setSelectedCourseForApplication(selectedCourse);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
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

            if (onNavigate) {
              onNavigate("applications");
            } else {
              navigate("/student-dashboard");
            }
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

      await fetchUniversityCourses(university.name, university.country || "United Kingdom");
    } catch (error) {
      console.error("Error in handleApplyNow:", error);
      setApplicationError("Failed to initialize application. Please try again.");
    }
  };

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Top 20 UK Universities with 5% Cashback</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Apply to any of these prestigious UK universities and get 5% cashback on your tuition fees, plus access to exclusive scholarships and fast-track application processing.
          </p>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {universities.map((university, index) => (
    <div
      key={university.id}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 hover:scale-[1.01]"
      style={{ animationDelay: `${index * 50}ms`, minHeight: "480px" }}
    >
      <div className="relative overflow-hidden">
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&h=300&fit=crop&auto=format";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Compact Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">💰 5% Cashback</span>
          {university.specialOffer && (
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md animate-pulse">🔥 {university.specialOffer}</span>
          )}
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors duration-300" style={{ minHeight: "2.5rem" }}>
            {university.name}
          </h3>

          <div className="flex items-center text-purple-600 text-xs mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="font-medium">{university.location}</span>
          </div>

          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3" style={{ minHeight: "2.5rem" }}>
            {university.description}
          </p>

          {/* Compact University Details */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <BookOpen className="w-3 h-3 text-purple-600" />
                <span className="font-semibold">{university.programsCount}+ Programs</span>
              </div>
              <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}</div>
            </div>

            {university.tuitionFee && (
              <div className="flex items-center gap-1 text-xs">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-green-600">Tuition:</span> {university.tuitionFee}
                </span>
              </div>
            )}

            {university.scholarshipAmount && (
              <div className="flex items-center gap-1 text-xs">
                <Award className="w-3 h-3 text-orange-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-orange-600">Scholarship:</span> {university.scholarshipAmount}
                </span>
              </div>
            )}

            {university.eligibility && (
              <div className="bg-blue-50 p-1.5 rounded-md">
                <span className="text-xs text-blue-800 font-semibold">Eligibility: {university.eligibility}</span>
              </div>
            )}
          </div>

          {/* Compact Featured Programs */}
          {university.featuredPrograms && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Popular Programs:</h4>
              <div className="flex flex-wrap gap-1">
                {university.featuredPrograms.slice(0, 2).map((program, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {program}
                  </span>
                ))}
                {university.featuredPrograms.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full font-medium">+{university.featuredPrograms.length - 2} more</span>
                )}
              </div>
            </div>
          )}

          {/* Compact Available Intakes */}
          {university.intakes && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Next Intakes:</h4>
              <div className="flex flex-wrap gap-1">
                {university.intakes.slice(0, 2).map((intake, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CalendarDays className="w-2.5 h-2.5" />
                    {intake}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compact Apply Button */}
        <div className="mt-auto pt-2">
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => handleApplyNow(university)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Apply Now & Get 5% Cashback</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Ready to Start Your UK Education Journey?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't miss out on this exclusive 5% cashback offer! Apply to any of these top UK universities and start saving on your education costs today.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">5% Guaranteed Cashback</h4>
                <p className="text-sm text-gray-600">Get 5% back on all tuition fee payments</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Exclusive Scholarships</h4>
                <p className="text-sm text-gray-600">Access to additional scholarship opportunities</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Fast Processing</h4>
                <p className="text-sm text-gray-600">Quick application review and acceptance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedUniversityForApplication && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Apply to {selectedUniversityForApplication.name}</h3>
                <button
                  onClick={() => {
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
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted Successfully! 🎉</h4>
                  <p className="text-gray-600 mb-6 text-base">
                    Your application for {applicationData.selectedCourse} at {selectedUniversityForApplication.name} has been received.
                  </p>

                  {/* Enhanced cashback confirmation */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-green-600 mr-2" />
                      <h5 className="font-bold text-green-800 text-lg">🎉 Congratulations! You're eligible for:</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-xl font-bold text-green-600 mb-1">💰 5% Cashback</div>
                        <p className="text-gray-600">Will be credited after fee payment</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="text-xl font-bold text-green-600 mb-1">💸 {selectedUniversityForApplication.totalSavings}</div>
                        <p className="text-gray-600">Total potential savings</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl text-left mb-6">
                    <h5 className="font-bold mb-3 text-base">Application Details:</h5>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Course:</span> {applicationData.selectedCourse}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">University:</span> {selectedUniversityForApplication.name}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Intake:</span> {applicationData.intake}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">Cashback:</span> 5% on tuition fees
                    </p>
                    {applicationResponse?.applicationId && (
                      <p className="text-sm mt-3">
                        <span className="font-semibold">Application ID:</span> {applicationResponse.applicationId}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800 font-semibold">
                      <strong>🚀 Redirecting to your applications in a few seconds...</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Track your application status and cashback in your dashboard.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-base">University Information:</h4>
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={selectedUniversityForApplication.image}
                          alt={selectedUniversityForApplication.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=64&h=64&fit=crop&auto=format";
                          }}
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-base">{selectedUniversityForApplication.name}</p>
                          <p className="text-sm text-gray-600">{selectedUniversityForApplication.location}</p>
                        </div>
                      </div>

                      {/* Enhanced benefits display */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">💰 Get Upto 5% Cashback:</span> 
                          </p>
                        </div>
                        {selectedUniversityForApplication?.scholarshipAmount && (
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <p className="text-sm text-purple-800">
                              <span className="font-semibold">🎓 Scholarship:</span> {selectedUniversityForApplication.scholarshipAmount}
                            </p>
                          </div>
                        )}
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
                      {/* Course Selection */}
                      <div className="relative">
                        <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Course/Program *
                        </label>
                        {isLoadingCourses ? (
                          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5 text-purple-600" />
                            <span className="text-gray-600 font-medium text-sm">Loading courses for {selectedUniversityForApplication?.name}...</span>
                          </div>
                        ) : availableCoursesForApplication.length > 0 ? (
                          <div className="space-y-3">
                            <div className="relative">
                              <select
                                id="course"
                                value={applicationData.selectedCourse}
                                onChange={(e) => setApplicationData({ ...applicationData, selectedCourse: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: "right 0.75rem center",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "1.25em",
                                }}
                                required
                              >
                                <option value="">Choose a course/program</option>
                                {availableCoursesForApplication.map((course, index) => (
                                  <option key={index} value={course.courseName}>
                                    {course.courseName} {course.degree && ` (${course.degree})`}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                              ✅ Found {availableCoursesForApplication.length} courses for {selectedUniversityForApplication?.name}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {coursesError && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <p className="text-xs text-yellow-800">{coursesError}</p>
                                </div>
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Enter the program you're interested in (e.g., Master of Business Administration, Computer Science, etc.)"
                              value={applicationData.selectedCourse}
                              onChange={(e) => setApplicationData({ ...applicationData, selectedCourse: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm shadow-sm"
                              required
                            />
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => fetchUniversityCourses(selectedUniversityForApplication?.name || "", selectedUniversityForApplication?.country || "United Kingdom")}
                                className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50 font-medium"
                                disabled={isLoadingCourses}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retry loading courses
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Intake Selection */}
                      <div className="relative">
                        <label htmlFor="intake" className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Intake *
                        </label>
                        <div className="relative">
                          <select
                            id="intake"
                            value={applicationData.intake}
                            onChange={(e) => setApplicationData({ ...applicationData, intake: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium bg-white shadow-sm hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: "right 0.75rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.25em",
                            }}
                            required
                          >
                            <option value="">Select an intake</option>
                            {(selectedUniversityForApplication?.intakes || ["January 2026", "May 2026", "September 2026"]).map((intake, idx) => (
                              <option key={idx} value={intake}>{intake}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Remarks (Optional) */}
                      <div className="relative">
                        <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 mb-2">
                          Additional Remarks (Optional)
                        </label>
                        <textarea
                          id="remarks"
                          value={applicationData.remarks}
                          onChange={(e) => setApplicationData({ ...applicationData, remarks: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm shadow-sm"
                          placeholder="Any additional information or preferences..."
                          rows={4}
                        />
                      </div>

                      {/* Application Error */}
                      {applicationError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-9.293a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414L11.414 12l2.293 2.293a1 1 0 01-1.414 1.414L10 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 12 6.293 9.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-xs text-red-800">{applicationError}</p>
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => {
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
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingApplication}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmittingApplication ? (
                            <>
                              <Loader2 className="animate-spin h-5 w-5" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashbackUniversitiesPage;
