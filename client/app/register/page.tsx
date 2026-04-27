"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Phone, Lock, User, Briefcase, GraduationCap, Camera, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form State
  const [formData, setFormData] = useState({
    identifier: '',
    otp: '',
    firstName: '',
    lastName: '',
    picture: '',
    designation: '',
    company: '',
    education: '',
    skills: '',
    interests: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Move to profile building
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            identifier: formData.identifier,
            first_name: formData.firstName,
            last_name: formData.lastName,
            picture: formData.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
            designation: formData.designation,
            company: formData.company,
            education: formData.education,
            skills: formData.skills,
            interests: formData.interests,
          }
        ]);

      if (error) throw error;
      
      // Keep local copy for immediate sync
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      login();
      router.push('/profile');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-16 flex flex-col items-center select-none font-inter relative overflow-hidden text-white">
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-2xl px-6 md:px-8 relative z-10">
        
        {/* Progress Guide */}
        <div className="mb-14">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -z-10 -translate-y-1/2 rounded-full" />
            <div className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`} />
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${step >= num ? 'bg-[#0a0a0f] text-cyan-400 border-cyan-500 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'bg-[#050505] text-white/30 border-white/10'}`}>
                {step > num ? <CheckCircle className="w-6 h-6" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
            <span className={`w-12 ${step >= 1 ? 'text-cyan-400' : 'text-white/40'}`}>Verify</span>
            <span className={`w-12 ml-4 ${step >= 2 ? 'text-cyan-400' : 'text-white/40'}`}>Auth</span>
            <span className={`w-12 ${step >= 3 ? 'text-cyan-400' : 'text-white/40'}`}>Profile</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-montserrat font-bold text-white mb-2">Create your account</h1>
                <p className="text-white/60 mb-8 font-inter">Enter your details to initiate your propulsion into the ecosystem.</p>
                
                <div className="flex gap-4 mb-8">
                  <button onClick={() => setAuthMethod('email')} className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${authMethod === 'email' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,242,255,0.15)]' : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'}`}>
                    <Mail className="w-5 h-5" /> Email
                  </button>
                  <button onClick={() => setAuthMethod('phone')} className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${authMethod === 'phone' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,242,255,0.15)]' : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'}`}>
                    <Phone className="w-5 h-5" /> Phone
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-white/70 mb-3 uppercase tracking-wider">
                      {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <input 
                      required 
                      type={authMethod === 'email' ? 'email' : 'tel'} 
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder={authMethod === 'email' ? 'founder@startup.com' : '+91 98765 43210'} 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-white placeholder-white/20 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 group">
                    Send Verification Code <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-2 text-cyan-400">
                  <Lock className="w-8 h-8" />
                  <h1 className="text-3xl font-montserrat font-bold text-white">Verify Identity</h1>
                </div>
                <p className="text-white/60 mb-8">We sent a 6-digit code to <span className="font-bold text-white">{formData.identifier}</span>.</p>
                
                <form onSubmit={submitOtp}>
                  <div className="mb-8">
                    <label className="block text-xs font-bold text-white/70 mb-3 uppercase tracking-wider">One-Time Password</label>
                    <input 
                      required 
                      type="text" 
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="000000" 
                      maxLength={6}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-center tracking-[1em] font-mono text-3xl text-white placeholder-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="px-8 py-5 rounded-2xl font-bold text-white/60 bg-white/5 hover:bg-white/10 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-5 rounded-2xl shadow-lg transition-all">
                      Confirm & Proceed
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-montserrat font-bold text-white mb-2">Build Your Profile</h1>
                <p className="text-white/60 mb-8">Complete your founder profile to unlock the full potential of The Propels network.</p>
                
                <form onSubmit={completeRegistration}>
                  
                  {/* Basic Info */}
                  <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6">
                       <User className="w-4 h-4" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">First Name</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Last Name</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-cyan-500 outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider flex items-center gap-2"><Camera className="w-3 h-3" /> Profile Picture URL (Optional)</label>
                        <input type="url" name="picture" value={formData.picture} onChange={handleInputChange} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-cyan-500 outline-none transition-colors placeholder-white/20" />
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-6">
                       <Briefcase className="w-4 h-4" /> Professional Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Designation / Role</label>
                        <input required type="text" name="designation" placeholder="e.g. Founder & CEO" value={formData.designation} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-orange-500 outline-none transition-colors placeholder-white/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Startup / Company</label>
                        <input required type="text" name="company" placeholder="e.g. TechNova" value={formData.company} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-orange-500 outline-none transition-colors placeholder-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-6">
                       <GraduationCap className="w-4 h-4" /> Experience & Skills
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Education</label>
                        <input required type="text" name="education" placeholder="e.g. B.Tech in Computer Science, IIT Delhi" value={formData.education} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Top Skills (comma separated)</label>
                        <input required type="text" name="skills" placeholder="e.g. Product Strategy, Growth Hacking, React" value={formData.skills} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-wider">Industry Interests</label>
                        <input required type="text" name="interests" placeholder="e.g. AI, CleanTech, SaaS" value={formData.interests} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full relative overflow-hidden bg-white text-black font-bold py-5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                    Complete Registration & Enter Platform
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
