import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { submitInterest } from "./servicesapi";
import { message } from "antd";

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

const JobDetails: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    industry: "",
    jobType: "",
    location: "",
    experience: "",
    salaryRange: "",
    skills: "",
  });

  useEffect(() => {
    console.log("this is the id from state" + id);

    if (id) {
      const job = jobs.find((job) => job.id === id);
      setSelectedJob(job || null);
    }
  }, [id]);

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
    filterJobs();
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`
      );
      const data = await response.json();
      setJobs(data);
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
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.jobLocations.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.industry) {
      filtered = filtered.filter((job) => job.industry === filters.industry);
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    if (filters.location) {
      filtered = filtered.filter(
        (job) => job.jobLocations === filters.location
      );
    }

    if (filters.experience) {
      filtered = filtered.filter(
        (job) => job.experience === filters.experience
      );
    }

    if (filters.salaryRange) {
      const selectedRange = getSalaryRanges().find(
        (range) => range.label === filters.salaryRange
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
        job.skills.toLowerCase().includes(filters.skills.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const getUniqueValues = (key: keyof Job): string[] => {
    const uniqueSet = new Set(jobs.map((job) => String(job[key])));
    return Array.from(uniqueSet).filter(
      (value) => value && value !== "undefined" && value !== "null"
    );
  };

  const handleClick = async (jobDesignation: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", "/main/jobdetails");
    } else {
      const whatsappNumber = localStorage.getItem("whatsappNumber");
      const mobileNumber = localStorage.getItem("mobileNumber");
      const finalMobileNumber = whatsappNumber || mobileNumber || null;
      const success = await submitInterest(
        jobDesignation,
        finalMobileNumber,
        userId,
        "USER"
      );
      if (success) {
        message.info("Your interest was submitted successfully!");
      } else {
        message.info("Failed to submit your interest. Please try again.");
      }
    }
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

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    // Smooth scroll to top
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

          {/* Company Name */}
          <p className="text-gray-700 text-sm font-medium mb-3 truncate">
            {job.companyName.toUpperCase()}.
          </p>

          {/* Info Row */}
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
              className="max-w-full max-h-full object-contain"
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

  const JobDetailsComponent = ({ job }: { job: Job }) => (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 my-8 border border-gray-100 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white">{job.jobTitle}</h1>
              <h2 className="text-base font-semibold text-blue-100">
                {job.jobDesignation}
              </h2>
            </div>

            <div className="mt-3 inline-block bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-white/20">
              {job.companyName}
            </div>
          </div>
          <button
            className="bg-white text-blue-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all shadow"
            onClick={() => {
              handleClick(job.companyName);
            }}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: "📍", label: "Location", value: job.jobLocations },
          { icon: "💼", label: "Type", value: job.jobType },
          { icon: "⏰", label: "Experience", value: job.experience },
          {
            icon: "💰",
            label: "Salary",
            value: formatSalary(job.salaryMin, job.salaryMax),
          },
        ].map((info, idx) => (
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

      {/* Secondary Info */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Industry", value: job.industry },
          { label: "Education", value: job.qualifications },
          { label: "Work Mode", value: job.workMode },
          {
            label: "Deadline",
            value: formatDate(job.applicationDeadLine),
            className: "text-red-600",
          },
          { label: "Posted", value: formatDate(job.createdAt) },
        ].map((info, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-3 rounded-lg text-center hover:shadow transition"
          >
            <div className="text-xs text-gray-600 mb-1">{info.label}</div>
            <div
              className={`text-sm font-medium ${
                info.className ? info.className : "text-gray-800"
              }`}
            >
              {info.value}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-5 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
          About the Role
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.split(",").map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 p-5 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
          Benefits & Perks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {job.benefits.split(",").map((benefit, index) => (
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

      <div className="bg-blue-50 p-5 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3"></span>
          Contact Information
        </h3>
        <div className="flex items-center text-gray-700">
          <span className="text-blue-600 mr-2 text-lg">📞</span>
          <span className="text-sm font-medium">
            {job.countryCode} {job.contactNumber}
          </span>
        </div>
      </div>
      {/* CTA Button */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-2xl">
        <button
          className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all transform hover:scale-105 shadow"
          onClick={() => {
            handleClick(job.companyName);
          }}
        >
          🚀 Apply for this Position
        </button>
      </div>
    </div>
  );

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
        {/* Header */}
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

        {/* Search Bar */}
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

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center items-center">
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
              { key: "skills", label: "🛠 Skills", values: getUniqueSkills() },
            ] as { key: FilterKey; label: string; values: string[] }[]
          ).map(({ key, label, values }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="min-w-44 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:border-blue-500 focus:outline-none bg-gradient-to-r from-white to-gray-50 shadow-sm"
            >
              <option value="" className="text-gray-400">
                {label}
              </option>
              {values.map((val, idx) => (
                <option key={`${key}-${idx}`} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}

          {/* Clear Button */}
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-600 text-sm hover:from-red-100 hover:to-pink-100 hover:border-red-300 rounded-xl px-5 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            🗑 Clear
          </button>
        </div>

        {selectedJob ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="mb-6">
                    <div className="space-y-2 max-h-100 overflow-y-auto">
                      {filteredJobs
                        .filter(
                          (job) =>
                            job.id !== selectedJob.id &&
                            job.industry === selectedJob.industry
                        )
                        .slice(0, 4)
                        .map((job) => (
                          <JobCard key={job.id} job={job} isCompact />
                        ))}
                    </div>
                  </div>

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

                    <div className="space-y-3">
                      {filteredJobs
                        .filter((job) => {
                          if (job.id === selectedJob?.id) return false;

                          // Exclude jobs already shown in the similar jobs section above
                          const similarJobIds = filteredJobs
                            .filter(
                              (j) =>
                                j.id !== selectedJob.id &&
                                j.industry === selectedJob.industry
                            )
                            .slice(0, 4)
                            .map((j) => j.id);

                          return !similarJobIds.includes(job.id);
                        })
                        .slice(0, 6)
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

            {(() => {
              const remainingJobs = filteredJobs.filter((job) => {
                // Exclude selected job
                if (job.id === selectedJob?.id) return false;

                // Get similar jobs (shown in top section of left sidebar)
                const similarJobIds = filteredJobs
                  .filter(
                    (j) =>
                      j.id !== selectedJob.id &&
                      j.industry === selectedJob.industry
                  )
                  .slice(0, 4)
                  .map((j) => j.id);

                // Get other opportunities jobs (shown in bottom section of left sidebar)
                const otherOpportunityIds = filteredJobs
                  .filter((j) => {
                    if (j.id === selectedJob?.id) return false;
                    return !similarJobIds.includes(j.id);
                  })
                  .slice(0, 5) // Match the slice(0, 5) from "Other Opportunities"
                  .map((j) => j.id);

                // Exclude both similar jobs and other opportunity jobs
                const allLeftSidebarJobIds = [
                  ...similarJobIds,
                  ...otherOpportunityIds,
                ];
                return !allLeftSidebarJobIds.includes(job.id);
              });

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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0"
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
          </>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm">
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No jobs match your criteria
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
    </div>
  );
};

export default JobDetails;
