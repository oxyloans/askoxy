import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { Search as SearchIcon, X as XIcon } from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";
import NewsTicker from "./NewsTicker";
import ResourceNavBar from "./ResourceNavBar";
import ArticleChatWidget from "./ArticleChatWidget";
import { ChatContext } from "./ChatContext";

const primaryLinks = [
  { to: "/oxynews", label: "Home", end: true },
  { to: "/explore", label: "Explore", end: false },
  { to: "/radhai-news", label: "RadhAI News", end: false },
];

export default function OxyLayout() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const articleMatch = useMatch("/article/:id");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/explore?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setQuery("");
  }

  function toggleSearch() {
    setSearchOpen((o) => {
      if (o) setQuery("");
      return !o;
    });
  }

  return (
    <ChatContext.Provider
      value={{
        chatOpen,
        openChat: () => setChatOpen(true),
        closeChat: () => setChatOpen(false),
      }}
    >
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* ── Sticky header stack ── */}
        <div className="fixed top-0 left-0 right-0 z-30 w-full">
          <header className="bg-plum text-paper shadow-md">
            <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-3">

              {/* ── Single row: logo | nav (desktop) | actions ── */}
              <div className="flex items-center justify-between gap-2">

                {/* LEFT: Logo */}
                <Link
                  to="/oxynews"
                  aria-label="OxyNews home"
                  className="focus-ring flex shrink-0 items-center gap-2 rounded-lg"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm sm:h-11 sm:w-11">
                    <img src={Logo} alt="AskOxy" className="h-full w-full object-contain" />
                  </span>
                  <span className="font-display text-xl font-bold leading-none sm:text-2xl">
                    Oxy<span className="text-gold">News</span>
                  </span>
                </Link>

                {/* CENTER: Nav links — desktop only */}
                <nav
                  aria-label="OxyNews primary navigation"
                  className="hidden lg:flex flex-1 items-center justify-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {articleMatch?.params.id && (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="focus-ring inline-flex min-h-9 shrink-0 items-center rounded-full border border-paper/25 px-4 text-sm font-semibold text-paper transition hover:bg-white/10"
                    >
                      ← Back
                    </button>
                  )}
                  {primaryLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `focus-ring inline-flex min-h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-gold text-plum shadow-sm"
                            : "text-paper/85 hover:bg-white/10 hover:text-paper"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {articleMatch?.params.id && (
                    <button
                      type="button"
                      onClick={() => setChatOpen((o) => !o)}
                      aria-expanded={chatOpen}
                      className="focus-ring inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-semibold text-plum transition hover:bg-yellow-300"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Ask article
                    </button>
                  )}
                </nav>

                {/* RIGHT: desktop/tablet — always-visible search bar | mobile — icon toggle */}
                <div className="flex shrink-0 items-center gap-2">

                  {/* Article action buttons (back + ask) */}
                  {articleMatch?.params.id && (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="lg:hidden focus-ring inline-flex items-center gap-1 rounded-full border border-paper/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-paper transition hover:bg-white/20"
                    >
                      ← Back
                    </button>
                  )}
                  {articleMatch?.params.id && (
                    <button
                      type="button"
                      onClick={() => setChatOpen((o) => !o)}
                      aria-expanded={chatOpen}
                      className="lg:hidden focus-ring inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-plum transition hover:bg-yellow-300"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Ask
                    </button>
                  )}

                  {/* Desktop/tablet: always-visible inline search */}
                  <form
                    onSubmit={onSearch}
                    role="search"
                    className="hidden sm:flex items-center rounded-xl bg-white shadow-sm w-64 lg:w-80"
                  >
                    <label htmlFor="oxynews-search-desktop" className="sr-only">Search OxyNews</label>
                  
                    <input
                      id="oxynews-search-desktop"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Topics, Companies or keywords …"
                      autoComplete="off"
                      className="min-h-9 min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink-faint"
                    />
                    <button
                      type="submit"
                      disabled={!query.trim()}
                      aria-label="Search"
                      className="focus-ring m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-royal text-white transition hover:bg-plum disabled:opacity-40"
                    >
                      <SearchIcon size={13} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </form>

                  {/* Mobile only: search icon toggle */}
                  <button
                    type="button"
                    onClick={toggleSearch}
                    aria-label={searchOpen ? "Close search" : "Open search"}
                    aria-expanded={searchOpen}
                    className="sm:hidden focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper transition hover:bg-white/15"
                  >
                    {searchOpen
                      ? <XIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                      : <SearchIcon size={18} strokeWidth={2.5} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* ── Mobile expandable search (sm and below only) ── */}
              <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                  searchOpen ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <form
                  onSubmit={onSearch}
                  role="search"
                  className="flex w-full items-center rounded-xl bg-white shadow-sm"
                >
                  <label htmlFor="oxynews-search-mobile" className="sr-only">Search OxyNews</label>
                 
                  <input
                    ref={searchInputRef}
                    id="oxynews-search-mobile"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search topics, companies or keywords…"
                    autoComplete="off"
                    className="min-h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-faint"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="focus-ring m-1 shrink-0 rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
          </header>


          

          <NewsTicker />
          <ResourceNavBar />
        </div>

        {/* ── Page content — offset by header height ── */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-6 mt-[160px]">
          {articleMatch?.params.id && chatOpen ? (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr,380px]">
              <div className="lg:col-start-1">
                <Outlet />
              </div>
              {/* Desktop sidebar chat */}
              <div className="hidden lg:block lg:col-start-2 lg:sticky lg:top-24">
                <ArticleChatWidget
                  paperclipId={articleMatch.params.id}
                  open={chatOpen}
                  onClose={() => setChatOpen(false)}
                />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        {/* ── Mobile chat drawer ── */}
        {articleMatch?.params.id && chatOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setChatOpen(false)}
            />
            <div
              className="relative flex flex-col rounded-t-2xl overflow-hidden shadow-2xl"
              style={{ maxHeight: "85dvh" }}
            >
              <ArticleChatWidget
                paperclipId={articleMatch.params.id}
                open={chatOpen}
                onClose={() => setChatOpen(false)}
              />
            </div>
          </div>
        )}

        <footer className="mt-10 bg-plum text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">

            {/* Top section */}
            <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">

              {/* Brand */}
              <div className="flex flex-col gap-3">
                <Link to="/oxynews" className="flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1">
                    <img src={Logo} alt="OxyNews" className="h-full w-full object-contain" />
                  </span>
                  <span className="font-display text-xl font-bold">
                    Oxy<span className="text-gold">News</span>
                  </span>
                </Link>
                <p className="text-xs text-paper/60 leading-relaxed">
                  AI-powered news analysis by RadhAI. Stay ahead with opportunity signals, stakeholder insights and OxyGroup recommendations.
                </p>
              </div>

              {/* Navigate */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">Navigate</h3>
                <ul className="flex flex-col gap-2">
                  {[
                    { to: "/oxynews", label: "Home" },
                    { to: "/explore", label: "Explore News" },
                    { to: "/radhai-news", label: "RadhAI News" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-paper/70 hover:text-gold transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platforms */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">Our Platforms</h3>
                <ul className="flex flex-col gap-2">
                  {[
                    { href: "https://www.askoxy.ai/", label: "ASKOXY.AI" },
                    { href: "https://oxyloans.com/", label: "OXYLOANS" },
                    { href: "https://www.oxybricks.world/", label: "OXYBRICKS" },
                    { href: "https://www.oxygold.ai/", label: "OXYGOLD.AI" },
                  ].map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-paper/70 hover:text-gold transition-colors"
                      >
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Powered by */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">Powered by</h3>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-paper/70">
                    <span className="text-paper font-semibold">Radh</span><span className="text-gold font-semibold">AI</span> — AI News Analysis
                  </span>
                  <span className="text-sm text-paper/70">Newsdata.io</span>
                  <span className="text-sm text-paper/70">OxyGroup — Recommendations</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-paper/10" />

            {/* Bottom bar */}
            <div className="flex flex-col gap-2 py-4 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} OxyNews by AskOxy.AI. All rights reserved.</span>
              <span>AI-analysed news. Not financial advice.</span>
            </div>
          </div>
        </footer>
      </div>
    </ChatContext.Provider>
  );
}
