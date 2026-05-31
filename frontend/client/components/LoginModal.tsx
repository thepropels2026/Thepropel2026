"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Mail, ArrowRight, Loader2, 
  ShieldCheck, X, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setRegisterModalOpen, syncUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Email Input, 2: OTP Input
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      setStep(1);
      setError(null);
      setSuccess(null);
      setInputValue('');
      setOtp('');
    }
  }, [isLoginModalOpen]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!inputValue) {
      setError(`Please enter your email`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: inputValue,
      });
      if (authError) throw authError;
      
      setSuccess("OTP sent successfully. Please check your inbox.");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email: inputValue,
        token: otp,
        type: 'email'
      });
      
      if (authError) throw authError;

      // Actively sync the user profile into the app context immediately
      if (authData.user) {
        await syncUser(authData.user);
      }
      
      setLoginModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setLoginModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header Decor */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
        

        <button 
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 flex flex-col h-full">
          {/* Brand/Title */}
          <div className="mb-10 text-center">
             <div className="inline-flex p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                <ShieldCheck className="w-6 h-6 text-black" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Secure Login</h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Authenticate via One-Time Password.</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                  <input 
                    required
                    type="email" 
                    placeholder="your@email.com"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-14 text-sm font-semibold text-slate-900 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                  />
                </div>

                {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
                {success && <p className="text-emerald-600 text-[10px] font-bold uppercase text-center">{success}</p>}

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-400" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent To</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{inputValue}</p>
                   </div>
                   <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-cyan-600 uppercase">Change</button>
                </div>

                <div className="space-y-4">
                  <input 
                    required
                    type="text"
                    maxLength={8}
                    placeholder="Enter 8-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-center text-xl tracking-[0.5em] placeholder:tracking-normal placeholder:font-medium font-bold text-slate-900 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                  />
                </div>

                {success && <p className="text-emerald-600 text-[10px] font-bold uppercase text-center">{success}</p>}
                {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

                <button 
                  disabled={isSubmitting || otp.length < 6}
                  type="submit"
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Verify & Establish Session
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
             <p className="text-xs font-medium text-slate-500">
                New to the platform?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="text-black font-bold hover:underline"
                >
                  Initialize Registration
                </button>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
