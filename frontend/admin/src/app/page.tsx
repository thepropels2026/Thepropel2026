"use client"; // Enable client-side rendering for interactivity (state, hooks)
import React, { useState, useEffect } from 'react';
// Import a wide variety of icons for the admin dashboard
import { ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, Download, Eye, Mail, Phone, Linkedin, User, FileText, RefreshCw, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Animation library for UI transitions
import Image from 'next/image';
import { supabase } from '../lib/supabase'; // Initialize Supabase client

/**
 * AdminPortal: The central hub for managing platform content and user applications.
 * Requires admin authentication (simulated via email check).
 */
export default function AdminPortal() {
  // Authentication and error state
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  // Active dashboard tab state
  const [activeTab, setActiveTab] = useState<'tools' | 'courses' | 'stories' | 'applications' | 'careers' | 'knowledge'>('tools');

  // Define the structure of an Application object
  type Application = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    linkedin_url: string;
    experience: string;
    cover_letter: string;
    resume_url: string;
    photo_url: string;
    status: string;
    created_at: string;
    job_postings?: { title: string; department: string; location: string };
  };
  
  // State management for content lists
  const [applications, setApplications] = useState<Application[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Check local storage for existing admin session on component mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    // Simple email-based auth verification (can be upgraded to full JWT/Auth session)
    if (adminSession === 'sushantsharma2805@gmail.com') {
      setIsAdmin(true);
    }
  }, []);

  /**
   * fetchContent: Retrieves content from Supabase based on the active tab.
   */
  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'applications') {
        const { data, error } = await supabase
          .from('applications')
          .select('*, job_postings(title, department, location)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setApplications(data || []);
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
      } else if (activeTab === 'careers') {
        const { data, error } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setJobs(data || []);
      } else if (activeTab === 'knowledge') {
        const { data, error } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setKnowledge(data || []);
      }
    } catch (err: any) {
      console.error(`Error fetching ${activeTab}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch content whenever the active tab changes
  useEffect(() => {
    if (isAdmin) fetchContent();
  }, [activeTab, isAdmin]);

  /**
   * handleDelete: Removes an item from the database.
   */
  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      alert("Item removed successfully!");
      fetchContent(); // Refresh the list
    } catch (err: any) {
      alert("Error removing item: " + err.message);
    }
  };

  /**
   * updateStatus: Updates the hiring status of a specific application.
   */
  const updateStatus = async (id: string, status: string) => {
    // Update status in the database
    await supabase.from('applications').update({ status }).eq('id', id);
    // Update local state to reflect the change immediately in the UI
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  /**
   * downloadAdminPDF: Generates a professional PDF summary for a candidate profile.
   * Uses jsPDF to create a branded, formatted document for internal review.
   */
  const downloadAdminPDF = async (app: Application) => {
    const { jsPDF } = await import('jspdf'); // Dynamic import for performance
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pageW - margin * 2;

    // Drawing a dark branded header
    doc.setFillColor(2, 6, 23); // Slate-950
    doc.rect(0, 0, pageW, 35, 'F');
    // Accent sidebar on the header
    doc.setFillColor(8, 145, 178); // Cyan-600
    doc.rect(0, 0, 4, 35, 'F');
    
    // Header text content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('The Propels', margin + 4, 14);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('ADMIN — CANDIDATE PROFILE SUMMARY', margin + 4, 22);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, 22, { align: 'right' });

    // Status badge visualization in PDF
    const statusColors: Record<string, [number, number, number]> = {
      pending: [245, 158, 11], reviewed: [59, 130, 246], accepted: [16, 185, 129], rejected: [239, 68, 68]
    };
    const [sr, sg, sb] = statusColors[app.status] || statusColors.pending;
    doc.setFillColor(sr, sg, sb);
    doc.roundedRect(pageW - margin - 28, 6, 28, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text((app.status || 'pending').toUpperCase(), pageW - margin - 14, 13, { align: 'center' });

    // Role and Application metadata section
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(app.job_postings?.title || 'Unknown Role', margin, 52);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${app.job_postings?.department || ''} · ${app.job_postings?.location || ''} · Applied: ${new Date(app.created_at).toLocaleDateString()}`, margin, 59);

    // Separator line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 65, pageW - margin, 65);

    // Utility function to draw formatted field labels and values
    let y = 74;
    const field = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label.toUpperCase(), margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(value || '—', margin, y + 5.5);
      y += 15;
    };

    // Populate candidate fields
    field('Candidate Name', app.full_name);
    field('Email Address', app.email);
    field('Phone Number', app.phone);
    field('LinkedIn Profile', app.linkedin_url || '—');
    field('Years of Experience', app.experience);

    // Cover Letter section with multi-line text wrapping
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('COVER LETTER / WHY THEY ARE A FIT', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    const split = doc.splitTextToSize(app.cover_letter || '—', contentW);
    doc.text(split, margin, y);
    y += split.length * 5.5 + 10;

    // Document links (clickable in PDF)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DOCUMENT LINKS', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(8, 145, 178);
    if (app.resume_url) { doc.textWithLink('View Resume →', margin, y, { url: app.resume_url }); y += 7; }
    if (app.photo_url) { doc.textWithLink('View Photo →', margin, y, { url: app.photo_url }); y += 7; }

    // PDF Footer
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 7;
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Confidential — For internal use only. The Propels Admin Portal.', margin, y, { maxWidth: contentW });

    // Trigger file download
    doc.save(`Candidate_${app.full_name.replace(/\s+/g, '_')}.pdf`);
  };

  /**
   * handleLogin: Verifies the email input against the authorized admin list.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === 'sushantsharma2805@gmail.com') {
      // Create session in local storage for persistence
      localStorage.setItem('adminSession', emailInput.toLowerCase());
      setIsAdmin(true);
      setError('');
    } else {
      setError('Unauthorized access. Admin privileges required.');
    }
  };

  /**
   * handleLogout: Ends the admin session.
   */
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
  };

  /**
   * handleAddStory: Publishes a new founder success story to the database.
   */
  const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const storyData = Object.fromEntries(formData.entries());

    // Attempt to parse the roadmap JSON input
    let parsedRoadmap = [];
    try {
      parsedRoadmap = JSON.parse(storyData.roadmap as string || '[]');
    } catch (err) {
      console.warn("Invalid JSON in roadmap");
    }

    try {
      // Insert story data into Supabase
      const { error } = await supabase.from('success_stories').insert({
        founder_name: storyData.founder_name,
        startup_name: storyData.startup_name,
        niche: storyData.niche,
        metric: storyData.metric,
        metric_label: storyData.metric_label,
        summary: storyData.summary,
        avatar_url: storyData.avatar_url,
        media_url: storyData.media_url,
        media_type: storyData.media_type,
        roadmap: parsedRoadmap
      });

      if (error) throw error;
      alert("Success Story Added!");
      (e.target as HTMLFormElement).reset(); // Clear form on success
    } catch (err: any) {
      alert("Error adding story: " + err.message);
    }
  };

  /**
   * Data Insertion Handlers for Tools, Courses, Careers, and Knowledge Base
   */
  const handleAddTool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const toolData = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('tools_cards').insert({
        title: toolData.title,
        description: toolData.description,
        image_url: toolData.image_url,
        redirect_link: toolData.redirect_link,
        category: toolData.category,
        price: toolData.price ? parseFloat(toolData.price as string) : 0,
        discount_price: toolData.discount_price ? parseFloat(toolData.discount_price as string) : null,
      });
      if (error) throw error;
      alert("Tool added successfully!");
      (e.target as HTMLFormElement).reset();
      fetchContent(); // Refresh the list
    } catch (err: any) {
      alert("Error adding tool: " + err.message);
    }
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseData = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('courses').insert({
        title: courseData.title,
        image_url: courseData.image_url,
        mentor: courseData.mentor,
        description: courseData.description,
        actual_price: courseData.actual_price ? parseFloat(courseData.actual_price as string) : 0,
        discounted_price: courseData.discounted_price ? parseFloat(courseData.discounted_price as string) : 0,
        enroll_link: courseData.enroll_link,
      });
      if (error) throw error;
      alert("Course added successfully!");
      (e.target as HTMLFormElement).reset();
      fetchContent(); // Refresh the list
    } catch (err: any) {
      alert("Error adding course: " + err.message);
    }
  };

  const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('job_postings').insert({
        title: jobData.title,
        description: jobData.description,
        role: jobData.role,
        qualification: jobData.qualification,
        eligibility: jobData.eligibility,
        stipend: jobData.stipend,
        work_duration: jobData.work_duration,
        location: jobData.location,
        mode: jobData.mode,
      });
      if (error) throw error;
      alert("Job posted successfully!");
      (e.target as HTMLFormElement).reset();
      fetchContent(); // Refresh the list
    } catch (err: any) {
      alert("Error posting job: " + err.message);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const kData = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('knowledge_base').insert({
        title: kData.title,
        description: kData.description,
        download_link: kData.download_link,
      });
      if (error) throw error;
      alert("Knowledge Base resource added successfully!");
      (e.target as HTMLFormElement).reset();
      fetchContent(); // Refresh the list
    } catch (err: any) {
      alert("Error adding resource: " + err.message);
    }
  };


  // RENDER: Authentication Screen (displayed if not authorized)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] text-slate-300 flex items-center justify-center font-sans p-4 relative overflow-hidden">
        {/* Background visual effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
        >
          {/* Security Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
          </div>
          {/* Login Prompts */}
          <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">Restricted Area</h1>
          <p className="text-center text-sm text-slate-400 mb-8">Enter authorized administrator credentials to proceed.</p>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@thepropels.com"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            <button type="submit" className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // RENDER: Main Admin Dashboard UI
  return (
    <div className="min-h-screen bg-transparent text-slate-300 font-sans relative pb-20">
      
      {/* Top Command Center Header - Styled like Client Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass-nav z-50 flex items-center justify-between px-6 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#00F2FF] after:via-cyan-600/20 after:to-[#FF5F00]">
        <div className="flex items-center gap-2 md:gap-3">
          <Image src="/logo.png" alt="The Propels Logo" width={48} height={48} className="h-10 w-10 md:h-12 md:w-12 object-contain brightness-125 filter drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
          <span className="font-montserrat text-lg md:text-xl font-extrabold tracking-wider uppercase text-white hidden sm:block">THE PROPELS <span className="text-cyan-400 text-sm">ADMIN</span></span>
        </div>
        <div className="flex items-center gap-4">
          {/* Secure Session Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SECURE SESSION
          </div>
          {/* Logout Button */}
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>
      </nav>

      {/* Main Dashboard Grid */}
      <main className="pt-24 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10 flex gap-8 flex-col md:flex-row items-start">
        
        {/* Sidebar Navigation: Active Tab Selection */}
        <aside className="w-full md:w-64 shrink-0 top-24 sticky z-20">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
            {/* Tools Tab Button */}
            <button 
              onClick={() => setActiveTab('tools')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'tools' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><Wrench className="w-4 h-4" /> Tools Library</div>
              {activeTab === 'tools' && <ChevronRight className="w-4 h-4" />}
            </button>
            {/* Courses Tab Button */}
            <button 
              onClick={() => setActiveTab('courses')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'courses' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><Video className="w-4 h-4" /> Course Manager</div>
              {activeTab === 'courses' && <ChevronRight className="w-4 h-4" />}
            </button>
            {/* Stories Tab Button */}
            <button 
              onClick={() => setActiveTab('stories')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'stories' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><Award className="w-4 h-4" /> Stories Manager</div>
              {activeTab === 'stories' && <ChevronRight className="w-4 h-4" />}
            </button>
            {/* Applications Tab Button */}
            <button 
              onClick={() => setActiveTab('applications')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'applications' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><FileText className="w-4 h-4" /> Applications</div>
              {activeTab === 'applications' && <ChevronRight className="w-4 h-4" />}
            </button>
            {/* Careers Tab Button */}
            <button 
              onClick={() => setActiveTab('careers')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'careers' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><Briefcase className="w-4 h-4" /> Careers</div>
              {activeTab === 'careers' && <ChevronRight className="w-4 h-4" />}
            </button>
            {/* Knowledge Base Tab Button */}
            <button 
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === 'knowledge' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
            >
              <div className="flex items-center gap-3"><Search className="w-4 h-4" /> Knowledge Base</div>
              {activeTab === 'knowledge' && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area: Switches based on activeTab */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            
            {/* TOOLS MANAGEMENT SECTION */}
            {activeTab === 'tools' && (
              <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-cyan-400" /> Add New Tool
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Deploy a new startup tool to the public library.</p>
                  </div>
                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleAddTool}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</label>
                          <input name="title" type="text" required placeholder="e.g. Canva" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                          <input name="category" type="text" required placeholder="e.g. Design" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image URL</label>
                          <input name="image_url" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Redirect Link</label>
                          <input name="redirect_link" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actual Price</label>
                          <input name="price" type="number" step="0.01" defaultValue="0" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Discount Price</label>
                          <input name="discount_price" type="number" step="0.01" placeholder="Optional" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                        <textarea name="description" required rows={3} placeholder="Brief description of the tool..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" className="bg-cyan-500 text-white hover:bg-cyan-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                          <Plus className="w-4 h-4" /> Add Tool
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current tools for removal */}
                <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Library Tools</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">{tools.length} TOOLS</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading && tools.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 animate-pulse text-sm">Loading tools...</div>
                    ) : tools.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-sm">No tools found.</div>
                    ) : (
                      tools.map((tool) => (
                        <div key={tool.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <img src={tool.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                            <div>
                              <h4 className="text-sm font-bold text-white">{tool.title}</h4>
                              <p className="text-[10px] text-slate-500">{tool.category} · ₹{tool.price}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('tools_cards', tool.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Tool"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COURSES MANAGEMENT SECTION */}
            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-orange-400" /> Course Manager
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Add new lecture modules to existing courses.</p>
                  </div>
                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleAddCourse}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Title</label>
                          <input name="title" type="text" required placeholder="e.g. Next.js Masterclass" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mentor</label>
                          <input name="mentor" type="text" required placeholder="e.g. John Doe" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image URL</label>
                          <input name="image_url" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enroll Link</label>
                          <input name="enroll_link" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actual Price</label>
                          <input name="actual_price" type="number" step="0.01" defaultValue="0" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Discounted Price</label>
                          <input name="discounted_price" type="number" step="0.01" defaultValue="0" required className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                        <textarea name="description" required rows={3} placeholder="Course description..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                          <Plus className="w-4 h-4" /> Add Course
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current courses for removal */}
                <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Courses</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">{courses.length} COURSES</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading && courses.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 animate-pulse text-sm">Loading courses...</div>
                    ) : courses.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-sm">No courses found.</div>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <img src={course.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                            <div>
                              <h4 className="text-sm font-bold text-white">{course.title}</h4>
                              <p className="text-[10px] text-slate-500">{course.mentor} · ₹{course.discounted_price}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('courses', course.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Course"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUCCESS STORIES MANAGEMENT SECTION */}
            {activeTab === 'stories' && (
              <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" /> Stories Manager
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Publish a new founder success story to the platform.</p>
                  </div>
                  
                  <div className="p-6">
                    {/* Story Publication Form */}
                    <form className="space-y-5" onSubmit={handleAddStory}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Founder Name</label>
                          <input name="founder_name" type="text" required placeholder="e.g. Aarav Patel" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Startup Name</label>
                          <input name="startup_name" type="text" required placeholder="e.g. NexusAI" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        {/* More input fields skipped for brevity in comments, keeping identical functionality */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Niche</label>
                          <select name="niche" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors">
                            <option>AI</option>
                            <option>E-commerce</option>
                            <option>SaaS</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avatar URL</label>
                          <input name="avatar_url" type="url" required placeholder="https://images.unsplash.com/..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Metric</label>
                          <input name="metric" type="text" required placeholder="e.g. ₹2.5L MRR" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric Label</label>
                          <input name="metric_label" type="text" required placeholder="e.g. Reached in 6 months" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Media URL</label>
                          <input name="media_url" type="url" required placeholder="https://images.unsplash.com/..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Media Type</label>
                          <select name="media_type" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</label>
                        <textarea name="summary" required rows={2} placeholder="Brief summary of their success..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Roadmap (JSON Array)</label>
                        <textarea name="roadmap" required rows={4} placeholder='[{"title":"Idea", "description":"...", "icon":"Lightbulb"}]' defaultValue='[{"title":"Idea Validation", "description":"Used the Business Plan Evaluator tool.", "icon":"Lightbulb"}]' className="w-full font-mono bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" />
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                          <Plus className="w-4 h-4" /> Publish Story
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current stories for removal */}
                <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Founder Stories</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">{stories.length} STORIES</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading && stories.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 animate-pulse text-sm">Loading stories...</div>
                    ) : stories.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-sm">No stories found.</div>
                    ) : (
                      stories.map((story) => (
                        <div key={story.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <img src={story.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover bg-white/5" />
                            <div>
                              <h4 className="text-sm font-bold text-white">{story.founder_name}</h4>
                              <p className="text-[10px] text-slate-500">{story.startup_name} · {story.niche}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('success_stories', story.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Story"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* APPLICATIONS MANAGEMENT SECTION */}
            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e] flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-400" /> Job Applications
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">Review and manage candidate submissions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search by name, email..."
                        className="bg-[#111] border border-white/10 text-white text-sm rounded-xl px-4 py-2 placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-52 transition-all"
                      />
                      <button onClick={fetchContent} title="Refresh" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Conditional rendering for loading state, empty state, and data list */}
                    {loading ? (
                      <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="py-20 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                        <User className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 text-sm">No applications found.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
                              <th className="px-4 py-3">Candidate</th>
                              <th className="px-4 py-3">Role</th>
                              <th className="px-4 py-3">Experience</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {applications.filter(app => 
                              app.full_name.toLowerCase().includes(appSearch.toLowerCase()) ||
                              app.email.toLowerCase().includes(appSearch.toLowerCase())
                            ).map((app) => (
                              <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-emerald-400 border border-emerald-500/20 overflow-hidden">
                                      {app.photo_url ? (
                                        <img src={app.photo_url} alt="" className="w-full h-full object-cover" />
                                      ) : app.full_name[0]}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-white">{app.full_name}</p>
                                      <p className="text-xs text-slate-500">{app.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <p className="text-sm text-slate-300">{app.job_postings?.title || 'Unknown'}</p>
                                  <p className="text-[10px] text-slate-500">{app.job_postings?.department || 'General'}</p>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">{app.experience}</span>
                                </td>
                                <td className="px-4 py-4">
                                  <select 
                                    value={app.status || 'pending'}
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border focus:outline-none ${
                                      app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                      app.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => setSelectedApp(app)}
                                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                      title="Quick View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => downloadAdminPDF(app)}
                                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                      title="Export Profile PDF"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAREERS MANAGEMENT SECTION */}
            {activeTab === 'careers' && (
              <motion.div key="careers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-pink-400" /> Careers Manager
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Post a new job opening to the platform.</p>
                  </div>
                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleAddJob}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</label>
                          <input name="title" type="text" required placeholder="e.g. Frontend Developer" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role/Department</label>
                          <input name="role" type="text" required placeholder="e.g. Engineering" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                          <input name="location" type="text" required placeholder="e.g. Remote" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Mode</label>
                          <select name="mode" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stipend/Salary</label>
                          <input name="stipend" type="text" placeholder="e.g. 20k - 30k" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</label>
                          <input name="work_duration" type="text" placeholder="e.g. 6 Months" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description</label>
                        <textarea name="description" required rows={3} placeholder="Job responsibilities..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors resize-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qualifications</label>
                          <textarea name="qualification" required rows={2} placeholder="Requirements..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors resize-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eligibility</label>
                          <textarea name="eligibility" required rows={2} placeholder="Who can apply..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors resize-none" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" className="bg-pink-500 text-white hover:bg-pink-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                          <Plus className="w-4 h-4" /> Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current jobs for removal */}
                <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Job Postings</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">{jobs.length} JOBS</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading && jobs.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 animate-pulse text-sm">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-sm">No jobs found.</div>
                    ) : (
                      jobs.map((job) => (
                        <div key={job.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{job.title}</h4>
                              <p className="text-[10px] text-slate-500">{job.role} · {job.location}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('job_postings', job.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Job"
                          >
                            <ShieldAlert className="w-4 h-4" />
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
              <motion.div key="knowledge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-400" /> Knowledge Base Resource
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Upload a new resource link to the library.</p>
                  </div>
                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleAddKnowledge}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource Title</label>
                          <input name="title" type="text" required placeholder="e.g. Pitch Deck Template" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Download Link</label>
                          <input name="download_link" type="url" required placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                        <textarea name="description" required rows={3} placeholder="Briefly explain what this resource is..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                          <Plus className="w-4 h-4" /> Add Resource
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* List of current resources for removal */}
                <div className="mt-8 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-4 bg-[#0e0e0e] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Library Resources</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">{knowledge.length} RESOURCES</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {loading && knowledge.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 animate-pulse text-sm">Loading resources...</div>
                    ) : knowledge.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-sm">No resources found.</div>
                    ) : (
                      knowledge.map((k) => (
                        <div key={k.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Download className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{k.title}</h4>
                              <p className="text-[10px] text-slate-500 truncate max-w-xs">{k.description}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete('knowledge_base', k.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Remove Resource"
                          >
                            <ShieldAlert className="w-4 h-4" />
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

      {/* QUICK VIEW MODAL FOR APPLICATIONS */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0e0e0e]">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                      <User className="w-6 h-6 text-emerald-400" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-white">{selectedApp.full_name}</h2>
                     <p className="text-xs text-slate-500">Applied for {selectedApp.job_postings?.title}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                  <ShieldAlert className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                 {/* Profile Grid */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Contact Info</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="w-3 h-3 text-cyan-400" /> {selectedApp.email}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-300"><Phone className="w-3 h-3 text-cyan-400" /> {selectedApp.phone}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Professional Link</label>
                      <a href={selectedApp.linkedin_url} target="_blank" className="flex items-center gap-2 text-sm text-cyan-400 hover:underline"><Linkedin className="w-3 h-3" /> LinkedIn Profile</a>
                    </div>
                 </div>

                 {/* Experience */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Years of Experience</label>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-bold">{selectedApp.experience}</span>
                 </div>

                 {/* Cover Letter */}
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Statement of Intent</label>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm text-slate-400 leading-relaxed italic">
                      "{selectedApp.cover_letter}"
                    </div>
                 </div>

                 {/* Documents */}
                 <div className="grid grid-cols-2 gap-4">
                    <a href={selectedApp.resume_url} target="_blank" className="bg-[#111] border border-white/10 hover:border-cyan-500/50 p-4 rounded-2xl flex items-center justify-between group transition-all">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><FileText className="w-5 h-5" /></div>
                         <span className="text-sm font-bold text-white">Resume.pdf</span>
                       </div>
                       <Download className="w-4 h-4 text-slate-600 group-hover:text-white" />
                    </a>
                    {selectedApp.photo_url && (
                      <a href={selectedApp.photo_url} target="_blank" className="bg-[#111] border border-white/10 hover:border-cyan-500/50 p-4 rounded-2xl flex items-center justify-between group transition-all">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><ImageIcon className="w-5 h-5" /></div>
                           <span className="text-sm font-bold text-white">Photograph.jpg</span>
                         </div>
                         <Download className="w-4 h-4 text-slate-600 group-hover:text-white" />
                      </a>
                    )}
                 </div>
              </div>
              
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#0a0a0a]">
                <button 
                  onClick={() => downloadAdminPDF(selectedApp)}
                  className="px-6 py-2 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="px-6 py-2 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Styles for Custom Components */}
      <style jsx global>{`
        .glass-nav {
          background: rgba(2, 2, 2, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
