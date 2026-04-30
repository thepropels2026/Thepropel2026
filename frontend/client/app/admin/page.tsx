"use client"; // Enable client-side rendering for interactivity (state, hooks)
import React, { useState, useEffect } from 'react';
// Import a wide variety of icons for the admin dashboard
import { ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, Download, Eye, Mail, Phone, Linkedin, User, FileText, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Animation library for UI transitions
import { supabase } from '../../lib/supabase'; // Initialize Supabase client

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
  const [activeTab, setActiveTab] = useState<'tools' | 'courses' | 'stories' | 'applications'>('tools');

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
  
  // State management for applications list
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
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
   * fetchApplications: Retrieves all job applications from the Supabase database.
   * Includes related job posting information (title, department, location).
   */
  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, job_postings(title, department, location)')
        .order('created_at', { ascending: false }); // Sort by newest first
      
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  // Re-fetch applications whenever the 'applications' tab becomes active
  useEffect(() => {
    if (activeTab === 'applications') fetchApplications();
  }, [activeTab]);

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
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans relative pb-20">
      {/* Background visual effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Top Command Center Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-white tracking-widest text-sm">PROPELS_COMMAND_CENTER</span>
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
      <main className="pt-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10 flex gap-8 flex-col md:flex-row items-start">
        
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
              <div className="flex items-center gap-3"><Briefcase className="w-4 h-4" /> Applications</div>
              {activeTab === 'applications' && <ChevronRight className="w-4 h-4" />}
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
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Database integration ready for hookup!"); }}>
                      {/* Placeholder for tool addition form */}
                      <p>Form UI here...</p>
                    </form>
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
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Database integration ready for hookup!"); }}>
                      {/* Placeholder for course addition form */}
                      <p>Form UI here...</p>
                    </form>
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
              </motion.div>
            )}

            {/* JOB APPLICATIONS MANAGEMENT SECTION */}
            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  {/* Applications List Header */}
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e] flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" /> Applications
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">{applications.length} total submission{applications.length !== 1 ? 's' : ''}</p>
                    </div>
                    {/* Search and Refresh Tools */}
                    <div className="flex items-center gap-3">
                      <input
                        value={appSearch}
                        onChange={e => setAppSearch(e.target.value)}
                        placeholder="Search by name, email..."
                        className="bg-[#111] border border-white/10 text-white text-sm rounded-xl px-4 py-2 placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-52 transition-all"
                      />
                      <button onClick={fetchApplications} title="Refresh" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Conditional rendering for loading state, empty state, and data list */}
                    {appsLoading ? (
                      <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      </div>
                    ) : applications.filter(a =>
                        a.full_name?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        a.job_postings?.title?.toLowerCase().includes(appSearch.toLowerCase())
                      ).length === 0 ? (
                      <div className="text-center py-16 text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No applications found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
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
                              <div key={app.id} className="bg-[#111] border border-white/8 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-emerald-500/30 transition-colors">
                                {/* Candidate Information Section */}
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                                    {app.photo_url ? (
                                      <img src={app.photo_url} alt={app.full_name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                      <User className="w-5 h-5 text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm">{app.full_name}</p>
                                    <p className="text-xs text-slate-400">{app.job_postings?.title || 'Unknown Role'} · {app.experience}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <a href={`mailto:${app.email}`} className="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                        <Mail className="w-3 h-3" />{app.email}
                                      </a>
                                      {app.linkedin_url && (
                                        <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                          <Linkedin className="w-3 h-3" /> LinkedIn
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Management and Document Actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                  {/* Status Selector */}
                                  <select
                                    value={app.status || 'pending'}
                                    onChange={e => updateStatus(app.id, e.target.value)}
                                    className={`text-xs font-bold border rounded-lg px-2 py-1.5 bg-transparent cursor-pointer outline-none ${statusStyles[app.status] || statusStyles.pending}`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                  {/* Resume View Link */}
                                  {app.resume_url && (
                                    <a href={app.resume_url} target="_blank" rel="noreferrer" title="View Resume" className="p-2 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors">
                                      <FileText className="w-4 h-4" />
                                    </a>
                                  )}
                                  {/* PDF Download Button */}
                                  <button
                                    onClick={() => downloadAdminPDF(app)}
                                    title="Download Admin PDF"
                                    className="p-2 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
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

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

