// HeaderMain.tsx
import React, { useEffect, useState, useContext } from "react";
import { X } from "lucide-react";
import { FaBars, FaSearch,FaUserCircle, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogoblack.png";
import { CartContext } from "../until/CartContext";
import axios from "axios";
import SearchBar from "../kart/SearchBar";
import BASE_URL from "../Config";

interface SearchResult {
  id: string;
  productName: string;
}

interface HeaderProps {
  cartCount: number;
  IsMobile5: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  cartCount: propCartCount,
  IsMobile5,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeButton, setActiveButton] = useState<"profile" | "cart" | null>(
    null
  );
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [profileLoader, setProfileLoader] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [isLoginWithWhatsapp, setIsLoginWithWhatsapp] = useState(false);
  const [firstName, setFirstName] = useState("");

  const toggleSidebar = () => {
    IsMobile5((prev: boolean) => !prev);
  };

  const token = localStorage.getItem("accessToken");
  const customerId = localStorage.getItem("userId");

  const searchTexts = [
    "Sonamasuri Rice",
    "Kolam Rice",
    "Brown Rice",
    "HMT Rice",
  ];

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  useEffect(() => {
    if (token && customerId) {
      fetchCartData();
    }
  }, [token, customerId]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animatePlaceholder = async () => {
      const currentText = `Search for "${searchTexts[currentSearchIndex]}"`;
      setSearchPlaceholder(currentText);

      timeout = setTimeout(() => {
        setCurrentSearchIndex((prev) => (prev + 1) % searchTexts.length);
      }, 3000);
    };

    animatePlaceholder();
    return () => clearTimeout(timeout);
  }, [currentSearchIndex]);

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
      const response = await axios.get(
        `${BASE_URL}/product-service/dynamicSearch?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const flattenedProducts = (response.data.items || []).flatMap(
        (category: any) =>
          category.itemsResponseDtoList
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
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const checkProfileCompletion = async () => {
    setProfileLoader(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const profileData = response.data;

        setWhatsappVerified(profileData.whatsappVerified);
        setMobileVerified(profileData.mobileVerified);
        if (profileData.whatsappVerified) {
          setIsLoginWithWhatsapp(true);
        }

        setFirstName(profileData.firstName || "");

        return !!(profileData.firstName && profileData.firstName.trim() !== "");
      }
    } catch (error) {
      console.error("ERROR", error);
    } finally {
      setProfileLoader(false);
    }
    return false;
  };

  const handleCartClick = () => {
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
    } else {
      handleNavigation("/main/mycart");
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
     navigate("/main/search-main", { state: { searchQuery: trimmedQuery } });
     setIsSearchVisible(false);
     setSearchValue("");
     setSearchResults([]);
   } else {
     setIsSearchVisible(false);
     setSearchValue("");
     setSearchResults([]);
     return; // ← FIXED
   }
 };


  const handleSearchItemClick = (item: SearchResult) => {
    navigate(`/main/itemsdisplay/${item.id}`, {
      state: { productName: item.productName },
    });
    setIsSearchVisible(false);
    setSearchValue("");
    setIsFocused(false);
    setSearchResults([]);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchValue("");
      setSearchResults([]);
      setTimeout(() => {
        const searchInput = document.querySelector(
          ".mobile-search-input"
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
    if (
      searchValue.length < 3 ||
      (searchResults.length === 0 && !isSearching)
    ) {
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
                setSearchValue(text);
                setIsFocused(false);
                if (text.length >= 3) {
                  navigate("/main/search-main", {
                    state: { searchQuery: text },
                  });
                }
                setIsSearchVisible(false);
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

    return (
      <div className="bg-white py-3 px-4">
        {searchResults.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              No results found for "{searchValue}"
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
                >
                  <FaTimes size={16} />
                </button>
              )}
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
