import React from "react";
import { Search, Upload, FileCheck2 } from "lucide-react";
import searchJobImg from "../../assets/img/j1.png";

const JobSearchSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] py-16 sm:py-20 lg:py-24">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "78px 78px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_26%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] shadow-sm backdrop-blur-xl sm:text-xs">
              <Search className="h-3.5 w-3.5" />
              Smart Resume Matching
            </div>

            <h2 className="mt-5 max-w-xl text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
              Search your job by{" "}
              <span className="relative inline-block text-[#2563eb]">
                role
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-[#3b82f6]" />
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] sm:text-[15px] md:text-base">
              Job seekers can search roles, upload resumes, and let AI compare
              the profile against the job description. If the profile is not yet
              ready, the system highlights what is missing and what needs to be
              improved before the next stage.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Search your <span className="text-[#2563eb]">job role</span>
                  </h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    Browse openings based on role, goal, and company need.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Upload your <span className="text-[#2563eb]">resume</span>
                  </h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    Submit your profile for AI-based JD comparison.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Match score and <span className="text-[#2563eb]">next step</span>
                  </h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    If the match is strong, the candidate moves to the AI-based
                    exam stage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <img
              src={searchJobImg}
              alt="Search jobs"
              className="w-full max-w-[320px] object-contain sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearchSection;