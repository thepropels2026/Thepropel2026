"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, Users, Briefcase, Building2, Search, ArrowRight } from 'lucide-react';

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAllProfiles() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err) {
        console.error('Error fetching admin profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProfiles();
  }, []);

  const downloadCSV = () => {
    if (profiles.length === 0) return;

    // Extract headers from the first object
    const headers = Object.keys(profiles[0]);
    
    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add header row

    for (const row of profiles) {
      const values = headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `propels_profiles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProfiles = profiles.filter(p => 
    p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-24 bg-[#050505] text-white font-inter">
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-2">Admin <span className="text-cyan-500">Dashboard</span></h1>
            <p className="text-white/60 text-sm">Manage and export platform user profiles.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search profiles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-cyan-500 outline-none transition-colors placeholder-white/30"
              />
            </div>
            <button 
              onClick={downloadCSV}
              disabled={profiles.length === 0}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-white/10 disabled:text-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide flex items-center gap-2 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" /> 
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-4 right-4 text-cyan-500/20"><Users className="w-16 h-16" /></div>
             <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Total Users</p>
             <h3 className="text-4xl font-black font-montserrat">{profiles.length}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-4 right-4 text-orange-500/20"><Briefcase className="w-16 h-16" /></div>
             <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Founders</p>
             <h3 className="text-4xl font-black font-montserrat">
               {profiles.filter(p => !p.designation?.toLowerCase().includes('investor')).length}
             </h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-4 right-4 text-green-500/20"><Building2 className="w-16 h-16" /></div>
             <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Investors</p>
             <h3 className="text-4xl font-black font-montserrat">
               {profiles.filter(p => p.designation?.toLowerCase().includes('investor')).length}
             </h3>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-white/50 font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Identifier</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                      Loading profile data...
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                      No profiles found.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold flex items-center gap-3">
                         <img 
                           src={profile.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.first_name}`} 
                           alt="avatar" 
                           className="w-8 h-8 rounded-full border border-white/20" 
                         />
                         {profile.first_name} {profile.last_name}
                      </td>
                      <td className="px-6 py-4 text-white/80">{profile.designation}</td>
                      <td className="px-6 py-4 text-cyan-400 font-medium">{profile.company}</td>
                      <td className="px-6 py-4 text-white/60">{profile.identifier}</td>
                      <td className="px-6 py-4 text-white/40">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
