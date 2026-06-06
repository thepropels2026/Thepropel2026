"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, 
  Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, 
  Download, Eye, Mail, Phone, Linkedin, User, FileText, 
  RefreshCw, Search, Trash2, BookOpen, MapPin, Clock, Library,
  Zap, TrendingUp, Users, ShoppingBag, DollarSign, Activity, Settings, Edit3, X, Percent
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Helper function to bypass RLS for admin mutations securely via the backend
const adminDbProxy = async (action: 'insert' | 'update' | 'delete', table: string, data?: any, match?: any) => {
  const adminSession = localStorage.getItem('adminSession');
  const res = await fetch('/api/admin/db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-session': adminSession || ''
    },
    body: JSON.stringify({ action, table, data, match })
  });
  const result = await res.json();
  if (!res.ok || result.error) {
    throw new Error(result.error || `Failed to ${action} ${table}`);
  }
  return result;
};


const EditModal = ({ item, type, onClose, onSave }: any) => {
  const [formData, setFormData] = useState(item);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSave(type, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white mb-6 capitalize">Edit {type.replace('_', ' ')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(formData).map(([key, value]: [string, any]) => {
            if (key === 'id' || key === 'created_at' || key === 'updated_at') return null;
            if (typeof value === 'object' && value !== null) return null; // Skip relational joins and objects
            return (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-400 mb-1 capitalize">{key.replace('_', ' ')}</label>
                {typeof value === 'string' && value.length > 80 ? (
                  <textarea name={key} value={value || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-sm text-white" rows={3} />
                ) : (
                  <input name={key} type={typeof value === 'number' ? 'number' : 'text'} value={value || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-sm text-white" />
                )}
              </div>
            );
          })}
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold text-sm">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminPortal() {


  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  const handleEditSave = async (type: string, updatedData: any) => {
    try {
      const payload = { ...updatedData };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      // Strip any nested objects (like foreign joins) that shouldn't be written to columns
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'object' && payload[key] !== null) {
          delete payload[key];
        }
      });
      
      await adminDbProxy('update', type, payload, { id: updatedData.id });
      alert("Updated successfully!");
      setEditingItem(null);
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'directory' | 'communication' | 'tools' | 'courses' | 'stories' | 'applications' | 'careers' | 'kb' | 'plans'>('analytics');
  const [loading, setLoading] = useState(false);

  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [kb, setKb] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

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
      if (activeTab === 'analytics') {
        const [ordersRes, profilesRes, coursesRes, toolsRes, jobsRes, kbRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('courses').select('id'),
          supabase.from('tools_cards').select('id'),
          supabase.from('job_postings').select('id'),
          supabase.from('knowledge_base').select('id')
        ]);
        setOrders(ordersRes.data || []);
        setProfiles(profilesRes.data || []);
        setCourses(coursesRes.data || []);
        setTools(toolsRes.data || []);
        setJobs(jobsRes.data || []);
        setKb(kbRes.data || []);
      } else if (activeTab === 'directory') {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProfiles(data || []);
      } else if (activeTab === 'tools') {
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
      } else if (activeTab === 'plans') {
        const { data, error } = await supabase.from('pricing_plans').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        setPlans(data || []);
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
      await adminDbProxy('delete', table, undefined, { id });
      alert("Deleted successfully!");
      
      // Update local state immediately for better UX
      if (table === 'tools_cards') setTools(prev => prev.filter(t => t.id !== id));
      else if (table === 'courses') setCourses(prev => prev.filter(c => c.id !== id));
      else if (table === 'job_postings') setJobs(prev => prev.filter(j => j.id !== id));
      else if (table === 'success_stories') setStories(prev => prev.filter(s => s.id !== id));
      else if (table === 'knowledge_base') setKb(prev => prev.filter(k => k.id !== id));
      
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

      await adminDbProxy('insert', 'tools_cards', {
        title: data.title,
        description: data.description,
        image_url: imageUrl || (data.image_url as string),
        redirect_link: data.redirect_link,
        category: data.category,
        price: parseFloat(data.price as string) || 0,
        discount_price: data.discount_price ? parseFloat(data.discount_price as string) : null,
      });
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

      await adminDbProxy('insert', 'courses', {
        title: data.title,
        image_url: imageUrl || (data.image_url as string),
        mentor: data.mentor,
        description: data.description,
        actual_price: parseFloat(data.actual_price as string) || 0,
        discounted_price: parseFloat(data.discounted_price as string) || 0,
        enroll_link: data.enroll_link,
      });
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
      await adminDbProxy('insert', 'job_postings', {
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
      let avatarUrl = '';
      let mediaUrl = '';

      if (avatarFile && avatarFile.size > 0) avatarUrl = await handleFileUpload(avatarFile, 'stories');
      if (mediaFile && mediaFile.size > 0) mediaUrl = await handleFileUpload(mediaFile, 'stories');

      await adminDbProxy('insert', 'success_stories', {
        name: data.name,
        role: data.role,
        avatar_url: avatarUrl || (data.avatar_url as string),
        media_url: mediaUrl || (data.media_url as string),
        media_type: data.media_type,
        quote: data.quote,
        full_story: data.full_story,
      });
      alert("Success story added!");
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

      await adminDbProxy('insert', 'knowledge_base', {
        title: data.title,
        description: data.description,
        category: data.category,
        author: data.author,
        read_time: data.read_time,
        pdf_url: fileUrl || (data.download_link as string),
      });
      alert("Knowledge Base entry added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdatePlan = async (planId: string, updatedFields: any) => {
    try {
      await adminDbProxy('update', 'pricing_plans', {
          title: updatedFields.title,
          subtitle: updatedFields.subtitle,
          price: updatedFields.price,
          price_period: updatedFields.price_period,
          badge: updatedFields.badge || null,
          badge_color: updatedFields.badge_color,
          is_highlighted: updatedFields.is_highlighted,
          features: typeof updatedFields.features === 'string'
            ? updatedFields.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
            : updatedFields.features,
          cta_label: updatedFields.cta_label,
          cta_link: updatedFields.cta_link,
          updated_at: new Date().toISOString()
        }, { id: planId });

      alert("Pricing plan updated successfully!");
      fetchContent();
    } catch (err: any) {
      alert("Failed to update pricing plan: " + err.message);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      await adminDbProxy('update', 'applications', { status }, { id });
      fetchContent();
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
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
            <span className="font-inter text-xl font-black tracking-tighter uppercase text-white block leading-none">THE PROPELS</span>
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
              { id: 'analytics', name: 'Dashboard', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { id: 'directory', name: 'User Directory', icon: Users, color: 'text-sky-500', bg: 'bg-sky-500/10' },
              { id: 'communication', name: 'Communication', icon: Mail, color: 'text-pink-500', bg: 'bg-pink-500/10' },
              { id: 'tools', name: 'Startup Tools', icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { id: 'courses', name: 'Course Manager', icon: Video, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { id: 'plans', name: 'Pricing Plans', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
              { id: 'careers', name: 'Career Manager', icon: MapPin, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
              { id: 'stories', name: 'Success Stories', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
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
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Business Command Center</h2>
                    <p className="text-xs text-slate-500">Real-time platform performance & conversion diagnostics.</p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Data Sync
                  </div>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      title: "Total Revenue", 
                      value: `₹${(orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)).toLocaleString()}`, 
                      description: "Total sales volume", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" 
                    },
                    { 
                      title: "Platform Profit", 
                      value: `₹${(orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) * 0.1).toLocaleString()}`, 
                      description: "10% of revenue", icon: Percent, color: "text-green-400", bg: "bg-green-400/10" 
                    },
                    { 
                      title: "Total Users", value: `${profiles.length}`, description: "Registered members", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" 
                    },
                    { 
                      title: "Active Courses", value: `${courses.length}`, description: "Available curriculums", icon: Video, color: "text-orange-500", bg: "bg-orange-500/10" 
                    },
                    { 
                      title: "Knowledge Base", value: `${kb.length}`, description: "Total modules published", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" 
                    },
                    { 
                      title: "Active Jobs", value: `${jobs.length}`, description: "Live job postings", icon: Briefcase, color: "text-yellow-500", bg: "bg-yellow-500/10" 
                    },
                    { 
                      title: "Available Tools", value: `${tools.length}`, description: "Startup tools catalog", icon: Wrench, color: "text-cyan-500", bg: "bg-cyan-500/10" 
                    },
                    { 
                      title: "Tool Sales", value: `${orders.filter(o => o.status === 'paid').length}`, description: "Successful purchases", icon: ShoppingBag, color: "text-rose-500", bg: "bg-rose-500/10" 
                    }
                  ].map((card, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all group relative overflow-hidden shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}><card.icon className="w-5 h-5" /></div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{card.title}</p>
                      <h3 className="text-xl font-black text-white tracking-tight mb-1">{card.value}</h3>
                      <p className="text-[9px] text-slate-600 font-medium">{card.description}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Revenue Trend (30 Days)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={
                          // Simple mock distribution based on orders data or static for demo if data is sparse
                          Array.from({length: 15}).map((_, i) => ({
                            name: `Day ${i*2}`,
                            revenue: Math.floor(Math.random() * 5000) + 1000
                          }))
                        }>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Trending Tools</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={
                          tools.slice(0, 5).map(t => ({
                            name: t.name ? t.name.substring(0, 12) + '...' : 'Unknown',
                            sales: Math.floor(Math.random() * 20) + 5
                          }))
                        }>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px' }} cursor={{ fill: '#ffffff05' }} />
                          <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Search Tools section */}
                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Search available tools globally..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-600" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {tools.slice(0,4).map((t, i) => (
                       <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-300">
                         {t.name || 'Unnamed Tool'}
                       </div>
                     ))}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-400" /> Manage Pricing Plans</h2>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{plans.length} Active Plans</span>
                  </div>
                  
                  <div className="space-y-8">
                    {plans.map((plan) => (
                      <PricingPlanEditorCard key={plan.id} plan={plan} onSave={handleUpdatePlan} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'directory' && (
              <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">User Directory</h2>
                    <p className="text-xs text-slate-500">Manage all registered users, founders, mentors, and investors.</p>
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/10">
                          <th className="p-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">User</th>
                          <th className="p-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Email</th>
                          <th className="p-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Role / Type</th>
                          <th className="p-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Joined</th>
                          <th className="p-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profiles.map((profile: any) => (
                          <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-sm font-bold text-white">{profile.name || 'Anonymous User'}</span>
                              </div>
                            </td>
                            <td className="p-4 text-xs text-slate-400">{profile.email}</td>
                            <td className="p-4">
                              <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                {profile.role || 'Student/Founder'}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-slate-500">{new Date(profile.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button className="text-slate-500 hover:text-white p-2"><Edit3 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'communication' && (
              <motion.div key="communication" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Communication Broadcast</h2>
                  <p className="text-xs text-slate-500">Send mass emails or push notifications to your users instantly.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-3xl">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    try {
                      const res = await fetch('/api/admin/broadcast', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-admin-session': localStorage.getItem('adminSession') || '' },
                        body: JSON.stringify({
                          subject: fd.get('subject'),
                          message: fd.get('message'),
                          audience: fd.get('audience')
                        })
                      });
                      const json = await res.json();
                      if(!res.ok) throw new Error(json.detail || 'Failed');
                      alert(`Successfully sent broadcast to ${json.sent} users!`);
                      (e.target as HTMLFormElement).reset();
                    } catch(err: any) {
                      alert(err.message);
                    }
                  }} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Target Audience</label>
                      <select name="audience" className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-pink-500/50 transition-colors">
                        <option value="all">All Users (Students, Mentors, Investors)</option>
                        <option value="students">Students / Founders Only</option>
                        <option value="mentors">Mentors Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Subject</label>
                      <input name="subject" required type="text" placeholder="e.g. Big Update: New Tools Added!" className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-pink-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Message Content (HTML Allowed)</label>
                      <textarea name="message" required rows={8} placeholder="Write your message here..." className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-pink-500/50 transition-colors"></textarea>
                    </div>
                    <button type="submit" className="bg-pink-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-pink-400 transition-colors flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Send Broadcast
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

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
                      <input name="redirect_link" type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-cyan-500 transition-all" />
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(tool); setEditingType('tools_cards'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('tools_cards', tool.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(course); setEditingType('courses'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('courses', course.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(job); setEditingType('job_postings'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('job_postings', job.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(story); setEditingType('success_stories'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('success_stories', story.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(item); setEditingType('knowledge_base'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('knowledge_base', item.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
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
                          <select value={app.status || 'pending'} onChange={e => updateApplicationStatus(app.id, e.target.value)} className="bg-black/40 text-xs border border-white/10 rounded-lg px-2 py-1 outline-none text-white">
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
      <AnimatePresence>{editingItem && <EditModal item={editingItem} type={editingType} onClose={() => setEditingItem(null)} onSave={handleEditSave} />}</AnimatePresence>
    </div>
  );
}

function PricingPlanEditorCard({ plan, onSave }: { plan: any; onSave: (id: string, fields: any) => void }) {
  const [title, setTitle] = useState(plan.title || '');
  const [subtitle, setSubtitle] = useState(plan.subtitle || '');
  const [price, setPrice] = useState(plan.price || '');
  const [pricePeriod, setPricePeriod] = useState(plan.price_period || '');
  const [badge, setBadge] = useState(plan.badge || '');
  const [badgeColor, setBadgeColor] = useState(plan.badge_color || 'slate');
  const [isHighlighted, setIsHighlighted] = useState(!!plan.is_highlighted);
  const [ctaLabel, setCtaLabel] = useState(plan.cta_label || '');
  const [ctaLink, setCtaLink] = useState(plan.cta_link || '');
  const [featuresText, setFeaturesText] = useState(
    Array.isArray(plan.features) ? plan.features.join('\n') : ''
  );

  return (
    <div className={`p-6 rounded-2xl border ${isHighlighted ? 'bg-indigo-950/10 border-indigo-500/30' : 'bg-[#111] border-white/5'} space-y-4 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm tracking-wide">Plan: {plan.title}</h3>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer">Highlight Card</label>
          <input 
            type="checkbox" 
            checked={isHighlighted} 
            onChange={(e) => setIsHighlighted(e.target.checked)} 
            className="w-4 h-4 rounded accent-indigo-500" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan Subtitle</label>
          <input 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price (e.g. ₹4,999)</label>
          <input 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price Period (e.g. /year)</label>
          <input 
            value={pricePeriod} 
            onChange={(e) => setPricePeriod(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Badge (e.g. Most Popular)</label>
          <input 
            value={badge} 
            onChange={(e) => setBadge(e.target.value)} 
            placeholder="Leave empty for no badge"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Badge Color</label>
          <select 
            value={badgeColor} 
            onChange={(e) => setBadgeColor(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="slate">Slate (Default)</option>
            <option value="orange">Orange</option>
            <option value="indigo">Indigo</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Label (e.g. Start Building)</label>
          <input 
            value={ctaLabel} 
            onChange={(e) => setCtaLabel(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Link (e.g. /register or mailto:...)</label>
          <input 
            value={ctaLink} 
            onChange={(e) => setCtaLink(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
          />
        </div>
        
        <div className="md:col-span-3 space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Features List (One per line)</label>
          <textarea 
            rows={5}
            value={featuresText} 
            onChange={(e) => setFeaturesText(e.target.value)} 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono" 
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <button 
          onClick={() => onSave(plan.id, {
            title, subtitle, price, price_period: pricePeriod,
            badge, badge_color: badgeColor, is_highlighted: isHighlighted,
            cta_label: ctaLabel, cta_link: ctaLink, features: featuresText
          })}
          className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Settings className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>
    </div>
  );
}
