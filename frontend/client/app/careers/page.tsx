"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { MapPin, Briefcase, Clock, ArrowRight, X, Building, CheckCircle2, Download, Users } from 'lucide-react';
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
                <Link key={job?.id} href={`/careers/${job?.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-cyan-400 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
                  >
                    {/* Active Pulse Decor */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-cyan-50 rounded-full text-[9px] font-black text-cyan-600 uppercase tracking-widest border border-cyan-100">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" /> Actively Hiring
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
                          {job.role}
                        </span>
                        <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 10+ Applicants</span>
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
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Estimated Package</span>
                        <span className="text-xl font-extrabold text-slate-900">{job.stipend}</span>
                      </div>
                      <div className="bg-slate-50 group-hover:bg-cyan-600 text-slate-900 group-hover:text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm group-hover:shadow-cyan-200 flex items-center justify-center gap-2">
                        View Role <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
