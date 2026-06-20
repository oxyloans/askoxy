import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Info,
  Mail,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countryCards } from "../data/internshipData";
import FallbackImg from "../../assets/img/megahero.png";

import hongkongImg from "../../assets/img/hongkong.png";
import japanImg from "../../assets/img/japan.png";
import mauritiusImg from "../../assets/img/ma.png";
import nzImg from "../../assets/img/nz.png";
import spainImg from "../../assets/img/spain.png";
import uaeImg from "../../assets/img/uae.png";
import usaImg from "../../assets/img/usa.png";
import franceImg from "../../assets/img/france.png";

type Country = (typeof countryCards)[0];
type ApplyForm = {
  name: string;
  email: string;
  phone: string;
  college: string;
  resume: File | null;
};

const theme = {
  purple: "#8a2be2",
  violet: "#6d28d9",
  blue: "#4f46e5",
  yellow: "#facc15",
  amber: "#f59e0b",
  dark: "#1f1147",
};

const purpleGradient = `linear-gradient(135deg, ${theme.purple} 0%, ${theme.blue} 100%)`;
const yellowGradient = `linear-gradient(135deg, ${theme.yellow} 0%, ${theme.amber} 100%)`;

const localImages: Record<string, string> = {
  hongkong: hongkongImg,
  japan: japanImg,
  mauritius: mauritiusImg,
  "new zealand": nzImg,
  spain: spainImg,
  dubai: uaeImg,
  uae: uaeImg,
  usa: usaImg,
  france: franceImg,
};

const shortPoints: Record<string, string[]> = {
  hongkong: ["Luxury hotel operations", "International guest service", "City hospitality exposure"],
  japan: ["Hotel service discipline", "Professional work culture", "Operations training"],
  mauritius: ["Island resort exposure", "Front office & F&B", "Tourism career growth"],
  "new zealand": ["English-speaking workplace", "Tourism industry exposure", "Resort operations"],
  spain: ["European hospitality", "Hotel & restaurant training", "Tourism culture exposure"],
  dubai: ["5-star hotel exposure", "Premium guest handling", "UAE hospitality training"],
  uae: ["5-star hotel exposure", "Premium guest handling", "UAE hospitality training"],
  usa: ["J1 internship pathway", "Global hotel brands", "Professional workplace"],
  france: ["European hotel culture", "Culinary service exposure", "Tourism destination training"],
};

function getCountryKey(country: Country) {
  const text = `${country.id || ""} ${country.title || ""} ${country.subtitle || ""}`.toLowerCase();
  if (text.includes("hong")) return "hongkong";
  if (text.includes("new zealand") || text.includes("nz")) return "new zealand";
  if (text.includes("mauritius") || text.includes(" ma")) return "mauritius";
  if (text.includes("dubai") || text.includes("uae")) return "dubai";
  if (text.includes("usa") || text.includes("united states")) return "usa";
  if (text.includes("france")) return "france";
  if (text.includes("japan")) return "japan";
  if (text.includes("spain")) return "spain";
  return "";
}

function getCountryImage(country: Country) {
  const key = getCountryKey(country);
  return localImages[key] || country.image || FallbackImg;
}

function getShortPoints(country: Country) {
  const key = getCountryKey(country);
  return shortPoints[key] || country.description?.slice(0, 3) || [];
}


function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

function getUserId() {
  return (
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    sessionStorage.getItem("customerId") ||
    ""
  );
}

function getMoreSections(country: Country) {
  if (country.programSections?.length) return country.programSections;

  return [
    {
      title: "Program Overview",
      content:
        country.shortDescription ||
        country.subtitle ||
        "A practical international hospitality internship focused on hotel operations, guest service, and global career exposure.",
    },
    {
      title: "Training Areas",
      content: country.description?.length ? country.description : getShortPoints(country),
    },
  ];
}

