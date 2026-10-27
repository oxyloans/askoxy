import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  UserRound,
  ImageOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import AskOxyLogo from "../assets/img/askoxylogonew.png";
import O5 from "../assets/img/cashewoffer1.png";
import O6 from "../assets/img/35kg1.png";
import CB from "../assets/img/cashback offer png.png";
import Cashew from "../assets/img/rakhi1.png";
import Riceoffers from "../assets/img/rice offers.png";
import festive from "../assets/img/silver0.png";

const LOGIN_URL = "/whatsapplogin";

const visitPlatforms = [
  {
    name: "OXY News",
    image: "https://i.ibb.co/jPSbgSTk/u1.png",
    href: "https://www.askoxy.ai/oxynews",
  },
  {
    name: "Our Journeys",
    image: "https://i.ibb.co/x8fmy8NC/u2.png",
    href: "https://www.askoxy.ai/alljourneys",
  },
  {
    name: "Our Blogs",
    image: "https://i.ibb.co/Qvwnfj5z/u3.png",
    href: "https://www.askoxy.ai/myblogs",
  },
  {
    name: "Our Jobs",
    image: "https://i.ibb.co/MkhLvLzY/u4.png",
    href: "https://www.askoxy.ai/viewjobdetails/default/ALL",
  },
];

const groupCompanies = [
  {
    name: "OXYGLOBAL.TECH",
    image: "https://i.ibb.co/s4CW2mg/l1.png",
    href: "https://www.oxyglobal.tech/",
  },
  {
    name: "OXYLOANS",
    image: "https://i.ibb.co/B5xsVChY/l2.png",
    href: "https://oxyloans.com/",
  },
  {
    name: "OXYBRICKS.WORLD",
    image: "https://i.ibb.co/k2snG0YW/l3.png",
    href: "https://oxybricks.world/",
  },
  {
    name: "OXYGOLD.AI",
    image: "https://i.ibb.co/gb9bNnTZ/oxygoldlogo-bk.png",
    href: "https://www.oxygold.ai/",
  },
  {
    name: "OXYCHAIN",
    image: "https://i.ibb.co/B2NcQ7Nj/l5.png",
    href: "http://bmv.money:2750/",
  },
  {
    name: "OXYFINSERV",
    image: "https://i.ibb.co/Swx6RWXM/oxyfinservlogo-Cpr9-A3-NT.png",
    href: "https://www.oxyfinserv.com/",
  },
  {
    name: "TVRK",
    image: "https://i.ibb.co/5JzN8yL/logo-tvrk.png",
    href: "https://tvradhakrishna.com/",
  },
];

const ecosystemPlatforms = [
  {
    name: "OxyLoans",
    category: "Lending",
    description: "RBI-registered NBFC-P2P platform",
    href: "https://oxyloans.com/",
  },
  {
    name: "ASKOXY.AI",
    category: "AI Platform",
    description: "AI-powered digital ecosystem",
    href: "https://www.askoxy.ai/",
  },
  {
    name: "RBI Master Directions AI Store",
    category: "RegTech",
    description: "RBI regulatory intelligence",
    href: "https://www.askoxy.ai/ai-store/rbi-master-directions-ai-store",
  },
  {
    name: "Insurance LLM",
    category: "Insurance AI",
    description: "Insurance knowledge and insights",
    href: "https://www.askoxy.ai/genoxy/chat?a=insurance-llm",
  },
  {
    name: "OXYBFSAI",
    category: "BFSI AI",
    description: "AI for financial services",
    href: "https://www.askoxy.ai/oxybfsai",
  },
  {
    name: "OXYBFSAI Use Case",
    category: "AI Solutions",
    description: "Explore a practical BFSI AI use case",
    href: "https://vibecoding-finvibe.vercel.app/",
  },
  {
    name: "OXYFINSERV",
    category: "Financial Services",
    description: "Financial services ecosystem",
    href: "https://www.oxyfinserv.com/",
  },
  {
    name: "Bharat Sovereign AI",
    category: "Sovereign AI",
    description: "Building AI for India's BFSI sector",
    href: "https://www.askoxy.ai/sovereign-ai",
  },
];

type HeaderImage = {
  id: string;
  src: string;
  alt: string;
  path: string;
  selectedCategory?: string;
};

