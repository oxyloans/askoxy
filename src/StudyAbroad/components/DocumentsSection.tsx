import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, ShieldCheck } from "lucide-react";
import { documentChecklists } from "../data/internshipData";

const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";

export default function DocumentsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Documents Required
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Everything you need for a <span className="text-purple-700">smooth application</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Expand each country checklist and keep your internship application documents ready.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap">
          {documentChecklists.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.country}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="flex-1 basis-[420px] overflow-hidden rounded-[1.75rem] border border-purple-100 bg-white shadow-[0_18px_55px_rgba(109,40,217,0.10)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: purpleGradient }}>
                      <FileText className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-black uppercase tracking-[0.18em] text-purple-700">{item.country}</span>
                      <span className="mt-1 block text-lg font-black text-slate-950">Country Checklist</span>
                    </span>
                  </span>
                  <ChevronDown className={`h-5 w-5 text-purple-700 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-purple-100 bg-purple-50/40"
                    >
                      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap">
                        {item.items.map((doc) => (
                          <div key={doc} className="flex flex-1 basis-[210px] items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                            <ShieldCheck className="h-4 w-4 flex-none text-purple-700" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
