// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   memo,
//   useRef,
//   useMemo,
// } from "react";
// import { Cpu, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface CaCsHeaderProps {
//   onNavClick: (id: "home" | "services" | "contact") => void;
//   activeLink: string;
// }

// const Header = memo(function CaCsHeader({
//   onNavClick,
//   activeLink,
// }: CaCsHeaderProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 50);
//   const scrollRef = useRef(isScrolled);
//   const [isLoading, setIsLoading] = useState(false);
//   const LOGIN_URL = "/whatsapplogin";
//   const navigate = useNavigate();
//   const handleHome = () => navigate("/");

//   useEffect(() => {
//     let ticking = false;
//     const handleScroll = () => {
//       if (!ticking) {
//         window.requestAnimationFrame(() => {
//           const shouldBeScrolled = window.scrollY > 50;
//           if (scrollRef.current !== shouldBeScrolled) {
//             scrollRef.current = shouldBeScrolled;
//             setIsScrolled(shouldBeScrolled);
//           }
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };
//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleNavClick = useCallback(
//     (id: "home" | "services" | "contact") => {
//       const target = document.getElementById(id);
//       if (target) {
//         target.scrollIntoView({ behavior: "smooth" });
//       }
//       onNavClick(id);
//       setIsMenuOpen(false);
//     },
//     [onNavClick]
//   );

//   const toggleMenu = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     requestAnimationFrame(() => setIsMenuOpen((prev) => !prev));
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         !(e.target instanceof HTMLElement) ||
//         (!e.target.closest(".mobile-menu-container") &&
//           !e.target.closest(".menu-button"))
//       ) {
//         requestAnimationFrame(() => setIsMenuOpen(false));
//       }
//     };
//     if (isMenuOpen) {
//       document.addEventListener("mousedown", handleClickOutside, true);
//     }
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside, true);
//   }, [isMenuOpen]);

//   useEffect(() => {
//     if (!isMenuOpen) return;
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setIsMenuOpen(false);
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [isMenuOpen]);

//   useEffect(() => {
//     if (isMenuOpen) {
//       const originalStyle = window.getComputedStyle(document.body).overflow;
//       document.body.style.overflow = "hidden";
//       return () => {
//         document.body.style.overflow = originalStyle;
//       };
//     }
//   }, [isMenuOpen]);

//   const handleSignIn = () => {
//     try {
//       setIsLoading(true);
//       const userId = localStorage.getItem("userId");
//       const redirectPath = "/main/service/oxyloans-service";
//       if (userId) {
//         navigate(redirectPath);
//       } else {
//         sessionStorage.setItem("redirectPath", redirectPath);
//         window.location.href = LOGIN_URL;
//       }
//     } catch (error) {
//       console.error("Sign in error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const navLinks = useMemo(
//     () =>
//       [
//         { id: "home", label: "Home" },
//         { id: "services", label: "Services" },
//         { id: "contact", label: "Contact" },
//       ] as const,
//     []
//   );

//   const headerClasses = {
//     base: "sticky top-0 z-50 w-full transition-all duration-300",
//     scrolled: "bg-white shadow-lg backdrop-blur-md",
//     notScrolled: "bg-white bg-opacity-90 backdrop-blur-md",
//   };

//   const navButtonClasses = {
//     base: "relative px-4 py-2 font-medium rounded-full transition-all duration-300",
//     active:
//       "text-white bg-gradient-to-r from-blue-700 to-purple-500 shadow-md scale-105",
//     inactive: "text-blue-800 hover:text-blue-600 hover:bg-blue-100",
//   };

//   const mobileNavButtonClasses = {
//     base: "block w-full text-left px-4 py-3 rounded-xl transition-all duration-300",
//     active: "text-white bg-gradient-to-r from-blue-700 to-purple-500 scale-105",
//     inactive: "text-blue-900 hover:text-blue-700 hover:bg-blue-100",
//   };

//   return (
//     <>
//       <header
//         className={`${headerClasses.base} ${
//           isScrolled ? headerClasses.scrolled : headerClasses.notScrolled
//         }`}
//       >
//         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 md:h-20">
//             <div
//               className="flex items-center cursor-pointer"
//               onClick={handleHome}
//             >
//               <div className="relative">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-400 rounded-full opacity-50 blur"></div>
//                 <div className="relative bg-white rounded-full p-2 shadow-lg">
//                   <Cpu className="h-7 w-7 text-blue-700" />
//                 </div>
//               </div>
//               <div className="ml-3">
//                 <span className="text-xl font-bold text-blue-900">
//                   Loans<span className="text-purple-600"> & Investments </span>
//                 </span>
//               </div>
//             </div>

