import { useState } from "react";
import { Link, NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/askoxylogonew.png";
import NewsTicker from "./NewsTicker";
import ResourceNavBar from "./ResourceNavBar";

const primaryLinks = [
  { to: "/oxynews", label: "Home", end: true },
  { to: "/explore", label: "Explore News", end: false },
  { to: "/radhai-news", label: "RadhAI News", end: false },
];

export default function OxyLayout() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const articleMatch = useMatch("/article/:id");

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/explore?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-30">
        <header className="border-b border-gold/25 bg-plum text-paper shadow-md">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">
            <div className="grid items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_minmax(280px,360px)]">
              {/* Mobile back button — shown opposite the logo on article pages */}
              {articleMatch?.params.id && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="lg:hidden focus-ring inline-flex items-center gap-1.5 rounded-full border border-paper/25 px-3 py-2 text-sm font-semibold text-paper hover:bg-white/10 transition order-last ml-auto"
                >
                  <span aria-hidden="true">←</span> Back
                </button>
              )}

              <Link
                to="/oxynews"
                aria-label="OxyNews home"
                className="focus-ring flex min-w-0 items-center gap-2 rounded-lg lg:justify-self-start"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm sm:h-12 sm:w-12">
                  <img
                    src={Logo}
                    alt="AskOxy"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="truncate font-display text-2xl font-semibold leading-none sm:text-3xl">
                  Oxy<span className="text-gold">News</span>
                </span>
              </Link>

              <nav
                aria-label="OxyNews primary navigation"
                className="hidden lg:flex min-w-0 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center"
              >
                {articleMatch?.params.id && (
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="focus-ring inline-flex min-h-10 shrink-0 items-center rounded-full border border-paper/25 px-4 text-sm font-semibold text-paper transition hover:bg-white/10"
                  >
                    <span aria-hidden="true" className="mr-2">←</span>
                    Back
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

              </nav>
              <form
                onSubmit={onSearch}
                role="search"
                className="flex w-full items-center rounded-xl bg-white p-1 shadow-sm lg:justify-self-end"
              >
                <label htmlFor="oxynews-search" className="sr-only">
                  Search OxyNews
                </label>
                <span className="ml-3 text-ink-faint" aria-hidden="true">
                  Search
                </span>
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
                  className="focus-ring min-h-10 shrink-0 rounded-lg bg-royal px-4 text-sm font-semibold text-white transition hover:bg-plum disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </header>

        <NewsTicker />
        <ResourceNavBar />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-ink/10 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>OxyNews by AskOxy.AI</span>
          <Link to="/oxynews" className="font-semibold text-royal hover:underline">
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
