import React from "react";
import { Bot, Users } from "lucide-react";
import mentoringImg from "../../assets/img/j3.png";

const MentoringSection: React.FC = () => {
  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#fbfaff] to-[#f0eaff] p-5 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(196,181,253,0.35),0_8px_0_rgba(196,181,253,0.45)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#7c3aed] bg-gradient-to-b from-[#c4b5fd] via-[#7c3aed] to-[#4c1d95] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(76,29,149,0.75),0_5px_0_rgba(76,29,149,0.75)]";

  const points = [
    {
      icon: Bot,
      title: "AI-Based Mentoring",
      desc: "Get instant insights, smart recommendations, and continuous learning support.",
    },
    {
      icon: Users,
      title: "Human Mentoring",
      desc: "Learn from experts with experience in BFSI and technology domains.",
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.08),transparent_26%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c3aed] backdrop-blur-xl sm:text-xs">
              <Bot className="h-3.5 w-3.5" />
              Mentoring Support
            </div>

            <h2 className="mt-5 max-w-xl text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.7rem] lg:text-[3rem]">
              <span className="text-[#2563eb]">AI</span> +{" "}
              <span className="text-[#7c3aed]">Human Mentoring</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#475569] sm:text-[15px] md:text-base">
              JPL supports candidates with AI mentoring and human mentoring to
              improve performance, confidence, skills, and job readiness.
            </p>

            <div className="mt-8 space-y-5">
              {points.map((item) => {
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

          <div className="flex justify-center">
            <img
              src={mentoringImg}
              alt="AI and Human mentoring"
              className="w-full max-w-[320px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.12)] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentoringSection;