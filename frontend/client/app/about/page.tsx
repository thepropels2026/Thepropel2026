"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Sparkles, Target, Eye, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../components/AuthContext';

export default function About() {
  const { setRegisterModalOpen } = useAuth();
  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-3 h-3" /> The Origin Story
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Architecting <br/>
              <span className="relative">
                New Realities.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              We don't just build companies. We engineer the future of the Indian entrepreneurial ecosystem through a systematic protocol of capital and intelligence.
            </p>
          </motion.div>
        </div>

        {/* --- MISSION & VISION (Classy Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
           {[
             { 
               title: 'The Mission', 
               desc: 'To democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance.',
               icon: <Target className="w-10 h-10 text-cyan-500" />,
               color: 'cyan'
             },
             { 
               title: 'The Vision', 
               desc: 'To become the global standard for entrepreneurial success, where every visionary idea is met with the absolute intelligence and capital required to change the world.',
               icon: <Eye className="w-10 h-10 text-orange-500" />,
               color: 'orange'
             }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="group bg-white rounded-[40px] p-12 flex flex-col justify-between min-h-[420px] shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 text-8xl font-black text-slate-50 italic pointer-events-none group-hover:text-slate-100 transition-colors">"</div>
                <div className="relative z-10">
                   <div className="mb-10 w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                      {item.icon}
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic font-montserrat">{item.title}</h3>
                   <p className="text-slate-500 text-lg font-medium leading-relaxed italic line-clamp-4">"{item.desc}"</p>
                </div>
                <div className={`w-16 h-1.5 bg-${item.color}-500 rounded-full group-hover:w-full transition-all duration-700 mt-10`} />
             </motion.div>
           ))}
        </div>

        {/* --- FOUNDER SECTION --- */}
        <section className="relative">
           <div className="max-w-7xl mx-auto">
              <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 md:p-20 shadow-2xl overflow-hidden relative">
                 {/* Decorative background accent */}
                 <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="flex flex-col items-center lg:items-start">
                       <div className="w-64 h-80 bg-slate-800 rounded-[3rem] border-4 border-white/10 relative overflow-hidden shadow-2xl mb-12">
                          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs font-black uppercase tracking-widest">Founder Profile</div>
                          {/* Placeholder for real image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-6 left-6">
                             <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sovereign Founder</p>
                             <p className="text-xl font-black text-white italic">John Doe</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">Ex-Venture Scout</div>
                          <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">AI Architect</div>
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       <h2 className="text-4xl md:text-5xl font-black font-montserrat uppercase italic tracking-tighter">The Visionary <br/><span className="text-cyan-500">Mindset.</span></h2>
                       <p className="text-white/40 text-lg leading-relaxed font-medium italic">
                          "With a background in deep tech and venture scouting, I founded The Propels to bridge the gap between young raw talent in India and actionable, revenue-generating reality. We are building the infrastructure for the next billion-dollar wave."
                       </p>
                       <div className="pt-10 flex items-center gap-6">
                          <button 
                             onClick={() => setRegisterModalOpen(true)}
                             className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                           >
                              Join the Circle <ArrowRight className="w-5 h-5" />
                           </button>
                          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">System Authorized</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- STATS OVERLAY --- */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Founded', val: '2023' },
             { label: 'Global Nodes', val: '14+' },
             { label: 'Active Founders', val: '1.2k+' },
             { label: 'Capital Link', val: '$42M' }
           ].map((stat, i) => (
             <div key={i} className="text-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                <p className="text-4xl font-black text-white italic mb-2 tracking-tighter">{stat.val}</p>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
