"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Mail, Phone, Lock, User, 
  Building2, Calendar, ShieldCheck, 
  Loader2, Check, Globe, Link as LinkIcon,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock scroll while registration is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
    linkedinUrl: '',
    websiteUrl: '',
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
      const { error: sbError } = await supabase.from('profiles').insert([{
        identifier: formData.email,
        email: formData.email,
        mobile_number: formData.mobile,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dob: formData.dob,
        qualification: formData.qualification,
        picture: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
      }]);
      if (sbError) throw sbError;
      login({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        qualification: formData.qualification,
        picture: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
      });
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col lg:flex-row bg-[#080808] font-inter overflow-hidden relative">
      
      {/* --- GRID BACKGROUND --- */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* --- LEFT PANEL (STORY) --- */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl xl:text-6xl font-montserrat font-black text-white mb-4 leading-tight tracking-tight">
            Become a Part of <br/>
            <span className="relative">
              The Propels
              <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mt-12 max-w-lg">
            Join us on this journey as a <span className="text-white font-bold">founder, innovator or mentor</span> and together, let's empower the next generation to achieve greatness.
          </p>
        </motion.div>
      </div>

      {/* --- RIGHT PANEL (FORM CARD) --- */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-xl rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* --- CARD PROGRESS --- */}
          <div className="p-8 md:p-12 pb-0">
            <div className="flex items-center justify-between relative mb-12">
               <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-slate-200 -z-0" />
               {[1, 2, 3].map((num) => (
                 <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all duration-500 ${step >= num ? 'bg-[#D6EF30] text-black border-none' : 'bg-white text-slate-300 border border-slate-200'}`}>
                    {num}
                 </div>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="space-y-8">
                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Enter your name *</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                          <input 
                            required 
                            type="text" 
                            name="firstName" 
                            placeholder="Enter your name" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300" 
                          />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-800">We would love to know more about you!</label>
                        <p className="text-[11px] text-slate-400 font-medium">Kindly choose one or more of the following:</p>
                        
                        <div className="space-y-3">
                           {[
                             { id: 'linkedin', label: 'Enter LinkedIn Profile URL', icon: <LinkIcon className="w-3.5 h-3.5" /> },
                             { id: 'upload', label: 'Upload Profile (.doc or .pdf)', icon: <FileText className="w-3.5 h-3.5" /> },
                             { id: 'website', label: 'Enter Website URL', icon: <Globe className="w-3.5 h-3.5" /> }
                           ].map((opt) => (
                             <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-all">
                                   <Check className="w-3.5 h-3.5 text-black opacity-0 group-hover:opacity-10" />
                                </div>
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-2">{opt.icon} {opt.label}</span>
                             </label>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Organizations you have been associated with</label>
                        <div className="relative group">
                          <Building2 className="absolute left-4 top-5 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                          <textarea 
                            name="qualification" 
                            placeholder="Organizations" 
                            value={formData.qualification}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300 resize-none" 
                          />
                        </div>
                     </div>

                     <div className="flex justify-end pt-4 pb-12">
                        <button 
                          onClick={nextStep}
                          className="px-8 py-3 bg-white border border-slate-200 rounded-full flex items-center gap-3 text-sm font-bold text-slate-800 hover:border-slate-900 transition-all shadow-sm group"
                        >
                          Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="space-y-8">
                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Contact Email *</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                          <input 
                            required 
                            type="email" 
                            name="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300" 
                          />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Mobile Number *</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                          <input 
                            required 
                            type="tel" 
                            name="mobile" 
                            placeholder="+91 00000 00000" 
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300" 
                          />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-800 mb-3">Set Secure Password *</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
                          <input 
                            required 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300" 
                          />
                        </div>
                     </div>

                     <div className="flex justify-between items-center pt-4 pb-12">
                        <button onClick={prevStep} className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Back</button>
                        <button 
                          onClick={sendOTPs}
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-black text-white rounded-full flex items-center gap-3 text-sm font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Verification <ShieldCheck className="w-4 h-4" /></>}
                        </button>
                     </div>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="space-y-10 py-4">
                     <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Final Verification</h3>
                        <p className="text-xs text-slate-400 font-medium italic">We've sent 6-digit codes to your email and mobile.</p>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Email OTP</label>
                           <input required maxLength={6} name="emailOtp" value={formData.emailOtp} onChange={handleInputChange} placeholder="000000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-center font-mono text-xl text-slate-900 focus:border-slate-400 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Mobile OTP</label>
                           <input required maxLength={6} name="mobileOtp" value={formData.mobileOtp} onChange={handleInputChange} placeholder="000000" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-center font-mono text-xl text-slate-900 focus:border-slate-400 outline-none transition-all" />
                        </div>
                     </div>

                     {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}

                     <div className="flex flex-col gap-4 pb-12">
                        <button 
                          onClick={verifyAndRegister}
                          disabled={isSubmitting}
                          className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Onboarding <ArrowRight className="w-5 h-5" /></>}
                        </button>
                        <button onClick={prevStep} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors mx-auto">Re-enter Details</button>
                     </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
