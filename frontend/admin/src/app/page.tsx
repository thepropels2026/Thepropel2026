"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  GraduationCap, 
  Search, 
  Briefcase, 
  Users, 
  Settings, 
  Plus, 
  RefreshCw, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User,
  Mail,
  Linkedin,
  FileText,
  Download,
  AlertTriangle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Helper to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'reviewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'accepted': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
};

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  
  // Search states
  const [appSearch, setAppSearch] = useState('');
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => {
    // Simple admin check
    const user = localStorage.getItem('adminUser');
    if (user === 'sushantsharma2805@gmail.com') {
      setIsAdmin(true);
      fetchContent();
      fetchApplications();
    }
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch Tools
      const { data: toolsData } = await supabase.from('tools_cards').select('*').order('created_at', { ascending: false });
      setTools(toolsData || []);

      // Fetch Courses
      const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      setCourses(coursesData || []);

      // Fetch Jobs
      const { data: jobsData } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false });
      setJobs(jobsData || []);

      // Fetch Stories
      const { data: storiesData } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false });
      setStories(storiesData || []);

      // Fetch Knowledge Base
      const { data: kbData } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
      setKnowledge(kbData || []);

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, job_postings(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to remove this item? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      alert('Item removed successfully');
      fetchContent(); // Refresh the lists
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchApplications();
    } catch (err: any) {
      alert(\"Failed to update status: \" + err.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    if (email === 'sushantsharma2805@gmail.com') {
      localStorage.setItem('adminUser', email);
      setIsAdmin(true);
      fetchContent();
      fetchApplications();
    } else {
      alert('Unauthorized access');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
  };

  // Add Handlers
  const handleAddTool = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const toolData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      redirect_link: formData.get('redirect_link'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price') as string || '0'),
      discount_price: parseFloat(formData.get('discount_price') as string || '0'),
    };

    const { error } = await supabase.from('tools_cards').insert([toolData]);
    if (error) alert(error.message);
    else {
      alert('Tool added!');
      e.target.reset();
      fetchContent();
    }
  };

  const handleAddCourse = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      image_url: formData.get('image_url'),
      mentor: formData.get('mentor'),
      description: formData.get('description'),
      actual_price: parseFloat(formData.get('actual_price') as string || '0'),
      discounted_price: parseFloat(formData.get('discounted_price') as string || '0'),
      enroll_link: formData.get('enroll_link'),
    };

    const { error } = await supabase.from('courses').insert([data]);
    if (error) alert(error.message);
    else {
      alert('Course added!');
      e.target.reset();
      fetchContent();
    }
  };

  const handleAddJob = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      role: formData.get('role'),
      location: formData.get('location'),
      mode: formData.get('mode'),
      stipend: formData.get('stipend'),
      work_duration: formData.get('work_duration'),
      qualification: formData.get('qualification'),
      eligibility: formData.get('eligibility'),
      description: formData.get('description'),
    };

    const { error } = await supabase.from('job_postings').insert([data]);
    if (error) alert(error.message);
    else {
      alert('Job posted!');
      e.target.reset();
      fetchContent();
    }
  };

  const handleAddStory = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      founder_name: formData.get('founder_name'),
      startup_name: formData.get('startup_name'),
      niche: formData.get('niche'),
      metric: formData.get('metric'),
      metric_label: formData.get('metric_label'),
      summary: formData.get('summary'),
      avatar_url: formData.get('avatar_url'),
      media_url: formData.get('media_url'),
      media_type: formData.get('media_type'),
    };

    const { error } = await supabase.from('success_stories').insert([data]);
    if (error) alert(error.message);
    else {
      alert('Story added!');
      e.target.reset();
      fetchContent();
    }
  };

  const handleAddKnowledge = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      download_link: formData.get('download_link'),
      description: formData.get('description'),
    };

    const { error } = await supabase.from('knowledge_base').insert([data]);
    if (error) alert(error.message);
    else {
      alert('Resource added!');
      e.target.reset();
      fetchContent();
    }
  };

  // PDF Generator for Admin View
  const downloadAdminPDF = async (app: any) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Applicant Profile: ' + app.full_name, 20, 20);
    doc.setFontSize(12);
    doc.text('Job Title: ' + (app.job_postings?.title || 'N/A'), 20, 35);
    doc.text('Email: ' + app.email, 20, 45);
    doc.text('Phone: ' + app.phone, 20, 55);
    doc.text('Experience: ' + app.experience, 20, 65);
    doc.text('LinkedIn: ' + (app.linkedin_url || 'N/A'), 20, 75);
    doc.text('Status: ' + app.status, 20, 85);
    doc.text('Cover Letter:', 20, 100);
    const splitText = doc.splitTextToSize(app.cover_letter || 'No cover letter provided.', 170);
    doc.text(splitText, 20, 110);
    doc.save(`Applicant_${app.full_name}.pdf`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-inter">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Admin Access</h1>
            <p className="text-slate-500 text-sm">Please authenticate to manage The Propels ecosystem.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="admin@thepropels.in"
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700" 
              />
            </div>
            <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-cyan-500 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/30">
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-inter flex">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:relative z-50 h-screen bg-[#080808] border-r border-white/5 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col`}>
        {/* Sidebar Branding */}
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <img src=\"/logo.png\" alt=\"Propels Logo\" className=\"w-8 h-8 rounded-lg\" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className=\"text-xl font-black text-white tracking-tighter\">THE <span className=\"text-cyan-500\">PROPELS</span></h1>
              <p className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest\">Admin Portal</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview', color: 'text-cyan-400' },
            { id: 'applications', icon: User, label: 'Applications', color: 'text-emerald-400' },
            { id: 'tools', icon: Wrench, label: 'Tools Library', color: 'text-blue-400' },
            { id: 'courses', icon: GraduationCap, label: 'Course Manager', color: 'text-purple-400' },
            { id: 'stories', icon: Users, label: 'Success Stories', color: 'text-orange-400' },
            { id: 'careers', icon: Briefcase, label: 'Job Board', color: 'text-pink-400' },
            { id: 'knowledge', icon: Search, label: 'Resources', color: 'text-indigo-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-white/5 text-white shadow-inner' : 'hover:bg-white/[0.02] text-slate-500'}`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? item.color : 'group-hover:text-white'}`} />
              {isSidebarOpen && <span className=\"text-sm font-bold tracking-tight\">{item.label}</span>}
              {isSidebarOpen && activeTab === item.id && <motion.div layoutId=\"active\" className=\"ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]\" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className=\"text-sm\">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#050505] relative">
        {/* Header bar */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest hidden md:block">{activeTab} Management</h2>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={fetchContent} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">Sushant Sharma</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-white shadow-lg">
                S
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* DASHBOARD OVERVIEW SECTION */}
            {activeTab === 'dashboard' && (
              <motion.div key=\"dashboard\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10\">
                  {[
                    { label: 'Total Tools', value: tools.length, icon: Wrench, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-cyan-500/20' },
                    { label: 'Course Count', value: courses.length, icon: GraduationCap, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20' },
                    { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'from-orange-500/20 to-yellow-500/20', border: 'border-orange-500/20' },
                    { label: 'Applications', value: applications.length, icon: User, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-[#0a0a0a] border ${stat.border} p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-3xl opacity-20 -mr-10 -mt-10 group-hover:opacity-40 transition-opacity`} />
                      <stat.icon className=\"w-5 h-5 text-slate-500 mb-4\" />
                      <h3 className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest\">{stat.label}</h3>
                      <p className=\"text-3xl font-black text-white mt-1\">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions or recent activity would go here */}
                <div className=\"bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 text-center\">
                  <div className=\"w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4\">
                    <Settings className=\"w-8 h-8 text-slate-600\" />
                  </div>
                  <h3 className=\"text-xl font-bold text-white\">System Operational</h3>
                  <p className=\"text-slate-500 text-sm mt-2 max-w-sm mx-auto\">The Admin portal is successfully synchronized with the Supabase production environment.</p>
                </div>
              </motion.div>
            )}

            {/* TOOLS MANAGEMENT SECTION */}
            {activeTab === 'tools' && (
              <motion.div key=\"tools\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e]\">
                    <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                      <Plus className=\"w-5 h-5 text-cyan-400\" /> Add New Propulsion Tool
                    </h2>
                    <p className=\"text-xs text-slate-400 mt-1\">Create a new tool card for the main website directory.</p>
                  </div>
                  <div className=\"p-6\">
                    <form className=\"space-y-5\" onSubmit={handleAddTool}>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Tool Title</label>
                          <input name=\"title\" type=\"text\" required placeholder=\"e.g. Valuation Engine\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Category</label>
                          <select name=\"category\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\">
                            <option value=\"infrastructure\">Infrastructure</option>
                            <option value=\"finance\">Finance</option>
                            <option value=\"marketing\">Marketing</option>
                            <option value=\"productivity\">Productivity</option>
                            <option value=\"general\">General</option>
                          </select>
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Image URL</label>
                          <input name=\"image_url\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Redirect Link</label>
                          <input name=\"redirect_link\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Actual Price ($)</label>
                          <input name=\"price\" type=\"number\" step=\"0.01\" required placeholder=\"0.00\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Discount Price ($)</label>
                          <input name=\"discount_price\" type=\"number\" step=\"0.01\" placeholder=\"0.00\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Description</label>
                        <textarea name=\"description\" required rows={3} placeholder=\"Short tool summary...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"pt-4 border-t border-white/10 flex justify-end\">
                        <button type=\"submit\" className=\"bg-cyan-500 text-white hover:bg-cyan-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]\">
                          <Plus className=\"w-4 h-4\" /> Add Tool
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current tools for removal */}
                <div className=\"mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center\">
                    <h3 className=\"text-sm font-bold text-white uppercase tracking-wider\">Current Tools Library</h3>
                    <span className=\"text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono\">{tools.length} TOOLS</span>
                  </div>
                  <div className=\"divide-y divide-white/5\">
                    {loading && tools.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 animate-pulse text-sm\">Loading tools...</div>
                    ) : tools.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 text-sm\">No tools found.</div>
                    ) : (
                      tools.map((tool) => (
                        <div key={tool.id} className=\"p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group\">
                          <div className=\"flex items-center gap-4\">
                            <img src={tool.image_url} alt=\"\" className=\"w-10 h-10 rounded-lg object-contain bg-white/5\" />
                            <div>
                              <h4 className=\"text-sm font-bold text-white\">{tool.title}</h4>
                              <p className=\"text-[10px] text-slate-500\">{tool.category} · ${tool.price}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('tools_cards', tool.id)}
                            className=\"p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                          >
                            <ShieldAlert className=\"w-4 h-4\" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COURSE MANAGEMENT SECTION */}
            {activeTab === 'courses' && (
              <motion.div key=\"courses\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e]\">
                    <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                      <GraduationCap className=\"w-5 h-5 text-purple-400\" /> Course Manager
                    </h2>
                    <p className=\"text-xs text-slate-400 mt-1\">Publish new educational content and masterclasses.</p>
                  </div>
                  <div className=\"p-6\">
                    <form className=\"space-y-5\" onSubmit={handleAddCourse}>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Course Title</label>
                          <input name=\"title\" type=\"text\" required placeholder=\"e.g. Pre-Seed Masterclass\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Mentor Name</label>
                          <input name=\"mentor\" type=\"text\" required placeholder=\"e.g. Navin Sharma\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Thumbnail URL</label>
                          <input name=\"image_url\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Enroll Link</label>
                          <input name=\"enroll_link\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Actual Price</label>
                          <input name=\"actual_price\" type=\"number\" step=\"0.01\" required placeholder=\"0.00\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Discounted Price</label>
                          <input name=\"discounted_price\" type=\"number\" step=\"0.01\" required placeholder=\"0.00\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Course Description</label>
                        <textarea name=\"description\" required rows={3} placeholder=\"What is this course about?\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"pt-4 border-t border-white/10 flex justify-end\">
                        <button type=\"submit\" className=\"bg-purple-500 text-white hover:bg-purple-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]\">
                          <Plus className=\"w-4 h-4\" /> Add Course
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current courses for removal */}
                <div className=\"mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center\">
                    <h3 className=\"text-sm font-bold text-white uppercase tracking-wider\">Current Courses</h3>
                    <span className=\"text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono\">{courses.length} COURSES</span>
                  </div>
                  <div className=\"divide-y divide-white/5\">
                    {loading && courses.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 animate-pulse text-sm\">Loading courses...</div>
                    ) : courses.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 text-sm\">No courses found.</div>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className=\"p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group\">
                          <div className=\"flex items-center gap-4\">
                            <img src={course.image_url} alt=\"\" className=\"w-10 h-10 rounded-lg object-cover bg-white/5\" />
                            <div>
                              <h4 className=\"text-sm font-bold text-white\">{course.title}</h4>
                              <p className=\"text-[10px] text-slate-500\">By {course.mentor} · ₹{course.discounted_price}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('courses', course.id)}
                            className=\"p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                          >
                            <ShieldAlert className=\"w-4 h-4\" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STORIES MANAGEMENT SECTION */}
            {activeTab === 'stories' && (
              <motion.div key=\"stories\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e]\">
                    <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                      <Users className=\"w-5 h-5 text-orange-400\" /> Success Stories
                    </h2>
                    <p className=\"text-xs text-slate-400 mt-1\">Showcase the founders and startups thriving with The Propels.</p>
                  </div>
                  <div className=\"p-6\">
                    <form className=\"space-y-5\" onSubmit={handleAddStory}>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Founder Name</label>
                          <input name=\"founder_name\" type=\"text\" required placeholder=\"e.g. Alex Rivera\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Startup Name</label>
                          <input name=\"startup_name\" type=\"text\" required placeholder=\"e.g. EcoFlow\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Avatar URL</label>
                          <input name=\"avatar_url\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Niche / Sector</label>
                          <input name=\"niche\" type=\"text\" required placeholder=\"e.g. FinTech\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Success Metric</label>
                          <input name=\"metric\" type=\"text\" required placeholder=\"e.g. $1.2M\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Metric Label</label>
                          <input name=\"metric_label\" type=\"text\" required placeholder=\"e.g. Seed Raised\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Media URL (Main Story Image)</label>
                          <input name=\"media_url\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Media Type</label>
                          <select name=\"media_type\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors\">
                            <option value=\"image\">Image</option>
                            <option value=\"video\">Video</option>
                          </select>
                        </div>
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Story Summary</label>
                        <textarea name=\"summary\" required rows={3} placeholder=\"Quick summary of the success...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"pt-4 border-t border-white/10 flex justify-end\">
                        <button type=\"submit\" className=\"bg-orange-500 text-white hover:bg-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]\">
                          <Plus className=\"w-4 h-4\" /> Add Story
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current stories for removal */}
                <div className=\"mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center\">
                    <h3 className=\"text-sm font-bold text-white uppercase tracking-wider\">Current Stories</h3>
                    <span className=\"text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono\">{stories.length} STORIES</span>
                  </div>
                  <div className=\"divide-y divide-white/5\">
                    {loading && stories.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 animate-pulse text-sm\">Loading stories...</div>
                    ) : stories.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 text-sm\">No stories found.</div>
                    ) : (
                      stories.map((story) => (
                        <div key={story.id} className=\"p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group\">
                          <div className=\"flex items-center gap-4\">
                            <img src={story.avatar_url} alt=\"\" className=\"w-10 h-10 rounded-lg object-cover bg-white/5\" />
                            <div>
                              <h4 className=\"text-sm font-bold text-white\">{story.startup_name}</h4>
                              <p className=\"text-[10px] text-slate-500\">{story.founder_name} · {story.niche}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('success_stories', story.id)}
                            className=\"p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                          >
                            <ShieldAlert className=\"w-4 h-4\" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* JOB APPLICATIONS MANAGEMENT SECTION */}
            {activeTab === 'applications' && (
              <motion.div key=\"applications\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  {/* Applications List Header */}
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e] flex items-center justify-between gap-4 flex-wrap\">
                    <div>
                      <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                        <Briefcase className=\"w-5 h-5 text-emerald-400\" /> Applications
                      </h2>
                      <p className=\"text-xs text-slate-400 mt-1\">{applications.length} total submission{applications.length !== 1 ? 's' : ''}</p>
                    </div>
                    {/* Search and Refresh Tools */}
                    <div className=\"flex items-center gap-3\">
                      <input
                        value={appSearch}
                        onChange={e => setAppSearch(e.target.value)}
                        placeholder=\"Search by name, email...\"
                        className=\"bg-[#111] border border-white/10 text-white text-sm rounded-xl px-4 py-2 placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-52 transition-all\"
                      />
                      <button onClick={fetchApplications} title=\"Refresh\" className=\"p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors\">
                        <RefreshCw className=\"w-4 h-4\" />
                      </button>
                    </div>
                  </div>

                  <div className=\"p-6\">
                    {/* Conditional rendering for loading state, empty state, and data list */}
                    {appsLoading ? (
                      <div className=\"flex justify-center py-16\">
                        <div className=\"w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin\" />
                      </div>
                    ) : applications.filter(a =>
                        a.full_name?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.job_postings?.title?.toLowerCase().includes(appSearch.toLowerCase())
                      ).length === 0 ? (
                      <div className=\"text-center py-16 text-slate-500\">
                        <Briefcase className=\"w-12 h-12 mx-auto mb-3 opacity-30\" />
                        <p className=\"font-semibold\">No applications found.</p>
                      </div>
                    ) : (
                      <div className=\"space-y-4\">
                        {/* Map and filter application data to display individual rows */}
                        {applications
                          .filter(a =>
                            a.full_name?.toLowerCase().includes(appSearch.toLowerCase()) ||
                            a.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                            a.job_postings?.title?.toLowerCase().includes(appSearch.toLowerCase())
                          )
                          .map(app => {
                            // Dynamic status styles for the select dropdown
                            const statusStyles: Record<string, string> = {
                              pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                              reviewed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                              accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                              rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
                            };
                            return (
                              <div key={app.id} className=\"bg-[#111] border border-white/8 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-emerald-500/30 transition-colors\">
                                {/* Candidate Information Section */}
                                <div className=\"flex items-center gap-4\">
                                  <div className=\"w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0\">
                                    {app.photo_url ? (
                                      <img src={app.photo_url} alt={app.full_name} className=\"w-10 h-10 rounded-full object-cover\" />
                                    ) : (
                                      <User className=\"w-5 h-5 text-slate-400\" />
                                    )}
                                  </div>
                                  <div>
                                    <p className=\"font-bold text-white text-sm\">{app.full_name}</p>
                                    <p className=\"text-xs text-slate-400\">{app.job_postings?.title || 'Unknown Role'} · {app.experience}</p>
                                    <div className=\"flex items-center gap-3 mt-1\">
                                      <a href={`mailto:${app.email}`} className=\"text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors\">
                                        <Mail className=\"w-3 h-3\" />{app.email}
                                      </a>
                                      {app.linkedin_url && (
                                        <a href={app.linkedin_url} target=\"_blank\" rel=\"noreferrer\" className=\"text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors\">
                                          <Linkedin className=\"w-3 h-3\" /> LinkedIn
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Management and Document Actions */}
                                <div className=\"flex items-center gap-3 shrink-0\">
                                  {/* Status Selector */}
                                  <select
                                    value={app.status || 'pending'}
                                    onChange={e => updateStatus(app.id, e.target.value)}
                                    className={`text-xs font-bold border rounded-lg px-2 py-1.5 bg-transparent cursor-pointer outline-none ${statusStyles[app.status] || statusStyles.pending}`}
                                  >
                                    <option value=\"pending\">Pending</option>
                                    <option value=\"reviewed\">Reviewed</option>
                                    <option value=\"accepted\">Accepted</option>
                                    <option value=\"rejected\">Rejected</option>
                                  </select>
                                  {/* Resume View Link */}
                                  {app.resume_url && (
                                    <a href={app.resume_url} target=\"_blank\" rel=\"noreferrer\" title=\"View Resume\" className=\"p-2 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors\">
                                      <FileText className=\"w-4 h-4\" />
                                    </a>
                                  )}
                                  {/* PDF Download Button */}
                                  <button
                                    onClick={() => downloadAdminPDF(app)}
                                    title=\"Download Admin PDF\"
                                    className=\"p-2 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors\"
                                  >
                                    <Download className=\"w-4 h-4\" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAREERS / JOBS MANAGEMENT SECTION */}
            {activeTab === 'careers' && (
              <motion.div key=\"careers\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e]\">
                    <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                      <Briefcase className=\"w-5 h-5 text-pink-400\" /> Job Postings
                    </h2>
                    <p className=\"text-xs text-slate-400 mt-1\">Add new job openings for the Careers page.</p>
                  </div>
                  <div className=\"p-6\">
                    <form className=\"space-y-5\" onSubmit={handleAddJob}>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Job Title</label>
                          <input name=\"title\" type=\"text\" required placeholder=\"e.g. Senior Developer\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Role</label>
                          <input name=\"role\" type=\"text\" required placeholder=\"e.g. Engineering\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Location</label>
                          <input name=\"location\" type=\"text\" required placeholder=\"e.g. Remote, NY\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Mode</label>
                          <input name=\"mode\" type=\"text\" required placeholder=\"e.g. Full-Time\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Stipend / Salary</label>
                          <input name=\"stipend\" type=\"text\" required placeholder=\"e.g. $100k - $120k\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Work Duration</label>
                          <input name=\"work_duration\" type=\"text\" required placeholder=\"e.g. Permanent\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Qualification</label>
                        <input name=\"qualification\" type=\"text\" required placeholder=\"e.g. BS in Computer Science\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors\" />
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Eligibility</label>
                        <textarea name=\"eligibility\" required rows={2} placeholder=\"Who is eligible...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Job Description</label>
                        <textarea name=\"description\" required rows={3} placeholder=\"Job description...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"pt-4 border-t border-white/10 flex justify-end\">
                        <button type=\"submit\" className=\"bg-pink-500 text-white hover:bg-pink-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.3)]\">
                          <Plus className=\"w-4 h-4\" /> Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current jobs for removal */}
                <div className=\"mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center\">
                    <h3 className=\"text-sm font-bold text-white uppercase tracking-wider\">Current Job Postings</h3>
                    <span className=\"text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono\">{jobs.length} JOBS</span>
                  </div>
                  <div className=\"divide-y divide-white/5\">
                    {loading && jobs.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 animate-pulse text-sm\">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 text-sm\">No jobs found.</div>
                    ) : (
                      jobs.map((job) => (
                        <div key={job.id} className=\"p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group\">
                          <div className=\"flex items-center gap-4\">
                            <div className=\"w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center\">
                              <Briefcase className=\"w-5 h-5 text-slate-500\" />
                            </div>
                            <div>
                              <h4 className=\"text-sm font-bold text-white\">{job.title}</h4>
                              <p className=\"text-[10px] text-slate-500\">{job.location} · {job.mode}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('job_postings', job.id)}
                            className=\"p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                          >
                            <ShieldAlert className=\"w-4 h-4\" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* KNOWLEDGE BASE MANAGEMENT SECTION */}
            {activeTab === 'knowledge' && (
              <motion.div key=\"knowledge\" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className=\"bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-5 bg-[#0e0e0e]\">
                    <h2 className=\"text-lg font-bold text-white flex items-center gap-2\">
                      <Search className=\"w-5 h-5 text-blue-400\" /> Knowledge Base Resources
                    </h2>
                    <p className=\"text-xs text-slate-400 mt-1\">Upload and manage PDFs or documents for the Guide page.</p>
                  </div>
                  <div className=\"p-6\">
                    <form className=\"space-y-5\" onSubmit={handleAddKnowledge}>
                      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Resource Title</label>
                          <input name=\"title\" type=\"text\" required placeholder=\"e.g. Seed Pitch Deck Template\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors\" />
                        </div>
                        <div className=\"space-y-2\">
                          <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Download Link (PDF URL)</label>
                          <input name=\"download_link\" type=\"url\" required placeholder=\"https://...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors\" />
                        </div>
                      </div>
                      <div className=\"space-y-2\">
                        <label className=\"text-xs font-semibold text-slate-400 uppercase tracking-wider\">Description</label>
                        <textarea name=\"description\" required rows={3} placeholder=\"Briefly describe the resource...\" className=\"w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none\" />
                      </div>
                      <div className=\"pt-4 border-t border-white/10 flex justify-end\">
                        <button type=\"submit\" className=\"bg-blue-500 text-white hover:bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]\">
                          <Plus className=\"w-4 h-4\" /> Add Resource
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current knowledge items for removal */}
                <div className=\"mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl\">
                  <div className=\"border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center\">
                    <h3 className=\"text-sm font-bold text-white uppercase tracking-wider\">Current Resources</h3>
                    <span className=\"text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono\">{knowledge.length} ITEMS</span>
                  </div>
                  <div className=\"divide-y divide-white/5\">
                    {loading && knowledge.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 animate-pulse text-sm\">Loading resources...</div>
                    ) : knowledge.length === 0 ? (
                      <div className=\"p-10 text-center text-slate-500 text-sm\">No resources found.</div>
                    ) : (
                      knowledge.map((k) => (
                        <div key={k.id} className=\"p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group\">
                          <div className=\"flex items-center gap-4\">
                            <div className=\"w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center\">
                              <Download className=\"w-5 h-5 text-slate-500\" />
                            </div>
                            <div>
                              <h4 className=\"text-sm font-bold text-white\">{k.title}</h4>
                              <p className=\"text-[10px] text-slate-500 truncate max-w-[200px]\">{k.description}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('knowledge_base', k.id)}
                            className=\"p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                          >
                            <ShieldAlert className=\"w-4 h-4\" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
