import React from "react";
import { Brain, FileCheck2, Send, RotateCcw } from "lucide-react";
import examImg from "../../assets/img/j2.png";

const AIExamSection: React.FC = () => {
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_26%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div className="order-1 flex justify-center">
            <img
              src={examImg}
              alt="AI based exam"
              className="w-full max-w-[320px] object-contain sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px]"
            />
          </div>

          <div className="order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] shadow-sm backdrop-blur-xl sm:text-xs">
              <Brain className="h-3.5 w-3.5" />
              AI-Based Exams
            </div>

            <h2 className="mt-5 max-w-xl text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
              Prove your skills with{" "}
              <span className="relative inline-block text-[#2563eb]">
                AI-based exams
                <span className="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[#3b82f6]" />
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] sm:text-[15px] md:text-base">
              We conduct AI-based exams based on the job description and role
              requirement. Candidates who score well become qualified profiles
              inside the system and are ready for referral and employer review.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    JD-based <span className="text-[#2563eb]">exam</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Take an AI-based exam tailored to the role and job description.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Qualify for <span className="text-[#2563eb]">referral</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Strong scores help candidates enter the referral and hiring pipeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 text-[#2563eb] shadow-sm backdrop-blur-xl">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                    Improve and <span className="text-[#2563eb]">retry</span>
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    Candidates can improve weak areas with mentoring and take the exam again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIExamSection;