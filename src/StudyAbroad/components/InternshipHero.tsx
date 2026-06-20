import { motion } from "framer-motion";
import { ArrowRight, Globe2, ShieldCheck, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroImage from "../../assets/img/megahero.png";

const theme = {
  purple: "#8A2BE2",
  violet: "#6D28D9",
  blue: "#4F46E5",
  yellow: "#FACC15",
  dark: "#1F1147",
};

const gradient = `linear-gradient(135deg, ${theme.purple} 0%, ${theme.blue} 100%)`;
const yellowGradient = `linear-gradient(135deg, ${theme.yellow} 0%, #F59E0B 100%)`;

const stats = [
  { icon: Globe2, title: "8+ Countries" },
  { icon: ShieldCheck, title: "Visa Support" },
  { icon: Sparkles, title: "Career Growth" },
];

export default function InternshipHero() {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/student-home"), 400);
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-950">
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-purple-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-yellow-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full text-center lg:w-[54%] lg:text-left"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-md"
              style={{ background: gradient }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium Internship Programs
            </span>

            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:mx-0 lg:text-5xl">
              Launch Your <span style={{ color: theme.purple }}>Global Career</span> with International Internships
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:mx-0">
              Explore hospitality internship opportunities across USA, Japan, France, Dubai, Hong Kong, Spain, New Zealand, and Mauritius with expert guidance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.07 }}
                    className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-[170px]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50" style={{ color: theme.purple }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black text-slate-900">{item.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-[46%]"
          >
            <div className="rounded-[2rem] border border-purple-100 bg-white p-3 shadow-[0_22px_70px_rgba(109,40,217,0.14)] sm:p-4">
              <div className="overflow-hidden rounded-[1.5rem] bg-purple-50">
                <img
                  src="https://www.unimoni.in/blog/wp-content/uploads/2021/09/University-860x560.png"
                  alt="International internship program"
                  className="h-[250px] w-full object-cover sm:h-[340px] lg:h-[400px]"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
