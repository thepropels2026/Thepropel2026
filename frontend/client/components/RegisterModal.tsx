"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Mail, Phone, User, 
  Calendar, Users, Loader2, Check, X, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function RegisterModal() {
  const { isRegisterModalOpen, setRegisterModalOpen, setLoginModalOpen, syncUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleResendOtp = async (e: any) => {
    e.preventDefault();
    if (!canResend) return;
    setIsSendingOtp(true);
    setError(null);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
      });
      if (otpError) throw otpError;
      setCountdown(30);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  useEffect(() => {
    if (isRegisterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRegisterModalOpen]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    mobile: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(1, step - 1));

  const sendOtpAndProceed = async (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSendingOtp(true);
    setError(null);
    try {
      // 1. Identity Check
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        alert("This identity is already registered. Redirecting to login...");
        setRegisterModalOpen(false);
        setLoginModalOpen(true);
        return;
      }

      // 2. Send OTP via Supabase Passwordless
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
      });
      if (otpError) throw otpError;
      
      setCountdown(30);
      setCanResend(false);
      nextStep(); // Move to Step 4 (OTP input)
    } catch (err: any) {
      setError(err.message || "Failed to initiate verification.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const registerUser = async () => {
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Verify OTP using Supabase Passwordless
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: 'email'
      });

      if (authError) {
        throw authError;
      }
      
      // 2. Insert into profiles manually since Supabase triggered might not catch all fields on OTP signup
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          dob: formData.dob ? formData.dob : null,
          gender: formData.gender ? formData.gender : null,
          is_email_verified: true
        });
        if (profileError && profileError.code !== '23505') {
            console.warn("Profile insertion warning:", profileError);
        }
        setVerifiedUser(authData.user);
      }

      nextStep(); // Move to step 5 (Success)
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Invalid OTP. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInitialization = async () => {
    if (verifiedUser) {
      await syncUser(verifiedUser);
    }
    setRegisterModalOpen(false);
  };

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 font-inter">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setRegisterModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Close Button */}
        <button 
          onClick={() => setRegisterModalOpen(false)}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT PANEL --- */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden bg-slate-50 border-r border-slate-100">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
           >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-8">
                <Zap className="w-3 h-3 text-orange-500" /> System Onboarding
              </div>
              <h2 className="text-4xl font-bold text-[rgba(0,0,0,0.9)] mb-6 leading-tight tracking-tight">
                Enter The <br/>
                <span className="text-orange-600">Propels Node.</span>
              </h2>
              <p className="text-[rgba(0,0,0,0.6)] text-base font-medium leading-relaxed max-w-sm">
                Join the elite handshake protocol. Passwordless, secure, and instantaneous.
              </p>
           </motion.div>
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className="flex-1 bg-white flex flex-col p-8 md:p-14 relative overflow-y-auto">
           {/* Progress Indicator */}
           <div className="flex items-center justify-between relative mb-12 px-4 max-w-md mx-auto w-full">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-slate-100 -z-0" />
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all duration-300 ${step >= num ? 'bg-black text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>
                   {num}
                </div>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Personal Identity</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 1 of 4: Name Identification</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="text" name="firstName" placeholder="First Name" 
                          value={formData.firstName} onChange={handleInputChange}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="text" name="lastName" placeholder="Last Name" 
                          value={formData.lastName} onChange={handleInputChange}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all placeholder:text-slate-400"
                        />
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => {
                          setRegisterModalOpen(false);
                          setLoginModalOpen(true);
                        }} 
                        className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all duration-300"
                      >
                        Login
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.firstName || !formData.lastName}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all duration-300 disabled:opacity-30"
                      >
                        Next Protocol <ArrowRight className="inline ml-1.5 w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Demographics</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 2 of 4: DOB & Gender</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="date" name="dob" 
                          value={formData.dob} onChange={handleInputChange}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <select 
                          required name="gender" 
                          value={formData.gender} onChange={handleInputChange}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.dob || !formData.gender}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30"
                      >
                        Next Protocol <ArrowRight className="inline ml-1.5 w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Contact Details</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 3 of 4: Secure Verification</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                   </div>

                   {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={sendOtpAndProceed}
                        disabled={isSendingOtp || !formData.email || !formData.mobile}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">OTP Verification</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 4 of 4: Enter 6-digit code</p>
                   </div>

                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                         <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent To</p>
                         <p className="text-xs font-bold text-slate-900 truncate">{formData.email}</p>
                      </div>
                      <button type="button" onClick={() => setStep(3)} className="text-[10px] font-bold text-cyan-600 uppercase hover:underline">Change</button>
                   </div>

                   <div className="space-y-4">
                      <input 
                        type="text" maxLength={6} placeholder="Enter 6-Digit Code"
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-center text-xl tracking-[0.5em] font-bold text-[rgba(0,0,0,0.9)] focus:outline-none focus:border-black transition-all"
                      />
                   </div>

                   {/* Countdown and Resend */}
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                     {countdown > 0 ? (
                       <span className="text-slate-400">Resend available in {countdown}s</span>
                     ) : (
                       <button onClick={handleResendOtp} disabled={isSendingOtp} className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
                         {isSendingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : "Resend OTP"}
                       </button>
                     )}
                   </div>

                   {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center mt-2">{error}</p>}

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={registerUser}
                        disabled={isSubmitting || otp.length < 6}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Complete <Check className="w-4 h-4" /></>}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
                   <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-emerald-500" />
                   </div>
                   <h3 className="text-3xl font-bold text-[rgba(0,0,0,0.9)]">Identity Verified</h3>
                   <p className="text-slate-500 text-sm max-w-sm mx-auto">Your access node has been provisioned. You are now securely logged in.</p>
                   
                   <button 
                     onClick={completeInitialization}
                     className="mt-8 px-10 h-12 bg-black text-white rounded-xl font-bold text-xs shadow-xl shadow-black/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                   >
                     Complete Initialization
                   </button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
