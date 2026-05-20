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
      const formattedCoverLetter = [
        formData.coverLetter ? `Cover Letter: ${formData.coverLetter}` : '',
        formData.address ? `Address: ${formData.address}` : '',
        formData.skills ? `Skills: ${formData.skills}` : '',
        formData.portfolio ? `Portfolio: ${formData.portfolio}` : '',
        formData.availability ? `Availability: ${formData.availability}` : ''
      ].filter(Boolean).join('\n\n');

      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience || 'Not specified',
        linkedin_url: formData.linkedinProfile,
        cover_letter: formattedCoverLetter,
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

  // Format stipend if it's numeric
  const displayStipend = job && /^\d+$/.test(job.stipend) ? `₹${Number(job.stipend).toLocaleString('en-IN')}` : job?.stipend;

  return (
    <div className="min-h-screen bg-slate-50 text-[rgba(0,0,0,0.9)] pt-32 pb-24 relative overflow-hidden font-montserrat">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Back Link */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/careers')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold transition-all mb-10 group text-[10px] uppercase tracking-[0.3em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Mission Control
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info Panel */}
          <div className="lg:col-span-8 space-y-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200/80 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="px-4 py-1.5 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   <Zap className="w-3 h-3 text-cyan-600" /> Priority Recruitment
                </div>
                <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-[0.2em]">
                   {job.role}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-montserrat font-extrabold mb-8 leading-[1.2] tracking-tight text-slate-900 uppercase">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-cyan-600" /> {job.location}</div>
                <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-cyan-600" /> {job.mode}</div>
                <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-cyan-600" /> Full Remote Capability</div>
              </div>

              <button 
                onClick={() => { setError(null); setIsApplyModalOpen(true); }}
                className="w-full group relative h-16 rounded-2xl bg-black text-white font-bold text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] shadow-md"
              >
                <div className="absolute inset-0 bg-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-white flex items-center justify-center gap-3">
                  Initiate Application Sequence <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            </motion.div>

            {/* Detailed Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6"
               >
                  <h3 className="text-lg font-montserrat font-bold uppercase tracking-tight text-slate-800 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-600" /> Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                    {job.description}
                  </p>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6"
               >
                  <h3 className="text-lg font-montserrat font-bold uppercase tracking-tight text-slate-800 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-600" /> Qualifications
                  </h3>
                  <div className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-wrap">
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
               className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 shadow-sm"
             >
                <div className="space-y-10">
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Target Compensation</p>
                      <p className="text-3xl font-extrabold text-cyan-600 tracking-tight">{displayStipend}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Temporal Duration</p>
                      <p className="text-lg font-bold text-slate-800">{job.work_duration}</p>
                   </div>
                   <div className="pt-8 border-t border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">Ecosystem Density</p>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <Users className="w-4 h-4 text-orange-500" /> {applicantCount + 42} Active Aspirants
                      </div>
                   </div>
                </div>
             </motion.div>

             <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-[2.5rem] p-8 shadow-sm">
                <Sparkles className="w-8 h-8 text-cyan-600 mb-6" />
                <h4 className="text-xl font-bold mb-3 text-slate-900 uppercase">Elite Support</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">Direct channel for architectural queries regarding this role.</p>
                <a href="mailto:careers@thepropels.in" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 hover:text-cyan-800 transition-colors underline decoration-cyan-700/30">
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white w-full max-w-2xl rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
            >
              {/* Inner Glow */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

              <div className="p-10 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-montserrat font-extrabold text-slate-950 uppercase">Initiate Bio-Sync</h2>
                  <p className="text-cyan-600 font-bold uppercase tracking-[0.2em] text-[9px]">Targeting: {job.title}</p>
                </div>
                <button onClick={() => { setError(null); setIsApplyModalOpen(false); }} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      {typeof error === 'object' && error !== null 
                        ? (error.message || JSON.stringify(error)) 
                        : String(error)}
                    </span>
                  </div>
                )}
                {applySuccess ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-montserrat">Identity Logged</h3>
                    <p className="text-slate-600 mb-8 font-medium leading-relaxed max-w-sm mx-auto">
                      Your credentials have been successfully integrated. Expect a handshake from our talent protocol within 48 hours.
                    </p>
                    <button 
                      onClick={() => { setIsApplyModalOpen(false); setApplySuccess(false); router.push('/careers'); }} 
                      className="h-16 px-12 rounded-2xl bg-black text-white font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                    >
                      Return to Orbit
                    </button>
                  </div>
                ) : !isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Full Name</label>
                      <input required placeholder="Sushant Sharma" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Email Terminal</label>
                      <input required type="email" placeholder="name@propels.in" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Global Mobile (+91)</label>
                      <input required placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">LinkedIn Link</label>
                      <input required placeholder="linkedin.com/in/..." value={formData.linkedinProfile} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Current Sector (Address)</label>
                      <input required placeholder="City, State, Country" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Skills & Direct Experience</label>
                      <textarea required placeholder="React, Python, Project Synthesis..." rows={3} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-cyan-500 transition-all text-slate-800 font-semibold resize-none placeholder:text-slate-400 focus:bg-white" />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="md:col-span-2 h-16 rounded-2xl bg-black text-white font-bold uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-md disabled:opacity-50 mt-4 flex items-center justify-center gap-3 text-xs">
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : <><Fingerprint className="w-5 h-5" /> Initiate Secure Verification</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-10 py-12 text-center">
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-cyan-50 border border-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <ShieldCheck className="w-8 h-8 text-cyan-600" />
                      </div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Verification Code Sent to: {formData.email}</label>
                      <input 
                        required 
                        maxLength={6}
                        placeholder="000000" 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        className="w-56 mx-auto bg-transparent border-b-2 border-slate-200 px-6 py-4 text-center text-4xl font-semibold tracking-[0.15em] outline-none focus:border-cyan-500 transition-all text-slate-800 font-mono" 
                      />
                    </div>
                    <button type="submit" disabled={isVerifying} className="w-full max-w-sm mx-auto h-16 rounded-2xl bg-black text-white font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-3 text-xs">
                      {isVerifying ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : <><Send className="w-5 h-5" /> Complete Integration</>}
                    </button>
                    <button type="button" onClick={() => setIsOtpSent(false)} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-cyan-600 transition-all underline decoration-slate-200">
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
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
