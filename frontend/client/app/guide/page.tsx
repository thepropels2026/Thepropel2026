"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, ShieldAlert, MonitorUp, Lock, CheckCircle,
  LayoutDashboard, GraduationCap, Library, Search, Map, 
  BookOpen, FileText, FileSpreadsheet, Download, Clock,
  ChevronRight, Circle, Play, CheckSquare, Zap, Sparkles,
  ArrowRight, ShieldCheck, Fingerprint, BrainCircuit, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// Mock Knowledge Base Data
const kbFiles = [
  { id: 1, title: 'Seed Pitch Deck Template', type: 'pdf', icon: FileText, desc: 'A 15-slide template designed for seed-stage investors.' },
  { id: 2, title: 'Market Research Cheatsheet', type: 'doc', icon: BookOpen, desc: 'Step-by-step guide to finding your Total Addressable Market.' },
  { id: 3, title: 'B2B Financial Modeling', type: 'spreadsheet', icon: FileSpreadsheet, desc: 'Excel template for SaaS revenue projections.' },
  { id: 4, title: 'Co-founder Equity Agreement', type: 'pdf', icon: FileText, desc: 'Standard contract for equity distribution.' },
  { id: 5, title: 'Go-To-Market Blueprint', type: 'pdf', icon: Map, desc: 'Launch strategies for zero-to-one startups.' },
  { id: 6, title: 'Investor CRM Template', type: 'spreadsheet', icon: FileSpreadsheet, desc: 'Track your conversations with angels and VCs.' },
];

export default function GuideLmsPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Learning', icon: GraduationCap },
    { name: 'Courses', icon: Library },
    { name: 'Knowledge Base', icon: Search },
    { name: 'Blueprint', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <GraduationCap className="w-3 h-3" /> Founder Curriculum
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Mission <br/>
              <span className="relative">
                Control Center.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-4 p-2 bg-white/[0.03] rounded-[2rem] border border-white/5 w-fit mb-16 overflow-x-auto hide-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`h-14 px-8 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${
                activeTab === tab.name 
                  ? 'bg-white text-black shadow-2xl' 
                  : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'Dashboard' && <DashboardTab />}
              {activeTab === 'Learning' && <LearningTab />}
              {activeTab === 'Courses' && <CoursesTab />}
              {activeTab === 'Knowledge Base' && <KnowledgeBaseTab />}
              {activeTab === 'Blueprint' && <BlueprintTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 1. DASHBOARD TAB
// ------------------------------------------------------------------
function DashboardTab() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Main Progress Card */}
         <div className="lg:col-span-8 bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 p-12">
               <Sparkles className="w-10 h-10 text-slate-100" />
            </div>
            
            <div className="relative w-48 h-48 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-500" strokeDasharray="65, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-black font-montserrat text-slate-900 tracking-tighter">45%</span>
                  <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest mt-1">Authorized</span>
               </div>
            </div>

            <div className="flex-1 text-center md:text-left">
               <h3 className="text-3xl font-black font-montserrat uppercase italic tracking-tighter mb-4">Validating <br/><span className="text-cyan-600">The Thesis.</span></h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 italic">You are currently at Module 2. Complete the neural validation to unlock the capital intake protocol.</p>
               <button className="h-16 px-10 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">
                 Resume Protocol
               </button>
            </div>
         </div>

         {/* Quick Stats Sidebar */}
         <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 flex flex-col justify-center">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Modules Cleared</p>
               <p className="text-5xl font-black text-white italic tracking-tighter">01<span className="text-xl text-white/20 font-normal"> / 05</span></p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 flex flex-col justify-center">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Mission Time</p>
               <p className="text-5xl font-black text-cyan-400 italic tracking-tighter">12.5 <span className="text-xl text-white/20 font-normal">HRS</span></p>
            </div>
         </div>
      </div>

      {/* Upcoming Roadmap */}
      <div>
         <h2 className="text-2xl font-black font-montserrat uppercase italic tracking-tighter mb-8 text-white/60">Upcoming Trajectory</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '02', title: 'Customer Discovery', status: 'In Progress', active: true },
              { num: '03', title: 'Product Market Fit', status: 'Locked', active: false },
              { num: '04', title: 'Capital Ignite', status: 'Locked', active: false },
            ].map((item, i) => (
               <div key={i} className={`p-8 rounded-[3rem] border transition-all ${item.active ? 'bg-white/[0.05] border-white/20' : 'bg-white/[0.01] border-white/5 opacity-40'}`}>
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-4xl font-black text-white/10 italic">{item.num}</span>
                     <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.active ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/40'}`}>{item.status}</span>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{item.title}</h4>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. LEARNING TAB
