"use client";
import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Zap, ShieldCheck, ArrowRight, BrainCircuit, Globe, PieChart, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketResearchPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 4000); // simulate API call
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <BrainCircuit className="w-3 h-3" /> Predictive Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Market <br/>
              <span className="relative text-cyan-500">
                Neural Scan.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#FF5F00" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Submit your startup parameters to trigger a global multi-node scan. Our engine parses historical data, competitor matrices, and TAM models with absolute precision.
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!results && !analyzing && (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit} 
              className="bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-orange-500" />
               <div className="absolute top-10 right-10">
                  <Zap className="w-8 h-8 text-slate-100" />
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Industry / Vertical</label>
                     <input required type="text" placeholder="e.g. B2B SaaS, CleanTech, EdTech" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-300" />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Mission Parameters (Problem)</label>
                     <textarea required rows={4} placeholder="Describe the pain point you are architecting for..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-300 resize-none" />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Target Node (Demographic)</label>
                     <input required type="text" placeholder="e.g. Gen-Z Tech Leaders, SMB Owners" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-300" />
                  </div>

                  <button type="submit" className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-4">
                    <Search className="w-5 h-5" /> Initiate Neural Scan
                  </button>
               </div>
            </motion.form>
          )}

          {analyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] text-center"
            >
               <div className="relative mb-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-24 h-24 border-t-4 border-r-4 border-cyan-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Globe className="w-10 h-10 text-white/20 animate-pulse" />
                  </div>
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Parsing Global Datasets</h3>
               <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Competitor Matrices & TAM Models</p>
            </motion.div>
          )}

          {results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden"
            >
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
                     <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black font-montserrat uppercase italic tracking-tighter">Scan Complete</h2>
                     <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Viability Rating: HIGH</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><PieChart className="w-3 h-3" /> Total Market (TAM)</p>
                     <p className="text-4xl font-black text-slate-900 tracking-tighter italic">$4.2B+</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3" /> Saturation Matrix</p>
                     <p className="text-4xl font-black text-orange-600 tracking-tighter italic">42%</p>
                  </div>
               </div>

               <div className="space-y-6 mb-12">
                  <h3 className="text-lg font-black uppercase tracking-tight italic flex items-center gap-2 text-cyan-600"><Sparkles className="w-5 h-5" /> Strategic Intelligence</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                    "The market exhibits a clear gap in user experience protocols. While incumbents hold 60% of enterprise contracts, the emerging SMP demographic is largely unaddressed. Recommended action: Focus MVP strictly on onboarding velocity and neural feedback loops."
                  </p>
               </div>

               <button 
                 onClick={() => setResults(false)} 
                 className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
               >
                 Execute New Query <ArrowRight className="w-5 h-5" />
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
