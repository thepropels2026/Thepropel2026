"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Mail, Phone, Lock, User, 
  Building2, ShieldCheck, Loader2, Check, Globe, Link as LinkIcon,
  FileText, X, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function RegisterModal() {
  const { isRegisterModalOpen, setRegisterModalOpen, login } = useAuth();
  const router = useRouter();
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
    qualification: '',
    email: '',
    mobile: '',
    password: '',
    emailOtp: '',
    mobileOtp: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const sendOTPs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      nextStep();
    } catch (err: any) {
      setError("Failed to send verification codes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock registration - in production use real logic
      login({
        firstName: formData.firstName,
        email: formData.email,
        mobile: formData.mobile,
        picture: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
      });
      // Profiles are usually created on backend or via supabase auth
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRegisterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
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
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0f] border border-white/10 rounded-[40px] shadow-[0_0_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Close Button */}
        <button 
          onClick={() => setRegisterModalOpen(false)}
          className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- LEFT PANEL (AESTHETIC) --- */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden bg-gradient-to-br from-cyan-950/20 to-transparent">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] mb-10">
                <Zap className="w-3 h-3" /> System Onboarding
              </div>
              <h2 className="text-5xl font-montserrat font-black text-white mb-8 leading-[1.1] tracking-tighter italic">
                Enter The <br/>
                <span className="text-cyan-500">Propels Node.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed italic max-w-sm">
                Join the elite handshake protocol. We parse intent, optimize trajectory, and scale impact.
              </p>
           </motion.div>
        </div>

        {/* --- RIGHT PANEL (FORM) --- */}
        <div className="flex-1 bg-white flex flex-col p-10 md:p-16 relative overflow-y-auto">
           {/* Card Progress */}
           <div className="flex items-center justify-between relative mb-16 px-4">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-slate-200 -z-0" />
              {[1, 2, 3].map((num) => (
                <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] relative z-10 transition-all duration-500 shadow-xl ${step >= num ? 'bg-black text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>
                   {num}
                </div>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Identity Marker *</label>
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                        <input 
                          required type="text" name="firstName" placeholder="Legal First Name" 
                          value={formData.firstName} onChange={handleInputChange}
                          className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-16 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-cyan-500 transition-all cursor-pointer group">
                         <LinkIcon className="w-5 h-5 text-slate-300 mb-3 group-hover:text-cyan-600 transition-colors" />
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LinkedIn Sync</p>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-cyan-500 transition-all cursor-pointer group">
                         <FileText className="w-5 h-5 text-slate-300 mb-3 group-hover:text-cyan-600 transition-colors" />
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upload Profile</p>
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Current Affiliation</label>
                      <div className="relative group">
                        <Building2 className="absolute left-6 top-6 w-4 h-4 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                        <textarea 
                          name="qualification" placeholder="Organizations you have been associated with..." 
                          value={formData.qualification} onChange={handleInputChange} rows={3}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 pl-16 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-300 resize-none"
                        />
                      </div>
                   </div>

                   <button 
                     onClick={nextStep}
                     className="w-full h-18 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3"
                   >
                     Next Protocol <ArrowRight className="w-4 h-4" />
                   </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="space-y-6">
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                        <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-16 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all" />
                      </div>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                        <input required type="tel" name="mobile" placeholder="Mobile (+91)" value={formData.mobile} onChange={handleInputChange} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-16 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all" />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                        <input required type="password" name="password" placeholder="Secure Password" value={formData.password} onChange={handleInputChange} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-16 text-sm font-black text-slate-800 focus:outline-none focus:border-cyan-500 transition-all" />
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button onClick={prevStep} className="flex-1 h-16 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">Back</button>
                      <button 
                        onClick={sendOTPs} disabled={isSubmitting}
                        className="flex-[2] h-16 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send Verification"}
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                   <div className="text-center">
                      <h3 className="text-2xl font-black font-montserrat uppercase italic tracking-tighter mb-2">Final Handshake</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sent to {formData.email}</p>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center block">Email OTP</label>
                         <input required maxLength={6} placeholder="000000" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl text-center font-mono text-xl font-black text-slate-900 focus:border-cyan-500 outline-none" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center block">Mobile OTP</label>
                         <input required maxLength={6} placeholder="000000" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl text-center font-mono text-xl font-black text-slate-900 focus:border-cyan-500 outline-none" />
                      </div>
                   </div>

                   <button 
                     onClick={verifyAndRegister} disabled={isSubmitting}
                     className="w-full h-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all"
                   >
                     {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Complete Onboarding"}
                   </button>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="mt-auto pt-10 text-center">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Sovereign Identity Protection Enabled</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
