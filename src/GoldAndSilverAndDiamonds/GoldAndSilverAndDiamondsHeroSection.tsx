import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Cpu, X, ArrowRight, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rotatingWords = [
  "Gold Jewelry",
  "Silver Ornaments",
  "Diamond Collection",
  "Custom Designs",
  "Elegant Accessories",
];

function GoldSilverDiamondHeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const scrollRef = useRef(isScrolled);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"video" | "image" | null>(null);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    skinTone: "",
    event: "",
  });
  const LOGIN_URL = "/whatsapplogin";
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    let charIndex = 0;
    const currentWord = rotatingWords[currentWordIndex];
    setTypedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (charIndex < currentWord.length) {
        setTypedText(currentWord.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [currentWordIndex]);

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/dashboard/products?type=GOLD";
      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const videoCreator = () => {
    const existingContext = sessionStorage.getItem("userJewelryContext");
    if (existingContext) {
      window.location.href = "/video-creator";
    } else {
      setModalType("video");
      setShowModal(true);
    }
  };

  const imageCreator = () => {
    const existingContext = sessionStorage.getItem("userJewelryContext");
    if (existingContext) {
      window.location.href = "/image-creator";
    } else {
      setModalType("image");
      setShowModal(true);
    }
  };

  const handleModalSubmit = () => {
    const userContext = `Gender: ${formData.gender}, Age: ${formData.age}, Skin Tone: ${formData.skinTone}, Event: ${formData.event}`;
    sessionStorage.setItem("userJewelryContext", userContext);

    setShowModal(false);
    if (modalType === "video") {
      window.location.href = "/video-creator";
    } else {
      window.location.href = "/image-creator";
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-100 via-slate-50 to-gray-200 px-6 py-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-slate-400/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Timeless Beauty in{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-slate-600 to-gray-800">
              {typedText}
              <span
                className={`inline-block w-1 h-8 bg-gradient-to-b from-gray-600 to-slate-700 ml-1 rounded-full ${
                  isTypingComplete ? "animate-pulse" : ""
                }`}
              ></span>
            </span>
          </h1>

          <p className="text-gray-700 text-lg max-w-xl">
            Discover a world of elegance and tradition with our exclusive Gold,
            Silver, and Diamond collections — curated to perfection for every
            special moment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                title: "Gold Collection",
                desc: "22K & 24K timeless designs.",
                icon: "🏆",
              },
              {
                title: "Silver Pieces",
                desc: "Chic & traditional silver.",
                icon: "✨",
              },
              {
                title: "Diamond Range",
                desc: "Certified premium brilliance.",
                icon: "💎",
              },
            ].map(({ title, desc, icon }, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-gray-200/50 backdrop-blur-md rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:bg-white/90"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-center">
            {/* Explore Collection - Primary */}
            <button
              onClick={handleSignIn}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Explore Collection
              <ArrowRight size={16} />
            </button>

            {/* Jewellery Videos */}
            <button
              onClick={videoCreator}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Design Jewellery Videos
              <ArrowRight size={16} />
            </button>

            {/* Jewellery Images */}
            <button
              onClick={imageCreator}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Design Jewellery Images
              <ArrowRight size={16} />
            </button>

            {/* Voice AI */}
            <button
              onClick={() => navigate("/voiceAssistant")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Talk with Gold Voice AI
              <Mic size={16} />
            </button>
          </div>
        </div>

        <div
          className={`flex justify-center transition-all mt-16 duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
        >
          <div className="relative group max-w-md w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition" />
            <img
              src="https://i.ibb.co/CpWT33QR/gold.png"
              alt="Jewelry"
              className="relative rounded-2xl shadow-xl group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-slide-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personalize Your Design
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Enter age"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Tone
                </label>
                <select
                  value={formData.skinTone}
                  onChange={(e) =>
                    setFormData({ ...formData, skinTone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Skin Tone</option>
                  <option value="Fair">Fair</option>
                  <option value="Medium">Medium</option>
                  <option value="Olive">Olive</option>
                  <option value="Brown">Brown</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event/Celebration
                </label>
                <select
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Event</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Official/Formal">Official/Formal</option>
                  <option value="Ethnic/Traditional">Ethnic/Traditional</option>
                  <option value="Casual">Casual</option>
                  <option value="Festival">Festival</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleModalSubmit}
              disabled={
                !formData.gender ||
                !formData.age ||
                !formData.skinTone ||
                !formData.event
              }
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Design
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

export default GoldSilverDiamondHeroSection;