// Banner images and destinations follow the active promotional carousel.
// Update this one list whenever your production promotions change.
const headerImages: HeaderImage[] = [
  {
    id: "Buy Silver Coins",
    src: festive,
    alt: "Buy Silver Coins",
    path: "/main/dashboard/products?type=SILVER",
  },
  {
    id: "Cashback1",
    src: CB,
    alt: "Cashback Offer",
    path: "/main/dashboard/products",
    selectedCategory: "All Items",
  },
  {
    id: "Cashew Offer",
    src: Cashew,
    alt: "Cashew Offer",
    path: "/main/dashboard/products?type=AIBOOK",
  },
  {
    id: "Rice Offer",
    src: Riceoffers,
    alt: "Rice Offer",
    path: "/main/dashboard/products?type=GOLD",
  },
  {
    id: "10kg Offer",
    src: O5,
    alt: "10kg Offer",
    path: "/main/dashboard/products?type=RICE&weight=10.0",
  },
  {
    id: "26kg Offer",
    src: O6,
    alt: "26kg Offer",
    path: "/main/dashboard/products?type=RICE&weight=26.0",
  },
];

const ExternalLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
}> = ({ href, children, className = "", label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={className}
  >
    {children}
  </a>
);

const MeyaporeMetro: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(
      (key) => {
        const value = params.get(key);
        if (value) utm[key] = value;
      },
    );
    if (Object.keys(utm).length)
      sessionStorage.setItem("utmData", JSON.stringify(utm));
  }, []);

  const saveRedirect = (path: string) => {
    ["redirectPath", "returnUrl", "next"].forEach((key) => {
      localStorage.setItem(key, path);
      sessionStorage.setItem(key, path);
    });
  };

  const openPromotion = (banner: HeaderImage) => {
    if (banner.selectedCategory) {
      navigate(banner.path, {
        state: { selectedCategory: banner.selectedCategory },
      });
    } else {
      navigate(banner.path);
    }
  };

  const signIn = () => {
    const path = "/main/dashboard/products";
    saveRedirect(path);
    window.location.assign(`${LOGIN_URL}?redirect=${encodeURIComponent(path)}`);
  };

  const markImageFailed = (key: string) =>
    setFailedImages((current) => ({ ...current, [key]: true }));

  return (
    <div className="min-h-screen bg-[#f7f8ff] text-slate-900 antialiased">
      <style>{`
        @keyframes oxy-shine { 0% { transform: translateX(-130%) skewX(-16deg); } 100% { transform: translateX(280%) skewX(-16deg); } }
        @keyframes oxy-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .oxy-gloss { position: relative; isolation: isolate; overflow: hidden; }
        .oxy-gloss::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(135deg,rgba(255,255,255,.72),rgba(255,255,255,0) 45%,rgba(255,255,255,.14)); z-index: 0; }
        .oxy-gloss > * { position: relative; z-index: 1; }
        .oxy-gloss:hover::after { content: ""; position: absolute; inset: 0; width: 55%; background: linear-gradient(90deg,transparent,rgba(255,255,255,.40),transparent); animation: oxy-shine .9s ease-out; pointer-events: none; z-index: 2; }
        .oxy-gradient-text { background: linear-gradient(110deg,#1e40af 0%,#633bc7 60%,#9b43c4 100%); background-clip:text; -webkit-background-clip:text; color:transparent; }
        .oxy-section { scroll-margin-top: 105px; }
        @keyframes oxy-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .oxy-track { display: flex; width: max-content; animation: oxy-scroll 52s linear infinite; }
        .oxy-marquee:hover .oxy-track, .oxy-marquee:focus-within .oxy-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .oxy-track { animation: none; } .oxy-marquee { overflow-x: auto !important; } .oxy-gloss:hover::after { animation: none; display: none; } }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-[0_8px_30px_rgba(54,54,120,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <a
            href="https://www.askoxy.ai/"
            aria-label="ASKOXY.AI homepage"
            className="flex shrink-0 items-center"
          >
            <img
              src={AskOxyLogo}
              alt="ASKOXY.AI"
              className="h-9 w-auto max-w-[150px] object-contain sm:h-11"
            />
          </a>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            <a
              href="#platforms"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-700"
            >
              Platforms
            </a>
            <a
              href="#companies"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-700"
            >
              Group Companies
            </a>
            <a
              href="#ecosystem"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-700"
            >
              Ecosystem
            </a>
            <a
              href="#rice-offers"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-700"
            >
              Current Offers
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={signIn}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3257d8] to-[#7444d4] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_7px_17px_rgba(82,65,195,.20)] transition hover:shadow-[0_10px_25px_rgba(82,65,195,.33)] sm:px-5"
            >
              <UserRound size={16} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-slate-100 bg-white px-5 py-3 lg:hidden"
          >
            {[
              ["Platforms", "#platforms"],
              ["Group Companies", "#companies"],
              ["Ecosystem", "#ecosystem"],
              ["Current Offers", "#rice-offers"],
            ].map(([name, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {name}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-48 top-[-130px] h-[470px] w-[470px] rounded-full bg-indigo-200/35 blur-[100px]" />
          <div className="absolute -right-48 top-[350px] h-[510px] w-[510px] rounded-full bg-violet-200/35 blur-[110px]" />
          <div className="absolute left-1/4 top-[1120px] h-[360px] w-[360px] rounded-full bg-sky-100/60 blur-[100px]" />
        </div>
        <section id="platforms" className="oxy-section">
          <h1 className="oxy-gradient-text mb-5 text-[22px] font-extrabold tracking-tight sm:mb-7 sm:text-[30px]">
            Visit Our Platforms
          </h1>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {visitPlatforms.map((platform) => (
              <ExternalLink
                key={platform.name}
                href={platform.href}
                label={`Visit ${platform.name}`}
                className="oxy-gloss group rounded-[20px] bg-gradient-to-br from-white via-white to-indigo-50/70 p-3 shadow-[0_10px_30px_rgba(69,62,156,0.075)] ring-1 ring-white/90 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(80,59,169,0.16)] sm:p-4"
              >
                <div className="flex aspect-[1.4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f4f6ff] via-white to-[#edeaff]">
                  {failedImages[platform.name] ? (
                    <ImageOff className="text-slate-300" size={30} />
                  ) : (
                    <img
                      src={platform.image}
                      alt=""
                      loading="lazy"
                      onError={() => markImageFailed(platform.name)}
                      className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 px-1 pb-1">
                  <h2 className="text-[13px] font-bold text-slate-800 sm:text-[16px]">
                    {platform.name}
                  </h2>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:text-indigo-600"
                  />
                </div>
              </ExternalLink>
            ))}
          </div>
        </section>

        <section id="companies" className="scroll-mt-24 pt-11 sm:pt-16">
          <h2 className="oxy-gradient-text mb-5 text-[22px] font-extrabold tracking-tight sm:mb-7 sm:text-[30px]">
            OXY Group Companies
          </h2>
          <div
            className="oxy-marquee overflow-hidden py-3 sm:py-4"
            style={{
              maskImage:
                "linear-gradient(to right,transparent,black 5%,black 95%,transparent)",
              WebkitMaskImage:
                "linear-gradient(to right,transparent,black 5%,black 95%,transparent)",
            }}
          >
            <div className="oxy-track">
              {[...groupCompanies, ...groupCompanies].map((company, index) => (
                <ExternalLink
                  key={`${company.name}-${index}`}
                  href={company.href}
                  label={`Visit ${company.name}`}
                  className="mx-5 flex h-20 w-32 shrink-0 items-center justify-center transition duration-300 hover:scale-105 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:mx-8 sm:h-24 sm:w-44 lg:mx-10 lg:h-28 lg:w-48"
                >
                  <img
                    src={company.image}
                    alt={company.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </ExternalLink>
              ))}
            </div>
          </div>
        </section>

        <section id="ecosystem" className="scroll-mt-24 pt-11 sm:pt-16">
          <h2 className="oxy-gradient-text mb-5 text-[22px] font-extrabold tracking-tight sm:mb-7 sm:text-[30px]">
            Our Ecosystem
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {ecosystemPlatforms.map((platform) => (
              <ExternalLink
                key={platform.name}
                href={platform.href}
                label={`Visit ${platform.name}`}
                className="oxy-gloss group flex min-h-[140px] flex-col justify-between gap-3 rounded-[20px] bg-gradient-to-br from-white via-white to-[#f1efff] p-5 shadow-[0_10px_26px_rgba(65,62,145,0.07)] ring-1 ring-white/90 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(82,65,175,0.15)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex self-start rounded-full bg-gradient-to-r from-indigo-50 to-violet-100/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6247c6]">
                    {platform.category}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-slate-400 transition group-hover:text-indigo-600"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-snug">
                    {platform.name}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {platform.description}
                  </p>
                </div>
              </ExternalLink>
            ))}
          </div>
        </section>

        <section id="rice-offers" className="scroll-mt-24 pt-10 sm:pt-14">
          <h2 className="oxy-gradient-text mb-5 text-[22px] font-extrabold tracking-tight sm:mb-7 sm:text-[30px]">
            Explore Our Latest Offers
          </h2>

          {/* Image-only promotional banners. No card backgrounds, gradients,
              labels, borders, shadows, or extra CTA elements. */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-8">
            {headerImages.map((banner) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => openPromotion(banner)}
                aria-label={`Explore ${banner.alt}`}
                className="group block w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
              >
                {failedImages[`banner-${banner.id}`] ? (
                  <div className="flex aspect-[8/5] w-full items-center justify-center text-slate-400">
                    <ImageOff size={32} aria-hidden="true" />
                    <span className="ml-2 text-sm">Image unavailable</span>
                  </div>
                ) : (
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    loading="lazy"
                    decoding="async"
                    onError={() => markImageFailed(`banner-${banner.id}`)}
                    className="block h-auto w-full object-contain transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.015]"
                  />
                )}
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MeyaporeMetro;