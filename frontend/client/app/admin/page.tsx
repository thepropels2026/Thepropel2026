"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, 
  Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, 
  Download, Eye, Mail, Phone, Linkedin, User, FileText, 
  RefreshCw, Search, Trash2, BookOpen, MapPin, Clock, Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'courses' | 'stories' | 'applications' | 'careers' | 'kb'>('tools');
  const [loading, setLoading] = useState(false);

  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [kb, setKb] = useState<any[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'sushantsharma2805@gmail.com') {
      setIsAdmin(true);
    }
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tools') {
        const { data, error } = await supabase.from('tools_cards').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setTools(data || []);
      } else if (activeTab === 'courses') {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } else if (activeTab === 'stories') {
        const { data, error } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setStories(data || []);
      } else if (activeTab === 'applications') {
        const { data, error } = await supabase.from('applications').select('*, job_postings(title)').order('created_at', { ascending: false });
        if (error) throw error;
        setApplications(data || []);
      } else if (activeTab === 'careers') {
        const { data, error } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setJobs(data || []);
      } else if (activeTab === 'kb') {
        const { data, error } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setKb(data || []);
      }
    } catch (err: any) {
      console.error(`Error fetching ${activeTab}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchContent();
  }, [activeTab, isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === 'sushantsharma2805@gmail.com') {
      localStorage.setItem('adminSession', emailInput.toLowerCase());
      setIsAdmin(true);
      setError('');
    } else {
      setError('Unauthorized access. Admin privileges required.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      // Update local state immediately for better UX
      if (table === 'tools_cards') setTools(prev => prev.filter(t => t.id !== id));
      else if (table === 'courses') setCourses(prev => prev.filter(c => c.id !== id));
      else if (table === 'job_postings') setJobs(prev => prev.filter(j => j.id !== id));
      else if (table === 'success_stories') setStories(prev => prev.filter(s => s.id !== id));
      else if (table === 'knowledge_base') setKb(prev => prev.filter(k => k.id !== id));
      
      alert("Item removed successfully from the website.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // UPLOAD HANDLER
  const handleFileUpload = async (file: File, bucket: string): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  // HANDLERS
  const handleAddTool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const file = (data.image_file as File);
    
    try {
      let imageUrl = '';
      if (file && file.size > 0) {
        imageUrl = await handleFileUpload(file, 'tools');
      }

      const { error } = await supabase.from('tools_cards').insert({
        title: data.title,
        description: data.description,
        image_url: imageUrl || (data.image_url as string),
        redirect_link: data.redirect_link,
        category: data.category,
        price: parseFloat(data.price as string) || 0,
        discount_price: data.discount_price ? parseFloat(data.discount_price as string) : null,
      });
      if (error) throw error;
      alert("Tool added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const file = (data.image_file as File);

    try {
      let imageUrl = '';
      if (file && file.size > 0) {
        imageUrl = await handleFileUpload(file, 'courses');
      }

      const { error } = await supabase.from('courses').insert({
        title: data.title,
        image_url: imageUrl || (data.image_url as string),
        mentor: data.mentor,
        description: data.description,
        actual_price: parseFloat(data.actual_price as string) || 0,
        discounted_price: parseFloat(data.discounted_price as string) || 0,
        enroll_link: data.enroll_link,
      });
      if (error) throw error;
      alert("Course added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('job_postings').insert({
        title: data.title,
        description: data.description,
        role: data.role,
        qualification: data.qualification,
        eligibility: data.eligibility,
        stipend: data.stipend,
        work_duration: data.work_duration,
        location: data.location,
        mode: data.mode,
        is_active: true
      });
      if (error) throw error;
      alert("Job posted!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const avatarFile = (data.avatar_file as File);
    const mediaFile = (data.media_file as File);

    try {
      let avatarUrl = data.avatar_url as string;
      let mediaUrl = data.media_url as string;

      if (avatarFile && avatarFile.size > 0) avatarUrl = await handleFileUpload(avatarFile, 'stories');
      if (mediaFile && mediaFile.size > 0) mediaUrl = await handleFileUpload(mediaFile, 'stories');

      const { error } = await supabase.from('success_stories').insert({
        founder_name: data.founder_name,
        startup_name: data.startup_name,
        niche: data.niche,
        metric: data.metric,
        metric_label: data.metric_label,
        summary: data.summary,
        avatar_url: avatarUrl,
        media_url: mediaUrl,
        media_type: data.media_type || 'image',
      });
      if (error) throw error;
      alert("Story added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddKb = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const file = (data.kb_file as File);

    try {
      let fileUrl = '';
      if (file && file.size > 0) {
        fileUrl = await handleFileUpload(file, 'kb');
      }

      const { error } = await supabase.from('knowledge_base').insert({
        title: data.title,
        description: data.description,
        download_link: fileUrl || (data.download_link as string),
      });
      if (error) throw error;
      alert("Resource added to Knowledge Base!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const downloadPDF = async (app: any) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Candidate Profile", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${app.full_name}`, 20, 40);
    doc.text(`Email: ${app.email}`, 20, 50);
    doc.text(`Role: ${app.job_postings?.title || 'N/A'}`, 20, 60);
    doc.text(`Experience: ${app.experience}`, 20, 70);
    doc.text(`Status: ${app.status}`, 20, 80);
    doc.save(`${app.full_name}_Profile.pdf`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] text-slate-300 flex items-center justify-center font-sans p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">Restricted Area</h1>
          <p className="text-center text-sm text-slate-400 mb-8">Enter authorized administrator credentials to proceed.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="admin@thepropels.com" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all" />
            </div>
            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            <button type="submit" className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition-all">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans relative pb-20 overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Modern Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group cursor-pointer">
             <Image src="/logo.png" alt="Logo" width={24} height={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="font-montserrat text-xl font-black tracking-tighter uppercase text-white block leading-none">THE PROPELS</span>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[3px] mt-1 block">Command Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-4">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Status</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Secure Connection</div>
          </div>
          <button onClick={fetchContent} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reload Data">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-32 px-6 lg:px-12 flex flex-col lg:flex-row gap-10">
        
        {/* Futuristic Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-32 space-y-2 bg-[#0a0a0a] border border-white/10 p-3 rounded-3xl shadow-2xl">
            {[
              { id: 'tools', name: 'Startup Tools', icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { id: 'courses', name: 'Course Manager', icon: Video, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { id: 'stories', name: 'Success Stories', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { id: 'careers', name: 'Career Manager', icon: MapPin, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
              { id: 'kb', name: 'Knowledge Base', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { id: 'applications', name: 'Applications', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === tab.id 
                    ? `${tab.bg} ${tab.color} border border-white/10 shadow-lg` 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="text-sm font-bold tracking-wide">{tab.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === 'tools' && (
              <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-cyan-500/20 rounded-lg"><Plus className="w-5 h-5 text-cyan-400" /></div>
                    Add New Startup Tool
                  </h2>
                  <form onSubmit={handleAddTool} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tool Title</label>
                      <input name="title" required placeholder="e.g. AI Content Engine" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                      <select name="category" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all shadow-inner">
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Productivity">Productivity</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Upload Image (Preferred)</label>
                      <input name="image_file" type="file" accept="image/*" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2.5 text-sm text-white outline-none focus:border-cyan-500 transition-all" />
                      <p className="text-[9px] text-slate-600 mt-1 italic">Or paste URL below</p>
                      <input name="image_url" type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-xs text-white outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Direct Link</label>
                      <input name="redirect_link" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Actual Price (₹)</label>
                      <input name="price" type="number" required placeholder="0.00" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Discount Price (₹)</label>
                      <input name="discount_price" type="number" placeholder="Leave empty for no discount" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                      <textarea name="description" required placeholder="What does this tool do?" rows={3} className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all resize-none shadow-inner" />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4">
                      <button type="submit" className="bg-white text-black hover:bg-cyan-500 hover:text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Deploy Tool
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white font-bold flex items-center gap-2"><Library className="w-5 h-5 text-cyan-500" /> Tools on Website</h3>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tools.length} Tools Visible</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tools.map(tool => (
                      <div key={tool.id} className="group flex items-center justify-between p-5 bg-[#111] hover:bg-[#161616] rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <img src={tool.image_url} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{tool.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tool.category}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete('tools_cards', tool.id)} className="p-3 bg-red-500/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-400" /> Add New Course</h2>
                  <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Course Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    <input name="mentor" required placeholder="Mentor Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Upload Thumbnail (Preferred)</label>
                      <input name="image_file" type="file" accept="image/*" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2.5 text-sm text-white outline-none focus:border-orange-500 transition-all" />
                      <p className="text-[9px] text-slate-600 mt-1 italic">Or paste URL below</p>
                      <input name="image_url" type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-xs text-white outline-none focus:border-orange-500 transition-all" />
                    </div>
                    <input name="enroll_link" type="url" required placeholder="Enroll Link" className="bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-orange-500 transition-all" />
                    <input name="actual_price" type="number" required placeholder="Actual Price (₹)" className="bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-orange-500 transition-all" />
                    <input name="discounted_price" type="number" required placeholder="Discounted Price (₹)" className="bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-orange-500 transition-all" />
                    <textarea name="description" required placeholder="Course Description" rows={3} className="bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-orange-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-orange-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"><Plus className="w-4 h-4" /> Deploy Course</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Existing Courses</h3>
                  <div className="space-y-3">
                    {courses.map(course => (
                      <div key={course.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={course.image_url} className="w-10 h-10 rounded-lg object-cover" />
                          <div><p className="text-sm font-bold text-white">{course.title}</p><p className="text-xs text-slate-500">{course.mentor}</p></div>
                        </div>
                        <button onClick={() => handleDelete('courses', course.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'careers' && (
              <motion.div key="careers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-yellow-400" /> Post New Job</h2>
                  <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Job Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="role" required placeholder="Department (e.g. Engineering)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="location" required placeholder="Location" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="mode" required placeholder="Mode (Full-Time / Remote)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="stipend" required placeholder="Salary / Stipend Range" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="work_duration" required placeholder="Duration" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <textarea name="description" required placeholder="Job Description" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500 md:col-span-2 resize-none" />
                    <textarea name="qualification" required placeholder="Qualifications" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Post Job</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Active Postings</h3>
                  <div className="space-y-3">
                    {jobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-6 h-6 text-yellow-500" />
                          <div><p className="text-sm font-bold text-white">{job.title}</p><p className="text-xs text-slate-500">{job.location} · {job.role}</p></div>
                        </div>
                        <button onClick={() => handleDelete('job_postings', job.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stories' && (
              <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-purple-400" /> Add Success Story</h2>
                  <form onSubmit={handleAddStory} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="founder_name" required placeholder="Founder Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="startup_name" required placeholder="Startup Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="niche" required placeholder="Niche (AI / E-commerce / SaaS)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="metric" required placeholder="Metric (e.g. 50k+)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Founder Avatar (Optional)</label>
                      <input name="avatar_file" type="file" accept="image/*" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-xs text-white outline-none focus:border-purple-500 transition-all" />
                      <input name="avatar_url" type="url" placeholder="Or Avatar URL" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-[10px] text-white outline-none mt-2" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Story Media (Image/Video)</label>
                      <input name="media_file" type="file" accept="image/*,video/*" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-xs text-white outline-none focus:border-purple-500 transition-all" />
                      <input name="media_url" type="url" placeholder="Or Media URL" className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-2 text-[10px] text-white outline-none mt-2" />
                    </div>
                    <textarea name="summary" required placeholder="Founder Summary" rows={3} className="bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-purple-500 md:col-span-2 resize-none shadow-inner" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-purple-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"><Plus className="w-4 h-4" /> Publish Story</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Success Stories</h3>
                  <div className="space-y-3">
                    {stories.map(story => (
                      <div key={story.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={story.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                          <div><p className="text-sm font-bold text-white">{story.founder_name}</p><p className="text-xs text-slate-500">{story.startup_name}</p></div>
                        </div>
                        <button onClick={() => handleDelete('success_stories', story.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'kb' && (
              <motion.div key="kb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-400" /> Add Knowledge Base Resource</h2>
                  <form onSubmit={handleAddKb} className="grid grid-cols-1 gap-5">
                    <input name="title" required placeholder="Resource Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                    <textarea name="description" required placeholder="Brief Description" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 resize-none" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Document</label>
                      <input name="kb_file" type="file" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
                      <p className="text-[9px] text-slate-600 mt-1">Or paste link: <input name="download_link" type="url" placeholder="https://..." className="bg-transparent border-b border-white/10 ml-2 outline-none text-white w-48" /></p>
                    </div>
                    <div className="flex justify-end"><button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Resource</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Current Resources</h3>
                  <div className="space-y-3">
                    {kb.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                          <div><p className="text-sm font-bold text-white">{item.title}</p></div>
                        </div>
                        <button onClick={() => handleDelete('knowledge_base', item.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e] flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Job Applications</h2>
                      <p className="text-xs text-slate-500">{applications.length} submissions</p>
                    </div>
                    <button onClick={fetchContent} className="p-2 text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    {applications.map(app => (
                      <div key={app.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">{app.full_name ? app.full_name[0] : 'U'}</div>
                          <div><p className="text-sm font-bold text-white">{app.full_name}</p><p className="text-xs text-slate-500">{app.job_postings?.title || 'Unknown Role'} · {app.experience}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select value={app.status || 'pending'} onChange={e => updateAppStatus(app.id, e.target.value)} className="bg-black/40 text-xs border border-white/10 rounded-lg px-2 py-1 outline-none text-white">
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button onClick={() => downloadPDF(app)} className="p-2 bg-white/5 rounded-lg hover:text-white"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
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
