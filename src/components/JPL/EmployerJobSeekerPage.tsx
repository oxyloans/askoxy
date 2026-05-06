import React, { useState } from "react";
import {
  FileText,
  Bot,
  BarChart3,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Star,
  Send,
} from "lucide-react";

const EmployerJobSeekerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"employers" | "seekers">(
    "employers"
  );
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f7f4] text-[#0a0a0f] font-sans">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 bg-white px-4 py-4 md:px-10">
        <div className="text-xl font-extrabold tracking-tight">
          hire<span className="text-[#1a1aff]">sync</span>
        </div>

        <div className="flex rounded-full bg-[#f0efe9] p-1">
          <button
            onClick={() => setActiveTab("employers")}
            className={`rounded-full px-4 py-2 text-xs font-medium transition md:px-5 ${
              activeTab === "employers"
                ? "bg-[#0a0a0f] text-white"
                : "text-[#3a3a4a]"
            }`}
          >
            For Employers
          </button>
          <button
            onClick={() => setActiveTab("seekers")}
            className={`rounded-full px-4 py-2 text-xs font-medium transition md:px-5 ${
              activeTab === "seekers"
                ? "bg-[#0a0a0f] text-white"
                : "text-[#3a3a4a]"
            }`}
          >
            For Job Seekers
          </button>
        </div>

        <button className="hidden rounded-full bg-[#1a1aff] px-5 py-2 text-sm font-medium text-white md:block">
          Get Started Free
        </button>
      </nav>

      {activeTab === "employers" && (
        <>
          <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:px-10 md:py-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eeeeff] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6c47ff]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#6c47ff]" />
                AI-Powered Hiring
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Hire <span className="text-[#1a1aff]">Qualified</span>
                <br />
                Talent Faster
                <br />
                Than Ever
              </h1>

              <p className="mb-7 max-w-md text-base leading-7 text-[#3a3a4a]">
                Post a role, let our AI conduct video interviews, score every
                candidate against your JD — and surface the top 3% to your inbox
                within 24 hours.
              </p>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-[#0a0a0f] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#1a1aff]">
                  Post a Job Role
                </button>
                <button className="rounded-full border border-[#0a0a0f] px-7 py-3 text-sm font-medium text-[#0a0a0f] transition hover:bg-[#f0efe9]">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-bold">Senior React Developer</h3>
                  <span className="rounded-full bg-[#e1f5ee] px-3 py-1 text-xs font-bold text-[#085041]">
                    12 qualified
                  </span>
                </div>

                {[
                  ["AR", "Arjun Reddy", "5 yrs · Hyderabad", "94%", "#e1f5ee"],
                  ["PK", "Priya Kumari", "4 yrs · Bangalore", "91%", "#eeeeff"],
                  ["SM", "Sanjay Mehta", "3 yrs · Pune", "78%", "#fef3e2"],
                ].map((item) => (
                  <div
                    key={item[1]}
                    className="mb-3 flex items-center gap-3 rounded-2xl border border-transparent bg-[#f8f7f4] p-3 transition hover:border-[#1a1aff]"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: item[4] }}
                    >
                      {item[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item[1]}</div>
                      <div className="text-xs text-[#3a3a4a]">{item[2]}</div>
                    </div>
                    <div className="font-extrabold text-[#00b89c]">
                      {item[3]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute -right-2 -top-5 rounded-2xl bg-white px-4 py-2 text-xs font-bold shadow-lg">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#00b89c]" />
                AI Interview Done
              </div>

              <div className="absolute -left-3 bottom-6 rounded-2xl bg-white px-4 py-2 text-xs font-bold shadow-lg">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#e8a020]" />
                3 Shortlisted
              </div>
            </div>
          </section>

          <section className="grid gap-6 bg-[#0a0a0f] px-4 py-8 text-center text-white sm:grid-cols-2 md:grid-cols-4 md:px-10">
            {[
              ["68%", "Faster Time to Hire"],
              ["4.2x", "Better Hire Quality"],
              ["92%", "Employer Satisfaction"],
              ["18min", "Avg. Setup Time"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-extrabold">
                  {num}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  {label}
                </div>
              </div>
            ))}
          </section>

          <section className="mx-auto max-w-6xl px-4 py-14 md:px-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1a1aff]">
              How it works
            </p>
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight">
              From JD to Offer in 4 Steps
            </h2>

            <div className="grid overflow-hidden rounded-3xl border border-black/10 bg-[#f0efe9] md:grid-cols-4">
              {[
                [FileText, "Post Your Role", "Paste your JD or build one with AI. Define skills, experience level, and assessment criteria in minutes."],
                [Bot, "AI Conducts Interviews", "Every applicant gets a tailored AI video interview — questions generated from your JD automatically."],
                [BarChart3, "Get Ranked Scores", "Candidates scored on technical fit, communication, problem-solving, and role-specific competencies."],
                [UserCheck, "Hire the Best", "Top profiles pushed directly to your dashboard. Review, shortlist, and send offers — all in one place."],
              ].map(([Icon, title, desc], index) => {
                const LucideIcon = Icon as React.ElementType;
                return (
                  <div key={title as string} className="relative bg-white p-6">
                    <div className="absolute right-5 top-4 text-5xl font-extrabold text-[#f0efe9]">
                      0{index + 1}
                    </div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeeeff] text-[#1a1aff]">
                      <LucideIcon size={22} />
                    </div>
                    <h4 className="mb-2 font-bold">{title as string}</h4>
                    <p className="text-sm leading-6 text-[#3a3a4a]">
                      {desc as string}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-14 md:px-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1a1aff]">
              Smart Job Builder
            </p>
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight">
              Create Your Job Post
            </h2>

            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="flex flex-col gap-4 bg-gradient-to-br from-[#0a0a0f] to-[#1a1a3f] p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Job Description Builder
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    AI will generate interview questions automatically from this
                    JD
                  </p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#00e5b3]" />
                  AI Active
                </div>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                {[
                  ["Job Title", "Senior React Developer"],
                  ["Department", "Engineering"],
                  ["Experience Level", "3–5 Years"],
                  ["Work Mode", "Hybrid"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#3a3a4a]">
                      {label}
                    </label>
                    <input
                      value={value}
                      readOnly
                      className="w-full rounded-2xl border border-black/10 bg-[#f8f7f4] px-4 py-3 text-sm outline-none"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#3a3a4a]">
                    Job Description
                  </label>
                  <textarea
                    readOnly
                    value="We are looking for a Senior React Developer to join our product team. The candidate should have strong experience with React, TypeScript, and REST APIs. Experience with Node.js and AWS is a plus."
                    className="min-h-28 w-full resize-none rounded-2xl border border-black/10 bg-[#f8f7f4] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#3a3a4a]">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "REST APIs", "Git"].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#eeeeff] px-4 py-2 text-xs font-medium text-[#6c47ff]"
                        >
                          {skill} ×
                        </span>
                      )
                    )}
                    <button className="rounded-full border border-dashed border-black/30 px-4 py-2 text-xs text-[#3a3a4a]">
                      + Add Skill
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-black/10 bg-[#f8f7f4] p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-4 text-sm text-[#3a3a4a]">
                  <span>✓ Auto-generate 15 interview questions</span>
                  <span>✓ Custom scoring rubric</span>
                  <span>✓ Bias-free evaluation</span>
                </div>
                <button className="rounded-full bg-[#0a0a0f] px-6 py-3 text-sm font-medium text-white">
                  Publish Job →
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-14 md:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1a1aff]">
                    Candidate Pipeline
                  </p>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    Scored Applicants
                  </h2>
                </div>

                <div className="flex gap-2">
                  {["All", "Score 80+", "Shortlisted"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-4 py-2 text-xs font-medium ${
                        activeFilter === filter
                          ? "bg-[#0a0a0f] text-white"
                          : "bg-[#f0efe9] text-[#3a3a4a]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["AR", "Arjun Reddy", "Senior Frontend Dev · 5 yrs", "94%", "#00b89c"],
                  ["PK", "Priya Kumari", "Full Stack Dev · 4 yrs", "91%", "#00b89c"],
                  ["RV", "Rahul Verma", "React Dev · 3 yrs", "78%", "#e8a020"],
                ].map(([initial, name, role, score, color]) => (
                  <div
                    key={name}
                    className="rounded-3xl border border-black/10 bg-[#f8f7f4] p-6 transition hover:-translate-y-1 hover:border-[#1a1aff]"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eeeeff] font-bold">
                        {initial}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{name}</h4>
                        <p className="text-xs text-[#3a3a4a]">{role}</p>
                      </div>
                      <span className="rounded-full bg-[#e1f5ee] px-3 py-1 text-xs font-bold text-[#085041]">
                        {score}
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {["React", "TypeScript", "AWS", "Node.js"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-[#3a3a4a]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mb-2 flex justify-between text-xs text-[#3a3a4a]">
                      <span>AI Interview Score</span>
                      <span>{score}/100</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: score,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "seekers" && (
        <>
          <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a0a3f] to-[#0a1a3f] px-4 py-16 text-center md:px-10 md:py-24">
            <div className="relative z-10">
              <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                🎯 AI Career Intelligence
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Know Your
                <br />
                <span className="bg-gradient-to-r from-[#6c47ff] to-[#00b89c] bg-clip-text text-transparent">
                  Career Fitness
                </span>
                <br />
                Score Today
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-white/60">
                Upload your resume. Our AI assesses your strengths, skill gaps,
                market fit, and tells you exactly what to improve — in under 60
                seconds.
              </p>

              <div className="mx-auto mb-7 max-w-lg cursor-pointer rounded-3xl border-2 border-dashed border-white/20 bg-white/5 p-10 backdrop-blur transition hover:border-[#6c47ff] hover:bg-white/10">
                <div className="mb-4 text-4xl">📄</div>
                <h4 className="mb-2 font-semibold text-white">
                  Drop your resume here
                </h4>
                <p className="text-sm text-white/50">
                  or click to browse — we'll analyze it instantly
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  {["PDF", "DOCX", "LinkedIn"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0a0a0f]">
                  Analyze My Resume
                </button>
                <button className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-medium text-white">
                  Try AI Interview Practice
                </button>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-14 md:px-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1a1aff]">
              Resume Intelligence Report
            </p>
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight">
              Your Career Fitness Dashboard
            </h2>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-3xl border border-black/10 bg-white p-7 text-center">
                <div className="relative mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-[#6c47ff]">
                  <div>
                    <div className="text-5xl font-extrabold">80</div>
                    <div className="text-xs text-[#3a3a4a]">out of 100</div>
                  </div>
                </div>

                <h3 className="mb-1 text-lg font-bold">Strong Candidate</h3>
                <p className="mb-6 text-sm leading-6 text-[#3a3a4a]">
                  You are in the top 28% of applicants for your target roles. A
                  few targeted improvements could push you to the top 10%.
                </p>

                {[
                  ["Tech Skills", "88%"],
                  ["Experience", "75%"],
                  ["Projects", "70%"],
                  ["Keywords", "82%"],
                  ["Formatting", "90%"],
                ].map(([label, value]) => (
                  <div key={label} className="mb-3 grid grid-cols-[90px_1fr_35px] items-center gap-2">
                    <span className="text-left text-xs text-[#3a3a4a]">
                      {label}
                    </span>
                    <div className="h-2 overflow-hidden rounded-full bg-[#f0efe9]">
                      <div
                        className="h-full rounded-full bg-[#6c47ff]"
                        style={{ width: value }}
                      />
                    </div>
                    <span className="text-right text-xs font-bold">
                      {value.replace("%", "")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-4">
                {[
                  [
                    AlertTriangle,
                    "Missing Trending Skills",
                    "Your resume doesn't mention these high-demand technologies that most React Developer job posts require.",
                    ["Next.js 14", "React Query", "Zustand", "Vitest"],
                  ],
                  [
                    TrendingUp,
                    "Impact Statements are Weak",
                    "Some job bullets describe responsibilities, not achievements. Quantify your impact with metrics-driven bullets.",
                    [],
                  ],
                  [
                    Star,
                    "Strong Skill Coverage",
                    "Your core stack perfectly matches current market demand. You're well-positioned for multiple open roles.",
                    ["React ✓", "TypeScript ✓", "Node.js ✓"],
                  ],
                ].map(([Icon, title, desc, tags]) => {
                  const LucideIcon = Icon as React.ElementType;
                  return (
                    <div
                      key={title as string}
                      className="rounded-3xl border border-black/10 bg-white p-6"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eeeeff] text-[#1a1aff]">
                          <LucideIcon size={20} />
                        </div>
                        <h4 className="font-bold">{title as string}</h4>
                      </div>
                      <p className="text-sm leading-6 text-[#3a3a4a]">
                        {desc as string}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(tags as string[]).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#eeeeff] px-3 py-1 text-xs font-medium text-[#6c47ff]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#0a0a0f] px-4 py-14 md:px-10">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00b89c]">
                  AI Interview Practice
                </p>
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  Practice Interviews
                  <br />
                  That Feel Real
                </h2>
                <p className="mb-6 text-sm leading-7 text-white/60">
                  Our AI interviewer adapts to your resume and the specific role
                  you're applying for. Get instant feedback on every answer — no
                  more guessing.
                </p>

                <div className="space-y-3 text-sm text-white/70">
                  <p>🎯 Questions tailored to your resume gaps</p>
                  <p>⚡ Instant scoring & improvement tips</p>
                  <p>📊 Detailed report with example answers</p>
                  <p>🔄 Unlimited practice rounds</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111125]">
                <div className="flex items-center gap-3 border-b border-white/10 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6c47ff] to-[#1a1aff] text-sm font-bold text-white">
                    AI
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      HireSync Interviewer
                    </h4>
                    <p className="text-xs text-[#00b89c]">
                      ● Senior React Developer — Round 1
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/10 p-4 text-sm leading-6 text-white/80">
                    Hello! I've reviewed your resume. How would you optimize a
                    React app that's rendering 10,000 list items?
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#6c47ff] p-4 text-sm leading-6 text-white">
                    I'd use virtualization with react-window or react-virtual,
                    combined with useMemo and React.memo.
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/10 p-4 text-sm leading-6 text-white/80">
                    Great answer. Can you also explain when you'd choose code
                    splitting over virtualization?
                  </div>
                </div>

                <div className="flex gap-3 border-t border-white/10 p-4">
                  <input
                    placeholder="Type your answer..."
                    className="flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                  <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6c47ff] text-white">
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-gradient-to-br from-[#6c47ff] to-[#1a1aff] px-4 py-16 text-center md:px-10">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-white">
          Ready to Transform Hiring?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-white/70">
          Join thousands of companies and job seekers already using HireSync to
          make smarter career decisions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0a0a0f]">
            Post a Job — Free
          </button>
          <button className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-medium text-white">
            Analyze My Resume
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmployerJobSeekerPage;