import { useState } from "react";
import { Link, NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/askoxylogonew.webp";
import NewsTicker from "./NewsTicker";
import ResourceNavBar from "./ResourceNavBar";
import { PhoneCall } from "lucide-react";

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

      <main className="w-full flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>

        <footer className="mt-10 border-t border-ink/10 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span>OxyNews by AskOxy.AI</span>
            <span className="text-gray-300">•</span>
            <a
              href="tel:04041897778"
              className="inline-flex items-center gap-1.5 font-bold text-royal hover:underline"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
              Toll Free: 040 4189 7778 (24/7)
            </a>
          </div>
          <Link to="/oxynews" className="font-semibold text-royal hover:underline">
            Back to home
          </Link>
        </div>
      </footer>
        <div
        className="fixed bottom-4 left-3 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:left-4 md:left-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href="tel:04041897778"
          className="relative group flex items-center rounded-full bg-[#120f28]/95 backdrop-blur-md p-1.5 sm:pl-2 sm:pr-4 sm:py-2 text-white shadow-xl shadow-purple-950/60 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Call Toll Free Helpline 040 4189 7778 (24/7 · 365 Days Available)"
          title="Toll Free Helpline: 040 4189 7778 (24/7 · 365 Days Available)"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fde3cf] text-[#9a3412] shadow-sm shrink-0 group-hover:rotate-12 transition-transform">
            <PhoneCall className="h-4.5 w-4.5" />
          </div>

          <div className="hidden sm:flex flex-col text-left leading-tight sm:ml-2.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-100">
                TOLL FREE HELPLINE
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-cyan-400">
                • 24/7
              </span>
            </div>

            <span className="text-xs sm:text-[14px] font-extrabold text-white tracking-wide">
              040 4189 7778
            </span>
          </div>

          <div className="sm:hidden absolute bottom-full left-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-50">
            <div className="flex flex-col whitespace-nowrap rounded-xl bg-[#120f28]/95 px-3 py-1.5 text-white shadow-xl border border-purple-400/40 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider">
                  TOLL FREE • 24/7
                </span>
              </div>
              <span className="text-xs font-black text-white">040 4189 7778</span>
            </div>
          </div>
        </a>
      </div>

    </div>
  );
}
