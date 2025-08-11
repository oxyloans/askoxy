import React from "react";
import { BookOpen, Users, Building2, ArrowRight } from "lucide-react";

function FreeAIBookHome() {
  const googleDriveLink =
    "https://docs.google.com/presentation/d/1VhV-DHryWpu81oiVjDTzi6WxDKaddEEz/preview";

  const handleOpenBook = () => {
    window.open(googleDriveLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Section */}
      <section className="flex-grow bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 py-16 px-6 sm:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            🚀 Empowering India with AI Innovation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join the movement that’s shaping the future of Artificial
            Intelligence, Blockchain & Cloud — through education, innovation,
            and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Million AI Coders */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center border-t-4 border-blue-500">
            <Users className="text-blue-600 w-12 h-12 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mission Million AI Coders
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Skilling <span className="font-semibold">1 million Indians</span>{" "}
              in AI, Blockchain & Cloud through real-world projects, mentorship,
              and community-driven learning.
            </p>
          </div>

          {/* BillionAIre Hub */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center border-t-4 border-purple-500">
            <Building2 className="text-purple-600 w-12 h-12 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              BillionAIre Hub
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              India’s first{" "}
              <span className="font-semibold">AI Studio-as-a-Service</span>
              in Hyderabad — open to entrepreneurs, students & professionals to
              innovate and build AI solutions for free.
            </p>
          </div>

          {/* First Free AI Book */}
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-center border-t-4 border-green-500">
            <BookOpen className="text-green-600 w-12 h-12 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our First Free AI Book
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              Discover India’s AI journey with inspiring stories, real-world
              insights, and future-ready strategies from our initiatives.
            </p>
            <button
              onClick={handleOpenBook}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2 mx-auto transition-all duration-300 shadow-md"
            >
              View Book
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
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
