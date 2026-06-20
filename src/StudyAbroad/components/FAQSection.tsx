import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { faqItems } from "../data/internshipData";

const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";
const yellowGradient = "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            FAQ
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Your internship questions <span className="text-purple-700">answered</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[1.5rem] border border-purple-100 bg-white shadow-sm"
                >
                  <button type="button" onClick={() => setActiveIndex(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left">
                    <span>
                      <span className="block text-xs font-black uppercase tracking-[0.18em] text-purple-700">Question</span>
                      <span className="mt-1 block text-base font-black text-slate-950 sm:text-lg">{item.question}</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 text-purple-700 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-purple-100 bg-purple-50/40">
                        <p className="px-5 py-5 text-sm leading-7 text-slate-700">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="w-full rounded-[1.75rem] border border-purple-100 bg-white p-8 shadow-[0_18px_55px_rgba(109,40,217,0.10)] lg:w-[34%]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ background: purpleGradient }}>
              <MessageSquare className="h-6 w-6" />
            </span>
            <h3 className="mt-6 text-2xl font-black text-slate-950">Need more help?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Our counselors can guide you on country selection, documents, eligibility, and application next steps.</p>
            <button className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black shadow-lg" style={{ background: yellowGradient, color: "#1f1147" }}>
              Talk to a Counselor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
