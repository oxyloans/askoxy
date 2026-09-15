import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import {
  CalendarDays,
  Clock3,
  HandCoins,
  Handshake,
  Landmark,
  MapPin,
  PlayCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=AI%20Research%20Center%2C%20Entrance%20D%2C%20SE02%20Concourse%2C%20Miyapur%20Metro%20Station%2C%20Hyderabad%2C%20Telangana%20500049";

const VIDEO_URL =
  "https://www.instagram.com/reel/DdSriJETPb8/?stkn=MXVkMWM3ZGs2Z3ZqYQ==";

const OXYFINSERV_LOGO =
  "https://i.ibb.co/Swx6RWXM/oxyfinservlogo-Cpr9-A3-NT.png";

const OXYLOANS_LOGO =
  "https://i.ibb.co/vCf6YChZ/oxyloanslogo.png";

const WALKIN_IMAGE =
  "https://i.ibb.co/wZycB3C1/walkin-miyapur.png";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const Sep19LoansWalkIn: React.FC = () => {
  const openVideo = () => {
    window.open(VIDEO_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Header />

      {/* Keeps hero below your existing fixed Header */}
      <div className="h-[68px] sm:h-[72px] lg:h-[78px]" aria-hidden="true" />

      <main className="min-h-screen overflow-x-hidden bg-[#F2F6FC] text-slate-900">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2C59] via-[#0B4697] to-[#1388C9]">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
              {/* LEFT CONTENT */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.55 }}
                className="text-center lg:text-left"
              >
                <h1 className="mx-auto max-w-3xl text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:mx-0 lg:text-[58px] xl:text-[62px]">
                  Sep 19 Walk-In
                  <span className="mt-1 block text-[#7BE39F]">
                    Loans • DSA • Lenders
                  </span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base lg:mx-0">
                  Meet our team and explore the right opportunity for you.
                </p>

                {/* SIMPLE DATE + TIME */}
                <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-3 lg:mx-0 lg:justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                    <CalendarDays className="h-5 w-5 text-emerald-300" />
                    Sep 19, 2026
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                    <Clock3 className="h-5 w-5 text-emerald-300" />
                    10:00 AM – 6:00 PM
                  </div>
                </div>

                {/* DIRECT LOCATION LINK */}
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mx-auto mt-4 flex max-w-xl items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15 lg:mx-0"
                  aria-label="Open AI Research Center location in Google Maps"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#20B15A] text-white shadow-lg shadow-emerald-950/20">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-white">
                      AI Research Center
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
                      Entrance D, SE02 Concourse, Miyapur Metro Station,
                      Hyderabad, Telangana 500049
                    </p>
                  </div>

                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-blue-200 transition group-hover:text-white" />
                </a>

                <button
                  type="button"
                  onClick={openVideo}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#0B4697] shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <PlayCircle className="h-5 w-5" />
                  Watch Video
                </button>
              </motion.div>

              {/* RIGHT IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.12 }}
                className="relative mx-auto w-full max-w-[560px]"
              >
                <div className="pointer-events-none absolute inset-x-[14%] bottom-0 h-14 rounded-full bg-black/25 blur-3xl" />

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative rounded-[28px] border border-white/20 bg-gradient-to-br from-white/18 to-white/8 p-3 shadow-2xl shadow-blue-950/30 backdrop-blur"
                >
                  <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#D9E9FF] via-[#EEF6FF] to-[#DFF7E8] p-2 sm:p-3">
                    <img
                      src={WALKIN_IMAGE}
                      alt="Walk-In at Miyapur Metro Station"
                      className="mx-auto h-auto max-h-[340px] w-full object-contain sm:max-h-[400px] lg:max-h-[440px]"
                      loading="eager"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* LOAN AMOUNT */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-[#E2ECF8]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0B4697]">
                Loan Requirement
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#10213C] sm:text-3xl lg:text-4xl">
                Choose based on your loan amount
              </h2>
            </motion.div>

            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              <LoanCard
                logo={OXYLOANS_LOGO}
                name="OxyLoans"
                amount="Below ₹10 Lakhs"
                description="For eligible requirements below ₹10 lakhs through the OxyLoans RBI Registered NBFC-P2P platform."
                accent="blue"
                delay={0.05}
              />

              <LoanCard
                logo={OXYFINSERV_LOGO}
                name="OxyFinserv"
                amount="Above ₹10 Lakhs"
                description="For requirements above ₹10 lakhs, connect with OxyFinserv for suitable financial solutions."
                accent="green"
                delay={0.12}
              />
            </div>
          </div>
        </section>

        {/* OPPORTUNITIES */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#182443] via-[#20345C] to-[#27496D]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-200">
                Who can attend?
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                One walk-in. Three opportunities.
              </h2>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <OpportunityCard
                icon={<HandCoins className="h-7 w-7" />}
                title="Loans"
                text="Discuss your loan requirement and understand basic eligibility."
                tone="blue"
                delay={0.05}
              />

              <OpportunityCard
                icon={<Handshake className="h-7 w-7" />}
                title="DSA"
                text="Explore Direct Selling Agent partnership opportunities."
                tone="purple"
                delay={0.12}
              />

              <OpportunityCard
                icon={<Landmark className="h-7 w-7" />}
                title="Lenders"
                text="Understand lender participation and platform information."
                tone="amber"
                delay={0.19}
              />
            </div>
          </div>
        </section>

        {/* TERMS */}
        <section className="bg-gradient-to-b from-[#E7EEF8] to-[#DEE8F4]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-start gap-3 rounded-2xl border border-blue-200/60 bg-gradient-to-r from-[#DCEAFF] to-[#E3F3EA] p-4 sm:p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0B4697]" />

              <p className="text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                Loan approval, amount, interest rate, tenure, processing,
                sanction and disbursal are subject to eligibility,
                documentation, applicable policies and terms & conditions.
                Participation in the walk-in does not guarantee approval or
                disbursal.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

type LoanCardProps = {
  logo: string;
  name: string;
  amount: string;
  description: string;
  accent: "blue" | "green";
  delay?: number;
};

const LoanCard: React.FC<LoanCardProps> = ({
  logo,
  name,
  amount,
  description,
  accent,
  delay = 0,
}) => {
  const styles = {
    blue: {
      card: "border-blue-300/60 bg-gradient-to-br from-[#BED9FF] via-[#D4E7FF] to-[#AECDF7]",
      badge: "bg-[#0B4697] text-white",
      title: "text-[#083B83]",
    },
    green: {
      card: "border-emerald-300/60 bg-gradient-to-br from-[#BCEBCF] via-[#D1F4DF] to-[#ACE0C2]",
      badge: "bg-emerald-700 text-white",
      title: "text-emerald-800",
    },
  };

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -7 }}
      className={`relative overflow-hidden rounded-[24px] border p-5 shadow-[0_22px_45px_-28px_rgba(15,23,42,0.42)] sm:p-6 ${styles[accent].card}`}
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/30 to-transparent" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-2xl bg-white/65 p-2.5 shadow-sm backdrop-blur">
          <img
            src={logo}
            alt={name}
            className="max-h-11 max-w-[150px] object-contain sm:max-w-[175px]"
          />
        </div>

        <span
          className={`rounded-full px-3.5 py-2 text-xs font-extrabold shadow-sm sm:text-sm ${styles[accent].badge}`}
        >
          {amount}
        </span>
      </div>

      <h3 className={`relative mt-5 text-xl font-black ${styles[accent].title}`}>
        {name}
      </h3>

      <p className="relative mt-2 text-sm leading-6 text-slate-700">
        {description}
      </p>
    </motion.article>
  );
};

type OpportunityCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone: "blue" | "purple" | "amber";
  delay?: number;
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  icon,
  title,
  text,
  tone,
  delay = 0,
}) => {
  const tones = {
    blue: {
      card: "border-blue-300/40 bg-gradient-to-br from-[#2F62AB] to-[#1B4279]",
      icon: "bg-[#72AAFF] text-white",
    },
    purple: {
      card: "border-violet-300/40 bg-gradient-to-br from-[#7356C9] to-[#4D358D]",
      icon: "bg-[#AC96FF] text-white",
    },
    amber: {
      card: "border-amber-300/40 bg-gradient-to-br from-[#DDA01D] to-[#A86E05]",
      icon: "bg-[#FFD56F] text-[#684400]",
    },
  };

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -7 }}
      className={`relative overflow-hidden rounded-[22px] border p-5 shadow-[0_22px_45px_-28px_rgba(0,0,0,0.5)] sm:p-6 ${tones[tone].card}`}
    >
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/12 to-transparent" />

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-xl shadow-md ${tones[tone].icon}`}
      >
        {icon}
      </div>

      <h3 className="relative mt-4 text-xl font-black text-white">{title}</h3>

      <p className="relative mt-2 text-sm leading-6 text-white/85">{text}</p>
    </motion.article>
  );
};

export default Sep19LoansWalkIn;
