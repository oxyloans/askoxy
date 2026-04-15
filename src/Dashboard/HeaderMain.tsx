import React, { useEffect, useState, useContext } from "react";
import { X, Sparkles } from "lucide-react";
import {
  FaBars,
  FaSearch,
  FaUserCircle,
  FaTimes,
  FaShoppingCart,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
import { CartContext } from "../until/CartContext";
import SearchBar from "../kart/SearchBar";
import BASE_URL from "../Config";
import customerApi, { customerApi as axios } from "../utils/axiosInstances";

interface SearchResult {
  id: string;
  productName: string;
}
interface VoiceSearchResponse {
  transcript?: string;
  keyword?: string;
  products?: any[];
}

interface HeaderProps {
  cartCount: number;
  IsMobile5: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ IsMobile5 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [activeButton, setActiveButton] = useState<
    "profile" | "cart" | "ai" | null
  >(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isAiHovered, setIsAiHovered] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<
    "idle" | "listening" | "processing"
  >("idle");
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const toggleSidebar = () => {
    IsMobile5((prev: boolean) => !prev);
  };

  const customerId = localStorage.getItem("userId");

  const searchTexts = [
    "SonaMasoori",
    "HMT",
    "Brown Rice",
    "Cashews",
    "Basmati Rice",
    "Gold",
    "P2P Lending AI Agent",
  ];
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  useEffect(() => {
    if (customerId) {
      fetchCartData();
    }
  }, [customerId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim().length >= 3) {
        searchProducts(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const searchProducts = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await customerApi.get(
        `${BASE_URL}/product-service/dynamicSearch?q=${encodeURIComponent(query)}`,
      );
      const flattenedProducts = (response.data.items || []).flatMap(
        (category: any) =>
          category.itemsResponseDtoList
            .filter(
              (product: any) =>
                product.itemPrice > 0 &&
                product.itemMrp > 0 &&
                product.quantity > 0,
            )
            .map((product: any) => ({
              id: product.itemId,
              productName: product.itemName,
            })),
      );
      setSearchResults(flattenedProducts.slice(0, 5));
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const fetchCartData = async () => {
    try {
      const response = await customerApi.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
      );
      setCount(response.data.length);
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
      console.error("ERROR", error);
    }
    return false;
  };

  const handleCartClick = async () => {
    const isComplete = await checkProfileCompletion();
    if (!isComplete) {
      setShowValidationPopup(true);
    } else {
      handleNavigation("/main/mycart");
    }
  };

  const handleAiClick = () => {
    if ((window as any).openAiChat) {
      (window as any).openAiChat(); // Call without message parameter
    }
  };

  const handleProfileRedirect = () => {
    setShowValidationPopup(false);
    handleNavigation("/main/profile");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchValue.trim();

    if (trimmedQuery && trimmedQuery.length >= 3) {
      navigate(`/main/search-main?q=${encodeURIComponent(trimmedQuery)}`);

      // close overlay and cleanup
      setIsSearchVisible(false);
      setSearchValue("");
      setSearchResults([]);
    } else {
      setIsSearchVisible(false);
      setSearchValue("");
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = (item: SearchResult) => {
    setIsSearchVisible(false);
    setSearchValue("");
    setSearchResults([]);

    // Navigate to item details
    navigate(`/main/itemsdisplay/${item.id}`, {
      state: { productName: item.productName },
    });
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchValue("");
      setSearchResults([]);
      setTimeout(() => {
        const searchInput = document.querySelector(
          ".mobile-search-input",
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchValue("");
    setSearchResults([]);
    navigate("/main/dashboard/home");
  };
  const submitVoiceFile = async (audioFile: File | Blob) => {
    setVoiceError("");
    setVoiceStatus("processing");
    setIsVoiceLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioFile, `voice-${Date.now()}.webm`);
      formData.append("language", "en");
      const response = await fetch(`${BASE_URL}/product-service/voice-search`, {
        method: "POST",
        headers: { accept: "*/*" },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Unable to process voice search");
      }
      const voiceData = (await response.json()) as VoiceSearchResponse;
      if (location.pathname !== "/main/search-main") {
        navigate("/main/search-main", {
          state: { voiceSearchData: voiceData },
        });
      } else {
        navigate("/main/search-main", {
          state: { voiceSearchData: voiceData },
          replace: true,
        });
      }
      setVoiceStatus("idle");
    } catch (error) {
      console.error("Voice search failed:", error);
      setVoiceError("Voice search failed. Please try again in a moment.");
      setVoiceStatus("idle");
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError("Voice recording is not supported on this browser.");
      return;
    }
    setVoiceError("");
    setVoiceStatus("listening");
    setIsRecording(true);
    setIsSearchVisible(false);
    setSearchValue("");
    setSearchResults([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        stream.getTracks().forEach((track) => track.stop());
        if (!audioBlob.size) {
          setVoiceError("No voice captured. Please try again.");
          setVoiceStatus("idle");
          return;
        }
        await submitVoiceFile(audioBlob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (error) {
      console.error("Microphone permission denied or unavailable:", error);
      setVoiceError("Unable to access microphone. Please allow permission.");
      setVoiceStatus("idle");
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setVoiceStatus("processing");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (isSearchVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchVisible]);

  const renderSearchResults = () => {
    // Show suggestions when no search has been performed yet (empty input)
    if (searchValue.trim().length === 0) {
      return (
        <div className="bg-white py-3 px-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">
            Suggested searches:
          </p>
          {searchTexts.map((text, index) => (
            <button
              type="button"
              key={index}
              className="w-full py-3 text-left flex items-center space-x-3 transition-colors duration-200 hover:bg-purple-50 rounded-lg px-2 mb-1"
              onClick={() => {
                navigate(`/main/search-main?q=${encodeURIComponent(text)}`);
                setIsSearchVisible(false);
                setSearchValue("");
                setSearchResults([]);
              }}
            >
              <FaSearch className="text-purple-400 text-sm flex-shrink-0" />
              <span className="text-sm text-gray-700">{text}</span>
            </button>
          ))}
        </div>
      );
    }

    // Show loading spinner while searching
    if (isSearching) {
      return (
        <div className="bg-white py-6 px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-sm text-gray-500">Searching...</span>
          </div>
        </div>
      );
    }

    // Show search results if we have them
    if (searchResults.length > 0) {
      return (
        <div className="bg-white py-3 px-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">
            Search results:
          </p>
          {searchResults.map((item, index) => (
            <button
              type="button"
              key={index}
              className="w-full py-3 text-left flex items-center space-x-3 transition-colors duration-200 hover:bg-purple-50 rounded-lg px-2 mb-1"
              onClick={() => handleSearchItemClick(item)}
            >
              <FaSearch className="text-purple-400 text-sm flex-shrink-0" />
              <span className="text-sm text-gray-700 line-clamp-2">
                {item.productName}
              </span>
            </button>
          ))}
        </div>
      );
    }

    // Show "no results" only when search was performed but returned nothing
    if (searchValue.length >= 3 && searchResults.length === 0 && !isSearching) {
      return (
        <div className="bg-white py-3 px-4">
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              No results found for "{searchValue}"
            </p>
          </div>
        </div>
      );
    }

    // Default: show suggestions for partial input
    return (
      <div className="bg-white py-3 px-4">
        <p className="text-xs text-gray-500 mb-3 font-medium">
          Suggested searches:
        </p>
        {searchTexts.map((text, index) => (
          <button
            type="button"
            key={index}
            className="w-full py-3 text-left flex items-center space-x-3 transition-colors duration-200 hover:bg-purple-50 rounded-lg px-2 mb-1"
            onClick={() => {
              navigate(`/main/search-main?q=${encodeURIComponent(text)}`);
              setIsSearchVisible(false);
              setSearchValue("");
              setSearchResults([]);
            }}
          >
            <FaSearch className="text-purple-400 text-sm flex-shrink-0" />
            <span className="text-sm text-gray-700">{text}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
  @keyframes aiGlow {
    0%, 100% {
      box-shadow: 0 0 10px rgba(251, 191, 36, 0.6), 0 0 20px rgba(245, 158, 11, 0.4);
    }
    50% {
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.9), 0 0 30px rgba(245, 158, 11, 0.7);
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

      <header
        className="fixed top-0 left-0 right-0 z-[1000] h-[80px] w-full font-['Roboto'] border-b border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        style={{
          background: "linear-gradient(135deg, #5c3391 0%, #312c74 100%)",
        }}
      >
        <div className="max-w-8xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center ml-[-20px]">
            <button
              onClick={toggleSidebar}
              className="md:hidden mr-3 p-2 text-white hover:text-gray-200"
              aria-label="Toggle sidebar"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <img
              src={AskOxyLogo}
              alt="AskOxyLogo"
              onClick={() => handleNavigation("/main/dashboard/home")}
              className="h-8 sm:h-12 w-auto object-contain cursor-pointer"
            />
          </div>

          <div className="hidden sm:flex flex-grow max-w-xl mx-6">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleSearch}
              className="sm:hidden p-2 text-white hover:text-gray-200 transition"
              aria-label="Toggle search"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            {/* AI Button */}
            <button
              onClick={handleAiClick}
              onMouseEnter={() => setIsAiHovered(true)}
              onMouseLeave={() => setIsAiHovered(false)}
              onMouseDown={() => setActiveButton("ai")}
              onMouseUp={() => setActiveButton(null)}
              className={`relative overflow-hidden rounded-full transition-all duration-300 flex items-center gap-2
    px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500
    ${activeButton === "ai" ? "scale-95" : "hover:scale-105"}
  `}
              aria-label="AI Mode"
            >
              <div className="relative">
                <Sparkles
                  className="w-5 h-5 text-white sparkle-rotate"
                  fill="currentColor"
                />
                {isAiHovered && (
                  <>
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    <span
                      className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                  </>
                )}
              </div>

              {/* Always visible on desktop (sm and above), hidden on mobile */}
              <span className="hidden sm:inline text-white font-semibold text-sm whitespace-nowrap">
                AI Mode
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button
              onClick={() => handleNavigation("/main/profile")}
              onMouseDown={() => setActiveButton("profile")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`p-2 rounded-full transition flex items-center ${
                location.pathname === "/main/profile"
                  ? "bg-purple-100 text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Profile"
            >
              <FaUserCircle
                size={20}
                className={`transition ${
                  location.pathname === "/main/profile"
                    ? "text-purple-600"
                    : activeButton === "profile"
                      ? "text-purple-500"
                      : "text-white"
                }`}
              />
              <span className="ml-1 hidden sm:block text-sm font-medium">
                Profile
              </span>
            </button>

            <button
              onClick={handleCartClick}
              onMouseDown={() => setActiveButton("cart")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`relative flex items-center space-x-1 rounded-full p-1 sm:px-2 sm:py-1 transition hover:scale-105 active:scale-95 ${
                location.pathname === "/main/mycart"
                  ? "bg-purple-100 text-purple-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Cart"
            >
              <FaShoppingCart
                size={16}
                className={`sm:w-6 sm:h-6 transition ${
                  location.pathname === "/main/mycart"
                    ? "text-purple-700"
                    : activeButton === "cart"
                      ? "text-purple-400"
                      : "text-white"
                }`}
              />
              <span className="hidden sm:inline text-sm">Cart</span>

              {count > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-[10px] sm:text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay - Fixed positioning and z-index */}
      {isSearchVisible && (
        <div className="fixed inset-0 z-[1100] flex flex-col sm:hidden bg-white">
          {/* Search Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm z-10">
            <form
              className="flex-1 flex items-center relative rounded-full bg-gray-100 px-4 py-2.5"
              onSubmit={handleSearchSubmit}
            >
              <FaSearch className="text-gray-400 text-sm flex-shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                className="mobile-search-input flex-1 bg-transparent border-none outline-none text-gray-800 text-sm ml-2 placeholder:text-gray-400"
                placeholder="Search for products or agents"
                autoFocus
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                  aria-label="Clear search"
                >
                  <FaTimes size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`ml-2 rounded-full transition-all duration-200 ${
                  isRecording
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-500"
                } ${isVoiceLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                title={
                  isVoiceLoading
                    ? "Processing voice search"
                    : isRecording
                      ? "Stop recording"
                      : "Start voice search"
                }
                disabled={isVoiceLoading}
                aria-pressed={isRecording}
              >
                {isVoiceLoading ? (
                  <FaSpinner className="animate-spin text-base" />
                ) : isRecording ? (
                  <FaMicrophoneSlash className="text-base" />
                ) : (
                  <FaMicrophone className="text-base" />
                )}
              </button>
            </form>
            <button
              onClick={closeSearch}
              className="p-2 text-gray-600 hover:text-gray-800 flex-shrink-0"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
          </div>

          {/* Search Results - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-white">
            {(voiceError || voiceStatus !== "idle") && (
              <p className="px-4 pt-3 pb-1 text-xs text-gray-600">
                {voiceStatus === "listening"
                  ? "Listening... speak clearly and tap the mic again to stop."
                  : voiceStatus === "processing"
                    ? "Processing voice search... please wait."
                    : voiceError}
              </p>
            )}
            {renderSearchResults()}
          </div>
        </div>
      )}

      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        onAction={handleProfileRedirect}
      />
    </>
  );
};

export default Header;
