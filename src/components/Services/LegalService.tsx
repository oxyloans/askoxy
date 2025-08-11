import React from "react";
import { BookOpen, Users, Building2, ArrowRight } from "lucide-react";

function FreeAIBookHome() {
  // Direct preview link for better UX
  const googleDriveLink =
    "https://docs.google.com/presentation/d/1VhV-DHryWpu81oiVjDTzi6WxDKaddEEz/preview";

  const handleOpenBook = () => {
    window.open(googleDriveLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100">
      {/* Main Content */}
      <main className="flex-grow py-16 px-6 sm:px-10 lg:px-20">
        {/* Header */}
        <header className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
            🚀 Empowering India with AI Innovation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join the movement shaping the future of{" "}
            <span className="font-semibold text-blue-700">
              Artificial Intelligence
            </span>
            , <span className="font-semibold text-purple-700">Blockchain</span>{" "}
            & <span className="font-semibold text-green-700">Cloud</span> —
            through education, innovation, and community learning.
          </p>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Card Template */}
          {[
            {
              icon: <Users className="text-blue-600 w-12 h-12 mx-auto mb-5" />,
              title: "Mission Million AI Coders",
              desc: "Skilling 1 million Indians in AI, Blockchain & Cloud through real-world projects, mentorship, and collaborative learning.",
              borderColor: "border-blue-500",
            },
            {
              icon: (
                <Building2 className="text-purple-600 w-12 h-12 mx-auto mb-5" />
              ),
              title: "BillionAIre Hub",
              desc: "India’s first AI Studio-as-a-Service in Hyderabad — open to entrepreneurs, students & professionals to innovate for free.",
              borderColor: "border-purple-500",
            },
            {
              icon: (
                <BookOpen className="text-green-600 w-12 h-12 mx-auto mb-5" />
              ),
              title: "Our First Free AI Book",
              desc: "Discover India’s AI journey with inspiring stories, real-world insights, and future-ready strategies from our initiatives.",
              borderColor: "border-green-500",
              button: true,
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center border-t-4 ${card.borderColor}`}
            >
              {card.icon}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {card.title}
              </h2>
              <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
                {card.desc}
              </p>
              {card.button && (
                <button
                  onClick={handleOpenBook}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2 mx-auto transition-all duration-300 shadow-md"
                >
                  View Book
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center mt-auto">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">ASKOXY.AI</span> — Empowering Minds
          with AI
        </p>
      </footer>
    </div>
  );
}

export default FreeAIBookHome;
