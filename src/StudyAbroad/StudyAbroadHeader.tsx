import React, { useState, useEffect, useCallback, memo } from "react";
import { Globe, X, MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudyAbroadHeaderProps {
  onNavClick: (id: "home" | "countries" | "universities" | "testimonials") => void;
  activeLink: string;
}

// Make the component pure with React.memo to prevent unnecessary re-renders
const StudyAbroadHeader = memo(function StudyAbroadHeader({ onNavClick, activeLink }: StudyAbroadHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize isScrolled based on current scroll position to prevent initial flash
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const [clicked, setClicked] = useState(false);
   const navigate = useNavigate();

  // Use a ref to track the current scroll state without causing re-renders
  const scrollRef = React.useRef(isScrolled);
  
  // Optimized scroll handler with throttling instead of debouncing
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 50;
          if (scrollRef.current !== shouldBeScrolled) {
            scrollRef.current = shouldBeScrolled;
            setIsScrolled(shouldBeScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initial check on mount
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array - this effect only runs once

  const handleClick = () => {
    setClicked(true);
    navigate("/student-home");
    console.log("Navigating to /student-home");
  };

  // Stable reference to the nav click handler
  const handleNavClick = useCallback((
    id: "home" | "countries" | "universities" | "testimonials"
  ): void => {
    // Use a function reference to ensure we're working with the latest state
    requestAnimationFrame(() => {
      onNavClick(id);
      setIsMenuOpen(false);
    });
  }, [onNavClick]);

  // Simplified click outside handler to prevent re-renders
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      // Prevent the event from bubbling to avoid multiple handlers
      e.stopPropagation();
      
      if (
        !(e.target instanceof HTMLElement) ||
        (!e.target.closest(".mobile-menu-container") &&
         !e.target.closest(".menu-button"))
      ) {
        requestAnimationFrame(() => {
          setIsMenuOpen(false);
        });
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [isMenuOpen]);

  // Handle body scroll locking with less DOM manipulation
  useEffect(() => {
    if (isMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMenuOpen]);

  // Memoize navLinks to prevent recreation on re-render
  const navLinks = React.useMemo(() => [
    { id: "home", label: "Home" },
    { id: "countries", label: "Countries" },
    { id: "universities", label: "Universities" },
    { id: "testimonials", label: "Success Stories" },
  ] as const, []);

  // Use useCallback for event handlers to maintain stable references
  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requestAnimationFrame(() => {
      setIsMenuOpen(prev => !prev);
    });
  }, []);

  // Use CSS-in-JS approach with fixed classNames to prevent className recalculation
  const headerClasses = {
    base: "sticky top-0 z-50 w-full",
    scrolled: "bg-white shadow-lg",
    notScrolled: "bg-white bg-opacity-95 backdrop-blur-sm"
  };

  const navButtonClasses = {
    base: "relative px-4 py-2 font-medium rounded-full",
    active: "text-white bg-gradient-to-r from-purple-700 to-purple-500 shadow-md",
    inactive: "text-purple-800 hover:text-purple-600 hover:bg-purple-50"
  };

  const mobileNavButtonClasses = {
    base: "block w-full text-left px-4 py-3 rounded-xl",
    active: "text-white bg-gradient-to-r from-purple-700 to-purple-500 shadow-sm",
    inactive: "text-purple-900 hover:text-purple-700 hover:bg-purple-50"
  };

  return (
    <header
      className={`${headerClasses.base} ${isScrolled ? headerClasses.scrolled : headerClasses.notScrolled}`}
      style={{ transition: 'background-color 0.3s, box-shadow 0.3s' }}
    >

      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo with unique design */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-50 blur"></div>
              <div className="relative bg-white rounded-full p-2">
                <Globe className="h-7 w-7 text-purple-700" />
              </div>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-purple-900">
                Study<span className="text-purple-600">Abroad</span>
              </span>
            </div>
          </div>

          {/* Center: Navigation with distinctive styling */}
          <nav className="hidden md:flex flex-1 justify-center mt-4">
            <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-purple-50 to-white rounded-full px-2 py-1 shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeLink === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${navButtonClasses.base} ${
                        isActive ? navButtonClasses.active : navButtonClasses.inactive
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Action buttons with enhanced design */}
          <div className="hidden md:flex items-center gap-3">
            {/* <button 
              className="bg-white text-purple-700 font-medium py-2 px-4 rounded-full border border-purple-200 hover:border-purple-300 hover:shadow-md group"
              style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}
            >
              <span className="flex items-center">
                Explore
                <ChevronDown 
                  size={16} 
                  className="ml-1 group-hover:rotate-180" 
                  style={{ transition: 'transform 0.2s' }}
                />
              </span>
            </button> */}
             <button
        className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-purple-500 text-white font-medium py-2 px-5 rounded-full hover:shadow-lg hover:shadow-purple-200 group"
        style={{ transition: 'box-shadow 0.2s' }}
        onClick={handleClick}
      >
        <span className="relative z-10">Apply Now</span>
        <span
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 origin-left"
          style={{ transition: 'transform 0.3s' }}
        ></span>
      </button>
          </div>

          {/* Mobile menu toggle with improved styling */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="menu-button relative w-10 h-10 flex items-center justify-center rounded-full bg-purple-50 text-purple-700 hover:text-purple-500 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X size={20} />
              ) : (
                <div className="space-y-1.5">
                  <div className="w-5 h-0.5 bg-current"></div>
                  <div className="w-5 h-0.5 bg-current"></div>
                  <div className="w-5 h-0.5 bg-current"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with enhanced UX - Render conditionally with fixed positioning */}
        {isMenuOpen && (
          <div 
            className="mobile-menu-container md:hidden bg-white py-4 fixed left-0 right-0 w-full border-t border-purple-100 shadow-lg rounded-b-2xl"
            style={{ top: '4.5rem' }}
          >
            <ul className="flex flex-col px-2">
              {navLinks.map((link) => {
                const isActive = activeLink === link.id;
                return (
                  <li key={link.id} className="my-1">
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${mobileNavButtonClasses.base} ${
                        isActive ? mobileNavButtonClasses.active : mobileNavButtonClasses.inactive
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
              <li className="px-2 pt-4 space-y-3">
                <button 
                  className="w-full bg-white text-purple-700 font-medium py-3 px-4 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md"
                  style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}
                >
                  <span className="flex items-center justify-center">
                    Explore
                    <ChevronDown size={16} className="ml-1" />
                  </span>
                </button>
                <button 
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg"
                  style={{ transition: 'box-shadow 0.2s' }}
                >
                  Apply Now
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
})

export default StudyAbroadHeader;