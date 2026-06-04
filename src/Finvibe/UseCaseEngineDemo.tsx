import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Workflow, Lightbulb, Link2, Database, Laptop, Scale, 
  Brain, Users, GitMerge, Plug, Map, FileBarChart, ShieldCheck, Code,
  ArrowRight, Shield, Zap, Globe, Cpu, Play, ChevronLeft, ChevronRight
} from 'lucide-react';

// --- Data ---
const marqueeImages = [
  "https://i.ibb.co/jZv52ZCN/ai1-jpg.jpg",
  "https://i.ibb.co/fVSfvfvZ/AI2-jpg-1.jpg",
  "https://i.ibb.co/dwBpNtXw/AI3-jpg-1.jpg",
  "https://i.ibb.co/VcGFCCfF/AI4-jpg-1.jpg",
  "https://i.ibb.co/cKBT2ctj/AI5-jpg-1.jpg",
  "https://i.ibb.co/v4yZxG7t/ai6-jpg.jpg",
  "https://i.ibb.co/LXzRkJQK/AI7-jpg.jpg",
  "https://i.ibb.co/vxK9ZzYg/IMG-20260602-WA0042-jpg.jpg",
  "https://i.ibb.co/8gBBcYR7/IMG-20260602-WA0044-jpg.jpg",
  "https://i.ibb.co/CshbWWm9/IMG-20260602-WA0045-jpg.jpg",
  "https://i.ibb.co/8DmXggxB/ai11-jpg.jpg",
  "https://i.ibb.co/NdTNpQQ0/IMG-20260603-WA0015-jpg.jpg",
  "https://i.ibb.co/wZt41zfJ/ai13-jpg.jpg",
  "https://i.ibb.co/7x7sDdCn/ai14-jpg.jpg",
  "https://i.ibb.co/1tC9H3mt/ai15-jpg.jpg",
  "https://i.ibb.co/mFR7LmR8/ai16-jpg.jpg",
  "https://i.ibb.co/fgLJDj5/ai17-jpg.jpg",
  "https://i.ibb.co/3YFxcRWZ/ai18-jpg.jpg",
  "https://i.ibb.co/KxqnD23k/ai19-jpg.jpg",
  "https://i.ibb.co/7JN6jHLd/ai20-jpg.jpg",
  "https://i.ibb.co/xtQ7DQtK/ai21-jpg.jpg",
  "https://i.ibb.co/272SqS9w/ai22-jpg.jpg",
  "https://i.ibb.co/yBxZT4mS/ai23-jpg.jpg",
  "https://i.ibb.co/rRd0BgNp/ai24-jpg.jpg",
  "https://i.ibb.co/7t7dv9z2/ai25-jpg.jpg",
  "https://i.ibb.co/6JymByHb/ai26-jpg.jpg",
  "https://i.ibb.co/KzDNNw2c/ai27-jpg.jpg",
  "https://i.ibb.co/6Jv60J6n/ai28-jpg.jpg",
  "https://i.ibb.co/PGzDvhbP/ai29-jpg.jpg",
  "https://i.ibb.co/Z6KYmm2f/ai30-jpg-1.jpg"
];

const stepsData = [
  { phase: "Phase 1: Business Discovery", color: "from-blue-600 to-cyan-500", items: [
    { id: 1, title: 'DOMAIN DISCOVERY', icon: Building2, desc: 'Define business domain & geography.' },
    { id: 2, title: 'PROCESS DISCOVERY', icon: Workflow, desc: 'Understand current workflows & systems.' },
    { id: 3, title: 'USE CASE DISCOVERY', icon: Lightbulb, desc: 'Identify AI automation opportunities.' }
  ]},
  { phase: "Phase 2: Intelligence Discovery", color: "from-purple-600 to-pink-500", items: [
    { id: 4, title: 'DEPENDENCY DISCOVERY', icon: Link2, desc: 'Trace upstream data dependencies.' },
    { id: 5, title: 'INPUT DISCOVERY', icon: Database, desc: 'Identify required data dictionaries.' },
    { id: 6, title: 'SYSTEM DISCOVERY', icon: Laptop, desc: 'Map LOS, LMS, CBS, and Data Warehouses.' },
    { id: 7, title: 'REGULATORY DISCOVERY', icon: Scale, desc: 'Ensure RBI, CBUAE, SAMA compliance.' }
  ]},
  { phase: "Phase 3: AI Design", color: "from-orange-500 to-amber-500", items: [
    { id: 8, title: 'AI PATTERN DISCOVERY', icon: Brain, desc: 'Select Prediction, Scoring, or NLP models.' },
    { id: 9, title: 'AGENT DISCOVERY', icon: Users, desc: 'Map tasks to internal AI Agents.' },
    { id: 10, title: 'DECISION FLOW', icon: GitMerge, desc: 'Build the AI business rule engine.' }
  ]},
  { phase: "Phase 4: Integration & Delivery", color: "from-emerald-500 to-teal-400", items: [
    { id: 11, title: 'API DISCOVERY', icon: Plug, desc: 'Map internal & external APIs.' },
    { id: 12, title: 'INTEGRATION MAPPING', icon: Map, desc: 'Design workflow integration points.' },
    { id: 13, title: 'REPORT GENERATION', icon: FileBarChart, desc: 'Build management dashboards.' },
    { id: 14, title: 'GRC GENERATION', icon: ShieldCheck, desc: 'Create audit and risk frameworks.' },
    { id: 15, title: 'CODE GENERATION', icon: Code, desc: 'Deploy full orchestration code.' }
  ]}
];

const agents = [
  { id: 1, name: 'DOMAIN', icon: Building2 },
  { id: 2, name: 'PROCESS', icon: Workflow },
  { id: 3, name: 'DEPENDENCY', icon: Link2 },
  { id: 4, name: 'DATA', icon: Database },
  { id: 5, name: 'SYSTEM', icon: Laptop },
  { id: 6, name: 'REGULATORY', icon: Scale },
  { id: 7, name: 'AI PATTERN', icon: Brain },
  { id: 8, name: 'INTEGRATION', icon: Plug },
  { id: 9, name: 'DECISION', icon: GitMerge },
  { id: 10, name: 'REPORT', icon: FileBarChart },
  { id: 11, name: 'GRC', icon: ShieldCheck },
  { id: 12, name: 'CODE', icon: Code },
];

export default function UseCaseEngineDemo() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const scrollToPipeline = () => {
    const el = document.getElementById('pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };



  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          >
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Cpu className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400" stroke="url(#blue-purple)" />
              <svg width="0" height="0">
                <linearGradient id="blue-purple" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop stopColor="#3b82f6" offset="0%" />
                  <stop stopColor="#a855f7" offset="100%" />
                </linearGradient>
              </svg>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-widest backdrop-blur-md">
              OXY BFSAI AI USE CASE ENGINE
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              From Existing Process to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                AI Code in 15 Steps
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Powering 30+ Lending Use Cases across India, UAE, and SAMA with a fully autonomous 12-Agent architecture.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/live-ai-demo')} className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                Live AI Demo <Play className="w-5 h-5 fill-current" />
              </button>
              <button onClick={scrollToPipeline} className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-semibold">
                View the 15-Step Pipeline
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* INTERACTIVE CAROUSEL SECTION */}
        <section className="py-12 border-y border-white/5 bg-slate-950/50">
          <div className="text-center mb-8 px-6 flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="text-left">
              <h2 className="text-xl md:text-3xl font-bold">30+ Core Lending Use Cases</h2>
              <p className="text-slate-400 text-sm mt-1">Scroll to view all automated workflows.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel('left')} className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-slate-900 shadow-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollCarousel('right')} className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-slate-900 shadow-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            className="w-full overflow-hidden"
          >
            <div 
              ref={carouselRef}
              className="flex gap-6 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {marqueeImages.map((src, i) => (
                <div key={i} className="snap-center shrink-0 w-[25vw] md:w-[200px] lg:w-[300px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group cursor-pointer shadow-2xl">
                  <img 
                    src={src} 
                    alt={`Use Case ${i + 1}`} 
                    className="w-80 h-85 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 15-STEP ENGINE TIMELINE */}
        <section id="pipeline-section" className="py-24 px-6 bg-slate-950/80 border-b border-white/5 relative">
          <div className="max-w-[1200px] mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The <span className="text-purple-400">15-Step</span> Engine</h2>
              <p className="text-slate-400 text-lg">A systematic pipeline turning business workflows into deployed AI code.</p>
            </motion.div>

            <div className="space-y-24">
              {stepsData.map((phase, pIdx) => (
                <motion.div 
                  key={pIdx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`h-px flex-1 bg-gradient-to-r ${phase.color} opacity-20`}></div>
                    <h3 className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${phase.color}`}>
                      {phase.phase}
                    </h3>
                    <div className={`h-px flex-1 bg-gradient-to-l ${phase.color} opacity-20`}></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-auto-fit min-[1000px]:flex min-[1000px]:justify-center gap-4 flex-wrap">
                    {phase.items.map((step, sIdx) => {
                      const Icon = step.icon;
                      return (
                        <motion.div 
                          key={step.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: sIdx * 0.1, type: "spring" }}
                          className="w-full min-[1000px]:w-[280px] bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl p-6 group transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${phase.color} shadow-lg shadow-black/50 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs font-bold text-slate-500 mb-1">STEP {step.id}</div>
                          <h4 className="text-lg font-bold text-slate-200 mb-2">{step.title}</h4>
                          <p className="text-sm text-slate-400">{step.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 12 AI AGENTS ROSTER */}
        <section className="py-24 px-6 max-w-[1400px] mx-auto text-center border-t border-white/5 bg-slate-950/30">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">12 Core <span className="text-orange-400">AI Agents</span></h2>
            <p className="text-slate-400 text-lg">Specialized autonomous agents collaborating to build your systems.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <motion.div 
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-3 p-4 w-28 md:w-32 bg-slate-900/50 rounded-2xl border border-white/5 hover:bg-slate-800 transition-colors cursor-default"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-300 text-center uppercase">{agent.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ECOSYSTEM / FOOTER */}
        <section className="border-t border-white/10 bg-slate-950 py-16 px-6 relative z-10">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold">Supported Regulations</h3>
              </div>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li className="flex items-center justify-center md:justify-start gap-3"><span className="w-2 h-2 rounded-full bg-blue-500"></span> INDIA: RBI, CIBIL, CKYC</li>
                <li className="flex items-center justify-center md:justify-start gap-3"><span className="w-2 h-2 rounded-full bg-purple-500"></span> UAE: CBUAE, AECB</li>
                <li className="flex items-center justify-center md:justify-start gap-3"><span className="w-2 h-2 rounded-full bg-green-500"></span> SAMA: SIMAH, KYC/AML</li>
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Plug className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold">Seamless Integrations</h3>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {['Core Banking', 'LOS', 'LMS', 'CRM', 'Data Warehouse', 'KYC', 'Payment Gateways'].map(sys => (
                  <span key={sys} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                    {sys}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Shield className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-bold">Key Benefits</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center justify-center md:justify-start gap-2"><Zap className="w-4 h-4 text-emerald-500"/> Faster AI Implementation</li>
                <li className="flex items-center justify-center md:justify-start gap-2"><Zap className="w-4 h-4 text-emerald-500"/> Generates Complete Code</li>
                <li className="flex items-center justify-center md:justify-start gap-2"><Zap className="w-4 h-4 text-emerald-500"/> Built for Enterprise Scale</li>
              </ul>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
