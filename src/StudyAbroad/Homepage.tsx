import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowLeft, ChevronDown, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';
import Student1 from "../assets/img/page1.png"; // Character illustration
import mapbw from "../assets/img/mapbw.png"; // Map background
import { Link } from 'react-router-dom';

interface StudyAbroadHeaderProps {
  onNavClick: (id: "home" | "countries" | "universities" | "testimonials") => void;
  activeLink: string;
}

// StudyAbroadHeader Component
const StudyAbroadHeader = memo(function StudyAbroadHeader({ onNavClick, activeLink }: StudyAbroadHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const navigate = useNavigate();

  const scrollRef = React.useRef(isScrolled);
  
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
    
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((
    id: "home" | "countries" | "universities" | "testimonials"
  ): void => {
    requestAnimationFrame(() => {
      // Navigate to studyabroad-web for all nav items
      navigate('/studyabroad');
      onNavClick(id);
      setIsMenuOpen(false);
    });
  }, [onNavClick, navigate]);

  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
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

  useEffect(() => {
    if (isMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMenuOpen]);

  const navLinks = React.useMemo(() => [
    { id: "home", label: "Home" },
    { id: "countries", label: "Countries" },
    { id: "universities", label: "Universities" },
    { id: "testimonials", label: "Success Stories" },
  ] as const, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requestAnimationFrame(() => {
      setIsMenuOpen(prev => !prev);
    });
  }, []);

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
      className={`${headerClasses.base} ${
        isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
      }`}
      style={{ transition: "background-color 0.3s, box-shadow 0.3s" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo with unique design */}
          <Link to="/studyabroad">
            <div className="flex items-center cursor-pointer hover:scale-105 transition-transform">
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
          </Link>

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
                        isActive
                          ? navButtonClasses.active
                          : navButtonClasses.inactive
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile menu toggle with improved styling */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="menu-button relative w-10 h-10 flex items-center justify-center rounded-full bg-purple-50 text-purple-700 hover:text-purple-500 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <div className="space-y-1.5">
                  <div className="w-5 h-0.5 bg-current transform rotate-45 translate-y-1"></div>
                  <div className="w-5 h-0.5 bg-current transform -rotate-45"></div>
                </div>
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className="mobile-menu-container md:hidden bg-white py-4 fixed left-0 right-0 w-full border-t border-purple-100 shadow-lg rounded-b-2xl"
            style={{ top: "4.5rem" }}
          >
            <ul className="flex flex-col px-2">
              {navLinks.map((link) => {
                const isActive = activeLink === link.id;
                return (
                  <li key={link.id} className="my-1">
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`${mobileNavButtonClasses.base} ${
                        isActive
                          ? mobileNavButtonClasses.active
                          : mobileNavButtonClasses.inactive
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
                  style={{ transition: "border-color 0.2s, box-shadow 0.2s" }}
                >
                  <span className="flex items-center justify-center">
                    Explore
                    <ChevronDown size={16} className="ml-1" />
                  </span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
});

// Utility function to get access token from localStorage
const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error accessing token from storage:', error);
    return null;
  }
};

// Utility function to create axios config with auth headers
const createAuthConfig = () => {
  const token = getAccessToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};


const UserSelectionPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'student' | 'counselor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOGIN_URL = "/whatsapplogin?primaryType=STUDENT";
    
  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setAuthRequired(true);
    }
  }, []);

  // Handle navigation clicks from header
  const handleNavClick = useCallback((id: "home" | "countries" | "universities" | "testimonials") => {
    setActiveLink(id);
    console.log(`Active section: ${id}`);
  }, []);

  const handleStudentClick = async () => {
    const token = getAccessToken();
    if (!token) {
      setError('Please log in to continue as a student.');
      setAuthRequired(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {  
      // Navigate to student dashboard
      navigate('/student-dashboard');
    } catch (error: any) {
      console.error('Error updating primary type:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Session expired. Please log in again.');
        setAuthRequired(true);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCounselorClick = () => {
    setUserRole('counselor');
  };
  
const handleLogin = () => {
  try {
    setIsLoading(true);

    const userId = localStorage.getItem("userId");
    const redirectPath = "/student-home";

    if (userId) {
      navigate(redirectPath);
    } else {
      sessionStorage.setItem("redirectPath", redirectPath);
      sessionStorage.setItem("primaryType", "STUDENT"); // Set primary type for students
      // Pass primaryType as query parameter
      window.location.href = "/whatsapplogin?primaryType=STUDENT";
    }
  } catch (error) {
    console.error("Sign in error:", error);
  } finally {
    setIsLoading(false);
  }
};

  // Show authentication required message
  if (authRequired) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudyAbroadHeader onNavClick={handleNavClick} activeLink={activeLink} />
        
        <div className="p-4 font-sans">
          <div className="w-full max-w-5xl mx-auto h-[85vh] bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl relative overflow-hidden shadow-xl">
            <div 
              className="absolute inset-0 opacity-10 bg-no-repeat bg-center bg-cover"
              style={{ backgroundImage: `url(${mapbw})` }}
            />
            <div className="relative z-10 h-full flex items-center justify-center p-6">
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mb-4">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Authentication Required</h2>
                  <p className="text-gray-600 mb-5 text-sm leading-relaxed">
                    Please log in to explore study abroad opportunities and access premium programs.
                  </p>
                  <div className="space-y-3">
                    <button 
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Signing In...
                        </>
                      ) : (
                        'Log In to Continue'
                      )}
                    </button>
                    <button 
                      onClick={() => setAuthRequired(false)}
                      className="w-full px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm text-sm"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <StudyAbroadHeader onNavClick={handleNavClick} activeLink={activeLink} />
      
      <div className="p-4 font-sans">
        <div className="w-full max-w-5xl mx-auto h-[85vh] bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl relative overflow-hidden shadow-xl">
          
          <div 
            className="absolute inset-0 opacity-10 bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${mapbw})` }}
          />

          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-300 bg-opacity-20 rounded-full blur-2xl"></div>

          <div className="relative z-10 h-full flex items-center">
            
            <div className="hidden lg:block lg:w-1/2 h-full relative">
              <div className="absolute bottom-0 left-6 xl:left-12 w-72 xl:w-80 h-full flex items-end">
                <img 
                  src={Student1}
                  alt="Student Character" 
                  className="w-full h-auto max-h-full object-contain object-bottom drop-shadow-2xl"
                  style={{ maxHeight: '80%' }}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-6 xl:px-12">
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-md bg-opacity-95">
                
                <div className="p-6">
                  
                  {!userRole ? (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full shadow-lg mb-4">
                          <span className="text-sm font-medium">
                            Welcome to <span className="text-yellow-300 font-semibold">StudyAbroad</span>
                          </span>
                        </div>
                        <h2 className="text-lg font-medium text-gray-700">Choose your role</h2>
                      </div>
                      
                      {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                          <p className="text-red-700 text-xs font-medium">{error}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <button
                          onClick={handleStudentClick}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-indigo-300 rounded-xl p-4 transition-all duration-300 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                              {loading ? (
                                <Loader2 size={18} className="text-white animate-spin" />
                              ) : (
                                <GraduationCap size={18} className="text-white" />
                              )}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-800 text-sm">
                                {loading ? 'Processing...' : 'Student'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {loading ? 'Setting up your profile' : 'Explore study opportunities'}
                              </div>
                            </div>
                          </div>
                          {!loading && (
                            <ChevronDown size={14} className="text-gray-400 transform -rotate-90 group-hover:text-indigo-500 transition-colors" />
                          )}
                        </button>
                        
                        <button
                          onClick={handleCounselorClick}
                          className="w-full bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 hover:border-pink-300 rounded-xl p-4 transition-all duration-300 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2.5 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                              <Users size={18} className="text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-800 text-sm">Counselor</div>
                              <div className="text-xs text-gray-500">Guide students to success</div>
                            </div>
                          </div>
                          <ChevronDown size={14} className="text-gray-400 transform -rotate-90 group-hover:text-purple-500 transition-colors" />
                        </button>
                      </div>
                    </div>
                  ) : userRole === 'counselor' ? (
                    <div>
                      <div className="flex items-center mb-5">
                        <button 
                          onClick={() => setUserRole(null)} 
                          className="flex items-center group text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          <div className="h-7 w-7 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mr-2 transition-all duration-300">
                            <ArrowLeft size={12} className="text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span className="text-xs font-medium">Back</span>
                        </button>
                      </div>
                      
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 mb-4">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Counselor Dashboard</h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                          Thank you for your interest! This portal will be launching soon
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionPage;