"use client";
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MessageSquare, Briefcase, Filter, ShieldCheck, MapPin, Building2, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<'founders' | 'investors'>('founders');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        console.error('Error fetching profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(profile => {
     const designation = profile.designation?.toLowerCase() || '';
     const isInvestor = designation.includes('investor') || designation.includes('partner') || designation.includes('vc') || designation.includes('capital');
     return activeTab === 'investors' ? isInvestor : !isInvestor;
  });

  return (
    <div className="min-h-screen pt-16 px-4 md:px-8 lg:px-24 font-inter bg-slate-50 text-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20">
        
        {/* Left Sidebar - Profile & Nav */}
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 border-[3px] border-cyan-500 shadow-inner relative">
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="font-bold text-xl font-montserrat text-slate-800">My Profile</h2>
            <p className="text-sm text-cyan-600 font-semibold mb-6 flex items-center justify-center gap-1"><Building2 className="w-3 h-3" /> Founder @ Stealth</p>
            <div className="text-xs text-slate-600 text-left space-y-3 border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center"><span className="font-medium">Direct Connections</span> <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">142</span></div>
              <div className="flex justify-between items-center"><span className="font-medium">Profile Views (30d)</span> <span className="text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded">45</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col gap-1 text-sm text-slate-600 font-bold tracking-wider uppercase">
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <UserPlus className="w-5 h-5" /> My Network
            </button>
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <Briefcase className="w-5 h-5" /> Opportunities
            </button>
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <MessageSquare className="w-5 h-5" /> Messages
              <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
            </button>
          </div>
        </div>

        {/* Main Feed Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Search Bar */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-400 transition-all">
            <Search className="text-slate-400 w-5 h-5 ml-4 shrink-0" />
            <input type="text" placeholder="Search founders, investors, or skills..." className="flex-1 p-3 bg-transparent outline-none text-slate-800 font-inter placeholder:text-slate-400" />
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors mr-1"><Filter className="w-4 h-4" /></button>
          </div>

          {/* Toggle Tab */}
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-full sm:w-fit mx-auto lg:mx-0">
            <button 
               onClick={() => setActiveTab('founders')} 
               className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'founders' ? 'bg-white text-cyan-600' : 'text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
               Founders Grid
            </button>
            <button 
               onClick={() => setActiveTab('investors')} 
               className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'investors' ? 'bg-white text-cyan-600' : 'text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
               Investors & Mentors
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {loading ? (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold">Loading profiles...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold">No profiles found in this category.</div>
            ) : filteredProfiles.map(profile => (
              <div key={profile.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-cyan-200 flex flex-col">
                {activeTab === 'investors' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200">
                     <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full flex-shrink-0 ${activeTab === 'investors' ? 'bg-amber-100 border-2 border-amber-400' : 'bg-cyan-100 border-2 border-cyan-400'}`}>
                    <img src={profile.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.first_name}`} alt={profile.first_name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="font-bold text-lg font-montserrat text-slate-900 group-hover:text-cyan-700 transition-colors">{profile.first_name} {profile.last_name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{profile.designation} @ {profile.company}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-2 flex items-center gap-1 uppercase tracking-wider">
                       <MapPin className="w-3 h-3" /> {profile.education || 'Location Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                     {(profile.skills ? profile.skills.split(',').slice(0, 3) : ['Skill']).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 tracking-wide uppercase">{tag.trim()}</span>
                     ))}
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3 font-inter flex-grow">
                  {profile.interests ? `Interests: ${profile.interests}` : (activeTab === 'investors' 
                    ? "Evaluating highly disruptive startups in the artificial intelligence and financial compliance sectors. We write checks between $500k to $2M."
                    : "Building the next generation of predictive LLMs for enterprise architecture. Seeking seed investment and Go-To-Market strategy mentors to scale rapidly.")}
                </p>
                
                <div className="flex gap-3 mt-auto">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all">Connect</button>
                  <button className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors uppercase text-xs font-bold tracking-widest text-slate-500">Message</button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar - Suggested Matches */}
        <div className="hidden lg:flex w-72 flex-col gap-6">
          <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
             {/* decorative blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-2">
               <Zap className="text-orange-500 w-5 h-5" fill="currentColor" />
               <h3 className="font-montserrat font-extrabold text-cyan-900 tracking-wider uppercase text-sm">Propulsion Match</h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 font-inter leading-relaxed relative z-10">Based on your Stealth profile and recent activities, these individuals perfectly align with your current stage.</p>
            
            <div className="space-y-3 relative z-10">
              {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-white p-2.5 rounded-xl transition-all border border-transparent hover:border-cyan-100 hover:shadow-sm">
                   <div className="w-10 h-10 bg-gradient-to-tr from-amber-200 to-orange-100 rounded-full shrink-0 border-2 border-white shadow-sm flex items-center justify-center font-bold text-amber-700 text-xs">SJ</div>
                   <div>
                     <h4 className="text-sm font-bold text-slate-800">Sarah V.</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seed Funder</p>
                   </div>
                 </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 bg-white border border-cyan-200 text-xs uppercase tracking-widest text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 font-bold text-center rounded-xl transition-colors relative z-10 shadow-sm">View All Matches</button>
          </div>
        </div>

      </div>
    </div>
  );
}
