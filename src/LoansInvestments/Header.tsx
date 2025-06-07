import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Cpu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CaCsHeaderProps {
  onNavClick: (id: "home" | "services" | "contact") => void;
  activeLink: string;
}

const Header = memo(function CaCsHeader({
  onNavClick,
  activeLink,
}: CaCsHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const scrollRef = useRef(isScrolled);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const LOGIN_URL = "/whatsapplogin";
    const navigate = useNavigate();

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

      if (userId) {
        // If user is logged in, go directly to the campaign page
        navigate("/main/service/oxyloans-service");
      } else {
        // If not logged in, redirect to WhatsApp login
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
        { id: "services", label: "Services" },
        { id: "contact", label: "Contact" },
      ] as const,
    []
  );

  const headerClasses = {
    base: "sticky top-0 z-50 w-full transition-all duration-300",
    scrolled: "bg-white shadow-lg backdrop-blur-sm",
    notScrolled: "bg-white bg-opacity-95 backdrop-blur-sm",
  };

  const navButtonClasses = {
    base: "relative px-4 py-2 font-medium rounded-full transition-all duration-300",
    active:
      "text-white bg-gradient-to-r from-blue-700 to-purple-500 shadow-md transform scale-105",
    inactive:
      "text-blue-800 hover:text-blue-600 hover:bg-blue-50 hover:scale-105",
  };

  const mobileNavButtonClasses = {
    base: "block w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
    active:
      "text-white bg-gradient-to-r from-blue-700 to-purple-500 shadow-sm transform scale-105",
    inactive:
      "text-blue-900 hover:text-blue-700 hover:bg-blue-50 hover:scale-105",
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
              className="flex items-center cursor-pointer"
              onClick={() => handleNavClick("home")}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-400 rounded-full opacity-50 blur"></div>
                <div className="relative bg-white rounded-full p-2 shadow-lg">
                  <Cpu className="h-7 w-7 text-blue-700" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-blue-900">
                  Loans<span className="text-purple-600"> & Investments </span>

                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-blue-50 to-white rounded-full px-2 py-1 shadow-inner border border-gray-200">
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
                        {/* Optional active underline: */}
                        {/* {isActive && <div className="h-1 mt-1 bg-purple-600 rounded-full"></div>} */}
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
                className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-2 px-5 rounded-full hover:shadow-lg group transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="menu-button relative w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:text-blue-500 hover:bg-blue-100 transition-all duration-300"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={20} />
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-5 h-0.5 bg-current" />
                    <div className="w-5 h-0.5 bg-current" />
                    <div className="w-5 h-0.5 bg-current" />
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
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        <div
          className={`absolute top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 transform transition-all duration-300 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-6 space-y-2">
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
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Header;
