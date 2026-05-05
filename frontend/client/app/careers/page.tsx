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
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles className="w-3 h-3" /> Career Opportunities
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Build the <br/>
              <span className="relative">
                Future Economy.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              Join a team of visionaries shaping the next generation of global unicorns. We're hiring for impact, not just roles.
            </p>
          </motion.div>
        </div>

        {/* --- FILTERS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex flex-wrap gap-3">
             <div className="hidden md:flex items-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-widest mr-4">
                <Filter className="w-3.5 h-3.5" /> Filters
             </div>
             <select 
               value={filters.role}
               onChange={(e) => setFilters({...filters, role: e.target.value})}
               className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/60 outline-none focus:border-white/30 transition-all cursor-pointer"
             >
               {uniqueRoles.map(role => <option key={role} className="bg-[#0a0a0f] text-white" value={role}>{role}</option>)}
             </select>
             <select 
               value={filters.location}
               onChange={(e) => setFilters({...filters, location: e.target.value})}
               className="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/60 outline-none focus:border-white/30 transition-all cursor-pointer"
             >
               {uniqueLocations.map(loc => <option key={loc} className="bg-[#0a0a0f] text-white" value={loc}>{loc}</option>)}
             </select>
          </div>
          <div className="relative flex-1 md:w-80 group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
             <input type="text" placeholder="Search roles..." className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10 font-bold" />
          </div>
        </motion.div>

        {/* --- LISTINGS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white/[0.02] border border-white/10 rounded-[40px]">
               <Briefcase className="w-16 h-16 text-white/10 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-white/40 uppercase italic tracking-tight">No Roles in Orbit</h3>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <Link key={job?.id} href={`/careers/${job?.id}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] hover:border-white/20 hover:bg-white/[0.05] transition-all relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40">
                         {job.role}
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-400">
                         <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-montserrat font-black text-white group-hover:text-cyan-400 transition-colors mb-4 uppercase italic tracking-tighter leading-tight">
                      {job.title}
                    </h2>
                    
                    <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-4 mb-8 italic">
                      "{job.description}"
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                     <div className="space-y-1">
                        <span className="block text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Compensation</span>
                        <span className="text-lg font-black text-white/80 italic">{job.stipend}</span>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ChevronRight className="w-6 h-6" />
                     </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
