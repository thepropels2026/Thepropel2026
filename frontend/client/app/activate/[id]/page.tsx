"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ExternalLink, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { API_BASE_URL } from '../../lib/api';

/**
 * ActivationPage: The premium landing page after a successful purchase.
 * Features a "System Authorized" aesthetic with consistent brand identity.
 */
export default function ActivationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate premium handshake delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [orderId]);

  const handleActivate = () => {
    // Redirect to backend masked redirector
    window.location.href = `${API_BASE_URL}/api/activate/${orderId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center gap-10 font-inter">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-24 h-24 border-t-2 border-cyan-500 rounded-full"
          />
          <Zap className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="text-center">
           <p className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2 animate-pulse">Syncing Propulsion Layer</p>
           <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Handshaking with Authorization Vault</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-inter">
      
      {/* --- BACKGROUND SYSTEM --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-cyan-500/[0.05] rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-purple-500/[0.05] rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-w-2xl w-full text-center bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-12 md:p-20 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
      >
        {/* Inner Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Success Icon */}
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl group">
          <CheckCircle className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] mb-6 text-white/40">
           <Sparkles className="w-3 h-3 text-cyan-500" /> Identity Authenticated
        </div>

        <h1 className="text-5xl md:text-6xl font-black font-inter mb-6 tracking-tighter leading-tight italic">
          Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Authorized.</span>
        </h1>
        
        <p className="text-white/40 text-base md:text-lg mb-14 max-w-sm mx-auto font-medium leading-relaxed">
          Your premium protocol has been provisioned. Initiate the final handshake to unlock your ecosystem assets.
        </p>

        <div className="space-y-10">
          <button 
            onClick={handleActivate}
            className="group relative w-full h-20 rounded-3xl bg-white text-black font-black flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
            <span className="text-lg uppercase tracking-widest relative z-10 group-hover:text-white transition-colors">Activate Propulsion</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </button>
          
          <Link href="/tools" className="inline-flex items-center gap-3 text-white/20 hover:text-cyan-400 transition-all text-[10px] font-black uppercase tracking-[0.4em] group">
             Return to Marketplace <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-3 gap-6">
          <div className="text-left">
            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest block mb-1">Ref ID</span>
            <span className="text-[10px] font-mono text-white/40">{orderId.slice(0, 12).toUpperCase()}</span>
          </div>
          <div className="text-center">
            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest block mb-1">Security</span>
            <span className="text-[10px] font-black text-cyan-500/60 uppercase">AES-256 SSL</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-white/20 uppercase font-black tracking-widest block mb-1">Tier</span>
            <span className="text-[10px] font-black text-white/60 uppercase">Elite</span>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Status Bar */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 opacity-10 pointer-events-none">
        <div className="flex gap-1.5">
          {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-6 bg-cyan-500" />)}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.6em]">System Online</span>
      </div>
    </div>
  );
}
