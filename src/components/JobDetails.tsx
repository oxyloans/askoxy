import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MailIcon, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { submitWriteToUsQuery, fetchAppliedJobsByUserId } from "./servicesapi";
import { Button, message, Select } from "antd";
import JobApplicationModal from "./JobApplyModal";

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

const JobDetails: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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
          v && v.toLowerCase() !== "null" && v.toLowerCase() !== "undefined"
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
        }
      );

      if (!res.ok) return false;
      
      const data = await res.json();
      const hasAssistants = data?.assistants && Array.isArray(data.assistants) && data.assistants.length > 0;
      
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
      setSelectedJob(job || null);
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
    fetchJobs();
  }, []);

  useEffect(() => {
    if (location.state?.openApplyModal && selectedJob) {
      // ✅ Open JobApplicationModal ONCE
      setApplySelectedJob({
        jobDesignation: selectedJob.jobDesignation,
        companyName: selectedJob.companyName,
      });
      setIsModalOpen(true);

      // 🧹 Remove the flag from this history entry
      const { openApplyModal, ...restState } = (location.state as any) || {};

      navigate(location.pathname, {
        replace: true,
        state: restState, // ⬅ same state, but without openApplyModal
      });
    }
  }, [location.key, location.state, selectedJob, navigate]);

  useEffect(() => {
    filterJobs();
    setDisplayedJobsCount(20); // Reset pagination when filters change
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`
      );
      const data = await response.json();
      const filteredJobs = data.filter((job: Job) => job.jobStatus === true);
      setJobs(filteredJobs);
      const matchedJob = data.find((job: Job) => job.id === id);
      setSelectedJob(matchedJob || null);
      setFilteredJobs(data);
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
          job.jobLocations?.toLowerCase().includes(lowerSearch)
      );
    }

    if (filters.industry) {
      filtered = filtered.filter((job) =>
        job.industry?.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) =>
        job.jobType?.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.jobLocations?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.experience) {
      filtered = filtered.filter((job) =>
        job.experience?.toLowerCase().includes(filters.experience.toLowerCase())
      );
    }

    if (filters.salaryRange) {
      const selectedRange = getSalaryRanges().find(
        (range) =>
          range.label.toLowerCase() === filters.salaryRange.toLowerCase()
      );
      if (selectedRange) {
        filtered = filtered.filter(
          (job) =>
            job.salaryMin >= selectedRange.min &&
            job.salaryMax <= selectedRange.max
        );
      }
    }

    if (filters.skills) {
      filtered = filtered.filter((job) =>
        safeSplit(job.skills)
          .join(" ")
          .toLowerCase()
          .includes(filters.skills.toLowerCase())
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
    companyName: string
  ) => {
    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsapplogin");
      sessionStorage.setItem("redirectPath", "/main/jobdetails");
      return;
    }

    const hasAgent = await checkUserHasAgent();

    if (!hasAgent) {
      setShowNoAgentPopup(true);
      return;
    }

    // ✅ Has agent → open Apply modal directly
    setApplySelectedJob({ jobDesignation, companyName });
    setIsModalOpen(true);
    setShowNoAgentPopup(false);
  };

  const handleFilterChange = (key: string, value: string) => {
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

    const success = await submitWriteToUsQuery(
      email,
      finalMobileNumber,
      query,
      "FREESAMPLE",
      userId
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
      sessionStorage.setItem("redirectPath", "/main/jobdetails");
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

  const formatSalary = (min: number, max: number, payRateFrequencyType?: string) => {
    const salaryRange = `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    return payRateFrequencyType ? `${salaryRange} ${payRateFrequencyType}` : salaryRange;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
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
      sessionStorage.setItem("redirectPath", "/main/jobdetails");
      sessionStorage.setItem("redirectJobId", job.id);
      return;
    }
    setSelectedJob(job);
    window.scrollTo({
      top: 400,
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

    const bgColor =
      lightBackgroundColors[
        Math.floor(Math.random() * lightBackgroundColors.length)
      ];

    if (isCompact) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => handleJobSelect(job)}
        >
          <h4 className="font-semibold text-lg text-purple-900 mb-1 line-clamp-1">
            {job.jobTitle}
          </h4>
          <p className="text-gray-700 text-sm font-medium mb-3 truncate">
            {job.companyName.toUpperCase()}.
          </p>
          <div className="flex flex-col items-start text-sm text-gray-500">
            <span className="flex items-center gap-1">
              ⏰ Exp: {job.experience}
            </span>
            <span className="flex items-center gap-1">
              📍 Loc: {job.jobLocations}
            </span>
          </div>
        </motion.div>
      );
    }

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
                "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3"
              }
              className="w-40 h-20 object-contain transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";
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
          <div className="bg-blue-100 text-blue-500 py-3 px-8 rounded-full font-semibold text-base transition-all duration-200 hover:bg-blue-200">
            View Job
          </div>
        </div>
      </motion.div>
    );
  };

  const JobDetailsComponent = ({ job }: { job: Job }) => {
    // Helper function to check if a value is empty or null
    const isEmpty = (value: any): boolean => {
      return (
        value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "string" && value.trim() === "")
      );
    };

