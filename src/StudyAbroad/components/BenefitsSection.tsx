import { motion } from "framer-motion";
import { Sparkles, Users, Globe2, Award, BookOpen } from "lucide-react";
import { benefitCards } from "../data/internshipData";

const icons = [Sparkles, Users, Globe2, Award, BookOpen, Sparkles];
const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";

export default function BenefitsSection() {
  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Benefits
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Benefits of choosing an <span className="text-purple-700">international internship</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Build global confidence, hotel operations skills, and career momentum through guided international programs.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap">
          {benefitCards.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group flex flex-1 basis-[320px] gap-4 rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-[0_18px_55px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(109,40,217,0.16)]"
              >
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: purpleGradient }}>
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