//             <nav className="hidden md:flex flex-1 justify-center">
//               <ul className="flex space-x-1 lg:space-x-2 bg-gradient-to-r from-blue-50 to-white rounded-full px-2 py-1 shadow-inner border border-gray-200">
//                 {navLinks.map((link) => (
//                   <li key={link.id}>
//                     <button
//                       onClick={() => handleNavClick(link.id)}
//                       className={`${navButtonClasses.base} ${
//                         activeLink === link.id
//                           ? navButtonClasses.active
//                           : navButtonClasses.inactive
//                       }`}
//                     >
//                       {link.label}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             <div className="hidden md:flex items-center gap-3">
//               <button
//                 onClick={handleSignIn}
//                 className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-2 px-5 rounded-full hover:shadow-lg group transition-all duration-300 transform hover:scale-105"
//               >
//                 <span className="relative z-10">Sign In</span>
//                 <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
//               </button>
//             </div>

//             <div className="md:hidden">
//               <button
//                 onClick={toggleMenu}
//                 className="menu-button w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:text-blue-500 hover:bg-blue-100"
//                 aria-label="Toggle menu"
//                 aria-expanded={isMenuOpen}
//               >
//                 {isMenuOpen ? (
//                   <X size={20} />
//                 ) : (
//                   <div className="space-y-1.5">
//                     <div className="w-5 h-0.5 bg-current" />
//                     <div className="w-5 h-0.5 bg-current" />
//                     <div className="w-5 h-0.5 bg-current" />
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div
//         className={`md:hidden mobile-menu-container fixed inset-0 z-40 transition-all duration-300 ${
//           isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
//         <div
//           className={`absolute top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 transition-transform duration-300 ${
//             isMenuOpen ? "translate-y-0" : "-translate-y-full"
//           }`}
//         >
//           <div className="px-4 py-6 space-y-2">
//             {navLinks.map((link) => (
//               <button
//                 key={link.id}
//                 onClick={() => handleNavClick(link.id)}
//                 className={`${mobileNavButtonClasses.base} ${
//                   activeLink === link.id
//                     ? mobileNavButtonClasses.active
//                     : mobileNavButtonClasses.inactive
//                 }`}
//               >
//                 {link.label}
//               </button>
//             ))}
//             <div className="pt-4 mt-4 border-t border-gray-200">
//               <button
//                 onClick={handleSignIn}
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
//               >
//                 {isLoading ? "Signing In..." : "Sign In"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// });

// export default Header;




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

  const handleHome = () => {
    navigate("/");
  };

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
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50;
      if (scrollRef.current !== shouldBeScrolled) {
        scrollRef.current = shouldBeScrolled;
        setIsScrolled(shouldBeScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setIsMenuOpen(false);
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/71e3/gold-silver-diamonds";
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

  const navLinks = useMemo(
    () =>
      [
        { id: "home", label: "Home" },
        { id: "services", label: "Services" },
        { id: "contact", label: "Contact" },
      ] as const,
    []
  );

  const isActive = (id: string) => activeLink === id;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleHome}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur" />
              <div className="relative bg-white p-2 rounded-full shadow-md">
                <Cpu className="text-blue-700 w-7 h-7" />
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-blue-900">
              Loans<span className="text-purple-600"> & Investments </span>
            </h1>
          </div>

          {/* Desktop Nav */}
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

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-700 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="menu-button w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            >
              {isMenuOpen ? (
                <X size={22} />
              ) : (
                <div className="space-y-1">
                  <span className="block w-5 h-0.5 bg-current"></span>
                  <span className="block w-5 h-0.5 bg-current"></span>
                  <span className="block w-5 h-0.5 bg-current"></span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        <div
          className={`mobile-menu-container absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg rounded-b-xl px-4 py-6 transform transition-all duration-300 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-lg font-medium mb-1 transition ${
                isActive(id)
                  ? "bg-gradient-to-r from-blue-700 to-purple-500 text-white"
                  : "text-blue-900 hover:bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-blue-700 to-purple-500 text-white font-medium py-3 rounded-xl hover:shadow-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

export default Header;
