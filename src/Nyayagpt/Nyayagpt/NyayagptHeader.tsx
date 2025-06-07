import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  useMemo,
} from "react";
import { Home, X, Building, Key, Phone, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface NyayagptHeaderProps {
  onNavClick: (id: "home" | "services" | "contact") => void;
  activeLink: string;
}

const NyayagptHeader = memo(function NyayagptHeader({
  onNavClick,
  activeLink,
}: NyayagptHeaderProps) {
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
    () => [
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

  const logo = (
    <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick("home")}> 
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
        <div className="relative bg-white rounded-full p-2 shadow-lg group-hover:shadow-xl transition-shadow">
          <Bot className="h-7 w-7 text-purple-600" />
        </div>
      </div>
      <div className="ml-3">
        <div className="text-xl font-bold">
          <span className="text-indigo-800">Nyaya {" "}</span>
          <span className="text-purple-600">GPT</span>
        </div>
       
      </div>
    </div>
  );

  return (
    <header
      className={`${headerClasses.base} ${
        isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {logo}

          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-3 py-2 shadow-inner border border-gray-200/50">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeLink === link.id
                        ? "text-white bg-gradient-to-r from-indigo-600 to-purple-500 shadow-md scale-105"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 hover:scale-105"
                    }`}
                  >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2.5 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="menu-button w-11 h-11 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              {isMenuOpen ? <X size={22} /> : (
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
    
  );
});

export default NyayagptHeader;
