"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Quote, ChevronDown, Play, BookOpen, Mic, Wrench, Sparkles, Zap, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion'; 
import Image from 'next/image';
import { supabase } from '../lib/supabase'; 
import { useAuth } from '../components/AuthContext';

export default function Home() {
  const { setRegisterModalOpen } = useAuth();
  return (
    <div className="flex flex-col bg-[#080808] min-h-screen text-white relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 w-fit">
              <Sparkles className="w-3 h-3" /> The Propulsion Protocol
            </div>
            
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter">
              Turning Intent <br/>
              Into <span className="relative">
                Real Revenue.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>

            <p className="text-white/40 text-lg md:text-xl max-w-lg mb-12 font-medium leading-relaxed">
              Elevating India's brightest founders beyond raw concepts with predictive AI, zero-gravity scaling, and elite capital networks.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setRegisterModalOpen(true)}
                className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
              >
                Join the Mission <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="/tools">
                <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  Explore Arsenal
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
             {/* Card Style Video / Feature */}
             <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-4 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                
                <div className="aspect-video bg-black rounded-[30px] overflow-hidden relative flex items-center justify-center border border-white/5">
                   <div className="z-10 flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                         <Play className="w-8 h-8 fill-current ml-1" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Propulsion Overview</span>
                   </div>
                   {/* Abstract Glow */}
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-orange-500/10 opacity-50" />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Network Strength</p>
                      <p className="text-xl font-black text-white italic">1,200+ Founders</p>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Success Rate</p>
                      <p className="text-xl font-black text-cyan-400 italic">94% Growth</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-white text-black rounded-[60px] mx-4 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
             {[
               { label: 'Capital Deployed', value: '$42M+', icon: <Zap className="w-6 h-6 text-orange-500" /> },
               { label: 'Elite Mentors', value: '850+', icon: <ShieldCheck className="w-6 h-6 text-cyan-600" /> },
               { label: 'Market Velocity', value: '2.4x', icon: <ArrowRight className="w-6 h-6 text-purple-600" /> },
               { label: 'Global Nodes', value: '14+', icon: <Globe className="w-6 h-6 text-emerald-600" /> }
             ].map((stat, i) => (
               <div key={i} className="space-y-4">
                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {stat.icon}
                 </div>
                 <div className="text-4xl md:text-5xl font-montserrat font-black tracking-tighter">{stat.value}</div>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- MARKETPLACE PREVIEW --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-montserrat font-black mb-6 italic uppercase tracking-tight">The <span className="text-cyan-500">Founder's</span> Arsenal.</h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">Battle-tested tools to automate your startup's growth from seed to scale.</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-3 text-cyan-500 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-all">
              Access Full Terminal <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedToolsGrid />
          </div>
        </div>
      </section>

      {/* --- THE PROCESS (Masters' Union Style Cards) --- */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center mb-20">
           <h2 className="text-4xl md:text-6xl font-montserrat font-black mb-6 uppercase italic">The Propulsion <span className="text-[#FF5F00]">Protocol.</span></h2>
           <p className="text-white/40 text-lg font-medium">A systematic framework for hyper-growth.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { num: '01', title: 'Blueprint Sync', desc: 'AI-driven market mapping and product validation with absolute precision.', color: 'cyan' },
             { num: '02', title: 'Velocity Build', desc: 'Rapid prototyping with elite engineers and decentralized infrastructure.', color: 'orange' },
             { num: '03', title: 'Capital Ignite', desc: 'Closed-circuit demo days with a network of 400+ sovereign investors.', color: 'purple' },
             { num: '04', title: 'Sovereign Scale', desc: 'Automated legal, marketing, and recruitment pipelines to dominate.', color: 'emerald' }
           ].map((item, i) => (
             <div key={i} className="group bg-white rounded-[40px] p-10 flex flex-col justify-between min-h-[380px] shadow-2xl hover:-translate-y-4 transition-all duration-500 cursor-default">
                <div className="text-6xl font-black text-slate-100 italic group-hover:text-slate-200 transition-colors">{item.num}</div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 mb-4 font-montserrat uppercase tracking-tight italic">{item.title}</h3>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
                <div className={`w-12 h-1 bg-${item.color}-500 rounded-full group-hover:w-full transition-all duration-700`} />
             </div>
           ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-40 px-6 relative z-10 text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-montserrat font-black mb-12 uppercase italic leading-tight">Ready to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Launch?</span></h2>
            <p className="text-white/40 text-xl md:text-2xl mb-16 font-medium max-w-2xl mx-auto">Join the next wave of global unicorns today.</p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
               <button 
                 onClick={() => setRegisterModalOpen(true)}
                 className="h-20 px-16 rounded-[2rem] bg-white text-black font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
               >
                 Register Now
               </button>
               <Link href="/tools">
                 <button className="h-20 px-16 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all">View Arsenal</button>
               </Link>
            </div>
         </div>
      </section>
      
      <style jsx global>{`
        .text-glow-gold {
          text-shadow: 0 0 20px rgba(255,184,0,0.3);
        }
      `}</style>
    </div>
  );
}

function FeaturedToolsGrid() {
  const [tools, setTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTopTools() {
      try {
        const { data } = await supabase
          .from('tools_cards')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });
        setTools(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTopTools();
  }, []);

  if (loading) {
    return [1, 2, 3].map(i => (
      <div key={i} className="h-80 rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
    ));
  }

  return tools.map((tool) => (
    <Link 
      key={tool.id}
      href="/tools"
      className="group bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all relative overflow-hidden flex flex-col justify-between min-h-[400px] shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity" />
      
      <div>
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform overflow-hidden">
          {tool.image_url ? (
            <Image src={tool.image_url} alt={tool.title} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <Wrench className="w-8 h-8 text-cyan-500" />
          )}
        </div>
        <h3 className="text-2xl font-montserrat font-black text-white mb-4 italic uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
        <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-3 mb-8">{tool.description}</p>
      </div>

      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{tool.category}</span>
         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
            <ArrowRight className="w-5 h-5" />
         </div>
      </div>
    </Link>
  ));
}
