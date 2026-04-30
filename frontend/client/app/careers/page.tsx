"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Briefcase, Clock, ArrowRight, X, Building, CheckCircle2, Download } from 'lucide-react';
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

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    linkedinProfile: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: selectedJob?.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        linkedin_url: formData.linkedinProfile,
        cover_letter: formData.coverLetter,
        status: 'pending'
      });
      if (error) throw error;
      setApplySuccess(true);
    } catch (err) {
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Cyber Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight">Join the <span className="text-cyan-500">Mission</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Help us build the next generation of Indian founders. We're looking for outliers.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <motion.div 
                key={job.id} 
                whileHover={{ scale: 1.02 }}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 transition-all cursor-pointer"
                onClick={() => { setSelectedJob(job); setIsApplyModalOpen(true); }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                    <div className="flex gap-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.mode}</span>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 text-cyan-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase">{job.role}</div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">{job.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{job.stipend}</span>
                  <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm uppercase group">
                    Apply Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                    <p className="text-cyan-500 font-bold uppercase tracking-widest text-xs">Application Form</p>
                  </div>
                  <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                {applySuccess ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="text-slate-400 mb-8">We'll review your profile and get back to you soon.</p>
                    <button onClick={() => setIsApplyModalOpen(false)} className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-wider">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input required placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" />
                      <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" />
                    </div>
                    <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" />
                    <textarea required placeholder="Brief Experience Summary" rows={3} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 resize-none" />
                    <input required placeholder="LinkedIn Profile URL" value={formData.linkedinProfile} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500" />
                    <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-cyan-500 transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
