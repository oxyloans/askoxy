import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Home, X, Building, Phone, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface CaCsHeaderProps {
  onNavClick: (id: "home" | "services" | "contact") => void;
  activeLink: string;
}

const NyayagptHeader = memo(function NyayagptHeader({
  onNavClick,
  activeLink,
}: CaCsHeaderProps) {
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
  }, []);

  const handleSignIn = () => {
    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/legalservice"; // your desired path

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

  const mobileNavButtonClasses = {
    base: "w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3",
    active:
      "bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-md",
    inactive: "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50",
  };

const logo = (
  <div
    className="flex items-center gap-3 cursor-pointer group"
    onClick={() => navigate("/")}
    role="button"
    aria-label="Navigate to homepage"
  >
    <div className="relative">
      {/* Gradient glow background */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-40 blur-lg group-hover:opacity-60 transition-all duration-300"></div>

      {/* Logo icon */}
      <div className="relative bg-white rounded-full p-2 shadow-md group-hover:shadow-lg transition-shadow">
        <Bot className="h-7 w-7 text-purple-600" />
      </div>
    </div>

    {/* Logo text */}
    <div className="text-xl font-bold leading-tight tracking-tight">
      <span className="text-indigo-800">Nyaya</span>
      <span className="text-purple-600">GPT</span>
    </div>
  </div>
  );
   const isActive = (id: string) => activeLink === id;


  return (
    <>
      <header
        className={`${headerClasses.base} ${
          isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {logo}

            <nav className="hidden md:flex items-center gap-3">
              {navLinks.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    isActive(id)
                      ? "bg-gradient-to-r from-blue-700 to-purple-600 text-white shadow-md"
                      : "text-blue-900 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2.5 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Sign In"}
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="menu-button w-11 h-11 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
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
                  <link.icon size={20} />
                  {link.label}
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default NyayagptHeader;