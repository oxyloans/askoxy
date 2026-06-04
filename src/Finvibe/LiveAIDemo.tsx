import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Workflow, Lightbulb, Link2, Database, Laptop, Scale, 
  Brain, Users, GitMerge, Plug, Map, FileBarChart, ShieldCheck, Code,
  ArrowRight, Shield, Zap, Globe, Cpu, Play, Upload, CheckCircle2, FileText, ChevronRight, RotateCcw,
  ArrowLeft
} from 'lucide-react';

export default function LiveAIDemo() {
  const navigate = useNavigate();
  const [activeDemoTab, setActiveDemoTab] = useState(0);
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [processingStep, setProcessingStep] = useState(0);

  // File Upload States
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(prev => ({ ...prev, [fileKey]: e.target.files![0] }));
    }
  };

  // Demo Processing Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (demoState === 'processing') {
      const maxSteps = activeDemoTab === 1 ? 4 : activeDemoTab === 0 ? 5 : 3;
      
      const runStep = (stepIndex: number) => {
        setProcessingStep(stepIndex);
        if (stepIndex >= maxSteps) {
          timeout = setTimeout(() => {
            setDemoState('completed');
          }, 800);
        } else {
          timeout = setTimeout(() => {
            runStep(stepIndex + 1);
          }, activeDemoTab === 1 ? 1200 : 1000); // Slower for demo 2 to read text
        }
      };
      runStep(0);
    }
    return () => clearTimeout(timeout);
  }, [demoState, activeDemoTab]);

  const handleStartDemo = async () => {
    // -------------------------------------------------------------
    // Mocking an actual API call to simulate real backend processing.
    // Replace "/api/ai-analyze" with your actual Spring Boot endpoint later.
    // -------------------------------------------------------------
    try {
      console.log("Simulating API request with uploaded files:", uploadedFiles);
      // const formData = new FormData();
      // Object.entries(uploadedFiles).forEach(([key, file]) => {
      //   if (file) formData.append(key, file);
      // });
      // await fetch('/api/ai-analyze', { method: 'POST', body: formData });
    } catch (err) {
      console.error(err);
    }

    setDemoState('processing');
    setProcessingStep(0);
  };

  const handleResetDemo = () => {
    setDemoState('idle');
    setProcessingStep(0);
    setUploadedFiles({});
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 p-6 max-w-[1400px] mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Engine
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Real-time API Sandbox
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI Showcase</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload your local PDF documents and watch the multi-agent AI architecture extract, verify, and make complex banking decisions in seconds.
          </p>
        </motion.div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
           {/* Demo Tabs */}
           <div className="flex flex-col md:flex-row border-b border-white/10 bg-slate-950/50">
             {["Customer Onboarding", "Loan Eligibility Engine", "Underwriting Recommendation"].map((title, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    if (demoState !== 'idle') handleResetDemo();
                    setActiveDemoTab(idx);
                  }}
                  className={`flex-1 py-4 px-6 text-sm font-bold transition-colors ${activeDemoTab === idx ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  {idx === 1 && <span className="mr-2 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">CORE</span>}
                  {title}
                </button>
             ))}
           </div>

           {/* Demo Canvas */}
           <div className="p-8 md:p-12 flex flex-col flex-1">
              
              {/* Input Phase (Idle) */}
              {demoState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 w-full max-w-3xl">
                    {activeDemoTab === 0 && (
                      <>
                        <RealUpload label="Passport PDF" fileKey="passport" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                        <RealUpload label="Emirates ID" fileKey="emiratesId" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                        <RealUpload label="Salary Certificate" fileKey="salary" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                      </>
                    )}
                    {activeDemoTab === 1 && (
                      <>
                        <RealUpload label="Bank Statement PDF" fileKey="bankStmt" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                        <RealUpload label="Credit Bureau Report" fileKey="creditBureau" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                        <RealUpload label="Salary Certificate" fileKey="salary2" uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} />
                      </>
                    )}
                    {activeDemoTab === 2 && (
                      <div className="col-span-3 text-center p-8 bg-slate-950 rounded-2xl border border-white/10">
                        <Database className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-300">Receiving API Payload from Eligibility Engine</h4>
                        <p className="text-xs text-slate-500 mt-2 font-mono">{"{ creditScore: 760, income: 15000, existingLoans: 2 }"}</p>
                      </div>
                    )}
                  </div>
                  <button onClick={handleStartDemo} className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2">
                     {activeDemoTab === 2 ? 'Run Underwriting AI' : 'Process Documents via API'} <Play className="w-4 h-4 fill-current" />
                  </button>
                </motion.div>
              )}

              {/* Processing Phase */}
              {demoState === 'processing' && (
                <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full">
                  <div className="w-16 h-16 mb-8 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center relative">
                     <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl animate-ping opacity-20"></div>
                     <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  
                  <div className="w-full space-y-4">
                    {/* Tab 1 Animations */}
                    {activeDemoTab === 0 && (
                      <>
                        <ProcessingStep title="Extracting Customer Details" active={processingStep >= 0} completed={processingStep > 0} />
                        <ProcessingStep title="Verifying Identity (KYC)" active={processingStep >= 1} completed={processingStep > 1} />
                        <ProcessingStep title="Checking Document Completeness" active={processingStep >= 2} completed={processingStep > 2} />
                        <ProcessingStep title="Creating Customer Profile" active={processingStep >= 3} completed={processingStep > 3} />
                        <ProcessingStep title="Generating Customer ID" active={processingStep >= 4} completed={processingStep > 4} />
                      </>
                    )}

                    {/* Tab 2 Animations (The 4 Agents) */}
                    {activeDemoTab === 1 && (
                      <>
                        <AgentProcessingStep agent="Agent 1" title="Bank Statement Analysis" active={processingStep >= 0} completed={processingStep > 0} result="Income = 15,000 AED | Exp = 7,000 AED" />
                        <AgentProcessingStep agent="Agent 2" title="Credit Bureau Analysis" active={processingStep >= 1} completed={processingStep > 1} result="Score = 760 | Active Loans = 2" />
                        <AgentProcessingStep agent="Agent 3" title="Income Verification" active={processingStep >= 2} completed={processingStep > 2} result="Status: Verified" />
                        <AgentProcessingStep agent="Agent 4" title="Repayment Capacity" active={processingStep >= 3} completed={processingStep > 3} result="Available EMI = 3,500 AED" />
                      </>
                    )}

                    {/* Tab 3 Animations */}
                    {activeDemoTab === 2 && (
                      <>
                        <ProcessingStep title="Analyzing Repayment Capacity vs Risk" active={processingStep >= 0} completed={processingStep > 0} />
                        <ProcessingStep title="Calculating Risk Score" active={processingStep >= 1} completed={processingStep > 1} />
                        <ProcessingStep title="Generating Recommendation" active={processingStep >= 2} completed={processingStep > 2} />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Result Phase */}
              {demoState === 'completed' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center flex-1 w-full max-w-3xl mx-auto">
                  
                  <div className="w-full flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> API Output Generated</h3>
                     <button onClick={handleResetDemo} className="text-sm text-slate-400 hover:text-white flex items-center gap-1"><RotateCcw className="w-4 h-4" /> Reset Demo</button>
                  </div>

                  {/* Tab 1 Output */}
                  {activeDemoTab === 0 && (
                    <div className="w-full bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 font-mono text-sm shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                       <pre className="text-slate-300">
{`{
  "customerId": "CUST12345",
  "name": "Ahmed Khan",
  "nationality": "UAE",
  "monthlyIncome": "15000 AED",
  "status": "Verified"
}`}
                       </pre>
                    </div>
                  )}

                  {/* Tab 2 Output */}
                  {activeDemoTab === 1 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                         <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                           <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-1">Final Decision</div>
                         <div className="text-3xl font-extrabold text-white">Loan Eligible</div>
                       </div>
                       <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl space-y-4">
                         <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                           <span className="text-slate-400 text-sm">Max Loan Amount</span>
                           <span className="text-2xl font-bold text-white">AED 250,000</span>
                         </div>
                         <div className="flex justify-between items-end">
                           <span className="text-slate-400 text-sm">AI Confidence Score</span>
                           <span className="text-xl font-bold text-blue-400">92%</span>
                         </div>
                       </div>
                    </div>
                  )}

                  {/* Tab 3 Output */}
                  {activeDemoTab === 2 && (
                    <div className="w-full bg-slate-900 border border-emerald-500/30 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]"></div>
                       
                       <div className="flex items-center gap-4 mb-6">
                         <div className="px-4 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-sm uppercase tracking-widest">
                           Approve
                         </div>
                         <div className="text-sm font-bold text-slate-400">Risk Score: <span className="text-white text-lg">720</span></div>
                       </div>

                       <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">AI Reasoning:</h4>
                       <ul className="space-y-3">
                         <li className="flex items-start gap-3"><ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="text-slate-200">Strong repayment capacity identified from cash flow analysis.</span></li>
                         <li className="flex items-start gap-3"><ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="text-slate-200">Low credit risk (Score 760) with no recent late payments.</span></li>
                         <li className="flex items-start gap-3"><ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0" /> <span className="text-slate-200">Stable income verified across multiple documentation sources.</span></li>
                       </ul>
                    </div>
                  )}
                </motion.div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components for Demo ---

function RealUpload({ label, fileKey, uploadedFiles, handleFileUpload }: { label: string, fileKey: string, uploadedFiles: { [key: string]: File | null }, handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileKey: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFile = uploadedFiles[fileKey];
  const isUploaded = !!uploadedFile;

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer
        ${isUploaded ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-300'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileUpload(e, fileKey)} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg"
      />
      {isUploaded ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8 opacity-50" />}
      <span className="text-sm font-bold">{isUploaded ? uploadedFile.name : label}</span>
      {isUploaded && <span className="text-xs opacity-60">Ready to upload</span>}
    </div>
  );
}

function ProcessingStep({ title, active, completed }: { title: string, active: boolean, completed: boolean }) {
  if (!active) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border flex items-center gap-4 transition-all
        ${completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'}`}
    >
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      )}
      <span className={`text-sm font-bold ${completed ? 'text-emerald-400' : 'text-blue-400'}`}>{title}</span>
    </motion.div>
  );
}

function AgentProcessingStep({ agent, title, active, completed, result }: { agent: string, title: string, active: boolean, completed: boolean, result: string }) {
  if (!active) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4 transition-all
        ${completed ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-800 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`text-[10px] font-bold px-2 py-1 rounded bg-black/50 border ${completed ? 'text-emerald-400 border-emerald-500/30' : 'text-blue-400 border-blue-500/30'}`}>
          {agent}
        </div>
        <span className={`text-sm font-bold ${completed ? 'text-slate-300' : 'text-white'}`}>{title}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {completed ? (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            {result}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </div>
        )}
      </div>
    </motion.div>
  );
}
