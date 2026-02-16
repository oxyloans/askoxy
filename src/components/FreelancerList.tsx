import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/askoxylogonew.png";
import Footer from "./Footer";
import BASE_URL from "../Config";
import "./FreelancerList.css";
import { FiArrowRight } from "react-icons/fi";

interface Freelancer {
  id: string;
  email: string;
  userId: string;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  openForFreeLancing: string; // "YES" | "NO"
  amountNegotiable: string; // "YES" | "NO"
  resumeUrl: string;
}

const FreelancerList: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<"ALL" | "YES" | "NO">("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetch(`${BASE_URL}/ai-service/agent/getAllFreeLancers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFreelancers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setFreelancers([]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return freelancers.filter((f) => {
      const matchesQuery = !q || (f.email || "").toLowerCase().includes(q);
      const matchesAvail =
        availability === "ALL"
          ? true
          : (f.openForFreeLancing || "") === availability;
      return matchesQuery && matchesAvail;
    });
  }, [freelancers, query, availability]);

  const handleJoinNow = () => {
    window.location.href = "/main/freelanceform";
  };

  const openResumeInNewTab = (url: string) => {
    if (!url) {
      alert("Resume not available for this freelancer.");
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);

  return (
    <>
      {/* IMPORTANT: overflow-x-hidden prevents horizontal scroll on mobile */}
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Go to home"
            >
              <img
                src={Logo}
                alt="ASKOXY.AI"
                className="h-9 w-auto shrink-0 sm:h-10"
              />
            </button>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleJoinNow}
                className="
      group relative overflow-hidden
      rounded-xl
      bg-gradient-to-r from-slate-900 to-slate-700
      px-4 py-2.5 sm:px-5
      text-sm font-semibold text-white
      shadow-md
      transition-all duration-300
      hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]
      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
    "
              >
                {/* Glow background animation layer */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></span>

                <span className="relative flex items-center gap-2">
                  Join Now
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Find Top Freelancers
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                  Connect with skilled professionals ready to bring your
                  projects to life.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Total: {filtered.length}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Available:{" "}
                    {
                      filtered.filter((f) => f.openForFreeLancing === "YES")
                        .length
                    }
                  </span>
                </div>
              </div>

              {/* Search + Filter */}
              <div className="w-full max-w-xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative min-w-0">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      🔎
                    </span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by email…"
                      className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="ALL">All</option>
                    <option value="YES">Available</option>
                    <option value="NO">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-40 rounded bg-slate-100" />
                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                  <div className="mt-4 h-3 w-56 rounded bg-slate-100" />
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-2xl bg-slate-100" />
                    <div className="h-16 rounded-2xl bg-slate-100" />
                    <div className="h-16 rounded-2xl bg-slate-100" />
                    <div className="h-16 rounded-2xl bg-slate-100" />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-4 w-28 rounded bg-slate-100" />
                    <div className="h-10 w-28 rounded-2xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                😕
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                No freelancers found
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Try changing the search or availability filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setAvailability("ALL");
                }}
                className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((freelancer) => {
                const isAvailable = freelancer.openForFreeLancing === "YES";
                const isNegotiable = freelancer.amountNegotiable === "YES";

                return (
                  <div
                    key={freelancer.id}
                    className="group w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Top */}
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg">
                          👤
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900">
                            Freelancer
                          </div>

                          {/* Important: this prevents overflow */}
                          <div className="freelancer-email text-xs text-slate-600">
                            {freelancer.email}
                          </div>
                        </div>
                      </div>

                      <span
                        className={[
                          "shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
                        ].join(" ")}
                      >
                        {isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-5">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Pricing
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs text-slate-600">Hourly</div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            ₹{fmt(freelancer.perHour)}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs text-slate-600">Daily</div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            ₹{fmt(freelancer.perDay)}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs text-slate-600">Weekly</div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            ₹{fmt(freelancer.perWeek)}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-xs text-slate-600">Monthly</div>
                          <div className="mt-1 text-sm font-bold text-slate-900">
                            ₹{fmt(freelancer.perMonth)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {isNegotiable ? "💬 Negotiable" : "Fixed Rate"}
                        </span>

                        <span className="text-xs text-slate-500">
                          Yearly:{" "}
                          <span className="font-semibold text-slate-700">
                            ₹{fmt(freelancer.perYear)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex w-full min-w-0 items-center gap-2">
                      <a
                        href={freelancer.resumeUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!freelancer.resumeUrl) {
                            e.preventDefault();
                            alert("Resume not available for this freelancer.");
                          }
                        }}
                        className="min-w-0 flex-1 text-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        View Resume
                      </a>

                      <button
                        type="button"
                        className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              {/* Left */}
              <div className="text-sm text-slate-600">
                © {new Date().getFullYear()} ASKOXY.AI — Freelancers Platform
              </div>

              {/* Right Links */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-slate-900 transition"
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("/main/freelanceform")}
                  className="hover:text-slate-900 transition"
                >
                  Join as Freelancer
                </button>

                <button
                  onClick={() => navigate("/contactus")}
                  className="hover:text-slate-900 transition"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FreelancerList;
