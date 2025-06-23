import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Home, X, ShoppingBag, Mail, Phone, Bot, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface Rice2RoboEcommersHeaderProps {
  onNavClick: (id: "home" | "services" | "contact") => void;
  activeLink: string;
}

const Rice2RoboEcommersHeader = memo(function Rice2RoboEcommersHeader({
  onNavClick,
  activeLink,
}: Rice2RoboEcommersHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const scrollRef = useRef(isScrolled);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const LOGIN_URL = "/whatsapplogin";
    const navigate = useNavigate();
const handleHome = () =>{navigate("/")};  
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

  const handleNavClick = useCallback(
    (id: "home" | "services" | "contact") => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      onNavClick(id);
      setIsMenuOpen(false);
    },
    [onNavClick]
  );

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requestAnimationFrame(() => {
      setIsMenuOpen((prev) => !prev);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !(e.target instanceof HTMLElement) ||
        (!e.target.closest(".mobile-menu-container") &&
          !e.target.closest(".menu-button"))
      ) {
        requestAnimationFrame(() => setIsMenuOpen(false));
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMenuOpen]);
  const handleSignIn = () => {
    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/campaign/0f02"; // your desired path

      if (userId) {
        // User is already logged in
        navigate(redirectPath);
      } else {
        // Save redirect path before redirecting to login
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navLinks = useMemo(
    () =>
      [
        { id: "home", label: "Home" },
        { id: "services", label: "Services"},
        { id: "contact", label: "Contact" },
      ] as const,
    []
  );

  const headerClasses = {
    base: "sticky top-0 z-50 w-full transition-all duration-300",
    scrolled: "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100",
    notScrolled: "bg-white/90 backdrop-blur-sm",
  };

  const navButtonClasses = {
    base: "relative px-3 py-2 sm:px-4 font-medium rounded-full transition-all duration-300 flex items-center gap-2 text-sm sm:text-base",
    active:
      "text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md transform scale-105",
    inactive:
      "text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:scale-105",
  };

  const mobileNavButtonClasses = {
    base: "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
    active:
      "text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-sm transform scale-105",
    inactive:
      "text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:scale-105",
  };

  return (
    <>
      <header
        className={`${headerClasses.base} ${
          isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={handleHome}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-white rounded-full p-1.5 sm:p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Bot className="h-5 w-5 sm:h-6 md:h-7 sm:w-6 md:w-7 text-purple-600" />
                    <ShoppingCart className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="ml-2 sm:ml-3">
                <div className="text-base sm:text-lg md:text-xl font-bold">
                  <span className="text-purple-800">Rice2Robo{" "} </span>
                  <span className="text-blue-600">Ecommers</span>
                </div>
                
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-full px-3 py-2 shadow-inner border border-gray-200/50 backdrop-blur-sm">
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
                        aria-label={`Navigate to ${link.label}`}
                      >
                       
                        <span className="hidden lg:inline">{link.label}</span>
                        <span className="lg:hidden">{link.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleSignIn}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-full hover:shadow-lg group transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 text-sm sm:text-base"
                aria-label="Start shopping with us"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Shop Now</span>
                  <span className="sm:hidden">Shop</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="menu-button relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-purple-50 text-purple-700 hover:text-purple-600 hover:bg-purple-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={20} />
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-4 sm:w-5 h-0.5 bg-current rounded-full" />
                    <div className="w-4 sm:w-5 h-0.5 bg-current rounded-full" />
                    <div className="w-4 sm:w-5 h-0.5 bg-current rounded-full" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mobile-menu-container fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className={`absolute top-14 sm:top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-200 transform transition-all duration-300 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center pb-4 mb-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-400 rounded-full p-2">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-lg font-bold">
                    <span className="text-purple-800">Rice2Robo</span>
                    <span className="text-blue-600">Ecommers</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Smart Shopping Solutions
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => {
              const isActive = activeLink === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`${mobileNavButtonClasses.base} ${
                    isActive
                      ? mobileNavButtonClasses.active
                      : mobileNavButtonClasses.inactive
                  }`}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {/* <link.icon size={20} /> */}
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignIn}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center gap-2"
                aria-label="Start shopping with us"
              >
                <ShoppingCart size={20} />
                Start Shopping
              </button>
            </div>

            {/* Mobile Contact Info */}
            <div className="pt-4 mt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
              <a 
                href="tel:+1555123456" 
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center justify-center gap-2 mb-2"
              >
                <Phone size={16} />
                Call: (555) 123-4567
              </a>
              <a 
                href="mailto:support@rice2roboecommers.com" 
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                support@rice2roboecommers.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Rice2RoboEcommersHeader;