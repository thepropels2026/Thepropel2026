"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { 
  MapPin, Briefcase, Clock, ArrowRight, X, Building, 
  CheckCircle2, Download, Users, Sparkles, Search,
  Filter, ChevronRight, Zap
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

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [filters, setFilters] = useState({
    role: 'All',
    location: 'All',
    pay: 'All'
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
    return roleMatch && locationMatch && payMatch;
  });

  const uniqueRoles = ['All', ...Array.from(new Set(jobs.map(j => j.role)))];
  const uniqueLocations = ['All', ...Array.from(new Set(jobs.map(j => j.location)))];

  return (
    <div className="min-h-screen bg-[#020203] text-white pt-32 pb-20 relative overflow-hidden font-inter">
      
      {/* --- PREMIUM BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Header Section */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-3 h-3" /> Career Opportunities
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tight">
              Build the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Future Economy.</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Join a team of visionaries and builders shaping the next generation of global unicorns. We're hiring for impact, not just roles.
            </p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-6 mb-12 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-2xl"
        >
          <div className="flex items-center gap-4 flex-1 min-w-[280px]">
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/30">
                <Search className="w-5 h-5" />
             </div>
             <input type="text" placeholder="Search roles, skills, or locations..." className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-white/20" />
          </div>

          <div className="flex gap-4 items-center">
            <div className="hidden md:flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest mr-4">
               <Filter className="w-3.5 h-3.5" /> Quick Filters
            </div>
            <select 
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white/70 outline-none focus:border-cyan-500 transition-all cursor-pointer"
            >
              {uniqueRoles.map(role => <option key={role} className="bg-[#0a0a0f] text-white" value={role}>{role}</option>)}
            </select>
            <select 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white/70 outline-none focus:border-cyan-500 transition-all cursor-pointer"
            >
              {uniqueLocations.map(loc => <option key={loc} className="bg-[#0a0a0f] text-white" value={loc}>{loc}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[280px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[3rem] border border-white/5">
               <Briefcase className="w-16 h-16 text-white/10 mx-auto mb-6" />
               <h3 className="text-2xl font-bold text-white/60 mb-2">No roles currently in orbit</h3>
               <p className="text-white/30 text-sm">Adjust your filters to see more opportunities.</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <Link key={job?.id} href={`/careers/${job?.id}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:border-cyan-500/50 hover:bg-white/[0.05] transition-all cursor-pointer h-full flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Hover Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                         {job.role}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                         <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live Now
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-montserrat font-black text-white group-hover:text-cyan-400 transition-colors mb-4 leading-tight">
                      {job.title}
                    </h2>
                    
                    <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-3 mb-8">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                     <div className="space-y-1">
                        <span className="block text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Package</span>
                        <span className="text-sm font-bold text-white/80">{job.stipend}</span>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>

        {/* Global Stats Footer */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5 opacity-50">
           <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-cyan-500" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Strength</p>
                 <p className="text-lg font-black text-white">12,400+ Founders</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-orange-500" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Average Velocity</p>
                 <p className="text-lg font-black text-white">2.4x Speed-to-Market</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-purple-500" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Project Success</p>
                 <p className="text-lg font-black text-white">98% Retention Rate</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
