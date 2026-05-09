"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Mail, Phone, Lock, ArrowRight, Loader2, 
  ShieldCheck, X, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setRegisterModalOpen, login } = useAuth();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState(1); // 1: Input, 2: Password/OTP
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // Reset state when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      setStep(1);
      setError(null);
      setSuccess(null);
      setInputValue('');
      setPassword('');
      setOtp('');
      setTimer(0);
    }
  }, [isLoginModalOpen]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!inputValue) {
      setError(`Please enter your ${method}`);
      return;
    }
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      if (method === 'email') {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: inputValue,
          password: password,
        });
        if (authError) throw authError;
      } else {
        // Phone/OTP Login
        const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
          phone: inputValue,
        });
        if (otpError) throw otpError;
        setTimer(120); // 2 minute countdown
        setSuccess("OTP Protocol Initiated. Check your device.");
        return;
      }

      // Note: AuthContext useEffect will pick up the new session and update the UI
      setLoginModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = method === 'email' ? { email: inputValue } : { phone: inputValue };
      const { error: otpError } = await supabase.auth.signInWithOtp(payload);
      if (otpError) throw otpError;
      setTimer(120);
      setSuccess("New credentials dispatched to your terminal.");
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
                {/* Method Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'email' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Email
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${method === 'phone' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Phone
                  </button>
                </div>

                <div className="relative group">
                  {method === 'email' ? <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" /> : <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />}
                  <input 
                    required
                    type={method === 'email' ? 'email' : 'tel'} 
                    placeholder={method === 'email' ? 'your@email.com' : '+1 (555) 000-0000'}
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
                      {method === 'email' ? <Mail className="w-4 h-4 text-slate-400" /> : <Phone className="w-4 h-4 text-slate-400" />}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Credential</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{inputValue}</p>
                   </div>
                   <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-cyan-600 uppercase">Change</button>
                </div>

                <div className="space-y-4">
                  {method === 'email' ? (
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
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <input 
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xl font-bold focus:outline-none focus:border-black transition-all"
                            value={otp[i-1] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.length <= 1) {
                                const newOtp = otp.split('');
                                newOtp[i-1] = val;
                                setOtp(newOtp.join(''));
                              }
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col items-center gap-2 pt-2">
                        {timer > 0 ? (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Resend Protocol available in {formatTime(timer)}
                          </p>
                        ) : (
                          <button 
                            type="button"
                            onClick={resendOTP}
                            className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest hover:text-black transition-colors"
                          >
                            Resend Verification Code
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {success && <p className="text-emerald-600 text-[10px] font-bold uppercase text-center">{success}</p>}
                {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

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
