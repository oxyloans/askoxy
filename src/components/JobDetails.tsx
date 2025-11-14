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
  skills: string;
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

  const buildAuthHeaders = (): HeadersInit => {
    const auth = readAuth();
    if (!auth?.accessToken) return {};
    return {
      Authorization: `Bearer ${auth.accessToken}`,
    };
  };

  // ✅ Check from AgentDataList API if user has at least one AI Agent
  const checkUserHasAgent = async (): Promise<boolean> => {
    if (!userId) return false;

    // 🔹 Fast path: if we already know an agent was created, trust this
    const localFlag =
      typeof window !== "undefined" &&
      localStorage.getItem("hasAiAgent") === "true";

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/allAgentDataList?userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...buildAuthHeaders(),
          },
        }
      );

      const text = await res.text().catch(() => "");

      // If server sends non-200 OR nothing, fall back to local flag
      if (!res.ok || !text) {
        return localFlag;
      }

      let raw: any = {};
      try {
        raw = JSON.parse(text);
      } catch {
        // Bad JSON – fall back to local flag
        return localFlag;
      }

      const assistantsCount = Array.isArray(raw?.assistants)
        ? raw.assistants.length
        : 0;
      const conversationsCount = Array.isArray(raw?.conversations)
        ? raw.conversations.length
        : 0;

      const hasAgent = assistantsCount > 0 || conversationsCount > 0;

      if (hasAgent) {
        // Store for future clicks
        try {
          localStorage.setItem("hasAiAgent", "true");
        } catch {}
      }

      return hasAgent || localFlag;
    } catch (err) {
      console.error("Error checking AgentDataList:", err);
      // On error, use whatever we know locally
      return localFlag;
    }
  };

  useEffect(() => {
    console.log("this is the id from state" + id);

    if (id) {
      const job = jobs.find((job) => job.id === id);
      setSelectedJob(job || null);
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
    const allSkills = jobs.flatMap((job) =>
      job.skills.split(",").map((skill) => skill.trim())
    );
    const uniqueSkills = Array.from(new Set(allSkills));
    return uniqueSkills.filter(
      (skill) => skill && skill !== "undefined" && skill !== "null"
    );
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
    const { openApplyModal, ...restState } =
      (location.state as any) || {};

    navigate(location.pathname, {
      replace: true,
      state: restState, // ⬅ same state, but without openApplyModal
    });
  }
}, [location.key, location.state, selectedJob, navigate]);


  useEffect(() => {
    filterJobs();
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
          job.skills?.toLowerCase().includes(lowerSearch) ||
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
        job.skills?.toLowerCase().includes(filters.skills.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const getUniqueValues = (key: keyof Job): string[] => {
    const valueMap = new Map<string, string>(); // lowercase -> original (formatted)

    jobs.forEach((job) => {
      const rawValue = job[key];
      if (!rawValue) return;

      const items = String(rawValue)
        .split(",") // Split by comma
        .map((item) => item.trim()) // Trim spaces
        .filter(
          (item) =>
            item &&
            item.toLowerCase() !== "undefined" &&
            item.toLowerCase() !== "null"
        );

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
  // 1) If not logged in → send to WhatsApp login
  if (!userId) {
    message.warning("Please login to submit your interest.");
    navigate("/whatsapplogin");
    sessionStorage.setItem("redirectPath", "/main/jobdetails");
    return;
  }

  // 2) DUMMY PARAM in localStorage for this JOB
  //    null / missing → JobAgent not created yet
  //    "true"         → JobAgent Created for this jobId
  const jobKey = `hasAiAgentForJob:${jobId}`;
  const hasJobFlag =
    typeof window !== "undefined" && localStorage.getItem(jobKey) === "true";

  // 3) Check if user already has ANY AI Agent (API + local flag)
  const hasAgent = hasJobFlag || (await checkUserHasAgent());

  // 4) ❌ No Agent yet → show popup + go to Agent Creation
  if (!hasAgent) {
    setShowNoAgentPopup(true); // 🎉 Congratulations popup

    // Small delay so user can see the popup
    setTimeout(() => {
      setShowNoAgentPopup(false);

      // 🔹 Store JOB CONTEXT so Agentcreation can update dummy param AFTER publish
      //     agentJobContext = { fromJobId, jobDesignation, companyName }
      try {
        localStorage.setItem(
          "agentJobContext",
          JSON.stringify({ fromJobId: jobId, jobDesignation, companyName })
        );
      } catch (e) {
        console.warn("Could not set agentJobContext in localStorage", e);
      }

      // Go to Agent Creation page
      navigate("/main/agentcreate", {
        state: { fromJobId: jobId, jobDesignation, companyName },
      });
    }, 800);

    // IMPORTANT: do NOT open JobApplicationModal here
    return;
  }

  // 5) ✅ User already has at least one AI Agent → open Job Application Modal
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
      "WEAREHIRING",
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

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
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

    // Helper function to check if array-like string has content
    const hasArrayContent = (value: any): boolean => {
      if (isEmpty(value)) return false;
      const items = value
        .split(",")
        .filter((item: string) => item.trim() !== "");
      return items.length > 0;
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
                ? formatSalary(job.salaryMin, job.salaryMax)
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
              {job.skills
                .split(",")
                .filter((skill) => skill.trim() !== "")
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
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
              {job.benefits
                .split(",")
                .filter((benefit) => benefit.trim() !== "")
                .map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="text-green-500 mr-2 text-base">✓</span>
                    {benefit.trim()}
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-sm">
          <div className="mb-2 text-4xl sm:text-5xl">🎓</div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Find Your Dream Job
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-xl">🚀</span>
              <span className="text-sm font-medium text-gray-700">
                Fast Apply
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-gray-700">
                Top Companies
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-xl">💝</span>
              <span className="text-sm font-medium text-gray-700">
                Great Benefits
              </span>
            </div>
          </div>
        </div>
        <div className="mb-6 relative">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                type="text"
                placeholder="🔍 Search your dream job by title, company, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none shadow-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <div className="mb-2">
          <style>{`
        .ant-select-selection-placeholder {
          color: #374151 !important;
          font-weight: 500 !important;
        }
        .ant-select-selection-item {
          color: #374151 !important;
        }
      `}</style>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
            {(
              [
                {
                  key: "industry",
                  label: "🏢 Industry",
                  values: getUniqueValues("industry"),
                },
                {
                  key: "jobType",
                  label: "💼 Job Type",
                  values: getUniqueValues("jobType"),
                },
                {
                  key: "location",
                  label: "📍 Location",
                  values: getUniqueValues("jobLocations"),
                },
                {
                  key: "experience",
                  label: "🎯 Experience",
                  values: getUniqueValues("experience"),
                },
                {
                  key: "salaryRange",
                  label: "💰 Salary",
                  values: getSalaryRanges().map((r) => r.label),
                },
                {
                  key: "skills",
                  label: "🛠 Skills",
                  values: getUniqueSkills(),
                },
              ] as { key: FilterKey; label: string; values: string[] }[]
            ).map(({ key, label, values }) => (
              <div key={key} className="w-full">
                <Select
                  value={filters[key] || undefined}
                  onChange={(value) => handleFilterChange(key, value)}
                  placeholder={label}
                  className="w-full rounded-lg"
                  style={{
                    width: "100%",
                    color: "#374151",
                  }}
                  size="middle"
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
            <Button
              onClick={clearFilters}
              danger
              className="w-full sm:w-auto color"
              style={{
                background: "linear-gradient(to right, #ef4444, #ec4899)",
                border: "none",
                color: "white",
              }}
            >
              🗑 Clear Filters
            </Button>

            <Button
              onClick={handleWriteToUs}
              type="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(to right, #3b82f6, #9333ea)",
                border: "none",
              }}
            >
              <MailIcon className="w-4 h-4" />
              Write to Us
            </Button>
          </div>
        </div>
        {selectedJob ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Other Opportunities
                    </h3>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      🔍 View All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-100 overflow-y-auto">
                    {filteredJobs
                      .filter(
                        (job) =>
                          job.id !== selectedJob.id &&
                          job.industry === selectedJob.industry
                      )
                      .slice(0, 9)
                      .map((job) => (
                        <JobCard key={job.id} job={job} isCompact />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <JobDetailsComponent job={selectedJob} />
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
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
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 relative">
                    More Job Opportunities
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </h2>
                  <p className="text-gray-600 mt-4">
                    Discover exciting career opportunities tailored for you
                  </p>
                </div>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {remainingJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </motion.div>
              </div>
            ) : null;
          })()}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm">
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No Jobs Found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Try adjusting your filters or search terms to discover more
              opportunities
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🔄 Reset Filters
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
            <i
              className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-600"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            />
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Write To Us
            </h2>
            <div className="mb-4">
              <label
                className="block text-sm text-gray-700 font-semibold mb-1"
                htmlFor="phone"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="phone"
                disabled={true}
                value={finalMobileNumber || ""}
                className="block w-full text-gray-700 px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm text-gray-700 font-semibold mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email || ""}
                disabled={true}
                className="block w-full text-gray-700 px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm text-gray-700 font-semibold mb-1"
                htmlFor="query"
              >
                Query
              </label>
              <textarea
                id="query"
                rows={3}
                className="block w-full text-gray-700 px-4 py-2 border-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter your query"
                onChange={(e) => setQuery(e.target.value)}
              />
              {queryError && (
                <p className="text-red-500 text-sm mt-1">{queryError}</p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
                onClick={handleWriteToUsSubmitButton}
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
      className="bg-white rounded-2xl w-[85%] max-w-sm px-6 py-5 shadow-2xl border border-black/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="font-extrabold text-xl mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-400 bg-clip-text text-transparent text-center">
        🎉 Congratulations!
      </div>

      <div className="text-sm leading-relaxed text-gray-800 text-center font-medium mb-4">
        You’ll be launching your AI Agent with your profile.
        <br />
        Upload once — and your AI Agent will apply for all relevant positions!
      </div>

      <div className="flex justify-center mt-2">
        <button
          className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md"
          onClick={() => setShowNoAgentPopup(false)}
        >
          Got it
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default JobDetails;
