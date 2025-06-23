import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Home, X, Cpu,Building, Key, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface RealEstateHeaderProps {
  onNavClick: (id: "home" | "services" | "contact") => void;
  activeLink: string;
}

const RealEstateHeader = memo(function RealEstateHeader({
  onNavClick,
  activeLink,
}: RealEstateHeaderProps) {
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
      const redirectPath = "/main/services/campaign/37b3"; // your desired path

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
        { id: "home", label: "Home", icon: Home },
        { id: "services", label: "Services", icon: Building },
        { id: "contact", label: "Contact", icon: Phone },
      ] as const,
    []
  );

  const headerClasses = {
    base: "sticky top-0 z-50 w-full transition-all duration-300",
    scrolled: "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100",
    notScrolled: "bg-white/90 backdrop-blur-sm",
  };

  const navButtonClasses = {
    base: "relative px-4 py-2 font-medium rounded-full transition-all duration-300 flex items-center gap-2",
    active:
      "text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md transform scale-105",
    inactive:
      "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-105",
  };

  const mobileNavButtonClasses = {
    base: "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
    active:
      "text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm transform scale-105",
    inactive:
      "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-105",
  };

  return (
    <>
      <header
        className={`${headerClasses.base} ${
          isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={handleHome}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-white rounded-full p-2 shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <Cpu className="h-7 w-7 text-blue-700" />
                  </div>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold">
                  <span className="text-blue-800">Real </span>
                  <span className="text-cyan-600">Estate</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-full px-3 py-2 shadow-inner border border-gray-200/50 backdrop-blur-sm">
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
                        <link.icon size={16} />
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
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2.5 px-6 rounded-full hover:shadow-lg group transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="Get started with our services"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Sign In
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="menu-button relative w-11 h-11 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={22} />
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-5 h-0.5 bg-current rounded-full" />
                    <div className="w-5 h-0.5 bg-current rounded-full" />
                    <div className="w-5 h-0.5 bg-current rounded-full" />
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
          className={`absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-200 transform transition-all duration-300 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Logo */}
           

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
                  <link.icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}

            {/* Mobile CTA */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignIn}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                aria-label="Get started with our services"
              >
                <Key size={20} />
               Sign In
              </button>
            </div>

           
          </div>
        </div>
      </div>
    </>
  );
});

export default RealEstateHeader;