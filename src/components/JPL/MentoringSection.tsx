import React from "react";
import { Bot, Users } from "lucide-react";
import mentoringImg from "../../assets/img/j3.png";

const MentoringSection: React.FC = () => {
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_26%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] shadow-sm backdrop-blur-xl sm:text-xs">
              <Bot className="h-3.5 w-3.5" />
              Mentoring Support
            </div>

            <h2 className="mt-5 max-w-xl text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
              <span className="text-[#2563eb]">AI + Human</span>{" "}
              <span className="relative inline-block text-[#2563eb]">
                mentoring
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[#3b82f6]" />
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] sm:text-[15px] md:text-base">
              JPL supports candidates with AI mentoring and human mentoring from
              professionals with 15+ years of experience in BFSI and other
              technologies to improve performance, confidence, and job readiness.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    AI-based <span className="text-[#2563eb]">mentoring</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Get instant insights, smart recommendations, and continuous learning support.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Human <span className="text-[#2563eb]">mentoring</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Learn from experts with 15+ years of experience in BFSI and technology domains.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={mentoringImg}
              alt="AI and Human mentoring"
              className="w-full max-w-[320px] object-contain sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentoringSection;