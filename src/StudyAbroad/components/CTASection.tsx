import { motion } from "framer-motion";
import { ArrowRight, Headphones, Sparkles } from "lucide-react";

const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";
const yellowGradient = "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)";

export default function CTASection() {
  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.20)] sm:p-10"
          style={{ background: purpleGradient }}
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-purple-100">
                <Sparkles className="h-4 w-4" />
                Ready to take off?
              </span>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">
                Ready to Start Your International Career?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
                Connect with our expert advisors and begin your internship application with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <button className="inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-black shadow-xl transition hover:-translate-y-0.5" style={{ background: yellowGradient, color: "#1f1147" }}>
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/15 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/25">
                <Headphones className="h-4 w-4" />
                Talk To Expert
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
