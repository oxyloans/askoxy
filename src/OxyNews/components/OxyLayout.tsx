import { useState } from "react";
import { Link, NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";
import NewsTicker from "./NewsTicker";
import ResourceNavBar from "./ResourceNavBar";
import ArticleChatWidget from "./ArticleChatWidget";
import { ChatContext } from "./ChatContext";

const primaryLinks = [
  { to: "/oxynews", label: "Home", end: true },
  { to: "/explore", label: "Explore News", end: false },
  { to: "/radhai-news", label: "RadhAI News", end: false },
];

export default function OxyLayout() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const articleMatch = useMatch("/article/:id");
  const [chatOpen, setChatOpen] = useState(false);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/explore?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <ChatContext.Provider value={{ chatOpen, openChat: () => setChatOpen(true), closeChat: () => setChatOpen(false) }}>
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-30">
        <header className="border-b border-gold/25 bg-plum text-paper shadow-md">
          <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-3">

            {/* ── Mobile header: logo left, back button right ── */}
            <div className="flex items-center justify-between gap-2 lg:hidden">
              <Link
                to="/oxynews"
                aria-label="OxyNews home"
                className="focus-ring flex min-w-0 items-center gap-2 rounded-lg"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
                  <img src={Logo} alt="AskOxy" className="h-full w-full object-contain" />
                </span>
                <span className="truncate font-display text-xl font-semibold leading-none">
                  Oxy<span className="text-gold">News</span>
                </span>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                {articleMatch?.params.id && (
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="focus-ring inline-flex items-center gap-1 rounded-full border border-paper/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-paper transition hover:bg-white/20"
                  >
                    ← Back
                  </button>
                )}
                {articleMatch?.params.id && (
                  <button
                    type="button"
                    onClick={() => setChatOpen((o) => !o)}
                    aria-expanded={chatOpen}
                    className="focus-ring inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-plum transition hover:bg-yellow-300"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Ask
                  </button>
                )}
              </div>
            </div>

            {/* ── Mobile search row ── */}
            <form
              onSubmit={onSearch}
              role="search"
              className="mt-2 flex w-full items-center rounded-xl bg-white p-1 shadow-sm lg:hidden"
            >
              <label htmlFor="oxynews-search-mobile" className="sr-only">Search OxyNews</label>
              <input
                id="oxynews-search-mobile"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, companies…"
                autoComplete="off"
                className="min-h-9 min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                aria-label="Search"
                className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-royal text-white transition hover:bg-plum disabled:opacity-45"
              >
                <SearchIcon size={17} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </form>

            {/* ── Desktop: logo | nav | search ── */}
            <div className="hidden lg:grid items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_minmax(280px,360px)]">
              <Link
                to="/oxynews"
                aria-label="OxyNews home"
                className="focus-ring flex min-w-0 items-center gap-2 rounded-lg lg:justify-self-start"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
                  <img src={Logo} alt="AskOxy" className="h-full w-full object-contain" />
                </span>
                <span className="truncate font-display text-3xl font-semibold leading-none">
                  Oxy<span className="text-gold">News</span>
                </span>
              </Link>

              <nav
                aria-label="OxyNews primary navigation"
                className="flex min-w-0 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center"
              >
                {articleMatch?.params.id && (
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="focus-ring inline-flex min-h-10 shrink-0 items-center rounded-full border border-paper/25 px-4 text-sm font-semibold text-paper transition hover:bg-white/10"
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
                      `focus-ring inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
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
                    onClick={() => setChatOpen((open) => !open)}
                    aria-expanded={chatOpen}
                    className="focus-ring inline-flex min-h-10 shrink-0 items-center rounded-full bg-gold px-4 text-sm font-semibold text-plum transition-colors hover:bg-yellow-300"
                  >
                    Ask article
                  </button>
                )}
              </nav>

              <form
                onSubmit={onSearch}
                role="search"
                className="flex w-full items-center rounded-xl bg-white p-1 shadow-sm lg:justify-self-end"
              >
                <label htmlFor="oxynews-search" className="sr-only">Search OxyNews</label>
                <input
                  id="oxynews-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Topics, companies or keywords"
                  autoComplete="off"
                  className="min-h-10 min-w-0 flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-ink-faint sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  aria-label="Search OxyNews"
                  className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <SearchIcon size={19} strokeWidth={2.25} aria-hidden="true" />
                </button>
              </form>
            </div>

          </div>
        </header>

        <NewsTicker />
        <ResourceNavBar />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-6">
        {articleMatch?.params.id && chatOpen ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr,380px]">
            <div className="lg:col-start-1"><Outlet /></div>
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

      {/* Mobile chat drawer — slides up from bottom */}
      {articleMatch?.params.id && chatOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setChatOpen(false)}
          />
          <div className="relative flex flex-col rounded-t-2xl overflow-hidden shadow-2xl"
            style={{ maxHeight: "85dvh" }}>
            <ArticleChatWidget
              paperclipId={articleMatch.params.id}
              open={chatOpen}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </div>
      )}

      <footer className="mt-10 border-t border-ink/10 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>OxyNews by AskOxy.AI</span>
          <Link to="/oxynews">Back to home
          </Link>
        </div>
      </footer>
    </div>
    </ChatContext.Provider>
  );
}
