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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 relative overflow-hidden">
      {/* Fixed background decor */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      {/* BOX 1: Main Heading - Pinned to the top below header */}
      <div className="sticky top-[100px] z-[45] bg-slate-50/80 backdrop-blur-md pt-6 pb-4 border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-3xl md:text-4xl font-montserrat font-medium mb-3 tracking-tight text-slate-900">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 font-bold">Future of Startups</span>
          </h1>
          <p className="text-[11px] text-slate-600 font-medium uppercase tracking-widest">
            Ambitious builders, thinkers, and innovators scaling global unicorns.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 mt-8">
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* BOX 2: LEFT SIDEBAR - Career Center (Stick to screen) */}
          <div className="lg:col-span-3 sticky top-[240px] space-y-4">
            <div className="bg-white border border-slate-200 p-6 rounded-[1rem] shadow-sm">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Career Center</h3>
              <div className="space-y-4">
                <button className="flex items-center gap-3 w-full text-left group">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">Job Tracker</span>
                </button>
                <button className="flex items-center gap-3 w-full text-left group">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">My Career</span>
                </button>
                <button className="flex items-center gap-3 w-full text-left group">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">Preferences</span>
                </button>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - Filters (BOX 4) & Job Cards */}
          <div className="lg:col-span-6 space-y-0">
            {/* BOX 4: Filter Section - STICKY (Right below heading box) */}
            {!loading && jobs.length > 0 && (
              <div className="sticky top-[240px] z-[40] grid grid-cols-2 gap-3 mb-0 bg-white/95 backdrop-blur-md p-5 rounded-t-[1rem] border border-slate-200 border-b-0 shadow-sm transition-all">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                  <select 
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
                  >
                    {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-700 outline-none focus:border-cyan-500 transition-all shadow-sm"
                  >
                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Job List - THE ONLY SCROLLING PART */}
            {loading ? (
              <div className="flex justify-center py-20 bg-white border border-slate-200 rounded-b-[1rem]">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-cyan-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col -space-y-[1px]">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-slate-200 rounded-b-[1rem] shadow-sm">
                    <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-base font-bold text-slate-800">No Matching Roles</h3>
                  </div>
                ) : (
                  filteredJobs.map((job, index) => (
                    <Link key={job?.id} href={`/careers/${job?.id}`}>
                      <div className={`group bg-white border border-slate-200 p-6 transition-all cursor-pointer flex flex-col justify-between gap-6 relative overflow-hidden ${index === filteredJobs.length - 1 ? 'rounded-b-[1rem]' : ''}`}>
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-cyan-50 rounded-full text-[7px] font-black text-cyan-600 uppercase tracking-widest border border-cyan-100">
                          <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" /> Hiring
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-0.5 bg-slate-900 text-white rounded-full text-[7px] font-black uppercase tracking-wider">
                              {job.role}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> {job.location}
                            </span>
                          </div>
                          
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1 font-montserrat">
                              {job.title}
                            </h2>
                            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 font-medium">
                              {job.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Package</span>
                            <span className="text-sm font-extrabold text-slate-900">{job.stipend}</span>
                          </div>
                          <div className="bg-slate-50 group-hover:bg-cyan-600 text-slate-900 group-hover:text-white px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2">
                            Details <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* BOX 3: RIGHT SIDEBAR - Premium Access (Stick to screen) */}
          <div className="lg:col-span-3 sticky top-[240px]">
            <div className="bg-slate-900 p-6 rounded-[1rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-cyan-500 text-white rounded-full text-[7px] font-black uppercase tracking-widest mb-3">
                  PRO MEMBER
                </div>
                <h3 className="text-lg font-black mb-1 font-montserrat uppercase leading-tight">Propel Your <span className="text-cyan-400 font-bold">Career</span></h3>
                <p className="text-slate-400 text-[10px] mb-6 leading-relaxed font-medium">Exclusive insights & priority applications.</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-2xl font-black">₹0/-</span>
                  <span className="text-slate-400 text-[8px] font-bold uppercase mb-1">/ Mo</span>
                </div>
                <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
                  Get Access
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
