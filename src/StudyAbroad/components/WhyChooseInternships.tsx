import { motion } from "framer-motion";
import { Globe, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import { internshipFeatures } from "../data/internshipData";

const iconMap = { DollarSign, Globe, ShieldCheck, TrendingUp };
const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";
const yellowGradient = "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)";

export default function WhyChooseInternships() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Why Choose Us
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Why Choose <span className="text-purple-700">International Internships?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Paid opportunities, visa guidance, and global mentors to help you begin a world-class hospitality career.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap">
          {internshipFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="relative flex flex-1 basis-[260px] flex-col overflow-hidden rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-[0_18px_55px_rgba(109,40,217,0.10)]"
              >
                <span className="absolute right-5 top-4 text-6xl font-black text-purple-50">{String(index + 1).padStart(2, "0")}</span>
                <span className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: index === 1 ? yellowGradient : purpleGradient }}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative text-lg font-black text-slate-950">{feature.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
