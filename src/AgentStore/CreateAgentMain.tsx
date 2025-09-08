import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAgentMain() {
  const navigate = useNavigate();

  const goNext = (type: "ai-twin" | "ai-enabler") => {
    // Pass the selected type via query string (consume it in /bharat-agent if needed)
    navigate(`/verify-agent`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/20 to-cyan-900/30" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Create Your AI Agent
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Choose the perfect AI setup for your journey
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* AI Twin */}
          <div className="relative group transition-all duration-300 hover:scale-[1.02]">
            <div className="relative rounded-2xl p-6 border backdrop-blur-lg transition-all duration-300 border-white/20 bg-white/10 hover:border-violet-300/50 hover:bg-white/12 shadow-xl shadow-violet-500/10">
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">AI Twin</h2>
              </div>

              {/* Description */}
              <div className="space-y-2 mb-4">
                <p className="text-slate-200 text-sm leading-relaxed">
                  Your expert mirror. The agent reflects your professional
                  knowledge, judgement, and standards.
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  <span className="font-semibold">Meaning:</span> Your expertise
                  powers the assistant.
                </p>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <p className="text-slate-300 text-sm font-semibold mb-2">
                  Examples
                </p>
                <ul className="space-y-2 text-slate-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>
                      <span className="font-semibold">Advocate:</span> Enable a
                      legal twin to draft notes, organize case points, and speed
                      up your daily work.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>
                      <span className="font-semibold">CA/CS/Doctor:</span>{" "}
                      Advisory twin for checklists, FAQs, and compliant
                      responses.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Continue Button (AI Twin) */}
              <div className="flex justify-end">
                <button
                  onClick={() => goNext("ai-twin")}
                  className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Continue as AI Twin
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* AI Enabler */}
          <div className="relative group transition-all duration-300 hover:scale-[1.02]">
            <div className="relative rounded-2xl p-6 border backdrop-blur-lg transition-all duration-300 border-white/20 bg-white/10 hover:border-violet-300/50 hover:bg-white/12 shadow-xl shadow-violet-500/10">
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  AI Enabler
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-2 mb-4">
                <p className="text-slate-200 text-sm leading-relaxed">
                  Build helpful agents even if you’re not a certified expert.
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  <span className="font-semibold">Meaning:</span> If you’re not
                  an Advocate (or other license-holder), you can still explore a
                  domain and create utility/awareness assistants.
                </p>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <p className="text-slate-300 text-sm font-semibold mb-2">
                  Examples
                </p>
                <ul className="space-y-2 text-slate-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>
                      <span className="font-semibold">Student/Creator:</span>{" "}
                      Legal awareness bot to explain simple procedures.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>
                      <span className="font-semibold">Teacher/Techie:</span>{" "}
                      Quiz or learning assistant to help the public understand a
                      topic.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Continue Button (AI Enabler) */}
              <div className="flex justify-end">
                <button
                  onClick={() => goNext("ai-enabler")}
                  className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Continue as Enabler
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
