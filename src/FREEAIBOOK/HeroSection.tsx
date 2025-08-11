import React, { useState, useEffect } from "react";
import { BookOpen, Users, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const FreeAIBookHome: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
const LOGIN_URL = "/whatsappregister";

   const handleSignIn = async () => {
     try {
       setIsLoading(true);
       const userId = localStorage.getItem("userId");
       if (userId) {
         // ✅ Directly navigate to the image viewer
         navigate("/FreeAIBook/view");
       } else {
         // Save the intended path so user comes back here after login
         sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
         window.location.href = LOGIN_URL; // goes to WhatsApp register
       }
     } catch (error) {
       console.error("Sign in error:", error);
     } finally {
       setIsLoading(false);
     }
   };


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <section
        className={`flex-grow px-6 sm:px-10 lg:px-20 py-4 transition-shadow duration-300 ${
          isScrolled ? "shadow-sm" : "shadow-none"
        }`}
        aria-labelledby="main-heading"
      >
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h1
            id="main-heading"
            className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500"
          >
            Empowering India with AI Innovation
          </h1>

          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            Join the movement shaping the future of Artificial Intelligence,
            Blockchain & Cloud — through education, innovation, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <article
            className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-blue-500 transform transition-transform duration-300 hover:shadow-2xl hover:scale-[1.04]"
            tabIndex={0}
            aria-label="Mission Million AI Coders"
          >
            <Users
              className="text-blue-600 w-12 h-12 mx-auto mb-5"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Mission Million AI Coders
            </h2>
            <p className="text-blue-600 text-[15px] leading-relaxed">
              Skilling <strong>1 million Indians</strong> in AI, Blockchain &
              Cloud through real-world projects, mentorship, and
              community-driven learning.
            </p>
          </article>

          <article
            className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-purple-500 transform transition-transform duration-300 hover:shadow-2xl hover:scale-[1.04]"
            tabIndex={0}
            aria-label="BillionAIre Hub"
          >
            <Building2
              className="text-purple-600 w-12 h-12 mx-auto mb-5"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              BillionAIre Hub
            </h2>
            <p className="text-purple-600 text-[15px] leading-relaxed">
              India’s first <strong>AI Studio-as-a-Service</strong> in Hyderabad
              — open to entrepreneurs, students & professionals to innovate and
              build AI solutions for free.
            </p>
          </article>

          <article
            className="bg-white rounded-3xl shadow-xl p-8 text-center border-t-4 border-green-500 transform transition-transform duration-300 hover:shadow-2xl hover:scale-[1.04]"
            tabIndex={0}
            aria-label="Our First Free AI Book"
          >
            <BookOpen
              className="text-green-600 w-12 h-12 mx-auto mb-5"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Our First Free AI Book
            </h2>
            <p className="text-green-600 text-[15px] leading-relaxed">
              Discover India’s AI journey with inspiring stories, real-world
              insights, and future-ready strategies from our initiatives.
            </p>
          </article>
        </div>

        {/* Button below all cards */}
        <div className="mt-12 text-center">
          <button
            onClick={handleSignIn}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg"
            aria-label="View our first free AI book"
          >
            Our First Free AI Book
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default FreeAIBookHome;
