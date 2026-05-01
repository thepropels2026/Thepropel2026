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

  // Filter States
  const [filters, setFilters] = useState({
    role: 'All',
    location: 'All',
    pay: 'All',
    duration: 'All'
  });

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

  const filteredJobs = jobs.filter(job => {
    const roleMatch = filters.role === 'All' || job.role === filters.role;
    const locationMatch = filters.location === 'All' || job.location === filters.location;
    const payMatch = filters.pay === 'All' || job.stipend.includes(filters.pay);
    const durationMatch = filters.duration === 'All' || job.work_duration.includes(filters.duration);
    return roleMatch && locationMatch && payMatch && durationMatch;
  });

  const uniqueRoles = ['All', ...Array.from(new Set(jobs.map(j => j.role)))];
  const uniqueLocations = ['All', ...Array.from(new Set(jobs.map(j => j.location)))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-16 pb-24 relative overflow-hidden">
      {/* Soft Decorative Elements - Fixed background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Building className="w-4 h-4" /> Join The Propulsion Team
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-medium mb-6 tracking-tight text-slate-900">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Future of Startups</span>
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            We're looking for ambitious builders, thinkers, and innovators to help us scale the next generation of global unicorns.
          </p>
        </div>

        {/* Filter Section - STICKY TOP */}
        {!loading && jobs.length > 0 && (
          <div className="sticky top-[80px] z-[40] grid grid-cols-2 md:grid-cols-4 gap-4 mb-0 bg-white/80 backdrop-blur-md p-6 rounded-t-[1rem] border border-slate-200 border-b-0 shadow-sm max-w-5xl mx-auto">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
              <select 
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <select 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Stipend</label>
              <select 
                value={filters.pay}
                onChange={(e) => setFilters({...filters, pay: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                <option value="All">All Pay</option>
                <option value="10k">₹10k+</option>
                <option value="20k">₹20k+</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration</label>
              <select 
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                <option value="All">All Durations</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job List - Rectangular and Tightly Stacked */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col -space-y-[1px]">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-slate-200 rounded-b-[1rem] shadow-sm">
                    <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Matching Roles</h3>
                    <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
                  </div>
                ) : (
                  filteredJobs.map((job, index) => (
                    <Link key={job?.id} href={`/careers/${job?.id}`}>
                      <div className={`group bg-white border border-slate-200 p-8 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden ${index === filteredJobs.length - 1 ? 'rounded-b-[1rem]' : ''}`}>
                        {/* Active Pulse Decor */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-cyan-50 rounded-full text-[8px] font-black text-cyan-600 uppercase tracking-widest border border-cyan-100">
                          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" /> Actively Hiring
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-wider shadow-md">
                              {job.role}
                            </span>
                            <div className="flex gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {job.location}</span>
                              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> 10+ Applicants</span>
                            </div>
                          </div>
                          
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-2 font-montserrat">
                              {job.title}
                            </h2>
                            <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 max-w-2xl font-medium">
                              {job.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-6 shrink-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="flex flex-col md:items-end">
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Estimated Package</span>
                            <span className="text-lg font-extrabold text-slate-900">{job.stipend}</span>
                          </div>
                          <div className="bg-slate-50 group-hover:bg-cyan-600 text-slate-900 group-hover:text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm group-hover:shadow-cyan-200 flex items-center justify-center gap-2">
                            View Role <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar Section - Fixed Top Position */}
          <div className="lg:col-span-4 space-y-6 sticky top-[80px]">
            {/* Options Card */}
            <div className="bg-white border border-slate-200 p-8 rounded-[1rem] shadow-sm">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Career Center</h3>
              <div className="space-y-6">
                <button className="flex items-center gap-4 w-full text-left group">
                  <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-base font-black text-black">Job Tracker</span>
                </button>
                <button className="flex items-center gap-4 w-full text-left group">
                  <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-base font-black text-black">My Career</span>
                </button>
                <button className="flex items-center gap-4 w-full text-left group">
                  <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-base font-black text-black">Preferences</span>
                </button>
              </div>
            </div>

            {/* Premium Card */}
            <div className="bg-slate-900 p-8 rounded-[1rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest mb-4">
                  PRO MEMBER
                </div>
                <h3 className="text-xl font-black mb-2 font-montserrat uppercase leading-tight">Propel Your <span className="text-cyan-400">Career</span></h3>
                <p className="text-slate-400 text-[12px] mb-8 leading-relaxed font-medium">Unlock exclusive job insights, priority applications, and direct mentorship.</p>
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-3xl font-black">₹0/-</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">/ Month</span>
                </div>
                <button className="w-full bg-white text-slate-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
                  Get Premium Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
