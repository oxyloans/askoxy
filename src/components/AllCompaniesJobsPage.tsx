import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BASE_URL from "../Config";
import Logo from "../assets/img/askoxylogonew.png";
import Footer from "./Footer";
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  Search,
  Building2,
  MapPin,
  Clock3,
  Briefcase,
} from "lucide-react";
import customerApi from "../utils/axiosInstances";

type Job = {
  id: string;
  jobTitle: string;
  jobDesignation?: string;
  companyName: string;
  jobLocations: string;
  jobType: string;
  experience: string;
  description: string;
  skills: string;
  qualifications: string;
  companyLogo?: string;
  createdAt: number;
};

const PAGE_SIZE = 20;

const COMPANY_OPTIONS = [
  "ALL",
  "ACCENTURE",
  // "CREDERA",
  "TECH_MAHINDRA",
  "BROADRIDGE",
] as const;
type CompanyType = (typeof COMPANY_OPTIONS)[number];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};
 
const formatCompanyLabel = (company: string) => {
  return company
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AllCompaniesJobsPage: React.FC = () => {
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyType>("ALL");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
 const [companyNames, setCompanyNames] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const selectedCompanyLabel = useMemo(
    () => formatCompanyLabel(selectedCompany),
    [selectedCompany],
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        setJobs([]);
        setVisible(PAGE_SIZE);

         let url = "";
         if (selectedCompany === "ALL") {
           url = `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`;
         } else {
           url = `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=${encodeURIComponent(selectedCompany)}`;
         }

         const response = await customerApi.get(url);
         const data: Job[] = response.data;

        setJobs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCompany]);

  const formatTitle = (job: Job) =>
    job.jobTitle || job.jobDesignation || "Open Position";

  const handleJobNavigate = (jobId: string) => {
    navigate(`/main/viewjobdetails/${jobId}/${selectedCompany}`);
  };
 useEffect(() => {
   fetchCompanyNames();
 }, []);

 const fetchCompanyNames = async () => {
   try {
     const response = await customerApi.get(
       `${BASE_URL}/marketing-service/campgin/distinct-company-names`,
     );
     const data = response.data;
     setCompanyNames(data || {});
   } catch (error) {
     console.error("Error fetching company names:", error);
   }
 };
  const uniqueLocations = Array.from(
    new Set(
      jobs.flatMap((job) => {
        if (!job.jobLocations?.trim()) return [];
        return job.jobLocations
          .split(",")
          .map((loc) => loc.trim())
          .filter((loc) => loc.length > 1);
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const uniqueExperience = Array.from(
    new Set(
      jobs
        .map((job) => job.experience?.trim())
        .filter((exp): exp is string => !!exp && exp.length > 1),
    ),
  ).sort();

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !searchTerm ||
      (job.jobTitle || "").toLowerCase().includes(searchLower) ||
      (job.jobDesignation || "").toLowerCase().includes(searchLower) ||
      (job.skills || "").toLowerCase().includes(searchLower);

    const locLower = locationFilter.toLowerCase().trim();
    const matchesLocation =
      !locationFilter ||
      (job.jobLocations || "")
        .split(",")
        .some((loc) => loc.trim().toLowerCase() === locLower);

    const expLower = experienceFilter.toLowerCase().trim();
    const matchesExperience =
      !experienceFilter ||
      (job.experience || "").toLowerCase().includes(expLower);

    return matchesSearch && matchesLocation && matchesExperience;
  });

  const displayedJobs = filteredJobs.slice(0, visible);

  const lastUpdated = jobs.length
    ? new Date(Math.max(...jobs.map((j) => j.createdAt))).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f6f6f8] to-[#f0f0f5] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-slate-700 font-semibold text-base sm:text-lg">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-violet-700" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-violet-200 rounded-full animate-pulse"></div>
          </div>
          <p className="text-center">Loading {selectedCompanyLabel} jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f6f6f8] to-[#f0f0f5] flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 text-red-600 rounded-3xl p-8 text-center shadow-xl max-w-md w-full transform hover:scale-105 transition-transform">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
          <p className="text-lg font-semibold text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7fa] via-[#f6f6f8] to-[#f4f4f7] flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <img
          src={Logo}
          alt="ASKOXY.AI"
          className="h-10 w-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-200"
        />

        <div className="flex items-center gap-3 sm:gap-4">
          {lastUpdated && (
            <span className="hidden sm:block text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 border">
              Updated:{" "}
              <span className="font-semibold text-gray-800">{lastUpdated}</span>
            </span>
          )}

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-violet-700 hover:text-white hover:bg-violet-700 font-medium transition-all duration-200 text-sm px-4 py-2 rounded-full border border-violet-200 hover:border-violet-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-3 sm:px-5 lg:px-8 py-6 sm:py-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-purple-600 to-blue-600 mb-2">
              {selectedCompanyLabel} Open Positions
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {filteredJobs.length} of {jobs.length} jobs available
              </span>
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCompany}
                  onChange={(e) =>
                    setSelectedCompany(e.target.value as CompanyType)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="ALL">All Jobs</option>
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
                  placeholder="Search jobs, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="">All Experience</option>
                  {uniqueExperience.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {jobs.length > 0 ? (
            <>
              <motion.div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  userId ? "lg:grid-cols-4" : "lg:grid-cols-5"
                } gap-0`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {displayedJobs.map((job, index) => {
                  const lightBackgroundColors = [
                    "bg-slate-50",
                    "bg-emerald-50",
                    "bg-violet-50",
                    "bg-rose-50",
                    "bg-amber-50",
                    "bg-cyan-50",
                    "bg-orange-50",
                    "bg-stone-50",
                  ];

                  const bgColor =
                    lightBackgroundColors[index % lightBackgroundColors.length];

                  return (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-100 m-2"
                      onClick={() => handleJobNavigate(job.id)}
                    >
                      <div className="pt-6 pb-4 flex justify-center">
                        <div className="w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 p-2">
                          <img
                            src={
                              job.companyLogo ||
                              "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3"
                            }
                            alt={job.companyName}
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

                      <div className="flex justify-center px-4 pb-3">
                        <div
                          className={`${bgColor} py-2 px-4 rounded-xl flex justify-center items-center`}
                        >
                          <span className="text-base font-semibold text-gray-700 text-center">
                            {job.companyName || selectedCompanyLabel}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 pb-1">
                        <h3 className="text-lg font-bold text-gray-800 text-center line-clamp-2 min-h-[56px]">
                          {formatTitle(job)}
                        </h3>
                      </div>

                      <div className="px-2 pb-2">
                        <div className="text-sm font-bold text-gray-700 text-center bg-gray-50 py-2 px-3 rounded-lg line-clamp-2 min-h-[44px]">
                          💼 {job.jobDesignation || formatTitle(job)}
                        </div>
                      </div>

                      <div className="px-4 pb-3 space-y-2 text-center">
                        <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                          📍 Loc: {job.jobLocations || "Remote"}
                        </div>
                        <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                          ⏰ Exp: {job.experience || "Entry Level"}
                        </div>
                        {/* <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                          🏢 Type: {job.jobType || "Full Time"}
                        </div> */}
                      </div>

                      <div className="px-4 pb-5 mt-auto flex justify-center">
                        <div className="bg-blue-100 text-blue-500 py-3 px-8 rounded-full font-semibold text-base transition-all duration-200 hover:bg-blue-200 inline-flex items-center gap-2">
                          View Job Details
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {visible < filteredJobs.length && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="group px-12 py-3 rounded-full bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-800 hover:to-purple-800 text-white font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border border-violet-600"
                  >
                    Load More ({filteredJobs.length - visible} Remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No jobs available at the moment for {selectedCompanyLabel}.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllCompaniesJobsPage;
