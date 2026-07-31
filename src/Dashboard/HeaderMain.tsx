import React, { useContext, useEffect, useState } from "react";
import { Sparkles, Mic, ShoppingCart, X, Search, Menu } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
import { CartContext } from "../until/CartContext";
import SearchBar from "../kart/SearchBar";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
import VoiceWindow from "./VoiceWindow";

interface HeaderProps {
  cartCount?: number;
  IsMobile5: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderMain: React.FC<HeaderProps> = ({ IsMobile5 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const context = useContext(CartContext);
  if (!context) {
    throw new Error("HeaderMain must be used within CartProvider");
  }

  const { count, setCount } = context;

  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const [activeButton, setActiveButton] = useState<
    "voice" | "ai" | "profile" | "cart" | null
  >(null);
  const [isAiHovered, setIsAiHovered] = useState(false);
  const [isVoiceHovered, setIsVoiceHovered] = useState(false);

  const customerId = localStorage.getItem("userId");

  const searchTexts = [
    "SonaMasoori",
    "HMT Rice",
    "Brown Rice",
    "Cashews",
    "Basmati Rice",
    "Gold",
    "P2P Lending AI Agent",
  ];

  useEffect(() => {
    if (customerId) {
      fetchCartData();
    }
  }, [customerId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchValue.trim();

      if (trimmed.length >= 3) {
        // Mobile search should work like desktop: auto-open search page
        // without waiting for Enter key. Keep the search input open and do not clear it.
        if (isSearchVisible) {
          navigate(`/main/search-main?q=${encodeURIComponent(trimmed)}`, {
            replace: location.pathname === "/main/search-main",
          });
        }
      } else {
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchValue, isSearchVisible, location.pathname, navigate]);

  useEffect(() => {
    document.body.style.overflow = isVoiceOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVoiceOpen]);

  const toggleSidebar = () => {
    IsMobile5((prev: boolean) => !prev);
  };

  const fetchCartData = async () => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
      );
      setCount(response.data.length || 0);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const checkProfileCompletion = async (): Promise<boolean> => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`,
      );

      if (response.status === 200) {
        const profileData = response.data;
        return !!(profileData.firstName && profileData.firstName.trim() !== "");
      }
    } catch (error) {
      console.error("Profile check error:", error);
    }

    return false;
  };

  const handleCartClick = async () => {
    const isComplete = await checkProfileCompletion();
    if (!isComplete) {
      setShowValidationPopup(true);
      return;
    }
    navigate("/main/mycart");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();

    if (trimmed.length >= 3) {
      // Do not close or clear mobile search after Enter.
      // User can continue editing the same search text.
      navigate(`/main/search-main?q=${encodeURIComponent(trimmed)}`, {
        replace: location.pathname === "/main/search-main",
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes aiGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.35), 0 0 20px rgba(245, 158, 11, 0.25);
          }
          50% {
            box-shadow: 0 0 18px rgba(251, 191, 36, 0.5), 0 0 28px rgba(245, 158, 11, 0.35);
          }
        }

        .ai-glow {
          animation: aiGlow 2s ease-in-out infinite;
        }

        @keyframes sparkleRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .sparkle-rotate {
          animation: sparkleRotate 3s linear infinite;
        }
      `}</style>

      {/* Inline search bar below header — shown on tablet/mobile when search icon clicked */}
      {isSearchVisible && (
        <div className="fixed left-0 right-0 top-[64px] z-[999] bg-white border-b border-gray-200 shadow-lg sm:top-[72px] lg:hidden">
          <div className="mx-auto max-w-[1800px] px-4 py-3">
            <form
              className="flex items-center gap-2 w-full border-2 border-purple-500 rounded-full px-4 py-2.5 bg-white"
              onSubmit={handleSearchSubmit}
            >
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products, agents..."
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                autoComplete="off"
              />
              {!!searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Clear"
                >
                  <X size={15} className="text-gray-400" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchVisible(false);
                  setSearchValue("");
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-1"
                aria-label="Close search"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-[1000] h-[64px] sm:h-[72px] lg:h-[80px] border-b border-white/10 bg-[linear-gradient(135deg,#5c3391_0%,#312c74_55%,#1f2b67_100%)] shadow-[0_10px_30px_rgba(20,20,50,0.18)]">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSidebar}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>

            <img
              src={AskOxyLogo}
              alt="AskOxyLogo"
              onClick={() => navigate("/main/dashboard/home")}
              className="h-7 w-auto max-w-[78px] flex-shrink-0 cursor-pointer object-contain sm:h-10 sm:max-w-[130px] lg:h-11"
            />
          </div>

          {/* Desktop search bar — always visible on lg+ */}
          <div className="mx-4 hidden max-w-xl flex-1 lg:mx-6 lg:flex">
            <SearchBar />
          </div>

          <div className="flex flex-shrink-0 items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
            {/* Search icon — visible on tablet & mobile (below lg) */}
            <button
              onClick={() => setIsSearchVisible((v) => !v)}
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition lg:hidden ${
                isSearchVisible
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle search"
            >
              {isSearchVisible ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              onClick={() => setIsVoiceOpen(true)}
              onMouseEnter={() => setIsVoiceHovered(true)}
              onMouseLeave={() => setIsVoiceHovered(false)}
              onMouseDown={() => setActiveButton("voice")}
              onMouseUp={() => setActiveButton(null)}
              className={`relative hidden overflow-hidden rounded-full px-3 py-2.5 text-white transition-all duration-300 bg-gradient-to-r from-yellow-400 to-amber-500 ai-glow sm:flex lg:px-4 items-center gap-2 ${
                activeButton === "voice" ? "scale-95" : "hover:scale-105"
              }`}
              aria-label="Voice Assistance"
              title="Voice Assistance"
            >
              <div className="relative z-10">
                <Mic size={20} className="text-white" />
                {isVoiceHovered && (
                  <>
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                    <span
                      className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </>
                )}
              </div>

              {/* <span className="relative z-10 hidden text-sm font-semibold sm:inline whitespace-nowrap">
                Voice Assistant
              </span> */}

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            </button>
{/* 
            <button
              onClick={() => {
                if ((window as any).openAiChat) {
                  (window as any).openAiChat();
                }
              }}
              onMouseEnter={() => setIsAiHovered(true)}
              onMouseLeave={() => setIsAiHovered(false)}
              onMouseDown={() => setActiveButton("ai")}
              onMouseUp={() => setActiveButton(null)}
              className={`relative hidden overflow-hidden rounded-full px-3 py-2.5 text-white transition-all duration-300 bg-gradient-to-r from-yellow-400 to-amber-500 sm:flex lg:px-4 items-center gap-2 ${
                activeButton === "ai" ? "scale-95" : "hover:scale-105"
              }`}
              title="AI Mode"
              aria-label="AI Mode"
            >
              <div className="relative z-10">
                <Sparkles
                  size={20}
                  className="text-white sparkle-rotate"
                  fill="currentColor"
                />
                {isAiHovered && (
                  <>
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                    <span
                      className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </>
                )}
              </div>


              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            </button> */}

            <button
              onClick={() => navigate("/main/profile")}
              onMouseDown={() => setActiveButton("profile")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`flex h-10 w-auto flex-shrink-0 items-center justify-center rounded-full px-1.5 transition sm:px-3 sm:py-2 ${
                location.pathname === "/main/profile"
                  ? "bg-white text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Profile"
              title="Profile"
            >
              <FaUserCircle size={24} />
              {/* {customerId && (
                <span className="ml-1 whitespace-nowrap text-[10px] font-semibold sm:text-sm">
                  ID: {customerId.slice(-4)}
                </span>
              )} */}
            </button>

            <button
              onClick={handleCartClick}
              onMouseDown={() => setActiveButton("cart")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition sm:w-auto sm:px-3 sm:py-2 ${
                location.pathname === "/main/mycart"
                  ? "bg-white text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              title="Cart"
              aria-label="Cart"
            >
              <ShoppingCart size={24} />
              {/* <span className="hidden text-sm font-medium sm:inline">Cart</span> */}

              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isVoiceOpen && <VoiceWindow onClose={() => setIsVoiceOpen(false)} />}

      {showValidationPopup && (
        <ValidationPopup
          isOpen={showValidationPopup}
          onClose={() => setShowValidationPopup(false)}
          onAction={() => {
            setShowValidationPopup(false);
            navigate("/main/profile");
          }}
        />
      )}
    </>
  );
};

export default HeaderMain;
