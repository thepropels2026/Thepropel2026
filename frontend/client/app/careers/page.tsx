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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 relative overflow-hidden">
      {/* Soft Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Building className="w-4 h-4" /> Join The Propulsion Team
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold mb-6 tracking-tight text-slate-900">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Future of Startups</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            We're looking for ambitious builders, thinkers, and innovators to help us scale the next generation of global unicorns.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Open Roles</h3>
                <p className="text-slate-500">We aren't actively hiring right now, but check back soon!</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <motion.div 
                  key={job.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-cyan-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                  onClick={() => { setSelectedJob(job); setIsApplyModalOpen(true); }}
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-1 bg-cyan-50 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-cyan-100 shadow-sm">
                        {job.role}
                      </span>
                      <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.mode}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors mb-2 font-montserrat">
                        {job.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 max-w-2xl font-medium">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-6 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex flex-col md:items-end">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Stipend/Salary</span>
                      <span className="text-xl font-extrabold text-slate-900">{job.stipend}</span>
                    </div>
                    <button className="bg-slate-900 hover:bg-cyan-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-200 active:scale-95 flex items-center justify-center gap-2">
                      Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white border border-slate-200 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-1 font-montserrat">{selectedJob.title}</h2>
                  <p className="text-cyan-600 font-black uppercase tracking-widest text-[10px]">Candidate Application Interface</p>
                </div>
                <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-8 overflow-y-auto bg-slate-50/50">
                {applySuccess ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 font-montserrat uppercase tracking-tight">Success!</h3>
                    <p className="text-slate-500 mb-8 font-medium">Your application has been received. Our team will contact you shortly.</p>
                    <button onClick={() => setIsApplyModalOpen(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-lg">Done</button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required placeholder="Sushant Sharma" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required type="email" placeholder="example@thepropels.in" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input required placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience / Cover Letter</label>
                      <textarea required placeholder="Briefly describe your relevant experience..." rows={4} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-medium resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                      <input required placeholder="https://linkedin.com/in/..." value={formData.linkedinProfile} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-medium" />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl hover:shadow-cyan-100 active:scale-95 disabled:opacity-50 mt-4">
                      {isSubmitting ? 'Transmitting...' : 'Submit Application'}
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
