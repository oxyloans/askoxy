import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Logo from "../../assets/img/bharatAI.png";
import Logo1 from "../../assets/img/logo1lion.png";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
const handleLogin = () => {
  try {
    setLoading(true);

    const userId = localStorage.getItem("userId");
    const redirectPath = "/main/createagent";

    if (userId) {
      navigate(redirectPath);
    } else {
      sessionStorage.setItem("redirectPath", redirectPath);
      sessionStorage.setItem("primaryType", "AGENT"); // Set primary type for agents
      // Pass primaryType as query parameter
      window.location.href = "/whatsappregister?primaryType=AGENT";
    }
  } catch (error) {
    console.error("Sign in error:", error);
  } finally {
    setLoading(false);
  }
};
  const nav = [
    {
      label: "AI INITIATIVES",
      to: "/bharath-aistore/ai-initiatives",
      sectionId: "ai-initiatives",
      scrollTo: () => {
        aiResourcesRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
  {
    label: "RADHA'S AI LAB",
    to: "/bharath-aistore/RadhaAgents",
    sectionId: "radhas-ai-lab",
    scrollTo: () => {
      aiResourcesRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  },
    // inside the `nav` array
    {
      label: "AWARDS & REWARDS",
      to: "/awards-rewards",
      sectionId: "awards-rewards",
      scrollTo: () => {
         aiResourcesRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];




  // Observe sections to set active nav highlight
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
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.5,
      }
    );

    if (bharatAgentsStoreRef.current) {
      bharatAgentsStoreRef.current.setAttribute(
        "data-section-id",
        "bharat-ai-store"
      );
      observer.observe(bharatAgentsStoreRef.current);
    }
    if (aiResourcesRef.current) {
      aiResourcesRef.current.setAttribute("data-section-id", "ai-initiatives");
      observer.observe(aiResourcesRef.current);
    }
    if (freeAIBookRef.current) {
      freeAIBookRef.current.setAttribute("data-section-id", "awards-rewards");
      observer.observe(freeAIBookRef.current);
    }

    return () => {
      if (bharatAgentsStoreRef.current)
        observer.unobserve(bharatAgentsStoreRef.current);
      if (aiResourcesRef.current) observer.unobserve(aiResourcesRef.current);
      if (freeAIBookRef.current) observer.unobserve(freeAIBookRef.current);
    };
  }, [bharatAgentsStoreRef, aiResourcesRef, freeAIBookRef]);

  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) inputRef.current.focus();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        setIsMobileSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsMobileSearchOpen(false);
        setProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

const isActive = (sectionId: string) => {
  if (
    location.pathname === "/bharath-aistore/ai-initiatives" &&
    sectionId === "ai-initiatives"
  )
    return true;
  if (
    location.pathname === "/bharath-aistore/RadhaAgents" &&
    sectionId === "radhas-ai-lab"
  )
    return true;
  if (
    location.pathname === "/awards-rewards" &&
    sectionId === "awards-rewards"
  )
    return true;
  return activeSection === sectionId;
};


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

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768;
  });
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        compact ? "bg-white text-gray-800 shadow-lg" : "bg-white text-gray-800",
      ].join(" ")}
      aria-label="Site header"
    >
      <header
        className={`transition-all duration-200 ${compact ? "h-16" : "h-16"}`}
        aria-label="Site header"
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 h-full">
          {/* ---------- MOBILE SEARCH (slide-in row) ---------- */}
          {isMobileSearchOpen ? (
            <div className="md:hidden flex h-12 items-center gap-2">
              {/* Back/close */}
              <button
                aria-label="Close search"
                onClick={() => setIsMobileSearchOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 active:scale-[.98] transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Search */}
              <div className="flex-1 min-w-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsMobileSearchOpen(false);
                  }}
                >
                  {/* Fixed-height input wrapper */}
                  <div className="flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 shadow-sm focus-within:ring-1 focus-within:ring-purple-600">
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search agents…"
                      className="w-full bg-transparent outline-none text-[16px] leading-5 placeholder:text-gray-400"
                      aria-label="Search assistants"
                      enterKeyHint="search"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      autoFocus
                    />
                    {!!query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100 transition"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
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
            <div className="flex h-full items-center justify-between gap-4">
              {/* LEFT: Logo */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Logo (always visible) */}
                <button
                  onClick={() => navigate("/bharath-aistore")}
                  className="flex items-center min-w-0"
                  aria-label="Go to Home"
                  title="Bharat AI Store"
                >
                  <img
                    src={Logo}
                    alt="Bharat AI Store"
                    className="h-10 w-auto"
                  />
                </button>

                {/* Logo1 (hidden on mobile, visible on sm and above) */}
                <button
                  onClick={() => navigate("/")}
                  className="hidden sm:flex items-center min-w-0"
                  aria-label="Go to Home"
                  title="ASKOXY.AI"
                >
                  <img
                    src={Logo1}
                    alt="ASKOXY.AI"
                    className="h-10 w-auto"
                  />
                </button>
              </div>

              {/* CENTER: Desktop nav */}
              <nav className="hidden md:flex items-center gap-6">
                {nav.map((item) => {
                  const active = isActive(item.sectionId);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        if (location.pathname === item.to) {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={[
                        "relative text-[15px] font-semibold transition-colors",
                        active
                          ? "text-purple-800"
                          : "text-gray-700 hover:text-purple-700",
                      ].join(" ")}
                    >
                      {item.label}
                      {/* underline accent on hover/active */}
                      <span
                        className={[
                          "pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-purple-700 transition-transform duration-200",
                          active ? "scale-x-100" : "group-hover:scale-x-100",
                        ].join(" ")}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* RIGHT: Desktop search + CTA (now with uniform gap) | Mobile icons */}
              <div className="flex items-center gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
                {/* Desktop search */}
                <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-600 w-[22rem]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-gray-600"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search agents…"
                    className="w-full bg-transparent outline-none text-[15px] placeholder:text-gray-400"
                    aria-label="Search agents"
                  />
                  {!!query && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                      className="rounded-full p-1 hover:bg-gray-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6l-12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Mobile icons */}
                {isMobile && (
                  <div className="flex md:hidden items-center gap-1">
                    <button
                      onClick={() => setIsMobileSearchOpen(true)}
                      aria-label="Open search"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
                      title="Search"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                    </button>

                    {/* Mobile CTA (icon only) */}
                    <button
                      onClick={handleLogin}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
                      aria-label="Create AI Agent"
                      title="Create AI Agent"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="Open menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Desktop CTA with pulse animation & comfortable gap */}
                <button
                  onClick={handleLogin}
                  className={[
                    "relative hidden md:inline-flex items-center justify-center",
                    "bg-purple-600 hover:bg-purple-700 text-white font-semibold",
                    "px-5 py-2.5 rounded-full shadow",
                    "ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    "shadow-purple-400/60",
                    "after:absolute after:-inset-[2px] after:rounded-full after:content-[''] after:-z-10",
                    "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)]",
                    "animate-pulse",
                  ].join(" ")}
                  aria-label="Create AI Agent"
                >
                  {isLoading ? "Loading…" : "Create AI Agent"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ---------- MOBILE NAV DRAWER ---------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* panel */}
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
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-800 hover:bg-gray-100"
                >
                  {n.label}
                </Link>
              ))}

              <hr className="my-3" />

              {/* Mobile CTA (full-width with pulse) */}
              <button
                onClick={handleLogin}
                className="w-full rounded-full bg-purple-600 text-white font-semibold py-3 shadow shadow-purple-400/60 animate-pulse hover:bg-purple-700"
              >
                {isLoading ? "Loading…" : "Create AI Agent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