// ------------------------------------------------------------------
function LearningTab() {
  const [isExamMode, setIsExamMode] = useState(false);
  const [examStatus, setExamStatus] = useState<"pending" | "running" | "failed" | "passed">("pending");

  const startExam = () => {
    setIsExamMode(true);
    setExamStatus('running');
  };

  if (isExamMode) {
     return (
        <div className="max-w-4xl mx-auto">
           <div className="bg-red-600 text-white p-6 rounded-t-[3rem] flex justify-between items-center px-12">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="w-6 h-6 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">STRICT SYSTEM AUTHORIZATION MODE</span>
              </div>
              <div className="flex items-center gap-3">
                 <Lock className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
              </div>
           </div>
           <div className="bg-white rounded-b-[3rem] p-16 text-black shadow-2xl">
              <div className="mb-16">
                 <h2 className="text-4xl font-black font-montserrat uppercase italic tracking-tighter mb-4 text-slate-900">Module 01: Final Evaluation</h2>
                 <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Handshake ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
              </div>

              <div className="space-y-12">
                 <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem]">
                    <h3 className="text-2xl font-black text-slate-800 mb-8 italic">01. What is the primary focus of Early Stage VCs?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {['Market Traction', 'Founding Team', 'Revenue Multiples', 'IP Sovereignty'].map((opt, i) => (
                          <label key={i} className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-3xl cursor-pointer hover:border-cyan-500 transition-all group">
                             <input type="radio" name="q1" className="w-5 h-5 border-2 border-slate-200 text-cyan-600 focus:ring-0" />
                             <span className="text-sm font-black text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{opt}</span>
                          </label>
                       ))}
                    </div>
                 </div>
                 
                 <button onClick={() => setIsExamMode(false)} className="w-full h-20 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                    Submit Secure Credentials
                 </button>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
       {/* Sidebar */}
       <div className="lg:col-span-4 space-y-8">
          <h2 className="text-2xl font-black font-montserrat uppercase italic tracking-tighter text-white/40">Curriculum</h2>
          <div className="space-y-4">
             {[1, 2, 3, 4].map(mod => (
               <button key={mod} className={`w-full text-left p-8 rounded-[3rem] border transition-all group ${mod === 2 ? 'bg-white text-black shadow-2xl' : 'bg-white/[0.03] border-white/5 opacity-40 hover:opacity-100'}`}>
                  <div className={`text-[8px] font-black uppercase tracking-widest mb-3 ${mod === 2 ? 'text-cyan-600' : 'text-white/20'}`}>Module 0{mod}</div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight mb-4 group-hover:translate-x-2 transition-transform">Thesis Validation</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/10 group-hover:text-cyan-500 transition-colors">
                     <Clock className="w-3.5 h-3.5" /> 45 MINS SPRINT
                  </div>
               </button>
             ))}
          </div>
       </div>

       {/* Video Area */}
       <div className="lg:col-span-8 space-y-12">
          <div className="aspect-video bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] relative overflow-hidden group cursor-pointer shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                   <Play className="w-10 h-10 text-black ml-2" />
                </div>
             </div>
             <div className="absolute bottom-8 left-8">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Lesson 01</p>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">The VC Mindset Handshake</h3>
             </div>
          </div>

          <div className="space-y-8">
             <h1 className="text-4xl font-black font-montserrat uppercase italic tracking-tighter">Mastering the <span className="text-cyan-500">VC Protocol.</span></h1>
             <p className="text-white/40 text-lg leading-relaxed font-medium italic">
                In this sprint, you will analyze the exact neural frameworks used by Tier-1 VCs to evaluate founding teams. We parse market intent and capital allocation strategies with zero fluff.
             </p>

             <div className="bg-white rounded-[40px] p-12 text-black shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center shadow-inner shrink-0">
                   <BrainCircuit className="w-10 h-10 text-cyan-600" />
                </div>
                <div className="flex-1">
                   <h3 className="text-2xl font-black font-montserrat uppercase italic tracking-tighter mb-4">Neural Evaluation</h3>
                   <p className="text-slate-400 text-sm font-medium italic mb-8">Hardware sync required. Do not switch tabs. System monitoring will be active during the 30-minute session.</p>
                   <button onClick={startExam} className="h-16 px-10 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                      Start Authorization <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. COURSES TAB
// ------------------------------------------------------------------
function CoursesTab() {
  return (
    <div className="space-y-12">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { title: 'Y-Combinator Application Masterclass', grad: 'from-cyan-500 to-blue-600', val: 'INCUBATION' },
            { title: 'Zero to One: SaaS Product Strategy', grad: 'from-orange-500 to-pink-600', val: 'PRODUCT' },
            { title: 'Financial Modeling for Pre-Seed Founders', grad: 'from-emerald-500 to-teal-600', val: 'FINANCE' },
          ].map((course, i) => (
            <div key={i} className="group bg-white rounded-[40px] p-1 shadow-2xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-500">
               <div className={`h-48 bg-gradient-to-tr ${course.grad} relative p-10 flex items-end overflow-hidden rounded-t-[39px]`}>
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[8px] font-black text-white border border-white/20 tracking-[0.2em]">
                     {course.val}
                  </div>
                  <Zap className="w-12 h-12 text-white/20 absolute -bottom-2 -right-2 rotate-12" />
               </div>
               <div className="p-10 flex flex-col flex-1 bg-white">
                  <h3 className="text-2xl font-black text-slate-900 font-montserrat uppercase italic tracking-tighter mb-6 group-hover:text-cyan-600 transition-colors leading-tight">{course.title}</h3>
                  <p className="text-slate-400 text-sm font-medium italic mb-10">Comprehensive blueprints and neural walkthroughs included.</p>
                  
                  <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest line-through mb-1">₹4,999</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">FREE</span>
                     </div>
                     <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white group-hover:bg-cyan-600 transition-all">
                        <ArrowRight className="w-6 h-6" />
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 4. KNOWLEDGE BASE TAB
// ------------------------------------------------------------------
function KnowledgeBaseTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
       <div className="relative group">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-cyan-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search the arsenal (Pitch Decks, Financials, Legal)..." 
            className="w-full h-24 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] pl-24 pr-10 text-lg font-black text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
          />
       </div>

       <div className="grid grid-cols-1 gap-6">
          {kbFiles.map(file => (
            <div key={file.id} className="group bg-white rounded-[2.5rem] p-8 flex items-center gap-8 shadow-2xl hover:shadow-cyan-900/10 transition-all border-b-4 border-slate-100">
               <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center group-hover:bg-cyan-50 transition-all">
                  <file.icon className="w-8 h-8 text-slate-400 group-hover:text-cyan-600 transition-all" />
               </div>
               <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 font-montserrat uppercase italic tracking-tighter group-hover:text-cyan-600 transition-colors">{file.title}</h3>
                  <p className="text-slate-400 text-sm font-medium italic mt-2">"{file.desc}"</p>
               </div>
               <button className="h-14 px-8 rounded-2xl bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-cyan-600 transition-all flex items-center gap-3">
                  <Download className="w-4 h-4" /> SECURE DL
               </button>
            </div>
          ))}
       </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 5. BLUEPRINT TAB
// ------------------------------------------------------------------
function BlueprintTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-20">
       <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-10 top-0 bottom-0 w-1.5 bg-white/[0.05] rounded-full" />
          
          <div className="space-y-16">
             {[
               { num: '01', title: 'The Genesis', status: 'COMPLETE', active: false },
               { num: '02', title: 'Market Neural Scan', status: 'IN PROGRESS', active: true },
               { num: '03', title: 'MVP Assembly', status: 'LOCKED', active: false },
               { num: '04', title: 'Capital Launch', status: 'LOCKED', active: false },
             ].map((step, i) => (
                <div key={i} className="relative pl-24 group">
                   <div className={`absolute left-[34px] top-4 w-5 h-5 rounded-full border-4 ${step.active ? 'bg-orange-500 border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-125' : 'bg-white/10 border-white/5'} z-10`} />
                   
                   <div className={`bg-white rounded-[3rem] p-12 text-black shadow-2xl relative overflow-hidden transition-all duration-500 ${!step.active && 'opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0'}`}>
                      <div className="flex justify-between items-start mb-6">
                         <h3 className="text-3xl font-black font-montserrat uppercase italic tracking-tighter">Step {step.num}: <br/>{step.title}</h3>
                         <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${step.active ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {step.status}
                         </span>
                      </div>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed italic mb-8">
                         Identify core neural problem, analyze market gaps via predictive engines, and synthesize a bare-bones thesis.
                      </p>
                      {step.active && (
                        <button className="h-16 px-10 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                           Enter Module <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
