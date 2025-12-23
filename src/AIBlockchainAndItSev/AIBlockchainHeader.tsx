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

// Define Nav Link Type
type NavID = "home" | "services" | "contact";
interface AIBlockchainHeaderProps {
  onNavClick: (id: NavID) => void;
  activeLink: NavID;
}

const navLinks: { id: NavID; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const AIBlockchainHeader = memo(function AIBlockchainHeader({
  onNavClick,
  activeLink,
}: AIBlockchainHeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
  const scrollRef = useRef(isScrolled);

  const LOGIN_URL = "/whatsapplogin";
  const redirectPath = "/main/services/0f02/ai-blockchain-it-services";

  // --- Header scroll effect (sticky shadow) ---
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          if (scrollRef.current !== scrolled) {
            scrollRef.current = scrolled;
            setIsScrolled(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Desktop/mobile nav handling ---
  const handleNavClick = useCallback(
    (id: NavID) => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      onNavClick(id);
      setIsMenuOpen(false);
    },
    [onNavClick]
  );
  const handleHome = () => navigate("/");
  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);
  // --- Handle mobile drawer close on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !(e.target instanceof HTMLElement) ||
        (!e.target.closest(".mobile-menu-container") &&
          !e.target.closest(".menu-button"))
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen)
      document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isMenuOpen]);
  // --- Keyboard ESC to close mobile drawer ---
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);
  // --- Prevent body scroll when mobile menu open ---
  useEffect(() => {
    if (isMenuOpen) {
      const original = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMenuOpen]);

  // --- Sign in logic ---
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300
          ${
            isScrolled
              ? "bg-white shadow-lg backdrop-blur-lg"
              : "bg-white/95 backdrop-blur-sm"
          }`}
        aria-label="Site header"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={handleHome}
              aria-label="Go to homepage"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span className="relative inline-block">
                <span className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-400 rounded-full opacity-40 blur-md"></span>
                <span className="relative bg-white rounded-full p-2 shadow-md flex items-center">
                  <Cpu className="h-7 w-7 text-blue-700" />
                </span>
              </span>
              <span className="ml-3 text-xl font-bold text-blue-900">
                AI
                <span className="text-purple-600"> Blockchain, Crypto </span>&
                <span className="text-blue-600"> IT Services</span>
              </span>
            </button>
            {/* Desktop Nav */}
            <nav
              className="hidden md:flex flex-1 justify-center"
              aria-label="Main navigation"
            >
              <ul className="flex space-x-0.5 lg:space-x-2 bg-gradient-to-r from-blue-50 to-white rounded-full px-1.5 py-1.5 shadow-inner border border-gray-200">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`
                        px-4 py-2 font-medium rounded-full outline-none transition-all
                        duration-200 focus-visible:ring-2 focus-visible:ring-blue-600
                        ${
                          activeLink === link.id
                            ? "bg-gradient-to-r text-white from-blue-700 to-purple-500 shadow-md scale-105"
                            : "text-blue-800 hover:text-blue-700 hover:bg-blue-50"
                        }
                      `}
                      aria-current={activeLink === link.id}
                      tabIndex={0}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-2 px-5 rounded-full hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                aria-label="Sign in"
              >
                <span className="relative z-10">
                  {isLoading ? "Loading..." : "Sign In"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </button>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="menu-button w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                type="button"
              >
                {isMenuOpen ? (
                  <X size={24} />
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-6 h-0.5 bg-current rounded"></div>
                    <div className="w-6 h-0.5 bg-current rounded"></div>
                    <div className="w-6 h-0.5 bg-current rounded"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden mobile-menu-container fixed inset-0 z-40 transition-opacity duration-200
          ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        aria-hidden={!isMenuOpen}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300`}
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile main navigation"
          className={`absolute top-0 left-0 right-0 bg-white shadow-2xl border-b border-gray-200 pt-20 pb-6 rounded-b-3xl transition-transform duration-300
            ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <div className="px-5 py-2 space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-4 py-3.5 text-base font-semibold rounded-xl transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
                  ${
                    activeLink === link.id
                      ? "text-white bg-gradient-to-r from-blue-700 to-purple-500 shadow-sm scale-105"
                      : "text-blue-900 hover:text-blue-700 hover:bg-blue-50"
                  }
                `}
                aria-current={activeLink === link.id}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 mt-4 border-t border-gray-100">
              <button
                onClick={handleSignIn}
                className="w-full bg-gradient-to-r from-blue-700 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
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

export default AIBlockchainHeader;
