"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Loader2, ShieldCheck, Lock, CreditCard, 
  ArrowLeft, Zap, CheckCircle, Sparkles,
  ShieldAlert, Fingerprint, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CheckoutPage: A high-end, premium checkout experience.
 * Features advanced glassmorphism, secure aesthetic, and dynamic feedback.
 */
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
          // Wait a bit if SDK is not yet loaded
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!(window as any).Cashfree) {
          throw new Error('Payment gateway failed to initialize. Please refresh.');
        }

        const cashfree = new (window as any).Cashfree({
          mode: "sandbox" // Change to "production" for real payments
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
    <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-inter">
      
      {/* --- BACKGROUND AESTHETICS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/10 mb-8 shadow-2xl relative group">
             <div className="absolute inset-0 bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <Zap className="w-10 h-10 text-cyan-400 relative z-10" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-white/40">
            <Lock className="w-3 h-3" /> Secure Transaction Layer
          </div>
          <h1 className="text-4xl md:text-5xl font-inter font-black tracking-tight mb-4 uppercase italic">
            Propel <span className="text-cyan-500">Secure</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-wide">
            Finalizing secure handshake for session <span className="font-mono text-cyan-500/80">{orderId?.slice(0, 8)}</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {initializing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10"
              >
                <div className="relative mb-10">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-20 h-20 border-t-2 border-r-2 border-cyan-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-white/20 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Initializing Vault</h3>
                <p className="text-white/30 text-xs font-medium uppercase tracking-[0.2em] animate-pulse">Syncing with Cashfree PG...</p>
                
                <div className="mt-12 w-full space-y-4 opacity-30">
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="h-full w-1/3 bg-cyan-500"
                      />
                   </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Integrity Error</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-10 px-4">{error}</p>
                <button 
                  onClick={() => router.push('/tools')}
                  className="group relative inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 group-hover:text-white flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Orbit
                  </span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                   <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 italic">Handshake Success</h3>
                <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em] mb-10 leading-relaxed">
                  Encryption Layer Active. <br/> Redirecting to Payment Terminal.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 mx-auto text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" /> Manual Refresh
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-12 flex justify-between items-center px-10 opacity-30">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">Premium Access</span>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-orange-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">End-to-End</span>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Text */}
      <div className="absolute -left-12 top-1/2 -rotate-90 text-[100px] font-black text-white/[0.02] pointer-events-none uppercase tracking-tighter">
        PROPULSION
      </div>
      <div className="absolute -right-12 top-1/2 rotate-90 text-[100px] font-black text-white/[0.02] pointer-events-none uppercase tracking-tighter">
        ECOSYSTEM
      </div>
    </div>
  );
}
