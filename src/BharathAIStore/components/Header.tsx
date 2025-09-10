import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Logo from "../../assets/img/bharatAI.png";

const getInitials = (nameOrEmail?: string) => {
  if (!nameOrEmail) return "";
  const name = nameOrEmail.replace(/\s+/g, " ").trim();
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (name.includes("@")) return name[0].toUpperCase();
  return (name[0] || "").toUpperCase();
};

interface HeaderProps {
  bharatAgentsStoreRef: React.RefObject<HTMLDivElement>;
  aiResourcesRef: React.RefObject<HTMLDivElement>;
  freeAIBookRef: React.RefObject<HTMLDivElement>;
}

const Header: React.FC<HeaderProps> = ({
  bharatAgentsStoreRef,
  aiResourcesRef,
  freeAIBookRef,
}) => {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const nav = [
    {
      label: "BHARAT AI STORE",
      to: "/bharath-aistore",
      sectionId: "bharat-ai-store",
      scrollTo: () => {
        bharatAgentsStoreRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      label: "AI INITIATIVES",
      to: "/ai-initiatives",
      sectionId: "ai-initiatives",
      scrollTo: () => {
        aiResourcesRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const NEXT_PATH = "/bharat-expert";
  const handleCreateAgentClick = () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate(NEXT_PATH);
      } else {
        sessionStorage.setItem("redirectPath", NEXT_PATH);
        navigate(`/whatsapplogin?next=${encodeURIComponent(NEXT_PATH)}`);
      }
    } catch (e) {
      console.error("Create Agent CTA error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");
            if (sectionId) setActiveSection(sectionId);
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -20% 0px", threshold: 0.5 }
    );

    if (bharatAgentsStoreRef.current) {
      bharatAgentsStoreRef.current.setAttribute("data-section-id", "bharat-ai-store");
      observer.observe(bharatAgentsStoreRef.current);
    }
    if (aiResourcesRef.current) {
      aiResourcesRef.current.setAttribute("data-section-id", "ai-initiatives");
      observer.observe(aiResourcesRef.current);
    }
    if (freeAIBookRef.current) {
      freeAIBookRef.current.setAttribute("data-section-id", "free-ai-book");
      observer.observe(freeAIBookRef.current);
    }

    return () => {
      if (bharatAgentsStoreRef.current) observer.unobserve(bharatAgentsStoreRef.current);
      if (aiResourcesRef.current) observer.unobserve(aiResourcesRef.current);
      if (freeAIBookRef.current) observer.unobserve(freeAIBookRef.current);
    };
  }, [bharatAgentsStoreRef, aiResourcesRef, freeAIBookRef]);

  // Focus when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) inputRef.current.focus();
  }, [isMobileSearchOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        if (isMobile) {
          setIsMobileSearchOpen(true);
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      if (e.key === "Escape") {
        setIsMobileSearchOpen(false);
        setProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile]);

  // Header compact on scroll
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Resize watcher for mobile
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (sectionId: string) => activeSection === sectionId;

  const stored =
    localStorage.getItem("display_name") ||
    localStorage.getItem("user_name") ||
    localStorage.getItem("full_name") ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)?.name
      : "") ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)?.email
      : "");
  const initials = getInitials(stored || "");
  const isRegistered = Boolean(initials);

  return (
    <div
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        compact ? "bg-white text-gray-800 shadow-lg" : "bg-white text-gray-800",
      ].join(" ")}
      aria-label="Site header"
    >
      <header className={`transition-all duration-200 ${compact ? "h-16" : "h-16"}`} aria-label="Site header">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 h-full">
          {/* ---------- MOBILE SEARCH ROW ---------- */}
          {isMobileSearchOpen ? (
            <div className="flex h-full items-center gap-3 md:hidden">
              <button
                aria-label="Close search"
                onClick={() => setIsMobileSearchOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="flex-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsMobileSearchOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-600">
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search assistants, agents"
                      className="w-full bg-transparent outline-none text-[15px] placeholder:text-gray-400"
                      aria-label="Search assistants"
                    />
                    {!!query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="rounded-full p-1 hover:bg-gray-100"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M6 6l12 12M18 6l-12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* ---------- DEFAULT ROW ---------- */
            <div className="flex h-full items-center justify-between gap-3">
              {/* LEFT: Logo + NAV (as "buttons") */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 min-w-0"
                  aria-label="Go to Home"
                  title="Bharat AI Store"
                >
                  <img src={Logo} alt="Bharat AI Store" className="h-10 w-auto" />
                </button>

                {/* Desktop nav as subtle buttons */}
                <nav className="hidden md:flex items-center gap-2">
                  {nav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(e) => {
                        e.preventDefault();
                        item.scrollTo();
                      }}
                      className={[
                        "px-3 py-2 rounded-full text-[14px] font-semibold transition-colors border",
                        isActive(item.sectionId)
                          ? "text-purple-800 border-purple-200 bg-purple-50"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Desktop search integrated in header */}
                <div className="hidden md:flex flex-1 max-w-md ml-4">
                  <div className="w-full flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-600">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-600" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3.5-3.5" />
                    </svg>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search assistants, agents…"
                      className="w-full bg-transparent outline-none text-[15px] placeholder:text-gray-400"
                      aria-label="Search assistants"
                    />
                    {!!query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="rounded-full p-1 hover:bg-gray-100"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M6 6l12 12M18 6l-12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Create Agent CTA */}
              <div className="flex items-center gap-2">
                {/* Create Agent — make it primary/attractive */}
                <button
                  onClick={handleCreateAgentClick}
                  disabled={isLoading}
                  className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm md:text-base font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  aria-label="Create Agent"
                  title="Create Agent"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 -rotate-12 transform group-hover:translate-x-16"></span>
                  
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {isLoading ? "Loading..." : "Create Agent"}
                </button>

                {/* Mobile icons */}
                {isMobile && (
                  <div className="flex md:hidden items-center gap-1">
                    <button
                      onClick={() => setIsMobileSearchOpen(true)}
                      aria-label="Open search"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCreateAgentClick}
                      disabled={isLoading}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 relative overflow-hidden group"
                      aria-label="Create Agent"
                      title="Create Agent"
                    >
                      {/* Shine effect */}
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 -rotate-12 transform group-hover:translate-x-8"></span>
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="Open menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ---------- MOBILE NAV DRAWER ---------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Bharat AI Store" className="h-8 w-auto" />
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={(e) => {
                    e.preventDefault();
                    n.scrollTo();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-800 hover:bg-gray-100"
                >
                  {n.label}
                </Link>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleCreateAgentClick();
                  }}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl shadow-md relative overflow-hidden group"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 -rotate-12 transform group-hover:translate-x-16"></span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {isLoading ? "Loading..." : "Create Agent"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;