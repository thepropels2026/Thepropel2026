"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Mail, Phone, Lock, User, Briefcase, 
  GraduationCap, CheckCircle, Calendar, ShieldCheck, 
  Loader2, ChevronLeft, Sparkles, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

/**
 * Register Page: A high-end, aesthetic registration flow.
 * Featuring glassmorphism, dynamic backgrounds, and human-centric design.
 */
export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock scroll while registration is active
  React.useEffect(() => {
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
      // Simulate API delay for a premium feel
      await new Promise(resolve => setTimeout(resolve, 1800));
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
      await new Promise(resolve => setTimeout(resolve, 2200));

      const { error: sbError } = await supabase
        .from('profiles')
        .insert([{
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
    <div className="bg-[#020203] min-h-screen h-screen flex flex-col items-center justify-center select-none font-inter relative overflow-hidden text-white p-4 md:p-8">
      
      {/* --- PREMIUM BACKGROUND SYSTEM --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-orange-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020203]/50 to-[#020203]" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 h-full max-h-[850px]">
        
        {/* --- LEFT DECORATIVE PANEL --- */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 pr-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles className="w-3 h-3" /> System Initiation
            </div>
            <h1 className="text-5xl xl:text-6xl font-montserrat font-black leading-[1.1] mb-6 tracking-tight">
              Join the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Propulsion</span> <br/>
              Ecosystem.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed font-light max-w-sm">
              Forge your identity in the zero-gravity marketplace for world-class founders and innovators.
            </p>
          </motion.div>

          <div className="space-y-6 pt-12 border-t border-white/5">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />, title: "Secure Infrastructure", desc: "Enterprise-grade encryption for your identity." },
              { icon: <Fingerprint className="w-5 h-5 text-orange-500" />, title: "Verified Network", desc: "Every founder is vetted for maximum impact." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.2) }}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-all">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white/90">{item.title}</h4>
                  <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- MAIN FORM CONTAINER --- */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-14 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
            
            {/* --- PROGRESS BAR --- */}
            <div className="mb-14">
              <div className="flex justify-between mb-4">
                 <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Step 0{step} of 03</span>
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{Math.round((step/3)*100)}% Complete</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
                  animate={{ width: `${(step/3)*100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex-1"
                >
                  <h2 className="text-4xl font-montserrat font-black text-white mb-3">Identity Setup</h2>
                  <p className="text-white/40 mb-10 font-inter text-sm font-medium">Start your journey by defining your foundational details.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">First Name</label>
                        <div className="relative group">
                          <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                          <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="e.g. Elon" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Last Name</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="e.g. Musk" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Birth Date</label>
                        <div className="relative group">
                          <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                          <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all color-scheme-dark" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Qualification</label>
                        <div className="relative group">
                          <GraduationCap className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                          <input required type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="e.g. PhD, MSCS" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Secure Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                        <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="••••••••" />
                      </div>
                    </div>

                    <button type="submit" className="w-full group relative flex items-center justify-center h-16 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                        Proceed to Contact <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1"
                >
                  <button onClick={prevStep} className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to identity
                  </button>
                  <h2 className="text-4xl font-montserrat font-black text-white mb-3">Channel Connection</h2>
                  <p className="text-white/40 mb-10 font-inter text-sm font-medium">Verify your primary communication channels for dual-layer security.</p>
                  
                  <form onSubmit={sendOTPs} className="space-y-10">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Professional Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="founder@thepropels.in" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider pl-1">Global Mobile ID</label>
                      <div className="relative group">
                        <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-500 transition-all" />
                        <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/10" placeholder="+91 99999 99999" />
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full group relative flex items-center justify-center h-16 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-3">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Dual-OTP Verification <ShieldCheck className="w-5 h-5" /></>}
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1"
                >
                  <button onClick={prevStep} className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Resend Codes
                  </button>
                  <h2 className="text-4xl font-montserrat font-black text-white mb-3">Verification</h2>
                  <p className="text-white/40 mb-10 font-inter text-sm font-medium">Authentication required. Sync your devices to finalize propulsion.</p>
                  
                  <form onSubmit={verifyAndRegister} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <Mail className="w-3 h-3 text-cyan-500" />
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Email Auth Code</label>
                        </div>
                        <input 
                          required 
                          type="text" 
                          name="emailOtp"
                          value={formData.emailOtp}
                          onChange={handleInputChange}
                          placeholder="000000" 
                          maxLength={6}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-center tracking-[0.8em] font-mono text-xl text-white focus:border-cyan-500 outline-none transition-all shadow-inner" 
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <Phone className="w-3 h-3 text-orange-500" />
                           <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Mobile Auth Code</label>
                        </div>
                        <input 
                          required 
                          type="text" 
                          name="mobileOtp"
                          value={formData.mobileOtp}
                          onChange={handleInputChange}
                          placeholder="000000" 
                          maxLength={6}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-center tracking-[0.8em] font-mono text-xl text-white focus:border-orange-500 outline-none transition-all shadow-inner" 
                        />
                      </div>
                    </div>

                    {error && <p className="text-red-400 text-[10px] text-center font-black uppercase tracking-widest">{error}</p>}

                    <button type="submit" disabled={isSubmitting} className="w-full group relative flex items-center justify-center h-20 rounded-[2rem] bg-gradient-to-br from-white to-slate-200 text-black font-black text-base uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize Identity <CheckCircle className="w-6 h-6" /></>}
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        </div>
      </div>

      {/* --- FOOTER DECORATION --- */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center z-10 pointer-events-none opacity-20">
         <div className="text-[10px] font-black uppercase tracking-[0.5em]">The Propels Protocol v2.0</div>
         <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.5em]">
            <span>Security</span>
            <span>Privacy</span>
            <span>Terms</span>
         </div>
      </div>
    </div>
  );
}
