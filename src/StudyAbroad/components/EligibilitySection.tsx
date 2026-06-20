import { motion } from "framer-motion";
import { GraduationCap, UserCheck, Hotel, Compass, Briefcase } from "lucide-react";
import { eligibilityCards } from "../data/internshipData";

const icons = [GraduationCap, UserCheck, Hotel, Compass, Briefcase];
const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";

export default function EligibilitySection() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-purple-200/35 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Eligibility
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Who Can Apply for <span className="text-purple-700">International Internships?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Suitable for students, fresh graduates, and hospitality professionals ready for global exposure.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap">
          {eligibilityCards.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex flex-1 basis-[210px] flex-col rounded-[1.5rem] border border-purple-100 bg-white p-6 shadow-[0_18px_55px_rgba(109,40,217,0.10)]"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: purpleGradient }}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
