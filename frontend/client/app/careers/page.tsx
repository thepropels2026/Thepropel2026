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
    <div className="h-screen bg-slate-50 text-slate-900 pt-16 relative overflow-hidden flex flex-col">
      {/* Soft Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col overflow-hidden">
        {/* Header Section - Fixed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Building className="w-3.5 h-3.5" /> Join The Propulsion Team
          </div>
          <h1 className="text-3xl md:text-5xl font-montserrat font-extrabold mb-4 tracking-tight text-slate-900">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Future of Startups</span>
          </h1>
          <p className="text-base text-slate-600 max-w-2xl font-medium leading-relaxed">
            We're looking for ambitious builders and innovators to help us scale the next generation of global unicorns.
          </p>
        </motion.div>

        {/* Filter Section - Fixed */}
        {!loading && jobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
              <select 
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
              <select 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Stipend</label>
              <select 
                value={filters.pay}
                onChange={(e) => setFilters({...filters, pay: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                <option value="All">All Pay</option>
                <option value="10k">₹10k+</option>
                <option value="20k">₹20k+</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration</label>
              <select 
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-cyan-500 transition-all shadow-sm"
              >
                <option value="All">All Durations</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Scrollable Column Container */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-8 pb-8">
          {/* Main Job List Column */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Matching Roles</h3>
                    <p className="text-sm text-slate-500">Try adjusting your filters.</p>
                  </div>
                ) : (
                  filteredJobs.map((job, index) => (
                    <Link key={job?.id} href={`/careers/${job?.id}`}>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                        className="group bg-white border border-slate-200 p-6 rounded-xl hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
                      >
                        {/* Status Pin */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-cyan-50 rounded text-[8px] font-bold text-cyan-600 uppercase tracking-tighter">
                          <span className="w-1 h-1 bg-cyan-500 rounded-full" /> Hiring
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">
                              {job.role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          </div>
                          
                          <h2 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1 font-montserrat">
                            {job.title}
                          </h2>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-1 max-w-xl font-medium">
                            {job.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Package</span>
                            <span className="text-sm font-bold text-slate-900">{job.stipend}</span>
                          </div>
                          <div className="w-8 h-8 bg-slate-50 group-hover:bg-cyan-600 text-slate-900 group-hover:text-white rounded-lg flex items-center justify-center transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Optional Sidebar or Info (Fixed) */}
          <div className="hidden lg:block w-80 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Why Propels?</h3>
              <ul className="space-y-4 text-xs text-slate-500 font-medium">
                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" /> Real-world project experience</li>
                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" /> Mentorship from startup founders</li>
                <li className="flex gap-3"><CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" /> Competitive stipend and growth</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-black mb-2">Need help?</h3>
              <p className="text-[11px] opacity-80 mb-4 font-medium">Reach out to our talent team for any queries regarding open roles.</p>
              <a href="mailto:careers@thepropels.in" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                Contact Us <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
