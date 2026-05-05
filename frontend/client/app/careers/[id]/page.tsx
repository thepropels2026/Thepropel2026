"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { 
  MapPin, Briefcase, Clock, ArrowLeft, Building, 
  CheckCircle2, Download, Users, Sparkles, ShieldCheck,
  Zap, Loader2, ArrowRight, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Job = {
  id: string;
  title: string;
  description: string;
  role: string;
  qualification: string;
  eligibility: string;
  stipend: string;
  work_duration: string;
  location: string;
  mode: string;
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Form/OTP, 3: Success

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
       <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white">
       <h1 className="text-4xl font-black mb-4">404: ROLE NOT FOUND</h1>
       <button onClick={() => router.push('/careers')} className="text-cyan-500 underline uppercase tracking-widest text-[10px] font-black">Return to HQ</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Job Content */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Zap className="w-3 h-3" /> System Authorized Role
              </div>
              <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
                {job.title} <br/>
                <span className="relative text-cyan-500">
                  {job.role}
                  <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#FF5F00" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                  </svg>
                </span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
               {[
                 { label: 'Location', val: job.location, icon: <MapPin className="w-4 h-4" /> },
                 { label: 'Duration', val: job.work_duration, icon: <Clock className="w-4 h-4" /> },
                 { label: 'Stipend', val: job.stipend, icon: <Zap className="w-4 h-4" /> },
                 { label: 'Qualification', val: job.qualification, icon: <ShieldCheck className="w-4 h-4" /> },
                 { label: 'Mode', val: job.mode, icon: <Globe className="w-4 h-4" /> },
                 { label: 'Network', val: 'Founders Circle', icon: <Users className="w-4 h-4" /> }
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="text-white/20 mb-4 group-hover:text-cyan-500 transition-colors">{item.icon}</div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-black text-white/80">{item.val}</p>
                 </div>
               ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-12 bg-white/[0.02] border border-white/5 p-12 rounded-[3rem]"
            >
               <section>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6 italic text-cyan-400">The Mission</h3>
                  <p className="text-white/50 text-lg leading-relaxed font-medium italic">"{job.description}"</p>
               </section>
               
               <section>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6 italic text-cyan-400">Prerequisites</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {job.eligibility.split('\n').map((item, i) => (
                       <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="text-sm text-white/60 font-medium">{item}</span>
                       </div>
                     ))}
                  </div>
               </section>
            </motion.div>
          </div>

          {/* Right Column: Application Card */}
          <div className="lg:col-span-5">
             <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-8">
                      <Sparkles className="w-8 h-8 text-slate-100" />
                   </div>
                   
                   <h3 className="text-3xl font-black font-montserrat mb-8 italic uppercase tracking-tighter">Initiate <br/>Application</h3>
                   
                   <div className="space-y-8 mb-12">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <Fingerprint className="w-6 h-6 text-cyan-600" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Verification</p>
                            <p className="text-sm font-black text-slate-800">OTP Handshake Required</p>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                            <span>Platform Fee</span>
                            <span>Included</span>
                         </div>
                         <div className="flex justify-between items-center text-2xl font-black uppercase tracking-tighter">
                            <span>Sovereign Access</span>
                            <span className="text-cyan-600">FREE</span>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setStep(2)}
                     className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
                   >
                     Begin Protocol <ArrowRight className="w-5 h-5" />
                   </button>
                   
                   <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                      Secured by The Propels Infrastructure
                   </p>
                </motion.div>
                
                <div className="mt-8 p-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] text-center">
                   <Users className="w-12 h-12 text-white/20 mx-auto mb-6" />
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Network Access</p>
                   <p className="text-sm font-black text-white/60 mt-2 italic">Connect with 1,200+ elite founders upon successful onboarding.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Application Overlay (Step 2) */}
      <AnimatePresence>
         {step === 2 && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[110] bg-[#080808]/95 backdrop-blur-xl flex items-center justify-center p-6"
           >
              <div className="max-w-2xl w-full bg-white rounded-[40px] p-12 relative">
                 <button onClick={() => setStep(1)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
                 
                 <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-cyan-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                       <Zap className="w-10 h-10 text-cyan-600" />
                    </div>
                    <h2 className="text-4xl font-black font-montserrat text-slate-900 italic uppercase tracking-tighter">Identity Sync</h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-4">Verification required to proceed</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name</label>
                       <input type="text" placeholder="Founders Name" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Contact Terminal (Mobile)</label>
                       <div className="flex gap-4">
                          <input type="text" placeholder="+91" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all" />
                          <button className="h-16 px-10 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Send OTP</button>
                       </div>
                    </div>
                    
                    <button onClick={() => setStep(3)} className="w-full h-20 bg-cyan-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm mt-8 shadow-lg shadow-cyan-200">
                       Submit Intelligence
                    </button>
                 </div>
              </div>
           </motion.div>
         )}
         
         {step === 3 && (
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[110] bg-[#080808]/95 backdrop-blur-xl flex items-center justify-center p-6"
           >
              <div className="max-w-xl w-full bg-white rounded-[40px] p-16 text-center">
                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                 </div>
                 <h2 className="text-4xl font-black font-montserrat text-slate-900 italic uppercase tracking-tighter">Mission Accepted</h2>
                 <p className="text-slate-400 text-sm font-medium mt-6 leading-relaxed">
                    Your credentials have been synced with our propulsion servers. Our team will contact your terminal within 24 standard hours.
                 </p>
                 <button onClick={() => router.push('/careers')} className="mt-12 h-16 px-12 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                    Return to Mission Control
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
