import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import Logo from "../assets/img/askoxylogonew.png";
import Footer from "./Footer";
import {
  Briefcase,
  MapPin,
  Clock3,
  Building2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

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

const AccentureJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=ACCENTURE`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Job[] = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const formatTitle = (job: Job) => job.jobTitle || job.jobDesignation || "Open Position";

  const handleViewDetails = (jobId: string) => {
    navigate(`/main/jobdetails/${jobId}`);
  };

  const lastUpdated = jobs.length
    ? new Date(Math.max(...jobs.map((j) => j.createdAt))).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-slate-700 font-semibold text-base sm:text-lg">
          <Loader2 className="w-6 h-6 animate-spin text-violet-700" />
          Loading Accenture jobs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 text-red-600 rounded-[28px] p-8 text-center shadow-sm max-w-md w-full">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <img src={Logo} alt="ASKOXY.AI" className="h-10 w-auto object-contain cursor-pointer" onClick={() => navigate("/")} />
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="hidden sm:block text-xs text-gray-500">
              Last updated: <span className="font-medium text-gray-700">{lastUpdated}</span>
            </span>
          )}
          <button
            onClick={() => navigate("/accenturestats")}
            className="inline-flex items-center gap-1.5 text-violet-700 hover:text-violet-900 font-medium transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-3 sm:px-5 lg:px-8 py-6 sm:py-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-600">
              Accenture Open Positions
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              {jobs.length} jobs available
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Briefcase className="w-20 h-20 mx-auto mb-6 opacity-60" />
              <p className="text-2xl">No open positions found at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
                {jobs.slice(0, visible).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleViewDetails(job.id)}
                    className="bg-white border border-[#e8e8ee] rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                  >
                    <div className="p-5 flex flex-col items-center text-center h-full">
                      {/* Logo */}
                      <div className="w-[140px] h-[96px] rounded-[18px] border border-[#d9d9df] bg-[#fbfbfc] flex items-center justify-center overflow-hidden mb-4">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-full h-full object-contain p-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-[#c4c4c8]">
                            <Building2 className="w-7 h-7 mb-1" />
                            <span className="text-[22px] font-extrabold leading-none">LOGO</span>
                            <span className="text-[9px] tracking-[3px] lowercase">empresa</span>
                          </div>
                        )}
                      </div>

                      {/* Company tag */}
                      <div className="px-4 py-2 rounded-2xl bg-[#edf8f2] text-[#243a5a] font-semibold text-[14px] mb-4 min-h-[44px] flex items-center justify-center">
                        {job.companyName || "ASKOXY.AI partner"}
                      </div>

                      {/* Job title */}
                      <h3 className="text-[18px] font-extrabold text-[#15233b] leading-[1.35] mb-3 min-h-[60px] flex items-center justify-center">
                        <span className="line-clamp-2">{formatTitle(job)}</span>
                      </h3>

                      {/* Title box */}
                      <div className="w-full bg-[#f2f2f5] rounded-2xl px-3 py-3 mb-3">
                        <div className="flex items-start justify-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#8b5e3c] mt-0.5 flex-shrink-0" />
                          <p className="text-[#22324d] font-bold text-[14px] leading-snug text-center line-clamp-2">
                            {formatTitle(job)}
                          </p>
                        </div>
                      </div>

                      {/* Location & Experience */}
                      <div className="w-full space-y-1.5 mb-5">
                        <div className="flex items-center justify-center gap-2 text-[#43506a] text-[13px]">
                          <MapPin className="w-3.5 h-3.5 text-[#ea4c89] flex-shrink-0" />
                          <span className="line-clamp-1">Loc: {job.jobLocations || "Not Available"}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[#43506a] text-[13px]">
                          <Clock3 className="w-3.5 h-3.5 text-[#ff5d8f] flex-shrink-0" />
                          <span>Exp: {job.experience || "Not Available"}</span>
                        </div>
                      </div>

                      {/* Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(job.id);
                        }}
                        className="mt-auto min-w-[148px] rounded-full bg-[#dbe9ff] hover:bg-[#cfe2ff] text-[#3f73f0] font-semibold text-[16px] px-6 py-3 transition-all duration-200"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {visible < jobs.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="px-10 py-3 rounded-full bg-violet-700 hover:bg-violet-800 text-white font-semibold text-base transition-all duration-200 shadow"
                  >
                    Load More ({jobs.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccentureJobsPage;
