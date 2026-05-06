import React, { useContext, useEffect, useState } from "react";
import {
  Sparkles,
  Mic,
  ShoppingCart,
  X,
  Search,
  Menu,
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
import { CartContext } from "../until/CartContext";
import SearchBar from "../kart/SearchBar";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
import VoiceWindow from "./VoiceWindow";

interface SearchResult {
  id: string;
  productName: string;
}

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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
      if (searchValue.trim().length >= 3) {
        searchProducts(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    document.body.style.overflow = isVoiceOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isVoiceOpen]);

  const toggleSidebar = () => {
    IsMobile5((prev: boolean) => !prev);
  };

  const fetchCartData = async () => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`
      );
      setCount(response.data.length || 0);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await customerApi.get(
        `${BASE_URL}/product-service/dynamicSearch?q=${encodeURIComponent(query)}`
      );

      const flattenedProducts = (response.data.items || []).flatMap(
        (category: any) =>
          (category.itemsResponseDtoList || [])
            .filter(
              (product: any) =>
                product.itemPrice > 0 &&
                product.itemMrp > 0 &&
                product.quantity > 0
            )
            .map((product: any) => ({
              id: product.itemId,
              productName: product.itemName,
            }))
      );

      setSearchResults(flattenedProducts.slice(0, 6));
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const checkProfileCompletion = async (): Promise<boolean> => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`
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
      navigate(`/main/search-main?q=${encodeURIComponent(trimmed)}`);
      setIsSearchVisible(false);
      setSearchValue("");
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = (item: SearchResult) => {
    setIsSearchVisible(false);
    setSearchValue("");
    setSearchResults([]);
    navigate(`/main/itemsdisplay/${item.id}`, {
      state: { productName: item.productName },
    });
  };

  const renderSearchResults = () => {
    if (!searchValue.trim()) {
      return (
        <div className="px-4 py-4">
          <p className="mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
            Popular searches
          </p>
          <div className="space-y-0.5">
            {searchTexts.map((text, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  navigate(`/main/search-main?q=${encodeURIComponent(text)}`);
                  setIsSearchVisible(false);
                  setSearchValue("");
                  setSearchResults([]);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-purple-50 group"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Search size={13} className="text-gray-400 group-hover:text-purple-500" />
                </span>
                <span className="text-sm text-gray-700 font-medium">{text}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          <span className="text-sm text-gray-500">Searching...</span>
        </div>
      );
    }

    if (searchResults.length > 0) {
      return (
        <div className="px-4 py-4">
          <p className="mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
            Results
          </p>
          <div className="space-y-0.5">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSearchItemClick(item)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-purple-50 group"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Search size={13} className="text-gray-400 group-hover:text-purple-500" />
                </span>
                <span className="flex-1 text-sm text-gray-800 font-medium line-clamp-1">{item.productName}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => {
                navigate(`/main/search-main?q=${encodeURIComponent(searchValue.trim())}`);
                setIsSearchVisible(false);
                setSearchValue("");
                setSearchResults([]);
              }}
              className="w-full text-center text-sm text-purple-600 font-medium py-2 hover:text-purple-800"
            >
              See all results for "{searchValue}" →
            </button>
          </div>
        </div>
      );
    }

    if (searchValue.trim().length >= 3) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">No results for "{searchValue}"</p>
          <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
        </div>
      );
    }

    return null;
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
        <div
          className="fixed left-0 right-0 z-[999] bg-white border-b border-gray-200 shadow-lg lg:hidden"
          style={{ top: 80 }}
        >
          <div className="mx-auto max-w-[1600px] px-4 py-3">
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
                  onClick={() => { setSearchValue(""); setSearchResults([]); }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Clear"
                >
                  <X size={15} className="text-gray-400" />
                </button>
              )}
              <button
                type="button"
                onClick={() => { setIsSearchVisible(false); setSearchValue(""); setSearchResults([]); }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-1"
                aria-label="Close search"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </form>

            {/* Inline dropdown results */}
            {(searchValue.trim() || searchResults.length > 0) && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden" style={{ maxHeight: 320, overflowY: "auto" }}>
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                    <span className="text-sm text-gray-500">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      {searchValue.trim() ? "Results" : "Popular searches"}
                    </p>
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSearchItemClick(item)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Search size={12} className="text-gray-400 group-hover:text-purple-500" />
                        </span>
                        <span className="flex-1 text-sm text-gray-800 font-medium text-left line-clamp-1">{item.productName}</span>
                      </button>
                    ))}
                    {searchValue.trim().length >= 3 && (
                      <div className="border-t border-gray-100 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/main/search-main?q=${encodeURIComponent(searchValue.trim())}`);
                            setIsSearchVisible(false); setSearchValue(""); setSearchResults([]);
                          }}
                          className="w-full text-center text-xs text-purple-600 font-medium py-1 hover:text-purple-800"
                        >
                          See all results for "{searchValue}" →
                        </button>
                      </div>
                    )}
                  </div>
                ) : searchValue.trim().length >= 3 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">No results for "{searchValue}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-[1000] h-[80px] border-b border-white/10 bg-[linear-gradient(135deg,#5c3391_0%,#312c74_55%,#1f2b67_100%)] shadow-[0_10px_30px_rgba(20,20,50,0.18)]">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="rounded-xl p-2 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>

            <img
              src={AskOxyLogo}
              alt="AskOxyLogo"
              onClick={() => navigate("/main/dashboard/home")}
              className="h-8 w-auto cursor-pointer object-contain sm:h-11"
            />
          </div>

          {/* Desktop search bar — always visible on lg+ */}
          <div className="mx-4 hidden max-w-2xl flex-1 lg:mx-6 lg:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search icon — visible on tablet & mobile (below lg) */}
            <button
              onClick={() => setIsSearchVisible((v) => !v)}
              className={`rounded-full p-2 transition lg:hidden ${
                isSearchVisible ? "bg-white/20 text-white" : "text-white hover:bg-white/10"
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
              className={`relative overflow-hidden rounded-full px-4 py-2.5 text-white transition-all duration-300 bg-gradient-to-r from-yellow-400 to-amber-500 ai-glow flex items-center gap-2 ${
                activeButton === "voice" ? "scale-95" : "hover:scale-105"
              }`}
              aria-label="Voice Assistance"
            >
              <div className="relative z-10">
                <Mic size={18} className="text-white" />
                {isVoiceHovered && (
                  <>
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                    <span
                      className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-yellow-100 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </>
                )}
              </div>

              <span className="relative z-10 hidden text-sm font-semibold sm:inline whitespace-nowrap">
                Voice Assistant
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            </button>

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
              className={`relative overflow-hidden rounded-full px-4 py-2.5 text-white transition-all duration-300 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center gap-2 ${
                activeButton === "ai" ? "scale-95" : "hover:scale-105"
              }`}
              aria-label="AI Mode"
            >
              <div className="relative z-10">
                <Sparkles
                  size={18}
                  className="text-white sparkle-rotate"
                  fill="currentColor"
                />
                {isAiHovered && (
                  <>
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                    <span
                      className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-yellow-100 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </>
                )}
              </div>

              <span className="relative z-10 hidden text-sm font-semibold sm:inline whitespace-nowrap">
                AI Mode
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button
              onClick={() => navigate("/main/profile")}
              onMouseDown={() => setActiveButton("profile")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition ${
                location.pathname === "/main/profile"
                  ? "bg-white text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Profile"
            >
              <FaUserCircle size={20} />
              <span className="hidden text-sm font-medium sm:inline">
                Profile
              </span>
            </button>

            <button
              onClick={handleCartClick}
              onMouseDown={() => setActiveButton("cart")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`relative flex items-center gap-2 rounded-full px-3 py-2 transition ${
                location.pathname === "/main/mycart"
                  ? "bg-white text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              <span className="hidden text-sm font-medium sm:inline">Cart</span>

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