export default function CountryCards() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [knowMoreCountry, setKnowMoreCountry] = useState<Country | null>(null);
  const [applyCountry, setApplyCountry] = useState<Country | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ApplyForm>({
    name: "",
    email: "",
    phone: "",
    college: "",
    resume: null,
  });

  const goToStudentHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/student-home"), 450);
  }, [navigate]);

  const openApply = (_country: Country) => {
    if (!getAccessToken() || !getUserId()) {
      sessionStorage.setItem("redirectPath", "/student-home");
      sessionStorage.setItem("fromStudyAbroad", "true");
      navigate("/whatsappregister?primaryType=STUDENT");
      return;
    }

    navigate("/student-home", { state: { activeTab: "internship-application" } });
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <span
            className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg"
            style={{ background: purpleGradient }}
          >
            International Internships
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Choose Your <span style={{ color: theme.purple }}>Global Internship</span> Destination
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Explore country-wise hospitality internship programs with simple details, full program information, and easy application support.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {countryCards.map((country, index) => (
            <motion.article
              key={country.id || country.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="group relative overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-[0_18px_60px_rgba(109,40,217,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_90px_rgba(109,40,217,0.18)]"
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: purpleGradient }} />

              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-[44%]">
                  <img
                    src={getCountryImage(country)}
                    alt={country.title}
                    className="h-auto max-h-[260px] w-full object-contain sm:max-h-[340px]"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = FallbackImg;
                    }}
                  />
                </div>

                <div className="w-full p-5 pt-2 sm:p-8 lg:w-[56%] lg:p-10">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: theme.purple }}>
                        Hospitality Internship
                      </p>
                      <h3 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">{country.title}</h3>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => setKnowMoreCountry(country)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2.5 text-xs font-black text-purple-700 shadow-sm transition hover:bg-purple-50"
                      >
                        <Info className="h-4 w-4" />
                        More Info
                      </button>
                      <button
                        onClick={() => openApply(country)}
                        className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-black shadow-lg transition hover:scale-[1.02]"
                        style={{ background: yellowGradient, color: theme.dark }}
                      >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    {country.shortDescription || country.subtitle ||
                      "Build international hospitality experience through hotel, resort, guest service, and operations training."}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {getShortPoints(country).map((point) => (
                      <div key={point} className="flex flex-1 items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" style={{ color: theme.purple }} />
                        <p className="text-sm font-semibold leading-6 text-slate-700">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-purple-50 px-4 py-2 text-purple-700">Hotel Operations</span>
                    <span className="rounded-full bg-yellow-50 px-4 py-2 text-amber-700">Career Support</span>
                    <span className="rounded-full bg-indigo-50 px-4 py-2 text-indigo-700">Global Exposure</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {knowMoreCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setKnowMoreCountry(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 px-5 py-5 text-white sm:px-8" style={{ background: purpleGradient }}>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-100">Program Information</p>
                  <h3 className="mt-1 text-2xl font-black sm:text-3xl">{knowMoreCountry.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-purple-100">
                    Complete details about training, eligibility, support, and internship pathway.
                  </p>
                </div>
                <button onClick={() => setKnowMoreCountry(null)} className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-8">
                <div className="mb-5 rounded-3xl border border-purple-100 bg-purple-50/60 p-5">
                  <h4 className="text-lg font-black text-slate-950">About this internship</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {knowMoreCountry.shortDescription || knowMoreCountry.subtitle ||
                      "A practical international hospitality internship designed for students and fresh graduates who want global hotel, guest service, and operations exposure."}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {getMoreSections(knowMoreCountry).map((section, idx) => (
                    <div key={`${section.title}-${idx}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-black uppercase tracking-[0.16em]" style={{ color: theme.purple }}>
                        {section.title}
                      </h4>

                      {Array.isArray(section.content) ? (
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                          {section.content.map((item, i) => (
                            <div key={i} className="flex min-w-[240px] flex-1 gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" style={{ color: theme.purple }} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-7 text-slate-700">{section.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-8">
                <button
                  onClick={() => {
                    setKnowMoreCountry(null);
                    openApply(knowMoreCountry);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black shadow-lg transition hover:scale-[1.01]"
                  style={{ background: yellowGradient, color: theme.dark }}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {applyCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-md"
            onClick={(e) => e.target === e.currentTarget && setApplyCountry(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 px-6 py-5 text-white" style={{ background: purpleGradient }}>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-100">Application</p>
                  <h3 className="mt-1 text-xl font-black">{applyCountry.title}</h3>
                </div>
                <button onClick={() => setApplyCountry(null)} className="rounded-full bg-white/15 p-2 hover:bg-white/25">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto h-14 w-14" style={{ color: theme.purple }} />
                    <h4 className="mt-4 text-xl font-black">Application Received</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Our team will contact you soon with the next steps.</p>
                    <button onClick={goToStudentHome} className="mt-5 rounded-full px-6 py-3 text-sm font-black text-white" style={{ background: purpleGradient }}>
                      Continue
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitApplication} className="space-y-4">
                    {([
                      { key: "name", label: "Full Name", type: "text", icon: <User className="h-4 w-4" /> },
                      { key: "email", label: "Email", type: "email", icon: <Mail className="h-4 w-4" /> },
                      { key: "phone", label: "Phone Number", type: "tel", icon: <Phone className="h-4 w-4" /> },
                      { key: "college", label: "College / Institute", type: "text", icon: <GraduationCap className="h-4 w-4" /> },
                    ] as const).map(({ key, label, type, icon }) => (
                      <label key={key} className="block">
                        <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-slate-600">{label}</span>
                        <span className="flex items-center gap-2 rounded-2xl border border-purple-100 bg-purple-50/40 px-4 py-3">
                          <span style={{ color: theme.purple }}>{icon}</span>
                          <input
                            required
                            type={type}
                            value={form[key]}
                            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full bg-transparent text-sm outline-none"
                          />
                        </span>
                      </label>
                    ))}

                    <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 px-4 py-4">
                      <Upload className="h-5 w-5" style={{ color: theme.purple }} />
                      <span className="text-sm font-bold text-slate-700">{form.resume?.name || "Upload Resume PDF / DOC"}</span>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setForm((f) => ({ ...f, resume: e.target.files?.[0] || null }))}
                      />
                    </div>

                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black shadow-lg" style={{ background: yellowGradient, color: theme.dark }}>
                      Submit Application
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
