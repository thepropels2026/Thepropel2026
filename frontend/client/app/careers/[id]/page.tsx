"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { API_BASE_URL } from '../../../lib/api';
import { 
  MapPin, Briefcase, Clock, ArrowLeft, ArrowRight, Building, 
  CheckCircle2, Download, Users, Calendar, ShieldCheck, 
  Mail, Phone, Linkedin, Send, FileText, X, Sparkles,
  Zap, Loader2, Fingerprint, ShieldAlert, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Job = {
  id: string;
  title: string;
  description: string;
  role: string;
  qualification: string;
  eligibility: string;
  stipend: string;
  work_duration: string;
  location: string;
  mode: string;
  created_at: string;
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantCount, setApplicantCount] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Verification States
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    linkedinProfile: '',
    coverLetter: '',
    address: '',
    portfolio: '',
    availability: '',
    skills: ''
  });

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);

        const { count, error: countError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', id);

        if (!countError) setApplicantCount(count || 0);

      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJobDetails();
  }, [id]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to send verification code. Please check your email format.");
      }
      setIsOtpSent(true);
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Error sending verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.detail || "Incorrect verification code.");
      }
      await finalizeApplication();
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(err.message || "Invalid OTP code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const finalizeApplication = async () => {
    if (!job) return;
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        linkedin_url: formData.linkedinProfile,
        cover_letter: formData.coverLetter,
        address: formData.address,
        portfolio_url: formData.portfolio,
        availability: formData.availability,
        skills: formData.skills,
        status: 'pending'
      });

      if (error) throw error;
      setApplySuccess(true);
    } catch (err: any) {
      console.error("Application finalization error:", err);
      setError(err.message || "Submission failed.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020203]">
      <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020203] p-6 text-white">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Sector Not Found</h2>
      <button onClick={() => router.push('/careers')} className="text-cyan-500 font-black uppercase tracking-widest text-[10px] hover:underline">Return to Orbit</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-cyan-500/[0.03] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back Link */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/careers')}
          className="flex items-center gap-2 text-white/30 hover:text-cyan-400 font-bold transition-all mb-10 group text-[10px] uppercase tracking-[0.3em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Mission Control
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info Panel */}
          <div className="lg:col-span-8 space-y-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                   <Zap className="w-3 h-3" /> Priority Recruitment
                </div>
                <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                   {job.role}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-inter font-black mb-8 leading-[1.1] tracking-tighter">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-8 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-12">
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-cyan-500" /> {job.location}</div>
                <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-cyan-500" /> {job.mode}</div>
                <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-cyan-500" /> Full Remote Capability</div>
              </div>

              <button 
                onClick={() => { setError(null); setIsApplyModalOpen(true); }}
                className="w-full group relative h-16 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-3">
                  Initiate Application Sequence <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            </motion.div>

            {/* Detailed Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="space-y-6"
               >
                  <h3 className="text-xl font-inter font-black uppercase tracking-tight flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-500" /> Description
                  </h3>
                  <p className="text-white/40 leading-relaxed font-medium text-sm whitespace-pre-wrap italic">
                    "{job.description}"
                  </p>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="space-y-6"
               >
                  <h3 className="text-xl font-inter font-black uppercase tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-500" /> Qualifications
                  </h3>
                  <div className="text-white/40 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                    {job.qualification}
                  </div>
               </motion.div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4 space-y-8">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
             >
                <div className="space-y-10">
                   <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Target Compensation</p>
                      <p className="text-3xl font-black text-cyan-400 tracking-tighter italic">{job.stipend}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Temporal Duration</p>
                      <p className="text-xl font-black text-white">{job.work_duration}</p>
                   </div>
                   <div className="pt-8 border-t border-white/5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Ecosystem Density</p>
                      <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                         <Users className="w-4 h-4 text-orange-500" /> {applicantCount + 42} Active Aspirants
                      </div>
                   </div>
                </div>
             </motion.div>

             <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10">
                <Sparkles className="w-8 h-8 text-cyan-500 mb-6" />
                <h4 className="text-xl font-black mb-4 uppercase italic">Elite Support</h4>
                <p className="text-white/40 text-xs font-medium leading-relaxed mb-8">Direct channel for architectural queries regarding this role.</p>
                <a href="mailto:careers@thepropels.in" className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors underline decoration-cyan-500/30">
                  Contact Talent <ArrowRight className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020203]/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-[#0a0a0f] w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] flex flex-col relative"
            >
              {/* Inner Glow */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

              <div className="p-10 border-b border-white/5 flex justify-between items-start sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div>
                  <h2 className="text-3xl font-inter font-black text-white mb-2 uppercase italic">Initiate Bio-Sync</h2>
                  <p className="text-cyan-500 font-black uppercase tracking-[0.2em] text-[9px]">Targeting: {job.title}</p>
                </div>
                <button onClick={() => { setError(null); setIsApplyModalOpen(false); }} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {applySuccess ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 uppercase">Identity Logged</h3>
                    <p className="text-white/40 mb-10 font-medium leading-relaxed max-w-sm mx-auto">
                      Your credentials have been successfully integrated. Expect a handshake from our talent protocol within 48 hours.
                    </p>
                    <button 
                      onClick={() => { setIsApplyModalOpen(false); setApplySuccess(false); router.push('/careers'); }} 
                      className="h-16 px-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5"
                    >
                      Return to Orbit
                    </button>
                  </div>
                ) : !isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Full Name</label>
                      <input required placeholder="Sushant Sharma" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Email Terminal</label>
                      <input required type="email" placeholder="name@propels.in" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Global Mobile (+91)</label>
                      <input required placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">LinkedIn Link</label>
                      <input required placeholder="linkedin.com/in/..." value={formData.linkedinProfile} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Current Sector (Address)</label>
                      <input required placeholder="City, State, Country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] pl-1">Skills & Direct Experience</label>
                      <textarea required placeholder="React, Python, Project Synthesis..." rows={3} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold resize-none placeholder:text-white/10" />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="md:col-span-2 h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all shadow-2xl disabled:opacity-50 mt-4 flex items-center justify-center gap-3 text-xs">
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : <><Fingerprint className="w-5 h-5" /> Initiate Secure Verification</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-10 py-12 text-center">
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <ShieldCheck className="w-8 h-8 text-cyan-400" />
                      </div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block">Authentication Code: {formData.phone}</label>
                      <input 
                        required 
                        maxLength={6}
                        placeholder="000000" 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        className="w-56 mx-auto bg-transparent border-b-2 border-white/10 px-6 py-4 text-center text-4xl font-black tracking-[0.8em] outline-none focus:border-cyan-500 transition-all text-white shadow-2xl font-mono" 
                      />
                    </div>
                    <button type="submit" disabled={isVerifying} className="w-full max-w-sm mx-auto h-16 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 text-xs">
                      {isVerifying ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : <><Send className="w-5 h-5" /> Complete Integration</>}
                    </button>
                    <button type="button" onClick={() => setIsOtpSent(false)} className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-cyan-400 transition-all underline decoration-white/10">
                      Reconfigure Bio-Link
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
