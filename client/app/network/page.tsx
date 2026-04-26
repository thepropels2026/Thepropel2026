"use client"; // Enable client-side rendering
import React, { useState, useEffect } from 'react'; // React core hooks
import { Search, UserPlus, MessageSquare, Briefcase, Filter, ShieldCheck, MapPin, Building2, Zap } from 'lucide-react'; // Icon library
import { supabase } from '@/lib/supabase'; // Database client

/**
 * NetworkPage: A social-style directory for connecting founders and investors.
 */
export default function NetworkPage() {
  // Tab state to switch between viewing 'founders' or 'investors'
  const [activeTab, setActiveTab] = useState<'founders' | 'investors'>('founders');
  // State for user profile records and loading status
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all profiles from Supabase on component mount
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

  // Filtering logic: Investors are identified by specific keywords in their designation
  const filteredProfiles = profiles.filter(profile => {
     const designation = profile.designation?.toLowerCase() || '';
     const isInvestor = designation.includes('investor') || designation.includes('partner') || designation.includes('vc');
     return activeTab === 'investors' ? isInvestor : !isInvestor;
  });

  return (
    <div className="min-h-screen pt-16 px-4 md:px-8 lg:px-24 font-inter bg-slate-50 text-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20">
        
        {/* Left Sidebar: Mini Profile Summary and Navigation Links */}
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
            {/* Avatar Circle with Online Status Indicator */}
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 border-[3px] border-cyan-500 shadow-inner relative">
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="font-bold text-xl font-montserrat text-slate-800">My Profile</h2>
            <p className="text-sm text-cyan-600 font-semibold mb-6 flex items-center justify-center gap-1"><Building2 className="w-3 h-3" /> Founder @ Stealth</p>
            {/* Profile Statistics */}
            <div className="text-xs text-slate-600 text-left space-y-3 border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center"><span className="font-medium">Direct Connections</span> <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">142</span></div>
              <div className="flex justify-between items-center"><span className="font-medium">Profile Views (30d)</span> <span className="text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded">45</span></div>
            </div>
          </div>
        </div>

        {/* Main Feed Area: Search, Tabs, and Profile Cards */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Global Search Bar */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-cyan-500/20">
            <Search className="text-slate-400 w-5 h-5 ml-4 shrink-0" />
            <input type="text" placeholder="Search founders or skills..." className="flex-1 p-3 bg-transparent outline-none text-slate-800" />
          </div>

          {/* Toggle Tab for Category Switching */}
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
            <button onClick={() => setActiveTab('founders')} className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all ${activeTab === 'founders' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500'}`}>Founders Grid</button>
            <button onClick={() => setActiveTab('investors')} className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all ${activeTab === 'investors' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500'}`}>Investors & Mentors</button>
          </div>

          {/* Dynamic Grid of Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {loading ? <div className="col-span-full text-center py-20 text-slate-400">Loading directory...</div> : 
             filteredProfiles.map(profile => (
              <div key={profile.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative hover:shadow-xl transition-all">
                {/* Profile Header (Photo, Name, Bio) */}
                <div className="flex items-start gap-4 mb-4">
                  <img src={profile.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.first_name}`} alt="user" className="w-16 h-16 rounded-full border-2 border-cyan-400" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{profile.first_name} {profile.last_name}</h3>
                    <p className="text-sm text-slate-500">{profile.designation} @ {profile.company}</p>
                  </div>
                </div>
                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(profile.skills?.split(',') || []).slice(0, 3).map((tag: any) => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">{tag.trim()}</span>
                  ))}
                </div>
                {/* CTA Buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-cyan-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase">Connect</button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-500">Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
