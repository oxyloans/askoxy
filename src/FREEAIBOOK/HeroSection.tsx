import React, { useState, useEffect, useCallback } from "react";
import { BookOpen, Users, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FreeAIBookHome: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsappregister";

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate("/FreeAIBook/view");
      } else {
        sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cardBaseClasses =
    "bg-white rounded-3xl shadow-xl p-5 text-center border-t-4 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-400 hover:shadow-2xl hover:scale-105";

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <section
        className={`flex-grow px-6 sm:px-10 lg:px-20 py-2 md:py-4 transition-shadow duration-300 ${
          isScrolled ? "shadow-sm" : "shadow-none"
        }`}
        aria-labelledby="main-heading"
      >
        <div className="max-w-7xl mx-auto text-center mb-4">
          <h1
            id="main-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 select-none"
          >
            Empowering India with AI Innovation
          </h1>

          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-gray-700 select-text">
            Join the movement shaping the future of Artificial Intelligence,
            Blockchain & Cloud — through education, innovation, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <article
            tabIndex={0}
            aria-label="Mission Million AI Coders"
            className={`${cardBaseClasses} border-blue-500`}
          >
            <Users
              className="text-blue-600 w-14 h-14 mx-auto mb-6"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">
              Mission Million AI Coders
            </h2>
            <p className="text-blue-600 text-base leading-relaxed">
              Skilling <strong>1 million Indians</strong> in AI, Blockchain &
              Cloud through real-world projects, mentorship, and
              community-driven learning.
            </p>
          </article>

          <article
            tabIndex={0}
            aria-label="BillionAIre Hub"
            className={`${cardBaseClasses} border-purple-500`}
          >
            <Building2
              className="text-purple-600 w-14 h-14 mx-auto mb-6"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">
              BillionAIre Hub
            </h2>
            <p className="text-purple-600 text-base leading-relaxed">
              India’s first <strong>AI Studio-as-a-Service</strong> in Hyderabad
              — open to entrepreneurs, students & professionals to innovate and
              build AI solutions for free.
            </p>
          </article>

          <article
            tabIndex={0}
            aria-label="Our First Free AI Book"
            className={`${cardBaseClasses} border-green-500`}
          >
            <BookOpen
              className="text-green-600 w-14 h-14 mx-auto mb-6"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Our First Free AI Book
            </h2>
            <p className="text-green-600 text-base leading-relaxed">
              Discover India’s AI journey with inspiring stories, real-world
              insights, and future-ready strategies from our initiatives.
            </p>
          </article>
        </div>

        {/* Button */}
        <div className="mt-16 text-center">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="View our first free AI book"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 hover:from-indigo-700 hover:via-purple-800 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2 text-white font-semibold py-4 px-10 rounded-full shadow-lg transition-transform duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                Our First Free AI Book <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
};

export default FreeAIBookHome;
