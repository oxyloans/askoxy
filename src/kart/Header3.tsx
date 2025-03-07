// Header.tsx
import React, { useEffect, useState } from "react";
import { ShoppingCart, UserCircle } from 'lucide-react';
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from './ValidationPopup';
import AskOxyLogo from "../assets/img/askoxylogostatic.png";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount: propCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(propCartCount);
  const [searchValue, setSearchValue] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeButton, setActiveButton] = useState<'profile' | 'cart' | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const searchTexts = [
    "Sonamasoori Rice",
    "Kolam Rice",
    "Brown Rice",
    "HMT Rice"
  ];

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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem('profileData');
    console.log("profileData", profileData);
    
    if (profileData) {
      const parsedData = JSON.parse(profileData);
      console.log("parsedData", parsedData);
      return !!(parsedData.firstName && parsedData.lastName && 
                parsedData.email && parsedData.alterMobileNumber);
    }
    return false;
  };

  const handleCartClick = () => {
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
    } else {
      handleNavigation('/mycart');
    }
  };

  const handleProfileRedirect = () => {
    setShowValidationPopup(false);
    handleNavigation('/profile');
  };

  useEffect(() => {
    const count = localStorage.getItem("cartCount");
    if (count) {
      setCartCount(parseInt(count));
    }
  }, []);

  useEffect(() => {
    setCartCount(propCartCount);
  }, [propCartCount]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }, 100);
    }
  };

  const renderSearchBar = () => (
    <div className="relative w-full group">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full 
          text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          outline-none transition-all duration-300 
          hover:border-blue-400 hover:shadow-md 
          group-focus-within:border-blue-500"
        placeholder={searchPlaceholder}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="p-1 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
          >
            <FaTimes className="text-base" />
          </button>
        )}
        <FaSearch className="text-gray-400 ml-2 text-base
        group-focus-within:text-blue-500 
        hover:text-blue-500 hover:scale-110 transition-all duration-200" />
      </div>

      {(isFocused || searchValue) && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 
        animate-dropdown max-h-64 overflow-y-auto">
          {searchTexts
            .filter(text => 
              text.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((text, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left 
                hover:bg-blue-50 flex items-center space-x-2 
                transition-colors duration-200 hover:text-blue-600"
                onClick={() => {
                  setSearchValue(text);
                  setIsFocused(false);
                }}
              >
                <FaSearch className="text-gray-400 text-xs" />
                <span className="text-sm">{text}</span>
              </button>
            ))
          }
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                src={AskOxyLogo} 
                className="h-8 w-auto sm:h-14 object-contain cursor-pointer"
                alt="AskOxyLogo"
                onClick={() => handleNavigation('/dashboard-main')}
              />
            </div>

            <div className="hidden sm:block flex-grow mx-4">
              {renderSearchBar()}
            </div>

            <div className="sm:hidden flex items-center flex-grow justify-end">
              {!isSearchVisible ? (
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-blue-500"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute left-0 right-0 top-0 bg-white p-2 h-14 flex items-center z-50">
                  <div className="flex-grow mx-2">
                    {renderSearchBar()}
                  </div>
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => handleNavigation('/profile')}
                onMouseDown={() => setActiveButton('profile')}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`flex items-center space-x-1 text-gray-700 hover:bg-gray-50 rounded-full p-1 sm:px-2 sm:py-1 
                  hover:text-green-600 transition-all duration-300 hover:scale-105 active:scale-95 
                  ${location.pathname === '/profile' ? 'bg-green-50 text-green-600' : ''}`}
              >
                <UserCircle 
                  size={16}
                  className={`sm:w-6 sm:h-6 transition-colors duration-300 
                    ${location.pathname === '/profile' ? 'text-green-600' : 
                    activeButton === 'profile' ? 'text-green-500' : 'text-gray-700'}`}
                />
                <span className="hidden sm:inline text-sm">Profile</span>
              </button>

              <button
                onClick={handleCartClick}
                onMouseDown={() => setActiveButton('cart')}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`relative flex items-center space-x-1 text-gray-700 hover:bg-gray-50 rounded-full p-1 sm:px-2 sm:py-1 
                  hover:text-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 
                  ${location.pathname === '/mycart' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <ShoppingCart 
                  size={16}
                  className={`sm:w-6 sm:h-6 transition-colors duration-300 
                    ${location.pathname === '/mycart' ? 'text-blue-600' : 
                    activeButton === 'cart' ? 'text-blue-500' : 'text-gray-700'}`}
                />
                <span className="hidden sm:inline text-sm">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        onAction={handleProfileRedirect}
      />
    </>
  );
};

export default Header;