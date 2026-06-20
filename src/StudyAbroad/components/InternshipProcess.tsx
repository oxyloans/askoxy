import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";
import { internshipProcess } from "../data/internshipData";

const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";

export default function InternshipProcess() {
  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Internship Process
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Your journey from <span className="text-purple-700">application to internship</span>
          </h2>
        </div>

        <div className="relative rounded-[2rem] border border-purple-100 bg-purple-50/40 p-5 shadow-[0_18px_55px_rgba(109,40,217,0.10)] sm:p-8">
          <div className="flex flex-col gap-6">
            {internshipProcess.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-start"
              >
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white" style={{ background: purpleGradient }}>
                  <CircleDot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-700">Step {index + 1}</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
