import React from "react";
import { Search, Upload, FileCheck2 } from "lucide-react";
import searchJobImg from "../../assets/img/j1.png";

const JobSearchSection: React.FC = () => {
  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#f8fbff] to-[#eaf3ff] p-5 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.35),0_8px_0_rgba(147,197,253,0.45)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_5px_0_rgba(30,64,175,0.9)]";

  const steps = [
    {
      icon: Search,
      title: "Search Job Role",
      desc: "Browse openings based on role, goal, and company need.",
    },
    {
      icon: Upload,
      title: "Upload Resume",
      desc: "Submit your profile for AI-based JD comparison.",
    },
    {
      icon: FileCheck2,
      title: "Match Score",
      desc: "If the match is strong, the candidate moves to the AI-based exam stage.",
    },
  ];

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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2563eb] backdrop-blur-xl sm:text-xs">
              <Search className="h-3.5 w-3.5" />
              Smart Resume Matching
            </div>

            <h2 className="mt-5 max-w-xl text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
              Search your job by{" "}
              <span className="relative inline-block text-[#2563eb]">
                role
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[#3b82f6]" />
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] sm:text-[15px] md:text-base">
              Job seekers can search roles, upload resumes, and let AI compare
              the profile against the job description. The system highlights
              what is missing and what needs improvement before the next stage.
            </p>

            <div className="mt-8 space-y-5">
              {steps.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className={glossyCard}>
                    <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45 transition-all duration-700 group-hover:left-[120%]" />

                    <div className="relative flex items-start gap-4">
                      <div className={glossyIcon}>
                        <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
                        <Icon className="relative h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#0f172a] sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#475569]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <img
              src={searchJobImg}
              alt="Search jobs"
              className="w-full max-w-[320px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.12)] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearchSection;