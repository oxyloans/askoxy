import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Languages,
  Mic,
  ArrowRight,
  Briefcase,
  Cpu,
  Coins,
  Landmark,
  TrendingUp,
  ArrowLeft,
  X,
} from "lucide-react";

import TALKTOCEOLOGO from "../../assets/img/talktoceo.png";

const TalkToCEO: React.FC = () => {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");

useEffect(() => {
  loadUserProfile();
}, []);
 const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
const loadUserProfile = async () => {
  try {
    const currentToken =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");

    if (!currentToken) return;

    // Step 1: get userId from /me
    const meRes = await fetch(
      "https://meta.oxyloans.com/api/user-service/me",
      { headers: { Authorization: `Bearer ${currentToken}` } }
    );
    if (!meRes.ok) return;
    const meData = await meRes.json();
    const userId = meData.userId;

    if (userId) {
      sessionStorage.setItem("userId", userId);
      localStorage.setItem("userId", userId);
    }
    if (meData.mobileNumber) {
      sessionStorage.setItem("mobileNumber", meData.mobileNumber);
      localStorage.setItem("mobileNumber", meData.mobileNumber);
    }
    if (meData.email) {
      sessionStorage.setItem("radhEmail", meData.email);
      localStorage.setItem("radhEmail", meData.email);
    }

    if (!userId) { setShowProfileModal(true); return; }

    // Try name from /me directly first
    const meFirstName = meData.firstName || meData.name || "";
    const meLastName = meData.lastName || "";
    const meFullName = (meFirstName && meLastName ? `${meFirstName} ${meLastName}` : meFirstName).trim();
    const meEmail = meData.email || "";

    // Step 2: fetch customerProfileDetails — ignore if server errors (500)
    let profile: any = {};
    try {
      const profileRes = await fetch(
        `https://meta.oxyloans.com/api/user-service/customerProfileDetails?customerId=${userId}`,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
      if (profileRes.ok) {
        profile = await profileRes.json();
      }
    } catch {
      // customerProfileDetails unavailable — fall back to /me data
    }

    const fn = profile.firstName || profile.userFirstName || profile.name || meFirstName;
    const ln = profile.lastName || profile.userLastName || meLastName;
    const resolvedName = (fn && ln ? `${fn} ${ln}` : fn).trim();
    const resolvedEmail = profile.email || profile.customerEmail || meEmail;

    if (resolvedName) {
      sessionStorage.setItem("userName", resolvedName);
      sessionStorage.setItem("radhName", resolvedName);
      sessionStorage.setItem(`radhName_${userId}`, resolvedName);
      localStorage.setItem("userName", resolvedName);
      localStorage.setItem("radhName", resolvedName);
      localStorage.setItem(`radhName_${userId}`, resolvedName);
      if (resolvedEmail) {
        sessionStorage.setItem("radhEmail", resolvedEmail);
        localStorage.setItem("radhEmail", resolvedEmail);
      }
      setShowProfileModal(false);
    } else {
      // Only show modal if we truly have no name from any source
      setEmail(resolvedEmail || meEmail);
      setShowProfileModal(true);
    }
  } catch (e) {
    console.log(e);
  }
};const saveProfile = async () => {
  if (!firstName.trim()) return;
  try {
    const currentToken =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
    const userId =
      sessionStorage.getItem("userId") ||
      localStorage.getItem("userId");

    if (!currentToken || !userId) {
      console.error("[saveProfile] Missing token or userId");
      return;
    }

    const updateRes = await fetch(
      "https://meta.oxyloans.com/api/user-service/profileUpdate",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          userFirstName: firstName.trim(),
          userLastName: lastName.trim() || null,
          customerEmail: email.trim(),
          customerId: userId,
        }),
      }
    );

    if (!updateRes.ok) {
      console.error("[saveProfile] profileUpdate failed:", updateRes.status);
      // Still save locally and close modal so user isn't stuck
    }

    const savedName = `${firstName.trim()}${lastName.trim() ? " " + lastName.trim() : ""}`;
    const savedEmail = email.trim();

    sessionStorage.setItem("userName", savedName);
    sessionStorage.setItem("radhName", savedName);
    sessionStorage.setItem("radhEmail", savedEmail);
    localStorage.setItem("userName", savedName);
    localStorage.setItem("radhName", savedName);
    localStorage.setItem("radhEmail", savedEmail);
    sessionStorage.setItem(`radhName_${userId}`, savedName);
    localStorage.setItem(`radhName_${userId}`, savedName);

    setShowProfileModal(false);
  } catch (e) {
    console.log(e);
  }
};


  const languages = [
    {
      code: "te",
      title: "Telugu",
      native: "తెలుగు",
      buttonText: "Telugu",
      image: "https://i.ibb.co/JWY1SS2S/t1.png",
    },
    {
      code: "en",
      title: "English",
      native: "English",
      buttonText: "English",
      image: "https://i.ibb.co/cSb2r71r/e1.png",
    },
    {
      code: "hi",
      title: "Hindi",
      native: "हिंदी",
      buttonText: "Hindi",
      image: "https://i.ibb.co/VckNWCXp/h1.png",
    },
  ];

  const services = [
    { name: "Jobs", icon: Briefcase },
    { name: "AI", icon: Cpu },
    { name: "Gold", icon: Coins },
    { name: "Loans", icon: Landmark },
    { name: "Investments", icon: TrendingUp },
  ];

  const handleStart = (languageCode: string) => {
    const userName =
      sessionStorage.getItem("radhName") ||
      sessionStorage.getItem("userName") ||
      localStorage.getItem("radhName") ||
      localStorage.getItem("userName") ||
      null;
    const mobileNumber =
      sessionStorage.getItem("mobileNumber") ||
      localStorage.getItem("mobileNumber") ||
      null;
    const email =
      sessionStorage.getItem("radhEmail") ||
      localStorage.getItem("radhEmail") ||
      null;
    const userId =
      sessionStorage.getItem("userId") ||
      localStorage.getItem("userId") ||
      null;
    navigate("/radhai-connect", {
      state: { languageCode, from: "user", userName, mobileNumber, email, userId },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050816]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-10">
          <button
            onClick={() => navigate("/radhAI")}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.img
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={TALKTOCEOLOGO}
            alt="Talk To CEO"
            className="h-9 w-auto object-contain sm:h-12"
          />

          <div className="w-[60px]" />
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,255,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(132,255,0,0.12),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.05]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-10 lg:pt-20 lg:pb-4">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-300 backdrop-blur-xl sm:px-4 sm:text-xs">
            <Languages size={13} />
            Multi Language CEO AI Clone
          </div>

          <h1 className="text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Talk to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              radhAI
            </span>
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-slate-300 sm:text-sm sm:leading-7">
            Choose Telugu, English or Hindi and speak with radhAI for quick
            guidance on Jobs, AI, Gold, Loans and Investments.
          </p>
        </motion.section>

        <section className="mx-auto mt-5 grid max-w-5xl grid-cols-3 gap-3 sm:mt-8 sm:gap-5 lg:mt-6 lg:gap-6">
          {languages.map((item) => (
            <motion.div
              key={item.code}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.075] p-2 text-center shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[24px] sm:p-4 lg:rounded-[26px] lg:p-5"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:rounded-[18px]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-lime-300/10" />

                <motion.img
                  src={item.image}
                  alt={`${item.title} radhAI`}
                  className="relative z-10 h-20 w-full object-contain p-1 sm:h-36 sm:p-2 lg:h-44 lg:p-3"
                  whileHover={{ scale: 1.03 }}
                />
              </div>

              <h2 className="mt-1.5 text-sm font-black sm:mt-3 sm:text-xl lg:mt-3 lg:text-2xl">
                {item.native}
              </h2>

              <p className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 sm:block lg:text-xs">
                {item.title}
              </p>

              <motion.button
                onClick={() => handleStart(item.code)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-lime-300 to-cyan-300 px-2 py-2 text-[10px] font-black text-black shadow-[0_10px_28px_rgba(0,245,255,0.22)] sm:mt-3 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm lg:mt-4 lg:py-3 lg:text-sm"
              >
                <Mic size={13} />
                {item.buttonText}
                <ArrowRight size={13} className="hidden sm:block" />
              </motion.button>
            </motion.div>
          ))}
        </section>

        <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                whileHover={{ y: -3, scale: 1.04 }}
                className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-bold text-slate-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Icon size={13} className="text-cyan-300" />
                {item.name}
              </motion.div>
            );
          })}
        </div>
      </main>
      {showProfileModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
    <div className="w-[90%] max-w-md rounded-2xl bg-[#101827] p-6">

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
        <button
          onClick={() => setShowProfileModal(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-white/20 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <p className="mb-5 text-center text-sm text-slate-400">
        Please enter your name to continue talking to radhAI
      </p>

      <input
        placeholder="First Name *"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="mb-3 w-full rounded-lg border border-cyan-400/30 bg-[#0d1a2e] p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="mb-3 w-full rounded-lg border border-cyan-400/30 bg-[#0d1a2e] p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-5 w-full rounded-lg border border-cyan-400/30 bg-[#0d1a2e] p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
      />

      <button
        onClick={saveProfile}
        disabled={!firstName.trim()}
        className="w-full rounded-lg bg-gradient-to-r from-lime-300 to-cyan-300 p-3 font-bold text-black disabled:opacity-50"
      >
        Save & Continue
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default TalkToCEO;