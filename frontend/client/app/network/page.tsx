"use client";
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MessageSquare, Briefcase, Filter, ShieldCheck, MapPin, Building2, Zap, ArrowRight, Users, Sparkles, UserCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

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
              <Users className="w-3 h-3" /> Founder Ecosystem
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Elite <br/>
              <span className="relative">
                Nodes Network.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-8">
             <div className="bg-white rounded-[40px] p-10 text-black shadow-2xl relative overflow-hidden group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 border-[4px] border-white shadow-xl relative overflow-hidden">
                   <UserCircle className="w-full h-full text-slate-200" />
                   <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="text-center">
                   <h2 className="font-black text-xl font-montserrat uppercase italic tracking-tighter">My Profile</h2>
                   <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-2">Stealth Founder</p>
                </div>
                
                <div className="mt-10 pt-10 border-t border-slate-100 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes</span>
                      <span className="text-sm font-black italic">142</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                      <span className="text-sm font-black italic text-cyan-600">45</span>
                   </div>
                </div>
             </div>

             <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-6 space-y-2 shadow-2xl">
                {[
                  { label: 'My Network', icon: <UserPlus className="w-5 h-5" /> },
                  { label: 'Opportunities', icon: <Briefcase className="w-5 h-5" /> },
                  { label: 'Intelligence', icon: <MessageSquare className="w-5 h-5" />, count: 3 }
                ].map((item, i) => (
                  <button key={i} className="w-full text-left p-6 hover:bg-white/[0.05] rounded-[2.5rem] transition-all flex items-center gap-4 group">
                     <div className="text-white/20 group-hover:text-cyan-500 transition-colors">{item.icon}</div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{item.label}</span>
                     {item.count && <span className="ml-auto bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">{item.count}</span>}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-9 space-y-12">
             {/* Search */}
             <div className="relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan nodes, sectors, or capital partners..." 
                  className="w-full h-20 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] pl-20 pr-8 text-sm font-black text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                />
                <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                   <Filter className="w-4 h-4 text-white/40" />
                </button>
             </div>

             {/* Toggles */}
             <div className="flex gap-4 p-2 bg-white/[0.03] rounded-[2rem] border border-white/5 w-fit">
                {['founders', 'investors'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`h-14 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? 'bg-white text-black shadow-2xl' 
                        : 'text-white/40 hover:bg-white/5'
                    }`}
                  >
                    {tab === 'founders' ? 'Founders Hub' : 'Investors & Mentors'}
                  </button>
                ))}
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {loading ? (
                   Array(4).fill(0).map((_, i) => (
                     <div key={i} className="h-[450px] rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
                   ))
                ) : filteredProfiles.length === 0 ? (
                   <div className="col-span-full py-32 text-center bg-white/[0.02] border border-white/10 rounded-[40px]">
                      <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
                      <h3 className="text-2xl font-black text-white/40 uppercase italic tracking-tight">No Profiles Detected</h3>
                   </div>
                ) : (
                  filteredProfiles.map((profile, i) => (
                    <motion.div 
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-white rounded-[40px] p-10 shadow-2xl flex flex-col justify-between min-h-[480px] relative overflow-hidden transition-all hover:-translate-y-2"
                    >
                       {/* Brand Accent */}
                       <div className={`absolute top-0 left-0 right-0 h-1.5 ${activeTab === 'investors' ? 'bg-orange-500' : 'bg-cyan-500'}`} />
                       
                       <div>
                          <div className="flex justify-between items-start mb-8">
                             <div className="w-20 h-20 rounded-3xl bg-slate-50 border-4 border-white shadow-xl overflow-hidden">
                                <img src={profile.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.first_name}`} alt={profile.first_name} className="w-full h-full object-cover" />
                             </div>
                             {activeTab === 'investors' && (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 text-[8px] font-black uppercase tracking-widest">
                                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                               </div>
                             )}
                          </div>

                          <h3 className="text-2xl font-black font-montserrat text-slate-900 uppercase italic tracking-tighter leading-tight mb-2">
                             {profile.first_name} {profile.last_name}
                          </h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                             {profile.designation} @ {profile.company || 'Stealth'}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-8">
                             {(profile.skills ? profile.skills.split(',') : ['Venture Scale', 'Product']).slice(0, 2).map((skill: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                   {skill.trim()}
                                </span>
                             ))}
                          </div>

                          <p className="text-slate-500 text-sm font-medium leading-relaxed italic line-clamp-3 mb-8">
                             "{profile.interests || 'Focused on building the next generation of global infrastructure with systematic precision.'}"
                          </p>
                       </div>

                       <div className="pt-8 border-t border-slate-50 flex gap-4">
                          <button className={`flex-1 h-14 rounded-2xl ${activeTab === 'investors' ? 'bg-orange-600 shadow-orange-100' : 'bg-cyan-600 shadow-cyan-100'} text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all`}>
                             Initiate Sync
                          </button>
                          <button className="h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 transition-all">
                             <MessageSquare className="w-5 h-5" />
                          </button>
                       </div>
                    </motion.div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
