import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Clock3, MapPin, Search } from "lucide-react";
import { message } from "antd";
import BASE_URL from "../Config";

interface Job {
  id: string;
  userId?: string | null;
  companyId?: string | null;
  companyLogo?: string | null;
  jobTitle?: string | null;
  jobDesignation?: string | null;
  companyName?: string | null;
  industry?: string | null;
  jobLocations?: string | null;
  jobType?: string | null;
  description?: string | null;
  benefits?: string | null;
  skills?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  qualifications?: string | null;
  workMode?: string | null;
  applicationDeadLine?: number | null;
  experience?: string | null;
  contactNumber?: string | null;
  countryCode?: string | null;
  jobStatus?: boolean;
  jobSource?: string | null;
  companyEmail?: string | null;
  companyWebsiteUrl?: string | null;
  companyLinkedinUrl?: string | null;
  companyAddress?: string | null;
  companyHeadQuarterLocation?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  payRateFrequencyType?: string | null;
  hideCompanyName?: boolean | null;
}

const COMPANY_NAME = "ASKOXY_AI";
const FALLBACK_LOGO =
  "https://oxybricksv1.s3.ap-south-1.amazonaws.com/null/45880e62-acaf-4645-a83e-d1c8498e923e/aadhar_partnerlogo.png";
const LOGIN_URL = "/whatsapplogin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45 },
  },
};

const HiringPages: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedJobsCount, setDisplayedJobsCount] = useState(20);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=${encodeURIComponent(
          COMPANY_NAME,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`Jobs API failed with status ${response.status}`);
      }

      const data = await response.json();
      const jobsArray: Job[] = Array.isArray(data) ? data : [];
      const activeJobs = jobsArray.filter((job) => job.jobStatus === true);

      setJobs(activeJobs);
    } catch (error) {
      console.error("Error fetching ASKOXY jobs:", error);
      message.error("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    if (!lowerSearch) return jobs;

    return jobs.filter((job) => {
      const searchableText = [
        job.jobTitle,
        job.jobDesignation,
        job.companyName,
        job.industry,
        job.jobLocations,
        job.experience,
        job.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(lowerSearch);
    });
  }, [jobs, searchTerm]);

  useEffect(() => {
    setDisplayedJobsCount(20);
  }, [searchTerm]);

  const handleApplyNow = (jobId: string) => {
    const redirectPath = `/main/viewjobdetails/${jobId}/ASKOXY_AI`;

    if (userId) {
      navigate(redirectPath);
      return;
    }

    message.warning("Please login to view job details.");
    sessionStorage.setItem("redirectPath", redirectPath);
    sessionStorage.setItem("redirectJobId", jobId);
    window.location.href = LOGIN_URL;
  };

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

  const JobCard = ({ job, index }: { job: Job; index: number }) => {
    const bgColor = lightBackgroundColors[index % lightBackgroundColors.length];

    return (
      <motion.div
        variants={itemVariants}
        className="group m-2 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        onClick={() => handleApplyNow(job.id)}
      >
        <div className="flex justify-center pb-4 pt-6">
          <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
            <img
              src={job.companyLogo || FALLBACK_LOGO}
              alt={job.companyName || "Company logo"}
              className="h-20 w-40 object-contain transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = FALLBACK_LOGO;
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-4 pb-3">
          <div
            className={`${bgColor} flex items-center justify-center rounded-xl px-4 py-2`}
          >
            <span className="text-center text-base font-semibold text-gray-700">
              {job.companyName || "ASKOXY.AI"}
            </span>
          </div>
        </div>

        <div className="px-4 pb-1">
          <h3 className="line-clamp-2 text-center text-lg font-bold text-gray-800">
            {job.jobTitle || "Job Title"}
          </h3>
        </div>

        <div className="px-2 pb-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-center text-sm font-bold text-gray-700">
            💼 {job.jobDesignation || job.jobTitle || "Designation"}
          </div>
        </div>

        <div className="space-y-1 px-4 pb-3 text-center">
          <div className="truncate whitespace-nowrap text-sm text-gray-600">
            📍 Loc: {job.jobLocations || "Not specified"}
          </div>
          <div className="truncate whitespace-nowrap text-sm text-gray-600">
            ⏰ Exp: {job.experience || "Not specified"}
          </div>
        </div>

        <div className="mt-auto flex justify-center px-4 pb-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleApplyNow(job.id);
            }}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
          >
            Apply Now
          </button>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
        <div className="mb-4 mt-6 flex flex-col items-center justify-between gap-6 px-2 py-4 md:flex-row">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold leading-tight tracking-tight text-purple-900 md:text-3xl">
              We Are Hiring at{" "}
              <span className="text-purple-900">ASKOXY.AI</span>
            </h1>
            <p className="mt-1 text-base font-medium text-gray-600 md:text-lg">
              Discover open positions and apply for the role that matches your
              skills.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchJobs}
            className="rounded-xl bg-[#008cba] px-8 py-2 font-bold text-white shadow-sm transition-all hover:bg-[#007aa3]"
          >
            Reload Jobs
          </button>
        </div>

        <div className="mb-6 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-4 text-gray-800 transition-colors hover:border-blue-300 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold">ASKOXY_AI Jobs</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold">
                {filteredJobs.length} Active Jobs
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col items-start justify-between gap-2 px-2 sm:flex-row sm:items-center sm:px-4 lg:px-6">
            <h2 className="text-xl font-bold text-gray-800">
              Available Positions
            </h2>
            <div className="text-sm text-gray-600">
              Showing {Math.min(displayedJobsCount, filteredJobs.length)} of{" "}
              {filteredJobs.length} jobs
            </div>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredJobs.slice(0, displayedJobsCount).map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </motion.div>

            {filteredJobs.length > displayedJobsCount && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setDisplayedJobsCount((prev) => prev + 20)}
                  className="rounded-lg border border-indigo-100 bg-indigo-50 px-8 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-all duration-200 hover:bg-indigo-100 hover:shadow-md"
                >
                  Load More Jobs ({filteredJobs.length - displayedJobsCount}{" "}
                  remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border bg-white py-16 text-center shadow-sm">
            <div className="mb-3 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              No jobs found
            </h3>
            <p className="mb-4 text-gray-600">Try changing your search text.</p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiringPages;
