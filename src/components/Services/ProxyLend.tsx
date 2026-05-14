import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Scale,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import askOxyLogo from "../../assets/img/askoxylogonew.png";
import oxyLoansLogo from "../../assets/img/image1.png";

const platformUrl = "https://oxyloans.com/";
const platformRedirectPath = "/platform-redirect?target=oxyloans";

const ProxyLendPage: React.FC = () => {
  const navigate = useNavigate();
  const heroImage = "https://i.ibb.co/whXKs1Jb/w3.png";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const goToLoginFirst = () => {
    const currentPage = window.location.pathname + window.location.search;

    const accessToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken");

    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="));

    const isLoggedIn = Boolean(accessToken || cookieToken);

    if (isLoggedIn) {
      window.location.href = platformUrl;
      return;
    }

    sessionStorage.setItem("redirectPath", platformRedirectPath);
    sessionStorage.setItem("platformRedirectUrl", platformUrl);
    localStorage.setItem("platformRedirectUrl", platformUrl);
    sessionStorage.setItem("loginCloseReturnPath", currentPage);

    navigate("/whatsapplogin", {
      state: {
        from: platformRedirectPath,
        closeReturnPath: currentPage,
      },
    });
  };

  const features = [
    {
      icon: MapPin,
      title: "Radius Lending",
      text: "Lend to borrowers located within your selected nearby radius.",
      bg: "from-[#f0e7ff] to-white",
    },
    {
      icon: Users,
      title: "Reference Trust",
      text: "Borrower limits can grow through references and repayment discipline.",
      bg: "from-[#fff0bd] to-white",
    },
    {
      icon: ShieldCheck,
      title: "Recovery Support",
      text: "Recovery agent and legal support can be initiated when repayment delays.",
      bg: "from-[#efe7ff] to-white",
    },
  ];

  const roadmap = [
    {
      title: "Borrower Applies",
      text: "Borrower submits profile, location, repayment details, and references.",
    },
    {
      title: "References Verified",
      text: "ProxyLend checks borrower details and trust signals.",
    },
    {
      title: "Lender Reviews",
      text: "Nearby lenders review borrower profiles within selected radius.",
    },
    {
      title: "Lending Decision",
      text: "Lender decides the amount and accepts the direct lending risk.",
    },
    {
      title: "Repay or Recover",
      text: "Repayments are tracked. If delayed, support can begin.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#fbf8ff] text-[#121212]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-28 top-0 h-[360px] w-[360px] rounded-full bg-[#7b4dff]/14 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[#ffd54f]/22 blur-3xl"
        />
      </div>

      <header className="fixed left-0 top-0 z-[999] w-full border-b border-purple-100/80 bg-white/90 shadow-[0_4px_24px_rgba(123,77,255,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={askOxyLogo}
              alt="AskOxy Logo"
              className="h-10 w-auto cursor-pointer object-contain sm:h-8 md:h-10"
              onClick={() => navigate("/")}
            />

            <button type="button" onClick={goToLoginFirst}>
              <img
                src={oxyLoansLogo}
                alt="OxyLoans Logo"
                className="h-24 w-auto object-contain sm:h-20"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={goToLoginFirst}
            className="rounded-full bg-[#7b4dff] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(123,77,255,0.28)] transition hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="pt-[72px] sm:pt-[80px]">
        <section className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto grid max-w-7xl items-center gap-7 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#efe7ff] px-4 py-2 text-xs font-extrabold text-[#7b4dff] sm:text-sm">
                <BadgeCheck size={16} />
                Proximity-Based Lending
              </div>

              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Proxy<span className="text-[#7b4dff]">Lend</span>
              </h1>

              <h2 className="mt-3 max-w-2xl text-2xl font-black leading-snug sm:text-3xl">
                Lend to nearby borrowers with reference-based trust.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                ProxyLend helps lenders connect with borrowers inside their
                selected radius. Borrowers can improve limits through trusted
                references and repayment discipline.
              </p>

              <button
                onClick={goToLoginFirst}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#7b4dff] px-7 py-3 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(123,77,255,0.34)] transition hover:-translate-y-1"
              >
                Get Started
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="relative flex justify-center"
            >
              <motion.img
                src={heroImage}
                alt="ProxyLend"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 w-full max-w-[430px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.13)] lg:max-w-[500px]"
              />
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-black sm:text-5xl">
                Smart lending essentials
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
                Simple features for nearby lending, borrower trust, and recovery
                support.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.55 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`relative overflow-hidden rounded-[34px] bg-gradient-to-br ${item.bg} p-8 shadow-[0_22px_60px_rgba(123,77,255,0.10)]`}
                  >
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/50" />
                    <div className="relative z-10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[#7b4dff] shadow-lg">
                        <Icon size={28} />
                      </div>
                      <h3 className="mt-8 text-2xl font-black">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-black sm:text-4xl">
                How ProxyLend works
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                A simple roadmap from borrower application to repayment or
                recovery.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              {roadmap.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative rounded-[24px] bg-white/85 p-5 shadow-[0_16px_40px_rgba(123,77,255,0.10)] backdrop-blur-xl"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#7b4dff] text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[36px] bg-gradient-to-br from-[#efe7ff] via-white to-[#fff3c4] p-8 shadow-[0_24px_70px_rgba(123,77,255,0.10)] lg:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  Recovery support when repayment is delayed.
                </h2>
                <p className="mt-5 text-sm leading-8 text-gray-700 sm:text-base">
                  If the borrower does not repay, recovery agents can be assigned
                  based on lender request. Cheque bounce process, legal notices,
                  and repayment enforcement support can also be initiated.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    icon: FileCheck,
                    text: "Borrower records and agreement support",
                  },
                  {
                    icon: Scale,
                    text: "Cheque bounce and legal notice support",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Recovery agent coordination if required",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-xl"
                    >
                      <Icon className="text-[#7b4dff]" size={24} />
                      <p className="text-sm font-semibold text-gray-700">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 pt-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[30px] border border-[#ffd54f]/50 bg-[#fff9dc] p-6 shadow-[0_18px_50px_rgba(245,183,0,0.14)] lg:p-8">
            <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd54f] text-black shadow-md">
                <AlertTriangle size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  Clear Lending Responsibility
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-700 sm:text-base">
                  ProxyLend is a support platform and does not guarantee
                  repayment to lenders. The lending decision, amount, and risk
                  remain fully with the direct lender.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    "No repayment guarantee",
                    "Recovery cost paid by lender",
                    "Legal support available if required",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/75 p-4 text-sm font-bold text-gray-800 shadow-sm"
                    >
                      <CheckCircle2 className="mb-2 text-[#7b4dff]" size={20} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProxyLendPage;