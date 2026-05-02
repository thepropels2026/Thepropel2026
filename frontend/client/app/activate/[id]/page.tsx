"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * ActivationPage: The secure landing page after a successful purchase.
 * Features the "Invisible Coupon Injection" trigger.
 */
export default function ActivationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate a brief validation delay for UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [orderId]);

  const handleActivate = () => {
    // Redirect to backend masked redirector
    // This uses a Server-Side Redirect (302) to mask the promo URL from browser history
    window.location.href = `http://localhost:8000/api/activate/${orderId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <Zap className="absolute inset-0 m-auto w-8 h-8 text-cyan-500 animate-pulse" />
        </div>
        <p className="text-cyan-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative max-w-2xl w-full text-center bg-[#0a0a0f] border border-white/10 rounded-[4rem] p-16 md:p-20 shadow-[0_0_100px_rgba(6,182,212,0.1)] backdrop-blur-3xl"
      >
        {/* Success Icon */}
        <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <CheckCircle className="w-14 h-14 text-emerald-400" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black font-montserrat mb-6 tracking-tighter leading-tight">
          Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Authorized.</span>
        </h1>
        
        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-md mx-auto font-medium leading-relaxed">
          Your premium subscription has been successfully provisioned. Click below to initiate the secure activation sequence.
        </p>

        <div className="space-y-8">
          <button 
            onClick={handleActivate}
            className="group relative w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_20px_60px_-10px_rgba(6,182,212,0.5)] overflow-hidden"
          >
             {/* Button Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
            
            <Zap className="w-7 h-7 fill-current" />
            <span className="text-xl tracking-tight">ACTIVATE PREMIUM NOW</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center gap-4">
            <Link href="/tools" className="inline-flex items-center gap-2 text-white/30 hover:text-cyan-400 transition-all text-xs font-black uppercase tracking-[0.2em] group">
               Return to Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-3 gap-4 md:gap-12">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[9px] text-white/30 uppercase font-black tracking-widest block mb-2">Order Reference</span>
            <span className="text-xs font-mono text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/5">{orderId.slice(0, 10).toUpperCase()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-white/30 uppercase font-black tracking-widest block mb-2">Encryption</span>
            <div className="flex items-center gap-1.5 text-cyan-500/80">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase">AES-256 SSL</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-[9px] text-white/30 uppercase font-black tracking-widest block mb-2">Access Level</span>
            <span className="text-[10px] font-black text-white/80 bg-white/10 px-3 py-1 rounded-full uppercase tracking-tighter">Elite Premium</span>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Status Bar */}
      <div className="absolute bottom-10 left-10 flex items-center gap-3 opacity-20">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1 h-4 bg-cyan-500" />)}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
      </div>
    </div>
  );
}
