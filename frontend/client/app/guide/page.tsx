"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, ShieldAlert, MonitorUp, Lock, CheckCircle,
  LayoutDashboard, GraduationCap, Library, Search, Map, 
  BookOpen, FileText, FileSpreadsheet, Download, Clock,
  ChevronRight, Circle, Play, CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter pb-20 pt-24">
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.name 
                  ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'Dashboard' && <DashboardTab />}
          {activeTab === 'Learning' && <LearningTab />}
          {activeTab === 'Courses' && <CoursesTab />}
          {activeTab === 'Knowledge Base' && <KnowledgeBaseTab />}
          {activeTab === 'Blueprint' && <BlueprintTab />}
        </motion.div>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-montserrat font-bold text-slate-900 mb-2">Welcome Back, Innovator</h1>
         <p className="text-slate-600">Track your module completion and upcoming tasks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex items-center gap-8">
            <div className="relative w-32 h-32 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-500" strokeDasharray="65, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold font-montserrat text-slate-800">45%</span>
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Progress</span>
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-800 mb-1">MVP Development</h3>
               <p className="text-sm text-slate-500 mb-4">You are currently in Module 4: High-Fidelity Prototyping.</p>
               <div className="flex gap-2">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors">Resume Lesson</button>
                  <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">View Curriculum</button>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="p-2 bg-white/20 rounded-lg"><Clock className="w-5 h-5" /></div>
               <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-md">Upcoming</span>
            </div>
            <div>
               <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider mb-1">Mentor Session</p>
               <h4 className="text-lg font-bold mb-4">Pitch Review w/ Arvind S.</h4>
               <p className="text-sm text-cyan-50">Tomorrow, 4:00 PM (GMT+5:30)</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                     <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600"><CheckCircle className="w-4 h-4" /></div>
                     <div>
                        <p className="text-sm font-bold text-slate-800">Completed "Customer Discovery"</p>
                        <p className="text-xs text-slate-500">2 days ago · Module 3</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Learning Goals</h3>
            <div className="space-y-5">
               {['Finalize Financial Model', 'Complete 10 User Interviews', 'Draft Investor Deck'].map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                     <div className="w-5 h-5 border-2 border-slate-200 rounded flex items-center justify-center"><CheckSquare className="w-3 h-3 text-cyan-500 opacity-0" /></div>
                     <span className="text-sm text-slate-600">{goal}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function LearningTab() {
  const modules = [
    { id: 1, title: 'Ideation & Problem Fit', status: 'Completed', lessons: 5, time: '2h 15m' },
    { id: 2, title: 'Market Size & Competition', status: 'Completed', lessons: 4, time: '1h 45m' },
    { id: 3, title: 'Customer Discovery', status: 'Completed', lessons: 8, time: '4h 20m' },
    { id: 4, title: 'MVP & Product Strategy', status: 'In Progress', lessons: 6, time: '3h 10m' },
    { id: 5, title: 'Financial Modeling', status: 'Locked', lessons: 4, time: '2h 00m' },
    { id: 6, title: 'Growth & GTM', status: 'Locked', lessons: 7, time: '3h 45m' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-montserrat font-bold text-slate-900 mb-2">Accelerator Curriculum</h1>
            <p className="text-slate-600">The structured path from idea to scalable venture.</p>
         </div>
         <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <MonitorUp className="w-4 h-4" /> Next Up: Product-Market Fit
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {modules.map((m) => (
            <div key={m.id} className={`p-6 rounded-2xl border transition-all ${m.status === 'Locked' ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200 hover:border-cyan-200 shadow-sm'}`}>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        m.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        m.status === 'In Progress' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-200 text-slate-500'
                     }`}>
                        {m.id}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           {m.title}
                           {m.status === 'Locked' && <Lock className="w-3 h-3" />}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                           <span>{m.lessons} Lessons</span>
                           <span>{m.time}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        m.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                        m.status === 'In Progress' ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                        {m.status}
                     </span>
                     {m.status !== 'Locked' && (
                        <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-cyan-600 transition-all">
                           <Play className="w-4 h-4 fill-white" />
                        </button>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function CoursesTab() {
  const masterclasses = [
    { id: 1, title: 'The Art of the Pitch', instructor: 'Arvind S.', duration: '45m', views: '1.2k', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Viral Loop Mechanics', instructor: 'Neha K.', duration: '1h 10m', views: '850', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Unit Economics Mastery', instructor: 'Rohan M.', duration: '55m', views: '2.1k', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' },
    { id: 4, title: 'SaaS Sales Playbook', instructor: 'Vikram D.', duration: '1h 25m', views: '640', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-montserrat font-bold text-slate-900 mb-2">Video Masterclasses</h1>
         <p className="text-slate-600">Learn from practitioners who have built multi-crore startups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {masterclasses.map((c) => (
            <div key={c.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-cyan-500/50 shadow-sm transition-all">
               <div className="relative aspect-video overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900"><PlayCircle className="w-10 h-10" /></div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">{c.duration}</div>
               </div>
               <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">{c.title}</h3>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                     <span>Instructor: {c.instructor}</span>
                     <span>{c.views} Students</span>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function KnowledgeBaseTab() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-montserrat font-bold text-slate-900 mb-2">Knowledge Base</h1>
            <p className="text-slate-600">Proprietary templates, legal drafts, and founder playbooks.</p>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search files..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-cyan-500 transition-all text-sm w-full md:w-64" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {kbFiles.map((file) => (
            <div key={file.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-cyan-300 shadow-sm transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-cyan-50 transition-colors">
                     <file.icon className="w-6 h-6 text-slate-600 group-hover:text-cyan-600" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-900 transition-colors"><Download className="w-5 h-5" /></button>
               </div>
               <h3 className="font-bold text-slate-800 mb-2">{file.title}</h3>
               <p className="text-xs text-slate-500 leading-relaxed mb-4">{file.desc}</p>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{file.type}</span>
                  <span className="text-cyan-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">Download Now <ChevronRight className="w-3 h-3" /></span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function BlueprintTab() {
  const roadmap = [
    { week: '1-2', task: 'Problem Validation', detail: 'Conduct 20 user interviews and map pain points.' },
    { week: '3-4', task: 'Market Opportunity', detail: 'TAM/SAM/SOM calculation and competitor matrix.' },
    { week: '5-8', task: 'MVP Prototype', detail: 'Wireframing and building a no-code MVP.' },
    { week: '9-12', task: 'Initial Traction', detail: 'Securing first 50 waitlist signups or 5 pilot customers.' },
    { week: '13-16', task: 'Fundraising Prep', detail: 'Finalizing pitch deck and financial model.' },
  ];

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-montserrat font-bold text-slate-900 mb-2">Startup Blueprint</h1>
         <p className="text-slate-600">Your personalized roadmap to a successful launch.</p>
      </div>

      <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
         {roadmap.map((step, idx) => (
            <div key={idx} className="relative">
               <div className="absolute -left-10 top-0 w-4 h-4 bg-white border-2 border-cyan-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
               </div>
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
                  <span className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-1 block">Week {step.week}</span>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{step.task}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.detail}</p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
