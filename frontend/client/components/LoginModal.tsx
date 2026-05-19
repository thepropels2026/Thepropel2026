"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Mail, Phone, Lock, ArrowRight, Loader2, 
  ShieldCheck, X, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../lib/api';

export default function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setRegisterModalOpen, login } = useAuth();
  const [step, setStep] = useState(1); // 1: Input, 2: Password
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
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
      setPassword('');
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
    
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase to maintain database sync and session
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: inputValue,
        password: password,
      });
      if (authError) throw authError;

      // Ensure profile is verified (assuming triggers didn't block it)
      const { data: profile } = await supabase.from('profiles').select('is_email_verified').eq('id', authData.user?.id).single();
      if (profile && profile.is_email_verified === false) {
          throw new Error("Email not verified. Please verify your email.");
      }

      // Note: AuthContext useEffect will pick up the new session and update the UI
      setLoginModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(inputValue);
      if (resetError) throw resetError;
      setSuccess("Password reset link sent to your email.");
      setTimeout(() => setStep(1), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // You can add logic to call the /send-otp endpoint again
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputValue }),
      });
      if (!res.ok) throw new Error("Failed to resend verification.");
      setSuccess("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
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
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Re-establish your connection to the network.</p>
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

                <button 
                  type="submit"
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                >
                  Initiate Secure Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            ) : step === 2 ? (
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Credential</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{inputValue}</p>
                   </div>
                   <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-cyan-600 uppercase">Change</button>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                    <input 
                      required
                      type="password"
                      placeholder="Enter Secure Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-14 text-sm font-semibold text-slate-900 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => setStep(3)} className="text-[10px] font-bold text-slate-500 hover:text-black uppercase transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {success && <p className="text-emerald-600 text-[10px] font-bold uppercase text-center">{success}</p>}
                {error && (
                  <div className="text-center space-y-2">
                    <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>
                    {error.includes("Email not verified") && (
                      <button type="button" onClick={handleResendVerification} className="text-[10px] font-bold text-cyan-600 uppercase hover:underline">
                        Resend Verification Email
                      </button>
                    )}
                  </div>
                )}

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Verify & Establish Session
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleForgotPassword}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">We'll send a recovery link to your email.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-400" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Credential</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{inputValue}</p>
                   </div>
                   <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-cyan-600 uppercase">Change</button>
                </div>

                {success && <p className="text-emerald-600 text-[10px] font-bold uppercase text-center">{success}</p>}
                {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 h-14 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] h-14 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
             <p className="text-xs font-medium text-slate-500">
                New to the platform?{' '}
                <button 
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
