"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Mail, Phone, Lock, User, 
  Calendar, Users, Loader2, Check, X, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function RegisterModal() {
  const { isRegisterModalOpen, setRegisterModalOpen, setLoginModalOpen, login } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock scroll while registration modal is active
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

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    emailOtp: '',
    mobileOtp: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(1, step - 1));

  const sendOTPs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Faster simulation
      nextStep();
    } catch (err: any) {
      setError("Failed to send verification codes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTPs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Faster simulation
      nextStep();
    } catch (err: any) {
      setError("OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Check if user already exists in profiles (Pre-check)
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      // If checkError is PGRST116, it means no user was found, which is fine
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Profile check error:", checkError);
        // If it's a network error, it will likely have an empty message or "Failed to fetch"
        throw new Error(checkError.message || "Network error during identity verification");
      }

      if (existingUser) {
        alert("This identity is already active in the network. Redirecting to login...");
        setRegisterModalOpen(false);
        setLoginModalOpen(true);
        return;
      }

      // 2. Supabase Auth Registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile: formData.mobile,
            dob: formData.dob,
            gender: formData.gender
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered") || authError.status === 400) {
          alert("This identity is already active in the auth system. Redirecting to login...");
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Authentication failed: No user data returned");
      }

      // 3. Success! 
      // The database trigger 'on_auth_user_created' will automatically create the profile record.
      // We can now close the modal. The AuthContext will pick up the new session.
      alert("Registration successful! Welcome to The Propels.");
      setRegisterModalOpen(false);
    } catch (err: any) {
      console.error("Registration error details:", err);
      setError(err.message || "Registration failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
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
                Join the elite handshake protocol. We parse intent, optimize trajectory, and scale impact.
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
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 1 of 5: Name Identification</p>
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
                        onClick={() => {/* Login Logic */}} 
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
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 2 of 5: DOB & Gender</p>
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
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Communication</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 3 of 5: Contact Identifiers</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="tel" name="mobile" placeholder="Mobile (+91)" value={formData.mobile} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={sendOTPs} disabled={isSubmitting || !formData.email || !formData.mobile}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send Dual Verification"}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Dual Verification</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 4 of 5: Dual OTP Check</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider text-center block">Email OTP</label>
                         <input 
                            required maxLength={6} name="emailOtp" placeholder="000000" 
                            value={formData.emailOtp} onChange={handleInputChange}
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold text-[rgba(0,0,0,0.9)] focus:border-black outline-none transition-all" 
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider text-center block">Mobile OTP</label>
                         <input 
                            required maxLength={6} name="mobileOtp" placeholder="000000" 
                            value={formData.mobileOtp} onChange={handleInputChange}
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold text-[rgba(0,0,0,0.9)] focus:border-black outline-none transition-all" 
                         />
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={verifyOTPs} disabled={isSubmitting || formData.emailOtp.length < 6 || formData.mobileOtp.length < 6}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify Identity"}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[rgba(0,0,0,0.9)] mb-1">Security Access</h3>
                      <p className="text-xs font-semibold text-[rgba(0,0,0,0.5)]">Step 5 of 5: Secure Password</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 text-sm font-medium text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all" />
                      </div>
                   </div>

                   {error && <p className="text-center text-red-600 text-[10px] font-bold uppercase">{error}</p>}

                   <div className="flex gap-3 pt-4">
                      <button onClick={prevStep} className="flex-1 h-12 border border-slate-200 text-[rgba(0,0,0,0.8)] rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Back</button>
                      <button 
                        onClick={finalizeRegistration} disabled={isSubmitting || !formData.password || formData.password !== formData.confirmPassword}
                        className="flex-[2] h-12 bg-black text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Complete Handshake"}
                      </button>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="mt-auto pt-6 text-center border-t border-slate-100">
              <p className="text-[10px] font-bold text-[rgba(0,0,0,0.3)] uppercase tracking-wider">Sovereign Identity Protection Enabled</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