const hasArrayContent = (value: any): boolean => {
  return safeSplit(value).length > 0;
};


    // Helper function to check if salary values are valid
    const hasValidSalary = (min: any, max: any): boolean => {
      const minSalary = parseFloat(min) || 0;
      const maxSalary = parseFloat(max) || 0;
      return minSalary > 0 || maxSalary > 0;
    };

    const formatDescription = (description: string): string => {
      if (isEmpty(description)) return "";

      // Split by common bullet point indicators and line breaks
      const lines = description
        .split(/\n|•|·|\*|-|\d+\.|\d+\)/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      // If we have multiple meaningful lines, format as bullet points
      if (lines.length > 1) {
        return lines.map((line) => `• ${line}`).join("\n");
      }

      // If it's a single block of text, return as is
      return description;
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 my-8 border border-gray-100 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white">
                  {job.jobTitle || "Job Title Not Available"}
                </h1>
                {!isEmpty(job.jobDesignation) && (
                  <h2 className="text-baseCS font-semibold text-blue-100">
                    {job.jobDesignation}
                  </h2>
                )}
              </div>
              {!isEmpty(job.companyName) && (
                <div className="mt-3 inline-block bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-white/20">
                  {job.companyName}
                </div>
              )}
            </div>
            <button
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                appliedJobIds.has(job.id)
                  ? "border-green-500 bg-green-50 text-green-700 cursor-not-allowed"
                  : "border-yellow-500 bg-white text-blue-600 font-bold hover:bg-blue-50"
              }`}
              onClick={() => {
                if (!appliedJobIds.has(job.id)) {
                  handleClick(job.id, job.jobDesignation, job.companyName);
                }
              }}
              disabled={appliedJobIds.has(job.id)}
            >
              {appliedJobIds.has(job.id) ? "✓ Applied" : "Apply Now"}
            </button>
          </div>
        </div>

        {/* Info Grid 1 - Fixed layout to prevent wrapping */}
        {(() => {
          const infoItems = [
            { icon: "📍", label: "Location", value: job?.jobLocations },
            { icon: "💼", label: "Type", value: job?.jobType },
            { icon: "⏰", label: "Experience", value: job?.experience },
            {
              icon: "💰",
              label: "Salary",
              value: hasValidSalary(job.salaryMin, job.salaryMax)
                ? formatSalary(job.salaryMin, job.salaryMax, job.payRateFrequencyType)
                : null,
            },
          ].filter((info) => !isEmpty(info.value));

          if (infoItems.length === 0) return null;

          // Calculate grid columns based on number of items
          const gridColsClass =
            {
              1: "grid-cols-1",
              2: "grid-cols-2",
              3: "grid-cols-3",
              4: "grid-cols-4",
            }[infoItems.length] || "grid-cols-4";

          const smGridColsClass =
            {
              1: "sm:grid-cols-1",
              2: "sm:grid-cols-2",
              3: "sm:grid-cols-3",
              4: "sm:grid-cols-4",
            }[infoItems.length] || "sm:grid-cols-4";

          return (
            <div className={`grid ${gridColsClass} ${smGridColsClass} gap-4`}>
              {infoItems.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 p-4 rounded-lg text-center hover:shadow transition min-w-0"
                >
                  <div className="text-xl mb-1">{info.icon}</div>
                  <div className="text-xs text-gray-500">{info.label}</div>
                  <div className="text-sm font-medium text-gray-800 break-words hyphens-auto">
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Info Grid 2 - 5 column layout with dynamic width */}
        {(() => {
          const infoItems = [
            { label: "Industry", value: job.industry },
            { label: "Education", value: job.qualifications },
            { label: "Work Mode", value: job.workMode },
            {
              label: "Deadline",
              value: job.applicationDeadLine
                ? formatDate(job.applicationDeadLine)
                : null,
              className: "text-red-600",
            },
            {
              label: "Posted",
              value: job.createdAt ? formatDate(job.createdAt) : null,
            },
          ].filter((info) => !isEmpty(info.value));

          if (infoItems.length === 0) return null;

          // Calculate grid columns based on number of items
          const gridColsClass =
            {
              1: "grid-cols-1",
              2: "grid-cols-2",
              3: "grid-cols-3",
              4: "grid-cols-4",
              5: "grid-cols-5",
            }[infoItems.length] || "grid-cols-5";

          const smGridColsClass =
            {
              1: "sm:grid-cols-1",
              2: "sm:grid-cols-2",
              3: "sm:grid-cols-3",
              4: "sm:grid-cols-4",
              5: "sm:grid-cols-5",
            }[infoItems.length] || "sm:grid-cols-5";

          return (
            <div className={`grid ${gridColsClass} ${smGridColsClass} gap-4`}>
              {infoItems.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-lg text-center hover:shadow transition min-w-0"
                >
                  <div className="text-xs text-gray-600 mb-1">{info.label}</div>
                  <div
                    className={`text-sm font-medium break-words hyphens-auto ${
                      info.className ? info.className : "text-gray-800"
                    }`}
                  >
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Job Description - Only show if description exists */}
        {!isEmpty(job.description) && (
          <div className="max-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center shrink-0">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
              Job Description
            </h3>
            <div
              className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto pr-1"
              dangerouslySetInnerHTML={{
                __html: autoFormatDescription(
                  formatDescription(job.description)
                ),
              }}
            />
          </div>
        )}

        {/* Skills Section - Only show if skills exist */}
        {hasArrayContent(job.skills) && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(job.skills ? safeSplit(job.skills) : [])
                .filter((skill) => skill.trim() !== "")
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded"
                  >
                    {skill.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Benefits Section - Only show if benefits exist */}
        {hasArrayContent(job.benefits) && (
          <div className="bg-gray-50 p-5 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
              Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safeSplit(job.benefits).map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                >
                  <span className="text-green-500 mr-2 text-base">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Details - Only show if contact info exists */}
        {(!isEmpty(job.contactNumber) || !isEmpty(job.countryCode)) && (
          <div className="bg-blue-50 p-4 sm:p-5 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
              Support Details
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 space-y-3 sm:space-y-0 sm:space-x-6">
              {/* Phone - Only show if contact number exists */}
              {!isEmpty(job.contactNumber) && (
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2 text-lg">📞</span>
                  <span className="text-sm font-medium break-all">
                    {!isEmpty(job.countryCode) ? `${job.countryCode} ` : ""}
                    {job.contactNumber}
                  </span>
                </div>
              )}

              {/* Email - Always show as it's hardcoded */}
              <div className="flex items-center">
                <span className="text-blue-600 mr-2 text-lg">📧</span>
                <span className="text-sm font-medium break-all">
                  support@askoxy.ai
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl">
          <button
            className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow ${
              appliedJobIds.has(job.id)
                ? "bg-green-100 text-green-700 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => {
              if (!appliedJobIds.has(job.id)) {
                handleClick(job.id, job.jobDesignation, job.companyName);
              }
            }}
            disabled={appliedJobIds.has(job.id)}
          >
            {appliedJobIds.has(job.id)
              ? "✓ Applied for this Position"
              : "🚀 Apply for this Position"}
          </button>
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-6 py-6 px-4 ">
          <div className="mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-gray-600">Discover opportunities that match your skills and aspirations</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="text-xl">🚀</span>
              <span className="font-medium text-gray-700">Quick Apply</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="text-xl">🏢</span>
              <span className="font-medium text-gray-700">Top Companies</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="text-xl">💼</span>
              <span className="font-medium text-gray-700">Remote Jobs</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6  p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Filter Jobs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
            {(
              [
                {
                  key: "industry",
                  label: "Industry",
                  icon: "🏢",
                  values: getUniqueValues("industry"),
                },
                {
                  key: "jobType",
                  label: "Job Type",
                  icon: "💼",
                  values: getUniqueValues("jobType"),
                },
                {
                  key: "location",
                  label: "Location",
                  icon: "📍",
                  values: getUniqueValues("jobLocations"),
                },
                {
                  key: "experience",
                  label: "Experience",
                  icon: "🎯",
                  values: getUniqueValues("experience"),
                },
                {
                  key: "salaryRange",
                  label: "Salary Range",
                  icon: "💰",
                  values: getSalaryRanges().map((r) => r.label),
                },
                {
                  key: "skills",
                  label: "Skills",
                  icon: "🛠",
                  values: getUniqueSkills(),
                },
              ] as { key: FilterKey; label: string; icon: string; values: string[] }[]
            ).map(({ key, label, icon, values }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {icon} {label}
                </label>
                <Select
                  value={filters[key] || undefined}
                  onChange={(value) => handleFilterChange(key, value)}
                  placeholder={`Select ${label.toLowerCase()}`}
                  className="w-full"
                  size="large"
                  allowClear
                >
                  {values.map((val, idx) => (
                    <Option key={`${key}-${idx}`} value={val}>
                      {val}
                    </Option>
                  ))}
                </Select>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{filteredJobs.length}</span>
              <span>jobs found</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Clear All
              </Button>
              <Button
                onClick={handleWriteToUs}
                className="px-4 py-1.5 text-white rounded-lg flex items-center gap-2 hover:text-white"
                style={{ backgroundColor: "#1ab394", borderColor: "#1ab394" }}
              >
                <MailIcon className="w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        {/* Job Listings */}
        {selectedJob ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Similar Jobs
                  </h3>
                  <button
                    onClick={() => setSelectedJob(null)}
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
                        job.industry === selectedJob.industry
                    )
                    .slice(0, 8)
                    .map((job) => (
                      <JobCard key={job.id} job={job} isCompact />
                    ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <JobDetailsComponent job={selectedJob} />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Available Positions
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {Math.min(displayedJobsCount, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
              </div>
            </div>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.slice(0, displayedJobsCount).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>
            
            {filteredJobs.length > displayedJobsCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setDisplayedJobsCount(prev => prev + 20)}
                  className="text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: "#008cba" }}
                >
                  Load More Jobs ({filteredJobs.length - displayedJobsCount} remaining)
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
                  job.industry === selectedJob.industry
              )
              .slice(0, 9)
              .map((j) => j.id);
            const remainingJobs = filteredJobs.filter(
              (job) =>
                job.id !== selectedJob?.id &&
                !otherOpportunityIds.includes(job.id)
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {remainingJobs.slice(0, displayedJobsCount).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </motion.div>
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
              className="text-white px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: "#008cba" }}
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
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all"
                style={{ backgroundColor: "#1ab394", backgroundImage: "none" }}
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
              Upload once and your AI Agent will apply for all relevant positions!
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoAgentPopup(false)}
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
                        returnPath: location.pathname + location.search
                      })
                    );
                  } catch (e) {
                    console.warn("Could not set agentJobContext in localStorage", e);
                  }
                  navigate("/main/agentcreate", {
                    state: { 
                      fromJobId: selectedJob?.id, 
                      jobDesignation: selectedJob?.jobDesignation, 
                      companyName: selectedJob?.companyName,
                      returnPath: location.pathname + location.search
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

export default JobDetails;






