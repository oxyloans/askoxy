import React, { useEffect, useState, useContext } from "react";
import { ShoppingCart, UserCircle, X } from "lucide-react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogonew.png";
import { CartContext } from "../until/CartContext";
import axios from "axios";

import BASE_URL from "../Config";
import { message } from "antd";
import SearchBar from "../kart/SearchBar";

interface HeaderProps {
  cartCount: number;
  IsMobile5: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchResult {
  id: string;
  productName: string;
  // Add other fields as per your API response
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
  const [firstName, setFirstName] = useState(""); // Only required field

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

  // Fetch cart items when component mounts
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

  // Debounced search API call
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim().length >= 2) {
        searchProducts(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/product/search?searchText=${encodeURIComponent(
          query
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data || []);
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

        // Update verification statuses
        setWhatsappVerified(profileData.whatsappVerified);
        setMobileVerified(profileData.mobileVerified);
        if (profileData.whatsappVerified) {
          setIsLoginWithWhatsapp(true);
        }

        // Update only required fields
        setFirstName(profileData.firstName || "");

        // Check profile completion
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

    if (searchValue.trim()) {
      navigate("/main", { state: { searchQuery: searchValue } });
      setIsSearchVisible(false);
      setSearchValue("");
    }
  };

  const handleSearchItemClick = (item: SearchResult) => {
    navigate(`/main/product/${item.id}`, {
      state: { productName: item.productName },
    });
    setIsSearchVisible(false);
    setSearchValue("");
    setIsFocused(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // Reset search state when opening search overlay
      setSearchValue("");
      setSearchResults([]);

      // Focus on the search input after the overlay is shown
      setTimeout(() => {
        const searchInput = document.querySelector(".mobile-search-input");
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }, 100);
    }
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchValue("");
    setSearchResults([]);
  };

  // Handle body scroll when search overlay is active
  useEffect(() => {
    if (isSearchVisible) {
      // Prevent body scrolling when search overlay is shown
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scrolling when search overlay is hidden
      document.body.style.overflow = "auto";
    }

    return () => {
      // Make sure to clean up
      document.body.style.overflow = "auto";
    };
  }, [isSearchVisible]);

  const renderSearchResults = () => {
    // Show predefined suggestions if no search or results
    if (
      searchValue.length < 2 ||
      (searchResults.length === 0 && !isSearching)
    ) {
      return (
        <div className="bg-white py-2 px-4">
          <p className="text-xs text-gray-500 mb-2">Suggested searches:</p>
          {searchTexts.map((text, index) => (
            <button
              type="button"
              key={index}
              className="w-full py-2 text-left flex items-center space-x-2 transition-colors duration-200 hover:text-purple-600 border-b border-gray-100"
              onClick={() => {
                setSearchValue(text);
                setIsFocused(false);
                navigate("/main", { state: { searchQuery: text } });
                setIsSearchVisible(false);
              }}
            >
              <FaSearch className="text-gray-400 text-xs" />
              <span className="text-sm ml-2">{text}</span>
            </button>
          ))}
        </div>
      );
    }

    // Loading state
    if (isSearching) {
      return (
        <div className="bg-white py-4 px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        </div>
      );
    }

    // Show API results
    return (
      <div className="bg-#5c3391 py-2 px-4">
        {searchResults.length > 0 ? (
          <>
            <p className="text-xs text-gray-500 mb-2">Search results:</p>
            {searchResults.map((item, index) => (
              <button
                type="button"
                key={index}
                className="w-full py-2 text-left flex items-center space-x-2 transition-colors duration-200 hover:text-purple-600 border-b border-gray-100"
                onClick={() => handleSearchItemClick(item)}
              >
                <FaSearch className="text-gray-400 text-xs" />
                <span className="text-sm ml-2">{item.productName}</span>
              </button>
            ))}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            No results found for "{searchValue}"
          </p>
        )}
      </div>
    );
  };

  const renderDesktopSearchBar = () => (
    <form
      id="search-container"
      onSubmit={handleSearchSubmit}
      className="relative w-full group"
    >
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full 
          text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          outline-none transition-all duration-300 
          hover:border-purple-400 hover:shadow-md 
          group-focus-within:border-purple-500"
        placeholder={searchPlaceholder}
        aria-label="Search"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="p-1 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
            aria-label="Clear search"
          >
            <FaTimes className="text-base" />
          </button>
        )}
        <button
          type="submit"
          className="ml-2 text-gray-400 hover:text-purple-500 hover:scale-110 transition-all duration-200"
          aria-label="Submit search"
        >
          <FaSearch className="text-base" />
        </button>
      </div>

      {/* Updated Search Results Dropdown */}
      {isFocused && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {renderSearchResults()}
        </div>
      )}
    </form>
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1000] h-[80px] w-full font-['Roboto'] border-b border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        style={{
          background: "linear-gradient(135deg, #5c3391 0%, #312c74 100%)",
        }}
      >
        <div className="max-w-8xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo & Menu */}
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

          {/* Middle: Desktop Search */}
          <div className="hidden sm:flex flex-grow max-w-xl mx-6">
            <SearchBar />
          </div>

          {/* Right: Profile, Search, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Search Icon */}
            <button
              onClick={toggleSearch}
              className="sm:hidden p-2 text-white hover:text-gray-200 transition"
              aria-label="Toggle search"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            {/* Profile */}
            <button
              onClick={() => handleNavigation("/main/profile")}
              onMouseDown={() => setActiveButton("profile")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`p-2 rounded-full transition flex items-center ${
                location.pathname === "/main/profile"
                  ? "bg-green-100 text-green-700"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Profile"
            >
              <UserCircle
                size={20}
                className={`transition ${
                  location.pathname === "/main/profile"
                    ? "text-green-600"
                    : activeButton === "profile"
                    ? "text-green-500"
                    : "text-white"
                }`}
              />
              <span className="ml-1 hidden sm:block text-sm font-medium">
                Profile
              </span>
            </button>

            {/* Cart */}
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
              <ShoppingCart
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
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      {isSearchVisible && (
        <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-purple-800 z-50 flex flex-col sm:hidden animate-fadeIn">
          {/* Search bar header */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center bg-white shadow-sm">
            <form
              className="flex-1 flex items-center relative rounded-full bg-gray-100 px-4 py-2"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                className="mobile-search-input flex-1 bg-transparent border-none outline-none text-gray-800 text-sm"
                placeholder="Search for 'Kolam Rice'"
                autoFocus
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="ml-1 text-gray-400"
                >
                  <FaTimes size={16} />
                </button>
              )}
              <button type="submit" className="ml-2 text-gray-500">
                <FaSearch size={16} />
              </button>
            </form>
            <button
              onClick={closeSearch}
              className="ml-3 p-1 text-white hover:text-gray-100"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search results */}
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
