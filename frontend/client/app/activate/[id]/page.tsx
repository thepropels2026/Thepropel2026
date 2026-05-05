"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, ShieldCheck, Zap, ArrowRight, Loader2, 
  Sparkles, Fingerprint, Lock, Globe, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate system verification
    const timer = setTimeout(() => setVerifying(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            <ShieldCheck className="w-3 h-3" /> System Authorization
          </div>
          <h1 className="text-5xl md:text-6xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
            Propulsion <br/>
            <span className="relative text-cyan-500">
              Active.
              <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#FF5F00" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {verifying ? (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10"
              >
                <div className="relative mb-12">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                     className="w-24 h-24 border-t-4 border-r-4 border-cyan-500 rounded-full"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Fingerprint className="w-10 h-10 text-slate-200 animate-pulse" />
                   </div>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Securing Assets</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Order {orderId?.slice(0,8)}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
                   <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6">Mission Authorized</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12">
                   Your toolkit has been provisioned. Credentials and access keys have been dispatched to your registered terminal.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                      <Lock className="w-5 h-5 text-cyan-600 mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vault Access</span>
                      <span className="text-xs font-black text-slate-800">ENABLED</span>
                   </div>
                   <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                      <Globe className="w-5 h-5 text-orange-600 mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Network Sync</span>
                      <span className="text-xs font-black text-slate-800">ACTIVE</span>
                   </div>
                </div>

                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Enter Profile Vault <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 flex justify-center items-center gap-12 opacity-20">
           <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Receipt Sent</span>
           </div>
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">Elite Status Unlocked</span>
           </div>
        </div>
      </motion.div>

      {/* Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -rotate-90 text-[120px] font-black text-white/[0.02] pointer-events-none uppercase tracking-tighter">
         AUTHORIZED
      </div>
    </div>
  );
}
