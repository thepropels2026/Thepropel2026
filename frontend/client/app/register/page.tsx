"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Phone, Lock, User, Briefcase, GraduationCap, CheckCircle, Calendar, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      // In a real app, you'd call your backend here
      // const response = await fetch('http://localhost:8000/api/auth/send-otp', { ... });
      
      // Simulate API calls for both Email and Mobile
      console.log("Sending OTPs to:", formData.email, formData.mobile);
      
      // Artificial delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      nextStep();
    } catch (err: any) {
      setError("Failed to send verification codes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to Supabase
      const { data, error: sbError } = await supabase
        .from('profiles')
        .insert([
          {
            identifier: formData.email,
            email: formData.email,
            mobile_number: formData.mobile,
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: formData.dob,
            qualification: formData.qualification,
            picture: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
          }
        ]);

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
    <div className="bg-[#050505] min-h-screen pt-32 pb-16 flex flex-col items-center select-none font-inter relative overflow-hidden text-white">
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-2xl px-6 md:px-8 relative z-10">
        
        {/* Progress Tracker */}
        <div className="mb-14 px-4">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10 -translate-y-1/2 rounded-full" />
            <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-orange-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out" 
                style={{ width: `${(step - 1) * 50}%` }}
            />
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${step >= num ? 'bg-[#0a0a0f] text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'bg-[#050505] text-white/30 border-white/10'}`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-center px-1">
            <span className={step >= 1 ? 'text-cyan-400' : 'text-white/40'}>Identity</span>
            <span className={step >= 2 ? 'text-cyan-400' : 'text-white/40'}>Contact</span>
            <span className={step >= 3 ? 'text-cyan-400' : 'text-white/40'}>Verify</span>
          </div>
        </div>

        <div className="bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-montserrat font-bold text-white mb-2">Basic Information</h1>
                <p className="text-white/60 mb-8 font-inter">Tell us who you are to begin your propulsion.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">First Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="John" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Last Name</label>
                      <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Date of Birth</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                      <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all color-scheme-dark" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Qualification</label>
                    <div className="relative group">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                      <input required type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="e.g. MBA, B.Tech" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                      <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="••••••••" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group mt-4">
                    CONTINUE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-montserrat font-bold text-white mb-2">Contact Details</h1>
                <p className="text-white/60 mb-8 font-inter">We'll use these to verify your identity with dual OTPs.</p>
                
                <form onSubmit={sendOTPs} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="name@company.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
                      <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-black text-white/40 bg-white/5 hover:bg-white/10 transition-all">BACK</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "SEND VERIFICATION CODES"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-8 h-8 text-cyan-500" />
                    <h1 className="text-3xl font-montserrat font-bold text-white">Dual Verification</h1>
                </div>
                <p className="text-white/60 mb-8 font-inter">Enter the 6-digit codes sent to your devices.</p>
                
                <form onSubmit={verifyAndRegister} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-3 uppercase tracking-widest text-center">Email OTP Code</label>
                    <input 
                      required 
                      type="text" 
                      name="emailOtp"
                      value={formData.emailOtp}
                      onChange={handleInputChange}
                      placeholder="000000" 
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 text-center tracking-[0.5em] font-mono text-2xl text-white focus:border-cyan-500 outline-none transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-3 uppercase tracking-widest text-center">Mobile OTP Code</label>
                    <input 
                      required 
                      type="text" 
                      name="mobileOtp"
                      value={formData.mobileOtp}
                      onChange={handleInputChange}
                      placeholder="000000" 
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 text-center tracking-[0.5em] font-mono text-2xl text-white focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="px-8 py-5 rounded-2xl font-black text-white/40 bg-white/5 hover:bg-white/10 transition-all">BACK</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-500 hover:to-orange-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "COMPLETE REGISTRATION"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
