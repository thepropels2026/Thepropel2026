"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Lock, CreditCard, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * CheckoutPage: A focused, minimalist white checkout experience.
 * Initiates the Cashfree payment sequence in a clean environment.
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
          await new Promise(resolve => setTimeout(resolve, 1000));
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Branding/Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 mb-6 shadow-sm">
             <Zap className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">Secure Payment</h1>
          <p className="text-slate-500 text-sm font-medium">Processing Order <span className="font-mono text-slate-900">{orderId?.slice(0, 10)}</span></p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {initializing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8"
              >
                <div className="relative mb-6">
                  <div className="w-12 h-12 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                </div>
                <p className="text-slate-900 font-bold text-sm animate-pulse">Initializing Secure Gateway...</p>
                <p className="text-slate-400 text-xs mt-2">Please do not refresh this page.</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button 
                  onClick={() => router.push('/tools')}
                  className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl text-xs hover:bg-slate-800 transition-all"
                >
                  Return to Tools
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-900 font-bold mb-2 text-sm uppercase tracking-widest">Gateway Ready</p>
                <p className="text-slate-500 text-xs">A new window should open for payment. If not, please click below.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-900">SSL Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-900">Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-900">Authorized</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          background-color: #fff !important;
        }
      `}</style>
    </div>
  );
}

// Minimal AnimatePresence mock if not available (should be from framer-motion)
import { AnimatePresence } from 'framer-motion';
