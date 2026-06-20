import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonialCards } from "../data/internshipData";

const purpleGradient = "linear-gradient(135deg, #8a2be2 0%, #4f46e5 100%)";

export default function SuccessStories() {
  return (
    <section className="bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg" style={{ background: purpleGradient }}>
            Success Stories
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Real student journeys powered by <span className="text-purple-700">global internships</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Hear from students who started their international careers with confidence.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap">
          {testimonialCards.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="flex flex-1 basis-[300px] flex-col rounded-[1.75rem] border border-purple-100 bg-white p-6 shadow-[0_18px_55px_rgba(109,40,217,0.10)]"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-purple-100" />
                <div>
                  <p className="text-lg font-black text-slate-950">{item.name}</p>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-700">{item.country}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">{item.review}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
