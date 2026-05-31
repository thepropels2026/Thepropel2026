"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, 
  Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, 
  Download, Eye, Mail, Phone, Linkedin, User, FileText, 
  RefreshCw, Search, Trash2, BookOpen, MapPin, Clock, DollarSign, Check, Library
, Edit3, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'courses' | 'stories' | 'applications' | 'careers' | 'pricing' | 'kb'>('tools');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>(\'\');

  // Data states
  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
      } else if (activeTab === 'pricing') {
        const { data, error } = await supabase.from('pricing_plans').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        setPricingPlans(data || []);
      } else if (activeTab === 'kb') {
        const { data, error } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setKnowledgeBase(data || []);
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
      alert("Item removed successfully!");
      fetchContent();
    } catch (err: any) {
      alert("Error removing item: " + err.message);
    }
  };

  const handleEditSave = async (updatedData: any) => {
    try {
      const { id, created_at, ...updatePayload } = updatedData;
      const { error } = await supabase.from(editingType).update(updatePayload).eq('id', id);
      if (error) throw error;
      alert("Successfully updated!");
      setEditingItem(null);
      fetchContent();
    } catch (err: any) {
      alert("Error updating: " + err.message);
    }
  };


  // HANDLERS
  const handleAddTool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('tools_cards').insert({
        title: data.title,
        description: data.description,
        image_url: data.image_url,
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
    try {
      const { error } = await supabase.from('courses').insert({
        title: data.title,
        image_url: data.image_url,
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
    try {
      const { error } = await supabase.from('success_stories').insert({
        founder_name: data.founder_name,
        startup_name: data.startup_name,
        niche: data.niche,
        metric: data.metric,
        metric_label: data.metric_label,
        summary: data.summary,
        avatar_url: data.avatar_url,
        media_url: data.media_url,
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

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddKB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    setLoading(true);
    try {
      let download_link = formData.get('download_link') as string;
      if (file && file.size > 0) {
        download_link = await uploadFile(file, 'kb-documents');
      }

      const { error } = await supabase.from('knowledge_base').insert({
        title: formData.get('title'),
        description: formData.get('description'),
        download_link: download_link,
        file_type: formData.get('file_type') || 'pdf',
        category: formData.get('category') || 'Template'
      });
      if (error) throw error;
      alert("Document added to Knowledge Base!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    setSelectedCourseId(courseId);
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      console.error("Error fetching modules:", err.message);
    }
  };

  const handleAddModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    setLoading(true);
    try {
      let content_url = formData.get('content_url') as string;
      if (file && file.size > 0) {
        content_url = await uploadFile(file, 'course-content');
      }

      const { error } = await supabase.from('course_modules').insert({
        course_id: selectedCourseId,
        title: formData.get('title'),
        description: formData.get('description'),
        content_url: content_url,
        content_type: formData.get('content_type') || 'video',
        order_index: parseInt(formData.get('order_index') as string) || 0
      });
      if (error) throw error;
      alert("Module added!");
      (e.target as HTMLFormElement).reset();
      fetchModules(selectedCourseId);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePricing = async (id: string, field: string, value: any) => {
    try {
      const updateVal = field === 'features' ? JSON.parse(value) : value;
      const { error } = await supabase.from('pricing_plans').update({ [field]: updateVal, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      setPricingPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: updateVal } : p));
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    }
  };

  const handleTogglePricingHighlight = async (id: string, current: boolean) => {
    // only one card can be highlighted at a time
    try {
      await supabase.from('pricing_plans').update({ is_highlighted: false }).neq('id', 'none');
      await supabase.from('pricing_plans').update({ is_highlighted: !current }).eq('id', id);
      fetchContent();
    } catch (err: any) {
      alert('Error: ' + err.message);
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
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans relative pb-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-montserrat text-lg font-extrabold tracking-wider uppercase text-white hidden sm:block">THE PROPELS <span className="text-cyan-400 text-sm">ADMIN</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> SECURE SESSION
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>
      </nav>

      <main className="pt-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10 flex gap-8 flex-col md:flex-row items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 top-24 sticky z-20">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
            {[
              { id: 'tools', name: 'Tools Library', icon: Wrench, color: 'text-cyan-400' },
              { id: 'courses', name: 'Course Manager', icon: Video, color: 'text-orange-400' },
              { id: 'stories', name: 'Success Stories', icon: Award, color: 'text-purple-400' },
              { id: 'careers', name: 'Career Manager', icon: MapPin, color: 'text-yellow-400' },
              { id: 'pricing', name: 'Pricing Plans', icon: DollarSign, color: 'text-emerald-400' },
              { id: 'kb', name: 'Knowledge Base', icon: Library, color: 'text-indigo-400' },
              { id: 'applications', name: 'Applications', icon: Briefcase, color: 'text-rose-400' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === tab.id ? 'bg-white/5 text-white border border-white/10' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
                <div className="flex items-center gap-3"><tab.icon className={`w-4 h-4 ${tab.color}`} /> {tab.name}</div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 w-full space-y-8">
          <AnimatePresence>{editingItem && <EditModal item={editingItem} type={editingType} onClose={() => setEditingItem(null)} onSave={handleEditSave} />}</AnimatePresence>
          <AnimatePresence mode="wait">
            {activeTab === 'tools' && (
              <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-cyan-400" /> Add New Tool</h2>
                  <form onSubmit={handleAddTool} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="category" required placeholder="Category" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="image_url" type="url" required placeholder="Image URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="redirect_link" type="url" required placeholder="Redirect Link" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="price" type="number" required placeholder="Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="discount_price" type="number" placeholder="Discount Price (Optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <textarea name="description" required placeholder="Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Tool</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Existing Tools</h3>
                  <div className="space-y-3">
                    {tools.map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={tool.image_url} className="w-10 h-10 rounded-lg object-cover" />
                          <div><p className="text-sm font-bold text-white">{tool.title}</p><p className="text-xs text-slate-500">{tool.category}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(tool); setEditingType(\'tools_cards\'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(\'tools_cards\', tool.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'kb' && (
              <motion.div key="kb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400" /> Add KB Document</h2>
                  <form onSubmit={handleAddKB} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Document Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <input name="category" placeholder="Category (e.g. Legal, Finance)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <select name="file_type" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                      <option value="pdf">PDF</option>
                      <option value="doc">Document</option>
                      <option value="spreadsheet">Spreadsheet</option>
                    </select>
                    <input name="download_link" placeholder="External URL (optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <div className="md:col-span-2">
                       <label className="text-xs text-slate-400 mb-2 block">Upload File (Recommended)</label>
                       <input name="file" type="file" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full" />
                    </div>
                    <textarea name="description" required placeholder="Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50">{loading ? 'Uploading...' : 'Add Document'}</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Resource Library</h3>
                  <div className="space-y-3">
                    {knowledgeBase.map(kb => (
                      <div key={kb.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/5 p-2 rounded-lg"><Library className="w-5 h-5 text-indigo-400" /></div>
                          <div><p className="text-sm font-bold text-white">{kb.title}</p><p className="text-xs text-slate-500">{kb.category} • {kb.file_type}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(kb); setEditingType(\'knowledge_base\'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(\'knowledge_base\', kb.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {selectedCourseId ? (
                   <div className="space-y-6">
                      <button onClick={() => setSelectedCourseId(null)} className="text-orange-400 text-sm font-bold flex items-center gap-1 hover:underline"><Plus className="w-4 h-4 rotate-45" /> Back to Courses</button>
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-400" /> Add Module</h2>
                        <form onSubmit={handleAddModule} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <input name="title" required placeholder="Module Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <input name="order_index" type="number" required placeholder="Order (0, 1, 2...)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <select name="content_type" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500">
                             <option value="video">Video</option>
                             <option value="pdf">PDF</option>
                          </select>
                          <input name="content_url" placeholder="Direct URL (optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <div className="md:col-span-2">
                             <label className="text-xs text-slate-400 mb-2 block">Upload Content</label>
                             <input name="file" type="file" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-orange-500 w-full" />
                          </div>
                          <textarea name="description" required placeholder="Short Description" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 md:col-span-2 resize-none" />
                          <div className="md:col-span-2 flex justify-end"><button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50">{loading ? 'Uploading...' : 'Add Module'}</button></div>
                        </form>
                      </div>
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Course Modules</h3>
                        <div className="space-y-3">
                           {modules.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No modules uploaded yet.</p>}
                           {modules.map(mod => (
                              <div key={mod.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="text-orange-400 font-bold">#{mod.order_index}</div>
                                    <div><p className="text-sm font-bold text-white">{mod.title}</p><p className="text-xs text-slate-500">{mod.content_type}</p></div>
                                 </div>
                                 <button onClick={() => handleDelete('course_modules', mod.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           ))}
                        </div>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-400" /> Add New Course</h2>
                      <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input name="title" required placeholder="Course Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="mentor" required placeholder="Mentor Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="image_url" type="url" required placeholder="Image URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="enroll_link" type="url" required placeholder="Enroll Link" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="actual_price" type="number" required placeholder="Actual Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="discounted_price" type="number" required placeholder="Discounted Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <textarea name="description" required placeholder="Course Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 md:col-span-2 resize-none" />
                        <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Course</button></div>
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
                            <div className="flex items-center gap-2">
                               <button onClick={() => fetchModules(course.id)} className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-lg border border-orange-500/20 hover:bg-orange-500/20">Manage Modules</button>
                               <button onClick={() => { setEditingItem(course); setEditingType(\'courses\'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(\'courses\', course.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(job); setEditingType(\'job_postings\'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(\'job_postings\', job.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                    <input name="avatar_url" type="url" required placeholder="Avatar URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="media_url" type="url" required placeholder="Media URL (Image/Video)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <textarea name="summary" required placeholder="Founder Summary" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Story</button></div>
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(story); setEditingType(\'success_stories\'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(\'success_stories\', story.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Pricing Plans Editor</h2>
                  <p className="text-xs text-slate-500 mb-6">Changes here reflect live on the homepage. Fields save individually on blur.</p>
                  <div className="space-y-8">
                    {pricingPlans.map(plan => (
                      <div key={plan.id} className="border border-white/8 rounded-xl p-6 bg-[#111] space-y-5">
                        {/* Header row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${plan.is_highlighted ? 'bg-orange-500' : 'bg-white/20'}`} />
                            <span className="text-sm font-bold text-white uppercase tracking-wider">{plan.plan_key}</span>
                            {plan.badge && <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/50 font-bold uppercase tracking-wider">{plan.badge}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTogglePricingHighlight(plan.id, plan.is_highlighted)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                                plan.is_highlighted
                                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {plan.is_highlighted ? '★ Highlighted' : 'Set as Highlight'}
                            </button>
                            <button onClick={() => handleDelete('pricing_plans', plan.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editable fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                            <input
                              defaultValue={plan.title}
                              onBlur={e => handleUpdatePricing(plan.id, 'title', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                            <input
                              defaultValue={plan.subtitle}
                              onBlur={e => handleUpdatePricing(plan.id, 'subtitle', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Price (e.g. ₹4,999 or Custom)</label>
                            <input
                              defaultValue={plan.price}
                              onBlur={e => handleUpdatePricing(plan.id, 'price', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Price Period (e.g. /year)</label>
                            <input
                              defaultValue={plan.price_period}
                              onBlur={e => handleUpdatePricing(plan.id, 'price_period', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Badge Text (optional)</label>
                            <input
                              defaultValue={plan.badge || ''}
                              onBlur={e => handleUpdatePricing(plan.id, 'badge', e.target.value || null)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">CTA Button Label</label>
                            <input
                              defaultValue={plan.cta_label}
                              onBlur={e => handleUpdatePricing(plan.id, 'cta_label', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Features (JSON Array)</label>
                            <textarea
                              defaultValue={JSON.stringify(typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features, null, 2)}
                              onBlur={e => handleUpdatePricing(plan.id, 'features', e.target.value)}
                              rows={6}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono outline-none focus:border-emerald-500 resize-none"
                            />
                            <p className="text-[10px] text-slate-600 mt-1">Edit as a JSON array. Each string becomes a feature bullet.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pricingPlans.length === 0 && (
                    <div className="text-center py-12 text-slate-600">
                      <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No pricing plans found. Run the SQL schema in Supabase first.</p>
                      <code className="text-xs text-emerald-600 mt-2 block">supabase_pricing_schema.sql</code>
                    </div>
                  )}
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


function EditModal({ item, type, onClose, onSave }: any) {
  const [formData, setFormData] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white capitalize">Edit {type.replace('_', ' ')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="editForm" onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => {
              if (key === 'id' || key === 'created_at') return null;
              if (key === 'description' || key === 'summary' || key === 'qualification') {
                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key.replace('_', ' ')}</label>
                    <textarea name={key} value={formData[key] || ''} onChange={handleChange} rows={4} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none" />
                  </div>
                );
              }
              if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
                 return null;
              }
              return (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key.replace('_', ' ')}</label>
                  <input name={key} type={typeof formData[key] === 'number' ? 'number' : 'text'} value={formData[key] || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                </div>
              );
            })}
          </form>
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button type="submit" form="editForm" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
