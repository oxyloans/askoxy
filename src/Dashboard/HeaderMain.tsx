import React, { useEffect, useState, useContext } from "react";
import { ShoppingCart, UserCircle, X } from "lucide-react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import { CartContext } from "../until/CartContext";
import axios from "axios";

import  BASE_URL  from "../Config";

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
  const [activeButton, setActiveButton] = useState<"profile" | "cart" | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
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
        `${BASE_URL}/product-service/product/search?searchText=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching products:', error);
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
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem("profileData");

    if (profileData) {
      const parsedData = JSON.parse(profileData);
      return !!(
        parsedData.userFirstName && parsedData.userFirstName !== "" &&
        parsedData.userLastName && parsedData.userLastName !== "" &&
        parsedData.customerEmail && parsedData.customerEmail !== "" &&
        parsedData.alterMobileNumber && parsedData.alterMobileNumber !== ""
      );
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
    navigate(`/main/product/${item.id}`, { state: { productName: item.productName } });
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
        const searchInput = document.querySelector('.mobile-search-input');
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
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scrolling when search overlay is hidden
      document.body.style.overflow = 'auto';
    }

    return () => {
      // Make sure to clean up
      document.body.style.overflow = 'auto';
    };
  }, [isSearchVisible]);

  const renderSearchResults = () => {
    // Show predefined suggestions if no search or results
    if (searchValue.length < 2 || (searchResults.length === 0 && !isSearching)) {
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
      <div className="bg-white py-2 px-4">
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
          <p className="text-sm text-gray-500">No results found for "{searchValue}"</p>
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
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Main header row - always visible */}
          <div className="flex items-center justify-between h-14 sm:h-20">
            {/* Left: Logo & menu toggle */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-2 p-2 text-gray-700 hover:text-gray-900"
                aria-label="Toggle sidebar"
              >
                <FaBars className="w-5 h-5" />
              </button>
              
              <img
                src={AskOxyLogo}
                className="h-8 w-auto sm:h-12 object-contain cursor-pointer"
                alt="AskOxyLogo"
                onClick={() => handleNavigation("/main")}
              />
            </div>

            {/* Middle: Desktop search (hidden on mobile) */}
            <div className="hidden sm:block flex-grow max-w-xl mx-4">
              {renderDesktopSearchBar()}
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile search toggle button */}
              <button
                onClick={toggleSearch}
                className="sm:hidden p-2 text-gray-600 hover:text-purple-500 transition-all duration-300"
                aria-label="Toggle search"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {/* Profile button with text (for web view) */}
              <button
                onClick={() => handleNavigation("/main/profile")}
                onMouseDown={() => setActiveButton("profile")}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`p-2 text-gray-700 hover:bg-gray-50 rounded-full hover:text-green-600 transition-all duration-300 flex items-center 
                  ${location.pathname === "/main/profile" ? "bg-green-50 text-green-600" : ""}`}
                aria-label="Profile"
              >
                <UserCircle
                  size={20}
                  className={`transition-colors duration-300 
                    ${location.pathname === "/main/profile"
                      ? "text-green-600"
                      : activeButton === "profile"
                      ? "text-green-500"
                      : "text-gray-700"
                    }`}
                />
                <span className="ml-1 hidden sm:block text-sm font-medium">Profile</span>
              </button>

              {/* Cart button with text (for web view) */}
              <button
                onClick={handleCartClick}
                onMouseDown={() => setActiveButton("cart")}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`relative flex items-center space-x-1 text-gray-700 hover:bg-gray-50 rounded-full p-1 sm:px-2 sm:py-1 
              hover:text-purple-600 transition-all duration-300 hover:scale-105 active:scale-95 
              ${
                location.pathname === "/mycart"
                  ? "bg-purple-50 text-purple-600"
                  : ""
              }`}
              >
                <ShoppingCart
                  size={16}
                  className={`sm:w-6 sm:h-6 transition-colors duration-300 
                ${
                  location.pathname === "/main/mycart"
                    ? "text-purple-600"
                    : activeButton === "cart"
                    ? "text-purple-500"
                    : "text-gray-700"
                }`}
                />
                <span className="hidden sm:inline text-sm">Cart</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay (full screen) */}
      {isSearchVisible && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fadeIn sm:hidden">
          {/* Search header */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
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
              className="ml-3 p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Search results container */}
          <div className="flex-1 overflow-y-auto">
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