"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Mail, Phone, Lock, User, 
  Calendar, Users, Loader2, Check, X, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterModal() {
  const { isRegisterModalOpen, setRegisterModalOpen, login } = useAuth();
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
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Faster simulation
      login({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
        picture: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
      });
      setRegisterModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 font-roboto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setRegisterModalOpen(false)}
        className="absolute inset-0 bg-[#080808]/90 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0f] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Close Button */}
        <button 
          onClick={() => setRegisterModalOpen(false)}
          className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT PANEL --- */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden bg-gradient-to-br from-cyan-950/20 to-transparent border-r border-white/5">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-medium uppercase tracking-[0.3em] mb-10">
                <Zap className="w-3 h-3" /> System Onboarding
              </div>
              <h2 className="text-5xl font-montserrat font-black text-white mb-8 leading-[1.1] tracking-tighter">
                Enter The <br/>
                <span className="text-cyan-500">Propels Node.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed italic max-w-sm">
                Join the elite handshake protocol. We parse intent, optimize trajectory, and scale impact.
              </p>
           </motion.div>
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className="flex-1 bg-white flex flex-col p-8 md:p-14 relative overflow-y-auto">
           {/* Progress Indicator */}
           <div className="flex items-center justify-between relative mb-14 px-4 max-w-md mx-auto w-full">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-slate-200 -z-0" />
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all duration-300 shadow-lg ${step >= num ? 'bg-black text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>
                   {num}
                </div>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Personal Identity</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 1 of 5: Name Identification</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="text" name="firstName" placeholder="First Name" 
                          value={formData.firstName} onChange={handleInputChange}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="text" name="lastName" placeholder="Last Name" 
                          value={formData.lastName} onChange={handleInputChange}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all placeholder:text-slate-300"
                        />
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => {/* Login Logic */}} 
                        className="flex-1 h-14 border-2 border-black text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300"
                      >
                        Login
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.firstName || !formData.lastName}
                        className="flex-[2] h-14 bg-black border-2 border-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30"
                      >
                        Next Protocol <ArrowRight className="inline ml-2 w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Demographics</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 2 of 5: DOB & Gender</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input 
                          required type="date" name="dob" 
                          value={formData.dob} onChange={handleInputChange}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <select 
                          required name="gender" 
                          value={formData.gender} onChange={handleInputChange}
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button onClick={prevStep} className="flex-1 h-14 border-2 border-black text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300">Back</button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.dob || !formData.gender}
                        className="flex-[2] h-14 bg-black border-2 border-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30"
                      >
                        Next Protocol <ArrowRight className="inline ml-2 w-4 h-4" />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Communication</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 3 of 5: Contact Identifiers</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all" />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="tel" name="mobile" placeholder="Mobile (+91)" value={formData.mobile} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all" />
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button onClick={prevStep} className="flex-1 h-14 border-2 border-black text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300">Back</button>
                      <button 
                        onClick={sendOTPs} disabled={isSubmitting || !formData.email || !formData.mobile}
                        className="flex-[2] h-14 bg-black border-2 border-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send Dual Verification"}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Dual Verification</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 4 of 5: Dual OTP Check</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center block">Email OTP</label>
                         <input 
                            required maxLength={6} name="emailOtp" placeholder="000000" 
                            value={formData.emailOtp} onChange={handleInputChange}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold text-slate-900 focus:border-black outline-none transition-all" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center block">Mobile OTP</label>
                         <input 
                            required maxLength={6} name="mobileOtp" placeholder="000000" 
                            value={formData.mobileOtp} onChange={handleInputChange}
                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold text-slate-900 focus:border-black outline-none transition-all" 
                         />
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button onClick={prevStep} className="flex-1 h-14 border-2 border-black text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300">Back</button>
                      <button 
                        onClick={verifyOTPs} disabled={isSubmitting || formData.emailOtp.length < 6 || formData.mobileOtp.length < 6}
                        className="flex-[2] h-14 bg-black border-2 border-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify Identity"}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-none mb-2">Security Access</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 5 of 5: Secure Password</p>
                   </div>

                   <div className="space-y-4">
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all" />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                        <input required type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-16 text-sm font-medium text-slate-800 focus:outline-none focus:border-black transition-all" />
                      </div>
                   </div>

                   {error && <p className="text-center text-red-500 text-[10px] font-bold uppercase">{error}</p>}

                   <div className="flex gap-4 pt-4">
                      <button onClick={prevStep} className="flex-1 h-14 border-2 border-black text-black rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300">Back</button>
                      <button 
                        onClick={finalizeRegistration} disabled={isSubmitting || !formData.password || formData.password !== formData.confirmPassword}
                        className="flex-[2] h-14 bg-black border-2 border-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Complete Handshake"}
                      </button>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="mt-auto pt-8 text-center border-t border-slate-100">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Sovereign Identity Protection Enabled</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
