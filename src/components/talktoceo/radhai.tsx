import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Cpu,
  Landmark,
  TrendingUp,
  Coins,
  Mic,
  Mail,
  MessageCircle,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Sparkles,
  Users,
  BrainCircuit,
  Bot,
} from "lucide-react";
import { SiX } from "react-icons/si";

import RADHAI from "../../assets/img/radhai.png";
import TALKTOCEOLOGO from "../../assets/img/talktoceo.png";
import ASKOXYLOGO from "../../assets/img/askoxylogonew.png";
import ASKOXYLOGO1 from "../../assets/img/walkinwhite.png";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd7BMOmvNIfXgpnefXGoGeqJuLp1hege82srbNmQ9E3e-Lkjg/viewform";

const RadhAIPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
    const LOGIN_URL = "/whatsapplogin";
 const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/viewjobdetails/default/ASKOXY_AI";
      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // After returning from WhatsApp login, auto-redirect to /talktoceo
  useEffect(() => {
    const redirectPath = sessionStorage.getItem("redirectPath");
    if (redirectPath !== "/talktoceo") return;

    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    const userId =
      sessionStorage.getItem("userId") ||
      localStorage.getItem("userId");

    if (!token || !userId || userId === "guest-user") return;

    sessionStorage.removeItem("redirectPath");

    loadUserProfile().then((userName) => {
      navigate("/talktoceo", {
        replace: true,
        state: {
          userName:
            userName ||
            sessionStorage.getItem("radhName") ||
            sessionStorage.getItem("userName") ||
            localStorage.getItem("radhName") ||
            null,
        },
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async (): Promise<string | null> => {
    try {
      const token =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!token) return null;

      const response = await fetch("https://meta.oxyloans.com/api/user-service/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (data.userId) {
        sessionStorage.setItem("userId", data.userId);
        localStorage.setItem("userId", data.userId);
        if (!sessionStorage.getItem("accessToken") && token) {
          sessionStorage.setItem("accessToken", token);
          localStorage.setItem("accessToken", token);
        }
      }

      const fullName =
        data.name ||
        `${data.firstName || ""} ${data.lastName || ""}`.trim();

      sessionStorage.setItem("mobileNumber", data.mobileNumber || "");
      sessionStorage.setItem("radhEmail", data.email || "");
      sessionStorage.setItem("radhFirstName", data.firstName || "");
      sessionStorage.setItem("radhLastName", data.lastName || "");
      sessionStorage.setItem("radhName", fullName);
      sessionStorage.setItem("userName", fullName);
      sessionStorage.setItem("primaryType", data.primaryType || "");
      sessionStorage.setItem("radhAIAdminLogin", "false");
      localStorage.setItem("radhName", fullName);
      localStorage.setItem("userName", fullName);

      return fullName || null;
    } catch (e) {
      console.log("Profile API Error :", e);
      return null;
    }
  };

  const handleTalkToCEO = async () => {
    setIsLoading(true);

    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    const userId =
      sessionStorage.getItem("userId") ||
      localStorage.getItem("userId");

    if (!token || !userId || userId === "guest-user") {
      sessionStorage.setItem("redirectPath", "/talktoceo");
      setIsLoading(false);
      navigate("/whatsapplogin");
      return;
    }

    const userName = await loadUserProfile();

    setIsLoading(false);
    navigate("/talktoceo", {
      state: {
        userName:
          userName ||
          sessionStorage.getItem("radhName") ||
          sessionStorage.getItem("userName") ||
          localStorage.getItem("radhName") ||
          null,
      },
    });
  };

  const handleWriteToUs = () => {
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };

  const solutions = [
    { title: "Jobs", icon: Briefcase },
    { title: "AI", icon: Cpu },
    { title: "Loans", icon: Landmark },
    { title: "Investments", icon: TrendingUp },
    { title: "Gold", icon: Coins },
  ];

  const stats = [
    { icon: Users, count: "100+", label: "Employees" },
    { icon: BrainCircuit, count: "100+", label: "LLMs" },
    { icon: Bot, count: "1000+", label: "AI Agents" },
  ];

  const groupCompanies = [
    { logo: ASKOXYLOGO, name: "ASKOXY.AI", link: "https://askoxy.ai/" },
    { logo: "https://i.ibb.co/s4CW2mg/l1.png", name: "OXYGLOBAL.TECH", link: "https://www.oxyglobal.tech/" },
    { logo: "https://i.ibb.co/B5xsVChY/l2.png", name: "OXYLOANS", link: "https://oxyloans.com/" },
    { logo: "https://i.ibb.co/k2snG0YW/l3.png", name: "OXYBRICKS.WORLD", link: "https://oxybricks.world/" },
    { logo: "https://i.ibb.co/PGYYDvL9/l4.png", name: "OXYGOLD.AI", link: "https://www.oxygold.ai/" },
    { logo: "https://i.ibb.co/B2NcQ7Nj/l5.png", name: "OXYCHAIN", link: "http://bmv.money:2750/" },
  ];

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/oxyradhakrishna/", icon: Linkedin },
    { name: "Instagram", url: "https://www.instagram.com/tvradhakrishna/", icon: Instagram },
    { name: "Facebook", url: "https://www.facebook.com/thatavarti.venkataradhakrishna/", icon: Facebook },
    { name: "X", url: "https://x.com/RadhakrishnaIND", icon: SiX },
    { name: "YouTube", url: "https://www.youtube.com/@askoxyDOTai", icon: Youtube },
  ];
const handleChatWithCEO = async () => {
    setIsLoading(true);

    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    const userId =
      sessionStorage.getItem("userId") ||
      localStorage.getItem("userId");

    if (!token || !userId || userId === "guest-user") {
      sessionStorage.setItem("redirectPath", "/talktoceo");
      sessionStorage.setItem("redirectInteractionMode", "chat");
      setIsLoading(false);
      navigate("/whatsapplogin");
      return;
    }

    const userName = await loadUserProfile();

    setIsLoading(false);
    navigate("/talktoceo", {
      state: {
        userName:
          userName ||
          sessionStorage.getItem("radhName") ||
          sessionStorage.getItem("userName") ||
          localStorage.getItem("radhName") ||
          null,
        interactionMode: "chat",
      },
    });
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes scanMove {
          0% { transform: translateY(-120%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(650%); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.05); }
        }
        .float-slow { animation: floatSlow 5s ease-in-out infinite; }
        .scan-line { animation: scanMove 4.5s linear infinite; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      <header className="fixed left-0 top-0 z-50 w-full border-b border-cyan-400/10 bg-[#050816]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <img
              onClick={handleSignIn}
              src={ASKOXYLOGO1}
              alt="ASKOXY.AI"
              className="hidden h-9 w-auto cursor-pointer object-contain sm:block sm:h-11"
            />
            <img
              onClick={() => navigate("/radhAI")}
              src={TALKTOCEOLOGO}
              alt="Talk To CEO"
              className="h-9 w-auto cursor-pointer object-contain sm:h-12"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleWriteToUs}
              className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-xs font-black text-lime-300 transition hover:bg-lime-300 hover:text-black sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <Mail size={16} />
              Write to CEO
            </button>
            <button
              onClick={handleChatWithCEO}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/[0.07] px-3 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-black sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <MessageCircle size={17} />
              Chat with CEO
            </button>
            <button
              onClick={handleTalkToCEO}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300 px-3 py-2 text-xs font-black text-black transition hover:scale-[1.03] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <Mic size={17} />
              Talk to CEO
            </button>
          </div>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,245,255,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(132,255,0,0.13),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 pb-14 pt-24 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, x: -45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative order-2 z-10 lg:order-1"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-r from-cyan-400/30 via-violet-500/30 to-lime-300/30 blur-2xl glow-pulse" />

          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[30px] border border-cyan-300/25 bg-white/[0.045] p-4 shadow-[0_0_80px_rgba(0,245,255,0.15)] backdrop-blur-xl sm:min-h-[470px] lg:min-h-[560px]">
            <div className="scan-line pointer-events-none absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" />

            <img
              src={RADHAI}
              alt="radhAI"
              className="float-slow relative z-10 max-h-[270px] w-full object-contain drop-shadow-[0_0_45px_rgba(0,245,255,0.35)] sm:max-h-[450px] lg:max-h-[520px]"
            />

            <div className="absolute left-4 top-4 z-20 rounded-full border border-lime-300/30 bg-black/50 px-3 py-2 text-[10px] font-bold text-lime-300 backdrop-blur-xl sm:px-4 sm:text-xs">
              ● AI Clone of Radhakrishna Thatavarti
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {solutions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-bold text-slate-200 backdrop-blur-xl sm:text-sm"
                >
                  <Icon size={15} className="text-cyan-300" />
                  {item.title}
                </div>
              );
            })}
          </div>

          <div className="mt-7 rounded-[26px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:hidden">
            <p className="text-sm font-bold text-slate-300">
              Radhakrishna Thatavarti is the CEO & Founder of
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {groupCompanies.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[62px] items-center justify-center rounded-2xl bg-white p-2 transition hover:scale-[1.03]"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-[38px] max-w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-1 z-10 text-center lg:order-2 lg:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            <Sparkles size={16} />
            Talk to CEO
          </div>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
            Meet{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              radhAI
            </span>
          </h1>

          <p className="mt-3 text-base font-semibold text-cyan-200 sm:text-lg">
            Clone of Radhakrishna Thatavarti
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
            <button
              onClick={handleTalkToCEO}
              className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-2 py-3 text-[11px] font-black text-black"
            >
              <Mic size={15} />
              Talk to CEO
            </button>
            <button
              onClick={handleChatWithCEO}
              className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-2 py-3 text-[11px] font-black text-cyan-200"
            >
              <MessageCircle size={14} />
              Chat with CEO
            </button>
            <button
              onClick={handleWriteToUs}
              className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-2 py-3 text-[11px] font-black text-cyan-200"
            >
              <Mail size={14} />
              Write to CEO
            </button>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg lg:mx-0">
            <span className="font-semibold text-white">
              CEO AI Clone Built to Solve Problems 24/7
            </span>{" "}
            — radhAI guides users across Jobs, AI, Loans, Investments, and Gold
            with simple AI-powered support.
          </p>

          <div className="mt-7 hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl sm:block sm:p-5">
            <p className="text-sm font-bold text-slate-300">
              Radhakrishna Thatavarti is the CEO & Founder of
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {groupCompanies.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[62px] items-center justify-center rounded-2xl bg-white p-2 transition hover:scale-[1.03]"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-[38px] max-w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 hidden grid-cols-3 gap-3 sm:grid">
            <button
              onClick={handleTalkToCEO}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-4 py-3 font-black text-black transition hover:scale-[1.02]"
            >
              <Mic size={18} />
              Talk to CEO
            </button>
            <button
              onClick={handleChatWithCEO}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-4 py-3 font-black text-cyan-200 transition hover:bg-white/[0.12]"
            >
              <MessageCircle size={18} />
              Chat with CEO
            </button>
            <button
              onClick={handleWriteToUs}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-4 py-3 font-black text-cyan-200 transition hover:bg-white/[0.12]"
            >
              <Mail size={18} />
              Write to CEO
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-300 hover:text-black"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-cyan-300/20 bg-white/[0.045] p-7 text-center shadow-[0_0_70px_rgba(0,245,255,0.12)] backdrop-blur-xl sm:p-10 lg:p-14">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            One AI Clone for Your{" "}
            <span className="text-lime-300">
              Daily Decisions & Opportunities
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
            radhAI connects users with the right guidance, opportunities, and
            actions across jobs, AI, loans, investments, and gold.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6 transition hover:border-lime-300/50"
                >
                  <Icon className="mx-auto mb-3 text-cyan-300" size={34} />
                  <h3 className="text-4xl font-black">{item.count}</h3>
                  <p className="mt-1 text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RadhAIPage;