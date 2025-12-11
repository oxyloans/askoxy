
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.removeItem("primaryType");
    sessionStorage.removeItem("fromAISTore");
    sessionStorage.removeItem("redirectPath");
  }, []);

  const handleLogin = () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/agentcreate";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        sessionStorage.setItem("primaryType", "AGENT");
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
    {
      label: "AWARDS & REWARDS",
      to: "/awards-rewards",
      sectionId: "awards-rewards",
      scrollTo: () => {
        freeAIBookRef.current?.scrollIntoView({ behavior: "smooth" });
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
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
  const isRegistered = Boolean(initials); // for future avatar usage
useEffect(() => {
  if (isMobileMenuOpen) {
    // Disable background scroll
    document.body.classList.add("overflow-hidden");
  } else {
    // Re-enable background scroll
    document.body.classList.remove("overflow-hidden");
  }

  // Cleanup just in case
  return () => {
    document.body.classList.remove("overflow-hidden");
  };
}, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200 ${
        compact ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
      aria-label="Site header"
    >
      <div className="mx-auto max-w-8xl px-3 sm:px-4 md:px-6 lg:px-8">
        {/* MOBILE SEARCH ROW – ONLY VISIBLE ON SMALL SCREENS */}
        {isMobileSearchOpen && (
          <div className="flex md:hidden items-center gap-3 py-3">
            <button
              aria-label="Close search"
              onClick={() => setIsMobileSearchOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 active:scale-[.98] transition"
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

            <div className="flex-1 relative">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agents…"
                className="w-full rounded-full border border-gray-200 bg-white pl-10 pr-10 py-2 text-[15px] leading-5 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-600"
                aria-label="Search agents"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
              {!!query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-gray-700"
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
          </div>
        )}

        {/* MAIN HEADER ROW – ALWAYS VISIBLE ON md+; HIDDEN ON MOBILE WHEN SEARCH OPEN */}
        <div
          className={`items-center justify-between gap-4 py-3 sm:py-4 ${
            isMobileSearchOpen ? "hidden md:flex" : "flex"
          }`}
        >
          {/* LEFT: Logos */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Bharat AI Logo (visible everywhere) */}
            <button
              onClick={() => navigate("/bharath-aistore")}
              className="flex items-center min-w-0"
              aria-label="Go to Bharat AI Store"
              title="Bharat AI Store"
            >
              <img
                src={Logo}
                alt="Bharat AI Store"
                className="h-9 sm:h-10 md:h-11 w-auto"
              />
            </button>

            {/* ASKOXY Logo — visible ONLY on mobile */}
            <button
              onClick={() => navigate("/")}
              className="flex sm:hidden lg:flex items-center min-w-0"
              aria-label="Go to ASKOXY.AI"
              title="ASKOXY.AI"
            >
              <img
                src={Logo1}
                alt="ASKOXY.AI"
                className="h-9 sm:h-10 md:h-11 w-auto"
              />
            </button>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
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
                    "group relative text-sm lg:text-[15px] font-semibold transition-colors whitespace-nowrap",
                    active
                      ? "text-purple-800"
                      : "text-gray-700 hover:text-purple-700",
                  ].join(" ")}
                >
                  {item.label}
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

          {/* RIGHT: Search + CTA / Mobile Icons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Desktop search */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600 w-48 md:w-56 lg:w-64">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-gray-500"
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
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
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
                    className="h-4 w-4 text-gray-700"
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

            {/* Mobile icons (always based on md:hidden, no JS flag) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Open search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
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

              <button
                onClick={handleLogin}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
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

            {/* Desktop CTA */}
            <button
              onClick={handleLogin}
              className={[
                "relative hidden md:inline-flex items-center justify-center",
                "bg-purple-600 hover:bg-purple-700 text-white font-semibold",
                "px-5 lg:px-6 py-2 lg:py-2.5 rounded-full shadow",
                "ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                "shadow-purple-400/60",
                "after:absolute after:-inset-[2px] after:rounded-full after:content-[''] after:-z-10",
                "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)]",
                "animate-pulse",
                "whitespace-nowrap", // 🔥 forces one-line text
                "max-w-full", // ensures no shrinking causes wrapping
              ].join(" ")}
              aria-label="Create AI Agent"
            >
              {isLoading ? "Loading…" : "Create AI Agent"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            className="absolute right-0 top-0 h-full w-72 sm:w-80 max-w-[85%] bg-white shadow-2xl p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Bharat AI Store" className="h-8 w-auto" />
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
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
    </header>
  );
};

export default Header;
