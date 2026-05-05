"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Loader2, ShieldCheck, Lock, CreditCard, 
  ArrowLeft, Zap, CheckCircle, Sparkles,
  ShieldAlert, Fingerprint, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = params.id as string;
  const sessionId = searchParams.get('session');
  
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid checkout session. Please try again from the marketplace.');
      setInitializing(false);
      return;
    }

    const startPayment = async () => {
      try {
        if (!(window as any).Cashfree) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!(window as any).Cashfree) {
          throw new Error('Payment gateway failed to initialize. Please refresh.');
        }

        const cashfree = new (window as any).Cashfree({
          mode: "sandbox" 
        });

        await cashfree.checkout({
          paymentSessionId: sessionId,
          returnUrl: `${window.location.origin}/activate/{order_id}`
        });

      } catch (err: any) {
        console.error('Payment Error:', err);
        setError(err.message || 'Payment initialization failed.');
      } finally {
        setInitializing(false);
      }
    };

    startPayment();
  }, [sessionId]);

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
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 mb-10 shadow-2xl relative group">
             <div className="absolute inset-0 bg-cyan-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <Lock className="w-10 h-10 text-cyan-400 relative z-10" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] mb-6 text-cyan-500/80">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Handshake Protocol
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-black tracking-tighter mb-4 italic uppercase">
            Propel <span className="relative">
              Secure.
              <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 5C20 0 40 10 60 5C80 0 100 10 120 5" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-8">
            Session Alpha: <span className="text-white/60">{orderId?.slice(0, 12).toUpperCase()}</span>
          </p>
        </div>

        {/* Main Vault Card */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 md:p-16 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          
          <AnimatePresence mode="wait">
            {initializing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <div className="relative mb-12">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-24 h-24 border-t-4 border-r-4 border-cyan-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-10 h-10 text-white/10 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Initializing Vault</h3>
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Establishing Peer-to-Peer Encryption</p>
                
                <div className="mt-16 w-full opacity-20">
                   <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="h-full w-1/3 bg-cyan-500"
                      />
                   </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Handshake Failed</h2>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-12 italic">"{error}"</p>
                <button 
                  onClick={() => router.push('/tools')}
                  className="w-full h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-4"
                >
                  <ArrowLeft className="w-5 h-5" /> Return to Marketplace
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                   <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Vault Ready</h3>
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-12">Redirecting to Payment Terminal Alpha</p>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-3 mx-auto text-cyan-400/60 hover:text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Force Handshake
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Manifest */}
        <div className="mt-16 flex justify-center gap-12 opacity-20">
           {[
             { icon: <ShieldCheck className="w-5 h-5" />, label: 'PCI-DSS' },
             { icon: <Sparkles className="w-5 h-5" />, label: 'PREMIUM' },
             { icon: <Lock className="w-5 h-5" />, label: 'END-TO-END' }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{item.label}</span>
             </div>
           ))}
        </div>
      </motion.div>

      {/* Background Typography */}
      <div className="absolute bottom-20 left-10 -rotate-90 text-[120px] font-black text-white/[0.01] pointer-events-none uppercase tracking-tighter select-none">
        ENCRYPTED
      </div>
      <div className="absolute top-20 right-10 rotate-90 text-[120px] font-black text-white/[0.01] pointer-events-none uppercase tracking-tighter select-none">
        AUTHORIZED
      </div>
    </div>
  );
}
