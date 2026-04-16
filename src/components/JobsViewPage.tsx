import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MailIcon,
  Search,
  Building2,
  MapPin,
  Clock3,
  Briefcase,
  Wallet,
  Monitor,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  CalendarX2,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../Config";
import { submitWriteToUsQuery, fetchAppliedJobsByUserId } from "./servicesapi";
import { Button, message, Select } from "antd";
import JobApplicationModal from "./JobApplyModal";
import ResumeUploadModal from "./ResumeUploadModal";

interface Job {
  id: string;
  companyLogo: string;
  jobTitle: string;
  jobDesignation: string;
  companyName: string;
  industry: string;
  userId: string;
  jobLocations: string;
  jobType: string;
  description: string;
  benefits: string;
  jobStatus: boolean;
  skills: string | null;
  salaryMin: number;
  salaryMax: number;
  qualifications: number;
  applicationDeadLine: number;
  experience: string;
  createdAt: number;
  updatedAt: number;
  workMode: string;
  contactNumber: string;
  countryCode: string;
  payRateFrequencyType: string;
}

type FilterKey =
  | "industry"
  | "jobType"
  | "location"
  | "experience"
  | "salaryRange"
  | "skills";

const { Option } = Select;

const JobViewPage: React.FC = () => {
  const [showResumeModal, setShowResumeModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { id: urlId, company } = useParams<{ id: string; company: string }>();
  const id = urlId === "default" ? null : urlId || location.state?.id;
  const currentCompany = company || "ALL";
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    industry: "",
    jobType: "",
    location: "",
    experience: "",
    salaryRange: "",
    skills: "",
  });
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const email = profileData.customerEmail || null;
  const userId = localStorage.getItem("userId");
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNoAgentPopup, setShowNoAgentPopup] = useState(false);
  const [applyselectedJob, setApplySelectedJob] = useState<{
    jobDesignation: string;
    companyName: string;
  } | null>(null);
  const [displayedJobsCount, setDisplayedJobsCount] = useState(20);
  const [companyNames, setCompanyNames] = useState<{ [key: string]: string }>(
    {},
  );

  const cleanLocation = (location: string): string => {
    if (!location) return "";

    // Remove all unwanted patterns more aggressively
    let cleaned = location
      .replace(/\b\d{6}\b/g, "") // Remove 6-digit pincodes
      .replace(/\b\d{5}\b/g, "") // Remove 5-digit codes
      .replace(/\b[A-Z]{2,3}\b/g, "") // Remove state codes like AP, TS, etc
      .replace(/\bnodioa\b/gi, "") // Remove "nodioa"
      .replace(/\b\d+th\s+floor\b/gi, "") // Remove "10th floor" etc
      .replace(/\bfloor\b/gi, "") // Remove "floor"
      .replace(/\bdoor\s+no\b/gi, "") // Remove "door no"
      .replace(/\bplot\s+no\b/gi, "") // Remove "plot no"
      .replace(/\bplot\b/gi, "") // Remove "plot"
      .replace(/\b\d+-\d+\b/g, "") // Remove number ranges like "12-34"
      .replace(/\b\d+\b/g, "") // Remove all standalone numbers
      .replace(/[,\s]+/g, " ") // Replace multiple commas/spaces with single space
      .replace(/[^a-zA-Z\s]/g, "") // Remove all non-alphabetic characters except spaces
      .trim();

    // Only accept known major cities
    const validCities = {
      hyderabad: "Hyderabad",
      bangalore: "Bangalore",
      bengaluru: "Bangalore",
      chennai: "Chennai",
      mumbai: "Mumbai",
      delhi: "Delhi",
      pune: "Pune",
      kolkata: "Kolkata",
      ahmedabad: "Ahmedabad",
      surat: "Surat",
      jaipur: "Jaipur",
      lucknow: "Lucknow",
      kanpur: "Kanpur",
      nagpur: "Nagpur",
      indore: "Indore",
      thane: "Thane",
      bhopal: "Bhopal",
      visakhapatnam: "Visakhapatnam",
      pimpri: "Pimpri-Chinchwad",
      patna: "Patna",
      vadodara: "Vadodara",
      ghaziabad: "Ghaziabad",
      ludhiana: "Ludhiana",
      agra: "Agra",
      nashik: "Nashik",
      faridabad: "Faridabad",
      meerut: "Meerut",
      rajkot: "Rajkot",
      kalyan: "Kalyan-Dombivli",
      vasai: "Vasai-Virar",
      varanasi: "Varanasi",
      srinagar: "Srinagar",
      aurangabad: "Aurangabad",
      dhanbad: "Dhanbad",
      amritsar: "Amritsar",
      "navi mumbai": "Navi Mumbai",
      allahabad: "Allahabad",
      ranchi: "Ranchi",
      howrah: "Howrah",
      coimbatore: "Coimbatore",
      jabalpur: "Jabalpur",
      gwalior: "Gwalior",
      vijayawada: "Vijayawada",
      jodhpur: "Jodhpur",
      madurai: "Madurai",
      raipur: "Raipur",
      kota: "Kota",
      guwahati: "Guwahati",
      chandigarh: "Chandigarh",
      solapur: "Solapur",
      hubli: "Hubli-Dharwad",
      tiruchirappalli: "Tiruchirappalli",
      bareilly: "Bareilly",
      mysore: "Mysore",
      tiruppur: "Tiruppur",
      gurgaon: "Gurgaon",
      aligarh: "Aligarh",
      jalandhar: "Jalandhar",
      bhubaneswar: "Bhubaneswar",
      salem: "Salem",
      warangal: "Warangal",
      guntur: "Guntur",
      bhiwandi: "Bhiwandi",
      saharanpur: "Saharanpur",
      gorakhpur: "Gorakhpur",
      bikaner: "Bikaner",
      amravati: "Amravati",
      noida: "Noida",
      jamshedpur: "Jamshedpur",
      bhilai: "Bhilai",
      cuttack: "Cuttack",
      firozabad: "Firozabad",
      kochi: "Kochi",
      nellore: "Nellore",
      bhavnagar: "Bhavnagar",
      dehradun: "Dehradun",
      durgapur: "Durgapur",
      asansol: "Asansol",
      rourkela: "Rourkela",
      nanded: "Nanded",
      kolhapur: "Kolhapur",
      ajmer: "Ajmer",
      akola: "Akola",
      gulbarga: "Gulbarga",
      jamnagar: "Jamnagar",
      ujjain: "Ujjain",
      loni: "Loni",
      siliguri: "Siliguri",
      jhansi: "Jhansi",
      ulhasnagar: "Ulhasnagar",
      jammu: "Jammu",
      sangli: "Sangli-Miraj & Kupwad",
      mangalore: "Mangalore",
      erode: "Erode",
      belgaum: "Belgaum",
      ambattur: "Ambattur",
      tirunelveli: "Tirunelveli",
      malegaon: "Malegaon",
      gaya: "Gaya",
      jalgaon: "Jalgaon",
      udaipur: "Udaipur",
      maheshtala: "Maheshtala",
    };

    const lowerCleaned = cleaned.toLowerCase();

    // Check if it matches any valid city
    for (const [key, value] of Object.entries(validCities)) {
      if (lowerCleaned.includes(key)) {
        return value;
      }
    }

    // If no valid city found, return empty string (will be filtered out)
    return "";
  };

  const cleanExperience = (experience: string): string => {
    if (!experience) return "";

    // Remove unwanted patterns
    let cleaned = experience
      .replace(/\bgood\s+years?\b/gi, "") // Remove "good years"
      .replace(/\bprofessional\b/gi, "") // Remove "professional"
      .replace(/\bexperience\b/gi, "") // Remove "experience"
      .replace(/[,\s]+/g, " ") // Replace multiple spaces with single space
      .trim();

    // Only accept valid experience patterns
    const validPatterns = [
      /^\d+-\d+\s*years?$/i, // "1-3 years", "2-5 years"
      /^\d+\s*years?$/i, // "2 years", "5 years"
      /^\d+\+\s*years?$/i, // "5+ years"
      /^fresher$/i, // "fresher"
      /^entry\s*level$/i, // "entry level"
      /^senior$/i, // "senior"
      /^junior$/i, // "junior"
    ];

    // Check if cleaned experience matches any valid pattern
    const isValid = validPatterns.some((pattern) => pattern.test(cleaned));

    if (isValid) {
      // Standardize the format
      if (/^\d+$/.test(cleaned)) {
        return `${cleaned} years`;
      }
      return cleaned;
    }

    // If no valid pattern found, return empty string (will be filtered out)
    return "";
  };

  const uniqueLocations = Array.from(
    new Set(
      jobs.flatMap((job) => {
        if (!job.jobLocations?.trim()) return [];
        return job.jobLocations
          .split(",")
          .map((loc) => cleanLocation(loc.trim()))
          .filter((loc) => loc && loc.length > 0); // Only keep valid cities
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const uniqueExperience = Array.from(
    new Set(
      jobs
        .map((job) => cleanExperience(job.experience?.trim() || ""))
        .filter((exp) => exp && exp.length > 0), // Only keep valid experience
    ),
  ).sort();

  const uniqueIndustries = Array.from(
    new Set([
      "AI Jobs",
      ...jobs
        .map((job) => job.industry?.trim())
        .filter(
          (ind): ind is string =>
            !!ind &&
            ind.length > 0 &&
            ind.toLowerCase() !== "null" &&
            ind.toLowerCase() !== "undefined",
        ),
    ]),
  ).sort();

  const formatLPA = (num: number) => {
    if (!num) return "0";
    return (num / 100000).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  };

  const getSalaryString = (j: Job) =>
    `₹${formatLPA(j.salaryMin)} - ₹${formatLPA(j.salaryMax)} LPA`;

  const uniqueSalaries = Array.from(
    new Set(
      jobs
        .filter((j) => j.salaryMin > 0 || j.salaryMax > 0)
        .map((j) => getSalaryString(j)),
    ),
  ).sort();

  // 🔐 Read auth token (same format as other pages)
  const readAuth = () => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const safeSplit = (value: any): string[] => {
    if (!value || typeof value !== "string") return [];

    return value
      .split(",")
      .map((v) => v.trim())
      .filter(
        (v) =>
          v && v.toLowerCase() !== "null" && v.toLowerCase() !== "undefined",
      );
  };

  // 🔐 Read accessToken directly (same as other pages)
  const buildAuthHeaders = (): HeadersInit => {
    if (typeof window === "undefined") return {};

    const token = localStorage.getItem("accessToken");
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ✅ Check if user has any assistants
  const checkUserHasAgent = async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/allAgentDataList?userId=${encodeURIComponent(userId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...buildAuthHeaders(),
          },
        },
      );

      if (!res.ok) return false;

      const data = await res.json();
      const hasAssistants =
        data?.assistants &&
        Array.isArray(data.assistants) &&
        data.assistants.length > 0;

      console.log("allAgentDataList →", data, "hasAssistants =", hasAssistants);
      return hasAssistants;
    } catch (err) {
      console.error("Error checking allAgentDataList:", err);
      return false;
    }
  };

  useEffect(() => {
    console.log("this is the id from state" + id);

    if (id) {
      const job = jobs.find((job) => job.id === id);
      if (job) {
        setSelectedJob(job);
      }
    }

    const redirectJobId = sessionStorage.getItem("redirectJobId");
    if (redirectJobId && jobs.length > 0) {
      const job = jobs.find((job) => job.id === redirectJobId);
      if (job) {
        setSelectedJob(job);
        sessionStorage.removeItem("redirectJobId");
      }
    }
  }, [id, jobs]);

  useEffect(() => {
    const fetchJobsApplied = async () => {
      const appliedJobs = await fetchAppliedJobsByUserId(userId);
      const jobIdSet = new Set(appliedJobs.map((job: any) => job.jobId));
      setAppliedJobIds(jobIdSet);
    };

    if (!isModalOpen) {
      fetchJobsApplied();
    }
  }, [userId, isModalOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getUniqueSkills = (): string[] => {
    const allSkills = jobs.flatMap((job) => safeSplit(job.skills));
    return Array.from(new Set(allSkills));
  };

  const getSalaryRanges = () => [
    { label: "₹0 - ₹3 LPA", min: 0, max: 300000 },
    { label: "₹3 - ₹6 LPA", min: 300000, max: 600000 },
    { label: "₹6 - ₹10 LPA", min: 600000, max: 1000000 },
    { label: "₹10 - ₹15 LPA", min: 1000000, max: 1500000 },
    { label: "₹15+ LPA", min: 1500000, max: Infinity },
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    fetchJobs(currentCompany);
  }, [currentCompany]);

  useEffect(() => {
    fetchCompanyNames();
  }, []);

  const fetchCompanyNames = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/distinct-company-names`,
      );
      const data = await response.json();
      setCompanyNames(data || {});
    } catch (error) {
      console.error("Error fetching company names:", error);
    }
  };

  useEffect(() => {
    const isPassed = sessionStorage.getItem("examPassed") === "true";

    if (location.state?.openApplyModal && selectedJob) {
      setApplySelectedJob({
        jobDesignation: selectedJob.jobDesignation,
        companyName: selectedJob.companyName,
      });

      if (isPassed) {
        // ✅ AFTER EXAM PASS → FULL FORM
        setIsModalOpen(true);
      } else {
        // 🔥 FIRST TIME → RESUME UPLOAD
        setShowResumeModal(true);
      }

      const { openApplyModal, ...restState } = location.state || {};

      navigate(location.pathname, {
        replace: true,
        state: restState,
      });
    }
  }, [location.state, selectedJob]);

  useEffect(() => {
    filterJobs();
    setDisplayedJobsCount(20); // Reset pagination when filters change
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async (compName: string) => {
    setLoading(true);
    try {
      let url = "";
      if (compName === "ALL") {
        url = `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`;
      } else if (compName === "AI Jobs") {
        url = `${BASE_URL}/marketing-service/campgin/get-ai-jobs`;
      } else {
        url = `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=${encodeURIComponent(compName)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      const jobsArray = Array.isArray(data) ? data : [];
      const activeJobs = jobsArray.filter((job: Job) => job.jobStatus === true);
      setJobs(activeJobs);

      // If there's an ID in the URL, try to set it as selectedJob
      if (id) {
        const matchedJob = activeJobs.find((job: Job) => job.id === id);
        if (matchedJob) {
          setSelectedJob(matchedJob);
        }
      } else {
        setSelectedJob(null);
      }
      setFilteredJobs(activeJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(lowerSearch) ||
          job.companyName?.toLowerCase().includes(lowerSearch) ||
          safeSplit(job.skills).join(" ").toLowerCase().includes(lowerSearch) ||
          job.industry?.toLowerCase().includes(lowerSearch) ||
          job.jobLocations?.toLowerCase().includes(lowerSearch),
      );
    }

    if (filters.industry) {
      filtered = filtered.filter((job) =>
        job.industry?.toLowerCase().includes(filters.industry.toLowerCase()),
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) =>
        job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase()),
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) => {
        const cleanedJobLocation = cleanLocation(job.jobLocations || "");
        return cleanedJobLocation
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      });
    }

    if (filters.experience) {
      filtered = filtered.filter((job) => {
        const cleanedJobExperience = cleanExperience(job.experience || "");
        return cleanedJobExperience
          .toLowerCase()
          .includes(filters.experience.toLowerCase());
      });
    }

    if (filters.salaryRange) {
      filtered = filtered.filter((job) => {
        return getSalaryString(job) === filters.salaryRange;
      });
    }

    if (filters.skills) {
      filtered = filtered.filter((job) =>
        safeSplit(job.skills)
          .join(" ")
          .toLowerCase()
          .includes(filters.skills.toLowerCase()),
      );
    }

    setFilteredJobs(filtered);
  };

  const getUniqueValues = (key: keyof Job): string[] => {
    const valueMap = new Map<string, string>(); // lowercase -> original (formatted)

    jobs.forEach((job) => {
      const rawValue = job[key];
      if (!rawValue) return;

      const items = safeSplit(rawValue);

      items.forEach((item) => {
        const normalized = item.toLowerCase();
        if (!valueMap.has(normalized)) {
          // Store only the first seen original casing
          valueMap.set(normalized, item);
        }
      });
    });

    return Array.from(valueMap.values());
  };

  const handleClick = async (
    jobId: string,
    jobDesignation: string,
    companyName: string,
  ) => {
    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsapplogin");
      sessionStorage.setItem(
        "redirectPath",
        `/main/viewjobdetails/${jobId}/${currentCompany}`,
      );
      return;
    }

    const hasAgent = await checkUserHasAgent();

    if (!hasAgent) {
      setShowNoAgentPopup(true);
      return;
    }

    const isPassed = sessionStorage.getItem("examPassed") === "true";

    setApplySelectedJob({ jobDesignation, companyName });

    if (isPassed) {
      // ✅ AFTER PASS → FULL FORM
      setIsModalOpen(true);
    } else {
      // ✅ FIRST TIME → RESUME
      setShowResumeModal(true);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "industry" && value === "AI Jobs") {
      // When AI Jobs is selected from industry filter, navigate to AI Jobs company page
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const prefix =
        token && userId ? "/main/viewjobdetails" : "/viewjobdetails";
      navigate(`${prefix}/default/AI Jobs`);
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      industry: "",
      jobType: "",
      location: "",
      experience: "",
      salaryRange: "",
      skills: "",
    });
    setSearchTerm("");

    // Reset to All Jobs if not already there
    if (currentCompany !== "ALL") {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const prefix =
        token && userId ? "/main/viewjobdetails" : "/viewjobdetails";
      navigate(`${prefix}/default/ALL`);
    }
  };

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    // ✅ FIX START
    const safeMobile = finalMobileNumber || "";
    const safeEmail = email || "";
    const safeUserId = userId || "";

    if (!safeMobile) {
      message.error("Please update your mobile number");
      return;
    }

    if (!safeEmail) {
      message.error("Please update your email");
      return;
    }
    // ✅ FIX END

    const success = await submitWriteToUsQuery(
      safeEmail,
      safeMobile, // ✅ always string
      query,
      "FREESAMPLE",
      safeUserId,
    );

    if (success) {
      message.success("Query submitted successfully");
      setIsOpen(false);
    } else {
      message.error("Failed to send query. Please try again.");
    }
  };

  const handleWriteToUs = () => {
    if (!userId) {
      message.warning("Please login to submit your Query.");
      navigate("/whatsapplogin");
      sessionStorage.setItem(
        "redirectPath",
        `/main/viewjobdetails${selectedJob ? `/${selectedJob.id}/${currentCompany}` : ""}`,
      );
    }
    if (
      !email ||
      email === "null" ||
      !finalMobileNumber ||
      finalMobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const formatSalary = (
    min: number,
    max: number,
    payRateFrequencyType?: string,
  ) => {
    const salaryRange = `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    return payRateFrequencyType
      ? `${salaryRange} ${payRateFrequencyType}`
      : salaryRange;
  };
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  const formatDateWithBoth = (timestamp: number) => {
    const date = new Date(timestamp);

    // const ist = date.toLocaleString("en-IN", {
    //   timeZone: "Asia/Kolkata",
    //   dateStyle: "medium",
    //   timeStyle: "short",
    // });

    const utc = date.toLocaleString("en-IN", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });

    return `   ${utc}`;
  };
  const autoFormatDescription = (text: string) => {
    const lines = text.split("\n");

    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();

      const isLikelyHeading =
        (/^[A-Z0-9\s&.,'()\-]+$/.test(trimmed) && trimmed.length > 0) ||
        trimmed.endsWith(":") ||
        (trimmed.length < 60 && /^[A-Z]/.test(trimmed));

      if (isLikelyHeading) {
        return `<span class="font-semibold text-gray-900 block mt-4 mb-1">${trimmed}</span>`;
      }

      return trimmed;
    });

    return formattedLines.join("\n");
  };

  const handleJobSelect = (job: Job) => {
    if (!userId) {
      message.warning("Please login to view job details.");
      navigate("/whatsapplogin");
      sessionStorage.setItem(
        "redirectPath",
        `/main/viewjobdetails/${job.id}/${currentCompany}`,
      );
      sessionStorage.setItem("redirectJobId", job.id);
      return;
    }
    const pathPrefix = "/main/viewjobdetails";

    navigate(`${pathPrefix}/${job.id}/${currentCompany}`);
    setSelectedJob(job);
    window.scrollTo({
      top: 200,
      behavior: "smooth",
    });
  };

  const JobCard = ({
    job,
    isCompact = false,
  }: {
    job: Job;
    isCompact?: boolean;
  }) => {
    const lightBackgroundColors = [
      "bg-gradient-to-br from-blue-50 to-indigo-100",
      "bg-gradient-to-br from-emerald-50 to-teal-100",
      "bg-gradient-to-br from-violet-50 to-purple-100",
      "bg-gradient-to-br from-rose-50 to-pink-100",
      "bg-gradient-to-br from-amber-50 to-orange-100",
      "bg-gradient-to-br from-cyan-50 to-sky-100",
      "bg-gradient-to-br from-lime-50 to-green-100",
      "bg-gradient-to-br from-fuchsia-50 to-pink-100",
    ];

    // Find index of job in filteredJobs to get stable color
    const index = filteredJobs.findIndex((j) => j.id === job.id);
    const bgColor =
      lightBackgroundColors[
        (index >= 0 ? index : 0) % lightBackgroundColors.length
      ];

    return (
      <motion.div
        variants={itemVariants}
        className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl
        transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
        flex flex-col border border-gray-100 ${isCompact ? "m-1" : "m-2"}`}
        onClick={() => handleJobSelect(job)}
      >
        <div className="pt-6 pb-4 flex justify-center">
          <div className="w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 bg-white p-2">
            <img
              src={
                job.companyLogo ||
                "https://oxybricksv1.s3.ap-south-1.amazonaws.com/null/45880e62-acaf-4645-a83e-d1c8498e923e/aadhar_partnerlogo.png"
              }
              className="w-40 h-20 object-contain transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://oxybricksv1.s3.ap-south-1.amazonaws.com/null/45880e62-acaf-4645-a83e-d1c8498e923e/aadhar_partnerlogo.png";
              }}
            />
          </div>
        </div>
        <div className="flex justify-center items-center px-4 pb-3">
          <div
            className={`${bgColor} py-2 px-4 rounded-xl flex justify-center items-center`}
          >
            <span className="text-base font-semibold text-gray-700 text-center">
              {job.companyName}
            </span>
          </div>
        </div>
        <div className="px-4 pb-1">
          <h3 className="text-lg font-bold text-gray-800 text-center line-clamp-2">
            {job.jobTitle}
          </h3>
        </div>
        <div className="px-2 pb-2">
          <div className="text-sm font-bold text-gray-700 text-center bg-gray-50 py-2 px-3 rounded-lg">
            💼 {job.jobDesignation}
          </div>
        </div>
        <div className="px-4 pb-3 space-y-1 text-center">
          <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
            📍 Loc: {job.jobLocations}
          </div>
          <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
            ⏰ Exp: {job.experience}
          </div>
        </div>
        <div className="px-4 pb-5 mt-auto flex justify-center">
          {appliedJobIds.has(job.id) ? (
            <div className="flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2.5 px-8 rounded-full font-bold text-sm shadow-sm border border-green-100">
              <CheckCircle2 className="w-5 h-5" /> Applied
            </div>
          ) : (
            <div className="bg-indigo-100 text-indigo-600 py-2.5 px-8 rounded-full font-bold text-sm transition-all duration-300 shadow-md">
              View Job Details
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const JobDetailsComponent = ({ job }: { job: Job }) => {
    const jobDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (jobDetailsRef.current) {
        jobDetailsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, [job.id]);

    const isEmpty = (value: any) =>
      value == null ||
      value === "" ||
      (typeof value === "string" && value.trim() === "");

    const hasArrayContent = (value: any) => safeSplit(value).length > 0;

    const hasValidSalary = (min: any, max: any) => {
      const minSalary = parseFloat(min) || 0;
      const maxSalary = parseFloat(max) || 0;
      return minSalary > 0 || maxSalary > 0;
    };

    const formatDescription = (description: string) => {
      if (isEmpty(description)) return "";
      const lines = description
        .split(/\n|•|·|\*|-|\d+\.|\d+\)/)
        .map((l) => l.trim())
        .filter(Boolean);

      return lines.length > 1
        ? lines.map((l) => `• ${l}`).join("\n")
        : description;
    };

    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {/* Banner/Header Segment */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center md:items-start gap-5">
              <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center shadow-sm">
                <img
                  src={
                    job.companyLogo ||
                    "https://oxybricksv1.s3.ap-south-1.amazonaws.com/null/45880e62-acaf-4645-a83e-d1c8498e923e/aadhar_partnerlogo.png"
                  }
                  alt={job.companyName}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://oxybricksv1.s3.ap-south-1.amazonaws.com/null/45880e62-acaf-4645-a83e-d1c8498e923e/aadhar_partnerlogo.png";
                  }}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl md:text-1xl font-semibold text-gray-900 leading-tight">
                  {job.jobTitle || "Job Title"}
                </h1>
                {job.jobDesignation && (
                  <p className="text-blue-700 font-semibold mt-1 text-base md:text-lg">
                    {job.jobDesignation}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-sm md:text-base text-gray-600 font-medium">
                  {job.companyName && (
                    <span className="text-gray-800">{job.companyName}</span>
                  )}
                  {job.companyName && job.jobLocations && (
                    <span className="text-gray-300 hidden sm:inline">•</span>
                  )}
                  {job.jobLocations && <span>{job.jobLocations}</span>}
                  {job.createdAt && (
                    <span className="text-gray-300 hidden sm:inline">•</span>
                  )}
                  {job.createdAt && (
                    <span className="text-gray-500 font-normal">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0">
              <button
                className={`w-full md:w-auto px-8 py-3 rounded-full text-base font-bold transition-all duration-300 shadow-md transform hover:scale-105 ${
                  appliedJobIds.has(job.id)
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                }`}
                onClick={() =>
                  !appliedJobIds.has(job.id) &&
                  handleClick(job.id, job.jobDesignation, job.companyName)
                }
                disabled={appliedJobIds.has(job.id)}
              >
                {appliedJobIds.has(job.id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Applied
                  </span>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          {(() => {
            const metrics = [
              {
                icon: <MapPin className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Location",
                value: job?.jobLocations,
              },
              {
                icon: <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Job Type",
                value: job?.jobType,
              },
              {
                icon: <Clock3 className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Experience",
                value: job?.experience,
              },
              {
                icon: <Wallet className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Salary",
                value: hasValidSalary(job.salaryMin, job.salaryMax)
                  ? formatSalary(
                      job.salaryMin,
                      job.salaryMax,
                      job.payRateFrequencyType,
                    )
                  : null,
              },
              {
                icon: <Building2 className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Industry",
                value: job?.industry,
              },
              {
                icon: (
                  <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                ),
                label: "Education",
                value: job?.qualifications,
              },
              {
                icon: <Monitor className="w-5 h-5 text-blue-600 shrink-0" />,
                label: "Work Mode",
                value: job?.workMode,
              },
              {
                icon: <CalendarX2 className="w-5 h-5 text-red-500 shrink-0" />,
                label: "Deadline",
                value: job?.applicationDeadLine
                  ? new Date(job.applicationDeadLine).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : null,
                valueClass: "text-red-600",
              },
            ].filter((m) => !isEmpty(m.value));

            if (metrics.length === 0) return null;

            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mt-5 pt-5 border-t border-gray-100">
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    className="flex flex-col bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors shadow-sm cursor-default"
                    title={
                      typeof m.value === "string" && m.value.length > 20
                        ? m.value
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 text-gray-500">
                      {m.icon}
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {m.label}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold text-gray-900 ${m.valueClass || ""} truncate leading-tight`}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="p-5 md:p-6 space-y-6 bg-white">
          {/* About / Description */}
          {!isEmpty(job.description) && (
            <section>
              <h2 className="text-[17px] font-bold text-gray-900 mb-4 tracking-tight">
                Job description
              </h2>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed text-[15px] max-h-[500px] overflow-y-auto pr-4 custom-scrollbar whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: autoFormatDescription(
                    formatDescription(job.description),
                  ),
                }}
              />
            </section>
          )}

          {/* Skills Grid */}
          {hasArrayContent(job.skills) && (
            <section className="pt-2">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4 tracking-tight">
                Key Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {safeSplit(job.skills)
                  .filter(Boolean)
                  .map((skill, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-white border border-gray-300 hover:text-blue-600 transition-colors text-gray-700 text-[13px] font-semibold rounded-full cursor-default"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </section>
          )}

          {/* Benefits Grid */}
          {hasArrayContent(job.benefits) && (
            <section className="pt-2">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4 tracking-tight">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {safeSplit(job.benefits).map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start text-gray-700 text-[14px] font-medium leading-snug"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 shrink-0 mt-0.5" />
                    <span>{benefit.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Connect / Info */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-extrabold text-gray-900">
                Still have questions?
              </h3>
              <p className="text-gray-600 mt-2 font-medium">
                Our support team is always here to guide you through the
                process.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {!isEmpty(job.contactNumber) && (
                <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 px-5 py-3 rounded-xl w-full sm:w-auto justify-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  {(!isEmpty(job.countryCode) ? job.countryCode + " " : "") +
                    job.contactNumber}
                </div>
              )}
              <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 px-5 py-3 rounded-xl w-full sm:w-auto justify-center">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                support@askoxy.ai
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 mb-4 mt-6 gap-6 px-2">
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-purple-900 leading-tight">
              Find Your Next{" "}
              <span className="text-purple-900">Opportunity</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-medium mt-1">
              Discover jobs that match your skills.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleWriteToUs}
              className="bg-[#008cba] text-white hover:bg-[#008cba] px-8 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <MailIcon className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={currentCompany}
                onChange={(e) => {
                  const token = localStorage.getItem("accessToken");
                  const userId = localStorage.getItem("userId");
                  const prefix =
                    token && userId
                      ? "/main/viewjobdetails"
                      : "/viewjobdetails";
                  navigate(`${prefix}/default/${e.target.value}`);
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-800 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value="ALL"> All Companies Jobs</option>
                {/* <option value="AI Jobs">AI Jobs</option> */}
                {Object.entries(companyNames)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([label, value]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder=" Search jobs, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 hover:border-blue-300 transition-colors"
              />
            </div>
            {/* AI Jobs Button*/}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                onClick={() => {
                  const token = localStorage.getItem("accessToken");
                  const userId = localStorage.getItem("userId");
                  const prefix =
                    token && userId
                      ? "/main/viewjobdetails"
                      : "/viewjobdetails";

                  navigate(`${prefix}/default/AI Jobs`);
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg 
    text-left text-gray-800 bg-white 
    hover:border-blue-300 focus:ring-2 focus:ring-blue-500 
    focus:border-transparent transition-colors"
              >
                AI Jobs
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value=""> All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.experience}
                onChange={(e) =>
                  handleFilterChange("experience", e.target.value)
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value=""> All Experience</option>
                {uniqueExperience.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange("industry", e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value="">All Industries</option>
                {/* <option value="AI Jobs">AI Jobs</option> */}
                {uniqueIndustries
                  .filter((ind) => ind !== "AI Jobs")
                  .map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
              </select>
            </div>

            {/* <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filters.salaryRange}
                onChange={(e) =>
                  handleFilterChange("salaryRange", e.target.value)
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              >
                <option value="">All Salary Ranges</option>
                {uniqueSalaries.map((sal) => (
                  <option key={sal} value={sal}>
                   {sal}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || Object.values(filters).some((f) => f)) && (
            <div className="flex justify-center mt-4">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
              >
                ✨ Clear All Filters
              </button>
            </div>
          )}
        </div>
        {selectedJob ? (
          <div className={`grid grid-cols-1 lg:grid-cols-4 pt-2 gap-4`}>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-4 shadow-sm border sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Similar Jobs
                  </h3>
                  <button
                    onClick={() => {
                      const accessToken = localStorage.getItem("accessToken");
                      const userId = localStorage.getItem("userId");
                      setSelectedJob(null);
                      if (accessToken && userId) {
                        navigate(
                          `/main/viewjobdetails/default/${currentCompany}`,
                        );
                      } else {
                        navigate(`/viewjobdetails/default/${currentCompany}`);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Back to all
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredJobs
                    .filter(
                      (job) =>
                        job.id !== selectedJob.id &&
                        job.industry === selectedJob.industry,
                    )
                    .slice(0, 8)
                    .map((job) => (
                      <JobCard key={job.id} job={job} isCompact />
                    ))}
                </div>
              </div>
            </div>
            <div className={"lg:col-span-3"}>
              <JobDetailsComponent job={selectedJob} />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex px-2 sm:px-4 lg:px-6 justify-between items-center sm:flex-row flex-col max-sm:items-start max-sm:gap-2">
                <h2 className="text-xl font-bold text-gray-800">
                  Available Positions at{" "}
                  <span className="text-blue-600 capitalize">
                    {currentCompany?.toLowerCase()}
                  </span>
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {Math.min(displayedJobsCount, filteredJobs.length)} of{" "}
                  {filteredJobs.length} jobs
                </div>
              </div>
            </div>

            <motion.div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                userId ? "lg:grid-cols-4" : "lg:grid-cols-5"
              } gap-0`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.slice(0, displayedJobsCount).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>

            {filteredJobs.length > displayedJobsCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setDisplayedJobsCount((prev) => prev + 20)}
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-8 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100"
                >
                  Load More Jobs ({filteredJobs.length - displayedJobsCount}{" "}
                  remaining)
                </button>
              </div>
            )}
          </>
        )}
        {selectedJob &&
          (() => {
            const otherOpportunityIds = filteredJobs
              .filter(
                (job) =>
                  job.id !== selectedJob.id &&
                  job.industry === selectedJob.industry,
              )
              .slice(0, 9)
              .map((j) => j.id);
            const remainingJobs = filteredJobs.filter(
              (job) =>
                job.id !== selectedJob?.id &&
                !otherOpportunityIds.includes(job.id),
            );

            return remainingJobs.length > 0 ? (
              <div className="mt-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 relative">
                    More Job Opportunities
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full"></div>
                  </h2>
                  <p className="text-gray-600 mt-3">
                    Discover exciting career opportunities tailored for you
                  </p>
                </div>
                <motion.div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                    userId ? "lg:grid-cols-4" : "lg:grid-cols-5"
                  } gap-0`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {remainingJobs.slice(0, displayedJobsCount).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </motion.div>
                {remainingJobs.length > displayedJobsCount && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setDisplayedJobsCount((prev) => prev + 20)}
                      className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-8 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100"
                    >
                      Load More Jobs (
                      {remainingJobs.length - displayedJobsCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            ) : null;
          })()}
        {/* No Jobs Found */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-gray-600 border border-gray-200 hover:bg-gray-50 px-5 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl p-7 w-[90%] max-w-md border border-gray-200 transition-all scale-100">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition text-2xl leading-none"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-5 text-center">
              Write To Us
            </h2>

            {/* MOBILE NUMBER */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                disabled
                value={finalMobileNumber || ""}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                disabled
                value={email || ""}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* QUERY */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Query
              </label>
              <textarea
                rows={4}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Type your query..."
              />
              {queryError && (
                <p className="text-red-500 text-xs mt-1">{queryError}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleWriteToUsSubmitButton}
                className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-semibold text-sm"
              >
                Submit Query
              </button>
            </div>
          </div>
        </div>
      )}

      {isprofileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-700">Alert!</h2>
              <button
                className="text-red-600 text-xl font-bold hover:text-red-700"
                onClick={() => setIsprofileOpen(false)}
              >
                ×
              </button>
            </div>
            <p className="text-center text-gray-700 mb-6">
              Please fill your profile details.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                style={{ backgroundColor: "#008cba", borderColor: "#008cba" }}
                onClick={handlePopUOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {applyselectedJob && (
        <JobApplicationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobDesignation={applyselectedJob.jobDesignation}
          companyName={applyselectedJob.companyName}
          jobId={selectedJob?.id || ""}
          userId={userId || ""}
        />
      )}

      {showResumeModal && selectedJob && (
        <ResumeUploadModal
          open={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          userId={userId || ""}
          jobId={selectedJob.id}
          jobDesignation={selectedJob.jobDesignation}
          companyName={selectedJob.companyName}
        />
      )}

      {showNoAgentPopup && (
        <div
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/40"
          onClick={() => setShowNoAgentPopup(false)}
        >
          <div
            className="bg-white rounded-2xl w-[85%] max-w-sm px-6 py-5 shadow-2xl border border-black/10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNoAgentPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl leading-none transition-colors duration-200"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="font-extrabold text-xl mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-400 bg-clip-text text-transparent text-center">
              🎉 Congratulations!
            </div>

            <div className="text-sm leading-relaxed text-gray-800 text-center font-medium mb-4">
              You'll be launching your AI Agent with your profile.
              <br />
              Upload once and your AI Agent will apply for all relevant
              positions!
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNoAgentPopup(false);
                  if (selectedJob) {
                    setApplySelectedJob({
                      jobDesignation: selectedJob.jobDesignation,
                      companyName: selectedJob.companyName,
                    });
                    setIsModalOpen(true);
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNoAgentPopup(false);
                  try {
                    localStorage.setItem(
                      "agentJobContext",
                      JSON.stringify({
                        fromJobId: selectedJob?.id,
                        jobDesignation: selectedJob?.jobDesignation,
                        companyName: selectedJob?.companyName,
                        returnPath: location.pathname + location.search,
                      }),
                    );
                  } catch (e) {
                    console.warn(
                      "Could not set agentJobContext in localStorage",
                      e,
                    );
                  }
                  navigate("/main/agentcreate", {
                    state: {
                      fromJobId: selectedJob?.id,
                      jobDesignation: selectedJob?.jobDesignation,
                      companyName: selectedJob?.companyName,
                      returnPath: location.pathname + location.search,
                    },
                  });
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium"
              >
                Create AI Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobViewPage;
